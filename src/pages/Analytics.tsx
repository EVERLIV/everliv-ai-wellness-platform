
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
import AnalyticsHeader from "@/components/analytics/AnalyticsHeader";
import AnalyticsSummary from "@/components/analytics/AnalyticsSummary";
import BiomarkersList from "@/components/analytics/BiomarkersList";
import BiomarkerDetails from "@/components/analytics/BiomarkerDetails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Target,
  AlertTriangle,
  CheckCircle2,
  Pill,
  Stethoscope,
  Calendar,
  ArrowRight,
  Heart,
  Zap
} from "lucide-react";

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
      
      // Загружаем все анализы пользователя для комплексной оценки
      const { data: analyses, error } = await supabase
        .from('medical_analyses')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Генерируем комплексную аналитику на основе всех данных
      if (analyses && analyses.length > 0) {
        await generateComprehensiveAnalytics(analyses);
      } else {
        // Используем демо-данные если анализов нет
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
        },
        {
          id: '2',
          name: 'Глюкоза',
          value: 4.8,
          unit: 'ммоль/л',
          status: 'optimal',
          trend: 'stable',
          referenceRange: '3.9-5.9',
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
            'Добавить 25-30г клетчатки в день',
            'Кардиотренировки 150 минут в неделю'
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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Target className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">Высокий приоритет</Badge>;
      case 'medium':
        return <Badge variant="secondary">Средний приоритет</Badge>;
      case 'low':
        return <Badge variant="outline">Низкий приоритет</Badge>;
      default:
        return <Badge variant="outline">Обычный</Badge>;
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
          {/* Обзор и тренды */}
          {healthData?.overview && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {healthData.overview.trendsAnalysis.improving}
                      </p>
                      <p className="text-sm text-gray-600">Улучшающихся показателей</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <TrendingDown className="h-8 w-8 text-red-500" />
                    <div>
                      <p className="text-2xl font-bold text-red-600">
                        {healthData.overview.trendsAnalysis.worsening}
                      </p>
                      <p className="text-sm text-gray-600">Ухудшающихся показателей</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <Activity className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        {healthData.overview.totalAnalyses}
                      </p>
                      <p className="text-sm text-gray-600">Всего анализов</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Действия для улучшения здоровья */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                Действия для улучшения здоровья
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {healthData?.healthImprovementActions?.map((action) => (
                  <div key={action.id} className="border-l-4 border-blue-200 bg-blue-50 p-4 rounded-r-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-blue-900">{action.title}</h4>
                        <p className="text-sm text-blue-700">{action.category}</p>
                      </div>
                      {getPriorityBadge(action.priority)}
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-blue-800 mb-2">Конкретные шаги:</p>
                        <ul className="space-y-1">
                          {action.actions.map((step, index) => (
                            <li key={index} className="text-sm text-blue-700 flex items-start">
                              <ArrowRight className="h-3 w-3 mt-1 mr-2 flex-shrink-0" />
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-blue-100 p-3 rounded">
                        <p className="text-xs text-blue-800">
                          <strong>Ожидаемый результат:</strong> {action.expectedResult}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Рекомендуемые тесты */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-500" />
                Рекомендуемые медицинские обследования
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {healthData?.recommendedTests?.map((test) => (
                  <div key={test.id} className="border border-purple-200 bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-purple-900">{test.name}</h4>
                      {getPriorityIcon(test.priority)}
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-purple-800">
                        <strong>Частота:</strong> {test.frequency}
                      </p>
                      <p className="text-sm text-purple-700">{test.reason}</p>
                      
                      <div>
                        <p className="text-xs font-medium text-purple-800 mb-1">Включает:</p>
                        <ul className="text-xs text-purple-700">
                          {test.includes.map((item, index) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Консультации специалистов */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-green-500" />
                Рекомендуемые консультации специалистов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthData?.specialistConsultations?.map((consultation) => (
                  <div key={consultation.id} className="border border-green-200 bg-green-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-green-900 mb-1">{consultation.specialist}</h4>
                        <p className="text-sm text-green-700 mb-2">{consultation.reason}</p>
                        <p className="text-xs text-green-600">
                          <strong>Срочность:</strong> {consultation.urgency}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-green-800 mb-2">
                          <strong>Цель:</strong> {consultation.purpose}
                        </p>
                        <p className="text-xs text-green-700">
                          <strong>Подготовка:</strong> {consultation.preparation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ключевые показатели здоровья */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Ключевые показатели для мониторинга
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {healthData?.keyHealthIndicators?.map((category) => (
                  <div key={category.id}>
                    <h4 className="font-semibold text-gray-900 mb-3">{category.category}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.indicators.map((indicator, index) => (
                        <div key={index} className="border border-gray-200 bg-gray-50 p-3 rounded">
                          <h5 className="font-medium text-gray-900 text-sm">{indicator.name}</h5>
                          <p className="text-sm text-blue-600 font-semibold">{indicator.target}</p>
                          <p className="text-xs text-gray-600 mt-1">{indicator.importance}</p>
                          <p className="text-xs text-gray-500">Контроль: {indicator.frequency}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Рекомендации по образу жизни */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-500" />
                Рекомендации по образу жизни
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {healthData?.lifestyleRecommendations?.map((category) => (
                  <div key={category.id}>
                    <h4 className="font-semibold text-gray-900 mb-3">{category.category}</h4>
                    <div className="space-y-3">
                      {category.recommendations.map((rec, index) => (
                        <div key={index} className="border border-orange-200 bg-orange-50 p-3 rounded">
                          <h5 className="font-medium text-orange-900 text-sm">{rec.advice}</h5>
                          <p className="text-xs text-orange-700 mt-1">{rec.benefit}</p>
                          <p className="text-xs text-gray-600 mt-2">
                            <strong>Как:</strong> {rec.howTo}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Общая сводка с чатом */}
          <AnalyticsSummary 
            healthData={healthData}
            onDoctorQuestion={handleDoctorQuestion}
            doctorQuestion={doctorQuestion}
            setDoctorQuestion={setDoctorQuestion}
            doctorResponse={doctorResponse}
            isProcessingQuestion={isProcessingQuestion}
          />
          
          {/* Список биомаркеров и детали */}
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
                recommendations={healthData?.healthImprovementActions || []}
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
