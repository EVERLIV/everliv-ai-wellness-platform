
import React, { useState, useEffect } from "react";
import { useSmartAuth } from "@/hooks/useSmartAuth";
import Header from "@/components/Header";
import PersonalizedHealthTips from "@/components/dashboard/PersonalizedHealthTips";
import MinimalFooter from "@/components/MinimalFooter";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardLeftColumn from "@/components/dashboard/DashboardLeftColumn";
import DashboardRightColumn from "@/components/dashboard/DashboardRightColumn";
import { useCachedAnalytics } from "@/hooks/useCachedAnalytics";
import { useRecommendationsInvalidation } from "@/hooks/useRecommendationsInvalidation";
import { useIsMobile } from "@/hooks/use-mobile";
import { isDevelopmentMode } from "@/utils/devMode";
import { useProfile } from "@/hooks/useProfile";

const Dashboard = () => {
  const { user, isLoading } = useSmartAuth();
  const { analytics } = useCachedAnalytics();
  const { profileData } = useProfile();
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useIsMobile();
  const isDevMode = isDevelopmentMode();
  
  // Инициализируем отслеживание изменений для инвалидации кэша рекомендаций
  // useRecommendationsInvalidation(); // Временно отключено для отладки

  console.log('🔧 Dashboard: Auth state check', {
    user: user?.email,
    isLoading,
    isDevMode,
    hasUser: !!user,
    isMobile,
    analyticsHealthScore: analytics?.healthScore
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Упрощаем логику загрузки - показываем Dashboard даже если данные еще загружаются
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary shadow-lg"></div>
            <p className="text-gray-500 font-medium text-adaptive-base mobile-text-wrap text-center">
              Инициализация приложения...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Получаем имя пользователя с ПРАВИЛЬНЫМ приоритетом: никнейм из профиля -> имя из профиля -> имя из метаданных
  const userName = profileData?.nickname || profileData?.first_name || user?.user_metadata?.first_name || user?.user_metadata?.full_name || "Пользователь";
  
  console.log('🔧 Dashboard: User name data ИСПРАВЛЕННАЯ ЛОГИКА:', {
    profileNickname: profileData?.nickname,
    profileFirstName: profileData?.first_name,
    userMetadataFirstName: user?.user_metadata?.first_name,
    userMetadataFullName: user?.user_metadata?.full_name,
    finalUserName: userName,
    hasProfileData: !!profileData,
    profileDataNickname: profileData?.nickname,
    userEmail: user?.email,
    isLoadingProfile: isLoading,
    ПРИОРИТЕТ: 'profileData.nickname ПЕРВЫЙ!'
  });
  
  console.log('🚨 ВАЖНО: Финальное имя для передачи в SimpleWelcomeCard:', userName);
  
  // ВАЖНО: НЕ показываем fallback значения, ждем реальные данные
  // Это предотвращает мерцание с неправильными значениями
  const healthScore = analytics?.healthScore; // undefined если данных еще нет
  const biologicalAge = analytics?.biologicalAge || 42; // Fallback только для биологического возраста

  console.log('🔧 Dashboard: Rendering with data:', {
    userName,
    healthScore: analytics?.healthScore,
    hasAnalytics: !!analytics,
    isAnalyticsLoading: isLoading // добавляем состояние загрузки аналитики
  });

  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${isMobile ? 'mobile-optimized' : ''}`}>
      <Header />
      <div className="pt-16 flex-1">
        <DashboardLayout
          leftColumn={
            <DashboardLeftColumn userName={userName} />
          }
          rightColumn={
            <DashboardRightColumn 
              healthScore={healthScore} // передаем undefined если данных нет
              biologicalAge={biologicalAge} 
              isLoadingAnalytics={!analytics && isLoading} // указываем что данные загружаются
            />
          }
        />
      </div>
      
      {/* Персонализированные подсказки по здоровью */}
      {/* <PersonalizedHealthTips /> */}
      
      <MinimalFooter />
    </div>
  );
};

export default Dashboard;
