
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, TrendingUp, Target, CalendarDays } from "lucide-react";
import { useFoodEntries } from "@/hooks/useFoodEntries";
import { useNutritionGoals } from "@/hooks/useNutritionGoals";
import MealEntry from "./MealEntry";
import DailyProgress from "./DailyProgress";
import NutritionCharts from "./NutritionCharts";
import NutritionGoals from "./NutritionGoals";
import PersonalizedRecommendations from "./PersonalizedRecommendations";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface NutritionDiaryProps {
  initialTab?: 'diary' | 'analytics' | 'goals';
  triggerQuickAdd?: boolean;
  onQuickAddHandled?: () => void;
  triggerCalendar?: boolean;
  onCalendarHandled?: () => void;
}

const NutritionDiary: React.FC<NutritionDiaryProps> = ({
  initialTab = 'diary',
  triggerQuickAdd,
  onQuickAddHandled,
  triggerCalendar,
  onCalendarHandled
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeTab, setActiveTab] = useState<'diary' | 'analytics' | 'goals'>(initialTab);
  
  const { entries, isLoading, getSummaryByMealType, getDailyTotals } = useFoodEntries(selectedDate);
  const { goals } = useNutritionGoals();

  useEffect(() => {
    if (triggerCalendar) {
      setShowCalendar(true);
      onCalendarHandled?.();
    }
  }, [triggerCalendar, onCalendarHandled]);

  const mealTypes = [
    { key: 'breakfast', label: 'Завтрак', icon: '🌅' },
    { key: 'lunch', label: 'Обед', icon: '☀️' },
    { key: 'dinner', label: 'Ужин', icon: '🌙' },
    { key: 'snack', label: 'Перекус', icon: '🍎' }
  ] as const;

  const dailyTotals = getDailyTotals();
  const summaryByMeal = getSummaryByMealType();

  if (isLoading) {
    return (
      <div className="mobile-container">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center space-y-4">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-600">Загрузка дневника питания...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Date Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Дневник питания
          </h2>
          <p className="text-sm text-gray-600">
            {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: ru })}
          </p>
        </div>
        <Popover open={showCalendar} onOpenChange={setShowCalendar}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1 px-2 py-1 h-auto text-xs rounded-none border-gray-300">
              <Calendar className="h-3 w-3" />
              <span className="hidden sm:inline">Дата</span>
              <span className="sm:hidden">📅</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                }
                setShowCalendar(false);
              }}
              disabled={(date) => date > new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Compact Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Daily Progress - занимает всю ширину на мобильных, 1/3 на больших экранах */}
        <div className="lg:col-span-1">
          <Card className="shadow-none border-gray-200/80 rounded-none h-fit">
            <CardHeader className="pb-1 px-2 py-1">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-blue-600" />
                Прогресс дня
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2 py-1 pt-0">
              <div className="space-y-2">
                <div className="text-center p-1 bg-gray-50 border border-gray-200/50">
                  <div className="text-lg font-bold text-primary">{dailyTotals.calories}</div>
                  <div className="text-xs text-gray-600">Калории</div>
                </div>
                <div className="grid grid-cols-3 gap-1 text-xs">
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">{dailyTotals.protein.toFixed(0)}г</div>
                    <div className="text-gray-500">Б</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-600">{dailyTotals.carbs.toFixed(0)}г</div>
                    <div className="text-gray-500">У</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-orange-600">{dailyTotals.fat.toFixed(0)}г</div>
                    <div className="text-gray-500">Ж</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meals - 2 columns on desktop */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {mealTypes.map(({ key, label, icon }) => (
            <Card key={key} className="shadow-none border-gray-200/80 rounded-none h-fit">
              <CardHeader className="pb-1 px-2 py-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-1">
                    <span className="text-sm">{icon}</span>
                    <div>
                      <span className="text-sm font-medium text-gray-900">{label}</span>
                      <div className="text-xs text-gray-500">
                        {summaryByMeal[key].calories} ккал
                      </div>
                    </div>
                  </CardTitle>
                  <MealEntry
                    mealType={key}
                    selectedDate={selectedDate}
                    trigger={triggerQuickAdd && key === 'breakfast'}
                    onHandled={onQuickAddHandled}
                  />
                </div>
              </CardHeader>
              <CardContent className="px-2 py-1 pt-0">
                <div className="space-y-1">
                  {entries
                    .filter(entry => entry.meal_type === key)
                    .slice(0, 2) // Показываем только первые 2 элемента для компактности
                    .map((entry) => (
                      <div 
                        key={entry.id} 
                        className="flex items-center justify-between p-1 bg-gray-50 border border-gray-200/50 text-xs"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{entry.food_name}</div>
                        </div>
                        <div className="text-gray-500 ml-2">
                          {entry.calories} ккал
                        </div>
                      </div>
                    ))}
                  {entries.filter(entry => entry.meal_type === key).length === 0 && (
                    <div className="text-center py-2 text-gray-400 text-xs">
                      Нет записей
                    </div>
                  )}
                  {entries.filter(entry => entry.meal_type === key).length > 2 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{entries.filter(entry => entry.meal_type === key).length - 2} еще
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Analytics and Goals in compact layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-4">
        {/* Quick Analytics */}
        <Card className="shadow-none border-gray-200/80 rounded-none">
          <CardHeader className="pb-1 px-2 py-1">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Аналитика
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 py-1 pt-0">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center p-1 bg-purple-50 border border-gray-200/50">
                <div className="font-bold text-purple-600">
                  {goals ? Math.min(100, Math.round((dailyTotals.calories / goals.daily_calories) * 100)) : 0}%
                </div>
                <div className="text-purple-700">Цель калорий</div>
              </div>
              <div className="text-center p-1 bg-blue-50 border border-gray-200/50">
                <div className="font-bold text-blue-600">
                  {goals ? Math.min(100, Math.round((dailyTotals.protein / goals.daily_protein) * 100)) : 0}%
                </div>
                <div className="text-blue-700">Цель белка</div>
              </div>
              <div className="text-center p-1 bg-green-50 border border-gray-200/50">
                <div className="font-bold text-green-600">
                  {goals ? Math.min(100, Math.round((dailyTotals.carbs / goals.daily_carbs) * 100)) : 0}%
                </div>
                <div className="text-green-700">Цель углеводов</div>
              </div>
              <div className="text-center p-1 bg-orange-50 border border-gray-200/50">
                <div className="font-bold text-orange-600">
                  {goals ? Math.min(100, Math.round((dailyTotals.fat / goals.daily_fat) * 100)) : 0}%
                </div>
                <div className="text-orange-700">Цель жиров</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Goals */}
        <Card className="shadow-none border-gray-200/80 rounded-none">
          <CardHeader className="pb-1 px-2 py-1">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-green-500" />
              Цели питания
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 py-1 pt-0">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="space-y-1">
                <div className="text-gray-600">Калории: {goals?.daily_calories || 0}</div>
                <div className="text-gray-600">Белки: {goals?.daily_protein || 0}г</div>
              </div>
              <div className="space-y-1">
                <div className="text-gray-600">Углеводы: {goals?.daily_carbs || 0}г</div>
                <div className="text-gray-600">Жиры: {goals?.daily_fat || 0}г</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Цели питания */}
      <div className="mt-4">
        <Card className="shadow-none border-gray-200/80 rounded-none">
          <CardHeader className="pb-1 px-2 py-1">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-green-500" />
              Управление целями питания
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 py-1 pt-0">
            <NutritionGoals />
          </CardContent>
        </Card>
      </div>

      {/* Графики и аналитика */}
      <div className="mt-4">
        <Card className="shadow-none border-gray-200/80 rounded-none">
          <CardHeader className="pb-1 px-2 py-1">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              Аналитика и графики БЖУ
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 py-1 pt-0">
            <NutritionCharts />
          </CardContent>
        </Card>
      </div>

      {/* Персонализированные рекомендации */}
      <div className="mt-4">
        <Card className="shadow-none border-gray-200/80 rounded-none">
          <CardHeader className="pb-1 px-2 py-1">
            <CardTitle className="text-sm font-medium">
              Персонализированные рекомендации
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 py-1 pt-0">
            <PersonalizedRecommendations />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NutritionDiary;
