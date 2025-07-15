
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import NutritionDiary from "@/components/nutrition/NutritionDiary";

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
    <AppLayout>
      <div className="space-y-6">
        {/* Заголовок */}
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Дневник питания
          </h1>
          <p className="text-muted-foreground">
            Отслеживайте питание и получайте персональные рекомендации
          </p>
        </div>

        {/* Основной контент */}
        <NutritionDiary 
          initialTab={initialTab}
          triggerQuickAdd={showQuickAdd}
          onQuickAddHandled={() => setShowQuickAdd(false)}
          triggerCalendar={showCalendar}
          onCalendarHandled={() => setShowCalendar(false)}
        />
      </div>
    </AppLayout>
  );
};

export default NutritionDiaryPage;
