
import { useState, useEffect } from 'react';
import { useSmartAuth } from './useSmartAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface HealthGoal {
  id?: string;
  user_id: string;
  goal_type: string;
  title: string;
  description?: string;
  target_value?: number;
  current_value?: number;
  unit?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  start_date: string;
  target_date?: string;
  is_active: boolean;
  is_custom: boolean;
  progress_percentage: number;
  created_at?: string;
  updated_at?: string;
}

// Database table structure from user_health_goals
interface DatabaseHealthGoal {
  id: string;
  user_id: string;
  target_weight?: number;
  target_steps: number;
  target_exercise_minutes: number;
  target_sleep_hours: number;
  target_water_intake: number;
  target_stress_level: number;
  goal_type: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Transform database record to HealthGoal interface
const transformDatabaseGoal = (dbGoal: DatabaseHealthGoal): HealthGoal => {
  let title = 'Custom Health Goal';
  let category = 'fitness';
  let target_value = 0;
  let unit = '';

  // Determine title, category, and target based on goal_type
  if (dbGoal.target_steps > 0) {
    title = `Walk ${dbGoal.target_steps} steps daily`;
    category = 'fitness';
    target_value = dbGoal.target_steps;
    unit = 'steps';
  } else if (dbGoal.target_exercise_minutes > 0) {
    title = `Exercise ${dbGoal.target_exercise_minutes} minutes daily`;
    category = 'fitness';
    target_value = dbGoal.target_exercise_minutes;
    unit = 'minutes';
  } else if (dbGoal.target_sleep_hours > 0) {
    title = `Sleep ${dbGoal.target_sleep_hours} hours daily`;
    category = 'sleep';
    target_value = dbGoal.target_sleep_hours;
    unit = 'hours';
  } else if (dbGoal.target_water_intake > 0) {
    title = `Drink ${dbGoal.target_water_intake} glasses of water daily`;
    category = 'nutrition';
    target_value = dbGoal.target_water_intake;
    unit = 'glasses';
  } else if (dbGoal.target_weight) {
    title = `Reach target weight of ${dbGoal.target_weight}kg`;
    category = 'fitness';
    target_value = dbGoal.target_weight;
    unit = 'kg';
  }

  return {
    id: dbGoal.id,
    user_id: dbGoal.user_id,
    goal_type: dbGoal.goal_type,
    title,
    description: `${dbGoal.goal_type} health goal`,
    target_value,
    current_value: 0,
    unit,
    category,
    priority: 'medium',
    start_date: dbGoal.start_date,
    target_date: dbGoal.end_date,
    is_active: dbGoal.is_active,
    is_custom: false,
    progress_percentage: 0,
    created_at: dbGoal.created_at,
    updated_at: dbGoal.updated_at,
  };
};

export const useHealthGoals = () => {
  const { user } = useSmartAuth();
  const [goals, setGoals] = useState<HealthGoal[]>([]);
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
      
      // Transform database goals to our HealthGoal interface
      const transformedGoals = (data || []).map(transformDatabaseGoal);
      setGoals(transformedGoals);
    } catch (error) {
      console.error('Error loading health goals:', error);
      toast.error('Ошибка загрузки целей');
    } finally {
      setIsLoading(false);
    }
  };

  const createGoal = async (goalData: Omit<HealthGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return false;

    try {
      // Transform our HealthGoal data to database format
      const dbData = {
        user_id: user.id,
        goal_type: goalData.goal_type,
        target_steps: goalData.category === 'fitness' && goalData.goal_type === 'steps' ? goalData.target_value || 0 : 10000,
        target_exercise_minutes: goalData.category === 'fitness' && goalData.goal_type === 'exercise' ? goalData.target_value || 0 : 30,
        target_sleep_hours: goalData.category === 'sleep' ? goalData.target_value || 0 : 8,
        target_water_intake: goalData.category === 'nutrition' && goalData.goal_type === 'water' ? goalData.target_value || 0 : 8,
        target_stress_level: goalData.category === 'mental' ? goalData.target_value || 0 : 3,
        target_weight: goalData.category === 'fitness' && goalData.goal_type === 'weight' ? goalData.target_value : undefined,
        start_date: goalData.start_date,
        end_date: goalData.target_date,
        is_active: goalData.is_active,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('user_health_goals')
        .insert(dbData)
        .select()
        .single();

      if (error) throw error;
      
      // Transform the returned data back to HealthGoal format
      const newGoal = transformDatabaseGoal(data);
      setGoals(prev => [newGoal, ...prev]);
      toast.success('Цель создана успешно');
      return true;
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Ошибка создания цели');
      return false;
    }
  };

  const updateGoal = async (goalId: string, updates: Partial<HealthGoal>) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('user_health_goals')
        .update({
          updated_at: new Date().toISOString()
        })
        .eq('id', goalId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      const updatedGoal = transformDatabaseGoal(data);
      setGoals(prev => prev.map(goal => 
        goal.id === goalId ? { ...goal, ...updatedGoal } : goal
      ));
      toast.success('Цель обновлена');
      return true;
    } catch (error) {
      console.error('Error updating goal:', error);
      toast.error('Ошибка обновления цели');
      return false;
    }
  };

  const deleteGoal = async (goalId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_health_goals')
        .delete()
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
      toast.success('Цель удалена');
      return true;
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Ошибка удаления цели');
      return false;
    }
  };

  const updateProgress = async (goalId: string, currentValue: number) => {
    if (!user) return false;

    const goal = goals.find(g => g.id === goalId);
    if (!goal) return false;

    const progressPercentage = goal.target_value ? 
      Math.min(100, Math.round((currentValue / goal.target_value) * 100)) : 0;

    return await updateGoal(goalId, { 
      current_value: currentValue, 
      progress_percentage: progressPercentage 
    });
  };

  // Computed values for compatibility
  const activeGoal = goals.find(goal => goal.is_active) || null;
  const saveGoal = createGoal;
  
  const deactivateGoal = async (goalId: string) => {
    return await updateGoal(goalId, { is_active: false });
  };

  return {
    goals,
    activeGoal,
    isLoading,
    createGoal,
    updateGoal,
    deleteGoal,
    updateProgress,
    saveGoal,
    deactivateGoal,
    loadGoals
  };
};
