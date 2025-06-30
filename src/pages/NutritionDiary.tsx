
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PageLayoutWithHeader from "@/components/PageLayoutWithHeader";
import NutritionDiary from "@/components/nutrition/NutritionDiary";
import NutritionDiaryHeader from "@/components/nutrition/NutritionDiaryHeader";

const NutritionDiaryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [initialTab, setInitialTab] = useState<'diary' | 'analytics' | 'goals'>('diary');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'goals' || tab === 'analytics') {
      setInitialTab(tab as 'diary' | 'analytics' | 'goals');
    }
  }, [searchParams]);

  const handleQuickAdd = () => {
    setShowQuickAdd(true);
  };

  const handleCalendarClick = () => {
    setShowCalendar(true);
  };

  return (
    <PageLayoutWithHeader
      headerComponent={
        <NutritionDiaryHeader 
          onQuickAdd={handleQuickAdd}
          onCalendarClick={handleCalendarClick}
        />
      }
    >
      <NutritionDiary 
        initialTab={initialTab}
        triggerQuickAdd={showQuickAdd}
        onQuickAddHandled={() => setShowQuickAdd(false)}
        triggerCalendar={showCalendar}
        onCalendarHandled={() => setShowCalendar(false)}
      />
    </PageLayoutWithHeader>
  );
};

export default NutritionDiaryPage;
