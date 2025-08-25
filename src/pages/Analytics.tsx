import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { usePersonalizedRecommendations } from '@/hooks/usePersonalizedRecommendations';
import { useCachedAnalytics } from '@/hooks/useCachedAnalytics';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, AlertTriangle, User, TestTube, Brain, Heart, Apple, FlaskConical, Pill } from 'lucide-react';
import AIHealthConsultant from '@/components/recommendations/AIHealthConsultant';
import RecommendationsOverview from '@/components/recommendations/RecommendationsOverview';
import HealthMetricsCard from '@/components/recommendations/HealthMetricsCard';
import BiomarkersInsights from '@/components/recommendations/BiomarkersInsights';
import SupplementsRecommendations from '@/components/recommendations/SupplementsRecommendations';
import LifestyleRecommendations from '@/components/recommendations/LifestyleRecommendations';

const Analytics = () => {
  const { healthProfile, isLoading: profileLoading } = useHealthProfile();
  const { 
    recommendations, 
    isLoading: recommendationsLoading, 
    generateRecommendations 
  } = usePersonalizedRecommendations();
  const { 
    analytics, 
    hasHealthProfile, 
    hasAnalyses 
  } = useCachedAnalytics();
  
  const [activeTab, setActiveTab] = useState('overview');

  const handleGenerateRecommendations = async () => {
    if (!healthProfile || !analytics) return;
    
    // Создаем совместимый объект профиля
    const profileData = {
      id: '',
      first_name: '',
      last_name: '', 
      nickname: '',
      date_of_birth: '',
      gender: healthProfile.gender,
      height: healthProfile.height,
      weight: healthProfile.weight,
      medical_conditions: healthProfile.chronicConditions || [],
      allergies: healthProfile.allergies || [],
      medications: healthProfile.medications || [],
      goals: healthProfile.healthGoals || []
    };
    
    await generateRecommendations({
      profile: profileData,
      goals: analytics.nutritionGoals || null,
      currentIntake: {
        calories: analytics.currentNutrition?.calories || 0,
        protein: analytics.currentNutrition?.protein || 0,
        carbs: analytics.currentNutrition?.carbs || 0,
        fat: analytics.currentNutrition?.fat || 0
      }
    });
  };

  const isLoading = profileLoading || recommendationsLoading;

  // Если нет профиля здоровья или анализов
  if (!hasHealthProfile || !hasAnalyses) {
    return (
      <AppLayout>
        <div className="p-container space-y-content">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-primary">ИИ-Рекомендации по здоровью</h1>
            <p className="text-sm text-secondary-foreground">Персонализированные рекомендации на основе ваших данных</p>
          </div>

          <div className="bg-surface rounded-lg p-content border-0">
            <div className="text-center space-y-content">
              <div className="flex flex-col items-center space-y-3">
                <AlertTriangle className="h-12 w-12 text-warning" />
                <h3 className="text-lg font-semibold text-primary">Недостаточно данных для анализа</h3>
              </div>
              
              <p className="text-secondary-foreground max-w-md mx-auto">
                Для получения персонализированных рекомендаций ИИ-ассистента необходимо:
              </p>
              
              <div className="space-y-3 max-w-md mx-auto">
                <div className={`flex items-center gap-3 p-3 rounded-lg ${hasHealthProfile ? 'bg-success/10 text-success' : 'bg-muted/50 text-muted-foreground'}`}>
                  <User className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{hasHealthProfile ? '✓ Профиль здоровья создан' : 'Создать профиль здоровья'}</span>
                </div>
                <div className={`flex items-center gap-3 p-3 rounded-lg ${hasAnalyses ? 'bg-success/10 text-success' : 'bg-muted/50 text-muted-foreground'}`}>
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

  return (
    <AppLayout>
      <div className="p-container space-y-content">
        {/* Mobile-First Header */}
        <div className="space-y-3">
          <div className="space-y-1">
            <h1 className="text-lg md:text-xl font-bold text-primary">ИИ-Рекомендации</h1>
            <p className="text-xs md:text-sm text-secondary-foreground">Персональные рекомендации на основе ваших данных</p>
          </div>
          
          <Button
            onClick={handleGenerateRecommendations}
            disabled={isLoading}
            variant="secondary"
            size="sm"
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Генерируем...' : 'Обновить рекомендации'}
          </Button>
        </div>

        {/* Mobile Health Summary */}
        {healthProfile && (
          <div className="lg:hidden bg-surface rounded-lg p-3 border-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-primary">Ваш профиль</h3>
              {analytics?.healthScore && (
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">{analytics.healthScore}%</div>
                  <div className="text-xs text-muted-foreground">Индекс здоровья</div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-muted/20 rounded">
                <div className="font-medium text-foreground">{healthProfile.age}</div>
                <div className="text-muted-foreground">лет</div>
              </div>
              <div className="text-center p-2 bg-muted/20 rounded">
                <div className="font-medium text-foreground">
                  {healthProfile.weight && healthProfile.height 
                    ? (healthProfile.weight / Math.pow(healthProfile.height / 100, 2)).toFixed(1)
                    : 'Н/Д'
                  }
                </div>
                <div className="text-muted-foreground">ИМТ</div>
              </div>
              <div className="text-center p-2 bg-muted/20 rounded">
                <div className="font-medium text-foreground">{healthProfile.sleepHours}ч</div>
                <div className="text-muted-foreground">сон</div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile-Optimized Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="overflow-x-auto">
            <TabsList className="inline-flex h-9 items-center justify-start rounded-lg bg-muted/30 p-1 text-muted-foreground min-w-full">
              <TabsTrigger value="overview" className="flex items-center gap-1 text-xs px-2 py-1.5 whitespace-nowrap">
                <Brain className="h-3 w-3" />
                <span>Обзор</span>
              </TabsTrigger>
              <TabsTrigger value="lifestyle" className="flex items-center gap-1 text-xs px-2 py-1.5 whitespace-nowrap">
                <Heart className="h-3 w-3" />
                <span>Образ жизни</span>
              </TabsTrigger>
              <TabsTrigger value="nutrition" className="flex items-center gap-1 text-xs px-2 py-1.5 whitespace-nowrap">
                <Apple className="h-3 w-3" />
                <span>Питание</span>
              </TabsTrigger>
              <TabsTrigger value="biomarkers" className="flex items-center gap-1 text-xs px-2 py-1.5 whitespace-nowrap">
                <FlaskConical className="h-3 w-3" />
                <span>Анализы</span>
              </TabsTrigger>
              <TabsTrigger value="supplements" className="flex items-center gap-1 text-xs px-2 py-1.5 whitespace-nowrap">
                <Pill className="h-3 w-3" />
                <span>Добавки</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Content Area */}
          <div className="min-h-[400px]">
            <TabsContent value="overview" className="space-y-4 mt-0">
              <AIHealthConsultant 
                healthProfile={healthProfile} 
                analytics={analytics}
                recommendations={recommendations}
                isLoading={isLoading}
              />
              
              {/* Desktop Health Metrics */}
              <div className="hidden lg:block">
                <HealthMetricsCard healthProfile={healthProfile} analytics={analytics} />
              </div>
              
              <RecommendationsOverview recommendations={recommendations} />
            </TabsContent>

            <TabsContent value="lifestyle" className="space-y-4 mt-0">
              <LifestyleRecommendations 
                recommendations={recommendations} 
                healthProfile={healthProfile}
              />
            </TabsContent>

            <TabsContent value="nutrition" className="space-y-4 mt-0">
              {recommendations?.foods && recommendations.foods.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-primary">Рекомендации по питанию</h3>
                  <div className="space-y-3">
                    {recommendations.foods.map((food, index) => (
                      <div key={index} className="bg-surface rounded-lg p-3 border-0">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1">
                              <h4 className="font-medium text-primary text-sm">{food.name}</h4>
                              <p className="text-xs text-secondary-foreground mt-1">{food.reason}</p>
                            </div>
                            <span className="text-xs text-muted-foreground px-2 py-1 bg-muted/30 rounded whitespace-nowrap">
                              {food.portion}
                            </span>
                          </div>
                          <div className="grid grid-cols-4 gap-1.5 text-xs">
                            <div className="text-center p-1.5 bg-muted/20 rounded">
                              <div className="font-medium text-xs">{food.calories}</div>
                              <div className="text-muted-foreground text-xs">ккал</div>
                            </div>
                            <div className="text-center p-1.5 bg-muted/20 rounded">
                              <div className="font-medium text-xs">{food.protein}г</div>
                              <div className="text-muted-foreground text-xs">белки</div>
                            </div>
                            <div className="text-center p-1.5 bg-muted/20 rounded">
                              <div className="font-medium text-xs">{food.carbs}г</div>
                              <div className="text-muted-foreground text-xs">углев.</div>
                            </div>
                            <div className="text-center p-1.5 bg-muted/20 rounded">
                              <div className="font-medium text-xs">{food.fat}г</div>
                              <div className="text-muted-foreground text-xs">жиры</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  <Apple className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Нет доступных рекомендаций по питанию</p>
                  <p className="text-xs mt-1">Сгенерируйте рекомендации для получения персональных советов</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="biomarkers" className="space-y-4 mt-0">
              <BiomarkersInsights 
                recommendations={recommendations}
                healthProfile={healthProfile}
                analytics={analytics}
              />
            </TabsContent>

            <TabsContent value="supplements" className="space-y-4 mt-0">
              <SupplementsRecommendations recommendations={recommendations} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Analytics;