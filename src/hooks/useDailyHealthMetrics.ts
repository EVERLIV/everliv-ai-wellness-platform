
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DailyHealthMetrics {
  id?: string;
  user_id: string;
  date: string;
  steps: number;
  exercise_minutes: number;
  activity_level: number;
  sleep_hours: number;
  sleep_quality: number;
  stress_level: number;
  mood_level: number;
  water_intake: number;
  nutrition_quality: number;
  cigarettes_count: number;
  alcohol_units: number;
  weight: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export const useDailyHealthMetrics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DailyHealthMetrics[]>([]);
  const [todayMetrics, setTodayMetrics] = useState<DailyHealthMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMetrics();
      loadTodayMetrics();
    }
  }, [user]);

  const loadMetrics = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('daily_health_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30);

      if (error) throw error;
      setMetrics(data || []);
    } catch (error) {
      console.error('Error loading metrics:', error);
      toast.error('Ошибка загрузки метрик');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTodayMetrics = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_health_metrics')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setTodayMetrics(data);
    } catch (error) {
      console.error('Error loading today metrics:', error);
    }
  };

  const saveMetrics = async (metricsData: Partial<DailyHealthMetrics>) => {
    if (!user) return false;

    try {
      const today = new Date().toISOString().split('T')[0];
      const dataToSave = {
        user_id: user.id,
        date: today,
        ...metricsData,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('daily_health_metrics')
        .upsert(dataToSave, {
          onConflict: 'user_id,date'
        })
        .select()
        .single();

      if (error) throw error;
      
      setTodayMetrics(data);
      await loadMetrics();
      toast.success('Метрики сохранены');
      return true;
    } catch (error) {
      console.error('Error saving metrics:', error);
      toast.error('Ошибка сохранения метрик');
      return false;
    }
  };

  const calculateDynamicHealthScore = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.rpc('calculate_dynamic_health_score', {
        user_id_param: user.id,
        days_back: 7
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error calculating health score:', error);
      return null;
    }
  };

  return {
    metrics,
    todayMetrics,
    isLoading,
    saveMetrics,
    loadMetrics,
    loadTodayMetrics,
    calculateDynamicHealthScore
  };
};
