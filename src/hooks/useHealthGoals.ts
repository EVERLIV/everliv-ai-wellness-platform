
import { useState, useEffect } from 'react';
import { useOptimizedHealthGoals } from './useOptimizedHealthGoals';
import { HealthGoal, CreateHealthGoalInput } from '@/types/healthGoals';
import { toast } from 'sonner';

export { type HealthGoal } from '@/types/healthGoals';

export const useHealthGoals = () => {
  const { goals, isLoading, createGoal, updateGoal, deleteGoal, refetch } = useOptimizedHealthGoals();
  const [localGoals, setLocalGoals] = useState<HealthGoal[]>([]);

  useEffect(() => {
    setLocalGoals(goals);
  }, [goals]);

  // Find active goal
  const activeGoal = localGoals.find(goal => goal.is_active) || null;

  const updateProgress = async (goalId: string, progress: number) => {
    try {
      // В данном случае мы просто обновляем локальное состояние
      // так как у нас нет API для обновления прогресса
      setLocalGoals(prevGoals => 
        prevGoals.map(goal => 
          goal.id === goalId 
            ? { ...goal, progress_percentage: Math.min(100, Math.max(0, progress)) }
            : goal
        )
      );
      toast.success('Прогресс обновлен');
    } catch (error) {
      toast.error('Ошибка обновления прогресса');
    }
  };

  const deactivateGoal = async (goalId: string) => {
    try {
      await deleteGoal(goalId);
      toast.success('Цель деактивирована');
    } catch (error) {
      toast.error('Ошибка деактивации цели');
    }
  };

  return {
    goals: localGoals,
    activeGoal,
    isLoading,
    updateProgress,
    createGoal,
    deactivateGoal,
    refetch
  };
};
