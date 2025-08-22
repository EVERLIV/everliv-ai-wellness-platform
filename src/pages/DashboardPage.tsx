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
      <div className="space-y-8">
        {/* Заголовок */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 via-brand-accent/5 to-transparent rounded-2xl"></div>
          <div className="relative p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary bg-clip-text text-transparent animate-fade-in">
              Добро пожаловать, {userName}!
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed animate-fade-in">
              Управляйте своим здоровьем с помощью ИИ-платформы
            </p>
          </div>
        </div>


        {isMobile ? (
          // Мобильная версия - новый порядок блоков
          <div className="space-y-6">
            {/* 1. Индекс здоровья */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-card via-neutral-50/50 to-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
              <div className="absolute inset-0 bg-gradient-glass"></div>
              <CardHeader className="relative pb-2">
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <div className="p-2 bg-gradient-to-br from-brand-error/20 to-brand-error/10 rounded-lg">
                    <Heart className="h-4 w-4 text-brand-error" />
                  </div>
                  <span className="text-base font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    Индекс здоровья
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-4">
                {analyticsLoading ? (
                  <div className="text-center py-8">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mx-auto mb-4"></div>
                      <div className="absolute inset-0 w-8 h-8 border-2 border-transparent border-t-brand-accent rounded-full animate-spin mx-auto mt-2" style={{animationDirection: 'reverse'}}></div>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">Анализируем ваше здоровье...</p>
                    <p className="text-xs text-muted-foreground/80 mt-1">Обработка ИИ-данных</p>
                  </div>
                ) : currentHealthScore !== undefined ? (
                  <div className="text-center space-y-4">
                    <div className="relative">
                      <div className={`text-4xl font-bold mb-3 transition-all duration-500 ${getScoreColor(currentHealthScore)}`}>
                        {Math.round(currentHealthScore)}%
                      </div>
                      <Progress 
                        value={currentHealthScore} 
                        className={`h-3 rounded-full ${getScoreGradient(currentHealthScore)} transition-all duration-700 shadow-sm`}
                      />
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-md animate-pulse"></div>
                    </div>
                    {analytics && (
                      <div className="p-3 bg-gradient-to-r from-brand-primary/5 to-brand-accent/5 rounded-lg border border-brand-primary/10">
                        <p className="text-xs text-brand-primary font-medium">
                          ✨ Данные из ИИ-аналитики
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="relative mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mx-auto">
                        <Heart className="h-8 w-8 text-neutral-400" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
                    </div>
                    <h3 className="text-sm font-medium text-foreground mb-2">Нет данных об индексе здоровья</h3>
                    <p className="text-xs text-muted-foreground mb-3">Заполните профиль для получения персональной аналитики</p>
                    <button className="text-xs text-brand-primary font-medium hover:text-brand-primary-dark transition-colors">
                      Перейти к профилю →
                    </button>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                  <div className="text-center p-3 bg-gradient-to-br from-brand-primary/5 to-brand-primary/10 rounded-xl border border-brand-primary/20 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="p-1 bg-brand-primary/20 rounded-full">
                        <Activity className="h-3 w-3 text-brand-primary" />
                      </div>
                      <span className="text-xs font-medium text-brand-primary">Биовозраст</span>
                    </div>
                    <div className="text-2xl font-bold text-brand-primary mb-1">
                      {currentBiologicalAge}
                    </div>
                    <div className="text-xs text-brand-primary/70">лет</div>
                    {!healthProfile && (
                      <p className="text-xs text-brand-warning mt-2 font-medium">
                        Создайте профиль
                      </p>
                    )}
                  </div>
                  
                  <div className="text-center p-3 bg-gradient-to-br from-brand-success/5 to-brand-success/10 rounded-xl border border-brand-success/20 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="p-1 bg-brand-success/20 rounded-full">
                        <TrendingUp className="h-3 w-3 text-brand-success" />
                      </div>
                      <span className="text-xs font-medium text-brand-success">Скорость старения</span>
                    </div>
                    <div className="text-2xl font-bold text-brand-success mb-1">
                      0.85
                    </div>
                    <div className="text-xs text-brand-success/70">коэффициент</div>
                    <div className="text-xs text-brand-success font-medium mt-2 flex items-center justify-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      15% улучшение
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. Мои цели */}
            <MyGoalsSection />

            {/* 3. Быстрые действия */}
            <DashboardQuickActionsGrid />

            {/* 4. ИИ-предикты рисков заболеваний и 5. Топ-5 критических биомаркеров */}
            <PriorityMetricsSection />

            {/* 6. Истории чатов с ИИ */}
            <DashboardChatsList />
          </div>
        ) : (
          // Десктопная версия - улучшенная компоновка
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Левая колонка - Быстрые действия и метрики */}
            <div className="lg:col-span-2 space-y-8">
              <DashboardQuickActionsGrid />

              {/* Приоритетные метрики */}
              <div className="space-y-6">
                <PriorityMetricsSection />
              </div>
            </div>

            {/* Правая колонка - Данные здоровья */}
            <div className="space-y-8">
              {/* Индекс здоровья */}
              <Card className="relative overflow-hidden bg-gradient-to-br from-card via-neutral-50/50 to-card border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-glass"></div>
                <CardHeader className="relative pb-3">
                  <CardTitle className="flex items-center gap-3 text-foreground">
                    <div className="p-2 bg-gradient-to-br from-brand-error/20 to-brand-error/10 rounded-lg">
                      <Heart className="h-5 w-5 text-brand-error" />
                    </div>
                    <span className="text-lg font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                      Индекс здоровья
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative space-y-5">
                  {analyticsLoading ? (
                    <div className="text-center py-10">
                      <div className="relative">
                        <div className="w-14 h-14 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mx-auto mb-4"></div>
                        <div className="absolute inset-0 w-10 h-10 border-2 border-transparent border-t-brand-accent rounded-full animate-spin mx-auto mt-2" style={{animationDirection: 'reverse'}}></div>
                      </div>
                      <p className="text-base font-medium text-muted-foreground">Анализируем ваше здоровье...</p>
                      <p className="text-sm text-muted-foreground/80 mt-1">Обработка ИИ-данных</p>
                    </div>
                  ) : currentHealthScore !== undefined ? (
                    <div className="text-center space-y-5">
                      <div className="relative">
                        <div className={`text-5xl font-bold mb-4 transition-all duration-500 ${getScoreColor(currentHealthScore)}`}>
                          {Math.round(currentHealthScore)}%
                        </div>
                        <Progress 
                          value={currentHealthScore} 
                          className={`h-4 rounded-full ${getScoreGradient(currentHealthScore)} transition-all duration-700 shadow-md`}
                        />
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg animate-pulse"></div>
                      </div>
                      {analytics && (
                        <div className="p-4 bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 rounded-xl border border-brand-primary/20">
                          <p className="text-sm text-brand-primary font-semibold">
                            ✨ Данные из ИИ-аналитики
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <div className="relative mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mx-auto">
                          <Heart className="h-10 w-10 text-neutral-400" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
                      </div>
                      <h3 className="text-base font-semibold text-foreground mb-3">Нет данных об индексе здоровья</h3>
                      <p className="text-sm text-muted-foreground mb-4">Заполните профиль для получения персональной аналитики</p>
                      <button className="text-sm text-brand-primary font-semibold hover:text-brand-primary-dark transition-colors">
                        Перейти к профилю →
                      </button>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 pt-5 border-t border-border/50">
                    <div className="text-center p-4 bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 rounded-xl border border-brand-primary/20 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="p-1.5 bg-brand-primary/20 rounded-full">
                          <Activity className="h-4 w-4 text-brand-primary" />
                        </div>
                        <span className="text-sm font-semibold text-brand-primary">Биовозраст</span>
                      </div>
                      <div className="text-3xl font-bold text-brand-primary mb-1">
                        {currentBiologicalAge}
                      </div>
                      <div className="text-sm text-brand-primary/70">лет</div>
                      {!healthProfile && (
                        <p className="text-xs text-brand-warning mt-2 font-semibold">
                          Создайте профиль
                        </p>
                      )}
                    </div>
                    
                    <div className="text-center p-4 bg-gradient-to-br from-brand-success/10 to-brand-success/5 rounded-xl border border-brand-success/20 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="p-1.5 bg-brand-success/20 rounded-full">
                          <TrendingUp className="h-4 w-4 text-brand-success" />
                        </div>
                        <span className="text-sm font-semibold text-brand-success">Скорость старения</span>
                      </div>
                      <div className="text-3xl font-bold text-brand-success mb-1">
                        0.85
                      </div>
                      <div className="text-sm text-brand-success/70">коэффициент</div>
                      <div className="text-sm text-brand-success font-semibold mt-2 flex items-center justify-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        15% улучшение
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
        )}
      </div>
    </AppLayout>
  );
};

export default DashboardPage;