
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getMedicalAnalysesHistory } from "@/services/ai/medical-analysis";
import { toast } from "sonner";

interface Statistics {
  total: number;
  normal: number;
  attention: number;
}

export const useLabAnalysesData = () => {
  const { user } = useAuth();
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Load analysis history
  useEffect(() => {
    const loadHistory = async () => {
      if (!user) return;
      
      try {
        setLoadingHistory(true);
        const history = await getMedicalAnalysesHistory(user.id);
        setAnalysisHistory(history);
      } catch (error) {
        console.error("Ошибка загрузки истории:", error);
        toast.error("Не удалось загрузить историю анализов");
      } finally {
        setLoadingHistory(false);
      }
    };

    loadHistory();
  }, [user]);

  // Function to calculate statistics
  const getStatistics = (): Statistics => {
    if (!analysisHistory || analysisHistory.length === 0) {
      return { total: 0, normal: 0, attention: 0 };
    }

    let normal = 0;
    let attention = 0;

    analysisHistory.forEach(analysis => {
      if (analysis.results?.markers) {
        analysis.results.markers.forEach(marker => {
          if (marker.status === 'optimal' || marker.status === 'good') {
            normal++;
          } else if (marker.status === 'attention' || marker.status === 'risk' || marker.status === 'high' || marker.status === 'low' || marker.status === 'critical') {
            attention++;
          }
        });
      }
    });

    return {
      total: analysisHistory.length,
      normal,
      attention
    };
  };

  // Function to refresh history
  const refreshHistory = async () => {
    if (user) {
      try {
        const history = await getMedicalAnalysesHistory(user.id);
        setAnalysisHistory(history);
      } catch (error) {
        console.error("Ошибка обновления истории:", error);
        toast.error("Не удалось обновить историю анализов");
      }
    }
  };

  return {
    analysisHistory,
    loadingHistory,
    statistics: getStatistics(),
    refreshHistory,
  };
};
