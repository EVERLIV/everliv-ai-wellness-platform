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
        {/* Header */}
        <div className="space-y-content-xs">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-primary">ИИ-Рекомендации по здоровью</h1>
            <p className="text-sm text-secondary-foreground">Персонализированные рекомендации на основе ваших данных</p>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleGenerateRecommendations}
              disabled={isLoading}
              variant="secondary"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Генерируем...' : 'Обновить рекомендации'}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-content">
          {/* Left Sidebar - Health Metrics */}
          <div className="lg:col-span-1 space-y-content">
            <HealthMetricsCard healthProfile={healthProfile} analytics={analytics} />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-content">
              <TabsList className="grid w-full grid-cols-5 bg-muted/30 p-1 h-auto">
                <TabsTrigger value="overview" className="flex items-center gap-1 text-xs py-2">
                  <Brain className="h-3 w-3" />
                  <span className="hidden sm:inline">Обзор</span>
                </TabsTrigger>
                <TabsTrigger value="lifestyle" className="flex items-center gap-1 text-xs py-2">
                  <Heart className="h-3 w-3" />
                  <span className="hidden sm:inline">Образ жизни</span>
                </TabsTrigger>
                <TabsTrigger value="nutrition" className="flex items-center gap-1 text-xs py-2">
                  <Apple className="h-3 w-3" />
                  <span className="hidden sm:inline">Питание</span>
                </TabsTrigger>
                <TabsTrigger value="biomarkers" className="flex items-center gap-1 text-xs py-2">
                  <FlaskConical className="h-3 w-3" />
                  <span className="hidden sm:inline">Биомаркеры</span>
                </TabsTrigger>
                <TabsTrigger value="supplements" className="flex items-center gap-1 text-xs py-2">
                  <Pill className="h-3 w-3" />
                  <span className="hidden sm:inline">Добавки</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-content mt-4">
                <div className="space-y-content">
                  <AIHealthConsultant 
                    healthProfile={healthProfile} 
                    analytics={analytics}
                    recommendations={recommendations}
                    isLoading={isLoading}
                  />
                  <RecommendationsOverview recommendations={recommendations} />
                </div>
              </TabsContent>

              <TabsContent value="lifestyle" className="space-y-content mt-4">
                <LifestyleRecommendations 
                  recommendations={recommendations} 
                  healthProfile={healthProfile}
                />
              </TabsContent>

              <TabsContent value="nutrition" className="space-y-content mt-4">
                <div className="grid gap-content">
                  {recommendations?.foods && recommendations.foods.length > 0 ? (
                    <div className="space-y-content-xs">
                      <h3 className="text-lg font-semibold text-primary">Рекомендации по питанию</h3>
                      <div className="grid gap-3">
                         {recommendations.foods.map((food, index) => (
                          <div key={index} className="bg-surface rounded-lg p-content-xs border-0">
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-primary">{food.name}</h4>
                                <span className="text-sm text-muted-foreground">{food.portion}</span>
                              </div>
                              <p className="text-sm text-secondary-foreground">{food.reason}</p>
                              <div className="grid grid-cols-4 gap-2 text-xs">
                                <div className="text-center p-2 bg-muted/30 rounded">
                                  <div className="font-medium">{food.calories}</div>
                                  <div className="text-muted-foreground">ккал</div>
                                </div>
                                <div className="text-center p-2 bg-muted/30 rounded">
                                  <div className="font-medium">{food.protein}г</div>
                                  <div className="text-muted-foreground">белки</div>
                                </div>
                                <div className="text-center p-2 bg-muted/30 rounded">
                                  <div className="font-medium">{food.carbs}г</div>
                                  <div className="text-muted-foreground">углеводы</div>
                                </div>
                                <div className="text-center p-2 bg-muted/30 rounded">
                                  <div className="font-medium">{food.fat}г</div>
                                  <div className="text-muted-foreground">жиры</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-content text-muted-foreground">
                      Нет доступных рекомендаций по питанию
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="biomarkers" className="space-y-content mt-4">
                <BiomarkersInsights 
                  recommendations={recommendations}
                  healthProfile={healthProfile}
                  analytics={analytics}
                />
              </TabsContent>

              <TabsContent value="supplements" className="space-y-content mt-4">
                <SupplementsRecommendations recommendations={recommendations} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Analytics;