
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CachedAnalytics } from "@/types/analytics";
import { generateAnalyticsData } from "@/utils/analyticsGenerator";
import { generateEnhancedAnalytics } from "@/utils/enhancedAnalyticsGenerator";
import { useHealthProfileStatus } from "./useHealthProfileStatus";

export const useCachedAnalytics = () => {
  const { user } = useAuth();
  const { isComplete: hasHealthProfile } = useHealthProfileStatus();
  const [analytics, setAnalytics] = useState<CachedAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasAnalyses, setHasAnalyses] = useState(false);

  useEffect(() => {
    if (user) {
      loadCachedAnalytics();
      checkHasAnalyses();
    }
  }, [user, hasHealthProfile]);

  const checkHasAnalyses = async () => {
    if (!user) return;
    
    try {
      const { count } = await supabase
        .from('medical_analyses')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
        
      setHasAnalyses((count || 0) > 0);
    } catch (error) {
      console.error('Error checking analyses:', error);
    }
  };

  const loadCachedAnalytics = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('user_analytics')
        .select('analytics_data')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading cached analytics:', error);
        return;
      }

      if (data?.analytics_data) {
        const analyticsData = data.analytics_data as unknown as CachedAnalytics;
        setAnalytics(analyticsData);
      }
    } catch (error) {
      console.error('Unexpected error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateRealTimeAnalytics = async () => {
    if (!user || !hasHealthProfile) {
      toast.error('Заполните профиль здоровья для генерации аналитики');
      return;
    }

    try {
      setIsGenerating(true);
      
      console.log('Starting real-time analytics generation...');

      // Получаем данные профиля здоровья
      const { data: healthProfile, error: profileError } = await supabase
        .from('health_profiles')
        .select('profile_data')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching health profile:', profileError);
        throw new Error('Ошибка загрузки профиля здоровья');
      }

      if (!healthProfile?.profile_data) {
        throw new Error('Профиль здоровья не найден');
      }

      // Получаем анализы
      const { data: analyses, error: analysesError } = await supabase
        .from('medical_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (analysesError) {
        console.error('Error fetching analyses:', analysesError);
      }

      // Получаем чаты с ИИ-доктором
      const { data: chats, error: chatsError } = await supabase
        .from('ai_doctor_chats')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (chatsError) {
        console.error('Error fetching chats:', chatsError);
      }

      console.log('Data fetched:', {
        hasProfile: !!healthProfile,
        analysesCount: analyses?.length || 0,
        chatsCount: chats?.length || 0
      });

      // Генерируем расширенную аналитику
      const newAnalytics = await generateEnhancedAnalytics(
        analyses || [],
        chats || [],
        true,
        healthProfile.profile_data
      );

      if (!newAnalytics) {
        throw new Error('Не удалось сгенерировать аналитику');
      }

      console.log('Generated analytics:', newAnalytics);

      // Сохраняем в базу данных
      const { error: saveError } = await supabase
        .from('user_analytics')
        .upsert({
          user_id: user.id,
          analytics_data: newAnalytics,
          updated_at: new Date().toISOString()
        });

      if (saveError) {
        console.error('Error saving analytics:', saveError);
        // Не прерываем процесс, просто логируем ошибку
      }

      setAnalytics(newAnalytics);
      toast.success('Аналитика здоровья обновлена');

    } catch (error) {
      console.error('Error generating real-time analytics:', error);
      toast.error(error instanceof Error ? error.message : 'Ошибка генерации аналитики');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAnalytics = async () => {
    if (!user) return;

    try {
      setIsGenerating(true);
      
      // Получаем данные для базовой аналитики
      const { data: analyses, error: analysesError } = await supabase
        .from('medical_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const { data: chats, error: chatsError } = await supabase
        .from('ai_doctor_chats')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Используем базовый генератор для совместимости
      const newAnalytics = await generateAnalyticsData(
        analyses || [],
        chats || [],
        hasHealthProfile
      );

      if (newAnalytics) {
        // Сохраняем в базу данных
        const { error: saveError } = await supabase
          .from('user_analytics')
          .upsert({
            user_id: user.id,
            analytics_data: newAnalytics,
            updated_at: new Date().toISOString()
          });

        if (saveError) {
          console.error('Error saving analytics:', saveError);
        }

        setAnalytics(newAnalytics);
        toast.success('Аналитика обновлена');
      }

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
    hasHealthProfile,
    hasAnalyses,
    generateAnalytics,
    generateRealTimeAnalytics
  };
};
