
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { HealthGoal } from '@/types/recommendations';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useHealthGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<HealthGoal[]>([]);
  const [activeGoal, setActiveGoal] = useState<HealthGoal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGoals = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('user_health_goals')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const healthGoals: HealthGoal[] = (data || []).map(goal => ({
          id: goal.id,
          user_id: goal.user_id,
          title: `Цель здоровья (${goal.goal_type})`,
          description: 'Персональная цель здоровья',
          category: 'health',
          is_active: goal.is_active,
          is_completed: false,
          created_at: goal.created_at,
          updated_at: goal.updated_at,
          progress_percentage: 0,
          target_weight: goal.target_weight,
          target_steps: goal.target_steps,
          target_exercise_minutes: goal.target_exercise_minutes,
          target_sleep_hours: goal.target_sleep_hours,
          target_water_intake: goal.target_water_intake,
          target_stress_level: goal.target_stress_level,
          goal_type: goal.goal_type,
          start_date: goal.start_date,
          end_date: goal.end_date
        }));

        setGoals(healthGoals);
        setActiveGoal(healthGoals.find(g => g.is_active) || null);
      } catch (error) {
        console.error('Error loading goals:', error);
        setGoals([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadGoals();
  }, [user]);

  const saveGoal = async (goalData: any) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_health_goals')
        .insert({
          user_id: user.id,
          ...goalData
        });

      if (error) throw error;

      toast.success('Цель сохранена');
      // Reload goals
      const { data } = await supabase
        .from('user_health_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        const healthGoals: HealthGoal[] = data.map(goal => ({
          id: goal.id,
          user_id: goal.user_id,
          title: `Цель здоровья (${goal.goal_type})`,
          description: 'Персональная цель здоровья',
          category: 'health',
          is_active: goal.is_active,
          is_completed: false,
          created_at: goal.created_at,
          updated_at: goal.updated_at,
          progress_percentage: 0,
          target_weight: goal.target_weight,
          target_steps: goal.target_steps,
          target_exercise_minutes: goal.target_exercise_minutes,
          target_sleep_hours: goal.target_sleep_hours,
          target_water_intake: goal.target_water_intake,
          target_stress_level: goal.target_stress_level,
          goal_type: goal.goal_type,
          start_date: goal.start_date,
          end_date: goal.end_date
        }));

        setGoals(healthGoals);
        setActiveGoal(healthGoals.find(g => g.is_active) || null);
      }

      return true;
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error('Ошибка сохранения цели');
      return false;
    }
  };

  const deactivateGoal = async (goalId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_health_goals')
        .update({ is_active: false })
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Цель деактивирована');
      setGoals(prev => prev.map(g => g.id === goalId ? { ...g, is_active: false } : g));
      setActiveGoal(null);
      return true;
    } catch (error) {
      console.error('Error deactivating goal:', error);
      toast.error('Ошибка деактивации цели');
      return false;
    }
  };

  return {
    goals,
    activeGoal,
    isLoading,
    setGoals,
    setActiveGoal,
    saveGoal,
    deactivateGoal
  };
};
