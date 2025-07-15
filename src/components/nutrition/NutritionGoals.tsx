
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
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-lg md:text-xl font-semibold">Цели питания</h2>
        <Button onClick={calculateMacros} variant="outline" size="sm" className="w-full md:w-auto">
          <Calculator className="h-4 w-4 mr-2" />
          Рассчитать БЖУ
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card className="shadow-none border-gray-200/80 rounded-none">
          <CardHeader className="pb-2 px-3 py-2">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Target className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
              Дневные цели
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 py-2 pt-0 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="calories" className="text-sm font-medium">Калории (ккал)</Label>
              <Input
                id="calories"
                type="number"
                value={formData.daily_calories}
                onChange={(e) => setFormData({ ...formData, daily_calories: Number(e.target.value) })}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="protein" className="text-sm font-medium">Белки (г)</Label>
              <Input
                id="protein"
                type="number"
                value={formData.daily_protein}
                onChange={(e) => setFormData({ ...formData, daily_protein: Number(e.target.value) })}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carbs" className="text-sm font-medium">Углеводы (г)</Label>
              <Input
                id="carbs"
                type="number"
                value={formData.daily_carbs}
                onChange={(e) => setFormData({ ...formData, daily_carbs: Number(e.target.value) })}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fat" className="text-sm font-medium">Жиры (г)</Label>
              <Input
                id="fat"
                type="number"
                value={formData.daily_fat}
                onChange={(e) => setFormData({ ...formData, daily_fat: Number(e.target.value) })}
                className="text-sm"
              />
            </div>

            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="w-full mt-4"
            >
              <Save className="h-4 w-4 mr-2" />
              Сохранить цели
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-none border-gray-200/80 rounded-none">
          <CardHeader className="pb-2 px-3 py-2">
            <CardTitle className="text-base md:text-lg">Рекомендации</CardTitle>
          </CardHeader>
          <CardContent className="px-3 py-2 pt-0">
            <div className="space-y-3 md:space-y-4 text-xs md:text-sm">
              <div className="p-2 bg-blue-50 border border-gray-200/50">
                <h4 className="font-medium text-blue-800 mb-1">Калории</h4>
                <p className="text-blue-700">
                  Базовая потребность зависит от возраста, пола, веса и активности. 
                  Среднее значение: 1800-2500 ккал/день.
                </p>
              </div>

              <div className="p-2 bg-green-50 border border-gray-200/50">
                <h4 className="font-medium text-green-800 mb-1">Белки</h4>
                <p className="text-green-700">
                  1.2-2.0 г на кг веса тела. Для спортсменов до 2.5 г/кг.
                  Источники: мясо, рыба, яйца, бобовые.
                </p>
              </div>

              <div className="p-2 bg-orange-50 border border-gray-200/50">
                <h4 className="font-medium text-orange-800 mb-1">Углеводы</h4>
                <p className="text-orange-700">
                  45-65% от общей калорийности. Предпочтение сложным углеводам:
                  крупы, овощи, фрукты.
                </p>
              </div>

              <div className="p-2 bg-purple-50 border border-gray-200/50">
                <h4 className="font-medium text-purple-800 mb-1">Жиры</h4>
                <p className="text-purple-700">
                  20-35% от общей калорийности. Акцент на полезные жиры:
                  орехи, авокадо, рыба, оливковое масло.
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
