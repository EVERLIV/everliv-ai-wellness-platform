
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Activity, TrendingUp, TestTube } from 'lucide-react';
import { useSmartAuth } from '@/hooks/useSmartAuth';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsPageHeaderProps {
  healthScore: number;
  riskLevel: string;
}

const AnalyticsPageHeader: React.FC<AnalyticsPageHeaderProps> = ({
  healthScore,
  riskLevel
}) => {
  const { user } = useSmartAuth();
  const [realData, setRealData] = useState({
    totalAnalyses: 0,
    totalBiomarkers: 0,
    totalConsultations: 0,
    trendsData: {
      improving: 0,
      stable: 0,
      concerning: 0
    }
  });

  useEffect(() => {
    if (user) {
      fetchRealData();
    }
  }, [user]);

  const fetchRealData = async () => {
    if (!user) return;

    try {
      // Получаем реальные данные анализов
      const { data: analyses, error: analysesError } = await supabase
        .from('medical_analyses')
        .select('id, created_at, results')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (analysesError) {
        console.error('Error fetching analyses:', analysesError);
        return;
      }

      // Получаем биомаркеры
      const analysisIds = analyses?.map(a => a.id) || [];
      const { data: biomarkers, error: biomarkersError } = await supabase
        .from('biomarkers')
        .select('*')
        .in('analysis_id', analysisIds);

      if (biomarkersError) {
        console.error('Error fetching biomarkers:', biomarkersError);
      }

      // Получаем консультации
      const { data: chats, error: chatsError } = await supabase
        .from('ai_doctor_chats')
        .select('id')
        .eq('user_id', user.id);

      if (chatsError) {
        console.error('Error fetching chats:', chatsError);
      }

      // Анализируем тренды биомаркеров
      const trends = analyzeBiomarkerTrends(analyses || []);

      setRealData({
        totalAnalyses: analyses?.length || 0,
        totalBiomarkers: biomarkers?.length || 0,
        totalConsultations: chats?.length || 0,
        trendsData: trends
      });

    } catch (error) {
      console.error('Error fetching real analytics data:', error);
    }
  };

  const analyzeBiomarkerTrends = (analyses: any[]) => {
    let improving = 0;
    let stable = 0;
    let concerning = 0;

    const biomarkerMap = new Map<string, any[]>();

    // Группируем биомаркеры по названиям
    analyses.forEach(analysis => {
      if (analysis.results?.markers && Array.isArray(analysis.results.markers)) {
        analysis.results.markers.forEach((marker: any) => {
          if (marker.name) {
            if (!biomarkerMap.has(marker.name)) {
              biomarkerMap.set(marker.name, []);
            }
            biomarkerMap.get(marker.name)?.push({
              value: marker.value,
              status: marker.status,
              date: analysis.created_at
            });
          }
        });
      }
    });

    // Анализируем тренды
    biomarkerMap.forEach((values, markerName) => {
      if (values.length >= 2) {
        values.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const latest = values[values.length - 1];
        const previous = values[values.length - 2];

        if (latest.status === 'optimal' || latest.status === 'good') {
          if (previous.status === 'concerning' || previous.status === 'critical') {
            improving++;
          } else {
            stable++;
          }
        } else if (latest.status === 'concerning' || latest.status === 'critical') {
          concerning++;
        } else {
          stable++;
        }
      } else if (values.length === 1) {
        const marker = values[0];
        if (marker.status === 'optimal' || marker.status === 'good') {
          stable++;
        } else if (marker.status === 'concerning' || marker.status === 'critical') {
          concerning++;
        } else {
          stable++;
        }
      }
    });

    return { improving, stable, concerning };
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'низкий':
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'средний':
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'высокий':
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'критический':
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Аналитика здоровья
          </h1>
          <p className="text-gray-600">
            Комплексная оценка на основе профиля здоровья и анализов
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Общий балл здоровья */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/50">
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 mx-auto mb-3 text-red-500" />
              <div className={`text-3xl font-bold ${getScoreColor(healthScore)} mb-1`}>
                {healthScore.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600 mb-2">/100</div>
              <Badge className={`${getRiskLevelColor(riskLevel)} border text-xs`}>
                {riskLevel} риск
              </Badge>
              <div className="text-xs text-gray-500 mt-1">Общий балл</div>
            </CardContent>
          </Card>

          {/* Анализы */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/50">
            <CardContent className="p-6 text-center">
              <TestTube className="h-8 w-8 mx-auto mb-3 text-blue-500" />
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {realData.totalAnalyses}
              </div>
              <div className="text-sm text-gray-600">Анализов</div>
            </CardContent>
          </Card>

          {/* Биомаркеры */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/50">
            <CardContent className="p-6 text-center">
              <Activity className="h-8 w-8 mx-auto mb-3 text-purple-500" />
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {realData.totalBiomarkers}
              </div>
              <div className="text-sm text-gray-600">Биомаркеров</div>
            </CardContent>
          </Card>

          {/* Консультации */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/50">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-3 text-green-500" />
              <div className="text-3xl font-bold text-green-600 mb-1">
                {realData.totalConsultations}
              </div>
              <div className="text-sm text-gray-600">Консультаций</div>
            </CardContent>
          </Card>
        </div>

        {/* Тренды */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-xl font-bold text-green-700 mb-1">
                {realData.trendsData.improving}
              </div>
              <div className="text-sm text-green-600">Улучшается</div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <Activity className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-xl font-bold text-blue-700 mb-1">
                {realData.trendsData.stable}
              </div>
              <div className="text-sm text-blue-600">Стабильно</div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4 text-center">
              <Activity className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <div className="text-xl font-bold text-orange-700 mb-1">
                {realData.trendsData.concerning}
              </div>
              <div className="text-sm text-orange-600">Требует внимания</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPageHeader;
