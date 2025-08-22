import React from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useIsMobile } from '@/hooks/use-mobile';
import { LifestyleHero } from '@/components/dashboard/modern/LifestyleHero';
import { ActivityRings } from '@/components/dashboard/modern/ActivityRings';
import { HealthMetricsGrid } from '@/components/dashboard/modern/HealthMetricsGrid';
import { WeeklyProgress } from '@/components/dashboard/modern/WeeklyProgress';
import { QuickActions } from '@/components/dashboard/modern/QuickActions';
import { TodaySchedule } from '@/components/dashboard/modern/TodaySchedule';

const DashboardPage = () => {
  const { user } = useAuth();
  const { profileData } = useProfile();
  const isMobile = useIsMobile();

  const userName = profileData?.nickname || profileData?.first_name || user?.user_metadata?.first_name || user?.user_metadata?.full_name || "Пользователь";

  return (
    <AppLayout>
      {/* Полноширинный фон */}
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Hero Section - полная ширина */}
        <div className="w-full">
          <LifestyleHero userName={userName} />
        </div>
        
        {/* Основной контент с отступами только по бокам */}
        <div className="px-4 pb-6">
          {isMobile ? (
            // Мобильная версия - вертикальный стек
            <div className="space-y-6">
              <ActivityRings />
              <QuickActions />
              <HealthMetricsGrid />
              <TodaySchedule />
              <WeeklyProgress />
            </div>
          ) : (
            // Десктопная версия
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8 space-y-6">
                  <QuickActions />
                  <HealthMetricsGrid />
                  <WeeklyProgress />
                </div>
                <div className="col-span-4 space-y-6">
                  <ActivityRings />
                  <TodaySchedule />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;