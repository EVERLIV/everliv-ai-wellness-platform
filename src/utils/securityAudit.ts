import { secureLogger } from './secureLogger';
import { EnhancedRateLimiter } from './rateLimiter';

interface SecurityEvent {
  type: 'authentication' | 'authorization' | 'data_access' | 'rate_limit' | 'input_validation' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  details: Record<string, any>;
  timestamp: string;
}

export class SecurityAuditor {
  private static events: SecurityEvent[] = [];
  private static readonly MAX_EVENTS = 1000; // Keep last 1000 events in memory

  /**
   * Log a security event
   */
  static logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date().toISOString()
    };

    this.events.push(securityEvent);
    
    // Keep only recent events
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(-this.MAX_EVENTS);
    }

    // Log based on severity
    const logData = {
      security_event_type: event.type,
      severity: event.severity,
      user_id: event.user_id,
      details: event.details
    };

    switch (event.severity) {
      case 'critical':
        secureLogger.error(`CRITICAL SECURITY EVENT: ${event.type}`, logData);
        this.alertCriticalEvent(securityEvent);
        break;
      case 'high':
        secureLogger.error(`HIGH SECURITY EVENT: ${event.type}`, logData);
        break;
      case 'medium':
        secureLogger.warn(`MEDIUM SECURITY EVENT: ${event.type}`, logData);
        break;
      case 'low':
        secureLogger.info(`LOW SECURITY EVENT: ${event.type}`, logData);
        break;
    }
  }

  /**
   * Check for suspicious patterns
   */
  static detectSuspiciousActivity(
    user_id: string,
    action: string,
    context: Record<string, any> = {}
  ): boolean {
    const recentEvents = this.events.filter(
      event => event.user_id === user_id && 
      Date.now() - new Date(event.timestamp).getTime() < 60 * 60 * 1000 // Last hour
    );

    // Check for rapid successive actions
    const rapidActions = recentEvents.filter(
      event => event.details.action === action &&
      Date.now() - new Date(event.timestamp).getTime() < 5 * 60 * 1000 // Last 5 minutes
    );

    if (rapidActions.length > 10) {
      this.logSecurityEvent({
        type: 'suspicious_activity',
        severity: 'high',
        user_id,
        details: {
          pattern: 'rapid_successive_actions',
          action,
          count: rapidActions.length,
          context
        }
      });
      return true;
    }

    // Check for multiple failed attempts
    const failedAttempts = recentEvents.filter(
      event => event.type === 'authentication' && 
      event.details.success === false
    );

    if (failedAttempts.length > 5) {
      this.logSecurityEvent({
        type: 'suspicious_activity',
        severity: 'high',
        user_id,
        details: {
          pattern: 'multiple_failed_auth',
          failed_attempts: failedAttempts.length,
          context
        }
      });
      return true;
    }

    return false;
  }

  /**
   * Validate request integrity
   */
  static validateRequestIntegrity(request: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body?: any;
    user_id?: string;
  }): { valid: boolean; violations: string[] } {
    const violations: string[] = [];

    // Check for suspicious headers
    const suspiciousHeaders = [
      'x-forwarded-for',
      'x-real-ip',
      'x-originating-ip'
    ];

    for (const header of suspiciousHeaders) {
      if (request.headers[header]) {
        const value = request.headers[header];
        if (value.includes('127.0.0.1') || value.includes('localhost')) {
          violations.push(`Suspicious ${header} header: ${value}`);
        }
      }
    }

    // Check user agent
    const userAgent = request.headers['user-agent'] || '';
    if (!userAgent || userAgent.length < 10) {
      violations.push('Missing or suspicious user agent');
    }

    // Check for automation patterns
    const automationPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /curl/i,
      /wget/i,
      /python/i,
      /php/i
    ];

    if (automationPatterns.some(pattern => pattern.test(userAgent))) {
      violations.push(`Automated tool detected: ${userAgent}`);
    }

    // Log violations
    if (violations.length > 0) {
      this.logSecurityEvent({
        type: 'suspicious_activity',
        severity: 'medium',
        user_id: request.user_id,
        details: {
          pattern: 'request_integrity_violation',
          violations,
          url: request.url,
          method: request.method,
          user_agent: userAgent
        }
      });
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }

  /**
   * Monitor data access patterns
   */
  static monitorDataAccess(
    user_id: string,
    resource_type: string,
    resource_id: string,
    action: 'read' | 'write' | 'delete',
    context: Record<string, any> = {}
  ): void {
    this.logSecurityEvent({
      type: 'data_access',
      severity: 'low',
      user_id,
      details: {
        resource_type,
        resource_id,
        action,
        context
      }
    });

    // Check for unusual access patterns
    const recentAccess = this.events.filter(
      event => event.type === 'data_access' &&
      event.user_id === user_id &&
      Date.now() - new Date(event.timestamp).getTime() < 10 * 60 * 1000 // Last 10 minutes
    );

    if (recentAccess.length > 50) {
      this.logSecurityEvent({
        type: 'suspicious_activity',
        severity: 'high',
        user_id,
        details: {
          pattern: 'excessive_data_access',
          access_count: recentAccess.length,
          resource_type,
          context
        }
      });
    }
  }

  /**
   * Alert on critical security events
   */
  private static alertCriticalEvent(event: SecurityEvent): void {
    // In production, this would send alerts to security team
    console.error('🚨 CRITICAL SECURITY ALERT 🚨', {
      type: event.type,
      details: event.details,
      timestamp: event.timestamp,
      user_id: event.user_id
    });

    // Could integrate with external alerting systems here
    // - Slack notifications
    // - Email alerts
    // - Security incident management systems
  }

  /**
   * Generate security report
   */
  static generateSecurityReport(timeRange: number = 24 * 60 * 60 * 1000): {
    summary: Record<string, number>;
    criticalEvents: SecurityEvent[];
    topUsers: Array<{ user_id: string; event_count: number }>;
    suspiciousPatterns: string[];
  } {
    const cutoff = Date.now() - timeRange;
    const recentEvents = this.events.filter(
      event => new Date(event.timestamp).getTime() > cutoff
    );

    // Summary by type and severity
    const summary: Record<string, number> = {};
    recentEvents.forEach(event => {
      const key = `${event.type}_${event.severity}`;
      summary[key] = (summary[key] || 0) + 1;
    });

    // Critical events
    const criticalEvents = recentEvents.filter(event => event.severity === 'critical');

    // Top users by event count
    const userEventCounts: Record<string, number> = {};
    recentEvents.forEach(event => {
      if (event.user_id) {
        userEventCounts[event.user_id] = (userEventCounts[event.user_id] || 0) + 1;
      }
    });

    const topUsers = Object.entries(userEventCounts)
      .map(([user_id, event_count]) => ({ user_id, event_count }))
      .sort((a, b) => b.event_count - a.event_count)
      .slice(0, 10);

    // Suspicious patterns
    const suspiciousPatterns = recentEvents
      .filter(event => event.type === 'suspicious_activity')
      .map(event => event.details.pattern)
      .filter((pattern, index, array) => array.indexOf(pattern) === index);

    return {
      summary,
      criticalEvents,
      topUsers,
      suspiciousPatterns
    };
  }

  /**
   * Get rate limiter statistics
   */
  static getRateLimitStats(): any {
    return EnhancedRateLimiter.getStats();
  }
}
