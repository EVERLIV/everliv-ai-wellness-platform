
import { supabase } from "@/integrations/supabase/client";

interface MedicalAnalysisParams {
  text?: string;
  imageBase64?: string;
  analysisType: string;
  userId: string;
}

interface MedicalAnalysisResults {
  analysisId?: string;
  analysisType: string;
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
  riskLevel: 'low' | 'medium' | 'high';
  followUpTests: string[];
  summary: string;
}

/**
 * Анализирует любой тип медицинского анализа с помощью ИИ
 */
export const analyzeMedicalTestWithAI = async (params: MedicalAnalysisParams): Promise<MedicalAnalysisResults> => {
  console.log("Анализируем медицинский тест с помощью ИИ", {
    analysisType: params.analysisType,
    hasText: !!params.text,
    hasImage: !!params.imageBase64,
    userId: params.userId
  });
  
  try {
    const { data, error } = await supabase.functions.invoke('analyze-medical-test', {
      body: {
        text: params.text,
        imageBase64: params.imageBase64,
        analysisType: params.analysisType,
        userId: params.userId
      }
    });

    if (error) {
      console.error("Ошибка Supabase функции:", error);
      throw new Error(error.message || "Ошибка при вызове функции анализа");
    }

    if (!data) {
      throw new Error("Не получен ответ от функции анализа");
    }

    if (data.error) {
      throw new Error(data.error);
    }

    if (!data.markers || !Array.isArray(data.markers)) {
      console.error("Некорректная структура ответа:", data);
      throw new Error("Получен некорректный ответ от ИИ. Попробуйте еще раз.");
    }

    if (data.markers.length === 0) {
      throw new Error("Не удалось распознать показатели в предоставленных данных. Проверьте данные и попробуйте еще раз.");
    }

    console.log("Анализ успешно выполнен:", {
      analysisType: data.analysisType,
      markersCount: data.markers.length,
      supplementsCount: data.supplements?.length || 0,
      riskLevel: data.riskLevel,
      analysisId: data.analysisId
    });

    return data as MedicalAnalysisResults;
  } catch (error) {
    console.error("Ошибка анализа медицинского теста:", error);
    
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

/**
 * Получение истории медицинских анализов пользователя
 */
export const getMedicalAnalysesHistory = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('medical_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Ошибка получения истории анализов:", error);
      throw new Error("Не удалось загрузить историю анализов");
    }

    return data || [];
  } catch (error) {
    console.error("Ошибка загрузки истории:", error);
    throw error;
  }
};

/**
 * Получение конкретного анализа по ID
 */
export const getMedicalAnalysisById = async (analysisId: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('medical_analyses')
      .select('*')
      .eq('id', analysisId)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error("Ошибка получения анализа:", error);
      throw new Error("Не удалось загрузить анализ");
    }

    return data;
  } catch (error) {
    console.error("Ошибка загрузки анализа:", error);
    throw error;
  }
};
