
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
import AnalyticsHeader from "@/components/analytics/AnalyticsHeader";
import AnalyticsLoadingIndicator from "@/components/analytics/AnalyticsLoadingIndicator";
import AnalysisDetailsView from "@/components/analytics/AnalysisDetailsView";
import AnalyticsMainView from "@/components/analytics/AnalyticsMainView";
import NoAnalyticsState from "@/components/analytics/NoAnalyticsState";
import AnalyticsSummary from "@/components/analytics/AnalyticsSummary";
import DetailedHealthRecommendations from "@/components/analytics/DetailedHealthRecommendations";
import { useCachedAnalytics } from "@/hooks/useCachedAnalytics";
import { useAnalysisDetails } from "@/hooks/useAnalysisDetails";
import { generateDetailedRecommendations } from "@/utils/detailedRecommendationsGenerator";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const analysisId = searchParams.get('id');
  
  // Состояния для доктора
  const [doctorQuestion, setDoctorQuestion] = useState("");
  const [doctorResponse, setDoctorResponse] = useState("");
  const [isProcessingQuestion, setIsProcessingQuestion] = useState(false);
  
  // Хуки для управления состоянием
  const {
    analytics,
    isLoading: isLoadingAnalytics,
    isGenerating,
    loadingStep,
    generateAnalytics
  } = useCachedAnalytics();
  
  const { analysisData, isLoading: isLoadingAnalysis } = useAnalysisDetails(analysisId);

  // Обработка вопроса доктору
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

  console.log('Analytics Page State:', {
    user: !!user,
    analysisId,
    hasAnalysisData: !!analysisData,
    hasAnalytics: !!analytics,
    isLoadingAnalysis,
    isLoadingAnalytics,
    isGenerating,
    loadingStep
  });

  // Проверка пользователя
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Для доступа к аналитике необходимо войти в систему</p>
      </div>
    );
  }

  // Просмотр конкретного анализа
  if (analysisId) {
    return (
      <AnalysisDetailsView 
        analysisData={analysisData}
        isLoading={isLoadingAnalysis}
      />
    );
  }

  // Показываем индикатор загрузки если идет генерация
  if (isGenerating) {
    console.log('Rendering loading indicator');
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="pt-16">
          <AnalyticsLoadingIndicator 
            isGenerating={isGenerating}
            loadingStep={loadingStep}
          />
        </div>
        <MinimalFooter />
      </div>
    );
  }

  // Показываем начальную загрузку только для общей аналитики
  if (isLoadingAnalytics) {
    console.log('Rendering initial loading');
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-grow flex items-center justify-center pt-16">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-gray-500">Загрузка аналитики...</p>
          </div>
        </div>
        <MinimalFooter />
      </div>
    );
  }

  // Если аналитика не сгенерирована
  if (!analytics) {
    console.log('Rendering no analytics state');
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="pt-16">
          <AnalyticsHeader 
            healthScore={0}
            riskLevel="unknown"
          />
          <NoAnalyticsState 
            onGenerateAnalytics={generateAnalytics}
            isGenerating={isGenerating}
          />
        </div>
        <MinimalFooter />
      </div>
    );
  }

  // Показываем сгенерированную аналитику
  console.log('Rendering analytics data');
  
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

  // Генерируем детальные рекомендации
  const detailedRecommendations = generateDetailedRecommendations(analytics);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="pt-16">
        <AnalyticsMainView 
          analytics={analytics}
          onGenerateAnalytics={generateAnalytics}
          isGenerating={isGenerating}
        />
        
        <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
          {/* Детальные рекомендации */}
          <DetailedHealthRecommendations
            recommendations={detailedRecommendations.recommendations}
            riskFactors={detailedRecommendations.riskFactors}
            supplements={detailedRecommendations.supplements}
            specialists={detailedRecommendations.specialists}
            tests={detailedRecommendations.tests}
          />

          <AnalyticsSummary 
            healthData={healthData}
            onDoctorQuestion={handleDoctorQuestion}
            doctorQuestion={doctorQuestion}
            setDoctorQuestion={setDoctorQuestion}
            doctorResponse={doctorResponse}
            isProcessingQuestion={isProcessingQuestion}
          />
        </div>
      </div>
      <MinimalFooter />
    </div>
  );
};

export default Analytics;
