import React from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
      <div className="space-y-6 px-5 pb-6">
        {/* Mobile-First Header с градиентом */}
        <div className="bg-gradient-to-r from-brand-primary to-brand-primary-light rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">
                Привет, {userName}! 👋
              </h1>
              <p className="text-white/90 text-sm">
                Управляйте здоровьем с ИИ
              </p>
            </div>
          </div>
        </div>


        {isMobile ? (
          // Мобильная версия с новым дизайном
          <div className="space-y-5">
            {/* 1. Индекс здоровья - яркая карточка */}
            <div className="bg-gradient-to-br from-brand-primary to-brand-primary-light rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-bold">Индекс здоровья</h2>
              </div>
              
              {analyticsLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2"></div>
                  <p className="text-sm text-white/80">Загружаем...</p>
                </div>
              ) : currentHealthScore !== undefined ? (
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold mb-2 text-white">
                    {Math.round(currentHealthScore)}%
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3 mb-2">
                    <div 
                      className="bg-brand-accent h-3 rounded-full transition-all duration-500"
                      style={{ width: `${currentHealthScore}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-white/80">Данные из ИИ-аналитики</p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Heart className="h-8 w-8 text-white/60 mx-auto mb-2" />
                  <p className="text-sm text-white/80">Заполните профиль для аналитики</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                  <div className="text-2xl font-bold text-white mb-1">
                    {currentBiologicalAge}
                  </div>
                  <div className="text-xs text-white/80">Биовозраст</div>
                  <div className="text-xs text-white/70">лет</div>
                </div>
                
                <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                  <div className="text-2xl font-bold text-white mb-1">
                    0.85
                  </div>
                  <div className="text-xs text-white/80">Скорость</div>
                  <div className="text-xs text-brand-accent font-medium">↓15%</div>
                </div>
              </div>
            </div>

            {/* 2. Мои цели - улучшенный стиль */}
            <MyGoalsSection />

            {/* 3. Быстрые действия - с обновленными стилями */}
            <DashboardQuickActionsGrid />

            {/* 4. Метрики и риски */}
            <PriorityMetricsSection />

            {/* 5. Чаты с ИИ */}
            <DashboardChatsList />
          </div>
        ) : (
          // Единый мобильный дизайн - убираем разделение
          <div className="space-y-5">
            {/* Индекс здоровья - мобильный дизайн */}
            <div className="bg-gradient-to-br from-brand-primary to-brand-primary-light rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-bold">Индекс здоровья</h2>
              </div>
              
              {analyticsLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2"></div>
                  <p className="text-sm text-white/80">Загружаем...</p>
                </div>
              ) : currentHealthScore !== undefined ? (
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold mb-2 text-white">
                    {Math.round(currentHealthScore)}%
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3 mb-2">
                    <div 
                      className="bg-brand-accent h-3 rounded-full transition-all duration-500"
                      style={{ width: `${currentHealthScore}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-white/80">Данные из ИИ-аналитики</p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Heart className="h-8 w-8 text-white/60 mx-auto mb-2" />
                  <p className="text-sm text-white/80">Заполните профиль для аналитики</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                  <div className="text-2xl font-bold text-white mb-1">
                    {currentBiologicalAge}
                  </div>
                  <div className="text-xs text-white/80">Биовозраст</div>
                  <div className="text-xs text-white/70">лет</div>
                </div>
                
                <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                  <div className="text-2xl font-bold text-white mb-1">
                    0.85
                  </div>
                  <div className="text-xs text-white/80">Скорость</div>
                  <div className="text-xs text-brand-accent font-medium">↓15%</div>
                </div>
              </div>
            </div>

            {/* Мои цели */}
            <MyGoalsSection />

            {/* Быстрые действия */}
            <DashboardQuickActionsGrid />

            {/* Метрики и риски */}
            <PriorityMetricsSection />

            {/* Чаты с ИИ */}
            <DashboardChatsList />
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default DashboardPage;