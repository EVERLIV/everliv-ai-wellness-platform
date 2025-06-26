
import { useState, useEffect } from "react";
import { useSmartAuth } from "@/hooks/useSmartAuth";
import { toast } from "sonner";
import { AnalysisItem, AnalysisStatistics } from "@/types/labAnalyses";
import { labAnalysesService } from "@/services/labAnalysesService";
import { isValidUUID, calculateAnalysisStatistics } from "@/utils/labAnalysesUtils";

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
    console.log('🔄 useLabAnalysesData: Starting fetch for user:', {
      userId: user?.id,
      userEmail: user?.email
    });

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

    try {
      setLoadingHistory(true);

      // Check if user_id is a valid UUID
      if (!isValidUUID(user.id)) {
        console.log('🚫 useLabAnalysesData: Invalid UUID format for user ID:', user.id);
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

      // Fetch analyses data
      const analysesData = await labAnalysesService.fetchAnalysesData(user.id);

      console.log('📊 useLabAnalysesData: Raw analyses data:', {
        count: analysesData.length,
        data: analysesData,
        userId: user.id,
        userEmail: user.email
      });

      if (analysesData.length === 0) {
        console.log('📭 useLabAnalysesData: No analyses found for user:', user.email);
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

      // Fetch biomarkers data
      const analysisIds = analysesData.map(analysis => analysis.id);
      const biomarkerData = await labAnalysesService.fetchBiomarkersData(analysisIds);

      console.log('🧬 useLabAnalysesData: Biomarker data:', biomarkerData);

      // Count biomarkers for each analysis
      const biomarkerCounts: { [key: string]: number } = {};
      biomarkerData.forEach(biomarker => {
        biomarkerCounts[biomarker.analysis_id] = (biomarkerCounts[biomarker.analysis_id] || 0) + 1;
      });

      console.log('📈 useLabAnalysesData: Biomarker counts:', biomarkerCounts);

      // Format analysis data
      const formattedData = labAnalysesService.formatAnalysisData(analysesData, biomarkerCounts);

      console.log('✅ useLabAnalysesData: Formatted analyses data for', user.email, ':', {
        count: formattedData.length,
        analyses: formattedData
      });
      
      setAnalysisHistory(formattedData);
      
      // Calculate statistics
      const newStatistics = calculateAnalysisStatistics(formattedData);

      console.log('📊 useLabAnalysesData: Statistics for', user.email, ':', newStatistics);
      setStatistics(newStatistics);

    } catch (error) {
      console.error('❌ useLabAnalysesData: Error loading analysis history for', user?.email, ':', error);
      
      // Show toast error only for valid users
      if (user?.id && isValidUUID(user.id)) {
        toast.error('Ошибка при загрузке истории анализов');
      }
      
      // Set empty data on error
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
    console.log('🔄 useLabAnalysesData: Manual refresh triggered for user:', user?.email);
    fetchAnalysisHistory();
  };

  useEffect(() => {
    console.log('🎯 useLabAnalysesData: Effect triggered, user:', {
      userId: user?.id,
      userEmail: user?.email
    });
    fetchAnalysisHistory();
  }, [user?.id]);

  return {
    analysisHistory,
    loadingHistory,
    statistics,
    refreshHistory
  };
};
