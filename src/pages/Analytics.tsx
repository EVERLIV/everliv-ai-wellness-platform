import React from 'react';
import PageLayoutWithHeader from '@/components/PageLayoutWithHeader';
import AnalyticsPageHeader from '@/components/analytics/AnalyticsPageHeader';
import EnhancedAnalyticsRecommendations from '@/components/analytics/EnhancedAnalyticsRecommendations';
import HealthOverviewHeader from '@/components/analytics/recommendations/HealthOverviewHeader';
import { useCachedAnalytics } from '@/hooks/useCachedAnalytics';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, User, TestTube, Calendar, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  // Перевод целей на русский язык
  const translateGoal = (goal: string): string => {
    const translations: Record<string, string> = {
      'biological_age': 'Биологический возраст',
      'cardiovascular': 'Сердечно-сосудистое здоровье',
      'cognitive': 'Когнитивное здоровье',
      'musculoskeletal': 'Опорно-двигательная система',
      'metabolism': 'Метаболизм',
      'muscle_gain': 'Набор мышечной массы',
      'weight_loss': 'Снижение веса',
      'energy_boost': 'Повышение энергии',
      'sleep_improvement': 'Улучшение сна',
      'stress_reduction': 'Снижение стресса',
      'immunity_boost': 'Укрепление иммунитета',
      'longevity': 'Увеличение продолжительности жизни',
      'hormonal_balance': 'Гормональный баланс',
      'digestive_health': 'Здоровье пищеварения',
      'skin_health': 'Здоровье кожи',
      'metabolic_health': 'Метаболическое здоровье',
      'bone_health': 'Здоровье костей',
      'mental_health': 'Психическое здоровье',
      'detox': 'Детоксикация организма',
      'athletic_performance': 'Спортивные результаты'
    };
    return translations[goal] || goal;
  };

  const handleGenerateAnalytics = async () => {
    console.log('🔄 Manual analytics refresh triggered');
    await generateAnalytics();
  };

  const handlePageRefresh = () => {
    console.log('🔄 Page refresh triggered');
    window.location.reload();
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
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        {/* Кнопки управления - адаптивные */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
            Персональные рекомендации ИИ-доктора
          </h1>
          <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
            <Link to="/my-recommendations" className="flex-1 sm:flex-none">
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                className="flex items-center gap-2 w-full justify-center"
              >
                <Calendar className="h-4 w-4" />
                {isMobile ? 'Мои рекомендации' : 'Мои рекомендации'}
              </Button>
            </Link>
            <Button
              onClick={handleGenerateAnalytics}
              disabled={isGenerating}
              variant="outline"
              size={isMobile ? "sm" : "default"}
              className="flex items-center gap-2 flex-1 sm:flex-none justify-center"
            >
              <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {isMobile ? 'Обновить' : 'Обновить аналитику'}
            </Button>
            <Button
              onClick={handlePageRefresh}
              variant="outline"
              size={isMobile ? "sm" : "default"}
              className="flex items-center gap-2 flex-1 sm:flex-none justify-center"
            >
              <RefreshCw className="h-4 w-4" />
              {isMobile ? 'Данные' : 'Обновить данные'}
            </Button>
          </div>
        </div>

        {/* Улучшенный адаптивный блок с целями пользователя */}
        {healthProfile?.healthGoals && healthProfile.healthGoals.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 rounded-2xl p-4 sm:p-6 border border-purple-200 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-xl">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <h2 className={`font-semibold text-gray-900 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                Рекомендации для ваших целей
              </h2>
            </div>
            
            {/* Адаптивная сетка целей */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {healthProfile.healthGoals.map((goal, index) => (
                <div
                  key={index}
                  className="group hover:scale-105 transition-transform duration-200"
                >
                  <div className="bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
                      <span className="text-xs sm:text-sm font-medium text-purple-800 uppercase tracking-wide">
                        Цель
                      </span>
                    </div>
                    <div className={`font-semibold text-gray-900 ${isMobile ? 'text-sm' : 'text-base'} leading-tight`}>
                      {translateGoal(goal)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Дополнительная информация */}
            <div className="mt-4 p-3 bg-white/60 rounded-xl border border-purple-100">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-purple-700">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="font-medium">
                  Рекомендации персонализированы под {healthProfile.healthGoals.length} {healthProfile.healthGoals.length === 1 ? 'цель' : 'целей'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Обзор здоровья с актуальными данными биомаркеров */}
        <HealthOverviewHeader analytics={analytics} />
        
        {/* Главные рекомендации на основе целей пользователя */}
        <EnhancedAnalyticsRecommendations
          analytics={analytics}
          healthProfile={healthProfile}
        />
      </div>
    </PageLayoutWithHeader>
  );
};

export default Analytics;
