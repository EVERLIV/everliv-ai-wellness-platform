
import React, { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useCachedAnalytics } from "@/hooks/useCachedAnalytics";
import { useHealthProfileStatus } from "@/hooks/useHealthProfileStatus";
import HealthSummaryHeader from "./health-summary/HealthSummaryHeader";
import HealthSummaryLoading from "./health-summary/HealthSummaryLoading";
import HealthSummaryEmptyState from "./health-summary/HealthSummaryEmptyState";
import HealthScoreDisplay from "./health-summary/HealthScoreDisplay";
import HealthRecommendation from "./health-summary/HealthRecommendation";
import HealthProfileStatusIndicator from "@/components/health-profile/HealthProfileStatusIndicator";

const DashboardHealthSummary = () => {
  const { 
    analytics, 
    isLoading, 
    isGenerating, 
    hasHealthProfile, 
    hasAnalyses, 
    generateRealTimeAnalytics 
  } = useCachedAnalytics();

  const { isComplete, completionPercentage } = useHealthProfileStatus();
  const hasGeneratedRef = useRef(false);

  // Автоматически генерируем реальные данные при монтировании компонента только один раз
  useEffect(() => {
    if (hasHealthProfile && hasAnalyses && !isLoading && !isGenerating && !hasGeneratedRef.current) {
      hasGeneratedRef.current = true;
      generateRealTimeAnalytics();
    }
  }, [hasHealthProfile, hasAnalyses, isLoading, isGenerating, generateRealTimeAnalytics]);

  return (
    <Card>
      <HealthSummaryHeader
        onRefresh={() => {
          hasGeneratedRef.current = false;
          generateRealTimeAnalytics();
        }}
        isGenerating={isGenerating}
        hasHealthProfile={hasHealthProfile}
        hasAnalyses={hasAnalyses}
      />
      <CardContent>
        {/* Индикатор статуса профиля здоровья */}
        <div className="mb-4 p-3 border rounded-lg bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Профиль здоровья:</span>
            <HealthProfileStatusIndicator 
              isComplete={isComplete}
              completionPercentage={completionPercentage}
              size="sm"
              showPercentage={true}
            />
          </div>
          {completionPercentage < 90 && (
            <p className="text-xs text-gray-600 mt-2">
              Заполните профиль полностью для получения максимально точной аналитики здоровья
            </p>
          )}
        </div>

        {isLoading || isGenerating ? (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
              <p className="text-sm text-gray-600">
                {isGenerating ? 'Генерируем расширенную аналитику здоровья...' : 'Загружаем данные...'}
              </p>
            </div>
            <HealthSummaryLoading />
          </div>
        ) : !analytics ? (
          <HealthSummaryEmptyState
            hasHealthProfile={hasHealthProfile}
            hasAnalyses={hasAnalyses}
            onGenerate={() => {
              hasGeneratedRef.current = false;
              generateRealTimeAnalytics();
            }}
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
