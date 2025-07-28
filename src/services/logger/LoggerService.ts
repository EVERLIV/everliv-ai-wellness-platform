type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: Date;
  component?: string;
}

class LoggerService {
  private isDevelopment = import.meta.env.DEV;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private shouldLog(level: LogLevel): boolean {
    if (this.isDevelopment) return true;
    // В продакшене логируем только warnings и errors
    return level === 'warn' || level === 'error';
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  debug(message: string, data?: any, component?: string) {
    const entry: LogEntry = {
      level: 'debug',
      message,
      data,
      timestamp: new Date(),
      component
    };

    if (this.shouldLog('debug')) {
      console.debug(`[${component || 'APP'}] ${message}`, data);
    }
    this.addLog(entry);
  }

  info(message: string, data?: any, component?: string) {
    const entry: LogEntry = {
      level: 'info',
      message,
      data,
      timestamp: new Date(),
      component
    };

    if (this.shouldLog('info')) {
      console.info(`[${component || 'APP'}] ${message}`, data);
    }
    this.addLog(entry);
  }

  warn(message: string, data?: any, component?: string) {
    const entry: LogEntry = {
      level: 'warn',
      message,
      data,
      timestamp: new Date(),
      component
    };

    if (this.shouldLog('warn')) {
      console.warn(`[${component || 'APP'}] ${message}`, data);
    }
    this.addLog(entry);
  }

  error(message: string, data?: any, component?: string) {
    const entry: LogEntry = {
      level: 'error',
      message,
      data,
      timestamp: new Date(),
      component
    };

    if (this.shouldLog('error')) {
      console.error(`[${component || 'APP'}] ${message}`, data);
    }
    this.addLog(entry);
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new LoggerService();