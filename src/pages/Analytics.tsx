
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
import AnalyticsHeader from "@/components/analytics/AnalyticsHeader";
import AnalyticsSummary from "@/components/analytics/AnalyticsSummary";
import BiomarkersList from "@/components/analytics/BiomarkersList";
import BiomarkerDetails from "@/components/analytics/BiomarkerDetails";
import HealthOverviewCards from "@/components/analytics/HealthOverviewCards";
import HealthImprovementActions from "@/components/analytics/HealthImprovementActions";
import RecommendedTests from "@/components/analytics/RecommendedTests";
import SpecialistConsultations from "@/components/analytics/SpecialistConsultations";
import KeyHealthIndicators from "@/components/analytics/KeyHealthIndicators";
import LifestyleRecommendations from "@/components/analytics/LifestyleRecommendations";
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
  biomarkers: Array<{
    id: string;
    name: string;
    value: number;
    unit: string;
    status: 'optimal' | 'good' | 'attention' | 'risk';
    trend: 'up' | 'down' | 'stable';
    referenceRange: string;
    lastMeasured: string;
  }>;
  healthImprovementActions: Array<{
    id: string;
    category: string;
    title: string;
    priority: 'high' | 'medium' | 'low';
    actions: string[];
    expectedResult: string;
  }>;
  recommendedTests: Array<{
    id: string;
    name: string;
    frequency: string;
    priority: 'high' | 'medium' | 'low';
    reason: string;
    includes: string[];
  }>;
  specialistConsultations: Array<{
    id: string;
    specialist: string;
    urgency: string;
    reason: string;
    purpose: string;
    preparation: string;
  }>;
  keyHealthIndicators: Array<{
    id: string;
    category: string;
    indicators: Array<{
      name: string;
      target: string;
      importance: string;
      frequency: string;
    }>;
  }>;
  lifestyleRecommendations: Array<{
    id: string;
    category: string;
    recommendations: Array<{
      advice: string;
      benefit: string;
      howTo: string;
    }>;
  }>;
  riskFactors: Array<{
    id: string;
    factor: string;
    level: 'high' | 'medium' | 'low';
    description: string;
    mitigation: string;
    timeframe?: string;
  }>;
  supplements: Array<{
    id: string;
    name: string;
    dosage: string;
    benefit: string;
    timing: string;
    duration?: string;
    interactions?: string;
    expectedImprovement?: string;
  }>;
}

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [selectedBiomarker, setSelectedBiomarker] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [doctorQuestion, setDoctorQuestion] = useState("");
  const [doctorResponse, setDoctorResponse] = useState("");
  const [isProcessingQuestion, setIsProcessingQuestion] = useState(false);

  useEffect(() => {
    if (user) {
      loadHealthData();
    }
  }, [user]);

  const loadHealthData = async () => {
    try {
      setIsLoading(true);
      
      const { data: analyses, error } = await supabase
        .from('medical_analyses')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (analyses && analyses.length > 0) {
        await generateComprehensiveAnalytics(analyses);
      } else {
        setHealthData(generateDemoHealthData());
      }
    } catch (error) {
      console.error('Error loading health data:', error);
      toast.error('Ошибка загрузки данных аналитики');
      setHealthData(generateDemoHealthData());
    } finally {
      setIsLoading(false);
    }
  };

  const generateComprehensiveAnalytics = async (analyses: any[]) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-health-analytics', {
        body: { analyses, userId: user?.id }
      });

      if (error) throw error;
      
      setHealthData(data.healthData);
    } catch (error) {
      console.error('Error generating analytics:', error);
      setHealthData(generateDemoHealthData());
    }
  };

  const generateDemoHealthData = (): HealthData => {
    return {
      overview: {
        healthScore: 78,
        riskLevel: 'medium',
        lastUpdated: new Date().toISOString(),
        totalAnalyses: 3,
        trendsAnalysis: {
          improving: 2,
          worsening: 1,
          stable: 4
        }
      },
      biomarkers: [
        {
          id: '1',
          name: 'Холестерин общий',
          value: 5.2,
          unit: 'ммоль/л',
          status: 'attention',
          trend: 'up',
          referenceRange: '3.3-5.2',
          lastMeasured: '2024-01-15'
        }
      ],
      healthImprovementActions: [
        {
          id: '1',
          category: 'Сердечно-сосудистая система',
          title: 'Нормализация уровня холестерина',
          priority: 'high',
          actions: [
            'Исключить трансжиры и ограничить насыщенные жиры',
            'Добавить 25-30г клетчатки в день'
          ],
          expectedResult: 'Снижение холестерина на 10-15% за 2-3 месяца'
        }
      ],
      recommendedTests: [
        {
          id: '1',
          name: 'Расширенный анализ крови',
          frequency: 'Каждые 3-6 месяцев',
          priority: 'high',
          reason: 'Базовая оценка состояния здоровья',
          includes: ['Общий анализ', 'Биохимия', 'Липидный профиль']
        }
      ],
      specialistConsultations: [
        {
          id: '1',
          specialist: 'Кардиолог',
          urgency: 'В течение месяца',
          reason: 'Повышенный холестерин',
          purpose: 'Оценка рисков, назначение лечения',
          preparation: 'Принести результаты анализов'
        }
      ],
      keyHealthIndicators: [
        {
          id: '1',
          category: 'Сердечно-сосудистая система',
          indicators: [
            {
              name: 'Общий холестерин',
              target: '< 5.2 ммоль/л',
              importance: 'Основной фактор риска атеросклероза',
              frequency: 'Каждые 3-6 месяцев'
            }
          ]
        }
      ],
      lifestyleRecommendations: [
        {
          id: '1',
          category: 'Питание',
          recommendations: [
            {
              advice: 'Средиземноморская диета',
              benefit: 'Снижение холестерина и воспаления',
              howTo: 'Больше рыбы, оливкового масла, орехов'
            }
          ]
        }
      ],
      riskFactors: [
        {
          id: '1',
          factor: 'Повышенный холестерин',
          level: 'medium',
          description: 'Умеренное превышение нормы',
          mitigation: 'Коррекция диеты и образа жизни'
        }
      ],
      supplements: [
        {
          id: '1',
          name: 'Омега-3',
          dosage: '1000-2000 мг/день',
          benefit: 'Поддержка сердца и мозга',
          timing: 'С едой'
        }
      ]
    };
  };

  const handleDoctorQuestion = async () => {
    if (!doctorQuestion.trim()) return;
    
    setIsProcessingQuestion(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-doctor-analytics', {
        body: {
          question: doctorQuestion,
          healthData: healthData,
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

  // Convert health improvement actions to recommendations format for BiomarkerDetails
  const convertToRecommendations = (actions: HealthData['healthImprovementActions']) => {
    return actions.map(action => ({
      id: action.id,
      category: action.category,
      title: action.title,
      description: action.expectedResult,
      action: action.actions.join('. '),
      priority: action.priority
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Для доступа к аналитике необходимо войти в систему</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-grow flex items-center justify-center pt-16">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-gray-500">Генерация персональной аналитики здоровья...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="pt-16">
        <AnalyticsHeader 
          healthScore={healthData?.overview.healthScore || 0}
          riskLevel={healthData?.overview.riskLevel || 'unknown'}
        />
        
        <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
          {/* Health Overview Cards */}
          {healthData?.overview?.trendsAnalysis && (
            <HealthOverviewCards 
              trendsAnalysis={healthData.overview.trendsAnalysis}
              totalAnalyses={healthData.overview.totalAnalyses}
            />
          )}

          {/* Health Improvement Actions */}
          {healthData?.healthImprovementActions && (
            <HealthImprovementActions actions={healthData.healthImprovementActions} />
          )}

          {/* Recommended Tests */}
          {healthData?.recommendedTests && (
            <RecommendedTests tests={healthData.recommendedTests} />
          )}

          {/* Specialist Consultations */}
          {healthData?.specialistConsultations && (
            <SpecialistConsultations consultations={healthData.specialistConsultations} />
          )}

          {/* Key Health Indicators */}
          {healthData?.keyHealthIndicators && (
            <KeyHealthIndicators indicators={healthData.keyHealthIndicators} />
          )}

          {/* Lifestyle Recommendations */}
          {healthData?.lifestyleRecommendations && (
            <LifestyleRecommendations recommendations={healthData.lifestyleRecommendations} />
          )}

          {/* Analytics Summary with Doctor Chat */}
          <AnalyticsSummary 
            healthData={healthData}
            onDoctorQuestion={handleDoctorQuestion}
            doctorQuestion={doctorQuestion}
            setDoctorQuestion={setDoctorQuestion}
            doctorResponse={doctorResponse}
            isProcessingQuestion={isProcessingQuestion}
          />
          
          {/* Biomarkers List and Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <BiomarkersList 
                biomarkers={healthData?.biomarkers || []}
                selectedBiomarker={selectedBiomarker}
                onSelectBiomarker={setSelectedBiomarker}
              />
            </div>
            
            <div className="lg:col-span-2">
              <BiomarkerDetails 
                biomarker={healthData?.biomarkers.find(b => b.id === selectedBiomarker)}
                recommendations={healthData?.healthImprovementActions ? convertToRecommendations(healthData.healthImprovementActions) : []}
                riskFactors={healthData?.riskFactors || []}
                supplements={healthData?.supplements || []}
              />
            </div>
          </div>
        </div>
      </div>
      <MinimalFooter />
    </div>
  );
};

export default Analytics;
