
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface FoodEntry {
  id: string;
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_type: string;
  entry_date: string;
  portion_size?: string;
  image_url?: string;
}

export const useRealtimeFoodEntries = (selectedDate: Date) => {
  const { user } = useAuth();
  const [realtimeEntries, setRealtimeEntries] = useState<FoodEntry[]>([]);
  const dateString = selectedDate.toISOString().split('T')[0];

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`food_entries_${user.id}`) // Убираем dateString из имени канала
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'food_entries',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newEntry = payload.new as FoodEntry;
          if (newEntry.entry_date === dateString) {
            setRealtimeEntries(prev => {
              if (prev.some(entry => entry.id === newEntry.id)) {
                return prev;
              }
              return [...prev, newEntry];
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'food_entries',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const deletedEntry = payload.old as FoodEntry;
          setRealtimeEntries(prev => prev.filter(entry => entry.id !== deletedEntry.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, dateString]); // Оставляем dateString в зависимостях для фильтрации

  return { realtimeEntries, setRealtimeEntries };
};
