
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useHealthProfile } from "@/hooks/useHealthProfile";
import { useLabAnalysesData } from "@/hooks/useLabAnalysesData";

export interface AnalyticsData {
  healthScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  biologicalAge: number;
  trends: {
    improving: boolean;
    changePercent: number;
  };
}

export const useAnalyticsData = () => {
  const { user } = useAuth();
  const { healthProfile } = useHealthProfile();
  const { statistics } = useLabAnalysesData();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const calculateAnalytics = () => {
      if (!user || !healthProfile) {
        setAnalytics(null);
        setIsLoading(false);
        return;
      }

      // Базовый расчет индекса здоровья
      let healthScore = 50;
      
      // Факторы здоровья
      if (healthProfile.age && healthProfile.age < 40) healthScore += 10;
      if (healthProfile.physicalActivity === 'very_active') healthScore += 15;
      else if (healthProfile.physicalActivity === 'moderate') healthScore += 10;
      
      if (healthProfile.sleepHours && healthProfile.sleepHours >= 7 && healthProfile.sleepHours <= 9) {
        healthScore += 10;
      }
      
      if (healthProfile.stressLevel && healthProfile.stressLevel <= 3) healthScore += 10;
      if (healthProfile.smokingStatus === 'never') healthScore += 15;
      
      // Влияние анализов
      if (statistics.totalAnalyses > 0) healthScore += 5;
      if (statistics.totalAnalyses > 5) healthScore += 5;

      // Ограничиваем значение
      healthScore = Math.min(100, Math.max(0, healthScore));

      // Определяем уровень риска
      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      if (healthScore < 40) riskLevel = 'high';
      else if (healthScore < 70) riskLevel = 'medium';

      // Биологический возраст (упрощенный расчет)
      const chronologicalAge = healthProfile.age || 35;
      const ageFactor = (100 - healthScore) * 0.3;
      const biologicalAge = Math.round(chronologicalAge + ageFactor);

      setAnalytics({
        healthScore,
        riskLevel,
        biologicalAge,
        trends: {
          improving: healthScore > 60,
          changePercent: Math.round((healthScore - 50) * 0.5)
        }
      });
      
      setIsLoading(false);
    };

    calculateAnalytics();
  }, [user, healthProfile, statistics]);

  return { analytics, isLoading };
};
