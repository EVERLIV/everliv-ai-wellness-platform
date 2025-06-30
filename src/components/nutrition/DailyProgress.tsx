
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
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <CalendarDays className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <span className="text-lg font-semibold text-gray-900">
              Прогресс за {formatDate(selectedDate)}
            </span>
            <p className="text-sm text-gray-600 font-normal mt-1">
              Отслеживание достижения целей по питанию
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="responsive-grid-4 mb-6">
          {/* Калории */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Калории</span>
              <span className="text-sm text-gray-600 font-mono">
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
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Белки</span>
              <span className="text-sm text-gray-600 font-mono">
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
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Углеводы</span>
              <span className="text-sm text-gray-600 font-mono">
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
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Жиры</span>
              <span className="text-sm text-gray-600 font-mono">
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
        <div className="content-divider"></div>
        <div className="responsive-grid">
          <div className="flex items-center gap-3 text-sm">
            <div className="p-1.5 bg-green-100 rounded">
              <Target className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-gray-600">
              Цель калорий: {((dailyTotals.calories / (goals?.daily_calories || 1)) * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="p-1.5 bg-blue-100 rounded">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-gray-600">
              Баланс БЖУ: {(dailyTotals.protein * 4 + dailyTotals.carbs * 4 + dailyTotals.fat * 9).toFixed(0)} ккал
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Последнее обновление: {new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyProgress;
