
import { useState, useEffect } from 'react';
import { useSecureHealthGoals, HealthGoal } from './useSecureHealthGoals';
import { toast } from 'sonner';

export { type HealthGoal } from './useSecureHealthGoals';

export const useHealthGoals = () => {
  const { goals, isLoading, loadGoals, deactivateGoal } = useSecureHealthGoals();
  const [localGoals, setLocalGoals] = useState<HealthGoal[]>([]);

  useEffect(() => {
    setLocalGoals(goals);
  }, [goals]);

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

  const deleteGoal = async (goalId: string) => {
    try {
      await deactivateGoal(goalId);
      toast.success('Цель удалена');
    } catch (error) {
      toast.error('Ошибка удаления цели');
    }
  };

  return {
    goals: localGoals,
    isLoading,
    updateProgress,
    deleteGoal,
    refetch: loadGoals
  };
};
