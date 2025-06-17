
// Security headers and XSS protection utilities
export class SecurityHeaders {
  // Content Security Policy helpers
  static getCSPHeaders(): Record<string, string> {
    return {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Required for React
        "style-src 'self' 'unsafe-inline'", // Required for Tailwind
        "img-src 'self' data: https: blob:",
        "font-src 'self' data:",
        "connect-src 'self' https://dajowxmdmnsvckdkugmd.supabase.co",
        "media-src 'self' blob:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'"
      ].join('; '),
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    };
  }

  // Rate limiting for client-side actions
  static checkClientRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const stored = localStorage.getItem(`rate_limit_${key}`);
    
    if (!stored) {
      localStorage.setItem(`rate_limit_${key}`, JSON.stringify({ count: 1, resetTime: now + windowMs }));
      return true;
    }

    const { count, resetTime } = JSON.parse(stored);
    
    if (now > resetTime) {
      localStorage.setItem(`rate_limit_${key}`, JSON.stringify({ count: 1, resetTime: now + windowMs }));
      return true;
    }

    if (count >= maxRequests) {
      return false;
    }

    localStorage.setItem(`rate_limit_${key}`, JSON.stringify({ count: count + 1, resetTime }));
    return true;
  }
}
