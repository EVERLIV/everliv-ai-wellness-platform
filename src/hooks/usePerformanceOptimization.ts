import { useEffect, useCallback, useMemo } from 'react';
import { debounce, throttle, detectMemoryLeaks } from '@/utils/performance';
import { monitoring } from '@/utils/monitoring';

// Hook for search optimization
export function useOptimizedSearch(searchFn: (query: string) => void, delay = 300) {
  const debouncedSearch = useMemo(
    () => debounce(searchFn, delay),
    [searchFn, delay]
  );

  return debouncedSearch;
}

// Hook for scroll optimization
export function useOptimizedScroll(scrollFn: (event: Event) => void, limit = 16) {
  const throttledScroll = useMemo(
    () => throttle(scrollFn, limit),
    [scrollFn, limit]
  );

  useEffect(() => {
    window.addEventListener('scroll', throttledScroll);
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [throttledScroll]);

  return throttledScroll;
}

// Hook for performance monitoring
export function usePerformanceMonitoring(componentName: string) {
  useEffect(() => {
    const startTime = performance.now();
    
    // Monitor component mount time
    setTimeout(() => {
      const mountTime = performance.now() - startTime;
      monitoring.recordMetric(`${componentName}_mount_time`, mountTime);
    }, 0);

    // Check memory periodically
    const memoryInterval = setInterval(detectMemoryLeaks, 30000);

    return () => {
      clearInterval(memoryInterval);
      const unmountTime = performance.now() - startTime;
      monitoring.recordMetric(`${componentName}_lifetime`, unmountTime);
    };
  }, [componentName]);
}

// Hook for optimized API calls
export function useOptimizedApiCall<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = [],
  options: { enabled?: boolean; retry?: number } = {}
) {
  const { enabled = true, retry = 3 } = options;

  const optimizedCall = useCallback(async () => {
    if (!enabled) return null;

    let attempts = 0;
    let lastError: Error | null = null;

    while (attempts < retry) {
      try {
        const startTime = performance.now();
        const result = await apiCall();
        const duration = performance.now() - startTime;
        
        monitoring.recordMetric('api_call_duration', duration);
        return result;
      } catch (error) {
        lastError = error as Error;
        attempts++;
        
        if (attempts < retry) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
        }
      }
    }

    monitoring.reportError({
      message: `API call failed after ${retry} attempts: ${lastError?.message}`,
      stack: lastError?.stack || '',
      url: window.location.href,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    });

    throw lastError;
  }, [apiCall, enabled, retry, ...dependencies]);

  return optimizedCall;
}

// Hook for lazy component loading
export function useLazyComponentLoader(componentImport: () => Promise<any>) {
  const loadComponent = useCallback(() => {
    // Load component on interaction or when needed
    const load = async () => {
      try {
        const startTime = performance.now();
        const component = await componentImport();
        const loadTime = performance.now() - startTime;
        
        monitoring.recordMetric('component_load_time', loadTime);
        return component;
      } catch (error) {
        monitoring.reportError({
          message: `Failed to load component: ${error}`,
          stack: (error as Error).stack || '',
          url: window.location.href,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
        });
        throw error;
      }
    };

    return load();
  }, [componentImport]);

  return loadComponent;
}