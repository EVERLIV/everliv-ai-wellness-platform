
import { supabase } from "@/integrations/supabase/client";

export const fetchHealthProfileData = async (userId: string) => {
  const { data, error } = await supabase
    .from('health_profiles')
    .select('profile_data')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching health profile:', error);
    throw new Error('Ошибка загрузки профиля здоровья');
  }

  if (!data?.profile_data) {
    throw new Error('Профиль здоровья не найден');
  }

  return data.profile_data;
};

export const fetchAnalysesData = async (userId: string) => {
  const { data, error } = await supabase
    .from('medical_analyses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching analyses:', error);
    return [];
  }

  return (data || []).map(analysis => ({
    created_at: analysis.created_at,
    results: analysis.results as any
  }));
};

export const fetchChatsData = async (userId: string) => {
  const { data, error } = await supabase
    .from('ai_doctor_chats')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching chats:', error);
    return [];
  }

  return (data || []).map(chat => ({
    created_at: chat.created_at,
    title: chat.title
  }));
};

export const saveAnalyticsToDatabase = async (userId: string, analytics: any) => {
  const { error } = await supabase
    .from('user_analytics')
    .upsert({
      user_id: userId,
      analytics_data: analytics as any,
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error saving analytics:', error);
  }

  return !error;
};
