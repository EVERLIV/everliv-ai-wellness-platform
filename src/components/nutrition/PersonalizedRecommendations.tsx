
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Sparkles, Apple, Pill, Activity, Clock, ChefHat, Target } from 'lucide-react';
import { usePersonalizedRecommendations } from '@/hooks/usePersonalizedRecommendations';
import { useProfile } from '@/hooks/useProfile';
import { useNutritionGoals } from '@/hooks/useNutritionGoals';
import { useFoodEntries } from '@/hooks/useFoodEntries';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';

const PersonalizedRecommendations: React.FC = () => {
  const { user } = useAuth();
  const { subscription, isTrialActive } = useSubscription();
  const { profileData } = useProfile();
  const { goals } = useNutritionGoals();
  const { getDailyTotals } = useFoodEntries(new Date());
  const { recommendations, isLoading, generateRecommendations } = usePersonalizedRecommendations();
  const [hasGenerated, setHasGenerated] = useState(false);

  // Проверяем, есть ли у пользователя премиум доступ
  const hasPremiumAccess = () => {
    console.log('🔍 PersonalizedRecommendations checking premium access:', {
      subscription,
      isTrialActive
    });
    
    // Проверяем активную подписку
    if (subscription && subscription.status === 'active') {
      const now = new Date();
      const expiresAt = new Date(subscription.expires_at);
      const hasValidSubscription = expiresAt > now && subscription.plan_type === 'premium';
      console.log('✅ Premium subscription check:', hasValidSubscription);
      return hasValidSubscription;
    }
    
    // Проверяем пробный период
    const hasTrialAccess = isTrialActive;
    console.log('🎯 Trial access check:', hasTrialAccess);
    
    return hasTrialAccess;
  };

  // Проверяем, заполнен ли профиль пользователя
  const isProfileComplete = () => {
    return profileData && 
           profileData.height && 
           profileData.weight && 
           profileData.date_of_birth && 
           profileData.gender &&
           profileData.goals && 
           profileData.goals.length > 0;
  };

  const canGenerateRecommendations = hasPremiumAccess() && isProfileComplete();

  const handleGenerateRecommendations = async () => {
    if (!canGenerateRecommendations || !goals) return;

    const currentIntake = getDailyTotals();
    
    await generateRecommendations({
      profile: profileData,
      goals,
      currentIntake
    });
    
    setHasGenerated(true);
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Войдите в систему для получения персональных рекомендаций</p>
        </CardContent>
      </Card>
    );
  }

  if (!hasPremiumAccess()) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <Sparkles className="h-5 w-5" />
            Персональные рекомендации
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-amber-700 mb-4">
            Получайте персональные рекомендации по питанию, добавкам и образу жизни с премиум подпиской.
          </p>
          <Button 
            onClick={() => window.location.href = '/subscription'} 
            className="bg-amber-600 hover:bg-amber-700"
          >
            Оформить Премиум
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!isProfileComplete()) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Target className="h-5 w-5" />
            Заполните профиль
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-700 mb-4">
            Для получения персональных рекомендаций заполните свой профиль здоровья.
          </p>
          <Button 
            onClick={() => window.location.href = '/health-profile'} 
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            Заполнить профиль
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Персональные рекомендации
            <Badge className="bg-purple-100 text-purple-800">Премиум</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hasGenerated && !recommendations && (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">
                Получите персональные рекомендации на основе вашего профиля и целей
              </p>
              <Button 
                onClick={handleGenerateRecommendations}
                disabled={isLoading || !canGenerateRecommendations}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Генерируем рекомендации...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Получить персональные рекомендации
                  </>
                )}
              </Button>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
              <p className="text-muted-foreground">Анализируем ваш профиль и генерируем рекомендации...</p>
            </div>
          )}

          {recommendations && (
            <div className="space-y-6">
              {/* Рекомендации по питанию */}
              {recommendations.foods && recommendations.foods.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                    <Apple className="h-5 w-5 text-green-600" />
                    Рекомендуемые продукты
                  </h3>
                  <div className="grid gap-3">
                    {recommendations.foods.slice(0, 5).map((food, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium">{food.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{food.reason}</p>
                            <p className="text-xs text-muted-foreground mt-2">Порция: {food.portion}</p>
                          </div>
                          <div className="text-right text-sm">
                            <p>{food.calories} ккал</p>
                            <p className="text-xs text-muted-foreground">
                              Б: {food.protein}г | Ж: {food.fat}г | У: {food.carbs}г
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Рекомендации по добавкам */}
              {recommendations.supplements && recommendations.supplements.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                    <Pill className="h-5 w-5 text-blue-600" />
                    Рекомендуемые добавки
                  </h3>
                  <div className="grid gap-3">
                    {recommendations.supplements.slice(0, 4).map((supplement, index) => (
                      <Card key={index} className="p-4">
                        <h4 className="font-medium">{supplement.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{supplement.benefit}</p>
                        <div className="flex justify-between items-center mt-2">
                          <Badge variant="outline">{supplement.dosage}</Badge>
                          <span className="text-xs text-muted-foreground">{supplement.timing}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* План питания */}
              {recommendations.mealPlan && recommendations.mealPlan.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                    <ChefHat className="h-5 w-5 text-orange-600" />
                    План питания
                  </h3>
                  <div className="grid gap-3">
                    {recommendations.mealPlan.map((meal, index) => (
                      <Card key={index} className="p-4">
                        <h4 className="font-medium mb-2">{meal.mealType}</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {meal.foods.map((food, foodIndex) => (
                            <li key={foodIndex}>• {food}</li>
                          ))}
                        </ul>
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
                  className="w-full"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Обновить рекомендации
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalizedRecommendations;
