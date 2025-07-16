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
      
      // Получаем только ПОСЛЕДНИЙ анализ пользователя (если нужны только актуальные данные)
      const { data: analyses, error: analysesError } = await supabase
        .from('medical_analyses')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1); // Берем только последний анализ

      if (analysesError) throw analysesError;

      if (!analyses || analyses.length === 0) {
        setBiomarkers([]);
        setIsLoading(false);
        return;
      }

      const analysisIds = analyses.map(a => a.id);

      // Получаем биомаркеры для последнего анализа
      const { data: biomarkersData, error: biomarkersError } = await supabase
        .from('biomarkers')
        .select('*')
        .in('analysis_id', analysisIds)
        .order('created_at', { ascending: false });

      if (biomarkersError) throw biomarkersError;

      // Убираем дубликаты по имени биомаркера (берем последний)
      const uniqueBiomarkers = biomarkersData?.filter((biomarker, index, arr) => {
        const lastIndex = arr.findLastIndex(b => b.name === biomarker.name);
        return index === lastIndex;
      }) || [];

      console.log('Raw biomarkers from DB:', biomarkersData?.length);
      console.log('Unique biomarkers after deduplication:', uniqueBiomarkers.length);
      setBiomarkers(uniqueBiomarkers);
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
    console.log('=== DEBUG: getTop5WorstBiomarkers ===');
    console.log('Total biomarkers:', biomarkers.length);
    
    if (!biomarkers.length) {
      console.log('No biomarkers found');
      return [];
    }

    // Показываем все биомаркеры для отладки
    console.log('All biomarkers:', biomarkers.map(b => ({
      name: b.name,
      value: b.value,
      status: b.status,
      created_at: b.created_at,
      id: b.id
    })));

    // Список всех проблемных статусов (расширенный)
    const problematicStatuses = [
      'critical', 'high', 'elevated', 'low', 'below_normal', 
      'above_normal', 'attention', 'borderline', 'abnormal',
      'понижен', 'повышен', 'высокий', 'низкий', 'критический'
    ];

    // НЕ группируем по имени, а берем все проблемные биомаркеры
    const problematicBiomarkers = biomarkers
      .filter(b => {
        if (!b.status) {
          console.log(`Biomarker ${b.name} has no status`);
          return false;
        }
        const status = b.status.toLowerCase().trim();
        const isProblematic = problematicStatuses.some(ps => status.includes(ps.toLowerCase()));
        console.log(`Biomarker ${b.name} status: "${b.status}" -> problematic: ${isProblematic}`);
        return isProblematic;
      })
      // Убираем дубликаты по комбинации имени и значения (для случая если один биомаркер дублируется)
      .filter((biomarker, index, arr) => {
        const isDuplicate = arr.findIndex(b => 
          b.name === biomarker.name && 
          b.value === biomarker.value && 
          b.status === biomarker.status
        ) === index;
        return isDuplicate;
      });

    console.log('Problematic biomarkers found:', problematicBiomarkers.length);
    console.log('Problematic biomarkers:', problematicBiomarkers.map(b => ({
      name: b.name,
      status: b.status,
      value: b.value,
      id: b.id
    })));

    // Сортируем по статусу: сначала критические, потом требующие внимания
    const sortedBiomarkers = problematicBiomarkers
      .sort((a, b) => {
        const statusPriority = {
          'critical': 0,
          'критический': 0,
          'high': 1,
          'высокий': 1,
          'elevated': 2,
          'повышен': 2,
          'above_normal': 3,
          'low': 4,
          'низкий': 4,
          'понижен': 4,
          'below_normal': 5,
          'attention': 6,
          'borderline': 7,
          'abnormal': 8
        } as Record<string, number>;
        
        const aPriority = statusPriority[a.status?.toLowerCase().trim() || ''] ?? 999;
        const bPriority = statusPriority[b.status?.toLowerCase().trim() || ''] ?? 999;
        
        return aPriority - bPriority;
      })
      .slice(0, 5);

    console.log('Final sorted biomarkers:', sortedBiomarkers.map(b => ({
      name: b.name,
      status: b.status,
      value: b.value,
      id: b.id
    })));

    return sortedBiomarkers;
  };

  return {
    biomarkers,
    isLoading,
    error,
    refetch: fetchBiomarkers,
    getTop5WorstBiomarkers
  };
};