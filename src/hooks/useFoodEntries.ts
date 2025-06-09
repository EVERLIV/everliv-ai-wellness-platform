
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FoodEntry {
  id?: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion_size?: string;
  image_url?: string;
  entry_date: string;
}

export const useFoodEntries = (selectedDate: Date) => {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const dateString = selectedDate.toISOString().split('T')[0];

  const fetchEntries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('food_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('entry_date', dateString)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching food entries:', error);
      toast.error('Ошибка при загрузке записей о питании');
    } finally {
      setIsLoading(false);
    }
  };

  const addEntry = async (entry: Omit<FoodEntry, 'id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('food_entries')
        .insert({
          user_id: user.id,
          ...entry,
          entry_date: dateString
        })
        .select()
        .single();

      if (error) throw error;

      setEntries(prev => [...prev, data]);
      toast.success('Прием пищи добавлен!');
      return data;
    } catch (error) {
      console.error('Error adding food entry:', error);
      toast.error('Ошибка при добавлении приема пищи');
      throw error;
    }
  };

  const deleteEntry = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('food_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;

      setEntries(prev => prev.filter(entry => entry.id !== entryId));
      toast.success('Запись удалена!');
    } catch (error) {
      console.error('Error deleting food entry:', error);
      toast.error('Ошибка при удалении записи');
      throw error;
    }
  };

  // Расчет суммарных значений БЖУ по типам приема пищи
  const getSummaryByMealType = () => {
    const summary = {
      breakfast: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      lunch: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      dinner: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      snack: { calories: 0, protein: 0, carbs: 0, fat: 0 }
    };

    entries.forEach(entry => {
      summary[entry.meal_type].calories += entry.calories;
      summary[entry.meal_type].protein += entry.protein;
      summary[entry.meal_type].carbs += entry.carbs;
      summary[entry.meal_type].fat += entry.fat;
    });

    return summary;
  };

  // Расчет общих значений за день
  const getDailyTotals = () => {
    return entries.reduce(
      (totals, entry) => ({
        calories: totals.calories + entry.calories,
        protein: totals.protein + entry.protein,
        carbs: totals.carbs + entry.carbs,
        fat: totals.fat + entry.fat
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  useEffect(() => {
    fetchEntries();
  }, [dateString]);

  return {
    entries,
    isLoading,
    addEntry,
    deleteEntry,
    getSummaryByMealType,
    getDailyTotals,
    refetch: fetchEntries
  };
};
