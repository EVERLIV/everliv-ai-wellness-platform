import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
import AnalyticsHeader from "@/components/analytics/AnalyticsHeader";
import AnalyticsSummary from "@/components/analytics/AnalyticsSummary";
import HealthOverviewCards from "@/components/analytics/HealthOverviewCards";
import AnalyticsLoadingIndicator from "@/components/analytics/AnalyticsLoadingIndicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCachedAnalytics } from "@/hooks/useCachedAnalytics";
import { 
  Activity, 
  CheckCircle,
  AlertTriangle,
  Calendar,
  FileText,
  ArrowLeft,
  RefreshCw
} from "lucide-react";

interface Biomarker {
  name: string;
  value: number | string;
  unit: string;
  status: 'optimal' | 'good' | 'attention' | 'risk' | 'unknown';
  referenceRange: string;
  description?: string;
}

interface AnalysisData {
  id: string;
  analysisType: string;
  createdAt: string;
  biomarkers: Biomarker[];
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
  const [searchParams] = useSearchParams();
  const analysisId = searchParams.get('id');
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [doctorQuestion, setDoctorQuestion] = useState("");
  const [doctorResponse, setDoctorResponse] = useState("");
  const [isProcessingQuestion, setIsProcessingQuestion] = useState(false);

  const { analytics, generateAnalytics, isGenerating, loadingStep, isLoading: isLoadingAnalytics } = useCachedAnalytics();

  console.log('=== Analytics Page Render ===');
  console.log('User:', !!user);
  console.log('Analytics ID:', analysisId);
  console.log('Is Generating:', isGenerating);
  console.log('Loading Step:', loadingStep);
  console.log('Has Analytics:', !!analytics);
  console.log('Is Loading Analytics:', isLoadingAnalytics);
  console.log('Is Loading Analysis:', isLoadingAnalysis);
  console.log('Analytics Data:', analytics);

  useEffect(() => {
    if (user && analysisId) {
      loadAnalysisDetails();
    }
  }, [user, analysisId]);

  const loadAnalysisDetails = async () => {
    try {
      setIsLoadingAnalysis(true);
      
      const { data: analysis, error } = await supabase
        .from('medical_analyses')
        .select('*')
        .eq('id', analysisId)
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Error loading analysis:', error);
        toast.error('Анализ не найден');
        setAnalysisData(null);
        return;
      }

      if (analysis) {
        const processedData = processAnalysisData(analysis);
        setAnalysisData(processedData);
      }
    } catch (error) {
      console.error('Error loading analysis details:', error);
      toast.error('Ошибка загрузки данных анализа');
      setAnalysisData(null);
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const getBiomarkerNorms = (name: string): string => {
    const norms: { [key: string]: string } = {
      'Холестерин общий': '< 5,2 ммоль/л',
      'Холестерин ЛПНП': '< 3,0 ммоль/л',
      'Холестерин ЛПВП': 'М: > 1,0 ммоль/л, Ж: > 1,2 ммоль/л',
      'Триглицериды': '< 1,7 ммоль/л',
      'Глюкоза': '3,9-6,0 ммоль/л',
      'Гликированный гемоглобин': '< 6,5%',
      'Инсулин': '2,6-24,9 мкЕд/мл',
      'Гемоглобин': 'М: 130-160 г/л, Ж: 120-140 г/л',
      'Эритроциты': 'М: 4,0-5,1×10¹²/л, Ж: 3,7-4,7×10¹²/л',
      'Лейкоциты': '4,0-9,0×10⁹/л',
      'Тромбоциты': '180-320×10⁹/л',
      'СОЭ': 'М: до 15 мм/ч, Ж: до 20 мм/ч',
      'Витамин D': '30-100 нг/мл',
      'Витамин B12': '191-663 пг/мл',
      'Фолиевая кислота': '4,6-18,7 нг/мл',
      'Железо': 'М: 11,6-31,3 мкмоль/л, Ж: 8,9-30,4 мкмоль/л',
      'Ферритин': 'М: 12-300 нг/мл, Ж: 12-150 нг/мл',
      'Трансферрин': '2,0-3,6 г/л',
      'Креатинин': 'М: 74-110 мкмоль/л, Ж: 60-93 мкмоль/л',
      'Мочевина': '2,5-6,4 ммоль/л',
      'АЛТ': 'М: до 41 Ед/л, Ж: до 31 Ед/л',
      'АСТ': 'М: до 37 Ед/л, Ж: до 31 Ед/л',
      'Билирубин общий': '8,5-20,5 мкмоль/л',
      'Белок общий': '66-87 г/л',
      'Альбумин': '35-52 г/л',
      'ТТГ': '0,4-4,0 мЕд/л',
      'Т3 свободный': '2,6-5,7 пмоль/л',
      'Т4 свободный': '9,0-22,0 пмоль/л',
      'Кортизол': '138-635 нмоль/л',
      'Тестостерон': 'М: 8,64-29,0 нмоль/л',
      'Эстрадиол': 'Ж: 68-1269 пмоль/л (зависит от фазы цикла)',
      'ПСА': '< 4,0 нг/мл'
    };

    return norms[name] || 'Уточните у врача';
  };

  const processAnalysisData = (analysis: any): AnalysisData => {
    const biomarkers: Biomarker[] = [];
    
    if (analysis.results?.markers) {
      for (const marker of analysis.results.markers) {
        biomarkers.push({
          name: marker.name,
          value: marker.value,
          unit: marker.unit || '',
          status: marker.status || 'unknown',
          referenceRange: getBiomarkerNorms(marker.name),
          description: getBiomarkerDescription(marker.name)
        });
      }
    }

    return {
      id: analysis.id,
      analysisType: analysis.analysis_type,
      createdAt: analysis.created_at,
      biomarkers
    };
  };

  const getBiomarkerDescription = (name: string): string => {
    const descriptions: { [key: string]: string } = {
      'Холестерин общий': 'Показатель липидного обмена, влияет на риск сердечно-сосудистых заболеваний',
      'Холестерин ЛПНП': 'Липопротеины низкой плотности, "плохой" холестерин',
      'Холестерин ЛПВП': 'Липопротеины высокой плотности, "хороший" холестерин',
      'Триглицериды': 'Основной тип жиров в крови, показатель энергетического метаболизма',
      'Глюкоза': 'Уровень сахара в крови, показатель углеводного обмена',
      'Гликированный гемоглобин': 'Средний уровень глюкозы за последние 2-3 месяца',
      'Инсулин': 'Гормон, регулирующий уровень глюкозы в крови',
      'Гемоглобин': 'Белок, переносящий кислород в крови',
      'Эритроциты': 'Красные кровяные тельца, переносят кислород',
      'Лейкоциты': 'Белые кровяные тельца, отвечают за иммунитет',
      'Тромбоциты': 'Кровяные пластинки, отвечают за свертываемость крови',
      'СОЭ': 'Скорость оседания эритроцитов, показатель воспаления',
      'Витамин D': 'Регулирует обмен кальция и фосфора, влияет на иммунитет',
      'Витамин B12': 'Необходим для работы нервной системы и образования крови',
      'Фолиевая кислота': 'Важна для синтеза ДНК и деления клеток',
      'Железо': 'Необходимо для транспорта кислорода и работы ферментов',
      'Ферритин': 'Показатель запасов железа в организме',
      'Трансферрин': 'Белок, переносящий железо в крови',
      'Креатинин': 'Показатель функции почек',
      'Мочевина': 'Продукт белкового обмена, показатель работы почек',
      'АЛТ': 'Фермент печени, показатель ее функции',
      'АСТ': 'Фермент, показатель состояния печени и сердца',
      'Билирубин общий': 'Продукт распада эритроцитов, показатель работы печени',
      'Белок общий': 'Показатель белкового обмена и функции печени',
      'Альбумин': 'Основной белок плазмы крови',
      'ТТГ': 'Тиреотропный гормон, регулирует работу щитовидной железы',
      'Т3 свободный': 'Активный гормон щитовидной железы',
      'Т4 свободный': 'Основной гормон щитовидной железы',
      'Кортизол': 'Гормон стресса, регулирует обмен веществ',
      'Тестостерон': 'Мужской половой гормон',
      'Эстрадиол': 'Женский половой гормон',
      'ПСА': 'Простат-специфический антиген, маркер здоровья простаты'
    };

    return descriptions[name] || 'Важный показатель здоровья, требует интерпретации специалистом';
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'good':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'attention':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'risk':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'Оптимально';
      case 'good':
        return 'Хорошо';
      case 'attention':
        return 'Внимание';
      case 'risk':
        return 'Риск';
      default:
        return 'Требует оценки';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimal':
      case 'good':
        return <CheckCircle className="h-4 w-4" />;
      case 'attention':
      case 'risk':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  // Проверка пользователя
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Для доступа к аналитике необходимо войти в систему</p>
      </div>
    );
  }

  // Если есть analysisId, показываем детали конкретного анализа
  if (analysisId) {
    if (isLoadingAnalysis) {
      return (
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Header />
          <div className="flex-grow flex items-center justify-center pt-16">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p className="text-gray-500">Загрузка данных анализа...</p>
            </div>
          </div>
        </div>
      );
    }

    if (!analysisData) {
      return (
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Header />
          <div className="flex-grow flex items-center justify-center pt-16">
            <div className="text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Анализ не найден</h2>
              <p className="text-gray-500">Запрашиваемый анализ не существует или недоступен</p>
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="mt-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="pt-16">
          <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b border-gray-200">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Activity className="h-8 w-8 text-blue-600" />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      Детали анализа
                    </h1>
                    <p className="text-gray-600">{analysisData.analysisType}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => window.history.back()}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Назад к списку
                </Button>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Дата: {new Date(analysisData.createdAt).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4" />
                  <span>Показателей: {analysisData.biomarkers.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analysisData.biomarkers.map((biomarker, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {biomarker.name}
                      </CardTitle>
                      <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(biomarker.status)}`}>
                        {getStatusIcon(biomarker.status)}
                        <span className="ml-1">{getStatusText(biomarker.status)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Значение</p>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-2xl font-bold text-gray-900">
                            {biomarker.value}
                          </span>
                          {biomarker.unit && (
                            <span className="text-sm text-gray-600">{biomarker.unit}</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Норма (РФ Минздрав)</p>
                        <p className="text-sm text-gray-600 font-medium">{biomarker.referenceRange}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Описание</p>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {biomarker.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {analysisData.biomarkers.length === 0 && (
              <Card>
                <CardContent className="p-8">
                  <div className="text-center text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">Нет данных</h3>
                    <p className="text-sm">
                      В этом анализе не найдено биомаркеров для отображения
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        <MinimalFooter />
      </div>
    );
  }

  // Если идет генерация аналитики, показываем индикатор загрузки
  if (isGenerating) {
    console.log('RENDERING LOADING INDICATOR');
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

  // Если аналитика еще не сгенерирована, показываем предложение сгенерировать
  if (!analytics) {
    console.log('RENDERING NO ANALYTICS');
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="pt-16">
          <AnalyticsHeader 
            healthScore={0}
            riskLevel="unknown"
          />
          
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <Card>
              <CardContent className="p-8">
                <div className="text-center">
                  <Activity className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Аналитика не сгенерирована</h2>
                  <p className="text-gray-500 mb-6">
                    Нажмите кнопку ниже, чтобы создать персональную аналитику здоровья на основе ваших данных
                  </p>
                  <Button onClick={generateAnalytics} disabled={isGenerating} className="gap-2">
                    <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    {isGenerating ? 'Генерирую аналитику...' : 'Сгенерировать аналитику'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <MinimalFooter />
      </div>
    );
  }

  // Показываем сгенерированную аналитику
  console.log('RENDERING ANALYTICS DATA');
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="pt-16">
        <AnalyticsHeader 
          healthScore={analytics.healthScore}
          riskLevel={analytics.riskLevel}
        />
        
        <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">Обзор здоровья</h2>
            <Button
              variant="outline"
              onClick={generateAnalytics}
              disabled={isGenerating}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Обновление...' : 'Обновить аналитику'}
            </Button>
          </div>

          <HealthOverviewCards 
            trendsAnalysis={analytics.trendsAnalysis}
            totalAnalyses={analytics.totalAnalyses}
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
      </div>
      <MinimalFooter />
    </div>
  );
};

export default Analytics;
