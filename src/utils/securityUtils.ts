
export class SecurityUtils {
  // Security: Rate limiting helper
  private static rateLimitMap = new Map<string, { count: number; resetTime: number }>();

  static checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const entry = this.rateLimitMap.get(key);

    if (!entry || now > entry.resetTime) {
      this.rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (entry.count >= maxRequests) {
      return false;
    }

    entry.count++;
    return true;
  }

  // Security: Validate health metrics bounds
  static validateHealthMetric(value: number, type: string): number {
    const bounds = {
      steps: { min: 0, max: 100000 },
      exercise_minutes: { min: 0, max: 1440 },
      activity_level: { min: 1, max: 10 },
      sleep_hours: { min: 0, max: 24 },
      sleep_quality: { min: 1, max: 10 },
      stress_level: { min: 1, max: 10 },
      mood_level: { min: 1, max: 10 },
      water_intake: { min: 0, max: 50 },
      nutrition_quality: { min: 1, max: 10 },
      cigarettes_count: { min: 0, max: 200 },
      alcohol_units: { min: 0, max: 50 }
    };

    const bound = bounds[type as keyof typeof bounds];
    if (!bound) {
      throw new Error(`Invalid health metric type: ${type}`);
    }

    const sanitized = Math.max(bound.min, Math.min(bound.max, Math.round(value)));
    return isNaN(sanitized) ? bound.min : sanitized;
  }

  // Security: Sanitize and validate goal data
  static sanitizeGoalData(data: any): any {
    return {
      target_weight: data.target_weight ? this.validateHealthMetric(data.target_weight, 'weight') : undefined,
      target_steps: this.validateHealthMetric(data.target_steps || 10000, 'steps'),
      target_exercise_minutes: this.validateHealthMetric(data.target_exercise_minutes || 30, 'exercise_minutes'),
      target_sleep_hours: this.validateHealthMetric(data.target_sleep_hours || 8, 'sleep_hours'),
      target_water_intake: this.validateHealthMetric(data.target_water_intake || 8, 'water_intake'),
      target_stress_level: this.validateHealthMetric(data.target_stress_level || 3, 'stress_level'),
      goal_type: ['daily', 'weekly', 'monthly', 'yearly'].includes(data.goal_type) ? data.goal_type : 'monthly'
    };
  }

  // Security: Audit logging
  static auditLog(action: string, userId: string, details?: any): void {
    console.log('🔒 AUDIT:', {
      timestamp: new Date().toISOString(),
      action,
      userId,
      details,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server'
    });
  }

  // Security: Check for suspicious patterns
  static detectSuspiciousActivity(data: any): boolean {
    // Check for extremely high values that might indicate manipulation
    if (data.steps && data.steps > 50000) return true;
    if (data.exercise_minutes && data.exercise_minutes > 480) return true;
    if (data.water_intake && data.water_intake > 20) return true;
    
    return false;
  }
}
