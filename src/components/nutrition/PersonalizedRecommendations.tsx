
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Loader2, Heart, Activity, Zap, Apple } from "lucide-react";
import { useNutritionGoals } from "@/hooks/useNutritionGoals";
import { useFoodEntries } from "@/hooks/useFoodEntries";
import { useProfile } from "@/hooks/useProfile";
import { usePersonalizedRecommendations } from "@/hooks/usePersonalizedRecommendations";

const PersonalizedRecommendations: React.FC = () => {
  const { goals } = useNutritionGoals();
  const { getDailyTotals } = useFoodEntries(new Date());
  const { profileData } = useProfile();
  const { recommendations, isLoading, generateRecommendations } = usePersonalizedRecommendations();

  const dailyTotals = getDailyTotals();

  const handleGenerateRecommendations = () => {
    if (profileData && goals) {
      generateRecommendations({
        profile: profileData,
        goals,
        currentIntake: dailyTotals
      });
    }
  };

  useEffect(() => {
    // Автоматически генерируем рекомендации при загрузке, если есть все необходимые данные
    if (profileData && goals && !recommendations && !isLoading) {
      handleGenerateRecommendations();
    }
  }, [profileData, goals]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Генерируем персональные рекомендации...</span>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Для получения персональных рекомендаций необходимо заполнить профиль и установить цели питания.
            </p>
            <Button onClick={handleGenerateRecommendations} disabled={!profileData || !goals}>
              Получить рекомендации
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Персональные рекомендации</h2>
        <Button onClick={handleGenerateRecommendations} variant="outline" size="sm">
          Обновить рекомендации
        </Button>
      </div>

      <Tabs defaultValue="nutrition" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="nutrition">Питание</TabsTrigger>
          <TabsTrigger value="tests">Анализы</TabsTrigger>
          <TabsTrigger value="vitamins">Витамины</TabsTrigger>
          <TabsTrigger value="lifestyle">Образ жизни</TabsTrigger>
        </TabsList>

        <TabsContent value="nutrition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Apple className="h-5 w-5 text-green-500" />
                Рекомендуемые продукты
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.foods?.map((food, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-medium text-lg mb-2">{food.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{food.reason}</p>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-medium">{food.calories}</div>
                        <div className="text-gray-500">ккал</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-blue-600">{food.protein}г</div>
                        <div className="text-gray-500">белки</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-green-600">{food.carbs}г</div>
                        <div className="text-gray-500">углеводы</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-orange-600">{food.fat}г</div>
                        <div className="text-gray-500">жиры</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        {food.portion}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Дневной план питания</CardTitle>
            </CardHeader>
            <CardContent>
              {recommendations.mealPlan?.map((meal, index) => (
                <div key={index} className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">{meal.mealType}</h4>
                  <ul className="space-y-1 text-sm">
                    {meal.foods.map((food, foodIndex) => (
                      <li key={foodIndex} className="flex justify-between">
                        <span>{food}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-red-500" />
                Рекомендуемые анализы
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.labTests?.map((test, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{test.name}</h4>
                      <Badge 
                        variant={test.priority === 'high' ? 'destructive' : 
                                test.priority === 'medium' ? 'default' : 'secondary'}
                      >
                        {test.priority === 'high' ? 'Высокий' : 
                         test.priority === 'medium' ? 'Средний' : 'Низкий'} приоритет
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{test.reason}</p>
                    <p className="text-xs text-gray-500">
                      <strong>Периодичность:</strong> {test.frequency}
                    </p>
                    {test.preparation && (
                      <p className="text-xs text-gray-500 mt-1">
                        <strong>Подготовка:</strong> {test.preparation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vitamins" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Персональные витамины и добавки
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.supplements?.map((supplement, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{supplement.name}</h4>
                      <Badge variant="outline">{supplement.dosage}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{supplement.benefit}</p>
                    <p className="text-xs text-gray-500 mb-2">
                      <strong>Когда принимать:</strong> {supplement.timing}
                    </p>
                    {supplement.interactions && (
                      <p className="text-xs text-orange-600">
                        <strong>Взаимодействие:</strong> {supplement.interactions}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Витамины для улучшения усвояемости</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendations.absorptionHelpers?.map((helper, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800">{helper.name}</h4>
                    <p className="text-sm text-blue-700">{helper.function}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      <strong>Принимать с:</strong> {helper.takeWith}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lifestyle" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-purple-500" />
                Рекомендации по образу жизни
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.lifestyle?.map((recommendation, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">{recommendation.category}</h4>
                    <p className="text-sm text-gray-600 mb-2">{recommendation.advice}</p>
                    <div className="text-xs text-gray-500">
                      <strong>Цель:</strong> {recommendation.goal}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Прогресс к целям</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Калории</span>
                    <span>{dailyTotals.calories}/{goals?.daily_calories}</span>
                  </div>
                  <Progress value={(dailyTotals.calories / (goals?.daily_calories || 1)) * 100} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Белки</span>
                    <span>{dailyTotals.protein.toFixed(1)}г/{goals?.daily_protein}г</span>
                  </div>
                  <Progress value={(dailyTotals.protein / (goals?.daily_protein || 1)) * 100} className="[&>div]:bg-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonalizedRecommendations;
