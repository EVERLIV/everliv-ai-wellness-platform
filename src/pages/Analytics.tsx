
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import AnalyticsScoreCard from '@/components/analytics/AnalyticsScoreCard';
import AnalyticsBiomarkersCard from '@/components/analytics/AnalyticsBiomarkersCard';
import AnalyticsDisplayCard from '@/components/analytics/AnalyticsDisplayCard';
import AnalyticsValueDisplay from '@/components/analytics/AnalyticsValueDisplay';
import PersonalAIConsultant from '@/components/analytics/PersonalAIConsultant';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useCachedAnalytics } from '@/hooks/useCachedAnalytics';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { useRecommendationsInvalidation } from '@/hooks/useRecommendationsInvalidation';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, User, TestTube, Calendar, Target, Brain } from 'lucide-react';
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
  // useRecommendationsInvalidation(); // Временно отключено для отладки

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
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
            <p className="text-gray-500">Загрузка аналитики...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Если нет профиля здоровья или анализов
  if (!hasHealthProfile || !hasAnalyses) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Персональная аналитика</h1>
            <p className="text-gray-600 mt-2">Ваш персональный анализ здоровья</p>
          </div>

          <AnalyticsDisplayCard title="Недостаточно данных для анализа" icon={AlertTriangle}>
            <div className="text-center py-6">
              <p className="text-gray-700 mb-6">
                Для генерации персональных рекомендаций необходимо:
              </p>
              
              <div className="space-y-4 mb-6">
                <div className={`flex items-center gap-3 p-4 ${hasHealthProfile ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  <User className="h-5 w-5 flex-shrink-0" />
                  <span>{hasHealthProfile ? '✓ Профиль здоровья создан' : 'Создать профиль здоровья'}</span>
                </div>
                <div className={`flex items-center gap-3 p-4 ${hasAnalyses ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
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
      </AppLayout>
    );
  }

  // Если нет аналитики, но есть данные
  if (!analytics) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Персональная аналитика</h1>
            <p className="text-gray-600 mt-2">Ваш персональный анализ здоровья</p>
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
      </AppLayout>
    );
  }

  // Основная страница с рекомендациями
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Персональная аналитика</h1>
              <p className="text-sm text-gray-600">Ваш персональный анализ здоровья</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Link to="/my-recommendations">
                <Button variant="outline" size="sm" className="h-8 w-full sm:w-auto text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  {isMobile ? 'Мои' : 'Мои рекомендации'}
                </Button>
              </Link>
              <Button
                onClick={handleGenerateAnalytics}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="h-8 w-full sm:w-auto text-xs"
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
                Обновить
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main Content - Left 2/3 */}
            <div className="lg:col-span-2 space-y-4">
              {/* Health Goals Section */}
              {healthProfile?.healthGoals && healthProfile.healthGoals.length > 0 && (
                <div className="bg-white p-3 border">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4" />
                    <h3 className="text-sm font-medium text-gray-900">Мои цели</h3>
                  </div>
                  <div className="space-y-1">
                    {healthProfile.healthGoals.slice(0, 3).map((goal, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 flex-shrink-0"></div>
                        <span className="text-xs text-gray-700">
                          {translateGoal(goal)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Personal AI Consultant - Main Content */}
              <div className="bg-white border">
                <div className="p-3 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-blue-500" />
                      <h3 className="text-sm font-medium">ИИ-Консультант по здоровью</h3>
                    </div>
                    <Button
                      onClick={handleGenerateAnalytics}
                      disabled={isGenerating}
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Обновить
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  <PersonalAIConsultant 
                    analytics={analytics} 
                    healthProfile={healthProfile}
                  />
                </div>
              </div>

              {/* Biomarkers Analysis */}
              <AnalyticsBiomarkersCard analytics={analytics} />
            </div>

            {/* Right Sidebar - 1/3 */}
            <div className="space-y-4">
              {/* Health Index */}
              <AnalyticsScoreCard
                healthScore={analytics.healthScore}
                riskLevel={analytics.riskLevel}
                lastUpdated={analytics.lastUpdated}
              />

              {/* Health Profile Summary */}
              {healthProfile && (
                <div className="bg-white p-3 border">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="h-4 w-4" />
                    <h3 className="text-sm font-medium">Профиль здоровья</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Возраст</span>
                      <span className="text-xs font-medium">{healthProfile.age} лет</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">ИМТ</span>
                      <span className="text-xs font-medium">{((healthProfile.weight / Math.pow(healthProfile.height / 100, 2)).toFixed(1))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Часы сна</span>
                      <span className="text-xs font-medium">{healthProfile.sleepHours} часов</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Стресс</span>
                      <span className="text-xs font-medium">{healthProfile.stressLevel}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Активность</span>
                      <span className="text-xs font-medium">{healthProfile.exerciseFrequency} раз/нед</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Вода</span>
                      <span className="text-xs font-medium">{healthProfile.waterIntake} ст</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Analytics;
