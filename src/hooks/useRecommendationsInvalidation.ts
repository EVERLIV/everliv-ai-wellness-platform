import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Хук для отслеживания изменений, которые должны инвалидировать кэш рекомендаций
export const useRecommendationsInvalidation = () => {
  const { user } = useAuth();
  const previousAnalysesCount = useRef<number>(0);
  const previousHealthGoals = useRef<string[]>([]);

  // Функция для инвалидации кэша рекомендаций
  const invalidateRecommendationsCache = async (reason: string) => {
    if (!user) return;

    console.log(`🗑️ Invalidating recommendations cache: ${reason}`);
    
    try {
      const { error } = await supabase
        .from('cached_recommendations')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error invalidating cache:', error);
      } else {
        console.log('✅ Recommendations cache invalidated successfully');
      }
    } catch (error) {
      console.error('Unexpected error invalidating cache:', error);
    }
  };

  // Отслеживание изменений в анализах
  useEffect(() => {
    if (!user) return;

    const checkAnalysesChanges = async () => {
      try {
        const { data, error } = await supabase
          .from('medical_analyses')
          .select('id')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error checking analyses count:', error);
          return;
        }

        const currentCount = data?.length || 0;
        
        if (previousAnalysesCount.current > 0 && currentCount !== previousAnalysesCount.current) {
          await invalidateRecommendationsCache(`analyses count changed: ${previousAnalysesCount.current} -> ${currentCount}`);
        }
        
        previousAnalysesCount.current = currentCount;
      } catch (error) {
        console.error('Error in checkAnalysesChanges:', error);
      }
    };

    // Проверяем изменения сразу
    checkAnalysesChanges();

    // Подписываемся на изменения в таблице medical_analyses
    const analysesChannel = supabase
      .channel('analyses-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'medical_analyses',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('📊 Medical analyses changed:', payload);
          invalidateRecommendationsCache('new medical analysis added');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(analysesChannel);
    };
  }, [user]);

  // Отслеживание изменений в целях здоровья
  useEffect(() => {
    if (!user) return;

    const checkHealthGoalsChanges = async () => {
      try {
        const { data, error } = await supabase
          .from('health_profiles')
          .select('profile_data')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking health goals:', error);
          return;
        }

        const healthGoals = data?.profile_data?.healthGoals || [];
        const currentGoalsString = JSON.stringify(healthGoals.sort());
        const previousGoalsString = JSON.stringify(previousHealthGoals.current.sort());
        
        if (previousHealthGoals.current.length > 0 && currentGoalsString !== previousGoalsString) {
          await invalidateRecommendationsCache(`health goals changed: ${previousGoalsString} -> ${currentGoalsString}`);
        }
        
        previousHealthGoals.current = healthGoals;
      } catch (error) {
        console.error('Error in checkHealthGoalsChanges:', error);
      }
    };

    // Проверяем изменения сразу
    checkHealthGoalsChanges();

    // Подписываемся на изменения в таблице health_profiles
    const profilesChannel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'health_profiles',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('👤 Health profile changed:', payload);
          // Проверяем изменения через небольшую задержку, чтобы данные успели обновиться
          setTimeout(checkHealthGoalsChanges, 500);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profilesChannel);
    };
  }, [user]);

  return {
    invalidateRecommendationsCache
  };
};