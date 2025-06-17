
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { CachedAnalytics } from "@/types/analytics";

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
        const analyticsData = data.analytics_data as unknown as CachedAnalytics;
        setAnalytics(analyticsData);
      }
    } catch (error) {
      console.error('Unexpected error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    analytics,
    isLoading,
    setAnalytics,
    refreshAnalytics: loadCachedAnalytics
  };
};
