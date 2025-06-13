
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import HealthOverviewCards from "./HealthOverviewCards";
import DetailedHealthRecommendations from "./DetailedHealthRecommendations";
import AnalyticsSummary from "./AnalyticsSummary";
import AnalyticsActions from "./AnalyticsActions";
import { CachedAnalytics } from "@/types/analytics";

interface AnalyticsContentProps {
  analytics: CachedAnalytics;
  onRefresh: () => void;
  isGenerating: boolean;
}

interface HealthData {
  overview: {
    healthScore: number;
    riskLevel: string;
    lastUpdated: string;
    totalAnalyses: number;
    trendsAnalysis: {
      improving: number;
      worsening: number;
      stable: number;
    };
  };
  healthImprovementActions: Array<any>;
  recommendedTests: Array<any>;
  specialistConsultations: Array<any>;
  keyHealthIndicators: Array<any>;
  lifestyleRecommendations: Array<any>;
  riskFactors: Array<any>;
  supplements: Array<any>;
}

const AnalyticsContent: React.FC<AnalyticsContentProps> = ({
  analytics,
  onRefresh,
  isGenerating
}) => {
  const { user } = useAuth();
  const [doctorQuestion, setDoctorQuestion] = useState("");
  const [doctorResponse, setDoctorResponse] = useState("");
  const [isProcessingQuestion, setIsProcessingQuestion] = useState(false);

  const handleDoctorQuestion = async () => {
    if (!doctorQuestion.trim()) return;
    
    setIsProcessingQuestion(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-doctor-analytics', {
        body: {
          question: doctorQuestion,
          healthData: analytics,
          userId: user?.id
        }
      });

      if (error) throw error;
      
      setDoctorResponse(data.response);
    } catch (error) {
      console.error('Error processing doctor question:', error);
      toast.error('Ошибка обработки вопроса');
    } finally {
      setIsProcessingQuestion(false);
    }
  };

  const healthData: HealthData = {
    overview: {
      healthScore: analytics.healthScore,
      riskLevel: analytics.riskLevel,
      lastUpdated: analytics.lastUpdated,
      totalAnalyses: analytics.totalAnalyses,
      trendsAnalysis: analytics.trendsAnalysis
    },
    healthImprovementActions: [],
    recommendedTests: [],
    specialistConsultations: [],
    keyHealthIndicators: [],
    lifestyleRecommendations: [],
    riskFactors: [],
    supplements: []
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      <AnalyticsActions 
        onRefresh={onRefresh}
        isGenerating={isGenerating}
      />

      <HealthOverviewCards 
        analytics={analytics}
      />

      <DetailedHealthRecommendations
        analytics={analytics}
      />

      <AnalyticsSummary 
        healthData={healthData}
        onDoctorQuestion={handleDoctorQuestion}
        doctorQuestion={doctorQuestion}
        setDoctorQuestion={setDoctorQuestion}
        doctorResponse={doctorResponse}
        isProcessingQuestion={isProcessingQuestion}
      />

      {analytics.lastUpdated && (
        <div className="text-center text-sm text-gray-500">
          Последнее обновление: {new Date(analytics.lastUpdated).toLocaleString('ru-RU')}
        </div>
      )}
    </div>
  );
};

export default AnalyticsContent;
