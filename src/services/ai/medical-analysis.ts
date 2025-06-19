
import { supabase } from "@/integrations/supabase/client";

export interface MedicalAnalysisMarker {
  name: string;
  value: string;
  normalRange: string;
  status: 'normal' | 'high' | 'low';
  recommendation: string;
  detailedRecommendation?: string;
}

export interface MedicalAnalysisResults {
  analysisId?: string;
  analysisType: string;
  testDate: string;
  markers: MedicalAnalysisMarker[];
  supplements: Array<{
    name: string;
    reason: string;
    dosage: string;
  }>;
  generalRecommendation: string;
  riskLevel: 'low' | 'medium' | 'high';
  followUpTests: string[];
  summary: string;
}

interface AnalyzeMedicalTestParams {
  text?: string;
  imageBase64?: string;
  analysisType: string;
  userId: string;
  testDate?: string;
}

export const analyzeMedicalTestWithAI = async (params: AnalyzeMedicalTestParams): Promise<MedicalAnalysisResults> => {
  console.log("Analyzing medical test with Supabase Edge Function", {
    hasText: !!params.text,
    hasImage: !!params.imageBase64,
    analysisType: params.analysisType,
    testDate: params.testDate
  });
  
  try {
    const { data, error } = await supabase.functions.invoke('analyze-medical-test', {
      body: {
        text: params.text,
        imageBase64: params.imageBase64,
        analysisType: params.analysisType,
        userId: params.userId,
        testDate: params.testDate
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

    console.log("Successfully analyzed medical test:", {
      analysisType: data.analysisType,
      markersCount: data.markers.length,
      supplementsCount: data.supplements?.length || 0,
      testDate: data.testDate
    });

    return data as MedicalAnalysisResults;
  } catch (error) {
    console.error("Error analyzing medical test:", error);
    
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
