
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FoodEntry } from '@/types/database';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface LocalFoodEntry extends Omit<FoodEntry, 'meal_type'> {
  meal_type: MealType;
}

export const useFoodEntries = (selectedDate: Date) => {
  const [entries, setEntries] = useState<LocalFoodEntry[]>([]);
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

      // Convert database entries to local type
      const typedEntries: LocalFoodEntry[] = (data || []).map(entry => ({
        ...entry,
        meal_type: entry.meal_type as MealType
      }));

      setEntries(typedEntries);
    } catch (error) {
      console.error('Error fetching food entries:', error);
      toast.error('Ошибка при загрузке записей о питании');
    } finally {
      setIsLoading(false);
    }
  };

  const addEntry = async (entry: Omit<LocalFoodEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('food_entries')
        .insert({
          user_id: user.id,
          meal_type: entry.meal_type,
          food_name: entry.food_name,
          calories: entry.calories,
          protein: entry.protein,
          carbs: entry.carbs,
          fat: entry.fat,
          portion_size: entry.portion_size,
          image_url: entry.image_url,
          entry_date: entry.entry_date
        })
        .select()
        .single();

      if (error) throw error;

      const typedEntry: LocalFoodEntry = {
        ...data,
        meal_type: data.meal_type as MealType
      };

      setEntries(prev => [...prev, typedEntry]);
      toast.success('Прием пищи добавлен!');
      return typedEntry;
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
      summary[entry.meal_type].protein += Number(entry.protein);
      summary[entry.meal_type].carbs += Number(entry.carbs);
      summary[entry.meal_type].fat += Number(entry.fat);
    });

    return summary;
  };

  // Расчет общих значений за день
  const getDailyTotals = () => {
    return entries.reduce(
      (totals, entry) => ({
        calories: totals.calories + entry.calories,
        protein: totals.protein + Number(entry.protein),
        carbs: totals.carbs + Number(entry.carbs),
        fat: totals.fat + Number(entry.fat)
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
