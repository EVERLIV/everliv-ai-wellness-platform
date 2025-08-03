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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl">
        {/* Mobile-First Header с зеленым градиентом */}
        <div className="bg-card rounded-3xl shadow-lg border border-brand-primary/20 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
                <Heart className="h-6 w-6 text-brand-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Привет, {userName}! 👋
                </h1>
                <p className="text-muted-foreground">
                  Управляйте здоровьем с ИИ
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Индекс здоровья - зеленый блок */}
          <div className="bg-card rounded-3xl shadow-lg border border-brand-primary/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
                  <Heart className="h-5 w-5 text-brand-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Индекс здоровья</h2>
                  <p className="text-sm text-muted-foreground">Общий показатель</p>
                </div>
              </div>
              
              {analyticsLoading ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary"></div>
                </div>
              ) : currentHealthScore !== undefined ? (
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-primary mb-2">
                    {Math.round(currentHealthScore)}%
                  </div>
                  <div className="w-20 bg-brand-primary/20 rounded-full h-2">
                    <div 
                      className="bg-brand-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${currentHealthScore}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Нет данных</p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
                <div className="text-2xl font-bold text-brand-primary">{currentBiologicalAge}</div>
                <div className="text-sm text-brand-primary/80 font-medium">Биовозраст</div>
              </div>
              <div className="text-center p-4 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
                <div className="text-2xl font-bold text-brand-primary">0.85</div>
                <div className="text-sm text-brand-primary/80 font-medium">↓15% скорость</div>
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
    </div>
  );
};

export default DashboardPage;