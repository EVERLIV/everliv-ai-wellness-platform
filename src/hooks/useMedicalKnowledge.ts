
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MedicalCategory, MedicalArticle, DoctorSpecialization } from '@/types/medical';

export const useMedicalKnowledge = () => {
  const [categories, setCategories] = useState<MedicalCategory[]>([]);
  const [articles, setArticles] = useState<MedicalArticle[]>([]);
  const [specializations, setSpecializations] = useState<DoctorSpecialization[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMedicalData();
  }, []);

  // Функция для удаления дубликатов по ID
  const removeDuplicatesById = <T extends { id: string }>(items: T[]): T[] => {
    const seen = new Set<string>();
    return items.filter(item => {
      if (seen.has(item.id)) {
        return false;
      }
      seen.add(item.id);
      return true;
    });
  };

  const loadMedicalData = async () => {
    try {
      setIsLoading(true);
      
      // Загружаем категории
      const { data: categoriesData } = await supabase
        .from('medical_categories')
        .select('*')
        .order('name');

      // Загружаем статьи
      const { data: articlesData } = await supabase
        .from('medical_articles')
        .select(`
          *,
          category:medical_categories(*)
        `)
        .eq('published', true)
        .eq('medical_review_status', 'approved')
        .order('created_at', { ascending: false });

      // Загружаем специализации врачей
      const { data: specializationsData } = await supabase
        .from('doctor_specializations')
        .select('*')
        .order('name');

      // Удаляем дубликаты перед установкой состояния
      setCategories(removeDuplicatesById(categoriesData || []));
      setArticles(removeDuplicatesById(articlesData || []));
      setSpecializations(removeDuplicatesById(specializationsData || []));
    } catch (error) {
      console.error('Error loading medical data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchArticles = async (query: string, category?: string) => {
    try {
      let queryBuilder = supabase
        .from('medical_articles')
        .select(`
          *,
          category:medical_categories(*)
        `)
        .eq('published', true)
        .eq('medical_review_status', 'approved');

      if (category) {
        queryBuilder = queryBuilder.eq('category_id', category);
      }

      if (query) {
        queryBuilder = queryBuilder.or(`title.ilike.%${query}%,content.ilike.%${query}%,tags.cs.{${query}}`);
      }

      const { data } = await queryBuilder.order('created_at', { ascending: false });
      
      // Удаляем дубликаты из результатов поиска
      return removeDuplicatesById(data || []);
    } catch (error) {
      console.error('Error searching articles:', error);
      return [];
    }
  };

  return {
    categories,
    articles,
    specializations,
    isLoading,
    searchArticles,
    refreshData: loadMedicalData
  };
};
