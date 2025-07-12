import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Biomarker {
  id: string;
  name: string;
  value: string | null;
  reference_range: string | null;
  status: string | null;
  analysis_id: string;
  created_at: string;
}

export const useBiomarkers = () => {
  const [biomarkers, setBiomarkers] = useState<Biomarker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchBiomarkers = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Получаем анализы пользователя
      const { data: analyses, error: analysesError } = await supabase
        .from('medical_analyses')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (analysesError) throw analysesError;

      if (!analyses || analyses.length === 0) {
        setBiomarkers([]);
        setIsLoading(false);
        return;
      }

      const analysisIds = analyses.map(a => a.id);

      // Получаем биомаркеры для этих анализов
      const { data: biomarkersData, error: biomarkersError } = await supabase
        .from('biomarkers')
        .select('*')
        .in('analysis_id', analysisIds)
        .order('created_at', { ascending: false });

      if (biomarkersError) throw biomarkersError;

      setBiomarkers(biomarkersData || []);
    } catch (err) {
      console.error('Error fetching biomarkers:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBiomarkers();
  }, [user]);

  // Функция для определения топ-5 худших биомаркеров
  const getTop5WorstBiomarkers = (): Biomarker[] => {
    if (!biomarkers.length) return [];

    // Группируем биомаркеры по имени, берем последние значения
    const latestBiomarkers = biomarkers.reduce((acc, biomarker) => {
      if (!acc[biomarker.name] || new Date(biomarker.created_at) > new Date(acc[biomarker.name].created_at)) {
        acc[biomarker.name] = biomarker;
      }
      return acc;
    }, {} as Record<string, Biomarker>);

    // Сортируем по статусу: сначала критические, потом требующие внимания
    return Object.values(latestBiomarkers)
      .filter(b => b.status && b.status !== 'normal' && b.status !== 'optimal')
      .sort((a, b) => {
        const statusPriority = {
          'critical': 0,
          'high': 1,
          'elevated': 2,
          'low': 3,
          'attention': 4,
          'borderline': 5
        } as Record<string, number>;
        
        const aPriority = statusPriority[a.status || ''] ?? 999;
        const bPriority = statusPriority[b.status || ''] ?? 999;
        
        return aPriority - bPriority;
      })
      .slice(0, 5);
  };

  return {
    biomarkers,
    isLoading,
    error,
    refetch: fetchBiomarkers,
    getTop5WorstBiomarkers
  };
};