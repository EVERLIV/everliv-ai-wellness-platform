
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
      
      setGoals(data || []);
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
      const { data, error } = await supabase
        .from('user_health_goals')
        .insert({
          user_id: user.id,
          ...goalData,
          start_date: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      setGoals(prev => [data, ...prev]);
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
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', goalId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setGoals(prev => prev.map(goal => 
        goal.id === goalId ? { ...goal, ...data } : goal
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

  return {
    goals,
    isLoading,
    createGoal,
    updateGoal,
    deleteGoal,
    updateProgress,
    loadGoals
  };
};
