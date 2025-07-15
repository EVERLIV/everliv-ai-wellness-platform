
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Upload, Plus, Loader2 } from "lucide-react";
import { useFoodEntries } from "@/hooks/useFoodEntries";
import { useFoodImageAnalysis } from "@/hooks/useFoodImageAnalysis";
import { toast } from "sonner";

interface MealEntryProps {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  selectedDate: Date;
  trigger?: boolean;
  onHandled?: () => void;
}

const MealEntry: React.FC<MealEntryProps> = ({ 
  mealType, 
  selectedDate, 
  trigger = false,
  onHandled 
}) => {
  const [isOpen, setIsOpen] = useState(false);
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

  // Handle external trigger
  useEffect(() => {
    if (trigger) {
      setIsOpen(true);
      onHandled?.();
    }
  }, [trigger, onHandled]);

  const mealTitles = {
    breakfast: 'Завтрак',
    lunch: 'Обед',
    dinner: 'Ужин',
    snack: 'Перекус'
  };

  const handleClose = () => {
    setIsOpen(false);
    setFoodData({
      food_name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      portion_size: ''
    });
    setEntryMode('manual');
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
      handleClose();
    } catch (error) {
      console.error('Error saving food entry:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveWithImageUrl = async (imageUrl?: string) => {
    if (!foodData.food_name.trim()) {
      console.log('📷 Cannot save - no food name');
      return;
    }

    setIsSaving(true);
    try {
      console.log('📷 Saving food entry with image URL:', imageUrl);
      await addEntry({
        meal_type: mealType,
        food_name: foodData.food_name,
        calories: foodData.calories,
        protein: foodData.protein,
        carbs: foodData.carbs,
        fat: foodData.fat,
        portion_size: foodData.portion_size,
        image_url: imageUrl || null,
        entry_date: selectedDate.toISOString().split('T')[0]
      });
      
      console.log('📷 Food entry saved successfully');
      handleClose();
    } catch (error) {
      console.error('📷 Error saving food entry:', error);
      toast.error('Ошибка при сохранении записи');
    } finally {
      setIsSaving(false);
    }
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Задняя камера для съемки еды
        } 
      });
      
      // Останавливаем поток после получения разрешения
      stream.getTracks().forEach(track => track.stop());
      
      toast.success("Доступ к камере получен!");
      return true;
    } catch (error) {
      console.error('Camera permission denied:', error);
      toast.error("Доступ к камере отклонен. Проверьте настройки браузера.");
      return false;
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        console.log('📷 Starting image analysis for file:', file.name);
        const analysis = await analyzeImage(file);
        
        if (analysis) {
          console.log('📷 Analysis completed:', analysis);
          
          // Создаем URL для изображения
          const imageUrl = URL.createObjectURL(file);
          
          setFoodData({
            food_name: analysis.food_name,
            calories: analysis.calories,
            protein: analysis.protein,
            carbs: analysis.carbs,
            fat: analysis.fat,
            portion_size: analysis.portion_size
          });
          
          // Остаемся в том же режиме, не переключаемся
          console.log('📷 Food data updated, staying in current mode');
          
          // Автоматически сохраняем запись после успешного анализа
          if (analysis.food_name) {
            console.log('📷 Auto-saving analyzed food entry');
            await handleSaveWithImageUrl(imageUrl);
          }
        } else {
          console.log('📷 Analysis failed - no results');
          toast.error('Не удалось проанализировать изображение');
        }
      } catch (error) {
        console.error('📷 Error during image analysis:', error);
        toast.error('Ошибка при анализе изображения');
      }
    }
    
    // Сбрасываем значение input для возможности повторной загрузки того же файла
    event.target.value = '';
  };

  const handleCameraMode = async () => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      setEntryMode('camera');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1 px-2 py-1 h-auto text-xs rounded-none border-gray-300">
          <Plus className="h-3 w-3" />
          +
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] mx-auto overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-lg">Добавить {mealTitles[mealType]}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto max-h-[60vh] px-1">
          {/* Выбор способа добавления */}
          <div className="flex flex-col gap-2">
            <Button
              variant={entryMode === 'manual' ? 'default' : 'outline'}
              onClick={() => setEntryMode('manual')}
              className="w-full h-auto py-2 text-xs rounded-none"
            >
              <Plus className="h-3 w-3 mr-1" />
              Вручную
            </Button>
            <Button
              variant={entryMode === 'camera' ? 'default' : 'outline'}
              onClick={handleCameraMode}
              className="w-full h-auto py-2 text-xs rounded-none"
            >
              <Camera className="h-3 w-3 mr-1" />
              Камера
            </Button>
            <Button
              variant={entryMode === 'upload' ? 'default' : 'outline'}
              onClick={() => setEntryMode('upload')}
              className="w-full h-auto py-2 text-xs rounded-none"
            >
              <Upload className="h-3 w-3 mr-1" />
              Загрузить
            </Button>
          </div>

          {/* Ручной ввод */}
          {entryMode === 'manual' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="food_name" className="text-sm">Название блюда</Label>
                <Input
                  id="food_name"
                  value={foodData.food_name}
                  onChange={(e) => setFoodData({...foodData, food_name: e.target.value})}
                  placeholder="Например: Греческий салат"
                  className="mt-1 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="portion_size" className="text-sm">Размер порции</Label>
                <Input
                  id="portion_size"
                  value={foodData.portion_size}
                  onChange={(e) => setFoodData({...foodData, portion_size: e.target.value})}
                  placeholder="Например: 200г"
                  className="mt-1 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="calories" className="text-sm">Калории</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={foodData.calories}
                    onChange={(e) => setFoodData({...foodData, calories: Number(e.target.value)})}
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="protein" className="text-sm">Белки (г)</Label>
                  <Input
                    id="protein"
                    type="number"
                    step="0.1"
                    value={foodData.protein}
                    onChange={(e) => setFoodData({...foodData, protein: Number(e.target.value)})}
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="carbs" className="text-sm">Углеводы (г)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    step="0.1"
                    value={foodData.carbs}
                    onChange={(e) => setFoodData({...foodData, carbs: Number(e.target.value)})}
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="fat" className="text-sm">Жиры (г)</Label>
                  <Input
                    id="fat"
                    type="number"
                    step="0.1"
                    value={foodData.fat}
                    onChange={(e) => setFoodData({...foodData, fat: Number(e.target.value)})}
                    className="mt-1 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Загрузка изображения */}
          {(entryMode === 'camera' || entryMode === 'upload') && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
                    <>
                      <Loader2 className="h-10 w-10 mx-auto text-blue-500 animate-spin" />
                      <p className="text-blue-600 text-sm font-medium">
                        Анализируем изображение...
                      </p>
                      <p className="text-xs text-blue-400">
                        Пожалуйста, не закрывайте окно
                      </p>
                    </>
                  ) : entryMode === 'camera' ? (
                    <>
                      <Camera className="h-10 w-10 mx-auto text-gray-400" />
                      <p className="text-gray-600 text-sm">
                        Сфотографировать блюдо
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 mx-auto text-gray-400" />
                      <p className="text-gray-600 text-sm">
                        Загрузить фото блюда
                      </p>
                    </>
                  )}
                  {!isAnalyzing && (
                    <p className="text-xs text-gray-500">
                      ИИ автоматически определит состав БЖУ
                    </p>
                  )}
                </div>
              </Label>
            </div>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="flex flex-col gap-2 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={handleClose} 
            className="w-full text-xs py-2 rounded-none" 
            disabled={isSaving || isAnalyzing}
          >
            Отмена
          </Button>
          {/* Показываем кнопку "Добавить" только если не анализируем изображение */}
          {!isAnalyzing && (
            <Button 
              onClick={handleSave} 
              className="w-full text-xs py-2 rounded-none" 
              disabled={isSaving || !foodData.food_name.trim()}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Добавление...
                </>
              ) : (
                'Добавить'
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealEntry;
