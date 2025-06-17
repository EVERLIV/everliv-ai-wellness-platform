
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
}

export const useHealthGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<HealthGoal[]>([]);
  const [activeGoal, setActiveGoal] = useState<HealthGoal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user]);

  const loadGoals = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_health_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setGoals(data || []);
      const active = data?.find(goal => goal.is_active);
      setActiveGoal(active || null);
    } catch (error) {
      console.error('Error loading goals:', error);
      toast.error('Ошибка загрузки целей');
    } finally {
      setIsLoading(false);
    }
  };

  const saveGoal = async (goalData: Partial<HealthGoal>) => {
    if (!user) return false;

    try {
      // Деактивируем все текущие цели если создаем новую активную
      if (goalData.is_active) {
        await supabase
          .from('user_health_goals')
          .update({ is_active: false })
          .eq('user_id', user.id);
      }

      const dataToSave = {
        user_id: user.id,
        ...goalData,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('user_health_goals')
        .upsert(dataToSave)
        .select()
        .single();

      if (error) throw error;
      
      await loadGoals();
      toast.success('Цель сохранена');
      return true;
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error('Ошибка сохранения цели');
      return false;
    }
  };

  const deactivateGoal = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from('user_health_goals')
        .update({ is_active: false })
        .eq('id', goalId);

      if (error) throw error;
      
      await loadGoals();
      toast.success('Цель деактивирована');
    } catch (error) {
      console.error('Error deactivating goal:', error);
      toast.error('Ошибка деактивации цели');
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
