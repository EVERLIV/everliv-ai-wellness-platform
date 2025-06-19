
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
  totalAnalyses: number;
  totalConsultations: number;
  hasRecentActivity: boolean;
  trendsAnalysis: {
    improving: number;
    worsening: number;
    stable: number;
  };
  recentActivities: Array<{
    title: string;
    time: string;
    icon: string;
    iconColor: string;
    iconBg: string;
  }>;
  lastUpdated: string;
  recommendations?: string[];
  strengths?: string[];
  concerns?: string[];
  scoreExplanation?: string;
  riskDescription?: string;
  lastAnalysisDate?: string;
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

      // Создаем полную аналитику
      const fullAnalytics: AnalyticsData = {
        healthScore,
        riskLevel,
        biologicalAge,
        trends: {
          improving: healthScore > 60,
          changePercent: Math.round((healthScore - 50) * 0.5)
        },
        totalAnalyses: statistics.totalAnalyses,
        totalConsultations: 0,
        hasRecentActivity: statistics.totalAnalyses > 0,
        trendsAnalysis: {
          improving: healthScore > 60 ? 3 : 1,
          worsening: healthScore < 40 ? 2 : 0,
          stable: 2
        },
        recentActivities: [],
        lastUpdated: new Date().toISOString(),
        recommendations: ['Продолжайте поддерживать активный образ жизни'],
        strengths: ['Регулярный мониторинг здоровья'],
        concerns: healthScore < 40 ? ['Требуется внимание к показателям здоровья'] : [],
        scoreExplanation: `Балл рассчитан на основе возраста, физической активности, сна и других факторов`,
        riskDescription: riskLevel === 'high' ? 'Высокий риск' : riskLevel === 'medium' ? 'Средний риск' : 'Низкий риск'
      };

      setAnalytics(fullAnalytics);
      setIsLoading(false);
    };

    calculateAnalytics();
  }, [user, healthProfile, statistics]);

  return { analytics, isLoading, setAnalytics };
};
