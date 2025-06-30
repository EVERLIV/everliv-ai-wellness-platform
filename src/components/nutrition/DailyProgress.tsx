
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

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <CalendarDays className="h-5 w-5 text-blue-600" />
          </div>
          <div className="content-padding-internal">
            <span className="heading-responsive text-gray-900">
              Прогресс за {formatDate(selectedDate)}
            </span>
            <p className="text-responsive text-gray-600 font-normal mt-1">
              Отслеживание достижения целей по питанию
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="progress-section">
        <div className="responsive-grid-4 mb-6">
          {/* Калории */}
          <div className="progress-item">
            <div className="progress-header">
              <span className="progress-label">Калории</span>
              <span className="progress-value">
                {dailyTotals.calories} / {goals?.daily_calories || 0}
              </span>
            </div>
            <Progress 
              value={((dailyTotals.calories / (goals?.daily_calories || 1)) * 100)} 
              className="h-2"
            />
            <div className="progress-remaining">
              Осталось: {Math.max(0, (goals?.daily_calories || 0) - dailyTotals.calories)} ккал
            </div>
          </div>

          {/* Белки */}
          <div className="progress-item">
            <div className="progress-header">
              <span className="progress-label">Белки</span>
              <span className="progress-value">
                {dailyTotals.protein.toFixed(1)} / {goals?.daily_protein || 0}г
              </span>
            </div>
            <Progress 
              value={((dailyTotals.protein / (goals?.daily_protein || 1)) * 100)} 
              className="h-2 [&>div]:bg-blue-500"
            />
            <div className="progress-remaining">
              Осталось: {Math.max(0, (goals?.daily_protein || 0) - dailyTotals.protein).toFixed(1)}г
            </div>
          </div>

          {/* Углеводы */}
          <div className="progress-item">
            <div className="progress-header">
              <span className="progress-label">Углеводы</span>
              <span className="progress-value">
                {dailyTotals.carbs.toFixed(1)} / {goals?.daily_carbs || 0}г
              </span>
            </div>
            <Progress 
              value={((dailyTotals.carbs / (goals?.daily_carbs || 1)) * 100)} 
              className="h-2 [&>div]:bg-green-500"
            />
            <div className="progress-remaining">
              Осталось: {Math.max(0, (goals?.daily_carbs || 0) - dailyTotals.carbs).toFixed(1)}г
            </div>
          </div>

          {/* Жиры */}
          <div className="progress-item">
            <div className="progress-header">
              <span className="progress-label">Жиры</span>
              <span className="progress-value">
                {dailyTotals.fat.toFixed(1)} / {goals?.daily_fat || 0}г
              </span>
            </div>
            <Progress 
              value={((dailyTotals.fat / (goals?.daily_fat || 1)) * 100)} 
              className="h-2 [&>div]:bg-orange-500"
            />
            <div className="progress-remaining">
              Осталось: {Math.max(0, (goals?.daily_fat || 0) - dailyTotals.fat).toFixed(1)}г
            </div>
          </div>
        </div>

        {/* Общая статистика */}
        <div className="content-divider"></div>
        <div className="responsive-grid">
          <div className="info-item">
            <div className="p-1.5 bg-green-100 rounded">
              <Target className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-content text-gray-600">
              Цель калорий: {((dailyTotals.calories / (goals?.daily_calories || 1)) * 100).toFixed(0)}%
            </span>
          </div>
          <div className="info-item">
            <div className="p-1.5 bg-blue-100 rounded">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-content text-gray-600">
              Баланс БЖУ: {(dailyTotals.protein * 4 + dailyTotals.carbs * 4 + dailyTotals.fat * 9).toFixed(0)} ккал
            </span>
          </div>
          <div className="text-content text-gray-500">
            Последнее обновление: {new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyProgress;
