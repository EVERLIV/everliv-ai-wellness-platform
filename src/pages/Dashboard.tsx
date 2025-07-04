
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

const Dashboard = () => {
  const { user, isLoading } = useSmartAuth();
  const { analytics } = useCachedAnalytics();
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

  // В dev режиме не показываем загрузку так долго
  if (!isLoaded || (isLoading && !isDevMode)) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary shadow-lg"></div>
            <p className="text-gray-500 font-medium text-adaptive-base mobile-text-wrap text-center">
              {isDevMode ? 'Инициализация dev режима...' : 'Загрузка панели управления...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // В dev режиме создаем фиктивного пользователя если его нет
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.nickname || "Пользователь";
  
  // Используем данные из аналитики если они есть, иначе fallback значения
  const healthScore = analytics?.healthScore || 85;
  const biologicalAge = 42; // Fallback значение, будет пересчитано в компоненте

  console.log('🔧 Dashboard: Rendering with data:', {
    userName,
    healthScore: analytics?.healthScore,
    hasAnalytics: !!analytics
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
              healthScore={healthScore} 
              biologicalAge={biologicalAge} 
            />
          }
        />
      </div>
      
      {/* Персонализированные подсказки по здоровью */}
      <PersonalizedHealthTips />
      
      <MinimalFooter />
    </div>
  );
};

export default Dashboard;
