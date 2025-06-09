
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NutritionGoals from "./NutritionGoals";
import DailyProgress from "./DailyProgress";
import MealEntry from "./MealEntry";
import NutritionCharts from "./NutritionCharts";
import PersonalizedRecommendations from "./PersonalizedRecommendations";
import { useFoodEntries } from "@/hooks/useFoodEntries";

const NutritionDiary: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMealEntry, setShowMealEntry] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');

  const { getSummaryByMealType, entries, deleteEntry } = useFoodEntries(selectedDate);
  const mealSummary = getSummaryByMealType();

  const handleAddMeal = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    setSelectedMealType(mealType);
    setShowMealEntry(true);
  };

  const getMealEntries = (mealType: string) => {
    return entries.filter(entry => entry.meal_type === mealType);
  };

  return (
    <div className="container mx-auto px-2 md:px-4 py-4 md:py-6 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Дневник Питания</h1>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full md:w-auto"
          />
        </div>
      </div>

      <Tabs defaultValue="diary" className="space-y-4 md:space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-md mx-auto md:mx-0">
          <TabsTrigger value="diary" className="text-xs md:text-sm">Дневник</TabsTrigger>
          <TabsTrigger value="goals" className="text-xs md:text-sm">Цели</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs md:text-sm">Аналитика</TabsTrigger>
          <TabsTrigger value="recommendations" className="text-xs md:text-sm">Советы</TabsTrigger>
        </TabsList>

        <TabsContent value="diary" className="space-y-4 md:space-y-6">
          <DailyProgress selectedDate={selectedDate} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
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

        <TabsContent value="goals">
          <NutritionGoals />
        </TabsContent>

        <TabsContent value="analytics">
          <NutritionCharts />
        </TabsContent>

        <TabsContent value="recommendations">
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
