
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface HealthGoal {
  id?: string;
  user_id: string;
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  is_custom: boolean;
  target_value?: number;
  unit?: string;
  progress_percentage: number;
  target_steps?: number;
  target_exercise_minutes?: number;
  target_sleep_hours?: number;
  target_water_intake?: number;
  target_stress_level?: number;
  target_weight?: number;
  goal_type: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CustomGoalInput {
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  target_value?: number;
  unit?: string;
  start_date: string;
  end_date?: string;
}

export const GOAL_CATEGORIES = {
  // Существующие категории
  'biological_age': {
    name: 'Биологический возраст',
    icon: '🧬',
    color: 'purple'
  },
  'cardiovascular': {
    name: 'Сердечно-сосудистая система',
    icon: '❤️',
    color: 'red'
  },
  'cognitive': {
    name: 'Когнитивные функции',
    icon: '🧠',
    color: 'blue'
  },
  'musculoskeletal': {
    name: 'Костно-мышечная система',
    icon: '💪',
    color: 'orange'
  },
  'metabolism': {
    name: 'Метаболизм',
    icon: '⚡',
    color: 'yellow'
  },
  'immunity': {
    name: 'Иммунитет',
    icon: '🛡️',
    color: 'green'
  },
  // Новые категории
  'nutrition_goals': {
    name: 'Питание и диета', 
    icon: '🥗',
    color: 'green'
  },
  'mental_wellness': {
    name: 'Ментальное здоровье',
    icon: '🧘',
    color: 'indigo'
  },
  'social_health': {
    name: 'Социальное здоровье',
    icon: '👥',
    color: 'pink'
  },
  'disease_prevention': {
    name: 'Профилактика заболеваний',
    icon: '🩺',
    color: 'teal'
  },
  'fitness': {
    name: 'Фитнес и активность',
    icon: '🏃',
    color: 'blue'
  },
  'sleep': {
    name: 'Сон и отдых', 
    icon: '😴',
    color: 'purple'
  },
  'custom': {
    name: 'Пользовательская',
    icon: '⭐',
    color: 'gray'
  }
};

export const useHealthGoalsManager = () => {
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
      
      const transformedGoals: HealthGoal[] = (data || []).map(dbGoal => ({
        id: dbGoal.id,
        user_id: dbGoal.user_id,
        title: dbGoal.title || getDefaultTitle(dbGoal),
        description: dbGoal.description || `Цель создана ${new Date(dbGoal.created_at).toLocaleDateString('ru-RU')}`,
        category: dbGoal.category || 'fitness',
        priority: (dbGoal.priority as 'low' | 'medium' | 'high') || 'medium',
        is_custom: dbGoal.is_custom || false,
        target_value: getTargetValue(dbGoal),
        unit: dbGoal.unit || getDefaultUnit(dbGoal),
        progress_percentage: dbGoal.progress_percentage || 0,
        target_steps: dbGoal.target_steps,
        target_exercise_minutes: dbGoal.target_exercise_minutes,
        target_sleep_hours: dbGoal.target_sleep_hours,
        target_water_intake: dbGoal.target_water_intake,
        target_stress_level: dbGoal.target_stress_level,
        target_weight: dbGoal.target_weight,
        goal_type: dbGoal.goal_type || 'custom',
        start_date: dbGoal.start_date,
        end_date: dbGoal.end_date,
        is_active: dbGoal.is_active,
        created_at: dbGoal.created_at,
        updated_at: dbGoal.updated_at
      }));
      
      setGoals(transformedGoals);

    } catch (error) {
      console.error('Error loading goals:', error);
      toast.error('Ошибка загрузки целей');
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultTitle = (dbGoal: any): string => {
    if (dbGoal.target_steps > 0) return 'Ежедневные шаги';
    if (dbGoal.target_exercise_minutes > 0) return 'Время тренировок';
    if (dbGoal.target_sleep_hours > 0) return 'Качество сна';
    if (dbGoal.target_water_intake > 0) return 'Питьевой режим';
    if (dbGoal.target_weight > 0) return 'Целевой вес';
    if (dbGoal.target_stress_level > 0) return 'Управление стрессом';
    return 'Пользовательская цель';
  };

  const getTargetValue = (dbGoal: any): number | undefined => {
    if (dbGoal.target_steps > 0) return dbGoal.target_steps;
    if (dbGoal.target_exercise_minutes > 0) return dbGoal.target_exercise_minutes;
    if (dbGoal.target_sleep_hours > 0) return dbGoal.target_sleep_hours;
    if (dbGoal.target_water_intake > 0) return dbGoal.target_water_intake;
    if (dbGoal.target_weight > 0) return dbGoal.target_weight;
    if (dbGoal.target_stress_level > 0) return dbGoal.target_stress_level;
    return undefined;
  };

  const getDefaultUnit = (dbGoal: any): string => {
    if (dbGoal.target_steps > 0) return 'шагов';
    if (dbGoal.target_exercise_minutes > 0) return 'минут';
    if (dbGoal.target_sleep_hours > 0) return 'часов';
    if (dbGoal.target_water_intake > 0) return 'стаканов';
    if (dbGoal.target_weight > 0) return 'кг';
    if (dbGoal.target_stress_level > 0) return 'уровень';
    return '';
  };

  const createCustomGoal = async (goalInput: CustomGoalInput): Promise<boolean> => {
    if (!user) {
      toast.error('Необходима авторизация');
      return false;
    }

    try {
      console.log('Creating custom goal:', goalInput);
      
      const dataToSave = {
        user_id: user.id,
        title: goalInput.title,
        description: goalInput.description || '',
        category: goalInput.category,
        priority: goalInput.priority,
        is_custom: true,
        target_value: goalInput.target_value,
        unit: goalInput.unit || '',
        progress_percentage: 0,
        goal_type: 'custom',
        start_date: goalInput.start_date,
        end_date: goalInput.end_date || null,
        is_active: true,
        // Обнуляем стандартные поля для пользовательских целей
        target_steps: 0,
        target_exercise_minutes: 0,
        target_sleep_hours: 0,
        target_water_intake: 0,
        target_stress_level: 0,
        target_weight: null
      };

      console.log('Data to save:', dataToSave);

      const { data, error } = await supabase
        .from('user_health_goals')
        .insert(dataToSave)
        .select()
        .single();

      if (error) {
        console.error('Error creating custom goal:', error);
        throw error;
      }
      
      console.log('Custom goal created successfully:', data);
      await loadGoals();
      toast.success('Пользовательская цель создана');
      return true;
    } catch (error: any) {
      console.error('Error creating custom goal:', error);
      toast.error(error.message || 'Ошибка создания цели');
      return false;
    }
  };

  const updateGoal = async (goalId: string, updates: Partial<CustomGoalInput>): Promise<boolean> => {
    if (!user) {
      toast.error('Необходима авторизация');
      return false;
    }

    try {
      console.log('Updating goal:', goalId, updates);
      
      const { error } = await supabase
        .from('user_health_goals')
        .update({
          title: updates.title,
          description: updates.description,
          category: updates.category,
          priority: updates.priority,
          target_value: updates.target_value,
          unit: updates.unit,
          end_date: updates.end_date
        })
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

  const deleteGoal = async (goalId: string): Promise<boolean> => {
    if (!user) return false;

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
      return true;
    } catch (error: any) {
      console.error('Error deleting goal:', error);
      toast.error(error.message || 'Ошибка удаления цели');
      return false;
    }
  };

  const toggleGoalStatus = async (goalId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) return false;

      const { error } = await supabase
        .from('user_health_goals')
        .update({ is_active: !goal.is_active })
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error toggling goal status:', error);
        throw error;
      }
      
      await loadGoals();
      toast.success(goal.is_active ? 'Цель деактивирована' : 'Цель активирована');
      return true;
    } catch (error: any) {
      console.error('Error toggling goal status:', error);
      toast.error(error.message || 'Ошибка изменения статуса цели');
      return false;
    }
  };

  return {
    goals: goals.filter(goal => goal.is_active),
    allGoals: goals,
    isLoading,
    createCustomGoal,
    updateGoal,
    deleteGoal,
    toggleGoalStatus,
    refetch: loadGoals,
    categories: GOAL_CATEGORIES
  };
};
