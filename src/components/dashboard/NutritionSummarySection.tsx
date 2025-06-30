
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Utensils, Droplets, Zap } from 'lucide-react';

const NutritionSummarySection: React.FC = () => {
  const nutritionData = {
    calories: { current: 1847, target: 2200, unit: 'ккал' },
    water: { current: 6, target: 8, unit: 'стаканов' },
    protein: { current: 85, target: 120, unit: 'г' }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return '[&>div]:bg-green-500';
    if (percentage >= 80) return '[&>div]:bg-blue-500';
    if (percentage >= 60) return '[&>div]:bg-yellow-500';
    return '[&>div]:bg-red-500';
  };

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
              {nutritionData.calories.current} / {nutritionData.calories.target} {nutritionData.calories.unit}
            </span>
          </div>
          <Progress 
            value={(nutritionData.calories.current / nutritionData.calories.target) * 100} 
            className={`h-2 ${getProgressColor((nutritionData.calories.current / nutritionData.calories.target) * 100)}`}
          />
        </div>

        {/* Water */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">Вода</span>
            </div>
            <span className="text-sm text-gray-600">
              {nutritionData.water.current} / {nutritionData.water.target} {nutritionData.water.unit}
            </span>
          </div>
          <Progress 
            value={(nutritionData.water.current / nutritionData.water.target) * 100} 
            className={`h-2 ${getProgressColor((nutritionData.water.current / nutritionData.water.target) * 100)}`}
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
              {nutritionData.protein.current} / {nutritionData.protein.target} {nutritionData.protein.unit}
            </span>
          </div>
          <Progress 
            value={(nutritionData.protein.current / nutritionData.protein.target) * 100} 
            className={`h-2 ${getProgressColor((nutritionData.protein.current / nutritionData.protein.target) * 100)}`}
          />
        </div>

        <div className="pt-2 border-t border-gray-200/50">
          <p className="text-xs text-gray-500 text-center">
            Последнее обновление: {new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionSummarySection;
