
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { FEATURES } from "@/constants/subscription-features";
import { analyzeBloodTestWithOpenAI } from "@/services/ai";

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

export const useBloodAnalysis = () => {
  const { user } = useAuth();
  const { canUseFeature, recordFeatureTrial } = useSubscription();
  const [results, setResults] = useState<BloodAnalysisResults | null>(null);
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
      console.error("Error converting blob to base64:", error);
      throw new Error("Не удалось обработать изображение. Попробуйте еще раз.");
    }
  };

  const analyzeBloodTest = async (data: { text: string, photoUrl: string, inputMethod: "text" | "photo" }) => {
    const { text, photoUrl, inputMethod } = data;
    
    if (inputMethod === "text" && !text.trim()) {
      toast.error("Пожалуйста, введите результаты анализа крови");
      return;
    }

    if (inputMethod === "photo" && !photoUrl) {
      toast.error("Пожалуйста, загрузите фото результатов анализа");
      return;
    }

    setIsAnalyzing(true);
    setApiError(null);
    
    try {
      // Record feature trial
      if (user) {
        if (inputMethod === "text" && canUseBloodAnalysis) {
          await recordFeatureTrial(FEATURES.BLOOD_ANALYSIS);
        } else if (inputMethod === "photo" && canUsePhotoAnalysis) {
          await recordFeatureTrial(FEATURES.PHOTO_BLOOD_ANALYSIS);
        }
      }

      let base64Image: string | undefined;
      
      // Convert blob URL to base64 if photo analysis is used
      if (inputMethod === "photo" && photoUrl) {
        try {
          base64Image = await convertBlobToBase64(photoUrl);
          console.log("Successfully converted image to base64");
        } catch (error) {
          console.error("Error converting image:", error);
          throw new Error("Не удалось обработать изображение. Пожалуйста, попробуйте другое фото.");
        }
      }

      console.log("Analyzing blood test with params:", {
        text: inputMethod === "text" ? text.substring(0, 100) + "..." : undefined,
        imageUrl: inputMethod === "photo" ? "image data available" : undefined
      });

      // Call Supabase Edge Function
      const analysisResults = await analyzeBloodTestWithOpenAI({
        text: inputMethod === "text" ? text : undefined,
        imageBase64: inputMethod === "photo" ? base64Image : undefined
      });

      setResults(analysisResults);
      setActiveTab("results");
      toast.success(`Анализ завершен! Обработано ${analysisResults.markers.length} показателей.`);
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
    analyzeBloodTest
  };
};
