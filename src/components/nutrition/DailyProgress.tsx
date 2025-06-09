
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, Target, TrendingUp } from "lucide-react";
import { useFoodEntries } from "@/hooks/useFoodEntries";
import { useNutritionGoals } from "@/hooks/useNutritionGoals";

interface DailyProgressProps {
  selectedDate: Date;
}

const DailyProgress: React.FC<DailyProgressProps> = ({ selectedDate }) => {
  const { getDailyTotals } = useFoodEntries(selectedDate);
  const { goals } = useNutritionGoals();
  
  const dailyTotals = getDailyTotals();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const getProgressColor = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (percentage < 50) return "bg-red-500";
    if (percentage < 80) return "bg-yellow-500";
    if (percentage <= 100) return "bg-green-500";
    return "bg-orange-500";
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <CalendarDays className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
          Прогресс за {formatDate(selectedDate)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Калории */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm font-medium">Калории</span>
              <span className="text-xs md:text-sm text-gray-600">
                {dailyTotals.calories} / {goals?.daily_calories || 0}
              </span>
            </div>
            <Progress 
              value={((dailyTotals.calories / (goals?.daily_calories || 1)) * 100)} 
              className="h-2"
            />
            <div className="text-xs text-gray-500">
              Осталось: {Math.max(0, (goals?.daily_calories || 0) - dailyTotals.calories)} ккал
            </div>
          </div>

          {/* Белки */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm font-medium">Белки</span>
              <span className="text-xs md:text-sm text-gray-600">
                {dailyTotals.protein.toFixed(1)} / {goals?.daily_protein || 0}г
              </span>
            </div>
            <Progress 
              value={((dailyTotals.protein / (goals?.daily_protein || 1)) * 100)} 
              className="h-2 [&>div]:bg-blue-500"
            />
            <div className="text-xs text-gray-500">
              Осталось: {Math.max(0, (goals?.daily_protein || 0) - dailyTotals.protein).toFixed(1)}г
            </div>
          </div>

          {/* Углеводы */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm font-medium">Углеводы</span>
              <span className="text-xs md:text-sm text-gray-600">
                {dailyTotals.carbs.toFixed(1)} / {goals?.daily_carbs || 0}г
              </span>
            </div>
            <Progress 
              value={((dailyTotals.carbs / (goals?.daily_carbs || 1)) * 100)} 
              className="h-2 [&>div]:bg-green-500"
            />
            <div className="text-xs text-gray-500">
              Осталось: {Math.max(0, (goals?.daily_carbs || 0) - dailyTotals.carbs).toFixed(1)}г
            </div>
          </div>

          {/* Жиры */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm font-medium">Жиры</span>
              <span className="text-xs md:text-sm text-gray-600">
                {dailyTotals.fat.toFixed(1)} / {goals?.daily_fat || 0}г
              </span>
            </div>
            <Progress 
              value={((dailyTotals.fat / (goals?.daily_fat || 1)) * 100)} 
              className="h-2 [&>div]:bg-orange-500"
            />
            <div className="text-xs text-gray-500">
              Осталось: {Math.max(0, (goals?.daily_fat || 0) - dailyTotals.fat).toFixed(1)}г
            </div>
          </div>
        </div>

        {/* Общая статистика */}
        <div className="mt-4 md:mt-6 pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <Target className="h-4 w-4 text-green-500" />
              <span>
                Цель калорий: {((dailyTotals.calories / (goals?.daily_calories || 1)) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span>
                Баланс БЖУ: {(dailyTotals.protein * 4 + dailyTotals.carbs * 4 + dailyTotals.fat * 9).toFixed(0)} ккал
              </span>
            </div>
            <div className="text-xs md:text-sm text-gray-600">
              Последнее обновление: {new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyProgress;
