
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  user_id?: string;
  session_id?: string;
  endpoint?: string;
  timestamp?: string;
  // Allow any additional properties for flexibility
  [key: string]: any;
}

class SecureLogger {
  private isProduction: boolean;
  private sensitiveFields: string[] = [
    'password', 'token', 'secret', 'key', 'auth', 'session', 
    'email', 'phone', 'ssn', 'credit_card', 'medical_data'
  ];

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  private sanitizeData(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }

    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      const keyLower = key.toLowerCase();
      const isSensitive = this.sensitiveFields.some(field => keyLower.includes(field));
      
      if (isSensitive) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object') {
        sanitized[key] = this.sanitizeData(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...context
    };
    return JSON.stringify(this.sanitizeData(logEntry));
  }

  debug(message: string, context?: LogContext): void {
    if (!this.isProduction) {
      console.log(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    console.log(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, context?: LogContext): void {
    console.error(this.formatMessage('error', message, context));
  }

  // Специальный метод для медицинских данных
  medical(message: string, context?: Omit<LogContext, 'medical_data'>): void {
    const sanitizedContext = this.sanitizeData(context);
    this.info(`[MEDICAL] ${message}`, sanitizedContext);
  }
}

export const secureLogger = new SecureLogger();
