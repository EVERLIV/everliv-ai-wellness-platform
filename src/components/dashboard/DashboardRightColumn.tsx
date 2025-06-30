
import React from 'react';
import SmartGoalRecommendations from './SmartGoalRecommendations';
import NutritionSummarySection from './NutritionSummarySection';
import DashboardChatsList from './DashboardChatsList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, Activity, Brain, TrendingUp } from 'lucide-react';

interface DashboardRightColumnProps {
  healthScore: number;
  biologicalAge: number;
}

const DashboardRightColumn: React.FC<DashboardRightColumnProps> = ({ 
  healthScore, 
  biologicalAge 
}) => {
  return (
    <div className="space-y-4">
      {/* Health Score Card */}
      <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-emerald-200/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            <Heart className="h-5 w-5" />
            <span className="text-lg font-bold">Индекс здоровья</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-700 mb-2">
              {healthScore}%
            </div>
            <Progress 
              value={healthScore} 
              className="h-2 mb-3" 
            />
            <p className="text-sm text-emerald-600 font-medium">
              {healthScore >= 80 ? 'Отличное состояние' : 
               healthScore >= 60 ? 'Хорошее состояние' : 'Требует внимания'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-emerald-200/50">
            <div className="text-center p-3 bg-white/60 rounded-lg">
              <Activity className="h-4 w-4 text-blue-600 mx-auto mb-1" />
              <div className="text-xs text-gray-600 mb-1">Биологический возраст</div>
              <div className="text-lg font-bold text-gray-900">{biologicalAge}</div>
            </div>
            <div className="text-center p-3 bg-white/60 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-600 mx-auto mb-1" />
              <div className="text-xs text-gray-600 mb-1">Тенденция</div>
              <div className="text-lg font-bold text-green-600">↗ +2%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <SmartGoalRecommendations />
      
      {/* Nutrition Summary */}
      <NutritionSummarySection />
      
      {/* Recent Chats */}
      <DashboardChatsList />
    </div>
  );
};

export default DashboardRightColumn;
