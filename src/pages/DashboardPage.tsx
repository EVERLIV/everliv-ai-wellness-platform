import React from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { HealthLayout, HealthHeader, HealthSection } from '@/design-system/components/HealthLayout';
import { MetricCard } from '@/design-system/components/HealthMetrics';
import { Heart, Activity, TrendingUp, Calendar, Target } from 'lucide-react';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { useCachedAnalytics } from '@/hooks/useCachedAnalytics';
import { useIsMobile } from '@/hooks/use-mobile';
import DashboardQuickActionsGrid from '@/components/dashboard/DashboardQuickActionsGrid';
import DashboardChatsList from '@/components/dashboard/DashboardChatsList';
import MyGoalsSection from '@/components/dashboard/MyGoalsSection';
import PriorityMetricsSection from '@/components/dashboard/PriorityMetricsSection';

const DashboardPage = () => {
  const { user } = useAuth();
  const { profileData } = useProfile();
  const { healthProfile } = useHealthProfile();
  const { analytics, isLoading: analyticsLoading } = useCachedAnalytics();
  const isMobile = useIsMobile();

  // ИСПРАВЛЕННАЯ логика: приоритет никнейму из профиля
  const userName = profileData?.nickname || profileData?.first_name || user?.user_metadata?.first_name || user?.user_metadata?.full_name || "Пользователь";

  console.log('🔧 DashboardPage: ПРАВИЛЬНАЯ логика имени:', {
    profileNickname: profileData?.nickname,
    profileFirstName: profileData?.first_name,
    userMetadataFirstName: user?.user_metadata?.first_name,
    userMetadataFullName: user?.user_metadata?.full_name,
    finalUserName: userName,
    hasProfileData: !!profileData
  });

  // Используем данные из аналитики
  const currentHealthScore = analytics?.healthScore;
  
  // Расчет биологического возраста на основе данных профиля здоровья
  const calculateBiologicalAge = () => {
    if (!healthProfile?.age) return 35;
    
    let bioAge = healthProfile.age;
    
    // Факторы старения
    if (healthProfile.stressLevel && healthProfile.stressLevel > 7) bioAge += 3;
    if (healthProfile.sleepHours && healthProfile.sleepHours < 6) bioAge += 2;
    if (healthProfile.exerciseFrequency && healthProfile.exerciseFrequency < 1) bioAge += 5;
    
    // Факторы омоложения
    if (healthProfile.exerciseFrequency && healthProfile.exerciseFrequency >= 4) bioAge -= 2;
    if (healthProfile.sleepHours && healthProfile.sleepHours >= 7 && healthProfile.sleepHours <= 9) bioAge -= 1;
    if (healthProfile.stressLevel && healthProfile.stressLevel <= 4) bioAge -= 2;
    
    return Math.max(18, Math.min(bioAge, healthProfile.age + 10));
  };

  const currentBiologicalAge = calculateBiologicalAge();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return '[&>div]:bg-green-500';
    if (score >= 60) return '[&>div]:bg-yellow-500';
    return '[&>div]:bg-red-500';
  };

  return (
    <AppLayout>
      <HealthLayout variant="gradient" padding="lg">
        {/* EVA Health Header */}
        <HealthHeader
          title={`Добро пожаловать, ${userName}!`}
          subtitle="Управляйте своим здоровьем с помощью ИИ-платформы"
          avatar={
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-eva-primary to-eva-accent flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
          }
        />

        {isMobile ? (
          // Мобильная версия с EVA layout
          <div className="space-y-6">
            {/* 1. Мои цели */}
            <MyGoalsSection />

            {/* 2. Быстрые действия */}
            <DashboardQuickActionsGrid />

            {/* 3. ИИ-предикты рисков заболеваний и Топ-5 критических биомаркеров */}
            <PriorityMetricsSection />

            {/* 4. Истории чатов с ИИ */}
            <DashboardChatsList />
          </div>
        ) : (
          // Десктопная версия с EVA layout
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Левая колонка - Быстрые действия */}
            <div className="lg:col-span-2 space-y-8">
              <DashboardQuickActionsGrid />

              {/* Приоритетные метрики */}
              <PriorityMetricsSection />
            </div>

            {/* Правая колонка - Данные здоровья */}
            <div className="space-y-8">
              {/* Мои цели */}
              <MyGoalsSection />

              {/* Истории чатов с ИИ */}
              <DashboardChatsList />
            </div>
          </div>
        )}
      </HealthLayout>
    </AppLayout>
  );
};

export default DashboardPage;