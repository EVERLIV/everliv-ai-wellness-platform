import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, AlertTriangle, Target, Activity, RefreshCw } from "lucide-react";
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
    generateAnalytics 
  } = useCachedAnalytics();
  
  const { healthProfile, isLoading: isLoadingProfile } = useHealthProfile();
  const [activeTab, setActiveTab] = useState("overview");

  const handleRefreshAnalytics = async () => {
    await generateAnalytics();
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'высокий':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'средний':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'низкий':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderLoadingState = () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
        <p className="text-gray-600">
          {isGenerating ? 'Генерируем персональную аналитику...' : 'Загружаем данные...'}
        </p>
      </div>
    </div>
  );

  const renderEmptyState = () => (
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
  );

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
            {renderLoadingState()}
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
            {renderEmptyState()}
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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button onClick={handleRefreshAnalytics} disabled={isGenerating} variant="outline">
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Обновить
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Обзор</TabsTrigger>
              <TabsTrigger value="recommendations">Детальные рекомендации</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Общий балл здоровья */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    Общий балл здоровья
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {analytics.healthScore}/100
                      </div>
                      <Badge className={getRiskLevelColor(analytics.riskLevel)}>
                        {analytics.riskLevel === 'высокий' ? 'Высокий риск' : 
                         analytics.riskLevel === 'средний' ? 'Средний риск' : 'Низкий риск'}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 mb-3">{analytics.scoreExplanation}</p>
                      <p className="text-sm text-gray-600">{analytics.riskDescription}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Сильные стороны */}
              {analytics.strengths && analytics.strengths.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <Target className="h-5 w-5" />
                      Ваши сильные стороны
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analytics.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <span className="text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Области для улучшения */}
              {analytics.concerns && analytics.concerns.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-700">
                      <AlertTriangle className="h-5 w-5" />
                      Области для улучшения
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analytics.concerns.map((concern, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                          <span className="text-gray-700">{concern}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Основные рекомендации */}
              {analytics.recommendations && analytics.recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                      <Target className="h-5 w-5" />
                      Основные рекомендации
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {analytics.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <span className="text-gray-700">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {analytics.lastUpdated && (
                <div className="text-xs text-gray-400 text-center">
                  Последнее обновление: {new Date(analytics.lastUpdated).toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="recommendations">
              <DetailedHealthRecommendations 
                analytics={analytics} 
                healthProfile={healthProfile}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayoutWithHeader>
  );
};

export default Analytics;
