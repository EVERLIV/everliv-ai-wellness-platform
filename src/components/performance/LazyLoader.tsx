import React, { Suspense, lazy, ComponentType } from 'react';
import LoadingFallback from '@/components/common/LoadingFallback';

interface LazyWrapperProps {
  fallback?: React.ComponentType;
  delay?: number;
}

// Создаем HOC для lazy loading с задержкой
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: LazyWrapperProps = {}
) {
  const { fallback: CustomFallback, delay = 0 } = options;
  
  const LazyComponent = lazy(() => {
    if (delay > 0) {
      return new Promise<{ default: T }>(resolve => {
        setTimeout(() => {
          importFunc().then(resolve);
        }, delay);
      });
    }
    return importFunc();
  });

  const FallbackComponent = CustomFallback || LoadingFallback;

  return function LazyWrapper(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={<FallbackComponent />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Компонент для ленивой загрузки с инtersection observer
interface LazyOnViewProps {
  children: React.ReactNode;
  fallback?: React.ComponentType;
  rootMargin?: string;
  threshold?: number;
}

export const LazyOnView: React.FC<LazyOnViewProps> = ({ 
  children, 
  fallback: Fallback = LoadingFallback,
  rootMargin = '50px',
  threshold = 0.1
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return (
    <div ref={ref}>
      {isVisible ? children : <Fallback />}
    </div>
  );
};