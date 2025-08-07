import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CachedAnalytics } from '@/types/analytics';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useCachedAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<CachedAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Загрузка кэшированной аналитики
  const loadCachedAnalytics = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('user_analytics')
        .select('analytics_data, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error loading cached analytics:', error);
        return;
      }

      if (data) {
        setAnalytics(data.analytics_data as CachedAnalytics);
        setLastUpdated(data.updated_at);
      }
    } catch (error) {
      console.error('Failed to load cached analytics:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Генерация новой аналитики
  const generateAnalytics = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Вызываем edge function для генерации аналитики
      const { data: riskData, error: riskError } = await supabase.functions.invoke('generate-ai-risk-scores');
      
      if (riskError) {
        console.error('Error generating risk scores:', riskError);
        toast.error('Ошибка генерации скоров рисков');
        return;
      }

      const { data: recommendationsData, error: recommendationsError } = await supabase.functions.invoke('generate-ai-recommendations');
      
      if (recommendationsError) {
        console.error('Error generating recommendations:', recommendationsError);
        toast.error('Ошибка генерации рекомендаций');
        return;
      }

      // Формируем объект аналитики
      const newAnalytics: CachedAnalytics = {
        healthScore: calculateHealthScore(riskData.riskScores),
        riskLevel: calculateOverallRiskLevel(riskData.riskScores),
        concerns: extractConcerns(riskData.riskScores),
        strengths: extractStrengths(riskData.riskScores),
        biomarkers: [],
        recommendations: recommendationsData.recommendations || [],
        riskScores: riskData.riskScores || {},
        lastUpdated: new Date().toISOString(),
        totalAnalyses: 0,
        totalConsultations: 0,
        hasRecentActivity: true,
        trendsAnalysis: { improving: 0, worsening: 0, stable: 0 },
        recentActivities: []
      };

      // Сохраняем в кэш
      const { error: saveError } = await supabase
        .from('user_analytics')
        .upsert({
          user_id: user.id,
          analytics_data: newAnalytics,
          updated_at: new Date().toISOString()
        });

      if (saveError) {
        console.error('Error saving analytics:', saveError);
        toast.error('Ошибка сохранения аналитики');
        return;
      }

      setAnalytics(newAnalytics);
      setLastUpdated(new Date().toISOString());
      toast.success('Аналитика успешно обновлена');
      
    } catch (error) {
      console.error('Failed to generate analytics:', error);
      toast.error('Ошибка генерации аналитики');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Проверка актуальности данных
  const isDataStale = useCallback(() => {
    if (!lastUpdated) return true;
    
    const lastUpdate = new Date(lastUpdated);
    const now = new Date();
    const hoursSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
    
    return hoursSinceUpdate > 6; // Считаем данные устаревшими через 6 часов
  }, [lastUpdated]);

  // Загружаем кэшированные данные при монтировании
  useEffect(() => {
    loadCachedAnalytics();
  }, [loadCachedAnalytics]);

  // Подписка на real-time изменения
  useEffect(() => {
    if (!user) return;

    let channel: any = null;
    
    try {
      channel = supabase
        .channel(`cached_analytics_${user.id}_${Date.now()}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_analytics',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Analytics updated in real-time:', payload);
            if (payload.new) {
              setAnalytics(payload.new.analytics_data as CachedAnalytics);
              setLastUpdated(payload.new.updated_at);
            }
          }
        )
        .subscribe();
    } catch (error) {
      console.error('Failed to create analytics subscription:', error);
    }

    return () => {
      if (channel) {
        try {
          channel.unsubscribe();
        } catch (error) {
          console.error('Failed to unsubscribe from analytics channel:', error);
        }
      }
    };
  }, [user]);

  return {
    analytics,
    isLoading: isLoading,
    isGenerating: isLoading,
    lastUpdated,
    isDataStale: isDataStale(),
    hasHealthProfile: true,
    hasAnalyses: true,
    loadCachedAnalytics,
    generateAnalytics,
    generateRealTimeAnalytics: generateAnalytics
  };
};

// Вспомогательные функции
function calculateHealthScore(riskScores: any): number {
  if (!riskScores || Object.keys(riskScores).length === 0) return 75;
  
  const scores = Object.values(riskScores).map((risk: any) => 100 - (risk.percentage || 0));
  return Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length);
}

function calculateOverallRiskLevel(riskScores: any): string {
  if (!riskScores || Object.keys(riskScores).length === 0) return 'Низкий';
  
  const maxRisk = Math.max(...Object.values(riskScores).map((risk: any) => risk.percentage || 0));
  
  if (maxRisk <= 15) return 'Очень низкий';
  if (maxRisk <= 30) return 'Низкий';
  if (maxRisk <= 50) return 'Умеренный';
  if (maxRisk <= 75) return 'Высокий';
  return 'Критический';
}

function extractConcerns(riskScores: any): string[] {
  if (!riskScores) return [];
  
  return Object.values(riskScores)
    .filter((risk: any) => risk.percentage > 30)
    .map((risk: any) => risk.name);
}

function extractStrengths(riskScores: any): string[] {
  if (!riskScores) return ['Регулярное отслеживание здоровья'];
  
  const lowRisks = Object.values(riskScores)
    .filter((risk: any) => risk.percentage <= 15)
    .map((risk: any) => `Низкий риск: ${risk.name}`);
    
  return lowRisks.length > 0 ? lowRisks : ['Активное участие в управлении здоровьем'];
}