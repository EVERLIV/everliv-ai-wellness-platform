
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MoscowSpecialist } from '@/types/medical';

interface SpecialistSearchResult {
  specialist: MoscowSpecialist;
  relevanceScore: number;
  summary: string;
}

export const useSpecialistSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SpecialistSearchResult[]>([]);

  const searchSpecialists = async (query: string) => {
    setIsSearching(true);
    try {
      // Получаем всех специалистов
      const { data: specialists, error } = await supabase
        .from('moscow_specialists')
        .select(`
          *,
          specialization:doctor_specializations(*)
        `)
        .order('rating', { ascending: false });

      if (error) throw error;

      // Используем ИИ для анализа запроса и подбора специалистов
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('search-specialists', {
        body: {
          query,
          specialists: specialists || []
        }
      });

      if (aiError) throw aiError;

      setSearchResults(aiResponse.results || []);
    } catch (error) {
      console.error('Error searching specialists:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchSpecialists,
    isSearching,
    searchResults,
    clearResults: () => setSearchResults([])
  };
};
