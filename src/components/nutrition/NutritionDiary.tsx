
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Camera, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NutritionGoals from "./NutritionGoals";
import DailyProgress from "./DailyProgress";
import MealEntry from "./MealEntry";
import NutritionCharts from "./NutritionCharts";

const NutritionDiary: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMealEntry, setShowMealEntry] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');

  const handleAddMeal = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    setSelectedMealType(mealType);
    setShowMealEntry(true);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Дневник Питания</h1>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <Tabs defaultValue="diary" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="diary">Дневник</TabsTrigger>
          <TabsTrigger value="goals">Цели</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          <TabsTrigger value="recommendations">Советы</TabsTrigger>
        </TabsList>

        <TabsContent value="diary" className="space-y-6">
          <DailyProgress selectedDate={selectedDate} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((mealType) => (
              <Card key={mealType} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
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
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Калории: 0</p>
                    <p>Белки: 0г</p>
                    <p>Жиры: 0г</p>
                    <p>Углеводы: 0г</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="goals">
          <NutritionGoals />
        </TabsContent>

        <TabsContent value="analytics">
          <NutritionCharts />
        </TabsContent>

        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>Персональные рекомендации</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Здесь будут отображаться персональные рекомендации по питанию на основе ваших целей и прогресса.
              </p>
            </CardContent>
          </Card>
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
