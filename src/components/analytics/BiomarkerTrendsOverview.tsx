
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface BiomarkerTrend {
  name: string;
  latestValue: string;
  previousValue: string;
  trend: 'improving' | 'worsening' | 'stable';
  status: 'optimal' | 'good' | 'attention' | 'risk';
}

interface BiomarkerTrendsOverviewProps {
  trendsAnalysis: {
    improving: number;
    worsening: number;
    stable: number;
  };
}

const BiomarkerTrendsOverview: React.FC<BiomarkerTrendsOverviewProps> = ({ trendsAnalysis }) => {
  const { user } = useAuth();
  const [biomarkerTrends, setBiomarkerTrends] = useState<BiomarkerTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBiomarkerTrends();
    }
  }, [user]);

  const fetchBiomarkerTrends = async () => {
    if (!user) return;

    try {
      // Получаем последние 2 анализа пользователя
      const { data: analyses, error: analysesError } = await supabase
        .from('medical_analyses')
        .select('id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(2);

      if (analysesError || !analyses || analyses.length < 2) {
        console.log('Недостаточно данных для анализа трендов');
        setIsLoading(false);
        return;
      }

      // Получаем биомаркеры для последних двух анализов
      const { data: biomarkers, error: biomarkersError } = await supabase
        .from('biomarkers')
        .select('*')
        .in('analysis_id', [analyses[0].id, analyses[1].id]);

      if (biomarkersError || !biomarkers) {
        console.error('Ошибка получения биомаркеров:', biomarkersError);
        setIsLoading(false);
        return;
      }

      // Группируем биомаркеры по названиям
      const biomarkerGroups: { [key: string]: any[] } = {};
      biomarkers.forEach(biomarker => {
        if (!biomarkerGroups[biomarker.name]) {
          biomarkerGroups[biomarker.name] = [];
        }
        biomarkerGroups[biomarker.name].push({
          ...biomarker,
          analysisDate: analyses.find(a => a.id === biomarker.analysis_id)?.created_at
        });
      });

      // Анализируем тренды
      const trends: BiomarkerTrend[] = [];
      Object.entries(biomarkerGroups).forEach(([name, markers]) => {
        if (markers.length >= 2) {
          // Сортируем по дате
          markers.sort((a, b) => new Date(b.analysisDate).getTime() - new Date(a.analysisDate).getTime());
          
          const latest = markers[0];
          const previous = markers[1];
          
          // Определяем тренд
          let trend: 'improving' | 'worsening' | 'stable' = 'stable';
          
          const latestNumeric = parseFloat(latest.value);
          const previousNumeric = parseFloat(previous.value);
          
          if (!isNaN(latestNumeric) && !isNaN(previousNumeric)) {
            const change = ((latestNumeric - previousNumeric) / previousNumeric) * 100;
            
            if (Math.abs(change) < 5) {
              trend = 'stable';
            } else {
              // Для большинства биомаркеров улучшение = снижение показателя риска
              if (latest.status === 'optimal' && previous.status !== 'optimal') {
                trend = 'improving';
              } else if (latest.status !== 'optimal' && previous.status === 'optimal') {
                trend = 'worsening';
              } else if (change > 0) {
                trend = latest.status === 'optimal' ? 'improving' : 'worsening';
              } else {
                trend = latest.status === 'optimal' ? 'stable' : 'improving';
              }
            }
          }

          trends.push({
            name,
            latestValue: latest.value,
            previousValue: previous.value,
            trend,
            status: latest.status as 'optimal' | 'good' | 'attention' | 'risk'
          });
        }
      });

      setBiomarkerTrends(trends);
    } catch (error) {
      console.error('Ошибка анализа трендов биомаркеров:', error);
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
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'attention':
        return 'bg-yellow-100 text-yellow-800';
      case 'risk':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const improvingBiomarkers = biomarkerTrends.filter(b => b.trend === 'improving');
  const worseningBiomarkers = biomarkerTrends.filter(b => b.trend === 'worsening');
  const stableBiomarkers = biomarkerTrends.filter(b => b.trend === 'stable');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-white border border-blue-100">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-green-600">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">Улучшается</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold text-green-600 mb-3">
            {improvingBiomarkers.length} биомаркеров
          </div>
          <div className="space-y-2">
            {improvingBiomarkers.slice(0, 3).map((biomarker, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="truncate">{biomarker.name}</span>
                <Badge className={`text-xs ${getStatusColor(biomarker.status)}`}>
                  {biomarker.latestValue}
                </Badge>
              </div>
            ))}
            {improvingBiomarkers.length > 3 && (
              <div className="text-xs text-gray-500">
                +{improvingBiomarkers.length - 3} еще
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-blue-100">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <Activity className="h-4 w-4" />
            <span className="text-sm font-medium">Стабильно</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold text-blue-600 mb-3">
            {stableBiomarkers.length} биомаркеров
          </div>
          <div className="space-y-2">
            {stableBiomarkers.slice(0, 3).map((biomarker, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="truncate">{biomarker.name}</span>
                <Badge className={`text-xs ${getStatusColor(biomarker.status)}`}>
                  {biomarker.latestValue}
                </Badge>
              </div>
            ))}
            {stableBiomarkers.length > 3 && (
              <div className="text-xs text-gray-500">
                +{stableBiomarkers.length - 3} еще
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-blue-100">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">Требует внимания</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold text-amber-600 mb-3">
            {worseningBiomarkers.length} биомаркеров
          </div>
          <div className="space-y-2">
            {worseningBiomarkers.slice(0, 3).map((biomarker, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="truncate">{biomarker.name}</span>
                <Badge className={`text-xs ${getStatusColor(biomarker.status)}`}>
                  {biomarker.latestValue}
                </Badge>
              </div>
            ))}
            {worseningBiomarkers.length > 3 && (
              <div className="text-xs text-gray-500">
                +{worseningBiomarkers.length - 3} еще
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BiomarkerTrendsOverview;
