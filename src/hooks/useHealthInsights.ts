import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { HealthInsight, HealthInsightsResponse } from '@/types/healthInsights';
import { toast } from '@/hooks/use-toast';

export const useHealthInsights = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [profileData, setProfileData] = useState<{
    age: number | null;
    bmi: number | null;
    lastAnalysis: string | null;
  } | null>(null);

  // Генерация новых инсайтов
  const generateInsights = async (forceRegenerate: boolean = false) => {
    if (!user) {
      console.log('❌ No user found for insights generation');
      return;
    }

    // Проверяем есть ли недавние инсайты (если не принудительная генерация)
    if (!forceRegenerate && insights.length > 0 && lastUpdated) {
      const hoursSinceUpdate = (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60);
      if (hoursSinceUpdate < 2) {
        console.log('🔄 Recent insights found, skipping generation');
        return;
      }
    }

    try {
      setIsGenerating(true);
      console.log('🤖 Generating health insights for user:', user.id);
      console.log('📊 Starting health insights generation...');

      const { data, error } = await supabase.functions.invoke('generate-openai-health-insights', {
        body: JSON.stringify({ userId: user.id }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('📥 Supabase function response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      const response: HealthInsightsResponse = data;

      if (!response.success) {
        throw new Error(response.error || 'Failed to generate insights');
      }

      console.log('✅ Generated insights:', {
        total: response.insights.length,
        categories: {
          predictive: response.insights.filter(i => i.category === 'predictive').length,
          practical: response.insights.filter(i => i.category === 'practical').length,
          personalized: response.insights.filter(i => i.category === 'personalized').length
        }
      });

      setInsights(response.insights);
      setProfileData(response.profileData);
      setLastUpdated(new Date());

      toast({
        title: "Инсайты обновлены",
        description: `Сгенерировано ${response.insights.length} персональных рекомендаций`,
      });

    } catch (error) {
      console.error('Error generating insights:', error);
      toast({
        title: "Ошибка генерации",
        description: "Не удалось сгенерировать инсайты. Попробуйте позже.",
        variant: "destructive",
      });

      // Устанавливаем fallback инсайты
      const fallbackInsights: HealthInsight[] = [
        {
          id: 'fallback-1',
          category: 'practical',
          title: 'Регулярные медицинские обследования',
          description: 'Для точного анализа здоровья рекомендуется регулярно проходить медицинские обследования и загружать результаты анализов.',
          priority: 'high',
          confidence: 90,
          scientificBasis: 'Регулярный мониторинг здоровья позволяет выявлять проблемы на ранней стадии',
          actionItems: [
            'Пройдите общий анализ крови',
            'Сделайте биохимический анализ',
            'Загрузите результаты в систему'
          ],
          timeframe: '1-2 недели'
        }
      ];
      setInsights(fallbackInsights);
    } finally {
      setIsGenerating(false);
    }
  };

  // Загрузка при монтировании компонента
  useEffect(() => {
    console.log('🔍 Health insights hook mounted - checking conditions:', {
      hasUser: !!user,
      userId: user?.id,
      insightsLength: insights.length,
      isLoading,
      isGenerating
    });

    if (user && insights.length === 0 && !isLoading && !isGenerating) {
      console.log('🚀 Starting health insights generation for user:', user.id);
      setIsLoading(true);
      generateInsights().finally(() => {
        console.log('✅ Health insights generation completed');
        setIsLoading(false);
      });
    }
  }, [user, insights.length, isLoading, isGenerating]);

  // Группировка инсайтов по категориям
  const getInsightsByCategory = (category: 'predictive' | 'practical' | 'personalized') => {
    return insights.filter(insight => insight.category === category);
  };

  return {
    insights,
    isLoading,
    isGenerating,
    lastUpdated,
    profileData,
    generateInsights,
    getInsightsByCategory
  };
};