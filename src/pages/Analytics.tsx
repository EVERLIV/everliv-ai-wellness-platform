
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Activity, RefreshCw } from "lucide-react";
import { useCachedAnalytics } from "@/hooks/useCachedAnalytics";
import { useHealthProfile } from "@/hooks/useHealthProfile";
import PageLayoutWithHeader from "@/components/PageLayoutWithHeader";
import AnalyticsPageHeader from "@/components/analytics/AnalyticsPageHeader";
import DetailedHealthRecommendations from "@/components/analytics/DetailedHealthRecommendations";

const Analytics = () => {
  const { 
    analytics, 
    isLoading, 
    isGenerating, 
    hasHealthProfile, 
    hasAnalyses, 
    generateAnalytics,
    generateRealTimeAnalytics 
  } = useCachedAnalytics();
  
  const { healthProfile, isLoading: isLoadingProfile } = useHealthProfile();

  // Автоматически генерируем реальные данные при загрузке страницы
  useEffect(() => {
    if (hasHealthProfile && !isLoading && !isGenerating) {
      generateRealTimeAnalytics();
    }
  }, [hasHealthProfile]);

  const handleRefreshAnalytics = async () => {
    await generateRealTimeAnalytics();
  };

  if (isLoading || isLoadingProfile) {
    return (
      <PageLayoutWithHeader
        headerComponent={
          <AnalyticsPageHeader 
            healthScore={analytics?.healthScore || 0}
            riskLevel={analytics?.riskLevel || "unknown"}
          />
        }
        fullWidth
      >
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
                <p className="text-gray-600">
                  {isGenerating ? 'Генерируем персональную аналитику...' : 'Загружаем данные...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </PageLayoutWithHeader>
    );
  }

  if (!analytics) {
    return (
      <PageLayoutWithHeader
        headerComponent={
          <AnalyticsPageHeader 
            healthScore={0}
            riskLevel="unknown"
          />
        }
        fullWidth
      >
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <Button onClick={handleRefreshAnalytics} disabled={isGenerating}>
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  {isGenerating ? 'Генерируем...' : 'Сгенерировать аналитику'}
                </Button>
              </div>
            </div>
            <div className="text-center py-12">
              <Activity className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Недостаточно данных для аналитики
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {!hasHealthProfile && !hasAnalyses 
                  ? "Заполните профиль здоровья и загрузите анализы крови для получения персональной аналитики"
                  : !hasHealthProfile 
                  ? "Заполните профиль здоровья для получения персональной аналитики"
                  : "Загрузите анализы крови для получения персональной аналитики"
                }
              </p>
              <div className="flex gap-4 justify-center">
                {!hasHealthProfile && (
                  <Button onClick={() => window.location.href = '/health-profile'}>
                    Заполнить профиль здоровья
                  </Button>
                )}
                {!hasAnalyses && (
                  <Button variant="outline" onClick={() => window.location.href = '/lab-analyses'}>
                    Загрузить анализы
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </PageLayoutWithHeader>
    );
  }

  return (
    <PageLayoutWithHeader
      headerComponent={
        <AnalyticsPageHeader 
          healthScore={analytics.healthScore}
          riskLevel={analytics.riskLevel}
        />
      }
      fullWidth
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Button onClick={handleRefreshAnalytics} disabled={isGenerating} variant="outline">
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Обновить данные
              </Button>
              <Badge variant="secondary" className="text-xs w-fit">
                Данные в реальном времени
              </Badge>
            </div>
          </div>

          <DetailedHealthRecommendations 
            analytics={analytics} 
            healthProfile={healthProfile}
          />

          {analytics.lastUpdated && (
            <div className="text-xs text-gray-400 text-center mt-8">
              Последнее обновление: {new Date(analytics.lastUpdated).toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          )}
        </div>
      </div>
    </PageLayoutWithHeader>
  );
};

export default Analytics;
