// Performance optimization utilities
import React from 'react';
import { monitoring } from './monitoring';

// Debounce function for search and input
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function for scroll events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Preload route component
export function preloadRoute(routeImport: () => Promise<any>) {
  const isIdle = 'requestIdleCallback' in window;
  
  if (isIdle) {
    (window as any).requestIdleCallback(() => routeImport());
  } else {
    setTimeout(() => routeImport(), 100);
  }
}

// Image optimization utility
export function optimizeImage(url: string, width?: number, quality = 80): string {
  if (!url) return '';
  
  // If it's already optimized or local, return as is
  if (url.includes('w_') || url.startsWith('/') || url.startsWith('data:')) {
    return url;
  }
  
  // Add optimization parameters for external images
  const params = new URLSearchParams();
  if (width) params.set('w', width.toString());
  params.set('q', quality.toString());
  params.set('f', 'webp');
  
  return `${url}?${params.toString()}`;
}

// Bundle size analyzer helper
export function analyzeBundleSize() {
  if (process.env.NODE_ENV === 'development') {
    console.log('Bundle analysis available in production build only');
    return;
  }
  
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  
  const bundleInfo = {
    scripts: scripts.map(s => ({ src: s.getAttribute('src'), size: 'unknown' })),
    stylesheets: stylesheets.map(s => ({ href: s.getAttribute('href'), size: 'unknown' }))
  };
  
  console.table(bundleInfo.scripts);
  console.table(bundleInfo.stylesheets);
}

// Performance measurement decorator
export function measureComponentRender(
  WrappedComponent: React.ComponentType<any>,
  componentName: string
) {
  return React.memo((props: any) => {
    React.useEffect(() => {
      const start = performance.now();
      return () => {
        const end = performance.now();
        monitoring.recordMetric(`${componentName}_render_time`, end - start);
      };
    });
    
    return React.createElement(WrappedComponent, props);
  });
}

// Memory leak detection
export function detectMemoryLeaks() {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    monitoring.recordMetric('memory_used', memory.usedJSHeapSize);
    monitoring.recordMetric('memory_limit', memory.jsHeapSizeLimit);
    
    if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
      console.warn('High memory usage detected');
    }
  }
}

// Lazy loading with intersection observer
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
}