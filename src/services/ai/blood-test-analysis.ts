
import { supabase } from "@/integrations/supabase/client";

interface OpenAIBloodAnalysisParams {
  text?: string;
  imageBase64?: string;
}

interface BloodAnalysisResults {
  markers: Array<{
    name: string;
    value: string;
    normalRange: string;
    status: 'normal' | 'high' | 'low';
    recommendation: string;
  }>;
  supplements: Array<{
    name: string;
    reason: string;
    dosage: string;
  }>;
  generalRecommendation: string;
}

/**
 * Analyzes blood test results using OpenAI via Supabase Edge Function
 */
export const analyzeBloodTestWithOpenAI = async (params: OpenAIBloodAnalysisParams): Promise<BloodAnalysisResults> => {
  console.log("Analyzing blood test with Supabase Edge Function", {
    hasText: !!params.text,
    hasImage: !!params.imageBase64
  });
  
  try {
    const { data, error } = await supabase.functions.invoke('analyze-blood-test', {
      body: {
        text: params.text,
        imageBase64: params.imageBase64
      }
    });

    if (error) {
      console.error("Supabase function error:", error);
      throw new Error(error.message || "Ошибка при вызове функции анализа");
    }

    if (!data) {
      throw new Error("Не получен ответ от функции анализа");
    }

    // Check if response contains an error
    if (data.error) {
      throw new Error(data.error);
    }

    // Validate response structure
    if (!data.markers || !Array.isArray(data.markers)) {
      console.error("Invalid response structure:", data);
      throw new Error("Получен некорректный ответ от ИИ. Попробуйте еще раз.");
    }

    // Ensure we have at least one marker
    if (data.markers.length === 0) {
      throw new Error("Не удалось распознать показатели в предоставленных данных. Проверьте данные и попробуйте еще раз.");
    }

    console.log("Successfully analyzed blood test:", {
      markersCount: data.markers.length,
      supplementsCount: data.supplements?.length || 0
    });

    return data as BloodAnalysisResults;
  } catch (error) {
    console.error("Error analyzing blood test:", error);
    
    // Return a meaningful error for common issues
    if (error.message?.includes('API key')) {
      throw new Error("Ошибка API ключа OpenAI. Пожалуйста, проверьте настройки.");
    } else if (error.message?.includes('quota')) {
      throw new Error("Превышен лимит запросов к OpenAI. Попробуйте позже.");
    } else if (error.message?.includes('image')) {
      throw new Error("Ошибка обработки изображения. Попробуйте загрузить другое фото или введите данные вручную.");
    }
    
    throw error;
  }
};

// Remove the old OpenAI client code as we now use Supabase Edge Functions
export const createBloodTestSystemPrompt = () => {
  return "This function is now handled by Supabase Edge Function";
};

export const createBloodTestPrompt = (text: string) => {
  return "This function is now handled by Supabase Edge Function";
};
