
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Upload, Plus, Loader2 } from "lucide-react";
import { useFoodEntries } from "@/hooks/useFoodEntries";
import { useFoodImageAnalysis } from "@/hooks/useFoodImageAnalysis";

interface MealEntryProps {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  selectedDate: Date;
  onClose: () => void;
}

const MealEntry: React.FC<MealEntryProps> = ({ mealType, selectedDate, onClose }) => {
  const [entryMode, setEntryMode] = useState<'manual' | 'camera' | 'upload'>('manual');
  const [foodData, setFoodData] = useState({
    food_name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    portion_size: ''
  });

  const { addEntry } = useFoodEntries(selectedDate);
  const { analyzeImage, isAnalyzing } = useFoodImageAnalysis();
  const [isSaving, setIsSaving] = useState(false);

  const mealTitles = {
    breakfast: 'Завтрак',
    lunch: 'Обед',
    dinner: 'Ужин',
    snack: 'Перекус'
  };

  const handleSave = async () => {
    if (!foodData.food_name.trim()) {
      return;
    }

    setIsSaving(true);
    try {
      await addEntry({
        meal_type: mealType,
        food_name: foodData.food_name,
        calories: foodData.calories,
        protein: foodData.protein,
        carbs: foodData.carbs,
        fat: foodData.fat,
        portion_size: foodData.portion_size,
        image_url: null,
        entry_date: selectedDate.toISOString().split('T')[0]
      });
      onClose();
    } catch (error) {
      console.error('Error saving food entry:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const analysis = await analyzeImage(file);
      if (analysis) {
        setFoodData({
          food_name: analysis.food_name,
          calories: analysis.calories,
          protein: analysis.protein,
          carbs: analysis.carbs,
          fat: analysis.fat,
          portion_size: analysis.portion_size
        });
        setEntryMode('manual'); // Переключаемся на ручной режим для редактирования
      }
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] mx-auto overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl">Добавить {mealTitles[mealType]}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 md:space-y-6 overflow-y-auto max-h-[70vh] px-1">
          {/* Выбор способа добавления */}
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
            <Button
              variant={entryMode === 'manual' ? 'default' : 'outline'}
              onClick={() => setEntryMode('manual')}
              className="flex-1 h-auto py-3 text-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Вручную
            </Button>
            <Button
              variant={entryMode === 'camera' ? 'default' : 'outline'}
              onClick={() => setEntryMode('camera')}
              className="flex-1 h-auto py-3 text-sm"
            >
              <Camera className="h-4 w-4 mr-2" />
              Камера
            </Button>
            <Button
              variant={entryMode === 'upload' ? 'default' : 'outline'}
              onClick={() => setEntryMode('upload')}
              className="flex-1 h-auto py-3 text-sm"
            >
              <Upload className="h-4 w-4 mr-2" />
              Загрузить
            </Button>
          </div>

          {/* Ручной ввод */}
          {entryMode === 'manual' && (
            <div className="space-y-3 md:space-y-4">
              <div>
                <Label htmlFor="food_name" className="text-sm md:text-base">Название блюда</Label>
                <Input
                  id="food_name"
                  value={foodData.food_name}
                  onChange={(e) => setFoodData({...foodData, food_name: e.target.value})}
                  placeholder="Например: Греческий салат"
                  className="mt-1 text-sm md:text-base"
                />
              </div>
              <div>
                <Label htmlFor="portion_size" className="text-sm md:text-base">Размер порции</Label>
                <Input
                  id="portion_size"
                  value={foodData.portion_size}
                  onChange={(e) => setFoodData({...foodData, portion_size: e.target.value})}
                  placeholder="Например: 200г"
                  className="mt-1 text-sm md:text-base"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <Label htmlFor="calories" className="text-sm md:text-base">Калории</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={foodData.calories}
                    onChange={(e) => setFoodData({...foodData, calories: Number(e.target.value)})}
                    className="mt-1 text-sm md:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="protein" className="text-sm md:text-base">Белки (г)</Label>
                  <Input
                    id="protein"
                    type="number"
                    step="0.1"
                    value={foodData.protein}
                    onChange={(e) => setFoodData({...foodData, protein: Number(e.target.value)})}
                    className="mt-1 text-sm md:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="carbs" className="text-sm md:text-base">Углеводы (г)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    step="0.1"
                    value={foodData.carbs}
                    onChange={(e) => setFoodData({...foodData, carbs: Number(e.target.value)})}
                    className="mt-1 text-sm md:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="fat" className="text-sm md:text-base">Жиры (г)</Label>
                  <Input
                    id="fat"
                    type="number"
                    step="0.1"
                    value={foodData.fat}
                    onChange={(e) => setFoodData({...foodData, fat: Number(e.target.value)})}
                    className="mt-1 text-sm md:text-base"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Загрузка изображения */}
          {(entryMode === 'camera' || entryMode === 'upload') && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-8 text-center">
              <input
                type="file"
                accept="image/*"
                capture={entryMode === 'camera' ? 'environment' : undefined}
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={isAnalyzing}
              />
              <Label htmlFor="image-upload" className="cursor-pointer">
                <div className="space-y-2">
                  {isAnalyzing ? (
                    <Loader2 className="h-8 w-8 md:h-12 md:w-12 mx-auto text-blue-500 animate-spin" />
                  ) : entryMode === 'camera' ? (
                    <Camera className="h-8 w-8 md:h-12 md:w-12 mx-auto text-gray-400" />
                  ) : (
                    <Upload className="h-8 w-8 md:h-12 md:w-12 mx-auto text-gray-400" />
                  )}
                  <p className="text-gray-600 text-sm md:text-base">
                    {isAnalyzing 
                      ? 'Анализируем изображение...'
                      : entryMode === 'camera' 
                        ? 'Сфотографировать блюдо' 
                        : 'Загрузить фото блюда'}
                  </p>
                  <p className="text-xs md:text-sm text-gray-500">
                    ИИ автоматически определит состав БЖУ
                  </p>
                </div>
              </Label>
            </div>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1 text-sm md:text-base" disabled={isSaving}>
            Отмена
          </Button>
          <Button 
            onClick={handleSave} 
            className="flex-1 text-sm md:text-base" 
            disabled={isSaving || !foodData.food_name.trim()}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Добавление...
              </>
            ) : (
              'Добавить'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealEntry;
