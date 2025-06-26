
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useFoodEntries } from '@/hooks/useFoodEntries';
import { useNutritionGoals } from '@/hooks/useNutritionGoals';
import { Apple, Plus, Target } from 'lucide-react';

const NutritionSummarySection: React.FC = () => {
  const navigate = useNavigate();
  const { getDailyTotals, isLoading } = useFoodEntries(new Date());
  const { goals } = useNutritionGoals();
  const dailyTotals = getDailyTotals();

  const hasNutritionData = dailyTotals.calories > 0 || dailyTotals.protein > 0 || dailyTotals.carbs > 0 || dailyTotals.fat > 0;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Мое питание
        </h3>
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        Мое питание
      </h3>
      
      {hasNutritionData ? (
        <div className="space-y-3">
          {/* Макронутриенты */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-100">
              <div className="text-xs text-gray-600 mb-1">Калории</div>
              <div className="text-lg font-bold text-orange-600">{dailyTotals.calories}</div>
              <div className="text-xs text-gray-500">из {goals?.daily_calories || 2000}</div>
            </div>
            
            <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
              <div className="text-xs text-gray-600 mb-1">Белки</div>
              <div className="text-lg font-bold text-blue-600">{dailyTotals.protein.toFixed(0)}г</div>
              <div className="text-xs text-gray-500">из {goals?.daily_protein || 150}г</div>
            </div>
            
            <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
              <div className="text-xs text-gray-600 mb-1">Углеводы</div>
              <div className="text-lg font-bold text-green-600">{dailyTotals.carbs.toFixed(0)}г</div>
              <div className="text-xs text-gray-500">из {goals?.daily_carbs || 250}г</div>
            </div>
            
            <div className="p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-100">
              <div className="text-xs text-gray-600 mb-1">Жиры</div>
              <div className="text-lg font-bold text-yellow-600">{dailyTotals.fat.toFixed(0)}г</div>
              <div className="text-xs text-gray-500">из {goals?.daily_fat || 65}г</div>
            </div>
          </div>

          {/* Прогресс по целям */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3 text-green-500" />
                <span className="text-gray-600">
                  Цель калорий: {Math.round((dailyTotals.calories / (goals?.daily_calories || 2000)) * 100)}%
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/nutrition-diary')}
                className="text-xs px-2 py-1 h-6 text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                Подробнее
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Apple className="h-6 w-6 text-green-500" />
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Нет данных
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Добавьте первый прием пищи для отслеживания питания
          </p>
          <Button 
            size="sm"
            onClick={() => navigate('/nutrition-diary')}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-xs px-4 py-2"
          >
            <Plus className="h-3 w-3 mr-1" />
            Добавить питание
          </Button>
        </div>
      )}
    </div>
  );
};

export default NutritionSummarySection;
