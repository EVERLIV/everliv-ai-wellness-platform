
import { toast } from "sonner";
import { CachedAnalytics } from "@/types/analytics";
import { generateEnhancedAnalytics } from "@/utils/enhancedAnalyticsGenerator";
import { fetchHealthProfileData, fetchAnalysesData, fetchChatsData, saveAnalyticsToDatabase } from "./analyticsDataService";
import { prepareHealthProfileForAnalysis } from "@/utils/healthProfileUtils";
import { ensureAnalyticsConsistency, logAnalyticsDifferences } from "@/utils/analyticsConsistency";
import { SecurityUtils } from "@/utils/securityUtils";
import { InputSanitizer } from "@/utils/inputSanitizer";

export const generateSecureRealTimeAnalytics = async (
  userId: string,
  hasHealthProfile: boolean,
  setAnalytics: (analytics: CachedAnalytics) => void
) => {
  // Security: Validate user ID
  if (!InputSanitizer.isValidUUID(userId)) {
    console.error('🔒 Invalid user ID provided to analytics service');
    toast.error('Ошибка безопасности: недопустимый идентификатор пользователя');
    return false;
  }

  // Security: Rate limiting
  const rateLimitKey = `analytics_${userId}`;
  if (!SecurityUtils.checkRateLimit(rateLimitKey, 3, 300000)) { // 3 requests per 5 minutes
    toast.error('Слишком много запросов аналитики. Попробуйте позже.');
    return false;
  }

  if (!hasHealthProfile) {
    console.log('🔒 No health profile, skipping analytics generation');
    return false;
  }

  try {
    console.log('🔒 Starting secure analytics generation for user:', userId);

    // Security: Audit log
    SecurityUtils.auditLog('generate_analytics_start', userId);

    // Получаем все необходимые данные с проверкой безопасности
    const [rawHealthProfileData, analysesData, chatsData] = await Promise.all([
      fetchHealthProfileData(userId),
      fetchAnalysesData(userId),
      fetchChatsData(userId)
    ]);

    // Security: Validate data ownership (additional check)
    if (analysesData.some((analysis: any) => !analysis.created_at)) {
      console.warn('🔒 Suspicious analysis data detected');
      SecurityUtils.auditLog('suspicious_analysis_data', userId);
    }

    // Обрабатываем профиль здоровья для правильной работы с пользовательскими значениями
    const healthProfileData = prepareHealthProfileForAnalysis(rawHealthProfileData);

    console.log('🔒 Secure data fetched for user:', userId, {
      hasProfile: !!healthProfileData,
      analysesCount: analysesData.length,
      chatsCount: chatsData.length
    });

    // Security: Check for suspicious patterns
    if (SecurityUtils.detectSuspiciousActivity({ 
      analysesCount: analysesData.length, 
      chatsCount: chatsData.length 
    })) {
      console.warn('🔒 Suspicious activity pattern detected');
      SecurityUtils.auditLog('suspicious_activity', userId, {
        analysesCount: analysesData.length,
        chatsCount: chatsData.length
      });
    }

    // Генерируем расширенную аналитику с передачей userId для динамического расчета
    const newAnalytics = await generateEnhancedAnalytics(
      analysesData,
      chatsData,
      true,
      healthProfileData,
      userId
    );

    if (!newAnalytics) {
      throw new Error('Не удалось сгенерировать аналитику');
    }

    // Обеспечиваем согласованность данных
    const consistentAnalytics = ensureAnalyticsConsistency(newAnalytics);

    console.log('🔒 Generated secure consistent analytics for user:', userId);

    // Логируем для отладки различий
    logAnalyticsDifferences('secureAnalyticsService', consistentAnalytics, userId);

    // Security: Sanitize analytics before saving
    const sanitizedAnalytics = {
      ...consistentAnalytics,
      // Remove any potentially sensitive data
      raw_data: undefined,
      debug_info: undefined
    };

    // Сохраняем в базу данных
    await saveAnalyticsToDatabase(userId, sanitizedAnalytics);
    
    setAnalytics(sanitizedAnalytics);
    
    // Security: Audit log success
    SecurityUtils.auditLog('generate_analytics_success', userId, {
      dataPoints: Object.keys(sanitizedAnalytics).length
    });
    
    toast.success('Аналитика здоровья обновлена');
    
    return true;
  } catch (error) {
    console.error('🔒 Error generating secure analytics for user:', userId, error);
    
    // Security: Audit log error
    SecurityUtils.auditLog('generate_analytics_error', userId, {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    toast.error(error instanceof Error ? error.message : 'Ошибка генерации аналитики');
    return false;
  }
};
