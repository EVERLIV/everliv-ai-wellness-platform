
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SemanticSearchResult {
  article_id?: string;
  protocol_id?: string;
  title: string;
  content?: string;
  description?: string;
  excerpt?: string;
  category?: string;
  similarity: number;
  recommendation_reason?: string;
}

export const useSemanticSearch = () => {
  const { user } = useAuth();
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SemanticSearchResult[]>([]);

  const searchMedicalArticles = async (
    query: string, 
    matchThreshold: number = 0.7,
    matchCount: number = 10
  ) => {
    if (!query.trim()) {
      toast.error('Введите поисковый запрос');
      return;
    }

    setIsSearching(true);
    try {
      console.log('Searching medical articles:', query);

      const { data, error } = await supabase.functions.invoke('semantic-search', {
        body: {
          query: query,
          search_type: 'medical_articles',
          match_threshold: matchThreshold,
          match_count: matchCount
        }
      });

      if (error) throw error;

      if (data.success) {
        setResults(data.results);
        toast.success(`Найдено ${data.results.length} релевантных статей`);
      } else {
        throw new Error(data.error || 'Ошибка поиска');
      }
    } catch (error) {
      console.error('Error searching articles:', error);
      toast.error('Ошибка при поиске статей');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const getProtocolRecommendations = async (
    query: string,
    matchThreshold: number = 0.6,
    matchCount: number = 5
  ) => {
    if (!user?.id) {
      toast.error('Необходимо войти в систему');
      return;
    }

    if (!query.trim()) {
      toast.error('Опишите ваши здоровые цели или интересы');
      return;
    }

    setIsSearching(true);
    try {
      console.log('Getting protocol recommendations for:', query);

      const { data, error } = await supabase.functions.invoke('semantic-search', {
        body: {
          query: query,
          search_type: 'protocol_recommendations',
          match_threshold: matchThreshold,
          match_count: matchCount,
          user_id: user.id
        }
      });

      if (error) throw error;

      if (data.success) {
        setResults(data.results);
        toast.success(`Найдено ${data.results.length} рекомендованных протоколов`);
      } else {
        throw new Error(data.error || 'Ошибка получения рекомендаций');
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast.error('Ошибка при получении рекомендаций');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const generateEmbedding = async (
    text: string,
    type: 'medical_article' | 'protocol' | 'user_preference',
    metadata: any
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-embeddings', {
        body: {
          text: text,
          type: type,
          metadata: metadata
        }
      });

      if (error) throw error;

      if (data.success) {
        console.log(`Generated embedding for ${type}:`, data.embedding_id);
        return data;
      } else {
        throw new Error(data.error || 'Ошибка генерации embedding');
      }
    } catch (error) {
      console.error('Error generating embedding:', error);
      toast.error('Ошибка при генерации векторного представления');
      return null;
    }
  };

  return {
    results,
    isSearching,
    searchMedicalArticles,
    getProtocolRecommendations,
    generateEmbedding,
    clearResults: () => setResults([])
  };
};
