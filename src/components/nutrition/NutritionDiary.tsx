import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import NutritionGoals from "./NutritionGoals";
import DailyProgress from "./DailyProgress";
import MealEntry from "./MealEntry";
import NutritionCharts from "./NutritionCharts";
import PersonalizedRecommendations from "./PersonalizedRecommendations";
import { useFoodEntries } from "@/hooks/useFoodEntries";
import { useRealtimeFoodEntries } from "@/hooks/useRealtimeFoodEntries";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface NutritionDiaryProps {
  triggerQuickAdd?: boolean;
  onQuickAddHandled?: () => void;
  triggerCalendar?: boolean;
  onCalendarHandled?: () => void;
}

const NutritionDiary: React.FC<NutritionDiaryProps> = ({
  triggerQuickAdd,
  onQuickAddHandled,
  triggerCalendar,
  onCalendarHandled
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMealEntry, setShowMealEntry] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [showCalendar, setShowCalendar] = useState(false);

  const { getSummaryByMealType, entries, deleteEntry, refreshEntries } = useFoodEntries(selectedDate);
  const { realtimeEntries } = useRealtimeFoodEntries(selectedDate);
  
  // Combine regular entries with realtime entries
  const allEntries = [...entries, ...realtimeEntries].filter((entry, index, self) => 
    index === self.findIndex(e => e.id === entry.id)
  );
  
  const mealSummary = getSummaryByMealType();

  // Refresh entries when realtime entries change
  useEffect(() => {
    if (realtimeEntries.length > 0) {
      refreshEntries();
    }
  }, [realtimeEntries.length, refreshEntries]);

  // Обработка триггера быстрого добавления из заголовка
  useEffect(() => {
    if (triggerQuickAdd) {
      handleQuickAdd();
      onQuickAddHandled?.();
    }
  }, [triggerQuickAdd]);

  // Обработка триггера календаря из заголовка
  useEffect(() => {
    if (triggerCalendar) {
      setShowCalendar(true);
      onCalendarHandled?.();
    }
  }, [triggerCalendar]);

  const handleAddMeal = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    setSelectedMealType(mealType);
    setShowMealEntry(true);
  };

  const handleQuickAdd = () => {
    setSelectedMealType('breakfast');
    setShowMealEntry(true);
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setShowCalendar(false);
    }
  };

  const getMealEntries = (mealType: string) => {
    return allEntries.filter(entry => entry.meal_type === mealType);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Popover open={showCalendar} onOpenChange={setShowCalendar}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-auto justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, "d MMMM yyyy", { locale: ru })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleCalendarSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Tabs defaultValue="diary" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1 bg-gray-100 rounded-xl">
          <TabsTrigger 
            value="diary" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-3 px-4 text-sm font-medium transition-all duration-200"
          >
            <span className="hidden sm:inline">Дневник</span>
            <span className="sm:hidden">📝</span>
          </TabsTrigger>
          <TabsTrigger 
            value="goals"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-3 px-4 text-sm font-medium transition-all duration-200"
          >
            <span className="hidden sm:inline">Цели</span>
            <span className="sm:hidden">🎯</span>
          </TabsTrigger>
          <TabsTrigger 
            value="analytics"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-3 px-4 text-sm font-medium transition-all duration-200"
          >
            <span className="hidden sm:inline">Аналитика</span>
            <span className="sm:hidden">📊</span>
          </TabsTrigger>
          <TabsTrigger 
            value="recommendations"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-3 px-4 text-sm font-medium transition-all duration-200"
          >
            <span className="hidden sm:inline">Советы</span>
            <span className="sm:hidden">💡</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diary" className="space-y-6 mt-6">
          <DailyProgress selectedDate={selectedDate} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((mealType) => {
              const mealEntries = getMealEntries(mealType);
              const summary = mealSummary[mealType];
              
              return (
                <Card key={mealType} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base md:text-lg flex items-center justify-between">
                      {mealType === 'breakfast' && 'Завтрак'}
                      {mealType === 'lunch' && 'Обед'}
                      {mealType === 'dinner' && 'Ужин'}
                      {mealType === 'snack' && 'Перекус'}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddMeal(mealType)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-600">
                      <p>Калории: {summary.calories}</p>
                      <p>Белки: {summary.protein.toFixed(1)}г</p>
                      <p>Жиры: {summary.fat.toFixed(1)}г</p>
                      <p>Углеводы: {summary.carbs.toFixed(1)}г</p>
                    </div>
                    
                    {mealEntries.length > 0 && (
                      <div className="mt-3 md:mt-4 space-y-2">
                        <div className="text-xs font-medium text-gray-500">Продукты:</div>
                        {mealEntries.map((entry) => (
                          <div key={entry.id} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                            <span className="truncate text-xs">{entry.food_name}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteEntry(entry.id!)}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700 ml-1"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="goals" className="mt-6">
          <NutritionGoals />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <NutritionCharts />
        </TabsContent>

        <TabsContent value="recommendations" className="mt-6">
          <PersonalizedRecommendations />
        </TabsContent>
      </Tabs>

      {showMealEntry && (
        <MealEntry
          mealType={selectedMealType}
          selectedDate={selectedDate}
          onClose={() => setShowMealEntry(false)}
        />
      )}
    </div>
  );
};

export default NutritionDiary;
