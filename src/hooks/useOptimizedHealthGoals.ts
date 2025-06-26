
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSmartAuth } from './useSmartAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  HealthGoal, 
  CreateHealthGoalInput, 
  UpdateHealthGoalInput, 
  HealthGoalSchema,
  CreateHealthGoalSchema 
} from '@/types/healthGoals';
import { HealthGoalMapper } from '@/utils/healthGoals';

interface UseHealthGoalsReturn {
  goals: HealthGoal[];
  activeGoal: HealthGoal | null;
  isLoading: boolean;
  error: string | null;
  createGoal: (goalData: CreateHealthGoalInput) => Promise<boolean>;
  updateGoal: (goalId: string, updates: UpdateHealthGoalInput) => Promise<boolean>;
  deleteGoal: (goalId: string) => Promise<boolean>;
  updateProgress: (goalId: string, currentValue: number) => Promise<boolean>;
  deactivateGoal: (goalId: string) => Promise<boolean>;
  loadGoals: () => Promise<void>;
}

export const useOptimizedHealthGoals = (): UseHealthGoalsReturn => {
  const { user } = useSmartAuth();
  const [goals, setGoals] = useState<HealthGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized active goal
  const activeGoal = useMemo(() => 
    goals.find(goal => goal.is_active) || null, 
    [goals]
  );

  const handleError = useCallback((error: any, message: string) => {
    console.error(`Health Goals Error: ${message}`, error);
    setError(message);
    toast.error(message);
  }, []);

  const loadGoals = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('user_health_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      const transformedGoals = (data || []).map(HealthGoalMapper.fromDatabase);
      setGoals(transformedGoals);
    } catch (error) {
      handleError(error, 'Ошибка загрузки целей');
    } finally {
      setIsLoading(false);
    }
  }, [user, handleError]);

  const createGoal = useCallback(async (goalData: CreateHealthGoalInput): Promise<boolean> => {
    if (!user) return false;

    try {
      // Validate input
      const validatedData = CreateHealthGoalSchema.parse(goalData);
      
      // Deactivate current goals if this one is active
      if (validatedData.is_active) {
        await supabase
          .from('user_health_goals')
          .update({ is_active: false })
          .eq('user_id', user.id);
      }

      const dbData = HealthGoalMapper.toDatabase({
        ...validatedData,
        user_id: user.id,
      } as HealthGoal, user.id);

      // Remove the id field for insert since it will be auto-generated
      const { id, ...insertData } = dbData;

      const { data, error } = await supabase
        .from('user_health_goals')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      
      const newGoal = HealthGoalMapper.fromDatabase(data);
      setGoals(prev => [newGoal, ...prev]);
      toast.success('Цель создана успешно');
      return true;
    } catch (error) {
      handleError(error, 'Ошибка создания цели');
      return false;
    }
  }, [user, handleError]);

  const updateGoal = useCallback(async (goalId: string, updates: UpdateHealthGoalInput): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_health_goals')
        .update({ 
          ...updates,
          updated_at: new Date().toISOString() 
        })
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setGoals(prev => prev.map(goal => 
        goal.id === goalId ? { ...goal, ...updates } : goal
      ));
      toast.success('Цель обновлена');
      return true;
    } catch (error) {
      handleError(error, 'Ошибка обновления цели');
      return false;
    }
  }, [user, handleError]);

  const deleteGoal = useCallback(async (goalId: string): Promise<boolean> => {
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
      handleError(error, 'Ошибка удаления цели');
      return false;
    }
  }, [user, handleError]);

  const updateProgress = useCallback(async (goalId: string, currentValue: number): Promise<boolean> => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal || !goal.target_value) return false;

    const progressPercentage = Math.min(100, Math.round((currentValue / goal.target_value) * 100));
    
    return await updateGoal(goalId, { 
      current_value: currentValue, 
      progress_percentage: progressPercentage 
    });
  }, [goals, updateGoal]);

  const deactivateGoal = useCallback(async (goalId: string): Promise<boolean> => {
    return await updateGoal(goalId, { is_active: false });
  }, [updateGoal]);

  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user, loadGoals]);

  return {
    goals,
    activeGoal,
    isLoading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    updateProgress,
    deactivateGoal,
    loadGoals
  };
};
