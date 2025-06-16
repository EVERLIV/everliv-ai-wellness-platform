
import { useEffect } from 'react';
import { useSemanticSearch } from './useSemanticSearch';
import { toast } from 'sonner';

export const useEmbeddingSync = () => {
  const { generateEmbedding } = useSemanticSearch();

  const syncArticleEmbedding = async (articleId: string, title: string, content: string) => {
    const text = `${title}\n\n${content}`;
    await generateEmbedding(text, 'medical_article', { article_id: articleId });
  };

  const syncProtocolEmbedding = async (
    protocolId: string, 
    title: string, 
    description: string,
    category: string,
    benefits: string[]
  ) => {
    const text = `${title}\n\n${description}\n\nКатегория: ${category}\n\nПреимущества: ${benefits.join(', ')}`;
    const features = {
      category,
      benefits_count: benefits.length,
      difficulty: 'medium' // можно добавить из данных протокола
    };
    
    await generateEmbedding(text, 'protocol', { 
      protocol_id: protocolId,
      features 
    });
  };

  const syncUserPreferences = async (
    userId: string,
    preferenceType: 'medical_interests' | 'protocol_history' | 'health_goals',
    text: string,
    additionalData?: any
  ) => {
    await generateEmbedding(text, 'user_preference', {
      user_id: userId,
      preference_type: preferenceType,
      additional_data: additionalData
    });
  };

  return {
    syncArticleEmbedding,
    syncProtocolEmbedding,
    syncUserPreferences
  };
};
