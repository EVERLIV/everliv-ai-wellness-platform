
import React from 'react';
import DashboardKeyMetrics from './DashboardKeyMetrics';
import DashboardChatsList from './DashboardChatsList';
import NutritionSummarySection from './NutritionSummarySection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Target, Plus, Activity, Heart, Clock } from 'lucide-react';

interface DashboardRightColumnProps {
  healthScore: number;
  biologicalAge: number;
}

const DashboardRightColumn: React.FC<DashboardRightColumnProps> = ({ 
  healthScore, 
  biologicalAge 
}) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Ключевые показатели */}
      <DashboardKeyMetrics 
        healthScore={healthScore} 
        biologicalAge={biologicalAge} 
      />
      
      {/* Мои чаты с доктором */}
      <DashboardChatsList />
      
      {/* Мое питание */}
      <NutritionSummarySection />
      
      {/* Рекомендации для достижения целей */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          Рекомендации для достижения целей
        </h3>
        
        <div className="space-y-3">
          <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Activity className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 mb-1">
                  Повысить физическую активность
                </h4>
                <p className="text-xs text-gray-600 mb-2">
                  Добавьте 30 минут кардио 3 раза в неделю для улучшения показателей здоровья
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>2-4 недели</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 mb-1">
                  Оптимизировать сон
                </h4>
                <p className="text-xs text-gray-600 mb-2">
                  Поддерживайте режим сна 7-8 часов для восстановления организма
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>1-2 недели</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 mb-1">
                  Сбалансировать питание
                </h4>
                <p className="text-xs text-gray-600 mb-2">
                  Увеличьте потребление белка и уменьшите простые углеводы
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>3-4 недели</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/health-profile')}
            className="w-full text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            <Plus className="h-3 w-3 mr-1" />
            Получить персональные рекомендации
          </Button>
        </div>
      </div>
    </>
  );
};

export default DashboardRightColumn;
