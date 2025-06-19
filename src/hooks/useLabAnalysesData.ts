
import { useState, useEffect } from "react";
import { useSmartAuth } from "@/hooks/useSmartAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AnalysisItem {
  id: string;
  analysis_type: string;
  created_at: string;
  summary: string;
  markers_count: number;
  input_method: 'text' | 'photo';
  results?: any;
}

export interface AnalysisStatistics {
  totalAnalyses: number;
  currentMonthAnalyses: number;
  mostRecentAnalysis: string | null;
  analysisTypes: { [key: string]: number };
}

// Helper function to safely parse results
const parseAnalysisResults = (results: any) => {
  if (!results) return null;
  
  // If results is already an object, return it
  if (typeof results === 'object' && results !== null) {
    return results;
  }
  
  // If results is a string, try to parse it as JSON
  if (typeof results === 'string') {
    try {
      return JSON.parse(results);
    } catch (error) {
      console.warn('Failed to parse results as JSON:', error);
      return null;
    }
  }
  
  return null;
};

// Helper function to validate UUID format
const isValidUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export const useLabAnalysesData = () => {
  const { user } = useSmartAuth();
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [statistics, setStatistics] = useState<AnalysisStatistics>({
    totalAnalyses: 0,
    currentMonthAnalyses: 0,
    mostRecentAnalysis: null,
    analysisTypes: {}
  });

  const fetchAnalysisHistory = async () => {
    if (!user?.id) {
      console.log('🚫 useLabAnalysesData: No user ID, clearing data');
      setAnalysisHistory([]);
      setStatistics({
        totalAnalyses: 0,
        currentMonthAnalyses: 0,
        mostRecentAnalysis: null,
        analysisTypes: {}
      });
      setLoadingHistory(false);
      return;
    }

    // Проверяем, является ли user_id валидным UUID
    if (!isValidUUID(user.id)) {
      console.log('🚫 useLabAnalysesData: Invalid UUID format for user ID:', user.id, 'using mock data for dev');
      
      // Для dev-режима возвращаем пустые данные без ошибки
      setAnalysisHistory([]);
      setStatistics({
        totalAnalyses: 0,
        currentMonthAnalyses: 0,
        mostRecentAnalysis: null,
        analysisTypes: {}
      });
      setLoadingHistory(false);
      return;
    }

    try {
      console.log('🔄 useLabAnalysesData: Fetching analyses for user:', user.id);
      setLoadingHistory(true);
      
      // Получаем все медицинские анализы с подробной информацией
      const { data: analysesData, error: analysesError } = await supabase
        .from('medical_analyses')
        .select(`
          id, 
          analysis_type, 
          created_at, 
          summary, 
          input_method,
          results
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (analysesError) {
        console.error('❌ useLabAnalysesData: Error fetching analyses:', analysesError);
        throw analysesError;
      }

      console.log('📊 useLabAnalysesData: Raw analyses data:', analysesData);

      if (!analysesData || analysesData.length === 0) {
        console.log('📭 useLabAnalysesData: No analyses found');
        setAnalysisHistory([]);
        setStatistics({
          totalAnalyses: 0,
          currentMonthAnalyses: 0,
          mostRecentAnalysis: null,
          analysisTypes: {}
        });
        setLoadingHistory(false);
        return;
      }

      // Получаем количество биомаркеров для каждого анализа
      const analysisIds = analysesData.map(analysis => analysis.id);
      console.log('🔍 useLabAnalysesData: Fetching biomarkers for analysis IDs:', analysisIds);
      
      const { data: biomarkerData, error: biomarkerError } = await supabase
        .from('biomarkers')
        .select('analysis_id')
        .in('analysis_id', analysisIds);

      if (biomarkerError) {
        console.error('⚠️ useLabAnalysesData: Error fetching biomarkers:', biomarkerError);
      }

      console.log('🧬 useLabAnalysesData: Biomarker data:', biomarkerData);

      // Подсчитываем биомаркеры для каждого анализа
      const biomarkerCounts: { [key: string]: number } = {};
      if (biomarkerData && biomarkerData.length > 0) {
        biomarkerData.forEach(biomarker => {
          biomarkerCounts[biomarker.analysis_id] = (biomarkerCounts[biomarker.analysis_id] || 0) + 1;
        });
      }

      console.log('📈 useLabAnalysesData: Biomarker counts:', biomarkerCounts);

      // Форматируем данные анализов
      const formattedData: AnalysisItem[] = analysesData.map(item => {
        const markersCount = biomarkerCounts[item.id] || 0;
        
        // Безопасно парсим results
        const parsedResults = parseAnalysisResults(item.results);
        
        // Пытаемся получить количество маркеров из results, если нет биомаркеров в отдельной таблице
        let finalMarkersCount = markersCount;
        if (markersCount === 0 && parsedResults?.markers && Array.isArray(parsedResults.markers)) {
          finalMarkersCount = parsedResults.markers.length;
        }

        console.log(`📋 useLabAnalysesData: Analysis ${item.id}:`, {
          type: item.analysis_type,
          created: item.created_at,
          biomarkersFromTable: markersCount,
          biomarkersFromResults: parsedResults?.markers?.length || 0,
          finalCount: finalMarkersCount
        });

        return {
          id: item.id,
          analysis_type: item.analysis_type,
          created_at: item.created_at,
          summary: item.summary || '',
          markers_count: finalMarkersCount,
          input_method: (item.input_method as 'text' | 'photo') || 'text',
          results: parsedResults
        };
      });

      console.log('✅ useLabAnalysesData: Formatted analyses data:', formattedData);
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

      const newStatistics = {
        totalAnalyses,
        currentMonthAnalyses,
        mostRecentAnalysis,
        analysisTypes
      };

      console.log('📊 useLabAnalysesData: Statistics:', newStatistics);
      setStatistics(newStatistics);

    } catch (error) {
      console.error('❌ useLabAnalysesData: Error loading analysis history:', error);
      
      // Не показываем toast-ошибку для dev-пользователей с невалидным UUID
      if (user?.id && isValidUUID(user.id)) {
        toast.error('Ошибка при загрузке истории анализов');
      }
      
      // Устанавливаем пустые данные при ошибке
      setAnalysisHistory([]);
      setStatistics({
        totalAnalyses: 0,
        currentMonthAnalyses: 0,
        mostRecentAnalysis: null,
        analysisTypes: {}
      });
    } finally {
      setLoadingHistory(false);
    }
  };

  const refreshHistory = () => {
    console.log('🔄 useLabAnalysesData: Manual refresh triggered');
    fetchAnalysisHistory();
  };

  useEffect(() => {
    console.log('🎯 useLabAnalysesData: Effect triggered, user:', user?.id);
    fetchAnalysisHistory();
  }, [user?.id]);

  return {
    analysisHistory,
    loadingHistory,
    statistics,
    refreshHistory
  };
};
