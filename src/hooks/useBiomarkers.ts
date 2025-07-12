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
      const key = biomarker.name;
      if (!acc[key] || new Date(biomarker.created_at) > new Date(acc[key].created_at)) {
        acc[key] = biomarker;
      }
      return acc;
    }, {} as Record<string, Biomarker>);

    // Список всех проблемных статусов
    const problematicStatuses = [
      'critical', 'high', 'elevated', 'low', 'below_normal', 
      'above_normal', 'attention', 'borderline', 'abnormal'
    ];

    // Фильтруем биомаркеры с проблемными статусами
    const problematicBiomarkers = Object.values(latestBiomarkers)
      .filter(b => {
        if (!b.status) return false;
        const status = b.status.toLowerCase();
        return problematicStatuses.includes(status);
      });

    console.log('All biomarkers:', biomarkers);
    console.log('Latest biomarkers:', latestBiomarkers);
    console.log('Problematic biomarkers:', problematicBiomarkers);

    // Сортируем по статусу: сначала критические, потом требующие внимания
    return problematicBiomarkers
      .sort((a, b) => {
        const statusPriority = {
          'critical': 0,
          'high': 1,
          'elevated': 2,
          'above_normal': 3,
          'low': 4,
          'below_normal': 5,
          'attention': 6,
          'borderline': 7,
          'abnormal': 8
        } as Record<string, number>;
        
        const aPriority = statusPriority[a.status?.toLowerCase() || ''] ?? 999;
        const bPriority = statusPriority[b.status?.toLowerCase() || ''] ?? 999;
        
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