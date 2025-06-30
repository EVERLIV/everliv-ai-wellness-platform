
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, TrendingUp, Target } from "lucide-react";
import { useFoodEntries } from "@/hooks/useFoodEntries";
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
    <div className="mobile-container mobile-section-spacing">
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-6 sm:space-x-8 overflow-x-auto">
            {[
              { key: 'diary', label: 'Дневник', icon: Calendar },
              { key: 'analytics', label: 'Аналитика', icon: TrendingUp },
              { key: 'goals', label: 'Цели', icon: Target }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as typeof activeTab)}
                className={`mobile-touch-target py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'diary' && (
        <div className="mobile-content-spacing">
          {/* Date Selector */}
          <div className="mb-6">
            <div className="mobile-flex-header">
              <div>
                <h2 className="mobile-heading-primary text-gray-900">
                  Дневник питания
                </h2>
                <p className="mobile-text-small text-gray-600 mt-1">
                  {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: ru })}
                </p>
              </div>
              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="mobile-button-sm gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="hidden sm:inline">Выбрать дату</span>
                    <span className="sm:hidden">Дата</span>
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
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Daily Progress */}
          <div className="mb-6">
            <DailyProgress selectedDate={selectedDate} />
          </div>

          {/* Meals */}
          <div className="space-y-4">
            {mealTypes.map(({ key, label, icon }) => (
              <Card key={key} className="mobile-card">
                <CardHeader className="mobile-card-header">
                  <div className="mobile-flex-header">
                    <CardTitle className="flex items-center gap-3">
                      <span className="text-xl">{icon}</span>
                      <div>
                        <span className="mobile-heading-secondary text-gray-900">{label}</span>
                        <div className="mobile-text-small text-gray-500 font-normal mt-1">
                          {summaryByMeal[key].calories} ккал • 
                          {summaryByMeal[key].protein.toFixed(1)}г Б • 
                          {summaryByMeal[key].carbs.toFixed(1)}г У • 
                          {summaryByMeal[key].fat.toFixed(1)}г Ж
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
                <CardContent className="mobile-card-content">
                  <div className="space-y-3">
                    {entries
                      .filter(entry => entry.meal_type === key)
                      .map((entry) => (
                        <div 
                          key={entry.id} 
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{entry.food_name}</h4>
                            <p className="mobile-text-small text-gray-600 mt-1">
                              {entry.portion_size && `${entry.portion_size} • `}
                              {entry.calories} ккал
                            </p>
                          </div>
                          <div className="text-right mobile-text-small text-gray-500 ml-4">
                            <div>{entry.protein}г Б</div>
                            <div>{entry.carbs}г У</div>
                            <div>{entry.fat}г Ж</div>
                          </div>
                        </div>
                      ))}
                    {entries.filter(entry => entry.meal_type === key).length === 0 && (
                      <div className="text-center py-6 text-gray-500">
                        <p className="mobile-text-body">Записи отсутствуют</p>
                        <p className="mobile-text-small mt-1">Добавьте первый прием пищи</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Daily Summary */}
          <Card className="mobile-card mt-6">
            <CardHeader className="mobile-card-header">
              <CardTitle className="mobile-heading-secondary">Итоги дня</CardTitle>
            </CardHeader>
            <CardContent className="mobile-card-content">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-primary">{dailyTotals.calories}</div>
                  <div className="mobile-text-small text-gray-600 mt-1">Калории</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">{dailyTotals.protein.toFixed(1)}г</div>
                  <div className="mobile-text-small text-gray-600 mt-1">Белки</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-green-600">{dailyTotals.carbs.toFixed(1)}г</div>
                  <div className="mobile-text-small text-gray-600 mt-1">Углеводы</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-orange-600">{dailyTotals.fat.toFixed(1)}г</div>
                  <div className="mobile-text-small text-gray-600 mt-1">Жиры</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="mobile-content-spacing">
          <div className="mb-6">
            <h2 className="mobile-heading-primary text-gray-900 mb-2">
              Аналитика питания
            </h2>
            <p className="mobile-text-body text-gray-600">
              Отслеживайте тренды и прогресс в питании
            </p>
          </div>
          <div className="space-y-6">
            <NutritionCharts />
            <PersonalizedRecommendations />
          </div>
        </div>
      )}

      {activeTab === 'goals' && (
        <div className="mobile-content-spacing">
          <div className="mb-6">
            <h2 className="mobile-heading-primary text-gray-900 mb-2">
              Цели питания
            </h2>
            <p className="mobile-text-body text-gray-600">
              Настройте персональные цели и отслеживайте прогресс
            </p>
          </div>
          <NutritionGoals />
        </div>
      )}
    </div>
  );
};

export default NutritionDiary;
