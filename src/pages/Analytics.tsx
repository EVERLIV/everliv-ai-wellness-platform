
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
import AnalyticsHeader from "@/components/analytics/AnalyticsHeader";
import AnalyticsSummary from "@/components/analytics/AnalyticsSummary";
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
      healthImprovementActions: [
        {
          id: '1',
          category: 'Сердечно-сосудистая система',
          title: 'Нормализация уровня холестерина',
          priority: 'high',
          actions: [
            'Исключить трансжиры и ограничить насыщенные жиры',
            'Добавить 25-30г клетчатки в день',
            'Увеличить физическую активность до 150 минут в неделю'
          ],
          expectedResult: 'Снижение холестерина на 10-15% за 2-3 месяца'
        },
        {
          id: '2',
          category: 'Обмен веществ',
          title: 'Контроль уровня глюкозы',
          priority: 'medium',
          actions: [
            'Снизить потребление простых углеводов',
            'Регулярное питание небольшими порциями',
            'Контроль веса'
          ],
          expectedResult: 'Стабилизация уровня глюкозы в норме'
        }
      ],
      recommendedTests: [
        {
          id: '1',
          name: 'Расширенная липидограмма',
          frequency: 'Каждые 3 месяца',
          priority: 'high',
          reason: 'Контроль эффективности диеты и лечения',
          includes: ['Общий холестерин', 'ЛПНП', 'ЛПВП', 'Триглицериды', 'Коэффициент атерогенности']
        },
        {
          id: '2',
          name: 'Гликированный гемоглобин',
          frequency: 'Каждые 6 месяцев',
          priority: 'medium',
          reason: 'Оценка долгосрочного контроля глюкозы',
          includes: ['HbA1c', 'Глюкоза натощак']
        }
      ],
      specialistConsultations: [
        {
          id: '1',
          specialist: 'Кардиолог',
          urgency: 'В течение месяца',
          reason: 'Повышенный риск сердечно-сосудистых заболеваний',
          purpose: 'Оценка состояния сердечно-сосудистой системы и назначение лечения',
          preparation: 'Принести результаты всех анализов за последние 6 месяцев'
        },
        {
          id: '2',
          specialist: 'Эндокринолог',
          urgency: 'В течение 2-3 месяцев',
          reason: 'Нарушения углеводного обмена',
          purpose: 'Исключение диабета и метаболического синдрома',
          preparation: 'Сдать анализы натощак, ведите дневник питания'
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
            },
            {
              name: 'Артериальное давление',
              target: '< 130/80 мм рт.ст.',
              importance: 'Риск инфаркта и инсульта',
              frequency: 'Ежедневно при гипертонии'
            }
          ]
        },
        {
          id: '2',
          category: 'Обмен веществ',
          indicators: [
            {
              name: 'Глюкоза натощак',
              target: '3.9-6.0 ммоль/л',
              importance: 'Ранняя диагностика диабета',
              frequency: 'Каждые 6-12 месяцев'
            },
            {
              name: 'ИМТ',
              target: '18.5-24.9',
              importance: 'Контроль веса и метаболизма',
              frequency: 'Еженедельно'
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
              benefit: 'Снижение холестерина и воспаления на 20-30%',
              howTo: 'Больше рыбы (2-3 раза в неделю), оливковое масло, орехи, овощи'
            },
            {
              advice: 'Ограничение соли',
              benefit: 'Снижение артериального давления',
              howTo: 'Не более 5г соли в день, используйте специи вместо соли'
            }
          ]
        },
        {
          id: '2',
          category: 'Физическая активность',
          recommendations: [
            {
              advice: 'Кардио-тренировки',
              benefit: 'Улучшение работы сердца и снижение холестерина',
              howTo: '150 минут умеренной активности в неделю (ходьба, плавание)'
            },
            {
              advice: 'Силовые упражнения',
              benefit: 'Улучшение метаболизма и контроль веса',
              howTo: '2-3 раза в неделю упражнения с весом или сопротивлением'
            }
          ]
        }
      ],
      riskFactors: [
        {
          id: '1',
          factor: 'Повышенный холестерин',
          level: 'medium',
          description: 'Умеренное превышение нормы ЛПНП',
          mitigation: 'Диета и физическая активность в течение 3 месяцев'
        }
      ],
      supplements: [
        {
          id: '1',
          name: 'Омега-3',
          dosage: '1000-2000 мг/день',
          benefit: 'Снижение триглицеридов и воспаления',
          timing: 'С едой, желательно с ужином'
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
          {healthData?.healthImprovementActions && healthData.healthImprovementActions.length > 0 && (
            <HealthImprovementActions actions={healthData.healthImprovementActions} />
          )}

          {/* Recommended Tests */}
          {healthData?.recommendedTests && healthData.recommendedTests.length > 0 && (
            <RecommendedTests tests={healthData.recommendedTests} />
          )}

          {/* Specialist Consultations */}
          {healthData?.specialistConsultations && healthData.specialistConsultations.length > 0 && (
            <SpecialistConsultations consultations={healthData.specialistConsultations} />
          )}

          {/* Key Health Indicators */}
          {healthData?.keyHealthIndicators && healthData.keyHealthIndicators.length > 0 && (
            <KeyHealthIndicators indicators={healthData.keyHealthIndicators} />
          )}

          {/* Lifestyle Recommendations */}
          {healthData?.lifestyleRecommendations && healthData.lifestyleRecommendations.length > 0 && (
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
        </div>
      </div>
      <MinimalFooter />
    </div>
  );
};

export default Analytics;
