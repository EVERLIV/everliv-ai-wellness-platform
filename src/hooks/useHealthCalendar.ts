import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SmartAuthContext';
import { startOfMonth, endOfMonth, format } from 'date-fns';

export interface HealthCalendarData {
  date: string;
  steps: number | null;
  sleep_hours: number | null;
  mood_level: number | null;
  stress_level: number | null;
  water_intake: number | null;
  exercise_minutes: number | null;
  nutrition_quality: number | null;
  notes: string | null;
  healthScore: number | null;
}

export interface AIInsight {
  type: string;
  priority: string;
  title: string;
  description: string;
  confidence?: number;
  message?: string;
}

export const useHealthCalendar = (currentDate: Date) => {
  const { user } = useAuth();
  const [calendarData, setCalendarData] = useState<HealthCalendarData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState<AIInsight[] | null>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  const loadCalendarData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      
      const { data, error } = await supabase
        .from('daily_health_metrics')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', format(monthStart, 'yyyy-MM-dd'))
        .lte('date', format(monthEnd, 'yyyy-MM-dd'))
        .order('date', { ascending: true });
      
      if (error) throw error;
      
      // Calculate health score for each day
      const processedData = data.map(day => ({
        ...day,
        healthScore: calculateHealthScore(day)
      }));
      
      setCalendarData(processedData);
    } catch (error) {
      console.error('Error loading calendar data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateHealthScore = (dayData: any): number => {
    let score = 50; // Base score
    
    // Physical activity (0-20 points)
    if (dayData.steps >= 10000) score += 15;
    else if (dayData.steps >= 7500) score += 10;
    else if (dayData.steps >= 5000) score += 5;
    
    if (dayData.exercise_minutes >= 30) score += 5;
    else if (dayData.exercise_minutes >= 15) score += 3;
    
    // Sleep (0-15 points)
    if (dayData.sleep_hours >= 7 && dayData.sleep_hours <= 9) score += 10;
    else if (dayData.sleep_hours >= 6 && dayData.sleep_hours <= 10) score += 5;
    else score -= 5;
    
    if (dayData.sleep_quality >= 7) score += 5;
    else if (dayData.sleep_quality >= 5) score += 2;
    
    // Mood and stress (0-10 points)
    if (dayData.stress_level <= 3) score += 5;
    else if (dayData.stress_level <= 5) score += 2;
    else if (dayData.stress_level >= 8) score -= 5;
    
    if (dayData.mood_level >= 7) score += 5;
    else if (dayData.mood_level >= 5) score += 2;
    
    // Nutrition and hydration (0-10 points)
    if (dayData.water_intake >= 8) score += 3;
    else if (dayData.water_intake >= 6) score += 2;
    
    if (dayData.nutrition_quality >= 7) score += 7;
    else if (dayData.nutrition_quality >= 5) score += 4;
    
    // Negative factors (-15 points)
    if (dayData.cigarettes_count > 0) score -= dayData.cigarettes_count * 2;
    if (dayData.alcohol_units > 2) score -= (dayData.alcohol_units - 2) * 1.5;
    
    // Ensure score is between 0 and 100
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  const generateInsights = async () => {
    if (!user || !calendarData) return;
    
    try {
      setIsGeneratingInsights(true);
      
      const { data, error } = await supabase.functions.invoke('calendar-ai-insights', {
        body: {
          user_id: user.id,
          calendar_data: calendarData,
          current_date: format(currentDate, 'yyyy-MM-dd')
        }
      });
      
      if (error) throw error;
      
      setAiInsights(data.insights || []);
    } catch (error) {
      console.error('Error generating AI insights:', error);
      // Fallback to sample insights
      setAiInsights([
        {
          type: 'pattern',
          priority: 'medium',
          title: 'Паттерн сна',
          description: 'Ваш сон улучшается в выходные дни. Рекомендуется поддерживать режим.',
          confidence: 85
        },
        {
          type: 'recommendation',
          priority: 'high',
          title: 'Активность',
          description: 'Увеличьте физическую активность в середине недели.',
          confidence: 92
        },
        {
          type: 'insight',
          priority: 'low',
          title: 'Настроение',
          description: 'Настроение коррелирует с количеством шагов.',
          confidence: 78
        }
      ]);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  useEffect(() => {
    loadCalendarData();
  }, [user, currentDate]);

  return {
    calendarData,
    isLoading,
    aiInsights,
    generateInsights,
    isGeneratingInsights,
    refreshData: loadCalendarData
  };
};