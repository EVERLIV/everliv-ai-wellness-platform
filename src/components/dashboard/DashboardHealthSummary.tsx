
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, AlertTriangle, Activity, FileText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCachedAnalytics } from "@/hooks/useCachedAnalytics";

const DashboardHealthSummary = () => {
  const { analytics, isLoading, isGenerating, generateAnalytics } = useCachedAnalytics();

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'high': return 'Высокий риск';
      case 'medium': return 'Умеренный риск';
      case 'low': return 'Низкий риск';
      default: return 'Не определен';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRecommendationMessage = () => {
    if (!analytics || analytics.totalAnalyses === 0) {
      return {
        icon: FileText,
        color: 'text-blue-600',
        bg: 'bg-blue-50 border-blue-200',
        title: 'Начните с анализов',
        message: 'Загрузите первый анализ крови для получения персональных рекомендаций'
      };
    }

    if (!analytics.hasRecentActivity) {
      return {
        icon: AlertTriangle,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50 border-yellow-200',
        title: 'Обновите данные',
        message: 'Рекомендуется загрузить свежие анализы для актуальных рекомендаций'
      };
    }

    if (analytics.riskLevel === 'high') {
      return {
        icon: AlertTriangle,
        color: 'text-red-600',
        bg: 'bg-red-50 border-red-200',
        title: 'Требуется внимание',
        message: 'Обнаружены показатели, требующие внимания. Рекомендуется консультация врача'
      };
    }

    return {
      icon: Activity,
      color: 'text-green-600',
      bg: 'bg-green-50 border-green-200',
      title: 'Отличная работа!',
      message: 'Ваши показатели в норме. Продолжайте следить за здоровьем'
    };
  };

  const recommendation = getRecommendationMessage();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Сводка здоровья
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={generateAnalytics}
            disabled={isGenerating}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Обновление...' : 'Обновить'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mx-auto mb-2" />
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mx-auto" />
              </div>
              <div className="text-center">
                <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mx-auto mb-2" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mx-auto" />
              </div>
            </div>
          </div>
        ) : !analytics ? (
          <div className="text-center py-6">
            <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Нет данных</h3>
            <p className="text-sm text-gray-500 mb-4">
              Для получения персональной сводки здоровья нажмите "Обновить"
            </p>
            <Button onClick={generateAnalytics} disabled={isGenerating}>
              {isGenerating ? 'Генерация...' : 'Сгенерировать аналитику'}
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {analytics.totalAnalyses}
                </div>
                <div className="text-sm text-gray-500">Анализов</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {analytics.totalConsultations}
                </div>
                <div className="text-sm text-gray-500">Консультаций</div>
              </div>
            </div>

            {analytics.riskLevel && analytics.totalAnalyses > 0 && (
              <div className={`mb-4 p-3 rounded-lg border ${getRiskLevelColor(analytics.riskLevel)}`}>
                <div className="text-sm font-medium">
                  Уровень риска: {getRiskLevelText(analytics.riskLevel)}
                </div>
                {analytics.lastAnalysisDate && (
                  <div className="text-xs mt-1 opacity-75">
                    Последний анализ: {new Date(analytics.lastAnalysisDate).toLocaleDateString('ru-RU')}
                  </div>
                )}
              </div>
            )}
            
            <div className={`border rounded-lg p-4 ${recommendation.bg}`}>
              <div className="flex items-start gap-3">
                <recommendation.icon className={`h-5 w-5 ${recommendation.color} flex-shrink-0 mt-0.5`} />
                <div className="flex-1">
                  <h4 className={`font-medium ${recommendation.color} mb-1`}>
                    {recommendation.title}
                  </h4>
                  <p className="text-sm text-gray-700 mb-3">
                    {recommendation.message}
                  </p>
                  {analytics.totalAnalyses === 0 && (
                    <Button 
                      size="sm" 
                      onClick={() => window.location.href = '/lab-analyses'}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Загрузить анализ
                    </Button>
                  )}
                </div>
              </div>
            </div>

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
