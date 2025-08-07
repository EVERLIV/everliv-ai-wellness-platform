
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { normalizeStatus, generateAIRecommendation } from '@/utils/biomarkerTrendsUtils';
import { generateDetailedBiomarkerRecommendation } from '@/services/ai/biomarker-recommendations';

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
  detailedRecommendations?: {
    immediateActions: string[];
    lifestyleChanges: string[];
    supplementsToConsider: string[];
    testsToMonitor: string[];
    warningSignsToWatch: string[];
  };
}

export const useBiomarkerTrends = () => {
  const { user } = useAuth();
  const [biomarkerTrends, setBiomarkerTrends] = useState<BiomarkerTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [realTrendsData, setRealTrendsData] = useState({
    improving: 0,
    stable: 0,
    concerning: 0,
    totalBiomarkers: 0
  });

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
      
      // Создаем массив промисов для параллельной обработки
      const trendPromises = Object.entries(biomarkerHistory).map(async ([name, markers]) => {
        if (markers.length >= 2) {
          markers.sort((a, b) => new Date(b.analysisDate).getTime() - new Date(a.analysisDate).getTime());
          
          const latest = markers[0];
          const previous = markers[1];
          
          let trend: 'improving' | 'worsening' | 'stable' = 'stable';
          let changePercent = 0;
          let aiRecommendation = '';
          let isOutOfRange = false;
          let detailedRecommendations = undefined;
          
          const latestNumeric = parseFloat(latest.value);
          const previousNumeric = parseFloat(previous.value);
          
          let normalizedStatus = normalizeStatus(latest.status);
          
          if (!isNaN(latestNumeric) && !isNaN(previousNumeric) && previousNumeric !== 0) {
            changePercent = ((latestNumeric - previousNumeric) / previousNumeric) * 100;
            
            if (Math.abs(changePercent) > 5) {
              if (normalizedStatus === 'optimal' || normalizedStatus === 'good' || normalizedStatus === 'normal') {
                trend = changePercent > 0 ? 'improving' : 'stable';
                if (changePercent > 0) {
                  aiRecommendation = 'Отличная динамика! Продолжайте в том же духе.';
                }
              } else if (normalizedStatus === 'risk' || normalizedStatus === 'attention' || normalizedStatus === 'high' || normalizedStatus === 'low') {
                trend = changePercent < 0 ? 'improving' : 'worsening';
                isOutOfRange = true;
                if (changePercent < 0) {
                  aiRecommendation = 'Положительная тенденция! Рекомендуем консультацию с врачом для контроля.';
                } else {
                  aiRecommendation = generateAIRecommendation(name, latestNumeric, normalizedStatus);
                }
              }
            } else {
              trend = 'stable';
              if (normalizedStatus === 'risk' || normalizedStatus === 'attention' || normalizedStatus === 'high' || normalizedStatus === 'low') {
                isOutOfRange = true;
                aiRecommendation = generateAIRecommendation(name, latestNumeric, normalizedStatus);
              }
            }
          }

          // Генерируем детальные рекомендации для проблемных биомаркеров
          if (isOutOfRange || normalizedStatus === 'risk' || normalizedStatus === 'attention') {
            try {
              const detailed = await generateDetailedBiomarkerRecommendation({
                biomarkerName: name,
                currentValue: latest.value,
                normalRange: latest.normalRange || 'не указан',
                status: normalizedStatus as any,
                userId: user.id,
                previousValue: previous.value,
                trend
              });
              
              if (detailed) {
                detailedRecommendations = {
                  immediateActions: detailed.immediateActions,
                  lifestyleChanges: detailed.lifestyleChanges,
                  supplementsToConsider: detailed.supplementsToConsider,
                  testsToMonitor: detailed.testsToMonitor,
                  warningSignsToWatch: detailed.warningSignsToWatch
                };
              }
            } catch (error) {
              console.error('Error generating detailed recommendations for', name, error);
            }
          }

          return {
            name,
            latestValue: latest.value,
            previousValue: previous.value,
            trend,
            status: normalizedStatus,
            unit: latest.unit || '',
            changePercent: Math.abs(changePercent),
            aiRecommendation,
            isOutOfRange,
            detailedRecommendations
          };
        } else if (markers.length === 1) {
          const marker = markers[0];
          let aiRecommendation = '';
          let isOutOfRange = false;
          let normalizedStatus = normalizeStatus(marker.status);
          let detailedRecommendations = undefined;
          
          if (normalizedStatus === 'risk' || normalizedStatus === 'attention' || normalizedStatus === 'high' || normalizedStatus === 'low') {
            isOutOfRange = true;
            aiRecommendation = generateAIRecommendation(marker.name, parseFloat(marker.value), normalizedStatus);
            
            // Генерируем детальные рекомендации
            try {
              const detailed = await generateDetailedBiomarkerRecommendation({
                biomarkerName: marker.name,
                currentValue: marker.value,
                normalRange: marker.normalRange || 'не указан',
                status: normalizedStatus as any,
                userId: user.id
              });
              
              if (detailed) {
                detailedRecommendations = {
                  immediateActions: detailed.immediateActions,
                  lifestyleChanges: detailed.lifestyleChanges,
                  supplementsToConsider: detailed.supplementsToConsider,
                  testsToMonitor: detailed.testsToMonitor,
                  warningSignsToWatch: detailed.warningSignsToWatch
                };
              }
            } catch (error) {
              console.error('Error generating detailed recommendations for', marker.name, error);
            }
          }
          
          return {
            name,
            latestValue: marker.value,
            previousValue: '-',
            trend: 'stable' as const,
            status: normalizedStatus,
            unit: marker.unit || '',
            changePercent: 0,
            aiRecommendation,
            isOutOfRange,
            detailedRecommendations
          };
        }
        return null;
      });

      // Ждем выполнения всех промисов
      const processedTrends = await Promise.all(trendPromises);
      const validTrends = processedTrends.filter(trend => trend !== null) as BiomarkerTrend[];

      // Подсчитываем статистику
      validTrends.forEach(trend => {
        if (trend.trend === 'improving') improving++;
        else if (trend.trend === 'worsening' || trend.isOutOfRange) concerning++;
        else stable++;
      });

      setRealTrendsData({
        improving,
        stable,
        concerning,
        totalBiomarkers: totalMarkers
      });

      validTrends.sort((a, b) => {
        const priorityOrder = { 'worsening': 0, 'improving': 1, 'stable': 2 };
        const statusOrder = { 'risk': 0, 'attention': 1, 'high': 2, 'low': 3, 'good': 4, 'normal': 5, 'optimal': 6 };
        
        if (priorityOrder[a.trend] !== priorityOrder[b.trend]) {
          return priorityOrder[a.trend] - priorityOrder[b.trend];
        }
        
        return statusOrder[a.status] - statusOrder[b.status];
      });

      setBiomarkerTrends(validTrends);
      console.log('Processed trends with detailed recommendations:', validTrends.length);

    } catch (error) {
      console.error('Error analyzing biomarker trends:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBiomarkerTrends();
      
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchBiomarkerTrends();
  };

  return {
    biomarkerTrends,
    isLoading,
    isRefreshing,
    realTrendsData,
    handleRefresh
  };
};
