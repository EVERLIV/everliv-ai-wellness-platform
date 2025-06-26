
import { supabase } from "@/integrations/supabase/client";
import { HealthProfileData } from "@/types/healthProfile";
import { toast } from "sonner";

export const healthProfileService = {
  async fetchHealthProfile(userId: string): Promise<HealthProfileData | null> {
    console.log('🔍 Fetching health profile for user:', userId);
    
    try {
      const { data, error } = await supabase
        .from('health_profiles')
        .select('profile_data')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('❌ Error fetching health profile:', error);
        if (error.code !== 'PGRST116') { // Not found is ok
          toast.error('Ошибка при загрузке профиля здоровья');
          throw error;
        }
      }

      if (data?.profile_data) {
        console.log('✅ Health profile loaded successfully');
        return data.profile_data as unknown as HealthProfileData;
      }

      console.log('📭 No health profile found for user');
      return null;
    } catch (error) {
      console.error('❌ Unexpected error fetching health profile:', error);
      throw error;
    }
  },

  async saveHealthProfile(healthProfile: HealthProfileData): Promise<boolean> {
    console.log('💾 Starting health profile save process...');
    
    try {
      // Проверяем текущую сессию пользователя
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        console.error('❌ No valid session found:', sessionError);
        toast.error('Сессия истекла. Пожалуйста, войдите в систему снова');
        return false;
      }

      const userId = sessionData.session.user.id;
      console.log('💾 Saving health profile for user:', userId);
      console.log('📊 Health profile data to save:', healthProfile);

      // Валидируем обязательные поля
      if (!healthProfile.age || !healthProfile.gender || !healthProfile.height || !healthProfile.weight) {
        console.error('❌ Missing required fields in health profile');
        toast.error('Пожалуйста, заполните все обязательные поля');
        return false;
      }

      // Обновляем lastUpdated для лабораторных данных
      if (healthProfile.labResults) {
        healthProfile.labResults.lastUpdated = new Date().toISOString();
      }

      const profilePayload = {
        user_id: userId,
        profile_data: healthProfile as unknown as any,
        updated_at: new Date().toISOString()
      };

      console.log('💾 Saving with payload:', profilePayload);

      const { data, error } = await supabase
        .from('health_profiles')
        .upsert(profilePayload, {
          onConflict: 'user_id'
        })
        .select();

      if (error) {
        console.error('❌ Error saving health profile:', error);
        
        // Специальная обработка ошибки RLS
        if (error.code === '42501' || error.message.includes('row-level security')) {
          console.error('🚫 RLS Policy violation detected');
          
          // Проверяем, что пользователь действительно аутентифицирован
          const { data: userData } = await supabase.auth.getUser();
          console.log('👤 Current authenticated user:', userData.user?.id);
          
          toast.error('Ошибка доступа к данным. Попробуйте выйти и войти в систему снова');
        } else {
          toast.error('Ошибка при сохранении профиля здоровья: ' + error.message);
        }
        return false;
      }

      console.log('✅ Health profile saved successfully:', data);
      toast.success('Профиль здоровья успешно сохранен');
      return true;
    } catch (error) {
      console.error('❌ Unexpected error saving health profile:', error);
      toast.error('Неожиданная ошибка при сохранении профиля');
      return false;
    }
  }
};
