
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Printer
} from "lucide-react";

interface Biomarker {
  name: string;
  value: number | string;
  unit: string;
  status: 'optimal' | 'good' | 'attention' | 'risk' | 'normal' | 'high' | 'low' | 'unknown';
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
      console.log('Загружаем детали анализа для ID:', analysisId);
      
      const { data: analysis, error } = await supabase
        .from('medical_analyses')
        .select('*')
        .eq('id', analysisId)
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Ошибка загрузки анализа:', error);
        throw error;
      }

      if (analysis) {
        console.log('Загружен анализ:', analysis);
        const processedData = processAnalysisData(analysis);
        console.log('Обработанные данные:', processedData);
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
    
    console.log('Обрабатываем результаты анализа:', analysis.results);
    
    if (analysis.results?.markers) {
      for (const marker of analysis.results.markers) {
        console.log('Обрабатываем маркер:', marker);
        biomarkers.push({
          name: marker.name,
          value: marker.value,
          unit: marker.unit || '',
          status: marker.status || 'unknown',
          referenceRange: marker.normalRange || marker.reference_range || 'Н/Д',
          description: getBiomarkerDescription(marker.name)
        });
      }
    }

    const result = {
      id: analysis.id,
      analysisType: getAnalysisTypeName(analysis.analysis_type),
      createdAt: analysis.created_at,
      biomarkers
    };

    console.log('Финальный результат обработки:', result);
    return result;
  };

  const getAnalysisTypeName = (type: string): string => {
    const typeNames: { [key: string]: string } = {
      'blood_test': 'Общий анализ крови',
      'blood': 'Общий анализ крови',
      'biochemistry': 'Биохимический анализ крови',
      'hormones': 'Анализ гормонов',
      'vitamins': 'Анализ витаминов и микроэлементов',
      'lipid_profile': 'Липидограмма',
      'thyroid': 'Анализ функции щитовидной железы',
      'diabetes': 'Анализ на диабет',
      'liver': 'Печеночные пробы',
      'kidney': 'Почечные пробы'
    };
    return typeNames[type] || 'Медицинский анализ';
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
    console.log('Определяем цвет для статуса:', status);
    switch (status) {
      case 'optimal':
      case 'normal':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'good':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'attention':
      case 'low':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'risk':
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    console.log('Определяем текст для статуса:', status);
    switch (status) {
      case 'optimal':
        return 'Оптимально';
      case 'normal':
        return 'Норма';
      case 'good':
        return 'Хорошо';
      case 'attention':
        return 'Внимание';
      case 'low':
        return 'Ниже нормы';
      case 'risk':
        return 'Риск';
      case 'high':
        return 'Выше нормы';
      default:
        return 'Требует оценки';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimal':
      case 'normal':
      case 'good':
        return <CheckCircle className="h-3 w-3" />;
      case 'attention':
      case 'low':
      case 'risk':
      case 'high':
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const handlePrint = () => {
    window.print();
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
    <div className="min-h-screen flex flex-col bg-slate-50 print:bg-white">
      <Header />
      <div className="pt-16 print:pt-0">
        {/* Заголовок страницы */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b border-gray-200 print:bg-white print:border-none">
          <div className="container mx-auto px-4 py-6 max-w-6xl print:py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Activity className="h-8 w-8 text-blue-600 print:h-6 print:w-6" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 print:text-2xl">
                    {analysisData.analysisType}
                  </h1>
                  <p className="text-gray-600 print:text-sm">Детальный анализ показателей</p>
                </div>
              </div>
              <Button 
                onClick={handlePrint}
                className="gap-2 print:hidden"
                variant="outline"
              >
                <Printer className="h-4 w-4" />
                Печать PDF
              </Button>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600 print:text-xs">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 print:h-3 print:w-3" />
                <span>
                  Дата: {new Date(analysisData.createdAt).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 print:h-3 print:w-3" />
                <span>Показателей: {analysisData.biomarkers.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Компактный список биомаркеров */}
        <div className="container mx-auto px-4 py-6 max-w-6xl print:py-4">
          <div className="space-y-3 print:space-y-2">
            {analysisData.biomarkers.map((biomarker, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow print:p-3 print:border-gray-300 print:rounded-none print:hover:shadow-none"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 print:grid-cols-4 print:gap-2">
                  {/* Название показателя */}
                  <div className="md:col-span-1">
                    <h3 className="font-semibold text-gray-900 text-sm print:text-xs">
                      {biomarker.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 print:hidden">
                      {biomarker.description}
                    </p>
                  </div>

                  {/* Значение */}
                  <div className="md:col-span-1">
                    <p className="text-xs font-medium text-gray-700 mb-1 print:text-xs">Значение</p>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-lg font-bold text-gray-900 print:text-sm">
                        {biomarker.value}
                      </span>
                      {biomarker.unit && (
                        <span className="text-xs text-gray-600 print:text-xs">{biomarker.unit}</span>
                      )}
                    </div>
                  </div>

                  {/* Норма */}
                  <div className="md:col-span-1">
                    <p className="text-xs font-medium text-gray-700 mb-1">Норма</p>
                    <p className="text-sm text-gray-600 print:text-xs">{biomarker.referenceRange}</p>
                  </div>

                  {/* Статус */}
                  <div className="md:col-span-1">
                    <p className="text-xs font-medium text-gray-700 mb-1">Статус</p>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(biomarker.status)} print:px-1 print:py-0`}>
                      {getStatusIcon(biomarker.status)}
                      <span className="ml-1 print:text-xs">{getStatusText(biomarker.status)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {analysisData.biomarkers.length === 0 && (
            <Card className="print:border-gray-300">
              <CardContent className="p-8 print:p-4">
                <div className="text-center text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300 print:h-8 print:w-8" />
                  <h3 className="text-lg font-medium mb-2 print:text-sm">Нет данных</h3>
                  <p className="text-sm print:text-xs">
                    В этом анализе не найдено биомаркеров для отображения
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Дисклеймер для печати */}
          <div className="mt-8 print:mt-4 print:block hidden">
            <div className="text-xs text-gray-600 border-t pt-4">
              <p><strong>Важно:</strong> Данный анализ предоставлен только в информационных целях. 
              Обязательно проконсультируйтесь с квалифицированным врачом для получения 
              профессиональной медицинской консультации и назначения лечения.</p>
            </div>
          </div>
        </div>
      </div>
      <MinimalFooter />
    </div>
  );
};

export default AnalysisDetails;
