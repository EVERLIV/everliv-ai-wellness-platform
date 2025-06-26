
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface HealthGoal {
  id: string;
  title: string;
  description: string;
  goal_type: string;
  target_value: number;
  progress_percentage: number;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
}

export const useHealthGoals = () => {
  const { user } = useAuth();
  const [activeGoal, setActiveGoal] = useState<HealthGoal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadActiveGoal();
    }
  }, [user]);

  const loadActiveGoal = async () => {
    try {
      // Заглушка для демонстрации - в реальном приложении здесь был бы запрос к API
      const mockGoal: HealthGoal = {
        id: '1',
        title: 'Увеличить активность',
        description: 'Достичь 10,000 шагов в день',
        goal_type: 'steps',
        target_value: 10000,
        progress_percentage: 65,
        status: 'active',
        created_at: new Date().toISOString(),
      };
      
      setActiveGoal(mockGoal);
    } catch (error) {
      console.error('Ошибка загрузки активной цели:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    activeGoal,
    isLoading,
    refetch: loadActiveGoal
  };
};
