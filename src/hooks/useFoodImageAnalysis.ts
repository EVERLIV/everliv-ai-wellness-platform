
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AnalysisResult {
  food_name: string;
  portion_size: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
}

export const useFoodImageAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeImage = async (imageFile: File): Promise<AnalysisResult | null> => {
    setIsAnalyzing(true);
    try {
      console.log('📷 useFoodImageAnalysis: Starting analysis for file:', imageFile.name, 'size:', imageFile.size);
      
      // Проверяем размер файла (максимум 10MB)
      if (imageFile.size > 10 * 1024 * 1024) {
        throw new Error('Размер файла слишком большой (максимум 10MB)');
      }

      // Преобразуем в base64 для отправки в OpenAI
      const base64 = await fileToBase64(imageFile);
      const imageUrl = `data:${imageFile.type};base64,${base64}`;

      console.log('📷 useFoodImageAnalysis: Sending to edge function for analysis...');

      const { data, error } = await supabase.functions.invoke('analyze-food-image', {
        body: { imageUrl }
      });

      if (error) {
        console.error('📷 useFoodImageAnalysis: Supabase function error:', error);
        throw new Error(`Ошибка Edge функции: ${error.message}`);
      }

      if (!data) {
        throw new Error('Нет данных от сервера');
      }

      if (!data.success) {
        throw new Error(data.error || 'Не удалось проанализировать изображение');
      }

      console.log('📷 useFoodImageAnalysis: Analysis result:', data.analysis);
      toast.success('Изображение успешно проанализировано!');
      
      return data.analysis;
    } catch (error) {
      console.error('📷 useFoodImageAnalysis: Error analyzing image:', error);
      
      // Показываем более понятное сообщение об ошибке
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      toast.error(`Ошибка при анализе изображения: ${errorMessage}`);
      
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  return {
    analyzeImage,
    isAnalyzing
  };
};
