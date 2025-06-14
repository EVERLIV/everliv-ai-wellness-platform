
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MoscowSpecialist, SpecialistReview } from '@/types/medical';

export const useMoscowSpecialists = () => {
  const [specialists, setSpecialists] = useState<MoscowSpecialist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSpecialists();
  }, []);

  const loadSpecialists = async () => {
    try {
      setIsLoading(true);
      
      const { data } = await supabase
        .from('moscow_specialists')
        .select(`
          *,
          specialization:doctor_specializations(*)
        `)
        .order('rating', { ascending: false });

      setSpecialists(data || []);
    } catch (error) {
      console.error('Error loading Moscow specialists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSpecialistsBySpecialization = async (specializationId: string) => {
    try {
      const { data } = await supabase
        .from('moscow_specialists')
        .select(`
          *,
          specialization:doctor_specializations(*)
        `)
        .eq('specialization_id', specializationId)
        .order('rating', { ascending: false });

      return data || [];
    } catch (error) {
      console.error('Error loading specialists by specialization:', error);
      return [];
    }
  };

  const getSpecialistReviews = async (specialistId: string): Promise<SpecialistReview[]> => {
    try {
      const { data } = await supabase
        .from('specialist_reviews')
        .select('*')
        .eq('specialist_id', specialistId)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      return data || [];
    } catch (error) {
      console.error('Error loading specialist reviews:', error);
      return [];
    }
  };

  return {
    specialists,
    isLoading,
    getSpecialistsBySpecialization,
    getSpecialistReviews,
    refreshData: loadSpecialists
  };
};
