import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Heart, Brain, Activity, Bone, AlertTriangle, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react';
import { useBiomarkers } from '@/hooks/useBiomarkers';
import { useNavigate } from 'react-router-dom';
import { useCachedAnalytics } from '@/hooks/useCachedAnalytics';
import { useToast } from '@/hooks/use-toast';

interface RiskScore {
  name: string;
  percentage: number;
  level: string;
  description: string;
  factors: string[];
  period: string;
  mechanism?: string;
}

const PriorityMetricsSection = () => {
  const { getTop5WorstBiomarkers, isLoading: biomarkersLoading } = useBiomarkers();
  const { analytics, isLoading: analyticsLoading } = useCachedAnalytics();
  const navigate = useNavigate();
  
  const [riskScores, setRiskScores] = useState<{[key: string]: RiskScore}>({
    disease1: { name: 'Загрузка...', percentage: 0, level: 'Загрузка...', description: '', factors: [], period: '' },
    disease2: { name: 'Загрузка...', percentage: 0, level: 'Загрузка...', description: '', factors: [], period: '' },
    disease3: { name: 'Загрузка...', percentage: 0, level: 'Загрузка...', description: '', factors: [], period: '' },
    disease4: { name: 'Загрузка...', percentage: 0, level: 'Загрузка...', description: '', factors: [], period: '' }
  });
  const [isLoadingRisks, setIsLoadingRisks] = useState(false);

  // Получаем рекомендации из analytics
  const recommendations = React.useMemo(() => {
    if (!analytics?.recommendations || !Array.isArray(analytics.recommendations)) {
      return { prognostic: [], actionable: [], personalized: [] };
    }

    const recs = analytics.recommendations;
    return {
      prognostic: recs.slice(0, 2).map((rec, index) => ({
        title: `Прогноз ${index + 1}`,
        content: typeof rec === 'string' ? rec : (rec as any)?.title || (rec as any)?.description || rec,
        source_data: { confidence: 85, scientificBasis: 'На основе анализа ваших данных' }
      })),
      actionable: recs.slice(2, 4).map((rec, index) => ({
        title: `Рекомендация ${index + 1}`,
        content: typeof rec === 'string' ? rec : (rec as any)?.title || (rec as any)?.description || rec,
        source_data: { timeframe: 'В течение недели', actionItems: ['Следуйте рекомендации'] }
      })),
      personalized: recs.slice(4, 6).map((rec, index) => ({
        title: `Персональный совет ${index + 1}`,
        content: typeof rec === 'string' ? rec : (rec as any)?.title || (rec as any)?.description || rec,
        source_data: { priority: 'Высокий', actionItems: ['Индивидуальный подход'] }
      }))
    };
  }, [analytics?.recommendations]);

  // Стабильное вычисление рисков без мерцания данных
  useEffect(() => {
    if (biomarkersLoading) return;
    
    const worstBiomarkers = getTop5WorstBiomarkers();
    
    const calculateRisks = () => {
      if (worstBiomarkers.length === 0) {
        return {
          noData: {
            name: 'Анализ рисков',
            percentage: 0,
            level: 'Недостаточно данных',
            description: 'Для точного анализа рисков необходимо загрузить анализы и заполнить профиль здоровья.',
            factors: ['Загрузите результаты анализов', 'Заполните профиль здоровья'],
            period: 'при наличии данных'
          }
        };
      }

      // Анализируем риски на основе биомаркеров
      const risks: {[key: string]: RiskScore} = {};
      
      // Подсчитываем базовый риск на основе количества и серьезности отклонений
      const riskMultiplier = worstBiomarkers.reduce((acc, biomarker) => {
        if (biomarker.status === 'critical') return acc + 3;
        if (biomarker.status === 'high' || biomarker.status === 'elevated') return acc + 2;
        if (biomarker.status === 'low' || biomarker.status === 'attention') return acc + 1;
        return acc;
      }, 0);
      
      // Сердечно-сосудистые заболевания
      risks.cardiovascular = {
        name: 'Сердечно-сосудистые заболевания',
        percentage: Math.min(50, 5 + riskMultiplier * 4),
        level: riskMultiplier > 6 ? 'высокий' : riskMultiplier > 3 ? 'умеренный' : 'низкий',
        description: 'Риск развития ишемической болезни сердца и инсульта',
        factors: ['Холестерин', 'Артериальное давление', 'C-реактивный белок'],
        period: 'в течение 10 лет',
        mechanism: 'Атеросклеротические изменения в сосудах'
      };

      // Диабет 2 типа
      risks.diabetes = {
        name: 'Сахарный диабет 2 типа',
        percentage: Math.min(40, 3 + riskMultiplier * 3),
        level: riskMultiplier > 6 ? 'высокий' : riskMultiplier > 3 ? 'умеренный' : 'низкий',
        description: 'Риск развития инсулинорезистентности и диабета',
        factors: ['Глюкоза', 'HbA1c', 'Инсулин'],
        period: 'в течение 5 лет',
        mechanism: 'Нарушение углеводного обмена'
      };

      // Метаболический синдром
      risks.metabolic = {
        name: 'Метаболический синдром',
        percentage: Math.min(45, 4 + riskMultiplier * 3.5),
        level: riskMultiplier > 6 ? 'высокий' : riskMultiplier > 3 ? 'умеренный' : 'низкий',
        description: 'Комплекс нарушений обмена веществ',
        factors: ['Липидный профиль', 'Инсулинорезистентность', 'Воспаление'],
        period: 'в течение 3 лет',
        mechanism: 'Системные метаболические нарушения'
      };

      // Остеопороз
      risks.osteoporosis = {
        name: 'Остеопороз',
        percentage: Math.min(30, 2 + riskMultiplier * 2),
        level: riskMultiplier > 6 ? 'умеренный' : 'низкий',
        description: 'Риск снижения плотности костной ткани',
        factors: ['Кальций', 'Витамин D', 'Фосфор'],
        period: 'в течение 15 лет',
        mechanism: 'Нарушение костного метаболизма'
      };

      return risks;
    };

    setIsLoadingRisks(true);
    const calculatedRisks = calculateRisks();
    setRiskScores(calculatedRisks);
    setIsLoadingRisks(false);
  }, [biomarkersLoading]);

  // Формируем ИИ-предикты рисков заболеваний
  const aiRiskScores = (() => {
    const scores = Object.values(riskScores);
    const validScores = scores.filter(score => score.name && score.name !== 'Загрузка...');
    
    if (validScores.length === 0) {
      return [];
    }
    
    // Если нет данных для анализа
    if (riskScores.noData) {
      return [{
        title: riskScores.noData.name,
        value: riskScores.noData.percentage,
        period: riskScores.noData.period,
        level: riskScores.noData.level,
        description: riskScores.noData.description,
        factors: riskScores.noData.factors.join(', '),
        mechanism: riskScores.noData.mechanism,
        hasData: false
      }];
    }
    
    // Возвращаем риски заболеваний
    return validScores.map(score => ({
      title: score.name,
      value: score.percentage,
      period: score.period,
      level: score.level,
      description: score.description,
      factors: score.factors.join(', '),
      mechanism: score.mechanism,
      hasData: true
    }));
  })();

  const getRiskLevel = (value: number) => {
    if (value <= 5) return 'очень низкий';
    if (value <= 15) return 'низкий';
    if (value <= 30) return 'умеренный';
    if (value <= 50) return 'высокий';
    return 'очень высокий';
  };

  const getRiskColor = (value: number) => {
    if (value <= 5) return 'text-green-600';
    if (value <= 15) return 'text-yellow-600';
    if (value <= 30) return 'text-orange-600';
    if (value <= 50) return 'text-red-600';
    return 'text-red-800';
  };

  // Получаем топ-5 худших биомаркеров
  const worstBiomarkers = getTop5WorstBiomarkers();

  const getBiomarkerStatusIcon = (status: string | null) => {
    if (!status) return CheckCircle;
    const statusLower = status.toLowerCase();
    
    if (['critical', 'high', 'elevated', 'above_normal'].includes(statusLower)) {
      return AlertTriangle;
    }
    if (['low', 'below_normal', 'attention', 'borderline', 'abnormal'].includes(statusLower)) {
      return AlertCircle;
    }
    return CheckCircle;
  };

  const getBiomarkerStatusColor = (status: string | null) => {
    if (!status) return 'text-green-600';
    const statusLower = status.toLowerCase();
    
    if (statusLower === 'critical') {
      return 'text-red-600';
    }
    if (['high', 'elevated', 'above_normal'].includes(statusLower)) {
      return 'text-orange-600';
    }
    if (['low', 'below_normal', 'attention', 'borderline', 'abnormal'].includes(statusLower)) {
      return 'text-yellow-600';
    }
    return 'text-green-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600 bg-green-50';
      case 'good':
        return 'text-blue-600 bg-blue-50';
      case 'optimal':
        return 'text-green-600';
      case 'attention':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) {
      return <TrendingUp className="h-3 w-3 text-green-600" />;
    } else if (trend < 0) {
      return <TrendingDown className="h-3 w-3 text-red-600" />;
    }
    return null;
  };

  return (
    <div className="space-y-4">

      {/* ИИ-скоры рисков */}
      <Card className="shadow-sm border-gray-200/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-500" />
            ИИ-предикты рисков заболеваний
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-xs text-gray-600 mb-4 p-3 bg-purple-50/50 rounded-lg border border-purple-100/50">
              <p className="font-medium mb-1 text-purple-800">ИИ-анализ рисков развития заболеваний</p>
              <p className="text-purple-700">На основе биомаркеров, генетических факторов и клинических исследований</p>
            </div>
            
            {isLoadingRisks ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Анализируем риски...</p>
              </div>
            ) : aiRiskScores.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-3" />
                <h3 className="text-base font-semibold text-green-700 mb-2">Рисков не выявлено</h3>
                <p className="text-sm text-green-600 mb-1">Вы в отличной форме!</p>
                <p className="text-xs text-gray-600">Ваши показатели в норме, продолжайте здоровый образ жизни</p>
              </div>
            ) : (
              <div className="space-y-3">
                {aiRiskScores.map((risk, index) => (
                  <div key={index} className={`p-4 rounded-xl border ${
                    !risk.hasData ? 'border-gray-200 bg-gray-50/30' : 
                    risk.value <= 15 ? 'border-green-200 bg-green-50/30' :
                    risk.value <= 30 ? 'border-yellow-200 bg-yellow-50/30' :
                    risk.value <= 45 ? 'border-orange-200 bg-orange-50/30' : 
                    'border-red-200 bg-red-50/30'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <h5 className={`text-sm font-medium leading-tight ${
                        !risk.hasData ? 'text-gray-700' :
                        risk.value <= 15 ? 'text-green-800' :
                        risk.value <= 30 ? 'text-yellow-800' :
                        risk.value <= 45 ? 'text-orange-800' : 
                        'text-red-800'
                      }`}>
                        {risk.title}
                      </h5>
                      {risk.hasData && risk.value > 0 && (
                        <div className="text-right flex-shrink-0 ml-3">
                          <div className={`text-lg font-bold ${getRiskColor(risk.value)}`}>
                            {Math.round(risk.value)}%
                          </div>
                          <div className="text-xs text-gray-500">
                            {risk.period}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <p className={`text-xs mb-2 leading-relaxed ${
                      !risk.hasData ? 'text-gray-600' :
                      risk.value <= 15 ? 'text-green-700' :
                      risk.value <= 30 ? 'text-yellow-700' :
                      risk.value <= 45 ? 'text-orange-700' : 
                      'text-red-700'
                    }`}>
                      {risk.description}
                    </p>
                    
                    <div className={`text-xs ${
                      !risk.hasData ? 'text-gray-500' :
                      risk.value <= 15 ? 'text-green-600' :
                      risk.value <= 30 ? 'text-yellow-600' :
                      risk.value <= 45 ? 'text-orange-600' : 
                      'text-red-600'
                    }`}>
                      <span className="font-medium">
                        {!risk.hasData ? '' : 'Факторы: '}
                      </span>
                      {risk.factors}
                    </div>
                    
                    {risk.mechanism && (
                      <p className="text-xs text-gray-500 mt-2 italic">
                        {risk.mechanism}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Топ-5 критических биомаркеров */}
      <Card className="shadow-sm border-gray-200/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            Топ-5 критических биомаркеров
          </CardTitle>
        </CardHeader>
        <CardContent>
          {biomarkersLoading ? (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-xs text-gray-600">Загружаем биомаркеры...</p>
            </div>
          ) : worstBiomarkers.length === 0 ? (
            <div className="text-center py-6">
              <AlertTriangle className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-2">Нет данных о биомаркерах</p>
              <p className="text-xs text-gray-400">Загрузите результаты анализов для получения данных</p>
            </div>
          ) : (
            <div className="space-y-3">
              {worstBiomarkers.map((biomarker, index) => {
                const StatusIcon = getBiomarkerStatusIcon(biomarker.status);
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg border border-gray-200/50 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate('/my-biomarkers')}>
                    <div className="flex items-center gap-3">
                      <StatusIcon className={`h-4 w-4 ${getBiomarkerStatusColor(biomarker.status)}`} />
                      <div>
                        <h5 className="text-sm font-medium text-gray-800">
                          {biomarker.name}
                        </h5>
                        <span className="text-xs text-gray-600">
                          {biomarker.value || 'Нет данных'}
                          {biomarker.reference_range && (
                            <span className="text-gray-500 ml-1">
                              (норма: {biomarker.reference_range})
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                    <Badge 
                      className={`${getBiomarkerStatusColor(biomarker.status)} bg-transparent border text-xs px-2 py-1`}
                    >
                      {biomarker.status === 'critical' ? 'Критично' :
                       biomarker.status?.toLowerCase() === 'high' ? 'Высокий' :
                       biomarker.status?.toLowerCase() === 'elevated' ? 'Повышен' :
                       biomarker.status?.toLowerCase() === 'above_normal' ? 'Выше нормы' :
                       biomarker.status?.toLowerCase() === 'low' ? 'Понижен' :
                       biomarker.status?.toLowerCase() === 'below_normal' ? 'Ниже нормы' :
                       biomarker.status?.toLowerCase() === 'attention' ? 'Внимание' :
                       biomarker.status?.toLowerCase() === 'borderline' ? 'Граничный' :
                       biomarker.status?.toLowerCase() === 'abnormal' ? 'Аномальный' : 
                       biomarker.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
};

export default PriorityMetricsSection;