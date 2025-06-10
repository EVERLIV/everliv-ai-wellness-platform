import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  CheckCircle,
  AlertTriangle,
  Calendar,
  FileText,
  ArrowLeft
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
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [doctorQuestion, setDoctorQuestion] = useState("");
  const [doctorResponse, setDoctorResponse] = useState("");
  const [isProcessingQuestion, setIsProcessingQuestion] = useState(false);

  useEffect(() => {
    if (user) {
      if (analysisId) {
        loadAnalysisDetails();
      } else {
        loadHealthData();
      }
    }
  }, [user, analysisId]);

  const loadAnalysisDetails = async () => {
    try {
      setIsLoading(true);
      
      const { data: analysis, error } = await supabase
        .from('medical_analyses')
        .select('*')
        .eq('id', analysisId)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      if (analysis) {
        const processedData = processAnalysisData(analysis);
        setAnalysisData(processedData);
      }
    } catch (error) {
      console.error('Error loading analysis details:', error);
      toast.error('Ошибка загрузки данных анализа');
    } finally {
      setIsLoading(false);
    }
  };

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
        return <Minus className="h-4 w-4" />;
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
            <p className="text-gray-500">
              {analysisId ? 'Загрузка данных анализа...' : 'Генерация персональной аналитики здоровья...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Если есть analysisId, показываем детали конкретного анализа
  if (analysisId) {
    if (!analysisData) {
      return (
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Header />
          <div className="flex-grow flex items-center justify-center pt-16">
            <div className="text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Анализ не найден</h2>
              <p className="text-gray-500">Запрашиваемый анализ не существует или недоступен</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="pt-16">
          {/* Заголовок страницы */}
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

          {/* Список биомаркеров */}
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
                      {/* Значение */}
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

                      {/* Референсные значения */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Норма (РФ Минздрав)</p>
                        <p className="text-sm text-gray-600 font-medium">{biomarker.referenceRange}</p>
                      </div>

                      {/* Описание */}
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

  // Если нет analysisId, показываем общую аналитику
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

}
