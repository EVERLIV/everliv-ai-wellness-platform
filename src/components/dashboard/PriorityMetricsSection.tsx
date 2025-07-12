import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Heart, Brain, Activity, Bone, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { useBiomarkers } from '@/hooks/useBiomarkers';

const PriorityMetricsSection = () => {
  const { getTop5WorstBiomarkers, isLoading: biomarkersLoading } = useBiomarkers();

  // ИИ-скоры рисков
  const riskScores = [
    {
      title: 'Сердечно-сосудистый риск',
      value: 12,
      level: 'низкий',
      icon: Heart,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Нейродегенерация',
      value: 8,
      level: 'очень низкий',
      icon: Brain,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Диабет 2 типа',
      value: 15,
      level: 'низкий',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Остеопороз',
      value: 22,
      level: 'умеренный',
      icon: Bone,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  // Получаем топ-5 худших биомаркеров
  const worstBiomarkers = getTop5WorstBiomarkers();

  const getBiomarkerStatusIcon = (status: string | null) => {
    switch (status) {
      case 'critical':
      case 'high':
      case 'elevated':
        return AlertTriangle;
      case 'low':
      case 'attention':
      case 'borderline':
        return AlertCircle;
      default:
        return CheckCircle;
    }
  };

  const getBiomarkerStatusColor = (status: string | null) => {
    switch (status) {
      case 'critical':
        return 'text-red-600';
      case 'high':
      case 'elevated':
        return 'text-orange-600';
      case 'low':
      case 'attention':
      case 'borderline':
        return 'text-yellow-600';
      default:
        return 'text-green-600';
    }
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
            🤖 ИИ-скоры рисков
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {riskScores.map((risk, index) => {
              const Icon = risk.icon;
              return (
                <div key={index} className={`${risk.bgColor} rounded-lg p-3 border border-gray-200/30`}>
                  <div className="flex items-start gap-2">
                    <div className={`p-1.5 rounded ${risk.bgColor} border border-gray-200/50`}>
                      <Icon className={`h-4 w-4 ${risk.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-medium text-gray-800 mb-1 leading-tight">
                        {risk.title}
                      </h5>
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-bold text-gray-900">
                          {risk.value}%
                        </span>
                        <Badge className={`${getStatusColor(risk.level)} text-xs px-1.5 py-0.5`}>
                          {risk.level}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg border border-gray-200/50 hover:bg-gray-50 transition-colors">
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
                       biomarker.status === 'high' ? 'Высокий' :
                       biomarker.status === 'elevated' ? 'Повышен' :
                       biomarker.status === 'low' ? 'Понижен' :
                       biomarker.status === 'attention' ? 'Внимание' :
                       biomarker.status === 'borderline' ? 'Граничный' : 
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
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            💡 ИИ-инсайты и рекомендации
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Персонализированные инсайты */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                🔥 Персонализированные инсайты
              </h4>
              <div className="space-y-2">
                <div className="p-2.5 bg-blue-50/50 rounded border border-blue-200/30">
                  <p className="text-xs text-blue-800">
                    💡 "Ваш метаболический возраст улучшился на 2.3 года"
                  </p>
                </div>
                <div className="p-2.5 bg-yellow-50/50 rounded border border-yellow-200/30">
                  <p className="text-xs text-yellow-800">
                    ⚠️ "Снижение DHEA-S требует внимания к надпочечникам"
                  </p>
                </div>
              </div>
            </div>

            {/* Actionable рекомендации */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                🎯 Actionable рекомендации
              </h4>
              <div className="space-y-2">
                <div className="p-2.5 bg-green-50/50 rounded border border-green-200/30">
                  <p className="text-xs text-green-800">
                    🥗 "Увеличить омега-3 до 2000мг/день"
                  </p>
                </div>
                <div className="p-2.5 bg-purple-50/50 rounded border border-purple-200/30">
                  <p className="text-xs text-purple-800">
                    💊 "Витамин D3 4000 МЕ + К2"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Прогнозная аналитика */}
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200/50">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              📊 Прогнозная аналитика
            </h4>
            <div className="space-y-1">
              <p className="text-xs text-blue-800">
                📈 "При текущем тренде биовозраст снизится до 26.8 лет через 6 месяцев"
              </p>
              <p className="text-xs text-purple-800">
                🎯 "Достижение цели по витамину D ожидается через 8 недель"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PriorityMetricsSection;