
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Apple, Pill, ChefHat, AlertCircle } from 'lucide-react';
import { usePersonalizedRecommendations } from '@/hooks/usePersonalizedRecommendations';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { useNutritionGoals } from '@/hooks/useNutritionGoals';
import { useFoodEntries } from '@/hooks/useFoodEntries';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';

const PersonalizedRecommendations: React.FC = () => {
  const { user } = useAuth();
  const { subscription, isTrialActive } = useSubscription();
  const { healthProfile, isLoading: profileLoading } = useHealthProfile();
  const { goals, isLoading: goalsLoading } = useNutritionGoals();
  const { getDailyTotals } = useFoodEntries(new Date());
  const { recommendations, isLoading, generateRecommendations } = usePersonalizedRecommendations();
  const [hasGenerated, setHasGenerated] = useState(false);

  // Проверяем, есть ли у пользователя премиум доступ
  const hasPremiumAccess = () => {
    if (subscription && subscription.status === 'active') {
      const now = new Date();
      const expiresAt = new Date(subscription.expires_at);
      return expiresAt > now && subscription.plan_type === 'premium';
    }
    return isTrialActive;
  };

  // Проверяем наличие базовых данных профиля здоровья
  const hasBasicHealthProfile = () => {
    console.log('Health profile data:', healthProfile);
    return healthProfile && 
           healthProfile.height && 
           healthProfile.weight && 
           healthProfile.gender;
  };

  // Проверяем наличие целей питания
  const hasNutritionGoals = () => {
    console.log('Nutrition goals:', goals);
    return goals && 
           goals.daily_calories > 0 && 
           goals.daily_protein > 0 && 
           goals.daily_carbs > 0 && 
           goals.daily_fat > 0;
  };

  const canGenerateRecommendations = hasBasicHealthProfile() && hasNutritionGoals();

  const handleGenerateRecommendations = async () => {
    if (!canGenerateRecommendations || !goals || !healthProfile) return;

    const currentIntake = getDailyTotals();
    
    // Конвертируем данные из health profile в формат, ожидаемый функцией
    const profileData = {
      age: healthProfile.age,
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
      goals,
      currentIntake
    });
    
    setHasGenerated(true);
  };

  if (!user) {
    return (
      <Card className="mobile-card">
        <CardContent className="mobile-card-content text-center">
          <p className="mobile-text-body text-gray-600">
            Войдите в систему для получения персональных рекомендаций
          </p>
        </CardContent>
      </Card>
    );
  }

  if (profileLoading || goalsLoading) {
    return (
      <Card className="mobile-card">
        <CardContent className="mobile-card-content text-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-3 text-primary" />
          <p className="mobile-text-body text-gray-600">Загрузка данных...</p>
        </CardContent>
      </Card>
    );
  }

  if (!hasPremiumAccess()) {
    return (
      <Card className="mobile-card border-amber-200 bg-amber-50">
        <CardHeader className="mobile-card-header">
          <CardTitle className="mobile-heading-secondary flex items-center gap-2 text-amber-800">
            <Sparkles className="h-5 w-5" />
            Персональные рекомендации
          </CardTitle>
        </CardHeader>
        <CardContent className="mobile-card-content">
          <p className="mobile-text-body text-amber-700 mb-4">
            Получайте персональные рекомендации по питанию с премиум подпиской.
          </p>
          <Button 
            onClick={() => window.location.href = '/subscription'} 
            className="mobile-button bg-amber-600 hover:bg-amber-700 w-full sm:w-auto"
          >
            Оформить Премиум
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!hasBasicHealthProfile()) {
    return (
      <Card className="mobile-card border-blue-200 bg-blue-50">
        <CardHeader className="mobile-card-header">
          <CardTitle className="mobile-heading-secondary flex items-center gap-2 text-blue-800">
            <AlertCircle className="h-5 w-5" />
            Заполните профиль здоровья
          </CardTitle>
        </CardHeader>
        <CardContent className="mobile-card-content">
          <p className="mobile-text-body text-blue-700 mb-4">
            Укажите основные данные в профиле здоровья (рост, вес, пол) для получения персональных рекомендаций.
          </p>
          <div className="text-xs text-blue-600 mb-4 p-2 bg-blue-100 rounded">
            Отладка: Рост: {healthProfile?.height || 'нет'}, Вес: {healthProfile?.weight || 'нет'}, Пол: {healthProfile?.gender || 'нет'}
          </div>
          <Button 
            onClick={() => window.location.href = '/health-profile'} 
            variant="outline"
            className="mobile-button border-blue-300 text-blue-700 hover:bg-blue-100 w-full sm:w-auto"
          >
            Заполнить профиль здоровья
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!hasNutritionGoals()) {
    return (
      <Card className="mobile-card border-purple-200 bg-purple-50">
        <CardHeader className="mobile-card-header">
          <CardTitle className="mobile-heading-secondary flex items-center gap-2 text-purple-800">
            <AlertCircle className="h-5 w-5" />
            Настройте цели питания
          </CardTitle>
        </CardHeader>
        <CardContent className="mobile-card-content">
          <p className="mobile-text-body text-purple-700 mb-4">
            Установите цели по калориям и БЖУ для получения персональных рекомендаций.
          </p>
          <Button 
            onClick={() => window.location.href = '/nutrition-diary?tab=goals'} 
            variant="outline"
            className="mobile-button border-purple-300 text-purple-700 hover:bg-purple-100 w-full sm:w-auto"
          >
            Настроить цели
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mobile-card">
      <CardHeader className="mobile-card-header">
        <CardTitle className="mobile-heading-secondary flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Персональные рекомендации
          <Badge className="mobile-badge bg-purple-100 text-purple-800">Премиум</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="mobile-card-content">
        {!hasGenerated && !recommendations && (
          <div className="text-center py-6">
            <p className="mobile-text-body text-gray-600 mb-4">
              Получите персональные рекомендации на основе вашего профиля здоровья и целей питания
            </p>
            <div className="text-xs text-gray-500 mb-4 p-2 bg-gray-50 rounded">
              Данные профиля: рост {healthProfile?.height}см, вес {healthProfile?.weight}кг, пол {healthProfile?.gender}
              {healthProfile?.allergies && healthProfile.allergies.length > 0 && (
                <div>Аллергии: {healthProfile.allergies.join(', ')}</div>
              )}
              {healthProfile?.medications && healthProfile.medications.length > 0 && (
                <div>Лекарства: {healthProfile.medications.join(', ')}</div>
              )}
              {healthProfile?.chronicConditions && healthProfile.chronicConditions.length > 0 && (
                <div>Хронические заболевания: {healthProfile.chronicConditions.join(', ')}</div>
              )}
            </div>
            <Button 
              onClick={handleGenerateRecommendations}
              disabled={isLoading || !canGenerateRecommendations}
              className="mobile-button bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Генерируем рекомендации...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Получить рекомендации
                </>
              )}
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
            <p className="mobile-text-body text-gray-600">
              Анализируем ваш профиль здоровья и генерируем персональные рекомендации...
            </p>
          </div>
        )}

        {recommendations && (
          <div className="mobile-content-spacing">
            {/* Продукты */}
            {recommendations.foods && recommendations.foods.length > 0 && (
              <div className="mb-6">
                <h3 className="mobile-heading-secondary flex items-center gap-2 mb-4">
                  <Apple className="h-5 w-5 text-green-600" />
                  Рекомендуемые продукты
                </h3>
                <div className="space-y-3">
                  {recommendations.foods.slice(0, 5).map((food, index) => (
                    <Card key={index} className="mobile-card">
                      <CardContent className="mobile-card-content">
                        <div className="mobile-flex-header">
                          <div className="flex-1 min-w-0">
                            <h4 className="mobile-text-body font-medium text-gray-900">{food.name}</h4>
                            <p className="mobile-text-small text-gray-600 mt-1">{food.reason}</p>
                            <p className="mobile-text-small text-gray-500 mt-2">
                              Порция: {food.portion}
                            </p>
                          </div>
                          <div className="text-right mobile-text-small ml-4">
                            <p className="font-medium">{food.calories} ккал</p>
                            <p className="text-gray-500 mt-1">
                              Б: {food.protein}г
                            </p>
                            <p className="text-gray-500">
                              Ж: {food.fat}г
                            </p>
                            <p className="text-gray-500">
                              У: {food.carbs}г
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Добавки */}
            {recommendations.supplements && recommendations.supplements.length > 0 && (
              <div className="mb-6">
                <h3 className="mobile-heading-secondary flex items-center gap-2 mb-4">
                  <Pill className="h-5 w-5 text-blue-600" />
                  Рекомендуемые добавки
                </h3>
                <div className="space-y-3">
                  {recommendations.supplements.slice(0, 4).map((supplement, index) => (
                    <Card key={index} className="mobile-card">
                      <CardContent className="mobile-card-content">
                        <h4 className="mobile-text-body font-medium text-gray-900">{supplement.name}</h4>
                        <p className="mobile-text-small text-gray-600 mt-1">{supplement.benefit}</p>
                        <div className="mobile-flex-header mt-3">
                          <Badge variant="outline" className="mobile-badge-sm">
                            {supplement.dosage}
                          </Badge>
                          <span className="mobile-text-small text-gray-500">
                            {supplement.timing}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* План питания */}
            {recommendations.mealPlan && recommendations.mealPlan.length > 0 && (
              <div className="mb-6">
                <h3 className="mobile-heading-secondary flex items-center gap-2 mb-4">
                  <ChefHat className="h-5 w-5 text-orange-600" />
                  План питания
                </h3>
                <div className="space-y-3">
                  {recommendations.mealPlan.map((meal, index) => (
                    <Card key={index} className="mobile-card">
                      <CardContent className="mobile-card-content">
                        <h4 className="mobile-text-body font-medium text-gray-900 mb-3">
                          {meal.mealType}
                        </h4>
                        <ul className="mobile-text-small text-gray-600 space-y-1">
                          {meal.foods.map((food, foodIndex) => (
                            <li key={foodIndex} className="flex items-start gap-2">
                              <span className="text-primary">•</span>
                              <span>{food}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4">
              <Button 
                onClick={handleGenerateRecommendations}
                disabled={isLoading}
                variant="outline"
                className="mobile-button w-full"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Обновить рекомендации
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalizedRecommendations;
