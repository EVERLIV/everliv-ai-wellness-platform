
import { supabase } from "@/integrations/supabase/client";

export interface UsageData {
  id: string;
  user_id: string;
  feature_type: string;
  usage_count: number;
  period_start: string;
  period_end: string;
  created_at: string;
  updated_at: string;
}

// Функция для проверки является ли пользователь премиум
const isPremiumUser = (userEmail: string): boolean => {
  return userEmail === 'hoaandrey@gmail.com';
};

export const getCurrentMonthUsage = async (userId: string, featureType: string): Promise<number> => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  const { data, error } = await supabase
    .from('usage_tracking')
    .select('usage_count')
    .eq('user_id', userId)
    .eq('feature_type', featureType)
    .gte('period_start', firstDay.toISOString().split('T')[0])
    .lte('period_end', lastDay.toISOString().split('T')[0])
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching usage:', error);
    return 0;
  }
  
  return data?.usage_count || 0;
};

// Функция для получения общего использования анализов (текст + фото)
export const getTotalAnalysisUsage = async (userId: string): Promise<number> => {
  const textUsage = await getCurrentMonthUsage(userId, 'lab_analyses');
  const photoUsage = await getCurrentMonthUsage(userId, 'photo_lab_analyses');
  return textUsage + photoUsage;
};

export const incrementUsage = async (userId: string, featureType: string): Promise<void> => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  const periodStart = firstDay.toISOString().split('T')[0];
  const periodEnd = lastDay.toISOString().split('T')[0];
  
  // Попытаемся обновить существующую запись
  const { data: existingData, error: selectError } = await supabase
    .from('usage_tracking')
    .select('id, usage_count')
    .eq('user_id', userId)
    .eq('feature_type', featureType)
    .eq('period_start', periodStart)
    .single();
  
  if (existingData) {
    // Обновляем существующую запись
    const { error } = await supabase
      .from('usage_tracking')
      .update({ 
        usage_count: existingData.usage_count + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingData.id);
    
    if (error) {
      console.error('Error updating usage:', error);
      throw error;
    }
  } else {
    // Создаем новую запись
    const { error } = await supabase
      .from('usage_tracking')
      .insert({
        user_id: userId,
        feature_type: featureType,
        usage_count: 1,
        period_start: periodStart,
        period_end: periodEnd
      });
    
    if (error) {
      console.error('Error creating usage record:', error);
      throw error;
    }
  }
};

export const checkUsageLimit = async (
  userId: string, 
  featureType: string, 
  planType: string,
  inputMethod?: 'text' | 'photo',
  userEmail?: string
): Promise<{ canUse: boolean; currentUsage: number; limit: number; message?: string }> => {
  
  console.log('🔍 Checking usage limit:', { userId, featureType, planType, inputMethod, userEmail });
  
  // Специальная проверка для премиум пользователя hoaandrey@gmail.com
  if (userEmail && isPremiumUser(userEmail)) {
    console.log('🎯 Premium user detected:', userEmail, 'giving unlimited access');
    return {
      canUse: true,
      currentUsage: 0,
      limit: 999,
      message: 'Премиум пользователь - неограниченный доступ'
    };
  }
  
  // Для анализов - проверяем общий лимит
  if (featureType === 'lab_analyses' || featureType === 'photo_lab_analyses') {
    if (planType === 'premium') {
      // Премиум план: 15 анализов в месяц (общий лимит)
      const totalUsage = await getTotalAnalysisUsage(userId);
      const limit = 15;
      
      console.log('📊 Premium analysis usage:', { totalUsage, limit, canUse: totalUsage < limit });
      
      return {
        canUse: totalUsage < limit,
        currentUsage: totalUsage,
        limit,
        message: `Использовано ${totalUsage} из ${limit} анализов в месяц`
      };
    } else {
      // Базовый план: 1 анализ в месяц (общий лимит)
      const totalUsage = await getTotalAnalysisUsage(userId);
      const limit = 1;
      
      console.log('📊 Basic analysis usage:', { totalUsage, limit, canUse: totalUsage < limit });
      
      return {
        canUse: totalUsage < limit,
        currentUsage: totalUsage,
        limit,
        message: `Использовано ${totalUsage} из ${limit} анализов в месяц`
      };
    }
  }
  
  // Для чата с AI-доктором
  if (featureType === 'chat_messages') {
    const currentUsage = await getCurrentMonthUsage(userId, featureType);
    let limit = 0;
    
    if (planType === 'premium') {
      limit = 199; // Премиум план: 199 сообщений
    } else {
      limit = 99; // Базовый план: 99 сообщений
    }
    
    console.log('💬 Chat usage:', { currentUsage, limit, canUse: currentUsage < limit, planType });
    
    return {
      canUse: currentUsage < limit,
      currentUsage,
      limit,
      message: `Использовано ${currentUsage} из ${limit} сообщений в месяц`
    };
  }
  
  // Для других функций - стандартная логика
  const currentUsage = await getCurrentMonthUsage(userId, featureType);
  let limit = 0;
  
  switch (planType) {
    case 'basic':
      limit = 1; // Ограниченный доступ
      break;
    case 'premium':
      limit = 999; // Практически неограниченный доступ
      break;
  }
  
  return {
    canUse: currentUsage < limit,
    currentUsage,
    limit
  };
};

// Функция для проверки доступа к аналитике
export const checkAnalyticsAccess = (planType: string): { canAccess: boolean; message?: string } => {
  console.log('🔍 Checking analytics access for plan:', planType);
  
  if (planType === 'premium') {
    return {
      canAccess: true,
      message: 'Расширенная аналитика доступна в премиум плане'
    };
  } else {
    return {
      canAccess: false,
      message: 'Аналитика доступна только в премиум плане. Обновите подписку для получения доступа.'
    };
  }
};
