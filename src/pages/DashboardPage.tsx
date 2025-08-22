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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Hero Section */}
          <LifestyleHero userName={userName} />
          
          {isMobile ? (
            // Мобильная версия - стек вертикально
            <div className="space-y-6">
              <ActivityRings />
              <QuickActions />
              <HealthMetricsGrid />
              <TodaySchedule />
              <WeeklyProgress />
            </div>
          ) : (
            // Десктопная версия - современная сетка
            <div className="grid grid-cols-12 gap-6">
              {/* Левая колонка - основной контент */}
              <div className="col-span-8 space-y-6">
                <QuickActions />
                <HealthMetricsGrid />
                <WeeklyProgress />
              </div>
              
              {/* Правая колонка - боковые виджеты */}
              <div className="col-span-4 space-y-6">
                <ActivityRings />
                <TodaySchedule />
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;