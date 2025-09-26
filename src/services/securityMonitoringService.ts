/**
 * Security Monitoring Service
 * Provides real-time security monitoring, threat detection, and automated alerts
 */

import { supabase } from "@/integrations/supabase/client";
import { logSecurityEvent, ClientRateLimit } from "@/utils/securityUtils";

export interface SecurityAlert {
  type: 'failed_auth' | 'rate_limit' | 'suspicious_activity' | 'data_breach' | 'security_scan';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  metadata: Record<string, any>;
  timestamp: Date;
}

export interface SecurityMetrics {
  failedLoginAttempts: number;
  suspiciousActivities: number;
  blockedRequests: number;
  securityAlertsCount: number;
  lastSecurityScan?: Date;
}

class SecurityMonitoringService {
  private rateLimiters: Map<string, ClientRateLimit> = new Map();
  private securityAlerts: SecurityAlert[] = [];
  private readonly MAX_ALERTS = 100; // Keep last 100 alerts in memory

  /**
   * Initialize security monitoring for a user session
   */
  async initializeMonitoring(userId: string): Promise<void> {
    // Set up rate limiter for this user
    if (!this.rateLimiters.has(userId)) {
      this.rateLimiters.set(userId, new ClientRateLimit(30, 60000)); // 30 requests per minute
    }

    // Log initialization
    await this.logAuditEvent({
      action: 'security_monitoring_initialized',
      userId,
      resourceType: 'security_session',
      metadata: { timestamp: new Date().toISOString() }
    });
  }

  /**
   * Monitor authentication attempts and detect suspicious patterns
   */
  async monitorAuthAttempt(email: string, success: boolean, userAgent?: string): Promise<void> {
    const identifier = `auth:${email}`;
    
    if (!success) {
      // Check for brute force attempts
      const rateLimiter = this.rateLimiters.get(identifier) || new ClientRateLimit(5, 300000); // 5 attempts per 5 minutes
      this.rateLimiters.set(identifier, rateLimiter);

      if (!rateLimiter.isAllowed(identifier)) {
        await this.createSecurityAlert({
          type: 'failed_auth',
          severity: 'high',
          description: `Multiple failed login attempts detected for ${email}`,
          metadata: {
            email,
            userAgent,
            attemptCount: 5,
            timeWindow: '5 minutes'
          },
          timestamp: new Date()
        });

        logSecurityEvent({
          type: 'rate_limit_exceeded',
          details: `Authentication rate limit exceeded for ${email}`,
          userAgent
        });
      }
    } else {
      // Reset rate limiter on successful login
      this.rateLimiters.delete(identifier);
    }

    // Log the attempt
    await this.logAuditEvent({
      action: success ? 'login_success' : 'login_failed',
      userId: success ? email : undefined,
      resourceType: 'authentication',
      metadata: {
        email,
        userAgent,
        success,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Monitor API usage and detect unusual patterns
   */
  async monitorApiUsage(userId: string, endpoint: string, userAgent?: string): Promise<boolean> {
    const identifier = `api:${userId}:${endpoint}`;
    const rateLimiter = this.rateLimiters.get(identifier) || new ClientRateLimit(100, 60000); // 100 requests per minute per endpoint
    this.rateLimiters.set(identifier, rateLimiter);

    if (!rateLimiter.isAllowed(identifier)) {
      await this.createSecurityAlert({
        type: 'rate_limit',
        severity: 'medium',
        description: `API rate limit exceeded for user ${userId} on endpoint ${endpoint}`,
        metadata: {
          userId,
          endpoint,
          userAgent,
          limit: 100,
          timeWindow: '1 minute'
        },
        timestamp: new Date()
      });

      logSecurityEvent({
        type: 'rate_limit_exceeded',
        details: `API rate limit exceeded: ${endpoint}`,
        userAgent
      });

      return false; // Block the request
    }

    return true; // Allow the request
  }

  /**
   * Detect and report suspicious user behavior
   */
  async detectSuspiciousActivity(userId: string, activity: {
    type: string;
    metadata: Record<string, any>;
    userAgent?: string;
  }): Promise<void> {
    const suspiciousPatterns = [
      // Multiple rapid account changes
      { pattern: /profile_update|password_change|email_change/, threshold: 5, window: 300000 }, // 5 changes in 5 minutes
      // Unusual data access patterns
      { pattern: /data_export|bulk_download/, threshold: 3, window: 3600000 }, // 3 exports in 1 hour
      // Security-related actions
      { pattern: /security_settings|two_factor|api_key/, threshold: 10, window: 300000 } // 10 security actions in 5 minutes
    ];

    for (const { pattern, threshold, window } of suspiciousPatterns) {
      if (pattern.test(activity.type)) {
        const identifier = `suspicious:${userId}:${activity.type}`;
        const rateLimiter = this.rateLimiters.get(identifier) || new ClientRateLimit(threshold, window);
        this.rateLimiters.set(identifier, rateLimiter);

        if (!rateLimiter.isAllowed(identifier)) {
          await this.createSecurityAlert({
            type: 'suspicious_activity',
            severity: 'high',
            description: `Suspicious activity pattern detected for user ${userId}: ${activity.type}`,
            metadata: {
              userId,
              activityType: activity.type,
              activityMetadata: activity.metadata,
              userAgent: activity.userAgent,
              threshold,
              timeWindow: `${window / 1000} seconds`
            },
            timestamp: new Date()
          });

          logSecurityEvent({
            type: 'suspicious_activity',
            details: `Suspicious activity: ${activity.type}`,
            userAgent: activity.userAgent
          });
        }
      }
    }
  }

  /**
   * Get current security metrics
   */
  getSecurityMetrics(): SecurityMetrics {
    const now = Date.now();
    const last24Hours = now - (24 * 60 * 60 * 1000);

    const recentAlerts = this.securityAlerts.filter(alert => 
      alert.timestamp.getTime() > last24Hours
    );

    return {
      failedLoginAttempts: recentAlerts.filter(alert => alert.type === 'failed_auth').length,
      suspiciousActivities: recentAlerts.filter(alert => alert.type === 'suspicious_activity').length,
      blockedRequests: recentAlerts.filter(alert => alert.type === 'rate_limit').length,
      securityAlertsCount: recentAlerts.length,
      lastSecurityScan: this.getLastSecurityScan()
    };
  }

  /**
   * Create and store a security alert
   */
  private async createSecurityAlert(alert: SecurityAlert): Promise<void> {
    // Add to in-memory storage
    this.securityAlerts.push(alert);
    
    // Keep only the latest alerts
    if (this.securityAlerts.length > this.MAX_ALERTS) {
      this.securityAlerts = this.securityAlerts.slice(-this.MAX_ALERTS);
    }

    // Log to audit system
    await this.logAuditEvent({
      action: 'security_alert_generated',
      resourceType: 'security_alert',
      metadata: {
        alertType: alert.type,
        severity: alert.severity,
        description: alert.description,
        alertMetadata: alert.metadata
      }
    });

    // In a production system, you would also:
    // 1. Send alerts to monitoring systems (Sentry, DataDog, etc.)
    // 2. Notify security team via email/Slack
    // 3. Trigger automated response procedures
    console.warn('🚨 Security Alert:', alert);
  }

  /**
   * Log security audit events to Supabase
   */
  private async logAuditEvent(event: {
    action: string;
    userId?: string;
    resourceType?: string;
    resourceId?: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    try {
      await supabase.functions.invoke('security-audit', {
        body: {
          action: event.action,
          user_id: event.userId,
          resource_type: event.resourceType,
          resource_id: event.resourceId,
          metadata: event.metadata
        }
      });
    } catch (error) {
      console.error('Failed to log audit event:', error);
    }
  }

  /**
   * Get the timestamp of the last security scan
   */
  private getLastSecurityScan(): Date | undefined {
    const lastScan = this.securityAlerts
      .filter(alert => alert.type === 'security_scan')
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
    
    return lastScan?.timestamp;
  }

  /**
   * Run automated security checks
   */
  async runSecurityScan(): Promise<SecurityAlert[]> {
    const alerts: SecurityAlert[] = [];
    
    try {
      // Check for common security issues
      const checks = [
        this.checkSessionSecurity(),
        this.checkDataAccess(),
        this.checkAPIUsage()
      ];

      const results = await Promise.all(checks);
      results.forEach(result => {
        if (result) alerts.push(result);
      });

      // Log the security scan
      await this.createSecurityAlert({
        type: 'security_scan',
        severity: 'low',
        description: 'Automated security scan completed',
        metadata: {
          checksPerformed: checks.length,
          issuesFound: alerts.length,
          scanDuration: 'automated'
        },
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Security scan failed:', error);
      alerts.push({
        type: 'security_scan',
        severity: 'medium',
        description: 'Security scan failed to complete',
        metadata: { error: String(error) },
        timestamp: new Date()
      });
    }

    return alerts;
  }

  private async checkSessionSecurity(): Promise<SecurityAlert | null> {
    // Check for session-related security issues
    if (typeof window !== 'undefined') {
      const sessionData = sessionStorage.getItem('supabase.auth.token');
      if (sessionData) {
        try {
          const parsed = JSON.parse(sessionData);
          const expiresAt = new Date(parsed.expires_at * 1000);
          const now = new Date();
          
          if (expiresAt < now) {
            return {
              type: 'suspicious_activity',
              severity: 'medium',
              description: 'Expired authentication token detected',
              metadata: { expiredAt: expiresAt.toISOString() },
              timestamp: new Date()
            };
          }
        } catch (error) {
          return {
            type: 'suspicious_activity',
            severity: 'low',
            description: 'Invalid authentication token format detected',
            metadata: { error: String(error) },
            timestamp: new Date()
          };
        }
      }
    }
    return null;
  }

  private async checkDataAccess(): Promise<SecurityAlert | null> {
    // Check for unusual data access patterns
    const metrics = this.getSecurityMetrics();
    
    if (metrics.suspiciousActivities > 10) {
      return {
        type: 'suspicious_activity',
        severity: 'high',
        description: 'High number of suspicious activities detected',
        metadata: { count: metrics.suspiciousActivities },
        timestamp: new Date()
      };
    }
    
    return null;
  }

  private async checkAPIUsage(): Promise<SecurityAlert | null> {
    // Check for unusual API usage patterns
    const metrics = this.getSecurityMetrics();
    
    if (metrics.blockedRequests > 50) {
      return {
        type: 'rate_limit',
        severity: 'medium',
        description: 'High number of blocked requests detected',
        metadata: { count: metrics.blockedRequests },
        timestamp: new Date()
      };
    }
    
    return null;
  }
}

export const securityMonitoringService = new SecurityMonitoringService();

// Auto-run security scans every 30 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    securityMonitoringService.runSecurityScan();
  }, 30 * 60 * 1000);
}
