import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SecurityAuditRequest {
  action: string;
  resource_type?: string;
  resource_id?: string;
  metadata?: Record<string, any>;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Verify the JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid or expired token');
    }

    const auditData: SecurityAuditRequest = await req.json();

    // Validate required fields
    if (!auditData.action) {
      throw new Error('Action is required');
    }

    // Get client IP and user agent
    const clientIP = req.headers.get('X-Forwarded-For') || 
                    req.headers.get('X-Real-IP') || 
                    'unknown';
    
    const userAgent = req.headers.get('User-Agent') || 'unknown';

    // Enhanced audit logging with security context
    const auditEntry = {
      user_id: user.id,
      action: auditData.action,
      resource_type: auditData.resource_type || 'security_event',
      resource_id: auditData.resource_id,
      metadata: {
        ...auditData.metadata,
        severity: auditData.severity || 'low',
        client_ip: clientIP,
        user_agent: userAgent,
        timestamp: new Date().toISOString(),
        session_info: {
          browser: userAgent.includes('Chrome') ? 'Chrome' : 
                  userAgent.includes('Firefox') ? 'Firefox' :
                  userAgent.includes('Safari') ? 'Safari' : 'Unknown',
          is_mobile: /Mobile|Android|iPhone|iPad/.test(userAgent),
        }
      },
      ip_address: clientIP,
    };

    // Insert audit log
    const { data: auditLog, error: auditError } = await supabase
      .from('audit_logs')
      .insert(auditEntry)
      .select()
      .single();

    if (auditError) {
      console.error('Error creating audit log:', auditError);
      throw new Error('Failed to create audit log');
    }

    // Check for suspicious patterns and alert if necessary
    await checkSuspiciousActivity(supabase, user.id, auditData, clientIP);

    return new Response(JSON.stringify({
      success: true,
      audit_id: auditLog.id,
      message: 'Security audit logged successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in security-audit function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Security audit failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

/**
 * Check for suspicious activity patterns
 */
async function checkSuspiciousActivity(
  supabase: any, 
  userId: string, 
  auditData: SecurityAuditRequest, 
  clientIP: string
) {
  try {
    // Check for multiple failed authentication attempts
    if (auditData.action === 'auth_failed') {
      const { data: recentFailures } = await supabase
        .from('audit_logs')
        .select('created_at')
        .eq('user_id', userId)
        .eq('action', 'auth_failed')
        .gte('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString()) // Last 15 minutes
        .order('created_at', { ascending: false });

      if (recentFailures && recentFailures.length >= 5) {
        await createSecurityAlert(supabase, userId, 'multiple_failed_auth', {
          failure_count: recentFailures.length,
          client_ip: clientIP,
          timeframe: '15_minutes'
        });
      }
    }

    // Check for suspicious IP patterns
    const { data: recentIPs } = await supabase
      .from('audit_logs')
      .select('ip_address, created_at')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
      .order('created_at', { ascending: false })
      .limit(10);

    if (recentIPs && recentIPs.length > 0) {
      const uniqueIPs = new Set(recentIPs.map(log => log.ip_address));
      
      // Alert if user is accessing from many different IPs
      if (uniqueIPs.size >= 5) {
        await createSecurityAlert(supabase, userId, 'multiple_ip_access', {
          unique_ips: Array.from(uniqueIPs),
          access_count: recentIPs.length,
          timeframe: '24_hours'
        });
      }
    }

    // Check for rapid API calls (potential abuse)
    const { data: recentCalls } = await supabase
      .from('audit_logs')
      .select('created_at')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Last 5 minutes
      .order('created_at', { ascending: false });

    if (recentCalls && recentCalls.length >= 100) {
      await createSecurityAlert(supabase, userId, 'rapid_api_calls', {
        call_count: recentCalls.length,
        timeframe: '5_minutes',
        potential_abuse: true
      });
    }

  } catch (error) {
    console.error('Error checking suspicious activity:', error);
    // Don't throw - this is just monitoring
  }
}

/**
 * Create a security alert for admin attention
 */
async function createSecurityAlert(
  supabase: any,
  userId: string,
  alertType: string,
  details: Record<string, any>
) {
  try {
    await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        action: 'security_alert_generated',
        resource_type: 'security_system',
        metadata: {
          alert_type: alertType,
          severity: 'high',
          details,
          requires_admin_attention: true,
          timestamp: new Date().toISOString()
        }
      });

    console.warn(`🚨 Security Alert Generated: ${alertType} for user ${userId}`, details);
    
    // In production, you might want to:
    // - Send email alerts to security team
    // - Integrate with Slack/Discord webhooks
    // - Create tickets in your support system
    // - Trigger additional security measures

  } catch (error) {
    console.error('Error creating security alert:', error);
  }
}