
export class InputSanitizer {
  /**
   * Sanitize text input to prevent XSS and other injection attacks
   */
  static sanitizeText(input: string, maxLength: number = 1000): string {
    if (typeof input !== 'string') {
      return '';
    }

    return input
      // Remove script tags
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Remove javascript: protocol
      .replace(/javascript:/gi, '')
      // Remove on* event handlers
      .replace(/\s*on\w+\s*=\s*"[^"]*"/gi, '')
      .replace(/\s*on\w+\s*=\s*'[^']*'/gi, '')
      // Remove data: URLs
      .replace(/data:\s*[^;]*;[^,]*,/gi, '')
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
    // Remove potential harmful patterns while preserving medical terminology
    return sanitized
      .replace(/\b(exec|eval|function)\s*\(/gi, '') // Remove function calls
      .replace(/[<>]/g, ''); // Remove angle brackets entirely for medical data
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Sanitize file upload input
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

    return null; // File is valid
  }

  /**
   * Rate limiting helper
   */
  static checkRateLimit(
    userId: string, 
    action: string, 
    maxAttempts: number, 
    windowMs: number
  ): boolean {
    const key = `rate_limit_${userId}_${action}`;
    const now = Date.now();
    
    const attempts = JSON.parse(localStorage.getItem(key) || '[]')
      .filter((timestamp: number) => now - timestamp < windowMs);
    
    if (attempts.length >= maxAttempts) {
      return false; // Rate limit exceeded
    }

    attempts.push(now);
    localStorage.setItem(key, JSON.stringify(attempts));
    
    return true; // Rate limit OK
  }
}
