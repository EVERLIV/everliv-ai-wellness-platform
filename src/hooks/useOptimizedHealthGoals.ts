
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { HealthGoal, CreateHealthGoalInput, GOAL_TYPE_CONFIG } from '@/types/healthGoals';

export const useOptimizedHealthGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<HealthGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadGoals();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadGoals = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      console.log('Loading health goals for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_health_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading goals:', error);
        throw error;
      }
      
      console.log('Loaded goals:', data);
      
      // Преобразуем данные из базы в формат HealthGoal
      const transformedGoals: HealthGoal[] = (data || []).map(dbGoal => {
        // Определяем тип цели на основе данных
        let goalType: 'steps' | 'exercise' | 'weight' | 'sleep' | 'water' | 'stress' | 'custom' = 'custom';
        let title = 'Пользовательская цель';
        let category: 'fitness' | 'nutrition' | 'sleep' | 'mental' | 'longevity' = 'fitness';
        let targetValue: number | undefined;
        let unit = '';

        // Определяем тип цели на основе заполненных полей
        if (dbGoal.target_steps && dbGoal.target_steps > 0) {
          goalType = 'steps';
          title = 'Ежедневные шаги';
          category = 'fitness';
          targetValue = dbGoal.target_steps;
          unit = 'шагов';
        } else if (dbGoal.target_exercise_minutes && dbGoal.target_exercise_minutes > 0) {
          goalType = 'exercise';
          title = 'Время тренировок';
          category = 'fitness';
          targetValue = dbGoal.target_exercise_minutes;
          unit = 'минут';
        } else if (dbGoal.target_sleep_hours && dbGoal.target_sleep_hours > 0) {
          goalType = 'sleep';
          title = 'Качество сна';
          category = 'sleep';
          targetValue = dbGoal.target_sleep_hours;
          unit = 'часов';
        } else if (dbGoal.target_water_intake && dbGoal.target_water_intake > 0) {
          goalType = 'water';
          title = 'Питьевой режим';
          category = 'nutrition';
          targetValue = dbGoal.target_water_intake;
          unit = 'стаканов';
        } else if (dbGoal.target_weight && dbGoal.target_weight > 0) {
          goalType = 'weight';
          title = 'Целевой вес';
          category = 'fitness';
          targetValue = dbGoal.target_weight;
          unit = 'кг';
        } else if (dbGoal.target_stress_level && dbGoal.target_stress_level > 0) {
          goalType = 'stress';
          title = 'Управление стрессом';
          category = 'mental';
          targetValue = dbGoal.target_stress_level;
          unit = 'уровень';
        }

        return {
          id: dbGoal.id,
          user_id: dbGoal.user_id,
          title,
          description: `Цель создана ${new Date(dbGoal.created_at).toLocaleDateString('ru-RU')}`,
          goal_type: goalType,
          category,
          priority: 'medium' as const,
          target_value: targetValue,
          current_value: 0,
          unit,
          start_date: dbGoal.start_date,
          target_date: dbGoal.end_date || undefined,
          is_active: dbGoal.is_active,
          is_custom: goalType === 'custom',
          progress_percentage: Math.floor(Math.random() * 100), // Временно рандомный прогресс
          created_at: dbGoal.created_at,
          updated_at: dbGoal.updated_at
        };
      });
      
      setGoals(transformedGoals);

    } catch (error) {
      console.error('Error loading goals:', error);
      toast.error('Ошибка загрузки целей');
    } finally {
      setIsLoading(false);
    }
  };

  const createGoal = async (goalData: CreateHealthGoalInput): Promise<boolean> => {
    if (!user) {
      toast.error('Необходима авторизация');
      return false;
    }

    try {
      console.log('Creating goal with data:', goalData);
      
      // Деактивируем все текущие цели если создаем новую активную
      if (goalData.is_active !== false) {
        const { error: deactivateError } = await supabase
          .from('user_health_goals')
          .update({ is_active: false })
          .eq('user_id', user.id);
          
        if (deactivateError) {
          console.error('Error deactivating existing goals:', deactivateError);
        }
      }

      // Подготавливаем данные для базы данных
      const dbData: any = {
        user_id: user.id,
        goal_type: goalData.goal_type || 'monthly',
        start_date: goalData.start_date || new Date().toISOString().split('T')[0],
        end_date: goalData.target_date || null,
        is_active: true,
        target_steps: 0,
        target_exercise_minutes: 0,
        target_sleep_hours: 0,
        target_water_intake: 0,
        target_stress_level: 0,
        target_weight: null
      };

      // Устанавливаем значение в зависимости от типа цели
      const config = GOAL_TYPE_CONFIG[goalData.goal_type as keyof typeof GOAL_TYPE_CONFIG];
      if (config && goalData.target_value) {
        dbData[config.dbField] = goalData.target_value;
      }

      console.log('Database data to save:', dbData);

      const { data, error } = await supabase
        .from('user_health_goals')
        .insert(dbData)
        .select()
        .single();

      if (error) {
        console.error('Error creating goal:', error);
        throw error;
      }
      
      console.log('Goal created successfully:', data);
      await loadGoals();
      toast.success('Цель создана');
      return true;
    } catch (error: any) {
      console.error('Error creating goal:', error);
      toast.error(error.message || 'Ошибка создания цели');
      return false;
    }
  };

  const updateGoal = async (goalId: string, goalData: CreateHealthGoalInput): Promise<boolean> => {
    if (!user) {
      toast.error('Необходима авторизация');
      return false;
    }

    try {
      console.log('Updating goal:', goalId, goalData);
      
      // Подготавливаем данные для обновления
      const dbData: any = {
        goal_type: goalData.goal_type || 'monthly',
        start_date: goalData.start_date || new Date().toISOString().split('T')[0],
        end_date: goalData.target_date || null,
        is_active: goalData.is_active,
        target_steps: 0,
        target_exercise_minutes: 0,
        target_sleep_hours: 0,
        target_water_intake: 0,
        target_stress_level: 0,
        target_weight: null
      };

      // Устанавливаем значение в зависимости от типа цели
      const config = GOAL_TYPE_CONFIG[goalData.goal_type as keyof typeof GOAL_TYPE_CONFIG];
      if (config && goalData.target_value) {
        dbData[config.dbField] = goalData.target_value;
      }

      const { error } = await supabase
        .from('user_health_goals')
        .update(dbData)
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating goal:', error);
        throw error;
      }
      
      await loadGoals();
      toast.success('Цель обновлена');
      return true;
    } catch (error: any) {
      console.error('Error updating goal:', error);
      toast.error(error.message || 'Ошибка обновления цели');
      return false;
    }
  };

  const deleteGoal = async (goalId: string): Promise<void> => {
    if (!user) return;

    try {
      console.log('Deleting goal:', goalId);
      
      const { error } = await supabase
        .from('user_health_goals')
        .update({ is_active: false })
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting goal:', error);
        throw error;
      }
      
      await loadGoals();
      toast.success('Цель удалена');
    } catch (error: any) {
      console.error('Error deleting goal:', error);
      toast.error(error.message || 'Ошибка удаления цели');
    }
  };

  return {
    goals,
    isLoading,
    createGoal,
    updateGoal,
    deleteGoal,
    refetch: loadGoals
  };
};
