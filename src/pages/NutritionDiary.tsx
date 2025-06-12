
import React, { useState } from "react";
import PageLayoutWithHeader from "@/components/PageLayoutWithHeader";
import NutritionDiary from "@/components/nutrition/NutritionDiary";
import NutritionDiaryHeader from "@/components/nutrition/NutritionDiaryHeader";

const NutritionDiaryPage: React.FC = () => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleQuickAdd = () => {
    // Передаем сигнал в основной компонент для открытия быстрого добавления
    setShowQuickAdd(true);
  };

  const handleCalendarClick = () => {
    // Передаем сигнал в основной компонент для открытия календаря
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
        triggerQuickAdd={showQuickAdd}
        onQuickAddHandled={() => setShowQuickAdd(false)}
        triggerCalendar={showCalendar}
        onCalendarHandled={() => setShowCalendar(false)}
      />
    </PageLayoutWithHeader>
  );
};

export default NutritionDiaryPage;
