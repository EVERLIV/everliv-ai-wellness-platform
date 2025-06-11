
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
      const { data, error } = await supabase
        .from('medical_analyses')
        .select(`
          id,
          analysis_type,
          created_at,
          summary,
          input_method,
          biomarkers (count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData: AnalysisItem[] = (data || []).map(item => ({
        id: item.id,
        analysis_type: item.analysis_type,
        created_at: item.created_at,
        summary: item.summary || '',
        markers_count: item.biomarkers?.[0]?.count || 0,
        input_method: item.input_method || 'text'
      }));

      setAnalysisHistory(formattedData);
      
      // Calculate statistics
      const totalAnalyses = formattedData.length;
      
      // Calculate current month analyses
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const currentMonthAnalyses = formattedData.filter(
        item => new Date(item.created_at) >= firstDayOfMonth
      ).length;

      // Get most recent analysis date
      const mostRecentAnalysis = formattedData.length > 0 
        ? formattedData[0].created_at 
        : null;

      // Count analysis types
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
      console.error('Error fetching analysis history:', error);
      toast.error('Ошибка при загрузке истории анализов');
    } finally {
      setLoadingHistory(false);
    }
  };

  const refreshHistory = () => {
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
