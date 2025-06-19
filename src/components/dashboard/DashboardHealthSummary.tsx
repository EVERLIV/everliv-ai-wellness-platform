
import React, { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Lock } from "lucide-react";
import { useCachedAnalytics } from "@/hooks/useCachedAnalytics";
import { useHealthProfileStatus } from "@/hooks/useHealthProfileStatus";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useNavigate } from "react-router-dom";
import HealthSummaryHeader from "./health-summary/HealthSummaryHeader";
import HealthSummaryLoading from "./health-summary/HealthSummaryLoading";
import HealthSummaryEmptyState from "./health-summary/HealthSummaryEmptyState";
import HealthScoreDisplay from "./health-summary/HealthScoreDisplay";
import HealthRecommendation from "./health-summary/HealthRecommendation";
import HealthProfileStatusIndicator from "@/components/health-profile/HealthProfileStatusIndicator";

const DashboardHealthSummary = () => {
  const { canAccessAnalytics, currentPlan } = useSubscription();
  const navigate = useNavigate();
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

  // Проверяем доступ к аналитике
  const hasAnalyticsAccess = canAccessAnalytics();

  console.log('🔍 DashboardHealthSummary access check:', {
    hasAnalyticsAccess,
    currentPlan,
    hasHealthProfile,
    analytics: !!analytics
  });

  // Автоматически генерируем аналитику при наличии профиля и доступа
  useEffect(() => {
    if (hasAnalyticsAccess && hasHealthProfile && !analytics && !isLoading && !isGenerating && !hasGeneratedRef.current) {
      hasGeneratedRef.current = true;
      console.log('Auto-generating analytics for health profile...');
      generateRealTimeAnalytics();
    }
  }, [hasAnalyticsAccess, hasHealthProfile, analytics, isLoading, isGenerating, generateRealTimeAnalytics]);

  // Если нет доступа к аналитике
  if (!hasAnalyticsAccess) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-amber-100 p-3 rounded-full">
                <Lock className="h-8 w-8 text-amber-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Расширенная аналитика здоровья</h3>
              <p className="text-gray-600 mb-4">
                Получите детальный анализ вашего здоровья с персонализированными рекомендациями и трендами.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium mb-2">Что включает аналитика:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Персональный балл здоровья</li>
                  <li>• Анализ трендов биомаркеров</li>
                  <li>• Детальные рекомендации по улучшению</li>
                  <li>• История изменений показателей</li>
                  <li>• Прогнозы и предупреждения</li>
                </ul>
              </div>
              <Button 
                onClick={() => navigate('/pricing')}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Crown className="h-4 w-4 mr-2" />
                Обновить до Премиум
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
          {completionPercentage < 80 && (
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
                {isGenerating ? 'Обновляем аналитику здоровья...' : 'Загружаем данные...'}
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
