
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, Activity, TrendingUp, Calendar } from 'lucide-react';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import NutritionSummarySection from './NutritionSummarySection';
import DashboardChatsList from './DashboardChatsList';

interface DashboardRightColumnProps {
  healthScore: number;
  biologicalAge: number;
}

const DashboardRightColumn: React.FC<DashboardRightColumnProps> = ({ 
  healthScore, 
  biologicalAge 
}) => {
  const { healthProfile } = useHealthProfile();

  // Расчет индекса здоровья на основе профиля
  const calculateHealthScore = () => {
    if (!healthProfile) return 75; // Базовое значение
    
    let score = 70; // Базовый балл
    
    // Факторы улучшающие здоровье
    if (healthProfile.exerciseFrequency >= 3) score += 10;
    if (healthProfile.sleepHours >= 7 && healthProfile.sleepHours <= 9) score += 10;
    if (healthProfile.stressLevel <= 5) score += 5;
    if (healthProfile.waterIntake >= 8) score += 5;
    
    // Факторы ухудшающие здоровье
    if (healthProfile.stressLevel > 7) score -= 10;
    if (healthProfile.sleepHours < 6) score -= 10;
    if (healthProfile.exerciseFrequency < 1) score -= 10;
    
    return Math.max(30, Math.min(100, score));
  };

  // Расчет биологического возраста
  const calculateBiologicalAge = () => {
    if (!healthProfile?.age) return 35;
    
    let bioAge = healthProfile.age;
    
    // Факторы старения
    if (healthProfile.stressLevel > 7) bioAge += 3;
    if (healthProfile.sleepHours < 6) bioAge += 2;
    if (healthProfile.exerciseFrequency < 1) bioAge += 5;
    
    // Факторы омоложения
    if (healthProfile.exerciseFrequency >= 4) bioAge -= 2;
    if (healthProfile.sleepHours >= 7 && healthProfile.sleepHours <= 9) bioAge -= 1;
    if (healthProfile.stressLevel <= 4) bioAge -= 2;
    
    return Math.max(20, bioAge);
  };

  const currentHealthScore = calculateHealthScore();
  const currentBiologicalAge = calculateBiologicalAge();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return '[&>div]:bg-green-500';
    if (score >= 60) return '[&>div]:bg-yellow-500';
    return '[&>div]:bg-red-500';
  };

  return (
    <div className="space-y-4">
      {/* Индекс здоровья */}
      <Card className="shadow-sm border-gray-200/80">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Heart className="h-5 w-5 text-red-500" />
            <span className="text-lg font-semibold">Индекс здоровья</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${getScoreColor(currentHealthScore)}`}>
              {currentHealthScore}%
            </div>
            <Progress 
              value={currentHealthScore} 
              className={`h-3 ${getScoreGradient(currentHealthScore)}`}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Activity className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-600">Биовозраст</span>
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {currentBiologicalAge}
              </div>
              <div className="text-xs text-gray-500">лет</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">Тренд</span>
              </div>
              <div className="text-2xl font-semibold text-green-600">
                +2.1
              </div>
              <div className="text-xs text-gray-500">за неделю</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Питание сегодня */}
      <NutritionSummarySection />

      {/* Последние чаты */}
      <DashboardChatsList />
    </div>
  );
};

export default DashboardRightColumn;
