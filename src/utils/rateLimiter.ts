
import { secureLogger } from './secureLogger';

interface RateLimitConfig {
  windowMs: number;
  maxAttempts: number;
  keyGenerator?: (identifier: string, action: string) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  totalHits: number;
}

export class EnhancedRateLimiter {
  private static readonly DEFAULT_WINDOW = 60 * 1000; // 1 minute
  private static readonly DEFAULT_MAX_ATTEMPTS = 60;
  
  // In-memory store for rate limiting (in production, use Redis)
  private static store = new Map<string, { attempts: number[]; blocked?: number }>();
  
  /**
   * Check if request is allowed based on rate limiting rules
   */
  static checkRateLimit(
    identifier: string,
    action: string,
    config: Partial<RateLimitConfig> = {}
  ): RateLimitResult {
    const {
      windowMs = this.DEFAULT_WINDOW,
      maxAttempts = this.DEFAULT_MAX_ATTEMPTS,
      keyGenerator = (id, act) => `${id}:${act}`
    } = config;

    const key = keyGenerator(identifier, action);
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up old entries periodically
    this.cleanup();

    // Get or create entry
    let entry = this.store.get(key);
    if (!entry) {
      entry = { attempts: [] };
      this.store.set(key, entry);
    }

    // Check if currently blocked
    if (entry.blocked && entry.blocked > now) {
      const resetTime = entry.blocked;
      secureLogger.warn('Rate limit blocked request', {
        identifier,
        action,
        blocked_until: new Date(resetTime).toISOString()
      });
      
      return {
        allowed: false,
        remaining: 0,
        resetTime,
        totalHits: entry.attempts.length
      };
    }

    // Remove old attempts outside the window
    entry.attempts = entry.attempts.filter(timestamp => timestamp > windowStart);

    // Check if limit exceeded
    if (entry.attempts.length >= maxAttempts) {
      // Block for the remainder of the window
      const blockUntil = Math.max(...entry.attempts) + windowMs;
      entry.blocked = blockUntil;
      
      secureLogger.warn('Rate limit exceeded', {
        identifier,
        action,
        attempts: entry.attempts.length,
        max_attempts: maxAttempts,
        blocked_until: new Date(blockUntil).toISOString()
      });

      return {
        allowed: false,
        remaining: 0,
        resetTime: blockUntil,
        totalHits: entry.attempts.length
      };
    }

    // Add current attempt
    entry.attempts.push(now);
    this.store.set(key, entry);

    const remaining = Math.max(0, maxAttempts - entry.attempts.length);
    const oldestAttempt = Math.min(...entry.attempts);
    const resetTime = oldestAttempt + windowMs;

    secureLogger.debug('Rate limit check passed', {
      identifier,
      action,
      remaining,
      total_hits: entry.attempts.length
    });

    return {
      allowed: true,
      remaining,
      resetTime,
      totalHits: entry.attempts.length
    };
  }

  /**
   * Progressive rate limiting with increasing delays
   */
  static checkProgressiveRateLimit(
    identifier: string,
    action: string,
    baseConfig: Partial<RateLimitConfig> = {}
  ): RateLimitResult & { backoffMs?: number } {
    const result = this.checkRateLimit(identifier, action, baseConfig);
    
    if (!result.allowed && result.totalHits > (baseConfig.maxAttempts || this.DEFAULT_MAX_ATTEMPTS)) {
      // Calculate exponential backoff
      const excessAttempts = result.totalHits - (baseConfig.maxAttempts || this.DEFAULT_MAX_ATTEMPTS);
      const backoffMs = Math.min(Math.pow(2, excessAttempts) * 1000, 300000); // Max 5 minutes
      
      return {
        ...result,
        backoffMs,
        resetTime: Date.now() + backoffMs
      };
    }
    
    return result;
  }

  /**
   * Check multiple rate limits at once
   */
  static checkMultipleRateLimits(
    identifier: string,
    checks: Array<{ action: string; config?: Partial<RateLimitConfig> }>
  ): { allowed: boolean; failedChecks: string[]; results: Record<string, RateLimitResult> } {
    const results: Record<string, RateLimitResult> = {};
    const failedChecks: string[] = [];
    let allAllowed = true;

    for (const check of checks) {
      const result = this.checkRateLimit(identifier, check.action, check.config);
      results[check.action] = result;
      
      if (!result.allowed) {
        allAllowed = false;
        failedChecks.push(check.action);
      }
    }

    return {
      allowed: allAllowed,
      failedChecks,
      results
    };
  }

  /**
   * Get current rate limit status without incrementing
   */
  static getRateLimitStatus(
    identifier: string,
    action: string,
    config: Partial<RateLimitConfig> = {}
  ): RateLimitResult {
    const {
      windowMs = this.DEFAULT_WINDOW,
      maxAttempts = this.DEFAULT_MAX_ATTEMPTS,
      keyGenerator = (id, act) => `${id}:${act}`
    } = config;

    const key = keyGenerator(identifier, action);
    const now = Date.now();
    const windowStart = now - windowMs;

    const entry = this.store.get(key);
    if (!entry) {
      return {
        allowed: true,
        remaining: maxAttempts,
        resetTime: now + windowMs,
        totalHits: 0
      };
    }

    // Filter out old attempts
    const validAttempts = entry.attempts.filter(timestamp => timestamp > windowStart);
    const remaining = Math.max(0, maxAttempts - validAttempts.length);
    const resetTime = validAttempts.length > 0 ? Math.min(...validAttempts) + windowMs : now + windowMs;

    return {
      allowed: validAttempts.length < maxAttempts && (!entry.blocked || entry.blocked <= now),
      remaining,
      resetTime,
      totalHits: validAttempts.length
    };
  }

  /**
   * Reset rate limit for a specific identifier and action
   */
  static resetRateLimit(identifier: string, action: string): void {
    const key = `${identifier}:${action}`;
    this.store.delete(key);
    
    secureLogger.info('Rate limit reset', { identifier, action });
  }

  /**
   * Clean up old entries to prevent memory leaks
   */
  private static cleanup(): void {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    for (const [key, entry] of this.store.entries()) {
      const hasOldAttempts = entry.attempts.some(timestamp => now - timestamp > maxAge);
      const isBlocked = entry.blocked && entry.blocked <= now;
      
      if (entry.attempts.length === 0 || (hasOldAttempts && !isBlocked)) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Get rate limiter statistics
   */
  static getStats(): {
    totalKeys: number;
    totalAttempts: number;
    blockedKeys: number;
  } {
    const now = Date.now();
    let totalAttempts = 0;
    let blockedKeys = 0;

    for (const entry of this.store.values()) {
      totalAttempts += entry.attempts.length;
      if (entry.blocked && entry.blocked > now) {
        blockedKeys++;
      }
    }

    return {
      totalKeys: this.store.size,
      totalAttempts,
      blockedKeys
    };
  }
}

// Common rate limit configurations
export const RATE_LIMIT_CONFIGS = {
  // Authentication endpoints
  LOGIN: { windowMs: 15 * 60 * 1000, maxAttempts: 5 }, // 5 attempts per 15 minutes
  SIGNUP: { windowMs: 60 * 60 * 1000, maxAttempts: 3 }, // 3 attempts per hour
  PASSWORD_RESET: { windowMs: 60 * 60 * 1000, maxAttempts: 3 }, // 3 attempts per hour
  
  // API endpoints
  API_GENERAL: { windowMs: 60 * 1000, maxAttempts: 60 }, // 60 requests per minute
  API_SEARCH: { windowMs: 60 * 1000, maxAttempts: 30 }, // 30 searches per minute
  API_AI: { windowMs: 60 * 1000, maxAttempts: 10 }, // 10 AI requests per minute
  
  // File uploads
  FILE_UPLOAD: { windowMs: 60 * 1000, maxAttempts: 10 }, // 10 uploads per minute
  
  // Contact forms
  CONTACT_FORM: { windowMs: 60 * 60 * 1000, maxAttempts: 3 }, // 3 submissions per hour
};
