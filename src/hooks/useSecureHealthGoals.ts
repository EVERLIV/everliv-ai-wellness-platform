
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface HealthGoal {
  id?: string;
  user_id: string;
  target_weight?: number;
  target_steps: number;
  target_exercise_minutes: number;
  target_sleep_hours: number;
  target_water_intake: number;
  target_stress_level: number;
  goal_type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  start_date: string;
  end_date?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  // Дополнительные поля для совместимости с компонентами
  progress_percentage?: number;
}

export const useSecureHealthGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<HealthGoal[]>([]);
  const [activeGoal, setActiveGoal] = useState<HealthGoal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadGoals();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadGoals = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      console.log('Loading health goals for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_health_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading goals:', error);
        throw error;
      }
      
      console.log('Loaded goals:', data);
      
      // Преобразуем данные и добавляем progress_percentage
      const goalsWithProgress = (data || []).map(goal => ({
        ...goal,
        progress_percentage: Math.floor(Math.random() * 100) // Временно рандомный прогресс
      }));
      
      setGoals(goalsWithProgress);
      const active = goalsWithProgress.find(goal => goal.is_active);
      setActiveGoal(active || null);

    } catch (error) {
      console.error('Error loading goals:', error);
      toast.error('Ошибка загрузки целей');
    } finally {
      setIsLoading(false);
    }
  };

  const saveGoal = async (goalData: Partial<HealthGoal>) => {
    if (!user) {
      toast.error('Необходима авторизация');
      return false;
    }

    try {
      console.log('Saving goal with data:', goalData);
      
      // Деактивируем все текущие цели если создаем новую активную
      if (goalData.is_active !== false) {
        const { error: deactivateError } = await supabase
          .from('user_health_goals')
          .update({ is_active: false })
          .eq('user_id', user.id);
          
        if (deactivateError) {
          console.error('Error deactivating existing goals:', deactivateError);
        }
      }

      const dataToSave = {
        user_id: user.id,
        target_steps: goalData.target_steps || 10000,
        target_exercise_minutes: goalData.target_exercise_minutes || 30,
        target_sleep_hours: goalData.target_sleep_hours || 8.0,
        target_water_intake: goalData.target_water_intake || 8.0,
        target_stress_level: goalData.target_stress_level || 3,
        goal_type: goalData.goal_type || 'monthly',
        start_date: new Date().toISOString().split('T')[0],
        end_date: goalData.end_date || null,
        is_active: true,
        target_weight: goalData.target_weight || null
      };

      console.log('Data to save:', dataToSave);

      const { data, error } = await supabase
        .from('user_health_goals')
        .insert(dataToSave)
        .select()
        .single();

      if (error) {
        console.error('Error saving goal:', error);
        throw error;
      }
      
      console.log('Goal saved successfully:', data);
      await loadGoals();
      toast.success('Цель сохранена');
      return true;
    } catch (error: any) {
      console.error('Error saving goal:', error);
      toast.error(error.message || 'Ошибка сохранения цели');
      return false;
    }
  };

  const deactivateGoal = async (goalId: string) => {
    if (!user) return;

    try {
      console.log('Deactivating goal:', goalId);
      
      const { error } = await supabase
        .from('user_health_goals')
        .update({ is_active: false })
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deactivating goal:', error);
        throw error;
      }
      
      await loadGoals();
      toast.success('Цель деактивирована');
    } catch (error: any) {
      console.error('Error deactivating goal:', error);
      toast.error(error.message || 'Ошибка деактивации цели');
    }
  };

  return {
    goals,
    activeGoal,
    isLoading,
    saveGoal,
    deactivateGoal,
    loadGoals
  };
};
