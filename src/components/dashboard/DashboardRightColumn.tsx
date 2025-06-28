
import React from 'react';
import DashboardKeyMetrics from './DashboardKeyMetrics';
import QuickActionsCard from './header/QuickActionsCard';
import SmartGoalRecommendations from './SmartGoalRecommendations';
import DashboardChatsList from './DashboardChatsList';
import NutritionSummarySection from './NutritionSummarySection';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardRightColumnProps {
  healthScore: number;
  biologicalAge: number;
}

const DashboardRightColumn: React.FC<DashboardRightColumnProps> = ({ 
  healthScore, 
  biologicalAge 
}) => {
  const isMobile = useIsMobile();

  // На мобильных устройствах не отображаем правую колонку отдельно
  if (isMobile) return null;

  return (
    <div className="space-y-2 sm:space-y-3">
      {/* Ключевые показатели */}
      <DashboardKeyMetrics 
        healthScore={healthScore} 
        biologicalAge={biologicalAge} 
      />
      
      {/* Рекомендации для достижения целей */}
      <SmartGoalRecommendations />
      
      {/* Данные питания */}
      <NutritionSummarySection />
      
      {/* Чаты с ИИ доктором */}
      <DashboardChatsList />
      
      {/* Быстрые действия */}
      <QuickActionsCard />
    </div>
  );
};

export default DashboardRightColumn;
