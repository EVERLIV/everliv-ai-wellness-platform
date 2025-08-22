import React from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useIsMobile } from '@/hooks/use-mobile';
import { LifestyleHero } from '@/components/dashboard/modern/LifestyleHero';
import { MyGoals } from '@/components/dashboard/modern/MyGoals';
import { HealthMetricsGrid } from '@/components/dashboard/modern/HealthMetricsGrid';
import { WeeklyProgress } from '@/components/dashboard/modern/WeeklyProgress';
import { QuickTools } from '@/components/dashboard/modern/QuickTools';
import { TodaySchedule } from '@/components/dashboard/modern/TodaySchedule';

const DashboardPage = () => {
  const { user } = useAuth();
  const { profileData } = useProfile();
  const isMobile = useIsMobile();

  const userName = profileData?.nickname || profileData?.first_name || user?.user_metadata?.first_name || user?.user_metadata?.full_name || "Пользователь";

  return (
    <AppLayout>
      {/* Современный фон с градиентом */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
        {/* Hero Section */}
        <div className="w-full">
          <LifestyleHero userName={userName} />
        </div>
        
        {/* Основной контент */}
        <div className="w-full py-8">
          {isMobile ? (
            // Мобильная версия - компактный стек
            <div className="space-y-3">
              <MyGoals />
              <QuickTools />
              <HealthMetricsGrid />
              <TodaySchedule />
              <WeeklyProgress />
            </div>
          ) : (
            // Десктопная версия - полная ширина
            <div className="w-full px-4">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-8 space-y-4">
                  <QuickTools />
                  <HealthMetricsGrid />
                  <WeeklyProgress />
                </div>
                <div className="col-span-4 space-y-4">
                  <MyGoals />
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