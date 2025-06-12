
import React, { useState } from "react";
import PageLayoutWithHeader from "@/components/PageLayoutWithHeader";
import NutritionDiary from "@/components/nutrition/NutritionDiary";
import NutritionDiaryHeader from "@/components/nutrition/NutritionDiaryHeader";

const NutritionDiaryPage: React.FC = () => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleQuickAdd = () => {
    setShowQuickAdd(true);
    // Можно добавить логику для быстрого добавления
    console.log("Открыть быстрое добавление");
  };

  const handleCalendarClick = () => {
    setShowCalendar(true);
    // Можно добавить логику для календаря
    console.log("Открыть календарь питания");
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
      <NutritionDiary />
    </PageLayoutWithHeader>
  );
};

export default NutritionDiaryPage;
