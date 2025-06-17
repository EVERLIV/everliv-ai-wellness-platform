
import { toast } from "sonner";
import { CachedAnalytics } from "@/types/analytics";
import { generateEnhancedAnalytics } from "@/utils/enhancedAnalyticsGenerator";
import { fetchHealthProfileData, fetchAnalysesData, fetchChatsData, saveAnalyticsToDatabase } from "./analyticsDataService";
import { prepareHealthProfileForAnalysis } from "@/utils/healthProfileUtils";
import { ensureAnalyticsConsistency, logAnalyticsDifferences } from "@/utils/analyticsConsistency";

export const generateRealTimeAnalyticsService = async (
  userId: string,
  hasHealthProfile: boolean,
  setAnalytics: (analytics: CachedAnalytics) => void
) => {
  if (!hasHealthProfile) {
    console.log('No health profile, skipping analytics generation');
    return false;
  }

  try {
    console.log('Starting real-time analytics generation for user:', userId);

    // Получаем все необходимые данные
    const [rawHealthProfileData, analysesData, chatsData] = await Promise.all([
      fetchHealthProfileData(userId),
      fetchAnalysesData(userId),
      fetchChatsData(userId)
    ]);

    // Обрабатываем профиль здоровья для правильной работы с пользовательскими значениями
    const healthProfileData = prepareHealthProfileForAnalysis(rawHealthProfileData);

    console.log('Data fetched for user:', userId, {
      hasProfile: !!healthProfileData,
      analysesCount: analysesData.length,
      chatsCount: chatsData.length,
      processedProfile: healthProfileData
    });

    // Генерируем расширенную аналитику с передачей userId для динамического расчета
    const newAnalytics = await generateEnhancedAnalytics(
      analysesData,
      chatsData,
      true,
      healthProfileData,
      userId // Передаем userId для возможности использования динамического расчета
    );

    if (!newAnalytics) {
      throw new Error('Не удалось сгенерировать аналитику');
    }

    // Обеспечиваем согласованность данных
    const consistentAnalytics = ensureAnalyticsConsistency(newAnalytics);

    console.log('Generated consistent analytics for user:', userId, consistentAnalytics);

    // Логируем для отладки различий
    logAnalyticsDifferences('enhancedAnalyticsService', consistentAnalytics, userId);

    // Сохраняем в базу данных
    await saveAnalyticsToDatabase(userId, consistentAnalytics);
    
    setAnalytics(consistentAnalytics);
    toast.success('Аналитика здоровья обновлена');
    
    return true;
  } catch (error) {
    console.error('Error generating real-time analytics for user:', userId, error);
    toast.error(error instanceof Error ? error.message : 'Ошибка генерации аналитики');
    return false;
  }
};
