
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import AnalyticsPageLayout from "@/components/analytics/AnalyticsPageLayout";
import AnalyticsLoadingIndicator from "@/components/analytics/AnalyticsLoadingIndicator";
import AnalyticsEmptyState from "@/components/analytics/AnalyticsEmptyState";
import AnalyticsDataRequiredState from "@/components/analytics/AnalyticsDataRequiredState";
import AnalyticsContent from "@/components/analytics/AnalyticsContent";
import { useCachedAnalytics } from "@/hooks/useCachedAnalytics";

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const analysisId = searchParams.get('id');
  
  const {
    analytics,
    isLoading: isLoadingAnalytics,
    isGenerating,
    loadingStep,
    hasHealthProfile,
    hasAnalyses,
    generateAnalytics
  } = useCachedAnalytics();

  console.log('Analytics Page State:', {
    user: !!user,
    analysisId,
    hasAnalytics: !!analytics,
    isLoadingAnalytics,
    isGenerating,
    loadingStep,
    hasHealthProfile,
    hasAnalyses
  });

  // Проверка пользователя
  if (!user) {
    return (
      <AnalyticsPageLayout>
        <div className="flex-grow flex items-center justify-center">
          <p>Для доступа к аналитике необходимо войти в систему</p>
        </div>
      </AnalyticsPageLayout>
    );
  }

  // Показываем индикатор загрузки если идет генерация
  if (isGenerating) {
    console.log('Rendering loading indicator');
    return (
      <AnalyticsPageLayout>
        <AnalyticsLoadingIndicator 
          isGenerating={isGenerating}
          loadingStep={loadingStep}
        />
      </AnalyticsPageLayout>
    );
  }

  // Показываем начальную загрузку только для общей аналитики
  if (isLoadingAnalytics) {
    console.log('Rendering initial loading');
    return (
      <AnalyticsPageLayout>
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-gray-500">Загрузка аналитики...</p>
          </div>
        </div>
      </AnalyticsPageLayout>
    );
  }

  // Если нет необходимых данных
  if (!hasHealthProfile || !hasAnalyses) {
    console.log('Rendering data required state');
    return (
      <AnalyticsPageLayout>
        <AnalyticsDataRequiredState 
          hasHealthProfile={hasHealthProfile}
          hasAnalyses={hasAnalyses}
        />
      </AnalyticsPageLayout>
    );
  }

  // Если аналитика не сгенерирована, но данные есть
  if (!analytics) {
    console.log('Rendering no analytics state');
    return (
      <AnalyticsPageLayout>
        <AnalyticsEmptyState 
          onGenerate={generateAnalytics}
          isGenerating={isGenerating}
        />
      </AnalyticsPageLayout>
    );
  }

  // Показываем сгенерированную аналитику
  console.log('Rendering analytics data');
  
  return (
    <AnalyticsPageLayout
      healthScore={analytics.healthScore}
      riskLevel={analytics.riskLevel}
    >
      <AnalyticsContent
        analytics={analytics}
        onRefresh={generateAnalytics}
        isGenerating={isGenerating}
      />
    </AnalyticsPageLayout>
  );
};

export default Analytics;
