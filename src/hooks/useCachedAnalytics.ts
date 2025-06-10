
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CachedAnalytics {
  healthScore: number;
  riskLevel: string;
  totalAnalyses: number;
  totalConsultations: number;
  lastAnalysisDate?: string;
  hasRecentActivity: boolean;
  trendsAnalysis: {
    improving: number;
    worsening: number;
    stable: number;
  };
  recentActivities: Array<{
    title: string;
    time: string;
    icon: string;
    iconColor: string;
    iconBg: string;
  }>;
  lastUpdated: string;
}

export const useCachedAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<CachedAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (user) {
      loadCachedAnalytics();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadCachedAnalytics = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('user_analytics')
        .select('analytics_data, updated_at')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading cached analytics:', error);
        setAnalytics(null);
        return;
      }

      if (data && data.analytics_data) {
        try {
          // Safely parse the analytics data
          const analyticsData = typeof data.analytics_data === 'string' 
            ? JSON.parse(data.analytics_data) 
            : data.analytics_data;
          
          setAnalytics(analyticsData as CachedAnalytics);
        } catch (parseError) {
          console.error('Error parsing analytics data:', parseError);
          setAnalytics(null);
        }
      } else {
        setAnalytics(null);
      }
    } catch (error) {
      console.error('Error loading cached analytics:', error);
      setAnalytics(null);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAnalytics = async () => {
    if (!user) {
      toast.error('Необходимо войти в систему');
      return;
    }

    try {
      setIsGenerating(true);

      // Загружаем данные для генерации аналитики
      const [analysesResponse, chatsResponse] = await Promise.all([
        supabase
          .from('medical_analyses')
          .select('created_at, results')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('ai_doctor_chats')
          .select('created_at, title')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
      ]);

      if (analysesResponse.error) {
        console.error('Error loading analyses:', analysesResponse.error);
      }
      if (chatsResponse.error) {
        console.error('Error loading chats:', chatsResponse.error);
      }

      const analyses = analysesResponse.data || [];
      const chats = chatsResponse.data || [];

      // Генерируем аналитику
      const generatedAnalytics = await generateAnalyticsData(analyses, chats);

      // Сохраняем в кэш
      const { error: upsertError } = await supabase
        .from('user_analytics')
        .upsert({
          user_id: user.id,
          analytics_data: generatedAnalytics as any,
          updated_at: new Date().toISOString()
        });

      if (upsertError) {
        console.error('Error saving analytics:', upsertError);
        toast.error('Ошибка сохранения аналитики');
        return;
      }

      setAnalytics(generatedAnalytics);
      toast.success('Аналитика успешно обновлена');
    } catch (error) {
      console.error('Error generating analytics:', error);
      toast.error('Ошибка генерации аналитики');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAnalyticsData = async (analyses: any[], chats: any[]): Promise<CachedAnalytics> => {
    const totalAnalyses = analyses.length;
    const totalConsultations = chats.length;

    // Определяем уровень риска
    let riskLevel = 'low';
    let totalRiskMarkers = 0;
    let totalOptimalMarkers = 0;
    let totalMarkers = 0;

    if (analyses.length > 0) {
      const latestAnalysis = analyses[0];
      const results = latestAnalysis.results;
      
      if (results?.riskLevel) {
        riskLevel = results.riskLevel;
      } else if (results?.markers) {
        analyses.forEach(analysis => {
          if (analysis.results?.markers) {
            analysis.results.markers.forEach((marker: any) => {
              totalMarkers++;
              if (marker.status === 'optimal' || marker.status === 'good') {
                totalOptimalMarkers++;
              } else if (marker.status === 'attention' || marker.status === 'risk' || marker.status === 'high' || marker.status === 'low') {
                totalRiskMarkers++;
              }
            });
          }
        });

        const riskPercentage = totalMarkers > 0 ? totalRiskMarkers / totalMarkers : 0;
        if (riskPercentage >= 0.5) riskLevel = 'high';
        else if (riskPercentage >= 0.2) riskLevel = 'medium';
      }
    }

    // Вычисляем индекс здоровья
    const healthScore = totalMarkers > 0 ? Math.round((totalOptimalMarkers / totalMarkers) * 100) : 75;

    // Проверяем недавнюю активность
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const hasRecentActivity = analyses.some(analysis => 
      new Date(analysis.created_at) > weekAgo
    );

    // Генерируем список активности
    const recentActivities: any[] = [];

    // Добавляем анализы
    analyses.slice(0, 3).forEach(analysis => {
      const timeAgo = getTimeAgo(analysis.created_at);
      recentActivities.push({
        title: `Анализ загружен`,
        time: timeAgo,
        icon: 'FileText',
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-50'
      });
    });

    // Добавляем чаты
    chats.slice(0, 2).forEach(chat => {
      const timeAgo = getTimeAgo(chat.created_at);
      recentActivities.push({
        title: 'Консультация с ИИ-доктором',
        time: timeAgo,
        icon: 'MessageSquare',
        iconColor: 'text-green-500',
        iconBg: 'bg-green-50'
      });
    });

    // Сортируем по времени
    recentActivities.sort((a, b) => {
      const timeA = parseTimeAgo(a.time);
      const timeB = parseTimeAgo(b.time);
      return timeA - timeB;
    });

    return {
      healthScore,
      riskLevel,
      totalAnalyses,
      totalConsultations,
      lastAnalysisDate: analyses[0]?.created_at,
      hasRecentActivity,
      trendsAnalysis: {
        improving: Math.max(1, Math.floor(totalOptimalMarkers * 0.6)),
        worsening: Math.max(0, Math.floor(totalRiskMarkers * 0.4)),
        stable: Math.max(1, totalMarkers - Math.floor(totalOptimalMarkers * 0.6) - Math.floor(totalRiskMarkers * 0.4))
      },
      recentActivities: recentActivities.slice(0, 4),
      lastUpdated: new Date().toISOString()
    };
  };

  const getTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} мин назад`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ч назад`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} дн назад`;
    }
  };

  const parseTimeAgo = (timeStr: string): number => {
    if (timeStr.includes('мин')) {
      return parseInt(timeStr);
    } else if (timeStr.includes('ч')) {
      return parseInt(timeStr) * 60;
    } else if (timeStr.includes('дн')) {
      return parseInt(timeStr) * 1440;
    }
    return 0;
  };

  return {
    analytics,
    isLoading,
    isGenerating,
    generateAnalytics,
    refreshAnalytics: loadCachedAnalytics
  };
};
