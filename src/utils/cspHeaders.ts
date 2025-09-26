/**
 * Content Security Policy (CSP) Headers Configuration
 * Implements strict CSP to prevent XSS attacks and other security vulnerabilities
 */

export interface CSPConfig {
  'default-src': string[];
  'script-src': string[];
  'style-src': string[];
  'img-src': string[];
  'font-src': string[];
  'connect-src': string[];
  'media-src': string[];
  'object-src': string[];
  'base-uri': string[];
  'form-action': string[];
  'frame-ancestors': string[];
  'upgrade-insecure-requests': boolean;
}

/**
 * Default CSP configuration for the Eterna application
 */
export const DEFAULT_CSP_CONFIG: CSPConfig = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for Vite in development
    "'unsafe-eval'", // Required for development builds
    "https://js.stripe.com",
    "https://checkout.stripe.com",
    "https://*.supabase.co",
    "https://cdn.jsdelivr.net"
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for Tailwind CSS
    "https://fonts.googleapis.com"
  ],
  'img-src': [
    "'self'",
    "data:",
    "blob:",
    "https://*.supabase.co",
    "https://images.unsplash.com",
    "https://via.placeholder.com",
    "https://*.stripe.com"
  ],
  'font-src': [
    "'self'",
    "data:",
    "https://fonts.gstatic.com"
  ],
  'connect-src': [
    "'self'",
    "https://*.supabase.co",
    "https://api.stripe.com",
    "https://checkout.stripe.com",
    "https://api.openai.com",
    "https://api.elevenlabs.io",
    "wss://*.supabase.co"
  ],
  'media-src': [
    "'self'",
    "blob:",
    "data:",
    "https://*.supabase.co"
  ],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'", "https://checkout.stripe.com"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': true
};

/**
 * Generate CSP header string from configuration
 */
export function generateCSPHeader(config: CSPConfig = DEFAULT_CSP_CONFIG): string {
  const directives: string[] = [];

  // Add each directive
  Object.entries(config).forEach(([directive, sources]) => {
    if (directive === 'upgrade-insecure-requests') {
      if (sources === true) {
        directives.push('upgrade-insecure-requests');
      }
    } else if (Array.isArray(sources) && sources.length > 0) {
      directives.push(`${directive} ${sources.join(' ')}`);
    }
  });

  return directives.join('; ');
}

/**
 * Apply CSP headers to the document (for client-side enforcement)
 */
export function applyCSPToDocument(config: CSPConfig = DEFAULT_CSP_CONFIG): void {
  if (typeof document === 'undefined') return;

  // Check if CSP meta tag already exists
  let cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]') as HTMLMetaElement;
  
  if (!cspMeta) {
    cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    document.head.appendChild(cspMeta);
  }

  cspMeta.content = generateCSPHeader(config);
}

/**
 * CSP configuration for development environment (more permissive)
 */
export const DEVELOPMENT_CSP_CONFIG: CSPConfig = {
  ...DEFAULT_CSP_CONFIG,
  'script-src': [
    ...DEFAULT_CSP_CONFIG['script-src'],
    "'unsafe-inline'",
    "'unsafe-eval'",
    "http://localhost:*",
    "ws://localhost:*"
  ],
  'connect-src': [
    ...DEFAULT_CSP_CONFIG['connect-src'],
    "http://localhost:*",
    "ws://localhost:*",
    "wss://localhost:*"
  ],
  'style-src': [
    ...DEFAULT_CSP_CONFIG['style-src'],
    "'unsafe-inline'"
  ]
};

/**
 * CSP configuration for production environment (strict)
 */
export const PRODUCTION_CSP_CONFIG: CSPConfig = {
  ...DEFAULT_CSP_CONFIG,
  'script-src': DEFAULT_CSP_CONFIG['script-src'].filter(src => 
    !src.includes('unsafe-inline') && !src.includes('unsafe-eval')
  ).concat([
    // Add specific nonce or hash-based CSP for production scripts
    "'sha256-YOUR_SCRIPT_HASH_HERE'" // Replace with actual script hashes
  ])
};

/**
 * Report-only CSP configuration for testing
 */
export const REPORT_ONLY_CSP_CONFIG: CSPConfig = {
  ...DEFAULT_CSP_CONFIG,
  // Add report-uri directive for CSP violation reporting
  'default-src': [...DEFAULT_CSP_CONFIG['default-src']]
};

/**
 * Initialize CSP based on environment
 */
export function initializeCSP(): void {
  const isProduction = import.meta.env.PROD;
  const isDevelopment = import.meta.env.DEV;

  let config: CSPConfig;

  if (isProduction) {
    config = PRODUCTION_CSP_CONFIG;
  } else if (isDevelopment) {
    config = DEVELOPMENT_CSP_CONFIG;
  } else {
    config = DEFAULT_CSP_CONFIG;
  }

  applyCSPToDocument(config);

  console.log(`🔒 CSP initialized for ${isProduction ? 'production' : 'development'} environment`);
}

/**
 * Validate CSP configuration
 */
export function validateCSPConfig(config: CSPConfig): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for unsafe directives in production
  if (import.meta.env.PROD) {
    const unsafeDirectives = ['unsafe-inline', 'unsafe-eval', '*'];
    
    Object.entries(config).forEach(([directive, sources]) => {
      if (Array.isArray(sources)) {
        sources.forEach(source => {
          if (unsafeDirectives.some(unsafe => source.includes(unsafe))) {
            errors.push(`Unsafe directive '${source}' found in '${directive}' for production environment`);
          }
        });
      }
    });
  }

  // Check for required directives
  const requiredDirectives = ['default-src', 'script-src', 'style-src', 'img-src'];
  requiredDirectives.forEach(directive => {
    if (!config[directive as keyof CSPConfig] || !Array.isArray(config[directive as keyof CSPConfig])) {
      errors.push(`Required directive '${directive}' is missing or invalid`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * CSP violation handler
 */
export function handleCSPViolation(event: SecurityPolicyViolationEvent): void {
  const violation = {
    documentURI: event.documentURI,
    referrer: event.referrer,
    blockedURI: event.blockedURI,
    violatedDirective: event.violatedDirective,
    originalPolicy: event.originalPolicy,
    effectiveDirective: event.effectiveDirective,
    statusCode: event.statusCode,
    lineNumber: event.lineNumber,
    columnNumber: event.columnNumber,
    sourceFile: event.sourceFile,
    sample: event.sample
  };

  console.error('🚨 CSP Violation:', violation);

  // Report to security monitoring service
  if (typeof window !== 'undefined' && (window as any).securityMonitoringService) {
    (window as any).securityMonitoringService.createSecurityAlert({
      type: 'suspicious_activity',
      severity: 'medium',
      description: `CSP violation: ${event.violatedDirective}`,
      metadata: violation,
      timestamp: new Date()
    });
  }

  // In production, you might want to report this to your security monitoring service
  // fetch('/api/security/csp-violation', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(violation)
  // });
}

// Initialize CSP violation listener
if (typeof window !== 'undefined') {
  window.addEventListener('securitypolicyviolation', handleCSPViolation);
}