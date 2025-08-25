
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
        <div className="flex items-center justify-center min-h-[400px] p-container">
          <div className="text-center space-y-4">
            <div className="animate-spin h-10 w-10 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-secondary-foreground">Загрузка аналитики...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Если нет профиля здоровья или анализов
  if (!hasHealthProfile || !hasAnalyses) {
    return (
      <AppLayout>
        <div className="p-container space-y-content">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-primary">Персональная аналитика</h1>
            <p className="text-sm text-secondary-foreground">Ваш персональный анализ здоровья</p>
          </div>

          <div className="bg-surface border border-border rounded-lg p-content">
            <div className="text-center space-y-content">
              <div className="flex flex-col items-center space-y-3">
                <AlertTriangle className="h-12 w-12 text-warning" />
                <h3 className="text-lg font-semibold text-primary">Недостаточно данных для анализа</h3>
              </div>
              
              <p className="text-secondary-foreground">
                Для генерации персональных рекомендаций необходимо:
              </p>
              
              <div className="space-y-3 max-w-md mx-auto">
                <div className={`flex items-center gap-3 p-3 rounded-lg ${hasHealthProfile ? 'bg-success/10 text-success border border-success/20' : 'bg-muted text-muted-foreground'}`}>
                  <User className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{hasHealthProfile ? '✓ Профиль здоровья создан' : 'Создать профиль здоровья'}</span>
                </div>
                <div className={`flex items-center gap-3 p-3 rounded-lg ${hasAnalyses ? 'bg-success/10 text-success border border-success/20' : 'bg-muted text-muted-foreground'}`}>
                  <TestTube className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{hasAnalyses ? '✓ Анализы загружены' : 'Загрузить анализы крови'}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                {!hasHealthProfile && (
                  <Button 
                    onClick={() => window.location.href = '/health-profile'}
                    className="w-full"
                  >
                    Создать профиль
                  </Button>
                )}
                {!hasAnalyses && (
                  <Button 
                    onClick={() => window.location.href = '/lab-analyses'}
                    variant={hasHealthProfile ? "default" : "outline"}
                    className="w-full"
                  >
                    Загрузить анализы
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Если нет аналитики, но есть данные
  if (!analytics) {
    return (
      <AppLayout>
        <div className="p-container space-y-content">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-primary">Персональная аналитика</h1>
            <p className="text-sm text-secondary-foreground">Ваш персональный анализ здоровья</p>
          </div>

          <div className="bg-surface border border-border rounded-lg p-content">
            <div className="text-center space-y-content">
              <div className="flex flex-col items-center space-y-3">
                <RefreshCw className="h-12 w-12 text-primary" />
                <h3 className="text-lg font-semibold text-primary">Готов к анализу</h3>
              </div>
              
              <p className="text-secondary-foreground">
                Ваши данные готовы для генерации персональных рекомендаций ИИ-доктором
              </p>
              
              <Button 
                onClick={handleGenerateAnalytics}
                disabled={isGenerating}
                size="lg"
                className="w-full max-w-xs mx-auto"
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
      </AppLayout>
    );
  }

  // Основная страница с рекомендациями
  return (
    <AppLayout>
      <div className="p-container space-y-content">
        {/* Header */}
        <div className="space-y-content-xs">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-primary">Персональная аналитика</h1>
            <p className="text-sm text-secondary-foreground">Ваш персональный анализ здоровья</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Link to="/my-recommendations" className="flex-1 sm:flex-none">
              <Button variant="secondary" size="sm" className="w-full sm:w-auto">
                <Calendar className="h-4 w-4 mr-2" />
                {isMobile ? 'Мои рекомендации' : 'Мои рекомендации'}
              </Button>
            </Link>
            <Button
              onClick={handleGenerateAnalytics}
              disabled={isGenerating}
              variant="secondary"
              size="sm"
              className="flex-1 sm:flex-none"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
              Обновить
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-content">
          {/* Main Content - Left 2/3 */}
          <div className="lg:col-span-2 space-y-content">
            {/* Health Goals Section */}
            {healthProfile?.healthGoals && healthProfile.healthGoals.length > 0 && (
              <div className="space-y-content-xs">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-accent" />
                  <h3 className="text-base font-semibold text-primary">Мои цели</h3>
                </div>
                <div className="space-y-2">
                  {healthProfile.healthGoals.slice(0, 3).map((goal, index) => (
                    <div key={index} className="flex items-center gap-3 p-content-xs bg-accent/5 border border-accent/20 rounded-md">
                      <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0"></div>
                      <span className="text-sm text-foreground">
                        {translateGoal(goal)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Personal AI Consultant - Main Content */}
            <div className="space-y-content-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-semibold text-primary">ИИ-Консультант по здоровью</h3>
                </div>
                <Button
                  onClick={handleGenerateAnalytics}
                  disabled={isGenerating}
                  variant="ghost"
                  size="sm"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                  Обновить
                </Button>
              </div>
              <div>
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
          <div className="space-y-content">
            {/* Health Index */}
            <AnalyticsScoreCard
              healthScore={analytics.healthScore}
              riskLevel={analytics.riskLevel}
              lastUpdated={analytics.lastUpdated}
            />

            {/* Health Profile Summary */}
            {healthProfile && (
              <div className="space-y-content-xs">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-semibold text-primary">Профиль здоровья</h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1 p-content-xs bg-muted/30 rounded-md">
                      <span className="text-xs text-muted-foreground">Возраст</span>
                      <span className="text-sm font-medium text-foreground block">{healthProfile.age} лет</span>
                    </div>
                    <div className="space-y-1 p-content-xs bg-muted/30 rounded-md">
                      <span className="text-xs text-muted-foreground">ИМТ</span>
                      <span className="text-sm font-medium text-foreground block">{((healthProfile.weight / Math.pow(healthProfile.height / 100, 2)).toFixed(1))}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1 p-content-xs bg-muted/30 rounded-md">
                      <span className="text-xs text-muted-foreground">Часы сна</span>
                      <span className="text-sm font-medium text-foreground block">{healthProfile.sleepHours} часов</span>
                    </div>
                    <div className="space-y-1 p-content-xs bg-muted/30 rounded-md">
                      <span className="text-xs text-muted-foreground">Стресс</span>
                      <span className="text-sm font-medium text-foreground block">{healthProfile.stressLevel}/10</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1 p-content-xs bg-muted/30 rounded-md">
                      <span className="text-xs text-muted-foreground">Активность</span>
                      <span className="text-sm font-medium text-foreground block">{healthProfile.exerciseFrequency}/нед</span>
                    </div>
                    <div className="space-y-1 p-content-xs bg-muted/30 rounded-md">
                      <span className="text-xs text-muted-foreground">Вода</span>
                      <span className="text-sm font-medium text-foreground block">{healthProfile.waterIntake} ст</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Analytics;
