
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { secureLogger } from '@/utils/secureLogger';
import { InputSanitizer } from '@/utils/inputSanitizer';

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
    // Validate and sanitize input
    const validation = InputSanitizer.validateSearchQuery(query);
    if (!validation.isValid) {
      toast.error(validation.error || 'Invalid search query');
      return;
    }

    // Check rate limiting
    const rateLimit = InputSanitizer.checkRateLimit(
      user?.id || 'anonymous', 
      'semantic_search',
      10, // 10 searches per minute
      60 * 1000
    );

    if (!rateLimit.allowed) {
      toast.error(`Rate limit exceeded. Try again in ${Math.ceil((rateLimit.resetTime - Date.now()) / 1000)} seconds`);
      return;
    }

    setIsSearching(true);
    const searchStartTime = Date.now();

    try {
      secureLogger.info('Starting medical articles search', {
        user_id: user?.id,
        query_length: validation.sanitized.length,
        match_threshold: matchThreshold,
        match_count: matchCount
      });

      const { data, error } = await supabase.functions.invoke('semantic-search', {
        body: {
          query: validation.sanitized,
          search_type: 'medical_articles',
          match_threshold: matchThreshold,
          match_count: matchCount
        }
      });

      if (error) throw error;

      if (data.success) {
        // Sanitize results
        const sanitizedResults = data.results.map((result: any) => ({
          ...result,
          title: InputSanitizer.sanitizeText(result.title || ''),
          content: InputSanitizer.sanitizeText(result.content || ''),
          excerpt: InputSanitizer.sanitizeText(result.excerpt || ''),
          category: InputSanitizer.sanitizeText(result.category || '')
        }));

        setResults(sanitizedResults);
        
        secureLogger.info('Medical articles search completed', {
          user_id: user?.id,
          results_count: sanitizedResults.length,
          search_duration: Date.now() - searchStartTime
        });
        
        toast.success(`Найдено ${sanitizedResults.length} релевантных статей`);
      } else {
        throw new Error(data.error || 'Ошибка поиска');
      }
    } catch (error) {
      secureLogger.error('Error searching articles', {
        user_id: user?.id,
        error: (error as Error).message,
        search_duration: Date.now() - searchStartTime
      });
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

    // Validate and sanitize input
    const validation = InputSanitizer.validateSearchQuery(query);
    if (!validation.isValid) {
      toast.error(validation.error || 'Invalid search query');
      return;
    }

    // Check rate limiting
    const rateLimit = InputSanitizer.checkRateLimit(
      user.id, 
      'protocol_recommendations',
      5, // 5 recommendation requests per minute
      60 * 1000
    );

    if (!rateLimit.allowed) {
      toast.error(`Rate limit exceeded. Try again in ${Math.ceil((rateLimit.resetTime - Date.now()) / 1000)} seconds`);
      return;
    }

    setIsSearching(true);
    const searchStartTime = Date.now();

    try {
      secureLogger.info('Getting protocol recommendations', {
        user_id: user.id,
        query_length: validation.sanitized.length,
        match_threshold: matchThreshold,
        match_count: matchCount
      });

      const { data, error } = await supabase.functions.invoke('semantic-search', {
        body: {
          query: validation.sanitized,
          search_type: 'protocol_recommendations',
          match_threshold: matchThreshold,
          match_count: matchCount,
          user_id: user.id
        }
      });

      if (error) throw error;

      if (data.success) {
        // Sanitize results
        const sanitizedResults = data.results.map((result: any) => ({
          ...result,
          title: InputSanitizer.sanitizeText(result.title || ''),
          description: InputSanitizer.sanitizeText(result.description || ''),
          category: InputSanitizer.sanitizeText(result.category || ''),
          recommendation_reason: InputSanitizer.sanitizeText(result.recommendation_reason || '')
        }));

        setResults(sanitizedResults);
        
        secureLogger.info('Protocol recommendations completed', {
          user_id: user.id,
          results_count: sanitizedResults.length,
          search_duration: Date.now() - searchStartTime
        });
        
        toast.success(`Найдено ${sanitizedResults.length} рекомендованных протоколов`);
      } else {
        throw new Error(data.error || 'Ошибка получения рекомендаций');
      }
    } catch (error) {
      secureLogger.error('Error getting recommendations', {
        user_id: user.id,
        error: (error as Error).message,
        search_duration: Date.now() - searchStartTime
      });
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
    if (!user?.id && type === 'user_preference') {
      toast.error('Необходимо войти в систему');
      return null;
    }

    // Sanitize input text
    const sanitizedText = type === 'medical_article' 
      ? InputSanitizer.sanitizeMedicalData(text)
      : InputSanitizer.sanitizeText(text, 10000);

    // Check rate limiting
    const rateLimit = InputSanitizer.checkRateLimit(
      user?.id || 'anonymous', 
      'generate_embedding',
      20, // 20 embedding generations per minute
      60 * 1000
    );

    if (!rateLimit.allowed) {
      toast.error('Rate limit exceeded for embedding generation');
      return null;
    }

    try {
      secureLogger.info('Generating embedding', {
        user_id: user?.id,
        type,
        text_length: sanitizedText.length
      });

      const { data, error } = await supabase.functions.invoke('generate-embeddings', {
        body: {
          text: sanitizedText,
          type: type,
          metadata: metadata
        }
      });

      if (error) throw error;

      if (data.success) {
        secureLogger.info('Embedding generated successfully', {
          user_id: user?.id,
          type,
          embedding_id: data.embedding_id,
          dimensions: data.dimensions
        });
        return data;
      } else {
        throw new Error(data.error || 'Ошибка генерации embedding');
      }
    } catch (error) {
      secureLogger.error('Error generating embedding', {
        user_id: user?.id,
        type,
        error: (error as Error).message
      });
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
