
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
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
  FileText
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

const AnalysisDetails: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const analysisId = searchParams.get('id');
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && analysisId) {
      loadAnalysisDetails();
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

  const processAnalysisData = (analysis: any): AnalysisData => {
    const biomarkers: Biomarker[] = [];
    
    if (analysis.results?.markers) {
      for (const marker of analysis.results.markers) {
        biomarkers.push({
          name: marker.name,
          value: marker.value,
          unit: marker.unit || '',
          status: marker.status || 'unknown',
          referenceRange: marker.reference_range || 'Н/Д',
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
        return 'Неизвестно';
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
        <p>Для доступа к анализу необходимо войти в систему</p>
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
            <div className="flex items-center space-x-4 mb-6">
              <Activity className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Детали анализа
                </h1>
                <p className="text-gray-600">{analysisData.analysisType}</p>
              </div>
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
                      <p className="text-sm font-medium text-gray-700 mb-1">Норма</p>
                      <p className="text-sm text-gray-600">{biomarker.referenceRange}</p>
                    </div>

                    {/* Описание */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">За что отвечает</p>
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
};

export default AnalysisDetails;
