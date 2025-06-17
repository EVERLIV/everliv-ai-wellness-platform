
import { toast } from "sonner";
import { CachedAnalytics } from "@/types/analytics";
import { generateAnalyticsData } from "@/utils/analyticsGenerator";
import { fetchAnalysesData, fetchChatsData, saveAnalyticsToDatabase } from "./analyticsDataService";

export const generateBasicAnalyticsService = async (
  userId: string,
  hasHealthProfile: boolean,
  setAnalytics: (analytics: CachedAnalytics) => void
) => {
  try {
    // Получаем данные для базовой аналитики
    const [analysesData, chatsData] = await Promise.all([
      fetchAnalysesData(userId),
      fetchChatsData(userId)
    ]);

    // Используем базовый генератор для совместимости
    const newAnalytics = await generateAnalyticsData(
      analysesData,
      chatsData,
      hasHealthProfile
    );

    if (newAnalytics) {
      // Сохраняем в базу данных
      await saveAnalyticsToDatabase(userId, newAnalytics);
      
      setAnalytics(newAnalytics);
      toast.success('Аналитика обновлена');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error generating analytics:', error);
    toast.error('Ошибка генерации аналитики');
    return false;
  }
};
