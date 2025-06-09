
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface DailyProgressProps {
  selectedDate: Date;
}

const DailyProgress: React.FC<DailyProgressProps> = ({ selectedDate }) => {
  // Здесь будет логика получения данных за выбранный день
  const dailyGoals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65
  };

  const consumed = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  };

  const getProgressPercentage = (consumed: number, goal: number) => {
    return Math.min((consumed / goal) * 100, 100);
  };

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
                {consumed.calories}/{dailyGoals.calories}
              </span>
            </div>
            <Progress value={getProgressPercentage(consumed.calories, dailyGoals.calories)} />
            <p className="text-xs text-gray-500">
              Осталось: {dailyGoals.calories - consumed.calories} ккал
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-600">Белки</span>
              <span className="text-sm text-gray-600">
                {consumed.protein}/{dailyGoals.protein}г
              </span>
            </div>
            <Progress value={getProgressPercentage(consumed.protein, dailyGoals.protein)} className="[&>div]:bg-blue-500" />
            <p className="text-xs text-gray-500">
              Осталось: {dailyGoals.protein - consumed.protein}г
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-green-600">Углеводы</span>
              <span className="text-sm text-gray-600">
                {consumed.carbs}/{dailyGoals.carbs}г
              </span>
            </div>
            <Progress value={getProgressPercentage(consumed.carbs, dailyGoals.carbs)} className="[&>div]:bg-green-500" />
            <p className="text-xs text-gray-500">
              Осталось: {dailyGoals.carbs - consumed.carbs}г
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-orange-600">Жиры</span>
              <span className="text-sm text-gray-600">
                {consumed.fat}/{dailyGoals.fat}г
              </span>
            </div>
            <Progress value={getProgressPercentage(consumed.fat, dailyGoals.fat)} className="[&>div]:bg-orange-500" />
            <p className="text-xs text-gray-500">
              Осталось: {dailyGoals.fat - consumed.fat}г
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyProgress;
