
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useCachedAnalytics } from "@/hooks/useCachedAnalytics";
import HealthSummaryHeader from "./health-summary/HealthSummaryHeader";
import HealthSummaryLoading from "./health-summary/HealthSummaryLoading";
import HealthSummaryEmptyState from "./health-summary/HealthSummaryEmptyState";
import HealthScoreDisplay from "./health-summary/HealthScoreDisplay";
import HealthRecommendation from "./health-summary/HealthRecommendation";

const DashboardHealthSummary = () => {
  const { 
    analytics, 
    isLoading, 
    isGenerating, 
    hasHealthProfile, 
    hasAnalyses, 
    generateRealTimeAnalytics 
  } = useCachedAnalytics();

  // Автоматически генерируем реальные данные при монтировании компонента
  useEffect(() => {
    if (hasHealthProfile && hasAnalyses && !isLoading && !isGenerating) {
      generateRealTimeAnalytics();
    }
  }, [hasHealthProfile, hasAnalyses, isLoading, isGenerating, generateRealTimeAnalytics]);

  return (
    <Card>
      <HealthSummaryHeader
        onRefresh={generateRealTimeAnalytics}
        isGenerating={isGenerating}
        hasHealthProfile={hasHealthProfile}
        hasAnalyses={hasAnalyses}
      />
      <CardContent>
        {isLoading || isGenerating ? (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
              <p className="text-sm text-gray-600">Загружаем данные...</p>
            </div>
            <HealthSummaryLoading />
          </div>
        ) : !analytics ? (
          <HealthSummaryEmptyState
            hasHealthProfile={hasHealthProfile}
            hasAnalyses={hasAnalyses}
            onGenerate={generateRealTimeAnalytics}
            isGenerating={isGenerating}
          />
        ) : (
          <>
            <HealthScoreDisplay analytics={analytics} />
            <HealthRecommendation 
              analytics={analytics}
              hasHealthProfile={hasHealthProfile}
              hasAnalyses={hasAnalyses}
            />
            {analytics.lastUpdated && (
              <div className="text-xs text-gray-400 mt-3 text-center">
                Обновлено: {new Date(analytics.lastUpdated).toLocaleString('ru-RU')}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardHealthSummary;
