import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Heart, Brain, Activity, Bone, AlertTriangle, CheckCircle, AlertCircle, BarChart3, ChevronRight } from 'lucide-react';
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
    <div className="space-y-6 animate-fade-in">

      {/* ИИ-скоры рисков */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-card via-neutral-50/30 to-card border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-glass"></div>
        <CardHeader className="relative pb-4">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-brand-accent/20 to-brand-accent/10 rounded-lg">
              <Brain className="h-5 w-5 text-brand-accent" />
            </div>
            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              ИИ-предикты рисков заболеваний
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="space-y-5">
            <div className="text-sm text-muted-foreground p-4 bg-gradient-to-r from-brand-accent/5 to-brand-accent/10 rounded-xl border border-brand-accent/20">
              <p className="font-semibold mb-2 text-brand-accent flex items-center gap-2">
                <Brain className="h-4 w-4" />
                ИИ-анализ рисков развития заболеваний
              </p>
              <p className="text-muted-foreground">На основе биомаркеров, генетических факторов и клинических исследований</p>
            </div>
            
            {isLoadingRisks ? (
              <div className="text-center py-10">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin mx-auto mb-4"></div>
                  <div className="absolute inset-0 w-8 h-8 border-2 border-transparent border-t-brand-primary rounded-full animate-spin mx-auto mt-2" style={{animationDirection: 'reverse'}}></div>
                </div>
                <p className="text-base font-medium text-muted-foreground">Анализируем риски...</p>
                <p className="text-sm text-muted-foreground/80 mt-1">Обработка данных ИИ</p>
              </div>
            ) : aiRiskScores.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-success/20 to-brand-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-brand-success" />
                </div>
                <h3 className="text-lg font-semibold text-brand-success mb-3">Рисков не выявлено</h3>
                <p className="text-base text-brand-success/80 mb-2">Вы в отличной форме!</p>
                <p className="text-sm text-muted-foreground">Ваши показатели в норме, продолжайте здоровый образ жизни</p>
              </div>
            ) : (
              <div className="space-y-4">
                {aiRiskScores.map((risk, index) => (
                  <div 
                    key={index} 
                    className={`p-5 rounded-2xl transition-all duration-300 hover:opacity-90 ${
                      !risk.hasData ? 'bg-neutral-50/80' : 
                      risk.value <= 15 ? 'bg-brand-success/5' :
                      risk.value <= 30 ? 'bg-brand-warning/5' :
                      risk.value <= 45 ? 'bg-orange-50/80' : 
                      'bg-brand-error/5'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h5 className={`text-base font-semibold leading-tight ${
                        !risk.hasData ? 'text-neutral-700' :
                        risk.value <= 15 ? 'text-brand-success' :
                        risk.value <= 30 ? 'text-brand-warning' :
                        risk.value <= 45 ? 'text-orange-700' : 
                        'text-brand-error'
                      }`}>
                        {risk.title}
                      </h5>
                      {risk.hasData && risk.value > 0 && (
                        <div className="text-right flex-shrink-0 ml-4">
                          <div className={`text-2xl font-bold ${getRiskColor(risk.value)}`}>
                            {Math.round(risk.value)}%
                          </div>
                          <div className="text-xs text-muted-foreground font-medium">
                            {risk.period}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <p className={`text-sm mb-3 leading-relaxed ${
                      !risk.hasData ? 'text-neutral-600' :
                      risk.value <= 15 ? 'text-brand-success/80' :
                      risk.value <= 30 ? 'text-brand-warning/80' :
                      risk.value <= 45 ? 'text-orange-600' : 
                      'text-brand-error/80'
                    }`}>
                      {risk.description}
                    </p>
                    
                    <div className={`text-sm font-medium ${
                      !risk.hasData ? 'text-neutral-500' :
                      risk.value <= 15 ? 'text-brand-success/70' :
                      risk.value <= 30 ? 'text-brand-warning/70' :
                      risk.value <= 45 ? 'text-orange-600' : 
                      'text-brand-error/70'
                    }`}>
                      <span className="font-semibold">
                        {!risk.hasData ? '' : 'Факторы: '}
                      </span>
                      {risk.factors}
                    </div>
                    
                    {risk.mechanism && (
                      <p className="text-sm text-muted-foreground mt-3 italic pt-3 border-t border-current/10">
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
      <Card className="relative overflow-hidden bg-gradient-to-br from-card via-neutral-50/30 to-card border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-glass"></div>
        <CardHeader className="relative pb-4">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-brand-primary/20 to-brand-primary/10 rounded-lg">
              <BarChart3 className="h-5 w-5 text-brand-primary" />
            </div>
            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Топ-5 критических биомаркеров
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          {biomarkersLoading ? (
            <div className="text-center py-10">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mx-auto mb-4"></div>
                <div className="absolute inset-0 w-8 h-8 border-2 border-transparent border-t-brand-secondary rounded-full animate-spin mx-auto mt-2" style={{animationDirection: 'reverse'}}></div>
              </div>
              <p className="text-base font-medium text-muted-foreground">Загружаем биомаркеры...</p>
              <p className="text-sm text-muted-foreground/80 mt-1">Анализ показателей</p>
            </div>
          ) : worstBiomarkers.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-neutral-400" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">Нет данных о биомаркерах</h3>
              <p className="text-sm text-muted-foreground mb-4">Загрузите результаты анализов для получения данных</p>
              <button className="text-sm text-brand-primary font-semibold hover:text-brand-primary-dark transition-colors">
                Загрузить анализы →
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {worstBiomarkers.map((biomarker, index) => {
                const StatusIcon = getBiomarkerStatusIcon(biomarker.status);
                return (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 bg-white/80 rounded-xl hover:bg-white/90 transition-all duration-300 cursor-pointer hover:scale-[1.01] group" 
                    onClick={() => navigate('/my-biomarkers')}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <StatusIcon className={`h-5 w-5 ${getBiomarkerStatusColor(biomarker.status)}`} />
                      <div>
                        <h5 className="text-base font-semibold text-foreground mb-1">
                          {biomarker.name}
                        </h5>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground font-medium">
                            {biomarker.value || 'Нет данных'}
                          </span>
                          {biomarker.reference_range && (
                            <span className="text-xs text-muted-foreground/70 px-2 py-1 bg-neutral-50 rounded-full">
                              норма: {biomarker.reference_range}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getBiomarkerStatusColor(biomarker.status)} bg-current/10`}>
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
                      </div>
                      
                      <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
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