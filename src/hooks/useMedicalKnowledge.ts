
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MedicalCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  created_at: string;
  updated_at: string;
}

export interface MedicalArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  article_type: string;
  category_id: string | null;
  author: string | null;
  published: boolean | null;
  views_count: number | null;
  tags: string[] | null;
  medical_review_status: string | null;
  created_at: string;
  updated_at: string;
}

export interface DoctorSpecialization {
  id: string;
  name: string;
  description: string | null;
  required_education: string | null;
  common_conditions: string[] | null;
  detailed_description: string | null;
  health_areas: string[] | null;
  treatment_methods: string[] | null;
  typical_consultations: string[] | null;
  avg_consultation_duration: number | null;
  specialists_count: number | null;
  created_at: string;
}

export const useMedicalKnowledge = () => {
  const [categories, setCategories] = useState<MedicalCategory[]>([]);
  const [articles, setArticles] = useState<MedicalArticle[]>([]);
  const [specializations, setSpecializations] = useState<DoctorSpecialization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('medical_categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;

      // Fetch articles
      const { data: articlesData, error: articlesError } = await supabase
        .from('medical_articles')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (articlesError) throw articlesError;

      // Fetch specializations
      const { data: specializationsData, error: specializationsError } = await supabase
        .from('doctor_specializations')
        .select('*')
        .order('name');

      if (specializationsError) throw specializationsError;

      setCategories(categoriesData || []);
      setArticles(articlesData || []);
      setSpecializations(specializationsData || []);
    } catch (err) {
      console.error('Error fetching medical knowledge data:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке данных');
      
      // Fallback data
      setCategories([]);
      setArticles([]);
      setSpecializations([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    categories,
    articles,
    specializations,
    isLoading,
    error,
    refetch: fetchData
  };
};
