
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNutritionGoals } from "@/hooks/useNutritionGoals";

const NutritionGoals: React.FC = () => {
  const { goals, isLoading, saveGoals } = useNutritionGoals();
  const [localGoals, setLocalGoals] = useState(goals || {
    daily_calories: 2000,
    daily_protein: 150,
    daily_carbs: 250,
    daily_fat: 65
  });

  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (goals) {
      setLocalGoals(goals);
    }
  }, [goals]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveGoals(localGoals);
    } finally {
      setIsSaving(false);
    }
  };

  const calculateRecommendations = () => {
    const calories = localGoals.daily_calories;
    return {
      protein: Math.round(calories * 0.3 / 4), // 30% калорий из белков
      carbs: Math.round(calories * 0.4 / 4),   // 40% калорий из углеводов
      fat: Math.round(calories * 0.3 / 9)      // 30% калорий из жиров
    };
  };

  const recommendations = calculateRecommendations();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">Загрузка...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Мои цели питания</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="calories">Калории в день</Label>
              <Input
                id="calories"
                type="number"
                value={localGoals.daily_calories}
                onChange={(e) => setLocalGoals({...localGoals, daily_calories: Number(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="protein">Белки (г)</Label>
              <Input
                id="protein"
                type="number"
                value={localGoals.daily_protein}
                onChange={(e) => setLocalGoals({...localGoals, daily_protein: Number(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="carbs">Углеводы (г)</Label>
              <Input
                id="carbs"
                type="number"
                value={localGoals.daily_carbs}
                onChange={(e) => setLocalGoals({...localGoals, daily_carbs: Number(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="fat">Жиры (г)</Label>
              <Input
                id="fat"
                type="number"
                value={localGoals.daily_fat}
                onChange={(e) => setLocalGoals({...localGoals, daily_fat: Number(e.target.value)})}
              />
            </div>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            {isSaving ? "Сохранение..." : "Сохранить цели"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Рекомендации ИИ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              На основе ваших целей по калориям ({localGoals.daily_calories} ккал), рекомендуется:
            </p>
            <div className="space-y-2">
              <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-blue-700">Белки</span>
                <span className="text-blue-600">{recommendations.protein}г</span>
              </div>
              <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-green-700">Углеводы</span>
                <span className="text-green-600">{recommendations.carbs}г</span>
              </div>
              <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
                <span className="font-medium text-orange-700">Жиры</span>
                <span className="text-orange-600">{recommendations.fat}г</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setLocalGoals({
                ...localGoals,
                daily_protein: recommendations.protein,
                daily_carbs: recommendations.carbs,
                daily_fat: recommendations.fat
              })}
              className="w-full"
            >
              Применить рекомендации
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NutritionGoals;
