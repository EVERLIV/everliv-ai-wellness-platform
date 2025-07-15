
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, Save, Calculator } from "lucide-react";
import { useNutritionGoals } from "@/hooks/useNutritionGoals";
import { toast } from "sonner";

const NutritionGoals: React.FC = () => {
  const { goals, saveGoals, isLoading } = useNutritionGoals();
  const [formData, setFormData] = useState({
    daily_calories: goals?.daily_calories || 2000,
    daily_protein: goals?.daily_protein || 120,
    daily_carbs: goals?.daily_carbs || 250,
    daily_fat: goals?.daily_fat || 80
  });

  const handleSave = async () => {
    try {
      await saveGoals(formData);
      toast.success("Цели питания обновлены!");
    } catch (error) {
      toast.error("Ошибка при сохранении целей");
    }
  };

  const calculateMacros = () => {
    const calories = formData.daily_calories;
    // Рекомендуемое распределение: 30% белки, 40% углеводы, 30% жиры
    const protein = Math.round((calories * 0.3) / 4); // 4 ккал на грамм белка
    const carbs = Math.round((calories * 0.4) / 4); // 4 ккал на грамм углеводов
    const fat = Math.round((calories * 0.3) / 9); // 9 ккал на грамм жира

    setFormData({
      ...formData,
      daily_protein: protein,
      daily_carbs: carbs,
      daily_fat: fat
    });
    
    toast.success("БЖУ рассчитано автоматически!");
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <Button onClick={calculateMacros} variant="outline" className="w-full md:w-auto text-xs py-1 px-2 h-auto rounded-none">
          <Calculator className="h-3 w-3 mr-1" />
          Рассчитать БЖУ
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="shadow-none border-gray-200/80 rounded-none">
          <CardHeader className="pb-1 px-2 py-1">
            <CardTitle className="flex items-center gap-1 text-sm">
              <Target className="h-3 w-3 text-green-500" />
              Дневные цели
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 py-1 pt-0 space-y-2">
            <div className="space-y-1">
              <Label htmlFor="calories" className="text-xs">Калории (ккал)</Label>
              <Input
                id="calories"
                type="number"
                value={formData.daily_calories}
                onChange={(e) => setFormData({ ...formData, daily_calories: Number(e.target.value) })}
                className="text-xs h-7 rounded-none"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="protein" className="text-xs">Белки (г)</Label>
              <Input
                id="protein"
                type="number"
                value={formData.daily_protein}
                onChange={(e) => setFormData({ ...formData, daily_protein: Number(e.target.value) })}
                className="text-xs h-7 rounded-none"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="carbs" className="text-xs">Углеводы (г)</Label>
              <Input
                id="carbs"
                type="number"
                value={formData.daily_carbs}
                onChange={(e) => setFormData({ ...formData, daily_carbs: Number(e.target.value) })}
                className="text-xs h-7 rounded-none"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="fat" className="text-xs">Жиры (г)</Label>
              <Input
                id="fat"
                type="number"
                value={formData.daily_fat}
                onChange={(e) => setFormData({ ...formData, daily_fat: Number(e.target.value) })}
                className="text-xs h-7 rounded-none"
              />
            </div>

            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="w-full mt-2 text-xs py-1 px-2 h-auto rounded-none"
            >
              <Save className="h-3 w-3 mr-1" />
              Сохранить цели
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-none border-gray-200/80 rounded-none">
          <CardHeader className="pb-1 px-2 py-1">
            <CardTitle className="text-sm">Рекомендации</CardTitle>
          </CardHeader>
          <CardContent className="px-2 py-1 pt-0">
            <div className="space-y-2 text-xs">
              <div className="p-1 bg-blue-50 border border-gray-200/50">
                <h4 className="font-medium text-blue-800 mb-1 text-xs">Калории</h4>
                <p className="text-blue-700 text-xs">
                  Базовая потребность: 1800-2500 ккал/день.
                </p>
              </div>

              <div className="p-1 bg-green-50 border border-gray-200/50">
                <h4 className="font-medium text-green-800 mb-1 text-xs">Белки</h4>
                <p className="text-green-700 text-xs">
                  1.2-2.0 г на кг веса тела.
                </p>
              </div>

              <div className="p-1 bg-orange-50 border border-gray-200/50">
                <h4 className="font-medium text-orange-800 mb-1 text-xs">Углеводы</h4>
                <p className="text-orange-700 text-xs">
                  45-65% от общей калорийности.
                </p>
              </div>

              <div className="p-1 bg-purple-50 border border-gray-200/50">
                <h4 className="font-medium text-purple-800 mb-1 text-xs">Жиры</h4>
                <p className="text-purple-700 text-xs">
                  20-35% от общей калорийности.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NutritionGoals;
