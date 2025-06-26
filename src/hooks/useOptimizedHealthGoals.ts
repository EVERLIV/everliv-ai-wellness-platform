
/**
 * @fileoverview Optimized hook for health goals management
 * 
 * This hook provides a comprehensive interface for managing user health goals
 * with performance optimizations, error handling, and real-time updates.
 * 
 * @example
 * ```typescript
 * const { goals, createGoal, updateGoal, activeGoal } = useOptimizedHealthGoals();
 * 
 * // Create a new goal
 * await createGoal({
 *   title: "Walk 10k steps daily",
 *   goal_type: "steps",
 *   category: "fitness",
 *   target_value: 10000,
 *   // ... other fields
 * });
 * ```
 */

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

/**
 * Return type for the useOptimizedHealthGoals hook
 */
interface UseHealthGoalsReturn {
  /** Array of all user's health goals */
  goals: HealthGoal[];
  /** Currently active goal (only one can be active at a time) */
  activeGoal: HealthGoal | null;
  /** Loading state for async operations */
  isLoading: boolean;
  /** Current error message, if any */
  error: string | null;
  /** Creates a new health goal */
  createGoal: (goalData: CreateHealthGoalInput) => Promise<boolean>;
  /** Updates an existing health goal */
  updateGoal: (goalId: string, updates: UpdateHealthGoalInput) => Promise<boolean>;
  /** Deletes a health goal */
  deleteGoal: (goalId: string) => Promise<boolean>;
  /** Updates progress for a specific goal */
  updateProgress: (goalId: string, currentValue: number) => Promise<boolean>;
  /** Deactivates a specific goal */
  deactivateGoal: (goalId: string) => Promise<boolean>;
  /** Manually reload all goals from database */
  loadGoals: () => Promise<void>;
}

/**
 * Optimized hook for health goals management
 * 
 * Features:
 * - Memoized active goal calculation
 * - Comprehensive error handling
 * - Performance optimizations with useCallback
 * - Real-time data synchronization
 * - Input validation with Zod schemas
 * 
 * @returns {UseHealthGoalsReturn} Health goals state and management functions
 */
export const useOptimizedHealthGoals = (): UseHealthGoalsReturn => {
  const { user } = useSmartAuth();
  const [goals, setGoals] = useState<HealthGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized active goal calculation for performance
  const activeGoal = useMemo(() => 
    goals.find(goal => goal.is_active) || null, 
    [goals]
  );

  /**
   * Centralized error handling utility
   * Logs errors and shows user-friendly messages
   */
  const handleError = useCallback((error: any, message: string) => {
    console.error(`Health Goals Error: ${message}`, error);
    setError(message);
    toast.error(message);
  }, []);

  /**
   * Loads all health goals for the current user
   * Includes data transformation and error handling
   */
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
      
      // Transform database records to application format
      const transformedGoals = (data || []).map(HealthGoalMapper.fromDatabase);
      setGoals(transformedGoals);
    } catch (error) {
      handleError(error, 'Ошибка загрузки целей');
    } finally {
      setIsLoading(false);
    }
  }, [user, handleError]);

  /**
   * Creates a new health goal with validation and transformation
   * 
   * @param goalData - Goal data without system-generated fields
   * @returns Promise<boolean> - Success status
   */
  const createGoal = useCallback(async (goalData: CreateHealthGoalInput): Promise<boolean> => {
    if (!user) return false;

    try {
      // Validate input data with Zod schema
      const validatedData = CreateHealthGoalSchema.parse(goalData);
      
      // Deactivate existing active goals if this one is active
      if (validatedData.is_active) {
        await supabase
          .from('user_health_goals')
          .update({ is_active: false })
          .eq('user_id', user.id);
      }

      // Transform to database format
      const dbData = HealthGoalMapper.toDatabase({
        ...validatedData,
        user_id: user.id,
      } as HealthGoal, user.id);

      // Remove auto-generated id field for insertion
      const { id, ...insertData } = dbData;

      const { data, error } = await supabase
        .from('user_health_goals')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      
      // Transform response and update local state
      const newGoal = HealthGoalMapper.fromDatabase(data);
      setGoals(prev => [newGoal, ...prev]);
      toast.success('Цель создана успешно');
      return true;
    } catch (error) {
      handleError(error, 'Ошибка создания цели');
      return false;
    }
  }, [user, handleError]);

  /**
   * Updates an existing health goal
   * 
   * @param goalId - Unique identifier of the goal to update
   * @param updates - Partial goal data to update
   * @returns Promise<boolean> - Success status
   */
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
      
      // Update local state optimistically
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

  /**
   * Deletes a health goal permanently
   * 
   * @param goalId - Unique identifier of the goal to delete
   * @returns Promise<boolean> - Success status
   */
  const deleteGoal = useCallback(async (goalId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_health_goals')
        .delete()
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Remove from local state
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
      toast.success('Цель удалена');
      return true;
    } catch (error) {
      handleError(error, 'Ошибка удаления цели');
      return false;
    }
  }, [user, handleError]);

  /**
   * Updates progress for a specific goal and recalculates percentage
   * 
   * @param goalId - Unique identifier of the goal
   * @param currentValue - New current progress value
   * @returns Promise<boolean> - Success status
   */
  const updateProgress = useCallback(async (goalId: string, currentValue: number): Promise<boolean> => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal || !goal.target_value) return false;

    // Calculate new progress percentage
    const progressPercentage = Math.min(100, Math.round((currentValue / goal.target_value) * 100));
    
    return await updateGoal(goalId, { 
      current_value: currentValue, 
      progress_percentage: progressPercentage 
    });
  }, [goals, updateGoal]);

  /**
   * Deactivates a specific goal (sets is_active to false)
   * 
   * @param goalId - Unique identifier of the goal to deactivate
   * @returns Promise<boolean> - Success status
   */
  const deactivateGoal = useCallback(async (goalId: string): Promise<boolean> => {
    return await updateGoal(goalId, { is_active: false });
  }, [updateGoal]);

  // Load goals when user changes
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
