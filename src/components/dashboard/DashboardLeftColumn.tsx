
import React from 'react';
import PersonalizedDashboardHeader from './PersonalizedDashboardHeader';
import DashboardQuickActionsGrid from './DashboardQuickActionsGrid';
import MyGoalsSection from './health-goals/MyGoalsSection';
import DashboardChatsList from './DashboardChatsList';
import NutritionDataCard from './NutritionDataCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardLeftColumnProps {
  userName: string;
}

const DashboardLeftColumn: React.FC<DashboardLeftColumnProps> = ({ userName }) => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-2 sm:space-y-3">
      {/* Персонализированный заголовок */}
      <PersonalizedDashboardHeader userName={userName} />
      
      {/* Быстрые действия */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-2 sm:p-4 mobile-compact">
        <DashboardQuickActionsGrid />
      </div>
      
      {/* На мобильных показываем дополнительные компоненты после приветствия */}
      {isMobile && (
        <>
          {/* Рекомендации для достижения целей */}
          <MyGoalsSection />
          
          {/* Данные питания */}
          <NutritionDataCard />
          
          {/* Чаты с ИИ доктором */}
          <DashboardChatsList />
        </>
      )}
    </div>
  );
};

export default DashboardLeftColumn;
