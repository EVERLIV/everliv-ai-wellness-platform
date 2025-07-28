
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, Activity, TrendingUp, Calendar } from 'lucide-react';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { useCachedAnalytics } from '@/hooks/useCachedAnalytics';
import MyGoalsSection from './MyGoalsSection';
import DashboardChatsList from './DashboardChatsList';
import BiologicalAgeHistoryCard from '../biological-age/BiologicalAgeHistoryCard';

interface DashboardRightColumnProps {
  healthScore?: number; // сделаем необязательным
  biologicalAge: number;
  isLoadingAnalytics?: boolean; // добавляем флаг загрузки
}

const DashboardRightColumn: React.FC<DashboardRightColumnProps> = ({ 
  healthScore: fallbackHealthScore, 
  biologicalAge: fallbackBiologicalAge,
  isLoadingAnalytics = false
}) => {
  const { healthProfile } = useHealthProfile();
  const { analytics, isLoading: analyticsLoading } = useCachedAnalytics();

  // Показываем загрузку если данные еще загружаются
  const isDataLoading = isLoadingAnalytics || analyticsLoading;
  
  // Используем данные из аналитики ТОЛЬКО если они есть
  // НЕ показываем fallback пока данные загружаются
  const currentHealthScore = analytics?.healthScore ?? fallbackHealthScore;
  
  // Расчет биологического возраста на основе данных профиля здоровья
  const calculateBiologicalAge = () => {
    if (!healthProfile?.age) return fallbackBiologicalAge || 35;
    
    let bioAge = healthProfile.age;
    
    // Факторы старения
    if (healthProfile.stressLevel && healthProfile.stressLevel > 7) bioAge += 3;
    if (healthProfile.sleepHours && healthProfile.sleepHours < 6) bioAge += 2;
    if (healthProfile.exerciseFrequency && healthProfile.exerciseFrequency < 1) bioAge += 5;
    
    // Факторы омоложения
    if (healthProfile.exerciseFrequency && healthProfile.exerciseFrequency >= 4) bioAge -= 2;
    if (healthProfile.sleepHours && healthProfile.sleepHours >= 7 && healthProfile.sleepHours <= 9) bioAge -= 1;
    if (healthProfile.stressLevel && healthProfile.stressLevel <= 4) bioAge -= 2;
    
    return Math.max(18, Math.min(bioAge, healthProfile.age + 10));
  };

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
          {isDataLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
              <p className="text-sm text-gray-600">Загружаем индекс здоровья...</p>
            </div>
          ) : currentHealthScore !== undefined ? (
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${getScoreColor(currentHealthScore)}`}>
                {Math.round(currentHealthScore)}%
              </div>
              <Progress 
                value={currentHealthScore} 
                className={`h-3 ${getScoreGradient(currentHealthScore)}`}
              />
              {analytics && (
                <p className="text-xs text-gray-500 mt-2">
                  Данные из ИИ-аналитики
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-600">Нет данных об индексе здоровья</p>
              <p className="text-xs text-gray-500 mt-1">Заполните профиль для получения аналитики</p>
            </div>
          )}
          
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
              {!healthProfile && (
                <p className="text-xs text-orange-500 mt-1">
                  Создайте профиль для точного расчета
                </p>
              )}
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

      {/* История биологического возраста */}
      <BiologicalAgeHistoryCard />

      {/* Мои цели */}
      <MyGoalsSection />

      {/* Последние чаты */}
      <DashboardChatsList />
    </div>
  );
};

export default DashboardRightColumn;
