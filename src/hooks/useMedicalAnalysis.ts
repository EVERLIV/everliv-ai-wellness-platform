
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { FEATURES } from "@/constants/subscription-features";
import { analyzeMedicalTestWithAI, MedicalAnalysisResults } from "@/services/ai/medical-analysis";
import { checkUsageLimit, incrementUsage } from "@/services/usage-tracking-service";
import { sendAnalysisResultsEmail } from "@/services/email-service";

export const useMedicalAnalysis = () => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const [results, setResults] = useState<MedicalAnalysisResults | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("input");
  const [apiError, setApiError] = useState<string | null>(null);

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
  }): Promise<void> => {
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

    // Проверяем лимиты использования
    const planType = subscription?.plan_type || 'basic';
    const featureType = inputMethod === "photo" ? FEATURES.PHOTO_BLOOD_ANALYSIS : FEATURES.BLOOD_ANALYSIS;
    
    try {
      const usageCheck = await checkUsageLimit(user.id, featureType, planType, inputMethod);
      
      if (!usageCheck.canUse) {
        toast.error(`Лимит исчерпан. ${usageCheck.message || 'Оформите подписку для продолжения.'}`);
        return;
      }
      
      console.log(`Доступно использований: ${usageCheck.limit - usageCheck.currentUsage}. ${usageCheck.message}`);
    } catch (error) {
      console.error("Ошибка проверки лимитов:", error);
      toast.error("Не удалось проверить лимиты использования");
      return;
    }

    setIsAnalyzing(true);
    setApiError(null);
    
    try {
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
        planType,
        hasText: inputMethod === "text" && text.length > 0,
        hasImage: inputMethod === "photo" && !!base64Image
      });

      const analysisResults = await analyzeMedicalTestWithAI({
        text: inputMethod === "text" ? text : undefined,
        imageBase64: inputMethod === "photo" ? base64Image : undefined,
        analysisType,
        userId: user.id
      });

      // Увеличиваем счетчик использования только после успешного анализа
      await incrementUsage(user.id, featureType);

      setResults(analysisResults);
      setActiveTab("results");
      
      // Отправляем email с результатами анализа
      try {
        // Получаем профиль пользователя для получения nickname
        const { data: profile } = await supabase
          .from('profiles')
          .select('nickname')
          .eq('id', user.id)
          .single();

        const userName = profile?.nickname || user.email?.split('@')[0] || 'Пользователь';
        const resultsUrl = `${window.location.origin}/analysis/results`;
        const keyFindings = analysisResults.markers
          .filter(marker => marker.status !== 'normal')
          .slice(0, 3)
          .map(marker => `${marker.name}: ${marker.value} (${marker.status === 'high' ? 'выше нормы' : 'ниже нормы'})`);

        await sendAnalysisResultsEmail(
          user.email!,
          userName,
          analysisType,
          resultsUrl,
          keyFindings
        );
        
        console.log('Analysis results email sent successfully');
      } catch (emailError) {
        console.error('Failed to send analysis results email:', emailError);
        // Не прерываем процесс из-за ошибки email
      }
      
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
