
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Utensils, Plus, TrendingUp, Apple } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const NutritionDataCard: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Моковые данные для демонстрации
  const todayCalories = 1420;
  const targetCalories = 2000;
  const caloriesProgress = (todayCalories / targetCalories) * 100;

  const recentMeals = [
    { name: 'Овсянка с ягодами', calories: 320, time: '08:30' },
    { name: 'Куриный салат', calories: 450, time: '13:15' },
    { name: 'Греческий йогурт', calories: 150, time: '16:20' }
  ];

  if (isMobile) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-2 mobile-compact">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-adaptive-sm font-semibold text-gray-900 flex items-center adaptive-gap-sm">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            Питание сегодня
          </h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/nutrition-diary')}
            className="text-adaptive-xs px-2 py-1 h-6"
          >
            Все
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-green-50/50 rounded border border-green-100">
            <div className="flex items-center adaptive-gap-sm">
              <Apple className="h-3 w-3 text-green-600" />
              <span className="text-adaptive-xs font-medium text-gray-900">Калории</span>
            </div>
            <div className="text-right">
              <span className="text-adaptive-sm font-bold text-green-600">{todayCalories}</span>
              <span className="text-adaptive-xs text-gray-500">/{targetCalories}</span>
            </div>
          </div>
          
          {recentMeals.slice(0, 2).map((meal, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-1.5 bg-gray-50/50 rounded text-adaptive-xs"
            >
              <div className="flex-1 min-w-0">
                <span className="text-gray-900 font-medium truncate block">{meal.name}</span>
                <span className="text-gray-500">{meal.time}</span>
              </div>
              <span className="text-gray-700 font-medium flex-shrink-0 ml-2">{meal.calories} ккал</span>
            </div>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-2 text-adaptive-xs h-6"
          onClick={() => navigate('/nutrition-diary')}
        >
          <Plus className="h-3 w-3 mr-1" />
          Добавить прием пищи
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 adaptive-p-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-adaptive-base font-semibold text-gray-900 flex items-center adaptive-gap-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Питание сегодня
        </h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/nutrition-diary')}
          className="text-adaptive-xs px-2 py-1 h-6"
        >
          Подробнее
        </Button>
      </div>
      
      <div className="space-y-3">
        <div className="adaptive-p-md bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-adaptive-sm font-medium text-gray-700">Калории</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-adaptive-xs text-green-600">{Math.round(caloriesProgress)}%</span>
            </div>
          </div>
          <div className="flex items-center adaptive-gap-md">
            <span className="text-adaptive-xl font-bold text-green-600">{todayCalories}</span>
            <span className="text-adaptive-sm text-gray-500">из {targetCalories}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-adaptive-sm font-medium text-gray-900">Последние приемы пищи</h4>
          {recentMeals.map((meal, index) => (
            <div 
              key={index}
              className="flex items-center justify-between adaptive-p-md bg-gray-50/50 rounded border border-gray-100"
            >
              <div className="flex-1 min-w-0">
                <h5 className="font-medium text-gray-900 text-adaptive-sm mobile-text-wrap">{meal.name}</h5>
                <p className="text-adaptive-xs text-gray-500">{meal.time}</p>
              </div>
              <span className="text-adaptive-sm font-medium text-gray-700 flex-shrink-0">{meal.calories} ккал</span>
            </div>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => navigate('/nutrition-diary')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Добавить прием пищи
        </Button>
      </div>
    </div>
  );
};

export default NutritionDataCard;
