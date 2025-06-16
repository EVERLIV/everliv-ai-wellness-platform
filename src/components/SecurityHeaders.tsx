
import { useEffect } from 'react';

const SecurityHeaders = () => {
  useEffect(() => {
    // Add security headers via meta tags (limited effectiveness, but better than nothing)
    const addMetaTag = (name: string, content: string) => {
      const existing = document.querySelector(`meta[name="${name}"]`);
      if (existing) {
        existing.setAttribute('content', content);
      } else {
        const meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    // Enhanced Content Security Policy
    addMetaTag('Content-Security-Policy', 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.gpteng.co; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https: blob:; " +
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co; " +
      "font-src 'self' data: https://fonts.googleapis.com https://fonts.gstatic.com; " +
      "frame-ancestors 'none'; " +
      "base-uri 'self'; " +
      "form-action 'self';"
    );

    // X-Frame-Options
    addMetaTag('X-Frame-Options', 'DENY');

    // X-Content-Type-Options
    addMetaTag('X-Content-Type-Options', 'nosniff');

    // Referrer Policy
    addMetaTag('referrer', 'strict-origin-when-cross-origin');

    // Permissions Policy
    addMetaTag('Permissions-Policy', 
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=()');

    // X-XSS-Protection (for older browsers)
    addMetaTag('X-XSS-Protection', '1; mode=block');

    // Strict Transport Security (HSTS) - only add if HTTPS
    if (window.location.protocol === 'https:') {
      addMetaTag('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    return () => {
      // Cleanup is not necessary for meta tags as they should persist
    };
  }, []);

  return null; // This component doesn't render anything
};

export default SecurityHeaders;
