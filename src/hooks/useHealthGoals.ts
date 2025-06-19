
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { HealthGoal } from '@/types/recommendations';

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
        // Пока что возвращаем пустой массив, так как функция целей в разработке
        setGoals([]);
        setActiveGoal(null);
      } catch (error) {
        console.error('Error loading goals:', error);
        setGoals([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadGoals();
  }, [user]);

  return {
    goals,
    activeGoal,
    isLoading,
    setGoals,
    setActiveGoal
  };
};
