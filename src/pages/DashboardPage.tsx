import React from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { NewCard, NewCardHeader, NewCardTitle, NewCardContent } from '@/components/ui/new-card';
import { NewButton } from '@/components/ui/new-button';
import { Heart, Activity, TrendingUp, Calendar, Target, Sparkles } from 'lucide-react';
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
      <div className="min-h-screen bg-background">
        {/* НОВЫЙ HEADER С GLASSMORPHISM */}
        <div className="relative overflow-hidden">
          {/* Gradient Background */}
          <div className="absolute inset-0 gradient-primary opacity-10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent opacity-5 rounded-full blur-3xl"></div>
          
          <div className="relative px-6 py-12 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {/* Avatar с новым дизайном */}
                  <div className="w-16 h-16 rounded-2xl gradient-primary p-0.5 shadow-glow-primary">
                    <div className="w-full h-full bg-surface rounded-2xl flex items-center justify-center">
                      <Heart className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  
                  <div>
                    <h1 className="text-4xl font-bold text-gradient-primary">
                      Добро пожаловать, {userName}!
                    </h1>
                    <p className="text-lg text-foreground-medium mt-2">
                      Управляйте своим здоровьем с помощью ИИ-платформы
                    </p>
                  </div>
                </div>
                
                <NewButton 
                  variant="glass" 
                  size="lg"
                  leftIcon={<Sparkles className="w-5 h-5" />}
                  className="shadow-glow-primary"
                >
                  ИИ Анализ
                </NewButton>
              </div>
            </div>
          </div>
        </div>

        {/* ОСНОВНОЙ КОНТЕНТ */}
        <div className="px-6 py-8 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            {isMobile ? (
              // Мобильная версия
              <div className="space-y-8">
                <MyGoalsSection />
                <DashboardQuickActionsGrid />
                <PriorityMetricsSection />
                <DashboardChatsList />
              </div>
            ) : (
              // Десктопная версия с новым layout
              <div className="grid grid-cols-12 gap-8">
                {/* Левая колонка - 8 columns */}
                <div className="col-span-8 space-y-8">
                  <DashboardQuickActionsGrid />
                  <PriorityMetricsSection />
                </div>

                {/* Правая колонка - 4 columns */}
                <div className="col-span-4 space-y-8">
                  <MyGoalsSection />
                  <DashboardChatsList />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;