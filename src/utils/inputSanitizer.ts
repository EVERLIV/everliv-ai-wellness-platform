
export class InputSanitizer {
  static sanitizeString(input: string | null | undefined): string {
    if (!input) return '';
    return input.toString().trim().slice(0, 1000); // Limit length to prevent abuse
  }

  static sanitizeText(input: string | null | undefined): string {
    if (!input) return '';
    // Basic text sanitization - remove script tags and dangerous content
    return input
      .toString()
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .slice(0, 1000);
  }

  static sanitizeEmail(email: string | null | undefined): string {
    if (!email) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sanitized = this.sanitizeString(email).toLowerCase();
    return emailRegex.test(sanitized) ? sanitized : '';
  }

  static isValidEmail(email: string | null | undefined): boolean {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  static isValidUUID(uuid: string | null | undefined): boolean {
    if (!uuid) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  static sanitizeNumber(input: number | string | null | undefined): number {
    if (typeof input === 'number' && !isNaN(input)) return input;
    if (typeof input === 'string') {
      const parsed = parseFloat(input);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }

  static sanitizeInteger(input: number | string | null | undefined): number {
    if (typeof input === 'number' && Number.isInteger(input)) return input;
    if (typeof input === 'string') {
      const parsed = parseInt(input, 10);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }

  static sanitizeMedicalData(data: any): any {
    if (!data || typeof data !== 'object') return {};
    
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeText(value);
      } else if (typeof value === 'number') {
        sanitized[key] = this.sanitizeNumber(value);
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map(item => 
          typeof item === 'string' ? this.sanitizeText(item) : item
        );
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  static validateFileUpload(file: File): { isValid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    
    if (file.size > maxSize) {
      return { isValid: false, error: 'File size exceeds 10MB limit' };
    }
    
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'File type not allowed' };
    }
    
    return { isValid: true };
  }

  static checkRateLimit(key: string, maxAttempts: number = 5, windowMs: number = 300000): boolean {
    // Simple rate limiting using localStorage (for client-side)
    const now = Date.now();
    const attempts = JSON.parse(localStorage.getItem(`rateLimit_${key}`) || '[]');
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter((timestamp: number) => now - timestamp < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      return false; // Rate limit exceeded
    }
    
    // Add current attempt
    validAttempts.push(now);
    localStorage.setItem(`rateLimit_${key}`, JSON.stringify(validAttempts));
    
    return true; // Allow the action
  }
}
