
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNutritionGoals } from "@/hooks/useNutritionGoals";
import { useFoodEntries } from "@/hooks/useFoodEntries";

interface DailyProgressProps {
  selectedDate: Date;
}

const DailyProgress: React.FC<DailyProgressProps> = ({ selectedDate }) => {
  const { goals } = useNutritionGoals();
  const { getDailyTotals, isLoading } = useFoodEntries(selectedDate);

  const consumed = getDailyTotals();
  const dailyGoals = goals || {
    daily_calories: 2000,
    daily_protein: 150,
    daily_carbs: 250,
    daily_fat: 65
  };

  const getProgressPercentage = (consumed: number, goal: number) => {
    return Math.min((consumed / goal) * 100, 100);
  };

  const getRemainingAmount = (consumed: number, goal: number) => {
    return Math.max(goal - consumed, 0);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Прогресс за день</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Загрузка...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Прогресс за день</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Калории</span>
              <span className="text-sm text-gray-600">
                {consumed.calories}/{dailyGoals.daily_calories}
              </span>
            </div>
            <Progress value={getProgressPercentage(consumed.calories, dailyGoals.daily_calories)} />
            <p className="text-xs text-gray-500">
              Осталось: {getRemainingAmount(consumed.calories, dailyGoals.daily_calories)} ккал
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-600">Белки</span>
              <span className="text-sm text-gray-600">
                {consumed.protein.toFixed(1)}/{dailyGoals.daily_protein}г
              </span>
            </div>
            <Progress value={getProgressPercentage(consumed.protein, dailyGoals.daily_protein)} className="[&>div]:bg-blue-500" />
            <p className="text-xs text-gray-500">
              Осталось: {getRemainingAmount(consumed.protein, dailyGoals.daily_protein).toFixed(1)}г
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-green-600">Углеводы</span>
              <span className="text-sm text-gray-600">
                {consumed.carbs.toFixed(1)}/{dailyGoals.daily_carbs}г
              </span>
            </div>
            <Progress value={getProgressPercentage(consumed.carbs, dailyGoals.daily_carbs)} className="[&>div]:bg-green-500" />
            <p className="text-xs text-gray-500">
              Осталось: {getRemainingAmount(consumed.carbs, dailyGoals.daily_carbs).toFixed(1)}г
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-orange-600">Жиры</span>
              <span className="text-sm text-gray-600">
                {consumed.fat.toFixed(1)}/{dailyGoals.daily_fat}г
              </span>
            </div>
            <Progress value={getProgressPercentage(consumed.fat, dailyGoals.daily_fat)} className="[&>div]:bg-orange-500" />
            <p className="text-xs text-gray-500">
              Осталось: {getRemainingAmount(consumed.fat, dailyGoals.daily_fat).toFixed(1)}г
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyProgress;
