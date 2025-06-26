
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Activity, Target, Heart, TestTube } from "lucide-react";
import { CachedAnalytics } from "@/types/analytics";
import { useSmartAuth } from "@/hooks/useSmartAuth";
import { supabase } from "@/integrations/supabase/client";

interface HealthOverviewHeaderProps {
  analytics: CachedAnalytics;
}

interface BiomarkerTrend {
  name: string;
  latestValue: string;
  previousValue: string;
  trend: 'improving' | 'worsening' | 'stable';
  status: 'optimal' | 'good' | 'attention' | 'risk';
  unit?: string;
  changePercent?: number;
}

const HealthOverviewHeader: React.FC<HealthOverviewHeaderProps> = ({ analytics }) => {
  const { user } = useSmartAuth();
  const [realTrendsData, setRealTrendsData] = useState({
    improving: 0,
    stable: 0,
    concerning: 0,
    totalBiomarkers: 0
  });
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
          
          const latestNumeric = parseFloat(latest.value);
          const previousNumeric = parseFloat(previous.value);
          
          if (!isNaN(latestNumeric) && !isNaN(previousNumeric) && previousNumeric !== 0) {
            changePercent = ((latestNumeric - previousNumeric) / previousNumeric) * 100;
            
            if (Math.abs(changePercent) < 5) {
              trend = 'stable';
              stable++;
            } else {
              if (latest.status === 'optimal' && previous.status !== 'optimal') {
                trend = 'improving';
                improving++;
              } else if (latest.status !== 'optimal' && previous.status === 'optimal') {
                trend = 'worsening';
                concerning++;
              } else if (latest.status === 'optimal' || latest.status === 'good') {
                trend = changePercent > 0 ? 'stable' : 'improving';
                stable++;
              } else {
                trend = changePercent > 0 ? 'worsening' : 'improving';
                if (trend === 'worsening') concerning++;
                else improving++;
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
            status: latest.status as 'optimal' | 'good' | 'attention' | 'risk',
            unit: latest.unit || '',
            changePercent: Math.abs(changePercent)
          });
        } else if (markers.length === 1) {
          const marker = markers[0];
          if (marker.status === 'optimal' || marker.status === 'good') {
            stable++;
          } else {
            concerning++;
          }
          
          trends.push({
            name,
            latestValue: marker.value,
            previousValue: '-',
            trend: 'stable',
            status: marker.status as 'optimal' | 'good' | 'attention' | 'risk',
            unit: marker.unit || '',
            changePercent: 0
          });
        }
      });

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

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'высокий': return 'bg-red-50 text-red-700 border-red-200';
      case 'средний': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'низкий': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 65) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
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

  return (
    <div className="mb-8 space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                Аналитика здоровья
              </CardTitle>
              <p className="text-gray-600">
                Комплексная оценка на основе профиля здоровья и анализов
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className={`text-3xl font-bold ${getScoreColor(analytics.healthScore)}`}>
                  {typeof analytics.healthScore === 'number' 
                    ? analytics.healthScore.toFixed(1) 
                    : analytics.healthScore}/100
                </div>
                <div className="text-sm text-gray-500">Общий балл</div>
              </div>
              <Badge className={`px-3 py-1 ${getRiskLevelColor(analytics.riskLevel)}`}>
                {analytics.riskLevel} риск
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <Heart className="h-8 w-8 text-red-500" />
              <div>
                <div className="text-lg font-semibold">{analytics.totalAnalyses}</div>
                <div className="text-sm text-gray-600">Анализов</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <Target className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-lg font-semibold">{realTrendsData.totalBiomarkers}</div>
                <div className="text-sm text-gray-600">Биомаркеров</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <Activity className="h-8 w-8 text-purple-500" />
              <div>
                <div className="text-lg font-semibold">{analytics.totalConsultations}</div>
                <div className="text-sm text-gray-600">Консультаций</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <div className="flex">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                <Minus className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <div className="text-lg font-semibold">
                  {realTrendsData.improving}/{realTrendsData.concerning}
                </div>
                <div className="text-sm text-gray-600">Тренды</div>
              </div>
            </div>
          </div>

          {/* Детальная разбивка биомаркеров */}
          {realTrendsData.totalBiomarkers > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-700">Улучшается</span>
                </div>
                <div className="text-lg font-bold text-green-600">
                  {realTrendsData.improving} биомаркеров
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <Minus className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Стабильно</span>
                </div>
                <div className="text-lg font-bold text-gray-600">
                  {realTrendsData.stable} биомаркеров
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-700">Требует внимания</span>
                </div>
                <div className="text-lg font-bold text-red-600">
                  {realTrendsData.concerning} биомаркеров
                </div>
              </div>
            </div>
          )}

          {analytics.scoreExplanation && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Как рассчитывается балл здоровья:</h4>
              <p className="text-sm text-blue-800">{analytics.scoreExplanation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Детальная динамика биомаркеров */}
      {!isLoading && biomarkerTrends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Динамика биомаркеров
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {biomarkerTrends.slice(0, 8).map((biomarker, index) => (
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
                    {biomarker.status === 'optimal' ? 'Оптимально' :
                     biomarker.status === 'good' ? 'Хорошо' :
                     biomarker.status === 'attention' ? 'Внимание' : 'Риск'}
                  </Badge>
                </div>
              ))}
              
              {biomarkerTrends.length > 8 && (
                <div className="text-center text-sm text-gray-500 pt-2">
                  И еще {biomarkerTrends.length - 8} биомаркеров...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HealthOverviewHeader;
