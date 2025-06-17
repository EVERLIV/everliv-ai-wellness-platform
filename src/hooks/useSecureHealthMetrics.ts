
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { EnhancedInputSanitizer } from '@/utils/enhancedInputSanitizer';
import { SecurityUtils } from '@/utils/securityUtils';
import { useSecurity } from '@/components/security/SecurityProvider';

interface DailyHealthMetrics {
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
  notes: string;
}

export const useSecureHealthMetrics = () => {
  const { user } = useAuth();
  const { checkRateLimit, reportSecurityEvent } = useSecurity();
  const [todayMetrics, setTodayMetrics] = useState<DailyHealthMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadTodayMetrics();
    }
  }, [user]);

  const loadTodayMetrics = async () => {
    if (!user) return;

    try {
      // Security: Rate limiting
      if (!checkRateLimit(`load_metrics_${user.id}`, 10, 60000)) {
        toast.error('Слишком много запросов. Попробуйте позже.');
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_health_metrics')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (error) throw error;
      
      setTodayMetrics(data);
      
      // Security: Audit log
      SecurityUtils.auditLog('load_health_metrics', user.id, { date: today });
    } catch (error) {
      console.error('Error loading health metrics:', error);
      reportSecurityEvent('health_metrics_load_error', { error: error instanceof Error ? error.message : 'Unknown' });
      toast.error('Ошибка загрузки метрик здоровья');
    }
  };

  const saveMetrics = async (metricsData: Partial<DailyHealthMetrics>) => {
    if (!user) return false;

    setIsLoading(true);
    
    try {
      // Security: Rate limiting for save operations
      if (!checkRateLimit(`save_metrics_${user.id}`, 5, 60000)) {
        toast.error('Слишком много попыток сохранения. Попробуйте позже.');
        return false;
      }

      // Security: Enhanced validation and sanitization
      const sanitizedData = {
        steps: EnhancedInputSanitizer.validateHealthMetricSecure(metricsData.steps || 0, 'steps'),
        exercise_minutes: EnhancedInputSanitizer.validateHealthMetricSecure(metricsData.exercise_minutes || 0, 'exercise_minutes'),
        activity_level: EnhancedInputSanitizer.validateHealthMetricSecure(metricsData.activity_level || 5, 'activity_level'),
        sleep_hours: EnhancedInputSanitizer.validateHealthMetricSecure(metricsData.sleep_hours || 8, 'sleep_hours'),
        sleep_quality: EnhancedInputSanitizer.validateHealthMetricSecure(metricsData.sleep_quality || 5, 'sleep_quality'),
        stress_level: EnhancedInputSanitizer.validateHealthMetricSecure(metricsData.stress_level || 5, 'stress_level'),
        mood_level: EnhancedInputSanitizer.validateHealthMetricSecure(metricsData.mood_level || 5, 'mood_level'),
        water_intake: EnhancedInputSanitizer.validateHealthMetricSecure(metricsData.water_intake || 8, 'water_intake'),
        nutrition_quality: EnhancedInputSanitizer.validateHealthMetricSecure(metricsData.nutrition_quality || 5, 'nutrition_quality'),
        cigarettes_count: EnhancedInputSanitizer.validateHealthMetricSecure(metricsData.cigarettes_count || 0, 'cigarettes_count'),
        alcohol_units: EnhancedInputSanitizer.validateHealthMetricSecure(metricsData.alcohol_units || 0, 'alcohol_units'),
        notes: EnhancedInputSanitizer.sanitizeTextSecure(metricsData.notes || '', 500)
      };

      // Security: Check for suspicious patterns
      if (SecurityUtils.detectSuspiciousActivity(sanitizedData)) {
        reportSecurityEvent('suspicious_health_data', sanitizedData);
        toast.error('Обнаружены подозрительные данные. Проверьте введенные значения.');
        return false;
      }

      const today = new Date().toISOString().split('T')[0];
      const dataToSave = {
        user_id: user.id,
        date: today,
        ...sanitizedData,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('daily_health_metrics')
        .upsert(dataToSave)
        .select()
        .single();

      if (error) throw error;

      setTodayMetrics(data);
      
      // Security: Audit log
      SecurityUtils.auditLog('save_health_metrics', user.id, { date: today });
      
      toast.success('Метрики здоровья сохранены');
      return true;
    } catch (error) {
      console.error('Error saving health metrics:', error);
      reportSecurityEvent('health_metrics_save_error', { error: error instanceof Error ? error.message : 'Unknown' });
      toast.error('Ошибка сохранения метрик здоровья');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    todayMetrics,
    isLoading,
    saveMetrics,
    loadTodayMetrics
  };
};
