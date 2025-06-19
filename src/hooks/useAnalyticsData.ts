
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { CachedAnalytics } from "@/types/analytics";
import { ensureAnalyticsConsistency, logAnalyticsDifferences } from "@/utils/analyticsConsistency";

export const useAnalyticsData = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<CachedAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCachedAnalytics();
    }
  }, [user]);

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
        const rawAnalytics = data.analytics_data as unknown as CachedAnalytics;
        const consistentAnalytics = ensureAnalyticsConsistency(rawAnalytics);
        
        // Логируем данные для отладки
        logAnalyticsDifferences('useAnalyticsData', consistentAnalytics, user.id);
        
        setAnalytics(consistentAnalytics);
      }
    } catch (error) {
      console.error('Unexpected error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setAnalyticsWithConsistency = (newAnalytics: CachedAnalytics) => {
    const consistentAnalytics = ensureAnalyticsConsistency(newAnalytics);
    
    // Логируем данные для отладки
    if (user) {
      logAnalyticsDifferences('setAnalytics', consistentAnalytics, user.id);
    }
    
    setAnalytics(consistentAnalytics);
  };

  return {
    analytics,
    isLoading,
    setAnalytics: setAnalyticsWithConsistency,
    refreshAnalytics: loadCachedAnalytics
  };
};
