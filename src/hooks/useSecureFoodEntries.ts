
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseErrorHandler } from './useSupabaseErrorHandler';

export const useSecureFoodEntries = () => {
  const { user } = useAuth();
  const { handleError } = useSupabaseErrorHandler();
  const [foodEntries, setFoodEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFoodEntries = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('food_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        handleError(error, 'fetching food entries');
        return;
      }

      setFoodEntries(data || []);
    } catch (error) {
      handleError(error as Error, 'fetching food entries');
    } finally {
      setIsLoading(false);
    }
  };

  const createFoodEntry = async (entryData: any) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('food_entries')
        .insert({
          user_id: user.id,
          ...entryData
        })
        .select()
        .single();

      if (error) {
        handleError(error, 'creating food entry');
        return;
      }

      await fetchFoodEntries(); // Refresh the list
      return data;
    } catch (error) {
      handleError(error as Error, 'creating food entry');
    }
  };

  const updateFoodEntry = async (id: string, updates: any) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('food_entries')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        handleError(error, 'updating food entry');
        return;
      }

      await fetchFoodEntries(); // Refresh the list
      return data;
    } catch (error) {
      handleError(error as Error, 'updating food entry');
    }
  };

  const deleteFoodEntry = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('food_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        handleError(error, 'deleting food entry');
        return;
      }

      await fetchFoodEntries(); // Refresh the list
    } catch (error) {
      handleError(error as Error, 'deleting food entry');
    }
  };

  useEffect(() => {
    fetchFoodEntries();
  }, [user]);

  return {
    foodEntries,
    isLoading,
    createFoodEntry,
    updateFoodEntry,
    deleteFoodEntry,
    refetch: fetchFoodEntries
  };
};
