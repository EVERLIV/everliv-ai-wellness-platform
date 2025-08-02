// Production logger for debugging blank screen issues

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  data?: any;
  userAgent?: string;
  url?: string;
  stack?: string;
}

class ProductionLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  private createLogEntry(level: LogEntry['level'], message: string, data?: any, error?: Error): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      userAgent: navigator.userAgent,
      url: window.location.href,
      stack: error?.stack
    };
  }

  info(message: string, data?: any) {
    const entry = this.createLogEntry('info', message, data);
    this.logs.push(entry);
    this.trimLogs();
    console.log(`[PROD-LOG] ${message}`, data);
  }

  warn(message: string, data?: any) {
    const entry = this.createLogEntry('warn', message, data);
    this.logs.push(entry);
    this.trimLogs();
    console.warn(`[PROD-LOG] ${message}`, data);
  }

  error(message: string, data?: any, error?: Error) {
    const entry = this.createLogEntry('error', message, data, error);
    this.logs.push(entry);
    this.trimLogs();
    console.error(`[PROD-LOG] ${message}`, data, error);
    
    // В production отправляем критические ошибки
    if (!import.meta.env.DEV) {
      this.sendToMonitoring(entry);
    }
  }

  private trimLogs() {
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  private async sendToMonitoring(entry: LogEntry) {
    try {
      // Здесь можно интегрировать с Sentry, LogRocket или другими сервисами
      // Пока просто сохраняем в localStorage для отладки
      const existingLogs = JSON.parse(localStorage.getItem('prod-error-logs') || '[]');
      existingLogs.push(entry);
      localStorage.setItem('prod-error-logs', JSON.stringify(existingLogs.slice(-50)));
    } catch (err) {
      console.error('Failed to save error log:', err);
    }
  }

  getLogs() {
    return [...this.logs];
  }

  getErrorLogs() {
    return this.logs.filter(log => log.level === 'error');
  }

  clearLogs() {
    this.logs = [];
    localStorage.removeItem('prod-error-logs');
  }

  exportLogs() {
    const allLogs = {
      currentSession: this.logs,
      savedErrors: JSON.parse(localStorage.getItem('prod-error-logs') || '[]')
    };
    return JSON.stringify(allLogs, null, 2);
  }
}

export const prodLogger = new ProductionLogger();

// Global error handler
window.addEventListener('error', (event) => {
  prodLogger.error('Global JavaScript Error', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  }, event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  prodLogger.error('Unhandled Promise Rejection', {
    reason: event.reason
  });
});