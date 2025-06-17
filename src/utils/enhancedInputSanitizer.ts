
import { InputSanitizer } from './inputSanitizer';

export class EnhancedInputSanitizer extends InputSanitizer {
  // Enhanced validation for health metrics with strict bounds
  static validateHealthMetricSecure(value: number, type: string): number {
    const strictBounds = {
      steps: { min: 0, max: 50000 }, // Reduced from 100k for realistic limits
      exercise_minutes: { min: 0, max: 720 }, // Max 12 hours per day
      activity_level: { min: 1, max: 10 },
      sleep_hours: { min: 0, max: 16 }, // Reduced for realistic sleep
      sleep_quality: { min: 1, max: 10 },
      stress_level: { min: 1, max: 10 },
      mood_level: { min: 1, max: 10 },
      water_intake: { min: 0, max: 20 }, // Reduced from 50 for safety
      nutrition_quality: { min: 1, max: 10 },
      cigarettes_count: { min: 0, max: 100 }, // Reduced from 200
      alcohol_units: { min: 0, max: 20 } // Reduced from 50
    };

    const bound = strictBounds[type as keyof typeof strictBounds];
    if (!bound) {
      throw new Error(`Invalid health metric type: ${type}`);
    }

    // Additional security: detect unrealistic values
    if (value < 0 || value > bound.max * 2) {
      console.warn(`🔒 Suspicious health metric value detected: ${type}=${value}`);
    }

    const sanitized = Math.max(bound.min, Math.min(bound.max, Math.round(value)));
    return isNaN(sanitized) ? bound.min : sanitized;
  }

  // Enhanced text sanitization with additional security
  static sanitizeTextSecure(text: string, maxLength: number = 500): string {
    if (!text || typeof text !== 'string') return '';
    
    // Remove potentially dangerous patterns
    let sanitized = text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .replace(/data:(?!image\/(png|jpg|jpeg|gif|svg|webp))/gi, ''); // Allow only safe data URLs
    
    // Apply base sanitization
    sanitized = this.sanitizeText(sanitized);
    
    // Truncate to max length
    return sanitized.slice(0, maxLength);
  }

  // Sanitize contact form data
  static sanitizeContactForm(data: any): any {
    return {
      name: this.sanitizeTextSecure(data.name, 100),
      email: this.sanitizeEmail(data.email),
      subject: this.sanitizeTextSecure(data.subject, 200),
      message: this.sanitizeTextSecure(data.message, 2000),
      phone: this.sanitizeTextSecure(data.phone?.replace(/[^\d\+\-\(\)\s]/g, ''), 20)
    };
  }

  // Enhanced email validation
  private static sanitizeEmail(email: string): string {
    if (!email || typeof email !== 'string') return '';
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const sanitized = email.toLowerCase().trim().slice(0, 254); // RFC limit
    
    return emailRegex.test(sanitized) ? sanitized : '';
  }
}
