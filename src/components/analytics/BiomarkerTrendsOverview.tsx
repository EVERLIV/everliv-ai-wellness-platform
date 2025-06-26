import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, AlertTriangle, TestTube } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSmartAuth } from '@/hooks/useSmartAuth';

interface BiomarkerTrend {
  name: string;
  latestValue: string;
  previousValue: string;
  trend: 'improving' | 'worsening' | 'stable';
  status: string;
  unit?: string;
  changePercent?: number;
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
  const [realTrendsData, setRealTrendsData] = useState({
    improving: 0,
    stable: 0,
    concerning: 0,
    totalBiomarkers: 0
  });

  useEffect(() => {
    if (user) {
      fetchBiomarkerTrends();
    }
  }, [user]);

  const fetchBiomarkerTrends = async () => {
    if (!user) return;

    try {
      console.log('Fetching biomarker trends for user:', user.id);

      // First get user's analysis IDs
      const { data: analyses, error: analysesError } = await supabase
        .from('medical_analyses')
        .select('id')
        .eq('user_id', user.id);

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

      const analysisIds = analyses.map(a => a.id);

      // Then get biomarkers for those analyses
      const { data: biomarkers, error: biomarkersError } = await supabase
        .from('biomarkers')
        .select(`
          name,
          value,
          status,
          reference_range,
          analysis_id,
          created_at
        `)
        .in('analysis_id', analysisIds)
        .order('created_at', { ascending: false });

      if (biomarkersError) {
        console.error('Error fetching biomarkers:', biomarkersError);
        setIsLoading(false);
        return;
      }

      if (!biomarkers || biomarkers.length === 0) {
        console.log('No biomarkers found for user');
        setIsLoading(false);
        return;
      }

      console.log('Found biomarkers:', biomarkers.length);

      // Группируем биомаркеры по имени
      const biomarkerHistory: { [key: string]: any[] } = {};
      let totalMarkers = 0;

      biomarkers.forEach(biomarker => {
        if (biomarker.name && biomarker.value) {
          if (!biomarkerHistory[biomarker.name]) {
            biomarkerHistory[biomarker.name] = [];
          }
          biomarkerHistory[biomarker.name].push(biomarker);
          totalMarkers++;
        }
      });

      console.log('Total biomarkers found:', totalMarkers);
      console.log('Unique biomarkers:', Object.keys(biomarkerHistory).length);

      // Анализируем тренды
      const trends: BiomarkerTrend[] = [];
      let improving = 0;
      let stable = 0;
      let concerning = 0;
      
      Object.entries(biomarkerHistory).forEach(([name, markers]) => {
        if (markers.length >= 2) {
          markers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          
          const latest = markers[0];
          const previous = markers[1];
          
          let trend: 'improving' | 'worsening' | 'stable' = 'stable';
          let changePercent = 0;
          
          const latestNumeric = parseFloat(latest.value);
          const previousNumeric = parseFloat(previous.value);
          
          if (!isNaN(latestNumeric) && !isNaN(previousNumeric) && previousNumeric !== 0) {
            changePercent = ((latestNumeric - previousNumeric) / previousNumeric) * 100;
            
            if (Math.abs(changePercent) > 5) {
              if (latest.status === 'optimal' || latest.status === 'good') {
                trend = changePercent > 0 ? 'improving' : 'stable';
                if (changePercent > 0) improving++;
                else stable++;
              } else if (latest.status === 'risk' || latest.status === 'attention') {
                trend = changePercent < 0 ? 'improving' : 'worsening';
                if (changePercent < 0) improving++;
                else concerning++;
              } else {
                trend = 'stable';
                stable++;
              }
            } else {
              trend = 'stable';
              stable++;
            }
          } else {
            stable++;
          }

          trends.push({
            name,
            latestValue: latest.value,
            previousValue: previous.value,
            trend,
            status: latest.status || 'unknown',
            unit: latest.reference_range ? latest.reference_range.split(' ')[1] : '',
            changePercent: Math.abs(changePercent)
          });
        } else if (markers.length === 1) {
          const marker = markers[0];
          stable++;
          
          trends.push({
            name,
            latestValue: marker.value,
            previousValue: '-',
            trend: 'stable',
            status: marker.status || 'unknown',
            unit: marker.reference_range ? marker.reference_range.split(' ')[1] : '',
            changePercent: 0
          });
        }
      });

      // Обновляем реальные данные трендов
      setRealTrendsData({
        improving,
        stable,
        concerning,
        totalBiomarkers: totalMarkers
      });

      trends.sort((a, b) => {
        const priorityOrder = { 'worsening': 0, 'improving': 1, 'stable': 2 };
        return priorityOrder[a.trend] - priorityOrder[b.trend];
      });

      setBiomarkerTrends(trends);
      console.log('Processed trends:', trends.length);

    } catch (error) {
      console.error('Error analyzing biomarker trends:', error);
    } finally {
      setIsLoading(false);
    }
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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'attention':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'risk':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'border-green-200 bg-green-50';
      case 'worsening':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-blue-200 bg-blue-50';
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
      {/* Сводка по трендам - используем реальные данные */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`${getTrendColor('improving')} border-2`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <TrendingUp className="h-5 w-5" />
              <span className="text-base font-semibold">Улучшается</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 mb-1">
              {realTrendsData.improving}
            </div>
            <div className="text-sm text-green-600">
              биомаркеров
            </div>
          </CardContent>
        </Card>

        <Card className={`${getTrendColor('stable')} border-2`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Activity className="h-5 w-5" />
              <span className="text-base font-semibold">Стабильно</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 mb-1">
              {realTrendsData.stable}
            </div>
            <div className="text-sm text-blue-600">
              биомаркеров
            </div>
          </CardContent>
        </Card>

        <Card className={`${getTrendColor('worsening')} border-2`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-base font-semibold">Требует внимания</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700 mb-1">
              {realTrendsData.concerning}
            </div>
            <div className="text-sm text-red-600">
              биомаркеров
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Детальный список биомаркеров */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Динамика биомаркеров
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {biomarkerTrends.slice(0, 10).map((biomarker, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
                <div className="flex items-center gap-3">
                  {getTrendIcon(biomarker.trend)}
                  <div>
                    <div className="font-medium text-gray-900">{biomarker.name}</div>
                    <div className="text-sm text-gray-600">
                      {biomarker.previousValue} → {biomarker.latestValue}
                      {biomarker.unit && ` ${biomarker.unit}`}
                      {biomarker.changePercent && biomarker.changePercent > 0 && (
                        <span className="ml-2 text-xs">
                          ({biomarker.changePercent.toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Badge className={`${getStatusColor(biomarker.status)} border`}>
                  {getStatusText(biomarker.status)}
                </Badge>
              </div>
            ))}
            
            {biomarkerTrends.length > 10 && (
              <div className="text-center text-sm text-gray-500 pt-2">
                И еще {biomarkerTrends.length - 10} биомаркеров...
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BiomarkerTrendsOverview;
