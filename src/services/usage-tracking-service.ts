
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

// Новая функция для получения общего использования анализов (текст + фото)
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
  inputMethod?: 'text' | 'photo'
): Promise<{ canUse: boolean; currentUsage: number; limit: number; message?: string }> => {
  
  // Для премиум плана - общий лимит на все анализы
  if (planType === 'premium' && (featureType === 'lab_analyses' || featureType === 'photo_lab_analyses')) {
    const totalUsage = await getTotalAnalysisUsage(userId);
    const limit = 15;
    
    return {
      canUse: totalUsage < limit,
      currentUsage: totalUsage,
      limit,
      message: `Использовано ${totalUsage} из ${limit} анализов в месяц (текст + фото)`
    };
  }
  
  // Для базового плана - раздельные лимиты
  if (planType === 'basic') {
    if (featureType === 'photo_lab_analyses') {
      const photoUsage = await getCurrentMonthUsage(userId, 'photo_lab_analyses');
      const limit = 1;
      return {
        canUse: photoUsage < limit,
        currentUsage: photoUsage,
        limit,
        message: `Использовано ${photoUsage} из ${limit} фото-анализов в месяц`
      };
    }
    
    if (featureType === 'lab_analyses') {
      const textUsage = await getCurrentMonthUsage(userId, 'lab_analyses');
      const limit = 5;
      return {
        canUse: textUsage < limit,
        currentUsage: textUsage,
        limit,
        message: `Использовано ${textUsage} из ${limit} текстовых анализов в месяц`
      };
    }
  }
  
  // Для других функций - стандартная логика
  const currentUsage = await getCurrentMonthUsage(userId, featureType);
  let limit = 0;
  
  switch (planType) {
    case 'basic':
      if (featureType === 'chat_messages') limit = 99;
      break;
    case 'premium':
      if (featureType === 'chat_messages') limit = 199;
      break;
  }
  
  return {
    canUse: currentUsage < limit,
    currentUsage,
    limit
  };
};
