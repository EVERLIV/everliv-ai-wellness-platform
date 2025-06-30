
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Utensils, Droplets, Zap, Plus } from 'lucide-react';
import { useFoodEntries } from '@/hooks/useFoodEntries';
import { useNutritionGoals } from '@/hooks/useNutritionGoals';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NutritionSummarySection: React.FC = () => {
  const today = new Date();
  const { entries, isLoading: entriesLoading, getDailyTotals } = useFoodEntries(today);
  const { goals, isLoading: goalsLoading } = useNutritionGoals();
  const navigate = useNavigate();

  // Получаем суммарные значения за день
  const dailyTotals = getDailyTotals();

  // Значения по умолчанию для целей
  const defaultGoals = {
    daily_calories: 2200,
    daily_protein: 120,
    daily_carbs: 250,
    daily_fat: 65
  };

  const nutritionGoals = goals || defaultGoals;

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return '[&>div]:bg-green-500';
    if (percentage >= 80) return '[&>div]:bg-blue-500';
    if (percentage >= 60) return '[&>div]:bg-yellow-500';
    return '[&>div]:bg-red-500';
  };

  const calculateWaterIntake = () => {
    // Примерный расчет на основе калорий (обычно 8 стаканов в день)
    const targetWater = 8;
    const currentWater = Math.min(8, Math.round((dailyTotals.calories / nutritionGoals.daily_calories) * targetWater));
    return { current: currentWater, target: targetWater };
  };

  const waterData = calculateWaterIntake();

  if (entriesLoading || goalsLoading) {
    return (
      <Card className="shadow-sm border-gray-200/80">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Utensils className="h-5 w-5 text-green-600" />
            <span className="text-lg font-semibold">Питание сегодня</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Если нет записей о питании
  if (entries.length === 0) {
    return (
      <Card className="shadow-sm border-gray-200/80">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Utensils className="h-5 w-5 text-green-600" />
            <span className="text-lg font-semibold">Питание сегодня</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Utensils className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-3">Записи о питании отсутствуют</p>
            <Button 
              size="sm" 
              onClick={() => navigate('/nutrition-diary')}
              className="text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Добавить прием пищи
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-gray-200/80">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Utensils className="h-5 w-5 text-green-600" />
          <span className="text-lg font-semibold">Питание сегодня</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Calories */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">Калории</span>
            </div>
            <span className="text-sm text-gray-600">
              {Math.round(dailyTotals.calories)} / {nutritionGoals.daily_calories} ккал
            </span>
          </div>
          <Progress 
            value={(dailyTotals.calories / nutritionGoals.daily_calories) * 100} 
            className={`h-2 ${getProgressColor((dailyTotals.calories / nutritionGoals.daily_calories) * 100)}`}
          />
        </div>

        {/* Protein */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-purple-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Белки</span>
            </div>
            <span className="text-sm text-gray-600">
              {Math.round(dailyTotals.protein)} / {nutritionGoals.daily_protein} г
            </span>
          </div>
          <Progress 
            value={(dailyTotals.protein / nutritionGoals.daily_protein) * 100} 
            className={`h-2 ${getProgressColor((dailyTotals.protein / nutritionGoals.daily_protein) * 100)}`}
          />
        </div>

        {/* Carbs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Углеводы</span>
            </div>
            <span className="text-sm text-gray-600">
              {Math.round(dailyTotals.carbs)} / {nutritionGoals.daily_carbs} г
            </span>
          </div>
          <Progress 
            value={(dailyTotals.carbs / nutritionGoals.daily_carbs) * 100} 
            className={`h-2 ${getProgressColor((dailyTotals.carbs / nutritionGoals.daily_carbs) * 100)}`}
          />
        </div>

        {/* Fat */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Жиры</span>
            </div>
            <span className="text-sm text-gray-600">
              {Math.round(dailyTotals.fat)} / {nutritionGoals.daily_fat} г
            </span>
          </div>
          <Progress 
            value={(dailyTotals.fat / nutritionGoals.daily_fat) * 100} 
            className={`h-2 ${getProgressColor((dailyTotals.fat / nutritionGoals.daily_fat) * 100)}`}
          />
        </div>

        <div className="pt-2 border-t border-gray-200/50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Приемов пищи: {entries.length}</span>
            <span>Обновлено: {new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionSummarySection;
