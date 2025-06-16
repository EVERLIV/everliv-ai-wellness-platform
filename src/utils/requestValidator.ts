
import { z } from 'zod';
import { InputSanitizer } from './inputSanitizer';
import { secureLogger } from './secureLogger';

// UUID validation schema
const uuidSchema = z.string().uuid('Invalid UUID format');

// Common validation schemas
export const validationSchemas = {
  uuid: uuidSchema,
  email: z.string().email('Invalid email format').max(254),
  text: z.string().min(1).max(10000),
  shortText: z.string().min(1).max(500),
  medicalText: z.string().min(1).max(50000),
  searchQuery: z.string().min(2).max(500),
  pagination: z.object({
    page: z.number().int().min(1).max(1000).default(1),
    limit: z.number().int().min(1).max(100).default(20)
  }),
  userProfile: z.object({
    first_name: z.string().max(100).optional(),
    last_name: z.string().max(100).optional(),
    date_of_birth: z.string().optional(),
    height: z.number().min(0).max(300).optional(),
    weight: z.number().min(0).max(1000).optional()
  })
};

export class RequestValidator {
  /**
   * Validate UUID parameter
   */
  static validateUUID(value: unknown, fieldName: string = 'id'): string {
    try {
      return uuidSchema.parse(value);
    } catch (error) {
      secureLogger.warn('UUID validation failed', {
        field_name: fieldName,
        value: typeof value === 'string' ? value.substring(0, 50) : typeof value,
        error: (error as Error).message
      });
      throw new Error(`Invalid ${fieldName} format`);
    }
  }

  /**
   * Validate and sanitize search query
   */
  static validateSearchQuery(query: unknown): string {
    if (typeof query !== 'string') {
      throw new Error('Search query must be a string');
    }

    const validation = InputSanitizer.validateSearchQuery(query);
    if (!validation.isValid) {
      throw new Error(validation.error || 'Invalid search query');
    }

    return validation.sanitized;
  }

  /**
   * Validate medical text input
   */
  static validateMedicalText(text: unknown): string {
    try {
      const validText = validationSchemas.medicalText.parse(text);
      return InputSanitizer.sanitizeMedicalData(validText);
    } catch (error) {
      secureLogger.warn('Medical text validation failed', {
        text_length: typeof text === 'string' ? text.length : 'not_string',
        error: (error as Error).message
      });
      throw new Error('Invalid medical text input');
    }
  }

  /**
   * Validate email format
   */
  static validateEmail(email: unknown): string {
    try {
      const validEmail = validationSchemas.email.parse(email);
      const sanitization = InputSanitizer.sanitizeEmail(validEmail);
      if (!sanitization.isValid) {
        throw new Error('Invalid email format');
      }
      return sanitization.sanitized;
    } catch (error) {
      throw new Error('Invalid email format');
    }
  }

  /**
   * Validate pagination parameters
   */
  static validatePagination(params: unknown): { page: number; limit: number } {
    try {
      const result = validationSchemas.pagination.parse(params);
      return {
        page: result.page,
        limit: result.limit
      };
    } catch (error) {
      // Return safe defaults if validation fails
      return { page: 1, limit: 20 };
    }
  }

  /**
   * Validate and sanitize user profile data
   */
  static validateUserProfile(data: unknown): any {
    try {
      const validData = validationSchemas.userProfile.parse(data);
      
      // Sanitize text fields
      if (validData.first_name) {
        validData.first_name = InputSanitizer.sanitizeText(validData.first_name, 100);
      }
      if (validData.last_name) {
        validData.last_name = InputSanitizer.sanitizeText(validData.last_name, 100);
      }
      
      return validData;
    } catch (error) {
      secureLogger.warn('User profile validation failed', {
        error: (error as Error).message
      });
      throw new Error('Invalid user profile data');
    }
  }

  /**
   * Check for SQL injection patterns
   */
  static detectSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /(--|\/\*|\*\/|;)/,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
      /(\bUNION\s+SELECT)/i,
      /(\bINSERT\s+INTO)/i,
      /(\bDROP\s+TABLE)/i
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Comprehensive request validation
   */
  static validateRequest(req: {
    params?: Record<string, unknown>;
    query?: Record<string, unknown>;
    body?: unknown;
    headers?: Record<string, string>;
  }): {
    params: Record<string, string>;
    query: Record<string, string>;
    body: any;
  } {
    const validated = {
      params: {} as Record<string, string>,
      query: {} as Record<string, string>,
      body: null as any
    };

    // Validate params (usually UUIDs)
    if (req.params) {
      for (const [key, value] of Object.entries(req.params)) {
        if (typeof value === 'string' && value.length > 0) {
          // Check if it looks like a UUID
          if (value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
            validated.params[key] = this.validateUUID(value, key);
          } else {
            validated.params[key] = InputSanitizer.sanitizeText(value, 200);
          }
        }
      }
    }

    // Validate query parameters
    if (req.query) {
      for (const [key, value] of Object.entries(req.query)) {
        if (typeof value === 'string') {
          validated.query[key] = InputSanitizer.sanitizeText(value, 1000);
        }
      }
    }

    // Validate body
    if (req.body) {
      validated.body = req.body;
    }

    return validated;
  }
}
