import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { calculateBiomarkerStatus } from '@/utils/biomarkerStatus';
import { getBiomarkerNorm } from '@/data/biomarkerNorms';

export interface Biomarker {
  id: string;
  name: string;
  value: string | null;
  reference_range: string | null;
  status: string | null;
  analysis_id: string;
  created_at: string;
}

interface BiomarkerData {
  name: string;
  latestValue: string;
  normalRange: string;
  status: 'normal' | 'high' | 'low';
  lastUpdated: string;
  analysisCount: number;
  trend: 'up' | 'down' | 'stable';
  deviationPercentage?: number;
  unit?: string;
}

export const useBiomarkers = () => {
  const { user } = useAuth();
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загружаем профиль пользователя
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data } = await supabase
          .from('profiles')
          .select('gender, date_of_birth')
          .eq('id', user.id)
          .single();
        
        setUserProfile(data);
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Загружаем данные анализов
  useEffect(() => {
    const fetchAnalysisHistory = async () => {
      if (!user?.id) {
        setAnalysisHistory([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const { data: analyses, error: analysesError } = await supabase
          .from('medical_analyses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (analysesError) {
          throw analysesError;
        }

        console.log('Загружено анализов:', analyses?.length || 0);
        setAnalysisHistory(analyses || []);
      } catch (err) {
        console.error('Ошибка загрузки анализов:', err);
        setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
        setAnalysisHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysisHistory();
  }, [user?.id]);

  // Функция для обработки данных биомаркеров
  const processBiomarkerData = (): BiomarkerData[] => {
    if (!analysisHistory || !Array.isArray(analysisHistory)) return [];

    const biomarkerMap = new Map<string, {
      values: Array<{ value: string; date: string; unit?: string }>;
      normalRange: string;
      status: 'normal' | 'high' | 'low';
      unit?: string;
    }>();

    // Собираем все данные биомаркеров из results
    analysisHistory.forEach(analysis => {
      if (analysis.results?.markers) {
        analysis.results.markers.forEach((marker: any) => {
          const name = marker.name;
          if (!biomarkerMap.has(name)) {
            const normalRange = marker.referenceRange || marker.reference_range || marker.normal_range || marker.normalRange || 
                               getBiomarkerNorm(name, userProfile?.gender, userProfile?.date_of_birth) || 'Не определена';
            
            let unit = marker.unit || '';
            let cleanValue = marker.value || '';
            
            if (typeof cleanValue === 'string' && /[a-zA-Zа-яА-Я%/°^]/.test(cleanValue)) {
              const valueMatch = cleanValue.match(/^([0-9,.\s]+)(.*)$/);
              if (valueMatch) {
                cleanValue = valueMatch[1].trim();
                unit = unit || valueMatch[2].trim();
              }
            }
            
            const calculatedStatus = calculateBiomarkerStatus(cleanValue, normalRange);
            
            biomarkerMap.set(name, {
              values: [],
              normalRange,
              status: calculatedStatus,
              unit
            });
          }
          
          const biomarkerData = biomarkerMap.get(name)!;
          
          let cleanValue = marker.value || '';
          if (typeof cleanValue === 'string') {
            const valueMatch = cleanValue.match(/^([0-9,.\s]+)/);
            if (valueMatch) {
              cleanValue = valueMatch[1].trim();
            }
          }
          
          biomarkerData.values.push({
            value: cleanValue,
            date: analysis.created_at,
            unit: biomarkerData.unit
          });
          
          const latestStatus = calculateBiomarkerStatus(cleanValue, biomarkerData.normalRange);
          biomarkerData.status = latestStatus;
        });
      }
    });

    const calculateTrend = (values: Array<{ value: string; date: string }>): 'up' | 'down' | 'stable' => {
      if (values.length < 2) return 'stable';
      
      const first = parseFloat(values[0].value.replace(',', '.'));
      const last = parseFloat(values[values.length - 1].value.replace(',', '.'));
      
      if (isNaN(first) || isNaN(last)) return 'stable';
      
      const change = ((last - first) / first) * 100;
      
      if (Math.abs(change) < 5) return 'stable';
      return change > 0 ? 'up' : 'down';
    };

    return Array.from(biomarkerMap.entries()).map(([name, data]) => {
      const sortedValues = data.values.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const latestValue = sortedValues[sortedValues.length - 1];
      const trend = sortedValues.length > 1 ? calculateTrend(sortedValues) : 'stable';

      const displayValue = latestValue.unit ? 
        `${latestValue.value} ${latestValue.unit}` : 
        latestValue.value;

      return {
        name,
        latestValue: displayValue,
        normalRange: data.normalRange,
        status: data.status,
        lastUpdated: latestValue.date,
        analysisCount: sortedValues.length,
        trend,
        unit: data.unit
      };
    }).sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
  };

  // Функция для получения топ-5 критических биомаркеров
  const getTop5WorstBiomarkers = (): Biomarker[] => {
    console.log('=== DEBUG: getTop5WorstBiomarkers ===');
    
    const biomarkers = processBiomarkerData();
    console.log('Всего биомаркеров обработано:', biomarkers.length);
    
    if (!biomarkers.length) {
      console.log('Нет биомаркеров для анализа');
      return [];
    }

    // Фильтруем только биомаркеры с отклонениями (high или low)
    const problematicBiomarkers = biomarkers.filter(b => b.status === 'high' || b.status === 'low');
    
    console.log('Биомаркеры с отклонениями:', problematicBiomarkers.length);

    // Сортируем по степени отклонения
    const sortedBiomarkers = problematicBiomarkers.sort((a, b) => {
      const statusPriority = { 'high': 1, 'low': 2 };
      return statusPriority[a.status] - statusPriority[b.status];
    }).slice(0, 5);

    console.log('Топ-5 критических биомаркеров:', sortedBiomarkers.length);

    // Конвертируем в формат Biomarker для совместимости
    return sortedBiomarkers.map(b => ({
      id: `${b.name}-${b.lastUpdated}`,
      name: b.name,
      value: b.latestValue,
      reference_range: b.normalRange,
      status: b.status,
      analysis_id: 'processed',
      created_at: b.lastUpdated
    }));
  };

  return {
    biomarkers: processBiomarkerData(),
    isLoading,
    error,
    refetch: () => {
      setError(null);
      // Принудительно перезагружаем данные
      if (user?.id) {
        setIsLoading(true);
        // Триггерим повторную загрузку через изменение зависимости
        const fetchData = async () => {
          try {
            const { data: analyses } = await supabase
              .from('medical_analyses')
              .select('*')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false });
            
            setAnalysisHistory(analyses || []);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
          } finally {
            setIsLoading(false);
          }
        };
        fetchData();
      }
    },
    getTop5WorstBiomarkers
  };
};