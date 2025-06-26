
import { supabase } from "@/integrations/supabase/client";
import { HealthProfileData } from "@/types/healthProfile";
import { toast } from "sonner";

export const healthProfileService = {
  async fetchHealthProfile(userId: string): Promise<HealthProfileData | null> {
    console.log('Fetching health profile for user:', userId);
    
    const { data, error } = await supabase
      .from('health_profiles')
      .select('profile_data')
      .eq('user_id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching health profile:', error);
      toast.error('Ошибка при загрузке профиля здоровья');
      throw error;
    }

    if (data?.profile_data) {
      console.log('Health profile loaded successfully');
      return data.profile_data as unknown as HealthProfileData;
    }

    console.log('No health profile found for user');
    return null;
  },

  async saveHealthProfile(healthProfile: HealthProfileData): Promise<boolean> {
    // Проверяем текущую сессию пользователя
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      console.error('No valid session found:', sessionError);
      toast.error('Сессия истекла. Пожалуйста, войдите в систему снова');
      return false;
    }

    console.log('Session is valid, user ID from session:', sessionData.session.user.id);
    console.log('Saving health profile for user:', sessionData.session.user.id);
    console.log('Health profile data:', healthProfile);

    // Обновляем lastUpdated для лабораторных данных
    if (healthProfile.labResults) {
      healthProfile.labResults.lastUpdated = new Date().toISOString();
    }

    const profilePayload = {
      user_id: sessionData.session.user.id,
      profile_data: healthProfile as unknown as any,
      updated_at: new Date().toISOString()
    };

    console.log('Saving with payload:', profilePayload);

    const { data, error } = await supabase
      .from('health_profiles')
      .upsert(profilePayload, {
        onConflict: 'user_id'
      })
      .select();

    if (error) {
      console.error('Error saving health profile:', error);
      
      // Специальная обработка ошибки RLS
      if (error.code === '42501' || error.message.includes('row-level security')) {
        console.error('RLS Policy violation detected');
        
        // Проверяем, что пользователь действительно аутентифицирован
        const { data: userData } = await supabase.auth.getUser();
        console.log('Current authenticated user:', userData.user?.id);
        
        toast.error('Ошибка доступа к данным. Попробуйте выйти и войти в систему снова');
      } else {
        toast.error('Ошибка при сохранении профиля здоровья: ' + error.message);
      }
      return false;
    }

    console.log('Health profile saved successfully:', data);
    toast.success('Профиль здоровья успешно сохранен');
    return true;
  }
};
