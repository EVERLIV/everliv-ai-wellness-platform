import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLabAnalysesData } from '@/hooks/useLabAnalysesData';
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
  const { analysisHistory, loadingHistory } = useLabAnalysesData();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загружаем профиль пользователя для определения норм
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

  // Синхронизируем состояние загрузки с useLabAnalysesData
  useEffect(() => {
    setIsLoading(loadingHistory);
  }, [loadingHistory]);

  // Функция для обработки данных биомаркеров - та же логика, что и в MyBiomarkers
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
            // Используем данные из results (более полные)
            const normalRange = marker.referenceRange || marker.reference_range || marker.normal_range || marker.normalRange || 
                               getBiomarkerNorm(name, userProfile?.gender, userProfile?.date_of_birth) || 'Не определена';
            
            // Извлекаем единицу измерения из value или используем отдельное поле unit
            let unit = marker.unit || '';
            let cleanValue = marker.value || '';
            
            // Если единица в самом значении, извлекаем её
            if (typeof cleanValue === 'string' && /[a-zA-Zа-яА-Я%/°^]/.test(cleanValue)) {
              const valueMatch = cleanValue.match(/^([0-9,.\s]+)(.*)$/);
              if (valueMatch) {
                cleanValue = valueMatch[1].trim();
                unit = unit || valueMatch[2].trim();
              }
            }
            
            // Вычисляем статус на основе значения и нормы
            const calculatedStatus = calculateBiomarkerStatus(cleanValue, normalRange);
            
            biomarkerMap.set(name, {
              values: [],
              normalRange,
              status: calculatedStatus,
              unit
            });
          }
          
          const biomarkerData = biomarkerMap.get(name)!;
          
          // Извлекаем чистое значение без единиц для расчетов
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
          
          // Обновляем статус для последнего значения
          const latestStatus = calculateBiomarkerStatus(cleanValue, biomarkerData.normalRange);
          biomarkerData.status = latestStatus;
        });
      }
    });

    // Функция для расчета процентного отклонения от нормы
    const calculateDeviationPercentage = (value: string, normalRange: string, status: string): number | undefined => {
      if (status === 'normal' || !normalRange || normalRange === 'Не определена') return undefined;
      
      // Нормализуем значение - заменяем запятую на точку
      const currentValue = parseFloat(value.replace(',', '.'));
      if (isNaN(currentValue)) return undefined;

      // Парсим норму (например, "120-150 г/л" или ">1.0 ммоль/л")
      let minNormal = 0;
      let maxNormal = 0;

      // Обработка различных форматов норм
      if (normalRange.includes('-')) {
        const parts = normalRange.split('-');
        const min = parseFloat(parts[0].trim().replace(',', '.'));
        const max = parseFloat(parts[1].trim().replace(',', '.'));
        if (!isNaN(min) && !isNaN(max)) {
          minNormal = min;
          maxNormal = max;
        }
      } else if (normalRange.startsWith('>')) {
        const min = parseFloat(normalRange.substring(1).replace(',', '.'));
        if (!isNaN(min)) {
          minNormal = min;
          maxNormal = Infinity;
        }
      } else if (normalRange.startsWith('<')) {
        const max = parseFloat(normalRange.substring(1).replace(',', '.'));
        if (!isNaN(max)) {
          minNormal = 0;
          maxNormal = max;
        }
      } else {
        // Попытка извлечь число из строки
        const match = normalRange.match(/(\d+(?:[,.]\d+)?)/);
        if (match) {
          const value = parseFloat(match[1].replace(',', '.'));
          if (!isNaN(value)) {
            minNormal = maxNormal = value;
          }
        }
      }

      let deviation = 0;
      if (status === 'high' && maxNormal !== Infinity && maxNormal > 0) {
        deviation = ((currentValue - maxNormal) / maxNormal) * 100;
      } else if (status === 'low' && minNormal > 0) {
        deviation = ((minNormal - currentValue) / minNormal) * 100;
      }

      return Math.abs(deviation);
    };

    const calculateTrend = (values: Array<{ value: string; date: string }>): 'up' | 'down' | 'stable' => {
      if (values.length < 2) return 'stable';
      
      // Нормализуем значения - заменяем запятые на точки для парсинга
      const first = parseFloat(values[0].value.replace(',', '.'));
      const last = parseFloat(values[values.length - 1].value.replace(',', '.'));
      
      if (isNaN(first) || isNaN(last)) return 'stable';
      
      const change = ((last - first) / first) * 100;
      
      if (Math.abs(change) < 5) return 'stable';
      return change > 0 ? 'up' : 'down';
    };

    // Преобразуем в массив с вычислением трендов
    return Array.from(biomarkerMap.entries()).map(([name, data]) => {
      const sortedValues = data.values.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const latestValue = sortedValues[sortedValues.length - 1];
      const trend = sortedValues.length > 1 ? 
        calculateTrend(sortedValues) : 'stable';

      // Для отображения используем оригинальное значение с единицами
      const displayValue = latestValue.unit ? 
        `${latestValue.value} ${latestValue.unit}` : 
        latestValue.value;

      const deviationPercentage = calculateDeviationPercentage(
        latestValue.value.replace(',', '.'), // Нормализуем для расчетов
        data.normalRange, 
        data.status
      );

      return {
        name,
        latestValue: displayValue,
        normalRange: data.normalRange,
        status: data.status,
        lastUpdated: latestValue.date,
        analysisCount: sortedValues.length,
        trend,
        deviationPercentage,
        unit: data.unit
      };
    }).sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
  };

  // Функция для получения топ-5 критических биомаркеров
  const getTop5WorstBiomarkers = (): Biomarker[] => {
    console.log('=== DEBUG: getTop5WorstBiomarkers (обновленная версия) ===');
    
    const biomarkers = processBiomarkerData();
    console.log('Всего биомаркеров обработано:', biomarkers.length);
    
    if (!biomarkers.length) {
      console.log('Нет биомаркеров для анализа');
      return [];
    }

    // Фильтруем только биомаркеры с отклонениями (high или low)
    const problematicBiomarkers = biomarkers.filter(b => b.status === 'high' || b.status === 'low');
    
    console.log('Биомаркеры с отклонениями:', problematicBiomarkers.length);
    console.log('Детали биомаркеров:', problematicBiomarkers.map(b => ({
      name: b.name,
      status: b.status,
      value: b.latestValue,
      deviationPercentage: b.deviationPercentage
    })));

    // Сортируем по степени отклонения (сначала с наибольшим процентом отклонения)
    const sortedBiomarkers = problematicBiomarkers.sort((a, b) => {
      // Сначала по критичности статуса
      const statusPriority = { 'high': 1, 'low': 2 };
      const statusDiff = statusPriority[a.status] - statusPriority[b.status];
      
      if (statusDiff !== 0) return statusDiff;
      
      // Затем по проценту отклонения
      const aDeviation = a.deviationPercentage || 0;
      const bDeviation = b.deviationPercentage || 0;
      return bDeviation - aDeviation;
    }).slice(0, 5);

    console.log('Топ-5 критических биомаркеров:', sortedBiomarkers.map(b => ({
      name: b.name,
      status: b.status,
      value: b.latestValue,
      deviationPercentage: b.deviationPercentage
    })));

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
      // Данные обновляются автоматически через useLabAnalysesData
      setError(null);
    },
    getTop5WorstBiomarkers
  };
};