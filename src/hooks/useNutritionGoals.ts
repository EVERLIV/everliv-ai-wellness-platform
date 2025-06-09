
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface NutritionGoals {
  id?: string;
  daily_calories: number;
  daily_protein: number;
  daily_carbs: number;
  daily_fat: number;
}

export const useNutritionGoals = () => {
  const [goals, setGoals] = useState<NutritionGoals | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGoals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('nutrition_goals')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setGoals(data);
      } else {
        // Создаем цели по умолчанию
        const defaultGoals = {
          daily_calories: 2000,
          daily_protein: 150,
          daily_carbs: 250,
          daily_fat: 65
        };
        setGoals(defaultGoals);
      }
    } catch (error) {
      console.error('Error fetching nutrition goals:', error);
      toast.error('Ошибка при загрузке целей питания');
    } finally {
      setIsLoading(false);
    }
  };

  const saveGoals = async (newGoals: Omit<NutritionGoals, 'id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('nutrition_goals')
        .upsert({
          user_id: user.id,
          ...newGoals,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setGoals(data);
      toast.success('Цели питания сохранены!');
      return data;
    } catch (error) {
      console.error('Error saving nutrition goals:', error);
      toast.error('Ошибка при сохранении целей питания');
      throw error;
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return {
    goals,
    isLoading,
    saveGoals,
    refetch: fetchGoals
  };
};
