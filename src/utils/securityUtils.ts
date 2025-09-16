/**
 * Security utilities for the Eterna application
 * Provides input validation, sanitization, and security monitoring
 */

// Content validation patterns
export const SECURITY_PATTERNS = {
  // Common XSS attack patterns
  XSS: /<script|javascript:|data:text\/html|on\w+\s*=/i,
  
  // SQL injection patterns (for client-side validation)
  SQL_INJECTION: /('|('')|;|--|\/\*|\*\/|union|select|insert|update|delete|drop|create|alter|exec|execute)/i,
  
  // Path traversal patterns
  PATH_TRAVERSAL: /\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e%5c/i,
  
  // Email validation (RFC compliant)
  EMAIL: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  
  // Strong password requirements
  STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/,
};

// Input length limits for security
export const INPUT_LIMITS = {
  EMAIL: 254,
  PASSWORD: 128,
  NAME: 100,
  MESSAGE: 2000,
  DESCRIPTION: 1000,
  URL: 2048,
  PHONE: 20,
} as const;

/**
 * Validates and sanitizes user input
 */
export function sanitizeInput(input: string, type: 'text' | 'email' | 'url' = 'text'): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove null bytes and control characters
  let sanitized = input.replace(/[\x00-\x1F\x7F]/g, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Type-specific sanitization
  switch (type) {
    case 'email':
      // Remove anything that's not a valid email character
      sanitized = sanitized.replace(/[^a-zA-Z0-9.!#$%&'*+/=?^_`{|}~@-]/g, '');
      break;
    case 'url':
      // Basic URL sanitization
      sanitized = encodeURI(sanitized);
      break;
    default:
      // Remove potential script tags and javascript protocols
      sanitized = sanitized.replace(SECURITY_PATTERNS.XSS, '');
  }
  
  return sanitized;
}

/**
 * Validates input against security patterns
 */
export function validateInput(input: string, maxLength?: number): {
  isValid: boolean;
  error?: string;
} {
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: 'Input is required' };
  }

  // Check length limits
  if (maxLength && input.length > maxLength) {
    return { isValid: false, error: `Input exceeds maximum length of ${maxLength} characters` };
  }

  // Check for malicious patterns
  if (SECURITY_PATTERNS.XSS.test(input)) {
    return { isValid: false, error: 'Input contains potentially malicious content' };
  }

  if (SECURITY_PATTERNS.SQL_INJECTION.test(input)) {
    return { isValid: false, error: 'Input contains potentially malicious content' };
  }

  if (SECURITY_PATTERNS.PATH_TRAVERSAL.test(input)) {
    return { isValid: false, error: 'Input contains potentially malicious content' };
  }

  return { isValid: true };
}

/**
 * Validates email format and security
 */
export function validateEmail(email: string): {
  isValid: boolean;
  error?: string;
} {
  const sanitized = sanitizeInput(email, 'email');
  
  if (sanitized.length > INPUT_LIMITS.EMAIL) {
    return { isValid: false, error: 'Email address is too long' };
  }

  if (!SECURITY_PATTERNS.EMAIL.test(sanitized)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  return { isValid: true };
}

/**
 * Validates password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  error?: string;
  strength: 'weak' | 'medium' | 'strong';
} {
  if (!password || password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long', strength: 'weak' };
  }

  if (password.length > INPUT_LIMITS.PASSWORD) {
    return { isValid: false, error: 'Password is too long', strength: 'weak' };
  }

  // Check for strong password pattern
  if (SECURITY_PATTERNS.STRONG_PASSWORD.test(password)) {
    return { isValid: true, strength: 'strong' };
  }

  // Check for medium strength (at least one letter and one number)
  if (/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(password)) {
    return { isValid: true, strength: 'medium' };
  }

  return { isValid: false, error: 'Password is too weak. Use at least 8 characters with letters and numbers.', strength: 'weak' };
}

/**
 * Rate limiting helper for client-side checks
 */
export class ClientRateLimit {
  private attempts: Map<string, number[]> = new Map();
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 60000 // 1 minute
  ) {}

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the time window
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }

    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);
    
    return true;
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

/**
 * Security event logger for monitoring
 */
export function logSecurityEvent(event: {
  type: 'validation_failed' | 'rate_limit_exceeded' | 'suspicious_activity';
  details: string;
  userAgent?: string;
  timestamp?: Date;
}) {
  const logData = {
    ...event,
    timestamp: event.timestamp || new Date(),
    userAgent: event.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'),
  };

  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.warn('🔒 Security Event:', logData);
  }

  // In production, you might want to send this to your monitoring service
  // Example: Send to Supabase audit logs, Sentry, or another monitoring service
}

/**
 * Content Security Policy violation reporter
 */
export function reportCSPViolation(violation: SecurityPolicyViolationEvent) {
  logSecurityEvent({
    type: 'suspicious_activity',
    details: `CSP Violation: ${violation.violatedDirective} - ${violation.blockedURI}`,
  });

  // Report to your security monitoring service
  console.error('CSP Violation:', {
    directive: violation.violatedDirective,
    blocked: violation.blockedURI,
    original: violation.originalPolicy,
  });
}

// Set up CSP violation listener
if (typeof window !== 'undefined') {
  window.addEventListener('securitypolicyviolation', reportCSPViolation);
}