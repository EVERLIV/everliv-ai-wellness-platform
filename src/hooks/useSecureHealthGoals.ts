
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SecurityUtils } from '@/utils/securityUtils';
import { InputSanitizer } from '@/utils/inputSanitizer';

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

export const useSecureHealthGoals = () => {
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
      // Security: Rate limiting check
      const rateLimitKey = `load_goals_${user.id}`;
      if (!SecurityUtils.checkRateLimit(rateLimitKey, 10, 60000)) {
        throw new Error('Слишком много запросов. Попробуйте позже.');
      }

      const { data, error } = await supabase
        .from('user_health_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Security: Type assertion with validation
      const typedGoals = (data || []) as HealthGoal[];
      
      // Security: Validate each goal
      const validatedGoals = typedGoals.filter(goal => {
        return goal.user_id === user.id && // Ensure user owns the goal
               ['daily', 'weekly', 'monthly', 'yearly'].includes(goal.goal_type);
      });

      setGoals(validatedGoals);
      const active = validatedGoals.find(goal => goal.is_active);
      setActiveGoal(active || null);

      // Security: Audit log
      SecurityUtils.auditLog('load_goals', user.id, { count: validatedGoals.length });
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
      // Security: Rate limiting check
      const rateLimitKey = `save_goal_${user.id}`;
      if (!SecurityUtils.checkRateLimit(rateLimitKey, 5, 60000)) {
        toast.error('Слишком много попыток сохранения. Попробуйте позже.');
        return false;
      }

      // Security: Sanitize and validate goal data
      const sanitizedData = SecurityUtils.sanitizeGoalData(goalData);
      
      // Security: Additional validation
      if (!InputSanitizer.isValidUUID(user.id)) {
        throw new Error('Invalid user ID');
      }

      // Деактивируем все текущие цели если создаем новую активную
      if (goalData.is_active) {
        await supabase
          .from('user_health_goals')
          .update({ is_active: false })
          .eq('user_id', user.id);
      }

      const dataToSave = {
        user_id: user.id,
        ...sanitizedData,
        start_date: new Date().toISOString().split('T')[0],
        is_active: true,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('user_health_goals')
        .upsert(dataToSave)
        .select()
        .single();

      if (error) throw error;
      
      // Security: Audit log
      SecurityUtils.auditLog('save_goal', user.id, { 
        goalType: sanitizedData.goal_type,
        goalId: data.id 
      });
      
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
    if (!user) return;

    try {
      // Security: Validate goal ID
      if (!InputSanitizer.isValidUUID(goalId)) {
        throw new Error('Invalid goal ID');
      }

      // Security: Verify goal ownership before deactivation
      const { data: goalCheck } = await supabase
        .from('user_health_goals')
        .select('user_id')
        .eq('id', goalId)
        .single();

      if (!goalCheck || goalCheck.user_id !== user.id) {
        throw new Error('Unauthorized goal access');
      }

      const { error } = await supabase
        .from('user_health_goals')
        .update({ is_active: false })
        .eq('id', goalId)
        .eq('user_id', user.id); // Double check ownership

      if (error) throw error;
      
      // Security: Audit log
      SecurityUtils.auditLog('deactivate_goal', user.id, { goalId });
      
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
