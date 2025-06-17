
export class InputSanitizer {
  /**
   * Sanitize text input to prevent XSS and other injection attacks
   */
  static sanitizeText(input: string, maxLength: number = 1000): string {
    if (typeof input !== 'string') {
      return '';
    }

    return input
      // Remove script tags and any variations
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
      // Remove javascript: protocol and data: URLs
      .replace(/javascript:/gi, '')
      .replace(/data:\s*[^;]*;[^,]*,/gi, '')
      .replace(/vbscript:/gi, '')
      // Remove on* event handlers more comprehensively
      .replace(/\s*on\w+\s*=\s*"[^"]*"/gi, '')
      .replace(/\s*on\w+\s*=\s*'[^']*'/gi, '')
      .replace(/\s*on\w+\s*=\s*[^>\s]+/gi, '')
      // Remove style attributes that could contain expressions
      .replace(/style\s*=\s*"[^"]*"/gi, '')
      .replace(/style\s*=\s*'[^']*'/gi, '')
      // Trim and limit length
      .trim()
      .substring(0, maxLength);
  }

  /**
   * Sanitize medical data input with specific medical context rules
   */
  static sanitizeMedicalData(input: string): string {
    const sanitized = this.sanitizeText(input, 10000);
    
    // Additional medical data specific sanitization
    return sanitized
      .replace(/\b(exec|eval|function|constructor|prototype)\s*\(/gi, '') // Remove function calls
      .replace(/[<>]/g, '') // Remove angle brackets entirely for medical data
      .replace(/\${.*}/g, '') // Remove template literals
      .replace(/\\\w+/g, ''); // Remove escape sequences
  }

  /**
   * Validate email format with strict rules
   */
  static isValidEmail(email: string): boolean {
    if (!email || email.length > 254) return false;
    
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  }

  /**
   * Validate file upload input with enhanced security
   */
  static validateFileUpload(file: File, allowedTypes: string[], maxSize: number): string | null {
    if (!file) {
      return 'No file provided';
    }

    if (file.size > maxSize) {
      return `File size exceeds ${maxSize / (1024 * 1024)}MB limit`;
    }

    if (!allowedTypes.includes(file.type)) {
      return `File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(', ')}`;
    }

    // Check file extension as well
    const extension = file.name.toLowerCase().split('.').pop();
    const allowedExtensions = allowedTypes.map(type => type.split('/')[1]);
    
    if (extension && !allowedExtensions.includes(extension)) {
      return `File extension .${extension} not allowed`;
    }

    // Additional security checks
    if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
      return 'Invalid file name';
    }

    if (file.name.length > 255) {
      return 'File name too long';
    }

    return null; // File is valid
  }

  /**
   * Enhanced rate limiting with server-side validation preparation
   */
  static checkRateLimit(
    userId: string, 
    action: string, 
    maxAttempts: number, 
    windowMs: number
  ): boolean {
    const key = `rate_limit_${this.sanitizeText(userId, 50)}_${this.sanitizeText(action, 50)}`;
    const now = Date.now();
    
    try {
      const attempts = JSON.parse(localStorage.getItem(key) || '[]')
        .filter((timestamp: number) => now - timestamp < windowMs);
      
      if (attempts.length >= maxAttempts) {
        console.warn(`Rate limit exceeded for user ${userId} action ${action}`);
        return false; // Rate limit exceeded
      }

      attempts.push(now);
      localStorage.setItem(key, JSON.stringify(attempts));
      
      return true; // Rate limit OK
    } catch (error) {
      console.error('Rate limiting error:', error);
      return false; // Fail closed for security
    }
  }

  /**
   * Validate UUID format
   */
  static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Sanitize JSON input
   */
  static sanitizeJSON(input: any): any {
    if (typeof input === 'string') {
      return this.sanitizeText(input);
    }
    
    if (Array.isArray(input)) {
      return input.map(item => this.sanitizeJSON(item));
    }
    
    if (typeof input === 'object' && input !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(input)) {
        const sanitizedKey = this.sanitizeText(key, 100);
        sanitized[sanitizedKey] = this.sanitizeJSON(value);
      }
      return sanitized;
    }
    
    return input;
  }
}
