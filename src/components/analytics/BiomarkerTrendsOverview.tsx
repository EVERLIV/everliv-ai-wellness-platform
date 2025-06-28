import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Activity, AlertTriangle, TestTube, Brain, RefreshCw, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSmartAuth } from '@/hooks/useSmartAuth';

interface BiomarkerTrend {
  name: string;
  latestValue: string;
  previousValue: string;
  trend: 'improving' | 'worsening' | 'stable';
  status: 'optimal' | 'good' | 'attention' | 'risk' | 'normal' | 'high' | 'low' | 'unknown';
  unit?: string;
  changePercent?: number;
  aiRecommendation?: string;
  isOutOfRange?: boolean;
}

interface BiomarkerTrendsOverviewProps {
  trendsAnalysis: {
    improving: number;
    worsening: number;
    stable: number;
  };
}

const BiomarkerTrendsOverview: React.FC<BiomarkerTrendsOverviewProps> = ({ trendsAnalysis }) => {
  const { user } = useSmartAuth();
  const [biomarkerTrends, setBiomarkerTrends] = useState<BiomarkerTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [realTrendsData, setRealTrendsData] = useState({
    improving: 0,
    stable: 0,
    concerning: 0,
    totalBiomarkers: 0
  });

  useEffect(() => {
    if (user) {
      fetchBiomarkerTrends();
      
      // Реал-тайм подписка на изменения
      const channel = supabase
        .channel(`biomarkers_${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'biomarkers'
          },
          () => {
            console.log('Biomarker data updated, refreshing...');
            fetchBiomarkerTrends();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchBiomarkerTrends = async () => {
    if (!user) return;

    try {
      console.log('Fetching biomarker trends for user:', user.id);

      const { data: analyses, error: analysesError } = await supabase
        .from('medical_analyses')
        .select('id, created_at, results')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (analysesError) {
        console.error('Error fetching analyses:', analysesError);
        setIsLoading(false);
        return;
      }

      if (!analyses || analyses.length === 0) {
        console.log('No analyses found for user');
        setIsLoading(false);
        return;
      }

      const biomarkerHistory: { [key: string]: any[] } = {};
      let totalMarkers = 0;

      analyses.forEach(analysis => {
        if (analysis.results && typeof analysis.results === 'object') {
          const results = analysis.results as any;
          
          if (results.markers && Array.isArray(results.markers)) {
            results.markers.forEach((marker: any) => {
              if (marker.name && marker.value) {
                if (!biomarkerHistory[marker.name]) {
                  biomarkerHistory[marker.name] = [];
                }
                biomarkerHistory[marker.name].push({
                  ...marker,
                  analysisDate: analysis.created_at,
                  analysisId: analysis.id
                });
                totalMarkers++;
              }
            });
          }
        }
      });

      const trends: BiomarkerTrend[] = [];
      let improving = 0;
      let stable = 0;
      let concerning = 0;
      
      Object.entries(biomarkerHistory).forEach(([name, markers]) => {
        if (markers.length >= 2) {
          markers.sort((a, b) => new Date(b.analysisDate).getTime() - new Date(a.analysisDate).getTime());
          
          const latest = markers[0];
          const previous = markers[1];
          
          let trend: 'improving' | 'worsening' | 'stable' = 'stable';
          let changePercent = 0;
          let aiRecommendation = '';
          let isOutOfRange = false;
          
          const latestNumeric = parseFloat(latest.value);
          const previousNumeric = parseFloat(previous.value);
          
          // Нормализуем статус к стандартным значениям
          let normalizedStatus = normalizeStatus(latest.status);
          
          if (!isNaN(latestNumeric) && !isNaN(previousNumeric) && previousNumeric !== 0) {
            changePercent = ((latestNumeric - previousNumeric) / previousNumeric) * 100;
            
            // Определяем тренд и рекомендации
            if (Math.abs(changePercent) > 5) {
              if (normalizedStatus === 'optimal' || normalizedStatus === 'good' || normalizedStatus === 'normal') {
                trend = changePercent > 0 ? 'improving' : 'stable';
                if (changePercent > 0) {
                  improving++;
                  aiRecommendation = 'Отличная динамика! Продолжайте в том же духе.';
                } else {
                  stable++;
                }
              } else if (normalizedStatus === 'risk' || normalizedStatus === 'attention' || normalizedStatus === 'high' || normalizedStatus === 'low') {
                trend = changePercent < 0 ? 'improving' : 'worsening';
                isOutOfRange = true;
                if (changePercent < 0) {
                  improving++;
                  aiRecommendation = 'Положительная тенденция! Рекомендуем консультацию с врачом для контроля.';
                } else {
                  concerning++;
                  aiRecommendation = generateAIRecommendation(name, latestNumeric, normalizedStatus);
                }
              } else {
                trend = 'stable';
                stable++;
              }
            } else {
              trend = 'stable';
              stable++;
              if (normalizedStatus === 'risk' || normalizedStatus === 'attention' || normalizedStatus === 'high' || normalizedStatus === 'low') {
                isOutOfRange = true;
                aiRecommendation = generateAIRecommendation(name, latestNumeric, normalizedStatus);
              }
            }
          } else {
            stable++;
          }

          trends.push({
            name,
            latestValue: latest.value,
            previousValue: previous.value,
            trend,
            status: normalizedStatus,
            unit: latest.unit || '',
            changePercent: Math.abs(changePercent),
            aiRecommendation,
            isOutOfRange
          });
        } else if (markers.length === 1) {
          const marker = markers[0];
          stable++;
          
          let aiRecommendation = '';
          let isOutOfRange = false;
          let normalizedStatus = normalizeStatus(marker.status);
          
          if (normalizedStatus === 'risk' || normalizedStatus === 'attention' || normalizedStatus === 'high' || normalizedStatus === 'low') {
            isOutOfRange = true;
            aiRecommendation = generateAIRecommendation(marker.name, parseFloat(marker.value), normalizedStatus);
          }
          
          trends.push({
            name,
            latestValue: marker.value,
            previousValue: '-',
            trend: 'stable',
            status: normalizedStatus,
            unit: marker.unit || '',
            changePercent: 0,
            aiRecommendation,
            isOutOfRange
          });
        }
      });

      setRealTrendsData({
        improving,
        stable,
        concerning,
        totalBiomarkers: totalMarkers
      });

      // Сортируем по приоритету: сначала проблемные, потом улучшающиеся, потом стабильные
      trends.sort((a, b) => {
        const priorityOrder = { 'worsening': 0, 'improving': 1, 'stable': 2 };
        const statusOrder = { 'risk': 0, 'attention': 1, 'high': 2, 'low': 3, 'good': 4, 'normal': 5, 'optimal': 6 };
        
        if (priorityOrder[a.trend] !== priorityOrder[b.trend]) {
          return priorityOrder[a.trend] - priorityOrder[b.trend];
        }
        
        return statusOrder[a.status] - statusOrder[b.status];
      });

      setBiomarkerTrends(trends);
      console.log('Processed trends:', trends.length);

    } catch (error) {
      console.error('Error analyzing biomarker trends:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Функция для нормализации статуса к стандартным значениям
  const normalizeStatus = (status: string): 'optimal' | 'good' | 'attention' | 'risk' | 'normal' | 'high' | 'low' | 'unknown' => {
    if (!status) return 'unknown';
    
    const statusLower = status.toLowerCase();
    
    // Приводим все возможные варианты к стандартным
    if (statusLower.includes('optimal') || statusLower.includes('отличн') || statusLower.includes('идеальн')) {
      return 'optimal';
    }
    if (statusLower.includes('good') || statusLower.includes('хорош') || statusLower.includes('норм')) {
      return 'good';
    }
    if (statusLower.includes('normal') || statusLower.includes('в норме') || statusLower.includes('нормальн')) {
      return 'normal';
    }
    if (statusLower.includes('attention') || statusLower.includes('внимание') || statusLower.includes('осторожн')) {
      return 'attention';
    }
    if (statusLower.includes('risk') || statusLower.includes('риск') || statusLower.includes('опасн')) {
      return 'risk';
    }
    if (statusLower.includes('high') || statusLower.includes('высок') || statusLower.includes('повышен')) {
      return 'high';
    }
    if (statusLower.includes('low') || statusLower.includes('низк') || statusLower.includes('пониж')) {
      return 'low';
    }
    
    return 'unknown';
  };

  const generateAIRecommendation = (biomarkerName: string, value: number, status: string): string => {
    const recommendations: Record<string, Record<string, string>> = {
      'Глюкоза': {
        'risk': 'Критически важно контролировать уровень сахара. Рекомендуется немедленная консультация эндокринолога.',
        'attention': 'Повышенный уровень глюкозы. Ограничьте простые углеводы, увеличьте физическую активность.'
      },
      'Холестерин': {
        'risk': 'Высокий риск сердечно-сосудистых заболеваний. Необходима консультация кардиолога.',
        'attention': 'Повышенный холестерин. Рекомендуется диета с низким содержанием насыщенных жиров.'
      },
      'Гемоглобин': {
        'risk': 'Критический уровень гемоглобина. Требуется срочная консультация гематолога.',
        'attention': 'Пониженный гемоглобин. Включите в рацион железосодержащие продукты.'
      }
    };

    const biomarkerKey = Object.keys(recommendations).find(key => 
      biomarkerName.toLowerCase().includes(key.toLowerCase())
    );

    if (biomarkerKey && recommendations[biomarkerKey][status]) {
      return recommendations[biomarkerKey][status];
    }

    return status === 'risk' 
      ? 'Показатель вне нормы. Рекомендуется консультация с врачом.'
      : 'Показатель требует внимания. Следите за динамикой.';
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchBiomarkerTrends();
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'worsening':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'good':
      case 'normal':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'attention':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'risk':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'optimal': return 'Оптимально';
      case 'good': return 'Хорошо';
      case 'normal': return 'Норма';
      case 'attention': return 'Внимание';
      case 'risk': return 'Риск';
      case 'high': return 'Высокий';
      case 'low': return 'Низкий';
      default: return 'Неизвестно';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'border-green-200 bg-green-50';
      case 'worsening': return 'border-red-200 bg-red-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (biomarkerTrends.length === 0) {
    return (
      <div className="text-center py-8">
        <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Недостаточно данных для анализа трендов
        </h3>
        <p className="text-gray-600">
          Загрузите минимум 2 анализа для отслеживания динамики биомаркеров
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Современная сводка по трендам с реал-тайм данными */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-base font-semibold">Улучшается</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700 mb-1">
              {realTrendsData.improving}
            </div>
            <div className="text-sm text-green-600">
              {realTrendsData.improving === 1 ? 'биомаркер' : 'биомаркеров'}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-base font-semibold">Стабильно</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 mb-1">
              {realTrendsData.stable}
            </div>
            <div className="text-sm text-blue-600">
              {realTrendsData.stable === 1 ? 'биомаркер' : 'биомаркеров'}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-rose-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-red-700">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <span className="text-base font-semibold">Требует внимания</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700 mb-1">
              {realTrendsData.concerning}
            </div>
            <div className="text-sm text-red-600">
              {realTrendsData.concerning === 1 ? 'биомаркер' : 'биомаркеров'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Детальный список биомаркеров с ИИ рекомендациями */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TestTube className="h-5 w-5 text-purple-600" />
              </div>
              Динамика биомаркеров
              <Badge variant="outline" className="ml-2">
                Реал-тайм
              </Badge>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Обновить
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {biomarkerTrends.slice(0, 10).map((biomarker, index) => (
              <div 
                key={index} 
                className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${getTrendColor(biomarker.trend)} hover:shadow-lg`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      {getTrendIcon(biomarker.trend)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-lg">
                        {biomarker.name}
                        {biomarker.isOutOfRange && (
                          <AlertTriangle className="inline h-4 w-4 text-orange-500 ml-2" />
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">
                          {biomarker.previousValue} → {biomarker.latestValue}
                          {biomarker.unit && ` ${biomarker.unit}`}
                        </span>
                        {biomarker.changePercent && biomarker.changePercent > 0 && (
                          <span className="ml-2 text-xs bg-white px-2 py-1 rounded-full">
                            {biomarker.trend === 'improving' ? '+' : ''}
                            {biomarker.changePercent.toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(biomarker.status)} border text-xs px-3 py-1`}>
                    {getStatusText(biomarker.status)}
                  </Badge>
                </div>
                
                {/* ИИ рекомендации для отклонений */}
                {biomarker.aiRecommendation && (
                  <div className="bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-lg p-3 mt-3">
                    <div className="flex items-start gap-2">
                      <div className="p-1 bg-indigo-100 rounded">
                        <Brain className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-medium text-indigo-800 mb-1">
                          ИИ-рекомендация:
                        </div>
                        <p className="text-sm text-indigo-700 leading-relaxed">
                          {biomarker.aiRecommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {biomarkerTrends.length > 10 && (
              <div className="text-center text-sm text-gray-500 pt-4 border-t">
                <div className="flex items-center justify-center gap-2">
                  <Zap className="h-4 w-4 text-blue-500" />
                  <span>И еще {biomarkerTrends.length - 10} биомаркеров в реал-тайм мониторинге</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BiomarkerTrendsOverview;
