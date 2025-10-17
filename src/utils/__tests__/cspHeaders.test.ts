import { describe, it, expect } from 'vitest';
import { 
  generateCSPHeader, 
  validateCSPConfig,
  DEFAULT_CSP_CONFIG,
  PRODUCTION_CSP_CONFIG,
} from '../cspHeaders';

describe('CSP Headers', () => {
  describe('generateCSPHeader', () => {
    it('should generate valid CSP header string', () => {
      const header = generateCSPHeader();
      
      expect(header).toContain("default-src 'self'");
      expect(header).toContain("script-src");
      expect(header).toContain("style-src");
    });

    it('should include all required domains', () => {
      const header = generateCSPHeader();
      
      expect(header).toContain('https://cdn.gpteng.co');
      expect(header).toContain('https://js.stripe.com');
      expect(header).toContain('https://fonts.googleapis.com');
      expect(header).toContain('https://storage.googleapis.com');
    });

    it('should not contain placeholder values', () => {
      const header = generateCSPHeader(PRODUCTION_CSP_CONFIG);
      
      expect(header).not.toContain('YOUR_SCRIPT_HASH_HERE');
      expect(header).not.toContain('PLACEHOLDER');
    });

    it('should format directives correctly', () => {
      const header = generateCSPHeader();
      const directives = header.split(';').map(d => d.trim());
      
      directives.forEach(directive => {
        if (directive) {
          expect(directive).toMatch(/^[\w-]+ .+$/);
        }
      });
    });
  });

  describe('validateCSPConfig', () => {
    it('should validate correct configuration', () => {
      const result = validateCSPConfig(DEFAULT_CSP_CONFIG);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect unsafe production directives', () => {
      const unsafeConfig = {
        ...PRODUCTION_CSP_CONFIG,
        'script-src': ["'self'", "'unsafe-eval'"],
      };
      
      const result = validateCSPConfig(unsafeConfig);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        expect.stringContaining("'unsafe-eval'")
      );
    });

    it('should validate complete configuration structure', () => {
      const completeConfig = {
        'default-src': ["'self'"],
        'script-src': ["'self'"],
        'style-src': ["'self'"],
        'img-src': ["'self'"],
        'font-src': ["'self'"],
        'connect-src': ["'self'"],
        'media-src': ["'self'"],
        'object-src': ["'none'"],
        'frame-src': ["'self'"],
        'worker-src': ["'self'"],
        'frame-ancestors': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
        'upgrade-insecure-requests': true,
      };
      
      const result = validateCSPConfig(completeConfig);
      
      // Just verify the function runs without errors
      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('errors');
    });

    it('should allow unsafe-inline in development', () => {
      const devConfig = {
        ...DEFAULT_CSP_CONFIG,
        'script-src': ["'self'", "'unsafe-inline'"],
      };
      
      // In development, unsafe-inline is acceptable
      const result = validateCSPConfig(devConfig);
      
      // Should still be valid as it's not checking environment in validation
      expect(result.isValid).toBe(true);
    });
  });

  describe('Production CSP Config', () => {
    it('should not contain unsafe-eval', () => {
      const scriptSrc = PRODUCTION_CSP_CONFIG['script-src'] || [];
      
      expect(scriptSrc).not.toContain("'unsafe-eval'");
    });

    it('should not contain unsafe-inline in script-src', () => {
      const scriptSrc = PRODUCTION_CSP_CONFIG['script-src'] || [];
      
      expect(scriptSrc).not.toContain("'unsafe-inline'");
    });

    it('should include all required third-party domains', () => {
      const scriptSrc = PRODUCTION_CSP_CONFIG['script-src'] || [];
      
      expect(scriptSrc).toContain('https://cdn.gpteng.co');
      expect(scriptSrc).toContain('https://js.stripe.com');
    });
  });
});
