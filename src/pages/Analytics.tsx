
import React from 'react';
import PageLayoutWithHeader from '@/components/PageLayoutWithHeader';
import AnalyticsPageHeader from '@/components/analytics/AnalyticsPageHeader';
import DetailedHealthRecommendations from '@/components/analytics/DetailedHealthRecommendations';
import { useCachedAnalytics } from '@/hooks/useCachedAnalytics';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, User, TestTube } from 'lucide-react';

const Analytics = () => {
  const { 
    analytics, 
    isLoading, 
    isGenerating, 
    hasHealthProfile, 
    hasAnalyses, 
    generateAnalytics 
  } = useCachedAnalytics();
  
  const { healthProfile } = useHealthProfile();

  const handleGenerateAnalytics = async () => {
    await generateAnalytics();
  };

  if (isLoading) {
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
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
            <p className="text-gray-500">Загрузка аналитики...</p>
          </div>
        </div>
      </PageLayoutWithHeader>
    );
  }

  // Если нет профиля здоровья или анализов
  if (!hasHealthProfile || !hasAnalyses) {
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
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-8">
              <AlertTriangle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-amber-800 mb-4">
                Недостаточно данных для анализа
              </h2>
              <p className="text-amber-700 mb-6">
                Для генерации персональных рекомендаций необходимо:
              </p>
              
              <div className="space-y-3 mb-6">
                <div className={`flex items-center gap-3 p-3 rounded-lg ${hasHealthProfile ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  <User className="h-5 w-5" />
                  <span>{hasHealthProfile ? '✓ Профиль здоровья создан' : 'Создать профиль здоровья'}</span>
                </div>
                <div className={`flex items-center gap-3 p-3 rounded-lg ${hasAnalyses ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  <TestTube className="h-5 w-5" />
                  <span>{hasAnalyses ? '✓ Анализы загружены' : 'Загрузить анализы крови'}</span>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                {!hasHealthProfile && (
                  <Button 
                    onClick={() => window.location.href = '/health-profile'}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Создать профиль
                  </Button>
                )}
                {!hasAnalyses && (
                  <Button 
                    onClick={() => window.location.href = '/lab-analyses'}
                    variant={hasHealthProfile ? "default" : "outline"}
                  >
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

  // Если нет аналитики, но есть данные
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
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-blue-800 mb-4">
                Готов к анализу
              </h2>
              <p className="text-blue-700 mb-6">
                Ваши данные готовы для генерации персональных рекомендаций ИИ-доктором
              </p>
              <Button 
                onClick={handleGenerateAnalytics}
                disabled={isGenerating}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Анализируем...
                  </>
                ) : (
                  'Сгенерировать рекомендации'
                )}
              </Button>
            </div>
          </div>
        </div>
      </PageLayoutWithHeader>
    );
  }

  // Основная страница с рекомендациями
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
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Персональная аналитика здоровья
              </h1>
              <p className="text-gray-600">
                ИИ-рекомендации на основе вашего профиля здоровья и анализов
              </p>
            </div>
            
            <Button
              onClick={handleGenerateAnalytics}
              disabled={isGenerating}
              variant="outline"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Обновляем...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Обновить анализ
                </>
              )}
            </Button>
          </div>
          
          <DetailedHealthRecommendations 
            analytics={analytics}
            healthProfile={healthProfile}
          />
        </div>
      </div>
    </PageLayoutWithHeader>
  );
};

export default Analytics;
