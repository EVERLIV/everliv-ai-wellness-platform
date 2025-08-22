
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, Activity, TrendingUp, Calendar } from 'lucide-react';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { useCachedAnalytics } from '@/hooks/useCachedAnalytics';
import MyGoalsSection from './MyGoalsSection';
import DashboardChatsList from './DashboardChatsList';


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
      {/* Мои цели */}
      <MyGoalsSection />

      {/* Последние чаты */}
      <DashboardChatsList />
    </div>
  );
};

export default DashboardRightColumn;
