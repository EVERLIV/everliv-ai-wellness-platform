import { useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOptimizedQuery } from './useOptimizedQuery';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/logger/LoggerService';

interface DashboardData {
  healthProfile: any;
  medicalAnalyses: any[];
  dailyMetrics: any[];
  foodEntries: any[];
  goals: any[];
  protocols: any[];
  subscriptionPlans: any[];
  aiChats: any[];
}

// Объединенный запрос для всех данных дашборда
const fetchDashboardData = async (userId: string): Promise<DashboardData> => {
  const startTime = performance.now();
  
  try {
    // Параллельные запросы
    const [
      healthProfileResult,
      medicalAnalysesResult,
      dailyMetricsResult,
      foodEntriesResult,
      goalsResult,
      protocolsResult,
      subscriptionPlansResult,
      aiChatsResult
    ] = await Promise.all([
      supabase
        .from('health_profiles')
        .select('profile_data')
        .eq('user_id', userId)
        .single(),
      
      supabase
        .from('medical_analyses')
        .select('*, biomarkers(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5),
      
      supabase
        .from('daily_health_metrics')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(30),
      
      supabase
        .from('food_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20),
      
      supabase
        .from('health_goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
      
      supabase
        .from('user_protocols')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10),
      
      supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true }),
      
      supabase
        .from('ai_doctor_chats')
        .select('*, ai_doctor_messages(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5)
    ]);

    const endTime = performance.now();
    logger.info(`Dashboard data fetched in ${(endTime - startTime).toFixed(2)}ms`, {
      userId,
      requests: 8
    }, 'DashboardData');

    return {
      healthProfile: healthProfileResult.data?.profile_data || null,
      medicalAnalyses: medicalAnalysesResult.data || [],
      dailyMetrics: dailyMetricsResult.data || [],
      foodEntries: foodEntriesResult.data || [],
      goals: goalsResult.data || [],
      protocols: protocolsResult.data || [],
      subscriptionPlans: subscriptionPlansResult.data || [],
      aiChats: aiChatsResult.data || []
    };
  } catch (error) {
    logger.error('Failed to fetch dashboard data', error, 'DashboardData');
    throw error;
  }
};

export const useDashboardData = () => {
  const { user } = useAuth();

  const queryResult = useOptimizedQuery({
    queryKey: ['dashboard-data', user?.id],
    queryFn: () => fetchDashboardData(user!.id),
    requireAuth: true,
    staleTime: 2 * 60 * 1000, // 2 минуты
    gcTime: 5 * 60 * 1000, // 5 минут
    retry: 1
  });

  // Мемоизированные селекторы для отдельных частей данных
  const selectors = useMemo(() => ({
    healthProfile: queryResult.data?.healthProfile,
    medicalAnalyses: queryResult.data?.medicalAnalyses || [],
    recentMetrics: queryResult.data?.dailyMetrics?.slice(0, 7) || [],
    allMetrics: queryResult.data?.dailyMetrics || [],
    recentFoodEntries: queryResult.data?.foodEntries?.slice(0, 5) || [],
    activeGoals: queryResult.data?.goals?.filter(goal => goal.is_active) || [],
    allGoals: queryResult.data?.goals || [],
    protocols: queryResult.data?.protocols || [],
    subscriptionPlans: queryResult.data?.subscriptionPlans || [],
    aiChats: queryResult.data?.aiChats || []
  }), [queryResult.data]);

  const refetchDashboard = useCallback(() => {
    logger.info('Refetching dashboard data', { userId: user?.id }, 'DashboardData');
    return queryResult.refetch();
  }, [queryResult.refetch, user?.id]);

  return {
    ...selectors,
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error,
    refetch: refetchDashboard,
    isRefetching: queryResult.isFetching && !queryResult.isLoading
  };
};