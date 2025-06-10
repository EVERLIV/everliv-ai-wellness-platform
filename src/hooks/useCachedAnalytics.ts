
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CachedAnalytics } from '@/types/analytics';
import { generateAnalyticsData } from '@/utils/analyticsGenerator';

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
          
          setAnalytics(analyticsData as unknown as CachedAnalytics);
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

  return {
    analytics,
    isLoading,
    isGenerating,
    generateAnalytics,
    refreshAnalytics: loadCachedAnalytics
  };
};
