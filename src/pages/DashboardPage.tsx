import React from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, Activity, TrendingUp, Calendar, Target } from 'lucide-react';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { useCachedAnalytics } from '@/hooks/useCachedAnalytics';
import DashboardQuickActionsGrid from '@/components/dashboard/DashboardQuickActionsGrid';
import DashboardChatsList from '@/components/dashboard/DashboardChatsList';
import MyGoalsSection from '@/components/dashboard/MyGoalsSection';

import PriorityMetricsSection from '@/components/dashboard/PriorityMetricsSection';

const DashboardPage = () => {
  const { user } = useAuth();
  const { profileData } = useProfile();
  const { healthProfile } = useHealthProfile();
  const { analytics, isLoading: analyticsLoading } = useCachedAnalytics();

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
      <div className="space-y-8">
        {/* Заголовок */}
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Добро пожаловать, {userName}!
          </h1>
          <p className="text-muted-foreground">
            Управляйте своим здоровьем с помощью ИИ-платформы
          </p>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Левая колонка - Быстрые действия */}
          <div className="lg:col-span-2 space-y-6">
            <DashboardQuickActionsGrid />

            {/* Приоритетные метрики */}
            <PriorityMetricsSection />
          </div>

          {/* Правая колонка - Данные здоровья */}
          <div className="space-y-6">
            {/* Индекс здоровья */}
            <Card className="shadow-sm border-gray-200/80">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-base font-semibold">Индекс здоровья</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analyticsLoading ? (
                  <div className="text-center py-6">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-xs text-gray-600">Загружаем индекс здоровья...</p>
                  </div>
                ) : currentHealthScore !== undefined ? (
                  <div className="text-center">
                    <div className={`text-3xl font-bold mb-2 ${getScoreColor(currentHealthScore)}`}>
                      {Math.round(currentHealthScore)}%
                    </div>
                    <Progress 
                      value={currentHealthScore} 
                      className={`h-2 ${getScoreGradient(currentHealthScore)}`}
                    />
                    {analytics && (
                      <p className="text-xs text-gray-500 mt-1">
                        Данные из ИИ-аналитики
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Heart className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-600">Нет данных об индексе здоровья</p>
                    <p className="text-xs text-gray-500 mt-1">Заполните профиль для получения аналитики</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Activity className="h-3 w-3 text-blue-500" />
                      <span className="text-xs text-gray-600">Биовозраст</span>
                    </div>
                    <div className="text-xl font-semibold text-gray-900">
                      {currentBiologicalAge}
                    </div>
                    <div className="text-xs text-gray-500">лет</div>
                    {!healthProfile && (
                      <p className="text-xs text-orange-500 mt-1">
                        Создайте профиль
                      </p>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Activity className="h-3 w-3 text-blue-500" />
                      <span className="text-xs text-gray-600">Скорость старения</span>
                    </div>
                    <div className="text-xl font-semibold text-gray-900">
                      0.85
                    </div>
                    <div className="text-xs text-gray-500">коэффициент</div>
                    <div className="text-xs text-green-600 mt-1">
                      ↓15% улучшение
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Мои цели */}
            <MyGoalsSection />

            {/* Истории чатов с ИИ */}
            <DashboardChatsList />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;