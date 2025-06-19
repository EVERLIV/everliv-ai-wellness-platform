
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AnalysisItem {
  id: string;
  analysis_type: string;
  created_at: string;
  summary: string;
  markers_count: number;
  input_method: 'text' | 'photo';
}

export interface AnalysisStatistics {
  totalAnalyses: number;
  currentMonthAnalyses: number;
  mostRecentAnalysis: string | null;
  analysisTypes: { [key: string]: number };
}

export const useLabAnalysesData = () => {
  const { user } = useAuth();
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [statistics, setStatistics] = useState<AnalysisStatistics>({
    totalAnalyses: 0,
    currentMonthAnalyses: 0,
    mostRecentAnalysis: null,
    analysisTypes: {}
  });

  const fetchAnalysisHistory = async () => {
    if (!user) {
      setAnalysisHistory([]);
      setLoadingHistory(false);
      return;
    }

    try {
      console.log('Загружаем анализы для пользователя:', user.id);
      
      // Получаем все медицинские анализы
      const { data: analysesData, error: analysesError } = await supabase
        .from('medical_analyses')
        .select('id, analysis_type, created_at, summary, input_method')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (analysesError) {
        console.error('Ошибка при получении анализов:', analysesError);
        throw analysesError;
      }

      console.log('Получены анализы:', analysesData);

      // Получаем количество биомаркеров для каждого анализа
      let biomarkerCounts: { [key: string]: number } = {};
      
      if (analysesData && analysesData.length > 0) {
        const analysisIds = analysesData.map(analysis => analysis.id);
        
        const { data: biomarkerData, error: biomarkerError } = await supabase
          .from('biomarkers')
          .select('analysis_id')
          .in('analysis_id', analysisIds);

        if (biomarkerError) {
          console.error('Ошибка при получении биомаркеров:', biomarkerError);
        } else {
          console.log('Получены биомаркеры:', biomarkerData);
          // Подсчитываем биомаркеры для каждого анализа
          biomarkerCounts = biomarkerData?.reduce((acc: { [key: string]: number }, biomarker) => {
            acc[biomarker.analysis_id] = (acc[biomarker.analysis_id] || 0) + 1;
            return acc;
          }, {}) || {};
        }
      }

      console.log('Количество биомаркеров по анализам:', biomarkerCounts);

      const formattedData: AnalysisItem[] = (analysesData || []).map(item => ({
        id: item.id,
        analysis_type: item.analysis_type,
        created_at: item.created_at,
        summary: item.summary || '',
        markers_count: biomarkerCounts[item.id] || 0,
        input_method: (item.input_method as 'text' | 'photo') || 'text'
      }));

      console.log('Форматированные данные анализов:', formattedData);
      setAnalysisHistory(formattedData);
      
      // Рассчитываем статистику
      const totalAnalyses = formattedData.length;
      
      // Рассчитываем анализы за текущий месяц
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const currentMonthAnalyses = formattedData.filter(
        item => new Date(item.created_at) >= firstDayOfMonth
      ).length;

      // Получаем дату последнего анализа
      const mostRecentAnalysis = formattedData.length > 0 
        ? formattedData[0].created_at 
        : null;

      // Подсчитываем типы анализов
      const analysisTypes: { [key: string]: number } = {};
      formattedData.forEach(item => {
        analysisTypes[item.analysis_type] = (analysisTypes[item.analysis_type] || 0) + 1;
      });

      setStatistics({
        totalAnalyses,
        currentMonthAnalyses,
        mostRecentAnalysis,
        analysisTypes
      });

    } catch (error) {
      console.error('Ошибка при загрузке истории анализов:', error);
      toast.error('Ошибка при загрузке истории анализов');
    } finally {
      setLoadingHistory(false);
    }
  };

  const refreshHistory = () => {
    console.log('Обновляем историю анализов');
    setLoadingHistory(true);
    fetchAnalysisHistory();
  };

  useEffect(() => {
    fetchAnalysisHistory();
  }, [user]);

  return {
    analysisHistory,
    loadingHistory,
    statistics,
    refreshHistory
  };
};
