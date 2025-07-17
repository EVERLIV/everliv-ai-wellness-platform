import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, calendar_data, current_date } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Check if user exists
    const { data: authData, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !authData.user) {
      throw new Error('Unauthorized');
    }

    console.log('Analyzing calendar data for user:', user_id);
    console.log('Calendar data length:', calendar_data?.length || 0);

    // Generate insights based on calendar data
    const insights = await generateCalendarInsights(calendar_data, current_date);

    // Cache insights for future use
    await supabaseClient
      .from('cached_recommendations')
      .upsert({
        user_id,
        recommendations_type: 'calendar_insights',
        source_hash: hashCalendarData(calendar_data),
        recommendations_data: insights,
        updated_at: new Date().toISOString()
      });

    return new Response(JSON.stringify({ insights }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in calendar-ai-insights:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateCalendarInsights(calendarData: any[], currentDate: string) {
  const insights = [];
  
  if (!calendarData || calendarData.length === 0) {
    return [{
      type: 'recommendation',
      priority: 'medium',
      title: 'Начните отслеживание',
      description: 'Добавьте данные о здоровье для получения персонализированных рекомендаций.',
      confidence: 100
    }];
  }

  // Sleep pattern analysis
  const sleepData = calendarData.filter(d => d.sleep_hours !== null);
  if (sleepData.length >= 7) {
    const avgSleep = sleepData.reduce((sum, d) => sum + d.sleep_hours, 0) / sleepData.length;
    const sleepVariability = calculateVariability(sleepData.map(d => d.sleep_hours));
    
    if (avgSleep < 7) {
      insights.push({
        type: 'warning',
        priority: 'high',
        title: 'Недостаток сна',
        description: `Средняя продолжительность сна ${avgSleep.toFixed(1)} часов. Рекомендуется 7-9 часов.`,
        confidence: 90
      });
    }
    
    if (sleepVariability > 2) {
      insights.push({
        type: 'recommendation',
        priority: 'medium',
        title: 'Нестабильный режим сна',
        description: 'Попробуйте ложиться спать в одно и то же время каждый день.',
        confidence: 85
      });
    }
  }

  // Physical activity analysis
  const activityData = calendarData.filter(d => d.steps !== null);
  if (activityData.length >= 5) {
    const avgSteps = activityData.reduce((sum, d) => sum + d.steps, 0) / activityData.length;
    const weekdays = activityData.filter(d => {
      const date = new Date(d.date);
      const day = date.getDay();
      return day >= 1 && day <= 5;
    });
    const weekends = activityData.filter(d => {
      const date = new Date(d.date);
      const day = date.getDay();
      return day === 0 || day === 6;
    });
    
    if (avgSteps < 8000) {
      insights.push({
        type: 'recommendation',
        priority: 'medium',
        title: 'Увеличьте активность',
        description: `Средняя активность ${Math.round(avgSteps)} шагов. Стремитесь к 10,000 шагов в день.`,
        confidence: 88
      });
    }
    
    if (weekdays.length > 0 && weekends.length > 0) {
      const weekdayAvg = weekdays.reduce((sum, d) => sum + d.steps, 0) / weekdays.length;
      const weekendAvg = weekends.reduce((sum, d) => sum + d.steps, 0) / weekends.length;
      
      if (weekendAvg > weekdayAvg * 1.3) {
        insights.push({
          type: 'insight',
          priority: 'low',
          title: 'Активность выходного дня',
          description: 'Вы более активны в выходные. Попробуйте добавить активность в будние дни.',
          confidence: 82
        });
      }
    }
  }

  // Mood and stress correlation
  const moodData = calendarData.filter(d => d.mood_level !== null && d.stress_level !== null);
  if (moodData.length >= 5) {
    const correlation = calculateCorrelation(
      moodData.map(d => d.mood_level),
      moodData.map(d => d.stress_level)
    );
    
    if (correlation < -0.6) {
      insights.push({
        type: 'insight',
        priority: 'medium',
        title: 'Стресс влияет на настроение',
        description: 'Высокий уровень стресса негативно влияет на ваше настроение. Рассмотрите техники релаксации.',
        confidence: Math.round(Math.abs(correlation) * 100)
      });
    }
  }

  // Hydration reminder
  const hydrationData = calendarData.filter(d => d.water_intake !== null);
  if (hydrationData.length >= 3) {
    const avgWater = hydrationData.reduce((sum, d) => sum + d.water_intake, 0) / hydrationData.length;
    
    if (avgWater < 6) {
      insights.push({
        type: 'recommendation',
        priority: 'high',
        title: 'Пейте больше воды',
        description: `Среднее потребление воды ${avgWater.toFixed(1)} стаканов. Рекомендуется 8 стаканов в день.`,
        confidence: 95
      });
    }
  }

  // Weekly pattern analysis
  const weeklyPattern = analyzeWeeklyPattern(calendarData);
  if (weeklyPattern.insight) {
    insights.push({
      type: 'pattern',
      priority: 'low',
      title: 'Недельный паттерн',
      description: weeklyPattern.insight,
      confidence: weeklyPattern.confidence
    });
  }

  // Limit insights to top 5
  return insights.slice(0, 5);
}

function calculateVariability(values: number[]): number {
  if (values.length === 0) return 0;
  
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

function calculateCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length === 0) return 0;
  
  const n = x.length;
  const sumX = x.reduce((sum, val) => sum + val, 0);
  const sumY = y.reduce((sum, val) => sum + val, 0);
  const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
  const sumXX = x.reduce((sum, val) => sum + val * val, 0);
  const sumYY = y.reduce((sum, val) => sum + val * val, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
  
  if (denominator === 0) return 0;
  return numerator / denominator;
}

function analyzeWeeklyPattern(calendarData: any[]): { insight: string | null; confidence: number } {
  const dayOfWeekData: { [key: number]: any[] } = {};
  
  calendarData.forEach(day => {
    const date = new Date(day.date);
    const dayOfWeek = date.getDay();
    
    if (!dayOfWeekData[dayOfWeek]) {
      dayOfWeekData[dayOfWeek] = [];
    }
    dayOfWeekData[dayOfWeek].push(day);
  });
  
  // Find the day with consistently highest health scores
  const dayAverages = Object.keys(dayOfWeekData).map(day => {
    const dayNum = parseInt(day);
    const days = dayOfWeekData[dayNum];
    const avgScore = days.reduce((sum, d) => sum + (d.healthScore || 0), 0) / days.length;
    
    return { day: dayNum, avgScore, count: days.length };
  });
  
  if (dayAverages.length >= 5) {
    const sortedDays = dayAverages.sort((a, b) => b.avgScore - a.avgScore);
    const bestDay = sortedDays[0];
    const worstDay = sortedDays[sortedDays.length - 1];
    
    if (bestDay.avgScore - worstDay.avgScore > 20) {
      const dayNames = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
      
      return {
        insight: `Лучшие показатели здоровья в ${dayNames[bestDay.day]}, худшие в ${dayNames[worstDay.day]}`,
        confidence: 75
      };
    }
  }
  
  return { insight: null, confidence: 0 };
}

function hashCalendarData(data: any[]): string {
  if (!data || data.length === 0) return 'empty';
  
  const str = JSON.stringify(data.map(d => ({ date: d.date, healthScore: d.healthScore })));
  let hash = 0;
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return hash.toString();
}