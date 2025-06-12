
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CachedAnalytics } from "@/types/analytics";
import { generateAnalyticsData } from "@/utils/analyticsGenerator";
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
        setAnalytics(data.analytics_data as CachedAnalytics);
      }
    } catch (error) {
      console.error('Error loading cached analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAnalytics = async () => {
    if (!user || !hasHealthProfile) {
      toast.error('Сначала заполните профиль здоровья');
      return;
    }

    try {
      setIsGenerating(true);
      
      // Получаем данные анализов
      const { data: analysesData } = await supabase
        .from('medical_analyses')
        .select('created_at, results')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Получаем данные чатов
      const { data: chatsData } = await supabase
        .from('ai_doctor_chats')
        .select('created_at, title')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Получаем данные профиля здоровья
      const { data: healthProfileData } = await supabase
        .from('health_profiles')
        .select('profile_data')
        .eq('user_id', user.id)
        .maybeSingle();

      const analyses = analysesData || [];
      const chats = chatsData || [];
      const healthProfile = healthProfileData?.profile_data;

      // Генерируем новую аналитику
      const newAnalytics = await generateAnalyticsData(
        analyses, 
        chats, 
        hasHealthProfile,
        healthProfile
      );

      if (newAnalytics) {
        // Сохраняем в кэш
        await supabase
          .from('user_analytics')
          .upsert({
            user_id: user.id,
            analytics_data: newAnalytics as any,
            updated_at: new Date().toISOString()
          });

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
    generateAnalytics
  };
};
