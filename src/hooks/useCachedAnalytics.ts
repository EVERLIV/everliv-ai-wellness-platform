import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CachedAnalytics, AnalysisRecord, ChatRecord } from '@/types/analytics';
import { generateAnalyticsData } from '@/utils/analyticsGenerator';

export const useCachedAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<CachedAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');

  console.log('useCachedAnalytics state:', {
    isGenerating,
    loadingStep,
    analytics: !!analytics,
    isLoading
  });

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
      setLoadingStep('Загрузка кэшированной аналитики...');
      
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
      setLoadingStep('');
    }
  };

  const generateAnalytics = async () => {
    if (!user) {
      toast.error('Необходимо войти в систему');
      return;
    }

    try {
      console.log('Starting analytics generation...');
      setIsGenerating(true);
      setLoadingStep('Загрузка данных анализов...');

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

      // Cast the Supabase data to our interface types
      const analyses = (analysesResponse.data || []) as AnalysisRecord[];
      const chats = (chatsResponse.data || []) as ChatRecord[];

      console.log('Data loaded, starting analysis...');
      setLoadingStep('Анализ данных и генерация отчета...');
      
      // Генерируем аналитику
      const generatedAnalytics = await generateAnalyticsData(analyses, chats);

      console.log('Analytics generated, saving...');
      setLoadingStep('Сохранение результатов...');

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

      console.log('Analytics saved successfully');
      setAnalytics(generatedAnalytics);
      toast.success('Аналитика успешно обновлена');
    } catch (error) {
      console.error('Error generating analytics:', error);
      toast.error('Ошибка генерации аналитики');
    } finally {
      console.log('Analytics generation completed');
      setIsGenerating(false);
      setLoadingStep('');
    }
  };

  return {
    analytics,
    isLoading,
    isGenerating,
    loadingStep,
    generateAnalytics,
    refreshAnalytics: loadCachedAnalytics
  };
};
