
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
import ContentContainer from "@/components/layout/ContentContainer";
import Section from "@/components/layout/Section";

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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeTab, setActiveTab] = useState<'diary' | 'analytics' | 'goals'>('diary');
  
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
      <div className="nutrition-diary">
        <ContentContainer>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-600">Загрузка дневника питания...</p>
            </div>
          </div>
        </ContentContainer>
      </div>
    );
  }

  return (
    <div className="nutrition-diary">
      <ContentContainer>
        <Section spacing="md">
          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {[
                  { key: 'diary', label: 'Дневник', icon: Calendar },
                  { key: 'analytics', label: 'Аналитика', icon: TrendingUp },
                  { key: 'goals', label: 'Цели', icon: Target }
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key as typeof activeTab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
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

          {/* Date Selector */}
          {activeTab === 'diary' && (
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="heading-responsive-lg text-gray-900">
                    Дневник питания
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: ru })}
                  </p>
                </div>
                <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Calendar className="h-4 w-4" />
                      Выбрать дату
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
          )}

          {/* Tab Content */}
          {activeTab === 'diary' && (
            <div className="space-y-8">
              {/* Daily Progress */}
              <DailyProgress selectedDate={selectedDate} />

              {/* Meals */}
              <div className="space-y-6">
                {mealTypes.map(({ key, label, icon }) => (
                  <Card key={key} className="overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-3">
                          <span className="text-2xl">{icon}</span>
                          <div>
                            <span className="text-lg font-semibold text-gray-900">{label}</span>
                            <div className="text-sm text-gray-500 font-normal">
                              {summaryByMeal[key].calories} ккал • 
                              {summaryByMeal[key].protein.toFixed(1)}г белков • 
                              {summaryByMeal[key].carbs.toFixed(1)}г углеводов • 
                              {summaryByMeal[key].fat.toFixed(1)}г жиров
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
                    <CardContent>
                      <div className="space-y-3">
                        {entries
                          .filter(entry => entry.meal_type === key)
                          .map((entry) => (
                            <div 
                              key={entry.id} 
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{entry.food_name}</h4>
                                <p className="text-sm text-gray-600">
                                  {entry.portion_size && `${entry.portion_size} • `}
                                  {entry.calories} ккал
                                </p>
                              </div>
                              <div className="text-right text-sm text-gray-500">
                                <div>{entry.protein}г белков</div>
                                <div>{entry.carbs}г углеводов</div>
                                <div>{entry.fat}г жиров</div>
                              </div>
                            </div>
                          ))}
                        {entries.filter(entry => entry.meal_type === key).length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <p>Записи отсутствуют</p>
                            <p className="text-sm">Добавьте первый прием пищи</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Daily Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Итоги дня</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="stats-grid">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{dailyTotals.calories}</div>
                      <div className="text-sm text-gray-600">Калории</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{dailyTotals.protein.toFixed(1)}г</div>
                      <div className="text-sm text-gray-600">Белки</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{dailyTotals.carbs.toFixed(1)}г</div>
                      <div className="text-sm text-gray-600">Углеводы</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{dailyTotals.fat.toFixed(1)}г</div>
                      <div className="text-sm text-gray-600">Жиры</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div>
                <h2 className="heading-responsive-lg text-gray-900 mb-2">
                  Аналитика питания
                </h2>
                <p className="text-gray-600">
                  Отслеживайте тренды и прогресс в питании
                </p>
              </div>
              <NutritionCharts />
              <PersonalizedRecommendations />
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="space-y-8">
              <div>
                <h2 className="heading-responsive-lg text-gray-900 mb-2">
                  Цели питания
                </h2>
                <p className="text-gray-600">
                  Настройте персональные цели и отслеживайте прогресс
                </p>
              </div>
              <NutritionGoals />
            </div>
          )}
        </Section>
      </ContentContainer>
    </div>
  );
};

export default NutritionDiary;
