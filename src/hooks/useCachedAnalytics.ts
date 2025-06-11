import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CachedAnalytics, AnalysisRecord, ChatRecord } from '@/types/analytics';
import { generateAnalyticsData } from '@/utils/analyticsGenerator';
import { HealthProfileData } from './useHealthProfile';

export const useCachedAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<CachedAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [hasHealthProfile, setHasHealthProfile] = useState(false);
  const [hasAnalyses, setHasAnalyses] = useState(false);

  console.log('useCachedAnalytics hook state:', {
    isGenerating,
    loadingStep,
    hasAnalytics: !!analytics,
    isLoading,
    hasUser: !!user,
    hasHealthProfile,
    hasAnalyses
  });

  useEffect(() => {
    if (user) {
      console.log('User found, loading cached analytics...');
      loadCachedAnalytics();
    } else {
      console.log('No user, stopping loading');
      setIsLoading(false);
      setAnalytics(null);
    }
  }, [user]);

  const checkDataAvailability = async (): Promise<{ hasProfile: boolean, analysesCount: number }> => {
    if (!user) return { hasProfile: false, analysesCount: 0 };

    try {
      // Проверяем профиль здоровья
      const { data: profileData, error: profileError } = await supabase
        .from('health_profiles')
        .select('profile_data')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error checking health profile:', profileError);
      }

      let hasProfile = false;
      if (profileData?.profile_data) {
        const profileInfo = profileData.profile_data as unknown as HealthProfileData;
        hasProfile = !!(profileInfo.age && 
          profileInfo.gender && 
          profileInfo.height && 
          profileInfo.weight);
      }

      // Проверяем анализы
      const { data: analysesData, error: analysesError } = await supabase
        .from('medical_analyses')
        .select('id')
        .eq('user_id', user.id);

      if (analysesError) {
        console.error('Error checking analyses:', analysesError);
      }

      const analysesCount = analysesData?.length || 0;

      return { hasProfile, analysesCount };
    } catch (error) {
      console.error('Error checking data availability:', error);
      return { hasProfile: false, analysesCount: 0 };
    }
  };

  const loadCachedAnalytics = async () => {
    if (!user) {
      console.log('No user in loadCachedAnalytics');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Starting to load cached analytics for user:', user.id);
      setIsLoading(true);
      
      // Проверяем доступность данных
      const { hasProfile, analysesCount } = await checkDataAvailability();
      setHasHealthProfile(hasProfile);
      setHasAnalyses(analysesCount > 0);

      // Если нет необходимых данных, не загружаем аналитику
      if (!hasProfile || analysesCount === 0) {
        console.log('Insufficient data for analytics:', { hasProfile, analysesCount });
        setAnalytics(null);
        return;
      }

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

      console.log('Cached analytics query result:', { data });

      if (data && data.analytics_data) {
        try {
          const analyticsData = typeof data.analytics_data === 'string' 
            ? JSON.parse(data.analytics_data) 
            : data.analytics_data;
          
          console.log('Successfully parsed analytics data:', analyticsData);
          setAnalytics(analyticsData as CachedAnalytics);
        } catch (parseError) {
          console.error('Error parsing analytics data:', parseError);
          setAnalytics(null);
        }
      } else {
        console.log('No cached analytics found');
        setAnalytics(null);
      }
    } catch (error) {
      console.error('Error in loadCachedAnalytics:', error);
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
      console.log('Starting analytics generation...');
      setIsGenerating(true);
      setLoadingStep('Проверка данных...');

      // Проверяем доступность данных
      const { hasProfile, analysesCount } = await checkDataAvailability();
      setHasHealthProfile(hasProfile);
      setHasAnalyses(analysesCount > 0);

      if (!hasProfile || analysesCount === 0) {
        let message = 'Для генерации аналитики необходимо: ';
        const missing = [];
        if (!hasProfile) missing.push('заполнить профиль здоровья');
        if (analysesCount === 0) missing.push('добавить хотя бы один анализ крови');
        message += missing.join(' и ');
        
        toast.error(message);
        setIsGenerating(false);
        setLoadingStep('');
        return;
      }

      setLoadingStep('Загрузка данных анализов...');

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

      const analyses = (analysesResponse.data || []) as AnalysisRecord[];
      const chats = (chatsResponse.data || []) as ChatRecord[];

      console.log('Data loaded - analyses:', analyses.length, 'chats:', chats.length);
      setLoadingStep('Анализ данных и генерация отчета...');
      
      const generatedAnalytics = await generateAnalyticsData(analyses, chats, hasProfile);
      
      if (!generatedAnalytics) {
        toast.error('Недостаточно данных для генерации аналитики');
        return;
      }

      console.log('Analytics generated:', generatedAnalytics);

      setLoadingStep('Сохранение результатов...');

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
    hasHealthProfile,
    hasAnalyses,
    generateAnalytics,
    refreshAnalytics: loadCachedAnalytics
  };
};
