
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

  // Function to calculate statistics based on analysis count, not markers
  const getStatistics = (): Statistics => {
    if (!analysisHistory || analysisHistory.length === 0) {
      return { total: 0, normal: 0, attention: 0 };
    }

    let normal = 0;
    let attention = 0;

    analysisHistory.forEach(analysis => {
      if (analysis.results?.riskLevel) {
        if (analysis.results.riskLevel === 'low') {
          normal++;
        } else if (analysis.results.riskLevel === 'medium' || analysis.results.riskLevel === 'high') {
          attention++;
        }
      } else if (analysis.results?.markers) {
        // Fallback: if no riskLevel, calculate based on markers
        const riskMarkers = analysis.results.markers.filter(marker => 
          marker.status === 'attention' || marker.status === 'risk' || 
          marker.status === 'high' || marker.status === 'low' || marker.status === 'critical'
        );
        
        if (riskMarkers.length === 0) {
          normal++;
        } else {
          attention++;
        }
      } else {
        // If no data available, assume normal
        normal++;
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
