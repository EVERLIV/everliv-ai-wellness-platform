
export class InputSanitizer {
  private static readonly MAX_INPUT_LENGTH = 10000;
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  private static readonly RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
  private static readonly MAX_REQUESTS_PER_WINDOW = 100;

  /**
   * Sanitize text input to prevent XSS and other injection attacks
   */
  static sanitizeText(input: string, maxLength: number = 1000): string {
    if (typeof input !== 'string') {
      return '';
    }

    return input
      // Remove script tags and their content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Remove javascript: protocol
      .replace(/javascript:/gi, '')
      // Remove on* event handlers
      .replace(/\s*on\w+\s*=\s*"[^"]*"/gi, '')
      .replace(/\s*on\w+\s*=\s*'[^']*'/gi, '')
      // Remove data: URLs (except safe image types)
      .replace(/data:(?!image\/(?:jpeg|png|gif|webp))[^;]*;[^,]*,/gi, '')
      // Remove potentially dangerous HTML tags
      .replace(/<(iframe|object|embed|link|meta|style)\b[^>]*>/gi, '')
      // Encode HTML entities
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      // Trim and limit length
      .trim()
      .substring(0, Math.min(maxLength, this.MAX_INPUT_LENGTH));
  }

  /**
   * Sanitize medical data input with specific medical context rules
   */
  static sanitizeMedicalData(input: string): string {
    const sanitized = this.sanitizeText(input, 10000);
    
    // Additional medical data specific sanitization
    return sanitized
      .replace(/\b(exec|eval|function|constructor)\s*\(/gi, '') // Remove function calls
      .replace(/[<>]/g, '') // Remove angle brackets entirely for medical data
      .replace(/\${.*?}/g, '') // Remove template literals
      .replace(/`.*?`/g, ''); // Remove backticks
  }

  /**
   * Validate and sanitize email format
   */
  static sanitizeEmail(email: string): { isValid: boolean; sanitized: string } {
    const sanitized = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    return {
      isValid: emailRegex.test(sanitized) && sanitized.length <= 254,
      sanitized
    };
  }

  /**
   * Validate file upload input with comprehensive security checks
   */
  static validateFileUpload(file: File, allowedTypes?: string[], maxSize?: number): string | null {
    if (!file) {
      return 'No file provided';
    }

    const fileMaxSize = maxSize || this.MAX_FILE_SIZE;
    const fileAllowedTypes = allowedTypes || this.ALLOWED_IMAGE_TYPES;

    // Check file size
    if (file.size > fileMaxSize) {
      return `File size exceeds ${fileMaxSize / (1024 * 1024)}MB limit`;
    }

    // Check file type
    if (!fileAllowedTypes.includes(file.type)) {
      return `File type ${file.type} not allowed. Allowed types: ${fileAllowedTypes.join(', ')}`;
    }

    // Check file extension
    const extension = file.name.toLowerCase().split('.').pop();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    if (!extension || !allowedExtensions.includes(extension)) {
      return `File extension .${extension} not allowed`;
    }

    // Check for suspicious file names
    const suspiciousPatterns = [
      /\.php$/i, /\.jsp$/i, /\.asp$/i, /\.exe$/i, /\.bat$/i, /\.cmd$/i, /\.scr$/i
    ];
    
    if (suspiciousPatterns.some(pattern => pattern.test(file.name))) {
      return 'Suspicious file type detected';
    }

    return null; // No error
  }

  /**
   * Enhanced rate limiting with better storage and cleanup
   */
  static checkRateLimit(
    identifier: string, 
    action: string, 
    maxAttempts: number = this.MAX_REQUESTS_PER_WINDOW, 
    windowMs: number = this.RATE_LIMIT_WINDOW
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const key = `rate_limit_${identifier}_${action}`;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Get existing attempts and filter out old ones
    const stored = localStorage.getItem(key);
    const attempts = stored ? JSON.parse(stored).filter((timestamp: number) => timestamp > windowStart) : [];
    
    const remaining = Math.max(0, maxAttempts - attempts.length);
    const resetTime = attempts.length > 0 ? attempts[0] + windowMs : now + windowMs;
    
    if (attempts.length >= maxAttempts) {
      return { allowed: false, remaining: 0, resetTime };
    }

    // Add current attempt
    attempts.push(now);
    localStorage.setItem(key, JSON.stringify(attempts));
    
    // Cleanup old entries periodically
    this.cleanupRateLimitStorage();
    
    return { allowed: true, remaining: remaining - 1, resetTime };
  }

  /**
   * Clean up old rate limit entries
   */
  private static cleanupRateLimitStorage(): void {
    const now = Date.now();
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith('rate_limit_')) {
        try {
          const attempts = JSON.parse(localStorage.getItem(key) || '[]');
          const validAttempts = attempts.filter((timestamp: number) => now - timestamp < this.RATE_LIMIT_WINDOW * 2);
          
          if (validAttempts.length === 0) {
            localStorage.removeItem(key);
          } else if (validAttempts.length !== attempts.length) {
            localStorage.setItem(key, JSON.stringify(validAttempts));
          }
        } catch (e) {
          // Remove corrupted entries
          localStorage.removeItem(key);
        }
      }
    });
  }

  /**
   * Sanitize OpenAI API responses
   */
  static sanitizeAIResponse(response: string): string {
    return this.sanitizeText(response, 50000)
      // Remove potential markdown injection
      .replace(/!\[.*?\]\(javascript:.*?\)/gi, '')
      // Remove suspicious URLs
      .replace(/\[.*?\]\((?!https?:\/\/|mailto:).*?\)/gi, '')
      // Limit consecutive newlines
      .replace(/\n{4,}/g, '\n\n\n');
  }

  /**
   * Validate search queries
   */
  static validateSearchQuery(query: string): { isValid: boolean; sanitized: string; error?: string } {
    if (!query || typeof query !== 'string') {
      return { isValid: false, sanitized: '', error: 'Invalid query' };
    }

    const sanitized = this.sanitizeText(query, 500);
    
    if (sanitized.length < 2) {
      return { isValid: false, sanitized, error: 'Query too short' };
    }

    // Check for SQL injection patterns
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /(--|\/\*|\*\/|;)/,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i
    ];

    if (sqlPatterns.some(pattern => pattern.test(sanitized))) {
      return { isValid: false, sanitized, error: 'Invalid characters in query' };
    }

    return { isValid: true, sanitized };
  }
}
