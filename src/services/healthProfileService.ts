
import { supabase } from "@/integrations/supabase/client";
import { HealthProfileData } from "@/types/healthProfile";
import { toast } from "sonner";

export const healthProfileService = {
  async fetchHealthProfile(userId: string): Promise<HealthProfileData | null> {
    console.log('🔍 Fetching health profile for user:', userId);
    
    try {
      // Проверяем сессию перед запросом
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        console.error('❌ No valid session for health profile fetch:', sessionError);
        throw new Error('Сессия истекла. Пожалуйста, войдите в систему снова');
      }

      if (sessionData.session.user.id !== userId) {
        console.error('❌ User ID mismatch in session');
        throw new Error('Ошибка аутентификации');
      }

      console.log('✅ Valid session found, fetching profile data...');

      const { data, error } = await supabase
        .from('health_profiles')
        .select('profile_data')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('❌ Database error fetching health profile:', error);
        if (error.code === 'PGRST116') {
          console.log('📭 No health profile found for user (not an error)');
          return null;
        }
        
        // Более детальная обработка ошибок RLS
        if (error.code === '42501' || error.message.includes('row-level security')) {
          console.error('🚫 RLS Policy violation during fetch');
          throw new Error('Нет доступа к данным профиля');
        }
        
        throw new Error(`Ошибка базы данных: ${error.message}`);
      }

      if (data?.profile_data) {
        console.log('✅ Health profile loaded successfully');
        return data.profile_data as unknown as HealthProfileData;
      }

      console.log('📭 No health profile found for user');
      return null;
    } catch (error) {
      console.error('❌ Unexpected error fetching health profile:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Неожиданная ошибка при загрузке профиля');
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

      console.log('💾 Saving with payload structure ready');

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
          toast.error('Ошибка доступа к данным. Попробуйте выйти и войти в систему снова');
        } else if (error.code === '23505') {
          console.error('🔄 Duplicate key error, trying update...');
          // Попробуем обновить существующую запись
          const { error: updateError } = await supabase
            .from('health_profiles')
            .update({ profile_data: healthProfile })
            .eq('user_id', userId);
            
          if (updateError) {
            console.error('❌ Update also failed:', updateError);
            toast.error('Ошибка при обновлении профиля');
            return false;
          }
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
