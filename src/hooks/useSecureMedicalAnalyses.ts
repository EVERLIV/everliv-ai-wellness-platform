
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseErrorHandler } from './useSupabaseErrorHandler';

export const useSecureMedicalAnalyses = () => {
  const { user } = useAuth();
  const { handleError } = useSupabaseErrorHandler();
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalyses = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('medical_analyses')
        .select(`
          *,
          biomarkers (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        handleError(error, 'fetching medical analyses');
        return;
      }

      setAnalyses(data || []);
    } catch (error) {
      handleError(error as Error, 'fetching medical analyses');
    } finally {
      setIsLoading(false);
    }
  };

  const createAnalysis = async (analysisData: any) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('medical_analyses')
        .insert({
          user_id: user.id,
          ...analysisData
        })
        .select()
        .single();

      if (error) {
        handleError(error, 'creating medical analysis');
        return;
      }

      await fetchAnalyses(); // Refresh the list
      return data;
    } catch (error) {
      handleError(error as Error, 'creating medical analysis');
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, [user]);

  return {
    analyses,
    isLoading,
    createAnalysis,
    refetch: fetchAnalyses
  };
};
