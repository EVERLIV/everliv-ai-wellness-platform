import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Heart, Brain, Activity, Bone, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

const PriorityMetricsSection = () => {
  // Центральные показатели
  const heroMetrics = [
    {
      title: 'Биологический возраст',
      value: '28.4',
      unit: 'лет',
      trend: -3.2,
      description: 'от хронологического',
      status: 'excellent'
    },
    {
      title: 'Индекс витальности',
      value: '87',
      unit: '/100',
      trend: 5,
      description: 'за месяц',
      status: 'good'
    },
    {
      title: 'Скорость старения',
      value: '0.85',
      unit: '',
      trend: -15,
      description: 'замедленная на 15%',
      status: 'excellent'
    }
  ];

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

  // Критические биомаркеры
  const biomarkers = [
    {
      name: 'Воспаление (hsCRP)',
      value: '0.8 мг/л',
      status: 'optimal',
      icon: CheckCircle
    },
    {
      name: 'Гликация (HbA1c)',
      value: '5.2%',
      status: 'optimal',
      icon: CheckCircle
    },
    {
      name: 'Гормоны (DHEA-S)',
      value: '285 мкг/дл',
      status: 'attention',
      icon: AlertCircle
    },
    {
      name: 'Витамин D',
      value: '32 нг/мл',
      status: 'attention',
      icon: AlertCircle
    },
    {
      name: 'Омега-3 индекс',
      value: '6.2%',
      status: 'optimal',
      icon: CheckCircle
    }
  ];

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
      {/* Центральные показатели */}
      <Card className="shadow-sm border-gray-200/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            📊 Центральные показатели
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {heroMetrics.map((metric, index) => (
              <div key={index} className="bg-gray-50/50 rounded-lg p-4 border border-gray-200/50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {metric.value}
                    <span className="text-sm font-normal text-gray-600 ml-1">
                      {metric.unit}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    {metric.title}
                  </h4>
                  <div className="flex items-center justify-center gap-1 text-xs">
                    {getTrendIcon(metric.trend)}
                    <span className={metric.trend > 0 ? 'text-green-600' : 'text-red-600'}>
                      {Math.abs(metric.trend)} {metric.description}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
            🧬 Топ-5 критических биомаркеров
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {biomarkers.map((biomarker, index) => {
              const Icon = biomarker.icon;
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg border border-gray-200/50 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${getStatusColor(biomarker.status)}`} />
                    <div>
                      <h5 className="text-sm font-medium text-gray-800">
                        {biomarker.name}
                      </h5>
                      <span className="text-xs text-gray-600">
                        {biomarker.value}
                      </span>
                    </div>
                  </div>
                  <Badge 
                    className={`${getStatusColor(biomarker.status)} text-xs px-2 py-1`}
                  >
                    {biomarker.status === 'optimal' ? '✅' : '⚠️'}
                  </Badge>
                </div>
              );
            })}
          </div>
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