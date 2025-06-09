
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { FEATURES } from "@/constants/subscription-features";
import { analyzeMedicalTestWithAI, MedicalAnalysisResults } from "@/services/ai/medical-analysis";

export const useMedicalAnalysis = () => {
  const { user } = useAuth();
  const { canUseFeature, recordFeatureTrial } = useSubscription();
  const [results, setResults] = useState<MedicalAnalysisResults | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("input");
  const [apiError, setApiError] = useState<string | null>(null);

  const canUseBloodAnalysis = canUseFeature(FEATURES.BLOOD_ANALYSIS);
  const canUsePhotoAnalysis = canUseFeature(FEATURES.PHOTO_BLOOD_ANALYSIS);

  const convertBlobToBase64 = async (blobUrl: string): Promise<string> => {
    try {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Ошибка конвертации изображения:", error);
      throw new Error("Не удалось обработать изображение. Попробуйте еще раз.");
    }
  };

  const analyzeMedicalTest = async (data: { 
    text: string; 
    photoUrl: string; 
    inputMethod: "text" | "photo";
    analysisType: string;
  }) => {
    const { text, photoUrl, inputMethod, analysisType } = data;
    
    if (!user) {
      toast.error("Необходимо войти в систему");
      return;
    }
    
    if (inputMethod === "text" && !text.trim()) {
      toast.error("Пожалуйста, введите результаты анализа");
      return;
    }

    if (inputMethod === "photo" && !photoUrl) {
      toast.error("Пожалуйста, загрузите фото результатов анализа");
      return;
    }

    setIsAnalyzing(true);
    setApiError(null);
    
    try {
      // Записываем использование функции
      if (inputMethod === "text" && canUseBloodAnalysis) {
        await recordFeatureTrial(FEATURES.BLOOD_ANALYSIS);
      } else if (inputMethod === "photo" && canUsePhotoAnalysis) {
        await recordFeatureTrial(FEATURES.PHOTO_BLOOD_ANALYSIS);
      }

      let base64Image: string | undefined;
      
      if (inputMethod === "photo" && photoUrl) {
        try {
          base64Image = await convertBlobToBase64(photoUrl);
          console.log("Изображение успешно конвертировано в base64");
        } catch (error) {
          console.error("Ошибка конвертации изображения:", error);
          throw new Error("Не удалось обработать изображение. Пожалуйста, попробуйте другое фото.");
        }
      }

      console.log("Анализируем медицинский тест:", {
        analysisType,
        method: inputMethod,
        hasText: inputMethod === "text" && text.length > 0,
        hasImage: inputMethod === "photo" && !!base64Image
      });

      const analysisResults = await analyzeMedicalTestWithAI({
        text: inputMethod === "text" ? text : undefined,
        imageBase64: inputMethod === "photo" ? base64Image : undefined,
        analysisType,
        userId: user.id
      });

      setResults(analysisResults);
      setActiveTab("results");
      
      toast.success(`Анализ "${analysisType}" завершен! Обработано ${analysisResults.markers.length} показателей.`);
    } catch (error) {
      console.error("Ошибка анализа:", error);
      const errorMessage = error instanceof Error ? error.message : "Неизвестная ошибка при анализе";
      setApiError(errorMessage);
      toast.error("Произошла ошибка при анализе: " + errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    results,
    isAnalyzing,
    activeTab,
    apiError,
    setActiveTab,
    setResults,
    analyzeMedicalTest
  };
};
