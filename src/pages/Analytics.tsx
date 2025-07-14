
import React, { useState } from 'react';
import Header from '@/components/Header';
import MinimalFooter from '@/components/MinimalFooter';
import Sidebar from '@/components/Sidebar';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AnalyticsScoreCard from '@/components/analytics/AnalyticsScoreCard';
import AnalyticsBiomarkersCard from '@/components/analytics/AnalyticsBiomarkersCard';
import AnalyticsDisplayCard from '@/components/analytics/AnalyticsDisplayCard';
import AnalyticsValueDisplay from '@/components/analytics/AnalyticsValueDisplay';
import PersonalAIConsultant from '@/components/analytics/PersonalAIConsultant';
import { useCachedAnalytics } from '@/hooks/useCachedAnalytics';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { useRecommendationsInvalidation } from '@/hooks/useRecommendationsInvalidation';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, User, TestTube, Calendar, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Analytics = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
              <p className="text-gray-500">Загрузка аналитики...</p>
            </div>
          </div>
          <MinimalFooter />
        </div>
      </div>
    );
  }

  // Если нет профиля здоровья или анализов
  if (!hasHealthProfile || !hasAnalyses) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 p-8">
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
          <MinimalFooter />
        </div>
      </div>
    );
  }

  // Если нет аналитики, но есть данные
  if (!analytics) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 p-8">
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
          <MinimalFooter />
        </div>
      </div>
    );
  }

  // Основная страница с рекомендациями
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 p-8">
          <DashboardLayout
            leftColumn={
              <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Добро пожаловать, Пользователь!</h1>
                    <p className="text-gray-600 mt-2">Управляйте своим здоровьем с помощью ИИ-платформы</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
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
                  <AnalyticsDisplayCard title="Мои цели" icon={Target}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">Мои цели</h3>
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          Все цели
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {healthProfile.healthGoals.map((goal, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                            <span className="text-sm text-gray-700">
                              {translateGoal(goal)}
                            </span>
                          </div>
                        ))}
                        <Button variant="ghost" size="sm" className="text-gray-500 mt-2">
                          +6 еще
                        </Button>
                      </div>
                    </div>
                  </AnalyticsDisplayCard>
                )}

                {/* Personal AI Consultant - Main Content */}
                <PersonalAIConsultant 
                  analytics={analytics} 
                  healthProfile={healthProfile}
                />

                {/* Biomarkers Analysis */}
                <AnalyticsBiomarkersCard analytics={analytics} />
              </div>
            }
            rightColumn={
              <div className="space-y-4">
                {/* Health Index */}
                <AnalyticsScoreCard
                  healthScore={analytics.healthScore}
                  riskLevel={analytics.riskLevel}
                  lastUpdated={analytics.lastUpdated}
                />

                {/* Health Profile Summary */}
                {healthProfile && (
                  <AnalyticsDisplayCard title="Профиль здоровья" icon={User}>
                    <div className="grid grid-cols-1 gap-4">
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
            }
          />
        </div>
        <MinimalFooter />
      </div>
    </div>
  );
};

export default Analytics;
