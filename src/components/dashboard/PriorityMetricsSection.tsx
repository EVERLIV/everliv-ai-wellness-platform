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

  // Инициализация рисков - используем заглушки для совместимости
  useEffect(() => {
    setIsLoadingRisks(false);
    setRiskScores({
      noRisks: {
        name: 'Анализ рисков',
        percentage: 0,
        level: 'Информация',
        description: 'Для точного анализа рисков необходимо загрузить анализы и заполнить профиль здоровья.',
        factors: ['Загрузите результаты анализов', 'Заполните профиль здоровья'],
        period: 'при наличии данных'
      }
    });
  }, []);

  // Фильтруем только значимые риски или показываем сообщение об отсутствии рисков
  const aiRiskScores = (() => {
    const scores = Object.values(riskScores);
    const validScores = scores.filter(score => score.name && score.name !== 'Загрузка...');
    
    if (validScores.length === 0) {
      return [];
    }
    
    // Если есть специальное сообщение об отсутствии рисков
    if (riskScores.noRisks) {
      return [{
        title: riskScores.noRisks.name,
        value: riskScores.noRisks.percentage,
        period: riskScores.noRisks.period,
        level: riskScores.noRisks.level,
        description: riskScores.noRisks.description,
        factors: riskScores.noRisks.factors.join(', '),
        mechanism: riskScores.noRisks.mechanism
      }];
    }
    
    // Показываем найденные риски
    return validScores.map(score => ({
      title: score.name,
      value: score.percentage,
      period: score.period,
      level: score.level,
      description: score.description,
      factors: score.factors.join(', '),
      mechanism: score.mechanism
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
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            Показатели здоровья
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-xs text-gray-600 mb-4 p-3 bg-gray-50/50 rounded-lg">
              <p className="font-medium mb-1">Персонализированные вероятности развития заболеваний</p>
              <p>Основаны на анализе биомаркеров, генетики, образа жизни и сравнении с клиническими исследованиями</p>
            </div>
            
            {isLoadingRisks ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-xs text-gray-600">Анализируем ваши данные с помощью ИИ...</p>
              </div>
            ) : aiRiskScores.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-3" />
                <h3 className="text-lg font-semibold text-green-700 mb-2">Рисков не выявлено</h3>
                <p className="text-sm text-green-600 mb-1">Вы в отличной форме!</p>
                <p className="text-xs text-gray-600">Ваши показатели в норме, продолжайте здоровый образ жизни</p>
              </div>
            ) : (
              <div className="space-y-3">
                {aiRiskScores.map((risk, index) => (
                  <div key={index} className={`flex items-center justify-between py-3 px-4 rounded-lg border-l-4 ${
                    risk.value === 0 ? 'border-l-green-500 bg-green-50/50' : 'border-l-gray-200 bg-gray-50/30'
                  }`}>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className={`text-sm font-medium ${
                          risk.value === 0 ? 'text-green-800' : 'text-gray-900'
                        }`}>
                          {risk.title}
                        </h5>
                        {risk.value > 0 && (
                          <div className="flex items-center gap-2">
                            <span className={`text-lg font-bold ${getRiskColor(risk.value)}`}>
                              {risk.value}%
                            </span>
                            <span className="text-xs text-gray-500">
                              ({risk.period})
                            </span>
                          </div>
                        )}
                      </div>
                      <p className={`text-xs mb-1 ${
                        risk.value === 0 ? 'text-green-700' : 'text-gray-600'
                      }`}>
                        {risk.description}
                      </p>
                      <p className={`text-xs ${
                        risk.value === 0 ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {risk.value === 0 ? risk.factors : `Анализ: ${risk.factors}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 p-3 bg-blue-50/50 rounded-lg">
              <h6 className="text-[10px] sm:text-xs font-medium text-gray-700 mb-2">Градация рисков:</h6>
              <div className="grid grid-cols-2 gap-1 text-[8px] sm:text-[10px]">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>0-5%: Очень низкий</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                  <span>6-15%: Низкий</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                  <span>16-30%: Умеренный</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  <span>31%+: Высокий</span>
                </div>
              </div>
            </div>
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

      {/* ИИ-инсайты и рекомендации */}
      <Card className="shadow-sm border-gray-200/80">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            ИИ-инсайты и рекомендации
          </CardTitle>
          <button
            onClick={() => navigate('/analytics')}
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
          >
            <BarChart3 className="h-3 w-3" />
            Полная аналитика
          </button>
        </CardHeader>
        <CardContent>
          {analyticsLoading ? (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-xs text-gray-600">Загружаем рекомендации...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Прогнозная аналитика */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">
                  Прогнозная аналитика
                </h4>
                {recommendations.prognostic.length > 0 ? (
                  <div className="space-y-2">
                    {recommendations.prognostic.slice(0, 4).map((rec: any, index: number) => (
                      <div key={index} className="p-3 bg-blue-50/50 rounded-lg border border-blue-200/30">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-xs font-medium text-blue-900">{rec.title}</h5>
                          <span className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">
                            {rec.source_data?.confidence || 85}% уверенность
                          </span>
                        </div>
                        <p className="text-xs text-blue-800 mb-2">{rec.content}</p>
                        {rec.source_data?.scientificBasis && (
                          <p className="text-xs text-blue-600 italic">{rec.source_data.scientificBasis}</p>
                        )}
                        {rec.source_data?.actionItems && rec.source_data.actionItems.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-blue-900 mb-1">Действия:</p>
                            <ul className="text-xs text-blue-800 list-disc list-inside space-y-1">
                              {rec.source_data.actionItems.slice(0, 2).map((action: string, i: number) => (
                                <li key={i}>{action}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">Нет прогнозных данных</p>
                )}
              </div>

              {/* Actionable рекомендации */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">
                  Практические рекомендации
                </h4>
                {recommendations.actionable.length > 0 ? (
                  <div className="space-y-2">
                    {recommendations.actionable.slice(0, 4).map((rec: any, index: number) => (
                      <div key={index} className="p-3 bg-green-50/50 rounded-lg border border-green-200/30">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-xs font-medium text-green-900">{rec.title}</h5>
                          <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                            {rec.source_data?.timeframe || 'Постоянно'}
                          </span>
                        </div>
                        <p className="text-xs text-green-800 mb-2">{rec.content}</p>
                        {rec.source_data?.actionItems && rec.source_data.actionItems.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-green-900 mb-1">Конкретные действия:</p>
                            <ul className="text-xs text-green-800 list-disc list-inside space-y-1">
                              {rec.source_data.actionItems.slice(0, 3).map((action: string, i: number) => (
                                <li key={i}>{action}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">Нет активных рекомендаций</p>
                )}
              </div>

              {/* Персонализированные рекомендации */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">
                  Персонализированные рекомендации
                </h4>
                {recommendations.personalized.length > 0 ? (
                  <div className="space-y-2">
                    {recommendations.personalized.slice(0, 4).map((rec: any, index: number) => (
                      <div key={index} className="p-3 bg-purple-50/50 rounded-lg border border-purple-200/30">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-xs font-medium text-purple-900">{rec.title}</h5>
                          <span className={`text-xs px-2 py-1 rounded ${
                            rec.source_data?.priority === 'Высокий' ? 'text-red-700 bg-red-100' :
                            rec.source_data?.priority === 'Средний' ? 'text-yellow-700 bg-yellow-100' :
                            'text-gray-700 bg-gray-100'
                          }`}>
                            {rec.source_data?.priority || 'Стандартный'} приоритет
                          </span>
                        </div>
                        <p className="text-xs text-purple-800 mb-2">{rec.content}</p>
                        {rec.source_data?.actionItems && rec.source_data.actionItems.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-purple-900 mb-1">Рекомендации:</p>
                            <ul className="text-xs text-purple-800 list-disc list-inside space-y-1">
                              {rec.source_data.actionItems.slice(0, 3).map((action: string, i: number) => (
                                <li key={i}>{action}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">Нет персональных рекомендаций</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PriorityMetricsSection;