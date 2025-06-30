import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Apple, Pill, ChefHat, AlertCircle, BookOpen, Save, Clock, Users } from 'lucide-react';
import { usePersonalizedRecommendations } from '@/hooks/usePersonalizedRecommendations';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { useNutritionGoals } from '@/hooks/useNutritionGoals';
import { useFoodEntries } from '@/hooks/useFoodEntries';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useRecipes } from '@/hooks/useRecipes';

const PersonalizedRecommendations: React.FC = () => {
  const { user } = useAuth();
  const { subscription, isTrialActive } = useSubscription();
  const { healthProfile, isLoading: profileLoading } = useHealthProfile();
  const { goals, isLoading: goalsLoading } = useNutritionGoals();
  const { getDailyTotals } = useFoodEntries(new Date());
  const { recommendations, isLoading, generateRecommendations } = usePersonalizedRecommendations();
  const { generateRecipes, saveRecipe, isGenerating, isSaving } = useRecipes();
  const [hasGenerated, setHasGenerated] = useState(false);
  const [generatedRecipes, setGeneratedRecipes] = useState<any[]>([]);

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
    if (!canGenerateRecommendations || !goals || !healthProfile || !user) return;

    const currentIntake = getDailyTotals();
    
    // Создаем профиль данных с правильной типизацией
    const profileData = {
      id: user.id, // Используем ID пользователя
      first_name: user?.user_metadata?.first_name || '',
      last_name: user?.user_metadata?.last_name || '',
      nickname: user?.user_metadata?.nickname || '',
      date_of_birth: null, // HealthProfileData не содержит date_of_birth
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

  const handleGenerateRecipes = async () => {
    if (!recommendations?.foods || recommendations.foods.length === 0) return;

    const recipes = await generateRecipes(recommendations.foods.slice(0, 5));
    setGeneratedRecipes(recipes);
  };

  const handleSaveRecipe = async (recipe: any) => {
    await saveRecipe(recipe);
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
            Установите цели по калориям и макронутриентам для получения персональных рекомендаций.
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
    <div className="space-y-6">
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
        </CardContent>
      </Card>

      {recommendations && (
        <div className="space-y-6">
          {/* Продукты */}
          {recommendations.foods && recommendations.foods.length > 0 && (
            <Card className="mobile-card">
              <CardHeader className="mobile-card-header">
                <CardTitle className="mobile-heading-secondary flex items-center gap-2">
                  <Apple className="h-5 w-5 text-green-600" />
                  Рекомендуемые продукты
                </CardTitle>
              </CardHeader>
              <CardContent className="mobile-card-content">
                <div className="space-y-4">
                  {recommendations.foods.slice(0, 5).map((food, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="mobile-text-body font-medium text-gray-900 mb-2">{food.name}</h4>
                          <p className="mobile-text-small text-gray-600 mb-2">{food.reason}</p>
                          <p className="mobile-text-small text-gray-500">
                            Порция: {food.portion}
                          </p>
                        </div>
                        <div className="text-right mobile-text-small ml-4">
                          <p className="font-medium mb-1">{food.calories} ккал</p>
                          <div className="space-y-1 text-gray-500">
                            <p>Б: {food.protein}г</p>
                            <p>Ж: {food.fat}г</p>
                            <p>У: {food.carbs}г</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Рецепты на основе рекомендуемых продуктов */}
          {recommendations.foods && recommendations.foods.length > 0 && (
            <Card className="mobile-card">
              <CardHeader className="mobile-card-header">
                <div className="flex justify-between items-center">
                  <CardTitle className="mobile-heading-secondary flex items-center gap-2">
                    <ChefHat className="h-5 w-5 text-orange-600" />
                    Рецепты на основе рекомендуемых продуктов
                  </CardTitle>
                  <Button 
                    onClick={handleGenerateRecipes}
                    disabled={isGenerating}
                    variant="outline"
                    className="mobile-button-sm"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Генерируем...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Создать рецепты
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="mobile-card-content">
                {generatedRecipes.length > 0 ? (
                  <div className="space-y-6">
                    {generatedRecipes.map((recipe, index) => (
                      <div key={index} className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h4 className="mobile-text-body font-bold text-gray-900 mb-2">
                              {recipe.title}
                            </h4>
                            <p className="mobile-text-small text-gray-700 mb-3">
                              {recipe.description}
                            </p>
                            <div className="flex items-center gap-4 mb-4">
                              <div className="flex items-center gap-1 text-orange-700">
                                <Clock className="h-4 w-4" />
                                <span className="mobile-text-small">{recipe.cooking_time} мин</span>
                              </div>
                              <div className="flex items-center gap-1 text-orange-700">
                                <Users className="h-4 w-4" />
                                <span className="mobile-text-small capitalize">{recipe.difficulty === 'easy' ? 'Легко' : 'Средне'}</span>
                              </div>
                              {recipe.nutrition_info && (
                                <Badge variant="outline" className="text-orange-700 border-orange-300">
                                  {recipe.nutrition_info.calories} ккал
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            onClick={() => handleSaveRecipe(recipe)}
                            disabled={isSaving}
                            size="sm"
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                          >
                            {isSaving ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Ингредиенты:</h5>
                            <ul className="mobile-text-small text-gray-700 space-y-1">
                              {recipe.ingredients.map((ingredient: any, idx: number) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-orange-600 mt-1">•</span>
                                  <span>{ingredient.name} - {ingredient.amount} {ingredient.unit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Приготовление:</h5>
                            <ol className="mobile-text-small text-gray-700 space-y-2">
                              {recipe.instructions.map((instruction: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-orange-600 font-medium min-w-[20px]">{idx + 1}.</span>
                                  <span>{instruction}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>

                        {recipe.nutrition_info && (
                          <div className="mt-4 p-3 bg-white/60 rounded-lg">
                            <h5 className="font-medium text-gray-900 mb-2">Пищевая ценность:</h5>
                            <div className="grid grid-cols-4 gap-4 mobile-text-small">
                              <div className="text-center">
                                <div className="font-medium text-gray-900">{recipe.nutrition_info.calories}</div>
                                <div className="text-gray-600">ккал</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium text-gray-900">{recipe.nutrition_info.protein}г</div>
                                <div className="text-gray-600">Белки</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium text-gray-900">{recipe.nutrition_info.carbs}г</div>
                                <div className="text-gray-600">Углеводы</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium text-gray-900">{recipe.nutrition_info.fat}г</div>
                                <div className="text-gray-600">Жиры</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ChefHat className="h-12 w-12 mx-auto mb-3 text-orange-400" />
                    <p className="mobile-text-body">Нажмите "Создать рецепты" для генерации рецептов на основе рекомендуемых продуктов</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Добавки */}
          {recommendations.supplements && recommendations.supplements.length > 0 && (
            <Card className="mobile-card">
              <CardHeader className="mobile-card-header">
                <CardTitle className="mobile-heading-secondary flex items-center gap-2">
                  <Pill className="h-5 w-5 text-blue-600" />
                  Рекомендуемые добавки
                </CardTitle>
              </CardHeader>
              <CardContent className="mobile-card-content">
                <div className="space-y-4">
                  {recommendations.supplements.slice(0, 4).map((supplement, index) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="mobile-text-body font-medium text-gray-900 mb-2">{supplement.name}</h4>
                      <p className="mobile-text-small text-gray-600 mb-3">{supplement.benefit}</p>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-blue-700 border-blue-300">
                          {supplement.dosage}
                        </Badge>
                        <span className="mobile-text-small text-blue-600">
                          {supplement.timing}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* План питания */}
          {recommendations.mealPlan && recommendations.mealPlan.length > 0 && (
            <Card className="mobile-card">
              <CardHeader className="mobile-card-header">
                <CardTitle className="mobile-heading-secondary flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-green-600" />
                  План питания
                </CardTitle>
              </CardHeader>
              <CardContent className="mobile-card-content">
                <div className="space-y-4">
                  {recommendations.mealPlan.map((meal, index) => (
                    <div key={index} className="p-4 bg-green-50 rounded-lg">
                      <h4 className="mobile-text-body font-medium text-gray-900 mb-3">
                        {meal.mealType}
                      </h4>
                      <ul className="mobile-text-small text-gray-600 space-y-2">
                        {meal.foods.map((food, foodIndex) => (
                          <li key={foodIndex} className="flex items-start gap-2">
                            <span className="text-green-600 mt-1">•</span>
                            <span>{food}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleGenerateRecommendations}
              disabled={isLoading}
              variant="outline"
              className="mobile-button"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Обновить рекомендации
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalizedRecommendations;
