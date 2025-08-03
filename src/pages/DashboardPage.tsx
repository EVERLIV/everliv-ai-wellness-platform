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


        <div className="space-y-5">
          {/* Индекс здоровья - компактный светло-зеленый блок */}
          <div className="bg-gradient-to-r from-neutral-100 to-neutral-50 border border-neutral-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                  <Heart className="h-4 w-4 text-brand-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Индекс здоровья</h2>
                  <p className="text-xs text-muted-foreground">Общий показатель</p>
                </div>
              </div>
              
              {analyticsLoading ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-primary"></div>
                </div>
              ) : currentHealthScore !== undefined ? (
                <div className="text-right">
                  <div className="text-2xl font-bold text-brand-primary mb-1">
                    {Math.round(currentHealthScore)}%
                  </div>
                  <div className="w-16 bg-neutral-200 rounded-full h-1.5">
                    <div 
                      className="bg-brand-primary h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${currentHealthScore}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Нет данных</p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-neutral-200">
              <div className="text-center bg-white/50 rounded-lg p-2">
                <div className="text-lg font-bold text-foreground">{currentBiologicalAge}</div>
                <div className="text-xs text-muted-foreground">Биовозраст</div>
              </div>
              <div className="text-center bg-white/50 rounded-lg p-2">
                <div className="text-lg font-bold text-foreground">0.85</div>
                <div className="text-xs text-brand-success">↓15% скорость</div>
              </div>
            </div>
          </div>

          {/* Мои цели */}
          <MyGoalsSection />

          {/* Быстрые действия */}
          <DashboardQuickActionsGrid />

          {/* Метрики и риски */}
          <PriorityMetricsSection />
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;