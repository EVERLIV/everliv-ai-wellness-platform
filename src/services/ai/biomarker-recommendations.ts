
import { supabase } from "@/integrations/supabase/client";

interface BiomarkerRecommendationParams {
  biomarkerName: string;
  currentValue: string;
  normalRange: string;
  status: 'normal' | 'high' | 'low';
  userId: string;
}

interface BiomarkerRecommendation {
  dietaryRecommendations: string[];
  lifestyleChanges: string[];
  supplementsToConsider: string[];
  whenToRetest: string;
  warningSignsToWatch: string[];
  additionalTests: string[];
}

export const generateBiomarkerRecommendation = async (
  params: BiomarkerRecommendationParams
): Promise<BiomarkerRecommendation | null> => {
  console.log("Generating biomarker recommendation:", params);
  
  // Не генерируем рекомендации для нормальных показателей
  if (params.status === 'normal') {
    return null;
  }
  
  try {
    const { data, error } = await supabase.functions.invoke('generate-biomarker-recommendations', {
      body: {
        biomarkerName: params.biomarkerName,
        currentValue: params.currentValue,
        normalRange: params.normalRange,
        status: params.status,
        userId: params.userId
      }
    });

    if (error) {
      console.error("Supabase function error:", error);
      throw new Error(error.message || "Ошибка при генерации рекомендаций");
    }

    if (!data) {
      throw new Error("Не получен ответ от функции генерации рекомендаций");
    }

    if (data.error) {
      throw new Error(data.error);
    }

    console.log("Successfully generated biomarker recommendation:", data);
    return data as BiomarkerRecommendation;
  } catch (error) {
    console.error("Error generating biomarker recommendation:", error);
    return null;
  }
};
