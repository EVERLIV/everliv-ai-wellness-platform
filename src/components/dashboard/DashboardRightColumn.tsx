
import React from 'react';
import SmartGoalRecommendations from './SmartGoalRecommendations';
import NutritionSummarySection from './NutritionSummarySection';
import DashboardChatsList from './DashboardChatsList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, Activity, Brain, TrendingUp } from 'lucide-react';
import { useHealthProfile } from '@/hooks/useHealthProfile';

interface DashboardRightColumnProps {
  healthScore: number;
  biologicalAge: number;
}

const DashboardRightColumn: React.FC<DashboardRightColumnProps> = ({ 
  healthScore, 
  biologicalAge 
}) => {
  const { healthProfile } = useHealthProfile();

  // Рассчитываем реальный индекс здоровья на основе профиля
  const calculateRealHealthScore = () => {
    if (!healthProfile) return healthScore;
    
    let score = 100;
    
    // Физическая активность
    const exerciseFreq = healthProfile.exerciseFrequency || 0;
    if (exerciseFreq >= 4) score += 0;
    else if (exerciseFreq >= 2) score -= 5;
    else score -= 15;
    
    // Сон
    const sleepHours = healthProfile.sleepHours || 8;
    if (sleepHours >= 7 && sleepHours <= 9) score += 0;
    else score -= 10;
    
    // Стресс
    const stress = healthProfile.stressLevel || 5;
    if (stress <= 3) score += 0;
    else if (stress <= 6) score -= 5;
    else score -= 15;
    
    // Курение и алкоголь
    if (healthProfile.smokingStatus === 'current_heavy') score -= 20;
    else if (healthProfile.smokingStatus === 'current_moderate') score -= 15;
    else if (healthProfile.smokingStatus === 'current_light') score -= 10;
    
    if (healthProfile.alcoholConsumption === 'daily') score -= 10;
    else if (healthProfile.alcoholConsumption === 'regularly') score -= 5;
    
    return Math.max(20, Math.min(100, score));
  };

  // Рассчитываем биологический возраст
  const calculateBiologicalAge = () => {
    if (!healthProfile) return biologicalAge;
    
    const chronologicalAge = healthProfile.age || 30;
    let ageModifier = 0;
    
    // Физическая активность влияет на биологический возраст
    const exerciseFreq = healthProfile.exerciseFrequency || 0;
    if (exerciseFreq >= 4) ageModifier -= 3;
    else if (exerciseFreq >= 2) ageModifier -= 1;
    else ageModifier += 2;
    
    // Курение сильно влияет на биологический возраст
    if (healthProfile.smokingStatus === 'current_heavy') ageModifier += 8;
    else if (healthProfile.smokingStatus === 'current_moderate') ageModifier += 5;
    else if (healthProfile.smokingStatus === 'current_light') ageModifier += 3;
    
    // Алкоголь
    if (healthProfile.alcoholConsumption === 'daily') ageModifier += 3;
    else if (healthProfile.alcoholConsumption === 'regularly') ageModifier += 1;
    
    // Стресс
    const stress = healthProfile.stressLevel || 5;
    if (stress >= 8) ageModifier += 3;
    else if (stress >= 6) ageModifier += 1;
    else if (stress <= 3) ageModifier -= 1;
    
    return Math.max(18, chronologicalAge + ageModifier);
  };

  const realHealthScore = calculateRealHealthScore();
  const realBiologicalAge = calculateBiologicalAge();
  
  // Определяем тенденцию (упрощенно)
  const getTrend = () => {
    if (realHealthScore >= 80) return { direction: '↗', value: '+3%', color: 'text-green-600' };
    if (realHealthScore >= 60) return { direction: '→', value: '0%', color: 'text-yellow-600' };
    return { direction: '↘', value: '-2%', color: 'text-red-600' };
  };

  const trend = getTrend();

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
              {realHealthScore}%
            </div>
            <Progress 
              value={realHealthScore} 
              className="h-2 mb-3" 
            />
            <p className="text-sm text-emerald-600 font-medium">
              {realHealthScore >= 80 ? 'Отличное состояние' : 
               realHealthScore >= 60 ? 'Хорошее состояние' : 'Требует внимания'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-emerald-200/50">
            <div className="text-center p-3 bg-white/60 rounded-lg">
              <Activity className="h-4 w-4 text-blue-600 mx-auto mb-1" />
              <div className="text-xs text-gray-600 mb-1">Биологический возраст</div>
              <div className="text-lg font-bold text-gray-900">{realBiologicalAge}</div>
            </div>
            <div className="text-center p-3 bg-white/60 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-600 mx-auto mb-1" />
              <div className="text-xs text-gray-600 mb-1">Тенденция</div>
              <div className={`text-lg font-bold ${trend.color}`}>
                {trend.direction} {trend.value}
              </div>
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
