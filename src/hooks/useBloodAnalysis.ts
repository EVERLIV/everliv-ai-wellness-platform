
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { FEATURES } from "@/constants/subscription-features";
import { analyzeBloodTestWithOpenAI } from "@/services/openai-service";

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

      console.log("Analyzing blood test with params:", {
        text: inputMethod === "text" ? text : undefined,
        imageUrl: inputMethod === "photo" ? photoUrl : undefined
      });

      // Call OpenAI service with proper parameters based on input method
      const analysisResults = await analyzeBloodTestWithOpenAI({
        text: inputMethod === "text" ? text : undefined,
        imageUrl: inputMethod === "photo" ? photoUrl : undefined
      });

      setResults(analysisResults);
      setActiveTab("results");
      toast.success("Анализ успешно завершен");
    } catch (error) {
      console.error("Ошибка анализа:", error);
      setApiError(error instanceof Error ? error.message : "Неизвестная ошибка");
      toast.error("Произошла ошибка при анализе");
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
