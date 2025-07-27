interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  timestamp: number;
  userAgent: string;
}

class Monitoring {
  private metrics: PerformanceMetric[] = [];
  private errors: ErrorReport[] = [];
  private maxStoredItems = 100;

  constructor() {
    this.initErrorTracking();
    this.initPerformanceTracking();
  }

  private initErrorTracking() {
    window.addEventListener('error', (event) => {
      this.reportError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename || window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      });
    });
  }

  private initPerformanceTracking() {
    // Track page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          this.recordMetric('page_load_time', navigation.loadEventEnd - navigation.fetchStart);
          this.recordMetric('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.fetchStart);
          this.recordMetric('first_byte', navigation.responseStart - navigation.fetchStart);
        }
      }, 0);
    });
  }

  recordMetric(name: string, value: number) {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now(),
    });

    // Keep only recent metrics
    if (this.metrics.length > this.maxStoredItems) {
      this.metrics = this.metrics.slice(-this.maxStoredItems);
    }

    console.log(`📊 Metric recorded: ${name} = ${value}ms`);
  }

  reportError(error: ErrorReport) {
    this.errors.push(error);

    // Keep only recent errors
    if (this.errors.length > this.maxStoredItems) {
      this.errors = this.errors.slice(-this.maxStoredItems);
    }

    console.error('🚨 Error reported:', error);
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getErrors(): ErrorReport[] {
    return [...this.errors];
  }

  // Get average metric value
  getAverageMetric(name: string, timeWindow: number = 300000): number | null {
    const now = Date.now();
    const recentMetrics = this.metrics.filter(
      m => m.name === name && (now - m.timestamp) <= timeWindow
    );

    if (recentMetrics.length === 0) return null;

    const sum = recentMetrics.reduce((acc, m) => acc + m.value, 0);
    return sum / recentMetrics.length;
  }

  // Check system health
  getHealthStatus(): 'healthy' | 'warning' | 'critical' {
    const avgLoadTime = this.getAverageMetric('page_load_time');
    const recentErrors = this.errors.filter(e => (Date.now() - e.timestamp) <= 300000);

    if (recentErrors.length > 5) return 'critical';
    if (avgLoadTime && avgLoadTime > 5000) return 'warning';
    if (recentErrors.length > 2) return 'warning';

    return 'healthy';
  }
}

export const monitoring = new Monitoring();

// Helper function to measure function execution time
export const measurePerformance = <T>(
  name: string,
  fn: () => T | Promise<T>
): T | Promise<T> => {
  const start = performance.now();
  
  const measure = () => {
    const end = performance.now();
    monitoring.recordMetric(name, end - start);
  };

  try {
    const result = fn();
    
    if (result instanceof Promise) {
      return result.finally(measure);
    } else {
      measure();
      return result;
    }
  } catch (error) {
    measure();
    throw error;
  }
};
