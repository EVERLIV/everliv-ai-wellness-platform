import React, { Suspense, lazy } from 'react';
import LoadingFallback from '@/components/common/LoadingFallback';

interface LazyRouteProps {
  importFunc: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: React.ComponentType;
}

export const LazyRoute: React.FC<LazyRouteProps> = ({ 
  importFunc, 
  fallback: CustomFallback = LoadingFallback 
}) => {
  const LazyComponent = lazy(importFunc);

  return (
    <Suspense fallback={<CustomFallback />}>
      <LazyComponent />
    </Suspense>
  );
};

// Pre-configured lazy routes for common pages
export const LazyDashboard = lazy(() => import('@/pages/Dashboard'));
export const LazyBiologicalAge = lazy(() => import('@/pages/BiologicalAge'));

export default LazyRoute;