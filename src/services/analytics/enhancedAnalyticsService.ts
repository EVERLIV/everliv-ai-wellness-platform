
import { toast } from "sonner";
import { CachedAnalytics } from "@/types/analytics";
import { generateEnhancedAnalytics } from "@/utils/enhancedAnalyticsGenerator";
import { fetchHealthProfileData, fetchAnalysesData, fetchChatsData, saveAnalyticsToDatabase } from "./analyticsDataService";
import { prepareHealthProfileForAnalysis } from "@/utils/healthProfileUtils";

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
    console.log('Starting real-time analytics generation...');

    // Получаем все необходимые данные
    const [rawHealthProfileData, analysesData, chatsData] = await Promise.all([
      fetchHealthProfileData(userId),
      fetchAnalysesData(userId),
      fetchChatsData(userId)
    ]);

    // Обрабатываем профиль здоровья для правильной работы с пользовательскими значениями
    const healthProfileData = prepareHealthProfileForAnalysis(rawHealthProfileData);

    console.log('Data fetched:', {
      hasProfile: !!healthProfileData,
      analysesCount: analysesData.length,
      chatsCount: chatsData.length,
      processedProfile: healthProfileData
    });

    // Генерируем расширенную аналитику
    const newAnalytics = await generateEnhancedAnalytics(
      analysesData,
      chatsData,
      true,
      healthProfileData
    );

    if (!newAnalytics) {
      throw new Error('Не удалось сгенерировать аналитику');
    }

    console.log('Generated analytics:', newAnalytics);

    // Сохраняем в базу данных
    await saveAnalyticsToDatabase(userId, newAnalytics);
    
    setAnalytics(newAnalytics);
    toast.success('Аналитика здоровья обновлена');
    
    return true;
  } catch (error) {
    console.error('Error generating real-time analytics:', error);
    toast.error(error instanceof Error ? error.message : 'Ошибка генерации аналитики');
    return false;
  }
};
