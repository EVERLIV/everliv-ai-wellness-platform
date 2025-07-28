
import React, { Suspense } from 'react';
import { Grid } from '@/components/ui/grid';
import { useDashboardData } from '@/hooks/useDashboardData';
import { SkeletonCard, SkeletonStats } from '@/components/performance/SkeletonCard';
import { LazyOnView, createLazyComponent } from '@/components/performance/LazyLoader';
import { logger } from '@/services/logger/LoggerService';

// Lazy loaded components
const QuickStatsCards = createLazyComponent(() => import('./QuickStatsCards'));
const RecentActivityFeed = createLazyComponent(() => import('./RecentActivityFeed'));
const CheckupsList = createLazyComponent(() => import('./CheckupsList'));
const HealthProfileQuickView = createLazyComponent(() => import('./HealthProfileQuickView'));

interface DashboardOverviewProps {
  patientData?: any; // Теперь опциональный, так как данные берем из хука
}

const DashboardOverview: React.FC<DashboardOverviewProps> = () => {
  const {
    isLoading,
    isError,
    healthProfile,
    recentMetrics,
    medicalAnalyses
  } = useDashboardData();

  React.useEffect(() => {
    logger.info('Dashboard overview rendered', {
      isLoading,
      hasHealthProfile: !!healthProfile,
      metricsCount: recentMetrics.length
    }, 'DashboardOverview');
  }, [isLoading, healthProfile, recentMetrics.length]);

  if (isError) {
    logger.error('Dashboard overview error', {}, 'DashboardOverview');
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Произошла ошибка при загрузке данных</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Быстрая статистика - критическая секция, загружается сразу */}
      <Suspense fallback={<SkeletonStats />}>
        <QuickStatsCards />
      </Suspense>
      
      {/* Основная сетка - ленивая загрузка при скролле */}
      <LazyOnView fallback={() => <SkeletonCard lines={5} />}>
        <Grid className="grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Левая колонка */}
          <div className="space-y-6">
            <Suspense fallback={<SkeletonCard showHeader={true} lines={4} />}>
              <CheckupsList />
            </Suspense>
            <Suspense fallback={<SkeletonCard showHeader={true} lines={3} />}>
              <HealthProfileQuickView />
            </Suspense>
          </div>
          
          {/* Правая колонка */}
          <div className="space-y-6">
            <Suspense fallback={<SkeletonCard showHeader={true} lines={5} />}>
              <RecentActivityFeed />
            </Suspense>
          </div>
        </Grid>
      </LazyOnView>
    </div>
  );
};

export default DashboardOverview;
