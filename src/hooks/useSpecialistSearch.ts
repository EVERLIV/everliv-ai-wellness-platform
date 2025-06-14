
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
  const [error, setError] = useState<string | null>(null);

  const searchSpecialists = async (query: string) => {
    if (!query.trim()) {
      setError('Введите поисковый запрос');
      return;
    }

    setIsSearching(true);
    setError(null);
    
    try {
      console.log('Starting specialist search for:', query);
      
      // Получаем всех специалистов
      const { data: specialists, error: fetchError } = await supabase
        .from('moscow_specialists')
        .select(`
          *,
          specialization:doctor_specializations(*)
        `)
        .order('rating', { ascending: false });

      if (fetchError) {
        console.error('Error fetching specialists:', fetchError);
        throw new Error('Ошибка загрузки специалистов');
      }

      if (!specialists || specialists.length === 0) {
        console.log('No specialists found in database');
        setSearchResults([]);
        setError('Специалисты не найдены в базе данных');
        return;
      }

      console.log('Fetched specialists:', specialists.length);

      // Используем ИИ для анализа запроса и подбора специалистов
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('search-specialists', {
        body: {
          query,
          specialists: specialists || []
        }
      });

      if (aiError) {
        console.error('AI search error:', aiError);
        throw new Error('Ошибка поиска с ИИ: ' + aiError.message);
      }

      console.log('AI response:', aiResponse);

      if (aiResponse && aiResponse.results) {
        setSearchResults(aiResponse.results);
        if (aiResponse.results.length === 0) {
          setError('По вашему запросу специалисты не найдены. Попробуйте изменить поисковый запрос.');
        }
      } else {
        console.log('No results in AI response');
        setSearchResults([]);
        setError('Не удалось получить результаты поиска');
      }
    } catch (error) {
      console.error('Error searching specialists:', error);
      setError(error instanceof Error ? error.message : 'Произошла ошибка при поиске');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearResults = () => {
    setSearchResults([]);
    setError(null);
  };

  return {
    searchSpecialists,
    isSearching,
    searchResults,
    error,
    clearResults
  };
};
