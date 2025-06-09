
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
      // Загружаем изображение в Storage (если есть)
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      
      // Создаем FormData для отправки изображения
      const formData = new FormData();
      formData.append('file', imageFile);

      // Преобразуем в base64 для отправки в OpenAI
      const base64 = await fileToBase64(imageFile);
      const imageUrl = `data:${imageFile.type};base64,${base64}`;

      console.log('Sending image for analysis...');

      const { data, error } = await supabase.functions.invoke('analyze-food-image', {
        body: { imageUrl }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to analyze image');
      }

      console.log('Analysis result:', data.analysis);
      toast.success('Изображение успешно проанализировано!');
      
      return data.analysis;
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error('Ошибка при анализе изображения');
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
