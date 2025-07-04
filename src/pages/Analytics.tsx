
import React from 'react';
import PageLayoutWithHeader from '@/components/PageLayoutWithHeader';
import AnalyticsPageHeader from '@/components/analytics/AnalyticsPageHeader';
import AnalyticsScoreCard from '@/components/analytics/AnalyticsScoreCard';
import AnalyticsBiomarkersCard from '@/components/analytics/AnalyticsBiomarkersCard';
import AnalyticsDisplayCard from '@/components/analytics/AnalyticsDisplayCard';
import AnalyticsValueDisplay from '@/components/analytics/AnalyticsValueDisplay';
import EnhancedAnalyticsRecommendations from '@/components/analytics/EnhancedAnalyticsRecommendations';
import { useCachedAnalytics } from '@/hooks/useCachedAnalytics';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { useRecommendationsInvalidation } from '@/hooks/useRecommendationsInvalidation';
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
  
  // Инициализируем отслеживание изменений для инвалидации кэша рекомендаций
  useRecommendationsInvalidation();

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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Персональная аналитика</h1>
                <p className="text-gray-600 mt-2">Ваш персональный анализ здоровья</p>
              </div>
            </div>

            <AnalyticsDisplayCard title="Недостаточно данных для анализа" icon={AlertTriangle}>
              <div className="text-center py-6">
                <p className="text-gray-700 mb-6">
                  Для генерации персональных рекомендаций необходимо:
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className={`flex items-center gap-3 p-4 rounded-lg ${hasHealthProfile ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    <User className="h-5 w-5 flex-shrink-0" />
                    <span>{hasHealthProfile ? '✓ Профиль здоровья создан' : 'Создать профиль здоровья'}</span>
                  </div>
                  <div className={`flex items-center gap-3 p-4 rounded-lg ${hasAnalyses ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    <TestTube className="h-5 w-5 flex-shrink-0" />
                    <span>{hasAnalyses ? '✓ Анализы загружены' : 'Загрузить анализы крови'}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {!hasHealthProfile && (
                    <Button 
                      onClick={() => window.location.href = '/health-profile'}
                      className="min-h-[44px]"
                    >
                      Создать профиль
                    </Button>
                  )}
                  {!hasAnalyses && (
                    <Button 
                      onClick={() => window.location.href = '/lab-analyses'}
                      variant={hasHealthProfile ? "default" : "outline"}
                      className="min-h-[44px]"
                    >
                      Загрузить анализы
                    </Button>
                  )}
                </div>
              </div>
            </AnalyticsDisplayCard>
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Персональная аналитика</h1>
                <p className="text-gray-600 mt-2">Ваш персональный анализ здоровья</p>
              </div>
            </div>

            <AnalyticsDisplayCard title="Готов к анализу" icon={RefreshCw}>
              <div className="text-center py-6">
                <p className="text-gray-700 mb-6">
                  Ваши данные готовы для генерации персональных рекомендаций ИИ-доктором
                </p>
                <Button 
                  onClick={handleGenerateAnalytics}
                  disabled={isGenerating}
                  size="lg"
                  className="min-h-[44px]"
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
            </AnalyticsDisplayCard>
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header with Edit Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Персональная аналитика</h1>
              <p className="text-gray-600 mt-2">Ваш персональный анализ здоровья от ИИ-доктора</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link to="/my-recommendations">
                <Button variant="outline" size="sm" className="min-h-[44px] w-full sm:w-auto">
                  <Calendar className="h-4 w-4 mr-2" />
                  {isMobile ? 'Мои' : 'Мои рекомендации'}
                </Button>
              </Link>
              <Button
                onClick={handleGenerateAnalytics}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="min-h-[44px] w-full sm:w-auto"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                Обновить
              </Button>
            </div>
          </div>

          {/* Health Goals Section */}
          {healthProfile?.healthGoals && healthProfile.healthGoals.length > 0 && (
            <AnalyticsDisplayCard title="Ваши цели здоровья" icon={Target}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {healthProfile.healthGoals.map((goal, index) => (
                  <div key={index} className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                      <span className="text-xs font-medium text-purple-800 uppercase tracking-wide">
                        Цель
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {translateGoal(goal)}
                    </div>
                  </div>
                ))}
              </div>
            </AnalyticsDisplayCard>
          )}

          {/* Health Score */}
          <AnalyticsScoreCard
            healthScore={analytics.healthScore}
            riskLevel={analytics.riskLevel}
            lastUpdated={analytics.lastUpdated}
          />

          {/* Biomarkers Analysis */}
          <AnalyticsBiomarkersCard analytics={analytics} />

          {/* Enhanced Personal Recommendations */}
          <EnhancedAnalyticsRecommendations 
            analytics={analytics} 
            healthProfile={healthProfile}
          />

          {/* Health Profile Summary */}
          {healthProfile && (
            <AnalyticsDisplayCard title="Профиль здоровья" icon={User}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnalyticsValueDisplay
                  label="Возраст"
                  value={`${healthProfile.age} лет`}
                />
                <AnalyticsValueDisplay
                  label="ИМТ"
                  value={((healthProfile.weight / Math.pow(healthProfile.height / 100, 2)).toFixed(1))}
                />
                <AnalyticsValueDisplay
                  label="Часы сна"
                  value={`${healthProfile.sleepHours} часов`}
                />
                <AnalyticsValueDisplay
                  label="Уровень стресса"
                  value={`${healthProfile.stressLevel}/10`}
                />
                <AnalyticsValueDisplay
                  label="Физическая активность"
                  value={`${healthProfile.exerciseFrequency} раз/неделю`}
                />
                <AnalyticsValueDisplay
                  label="Потребление воды"
                  value={`${healthProfile.waterIntake} стаканов`}
                />
              </div>
            </AnalyticsDisplayCard>
          )}
        </div>
      </div>
    </PageLayoutWithHeader>
  );
};

export default Analytics;
