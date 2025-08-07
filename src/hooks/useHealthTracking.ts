
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface VitalMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  normalRange: string;
  status: 'optimal' | 'good' | 'attention' | 'risk';
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  lastUpdated: string;
  history: Array<{ date: string; value: number }>;
}

interface HealthTask {
  id: string;
  title: string;
  description: string;
  category: 'nutrition' | 'exercise' | 'sleep' | 'stress' | 'checkup';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  completed: boolean;
  points: number;
  estimatedTime: string;
}

export const useHealthTracking = () => {
  const { user } = useAuth();
  const [vitalMetrics, setVitalMetrics] = useState<VitalMetric[]>([]);
  const [healthTasks, setHealthTasks] = useState<HealthTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [healthScore, setHealthScore] = useState(0);

  useEffect(() => {
    if (user) {
      loadHealthData();
    }
  }, [user]);

  const loadHealthData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Загружаем данные анализов для формирования показателей
      const { data: analysesData } = await supabase
        .from('medical_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      // Загружаем профиль здоровья
      const { data: profileData } = await supabase
        .from('health_profiles')
        .select('profile_data')
        .eq('user_id', user.id)
        .maybeSingle();

      if (analysesData && analysesData.length > 0) {
        const metrics = extractVitalMetrics(analysesData);
        setVitalMetrics(metrics);
      }

      if (profileData?.profile_data) {
        const tasks = generateHealthTasks(profileData.profile_data as any);
        setHealthTasks(tasks);
      }

      calculateHealthScore();
    } catch (error) {
      console.error('Error loading health tracking data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const extractVitalMetrics = (analyses: any[]): VitalMetric[] => {
    const metrics: VitalMetric[] = [];
    
    // Группируем биомаркеры по типам
    const biomarkerGroups: { [key: string]: any[] } = {};
    
    analyses.forEach(analysis => {
      if (analysis.results?.biomarkers) {
        analysis.results.biomarkers.forEach((biomarker: any) => {
          const name = biomarker.name.toLowerCase();
          if (!biomarkerGroups[name]) {
            biomarkerGroups[name] = [];
          }
          biomarkerGroups[name].push({
            ...biomarker,
            date: analysis.created_at
          });
        });
      }
    });

    // Создаем метрики для ключевых показателей
    Object.entries(biomarkerGroups).forEach(([name, values]) => {
      if (values.length > 0) {
        const latest = values[0];
        const history = values.slice(0, 4).reverse().map((v, index) => ({
          date: `2024-${String(3 + index).padStart(2, '0')}`,
          value: parseFloat(v.value) || 0
        }));

        let metricName = name;
        let unit = latest.unit || '';
        let normalRange = latest.reference_range || '';

        if (name.includes('холестерин') || name.includes('cholesterol')) {
          metricName = 'Холестерин общий';
          unit = 'ммоль/л';
          normalRange = '3.0-5.2';
        } else if (name.includes('гемоглобин') || name.includes('hemoglobin')) {
          metricName = 'Гемоглобин';
          unit = 'г/л';
          normalRange = '130-160';
        } else if (name.includes('глюкоза') || name.includes('glucose')) {
          metricName = 'Глюкоза крови';
          unit = 'ммоль/л';
          normalRange = '3.9-6.1';
        }

        const currentValue = parseFloat(latest.value) || 0;
        const previousValue = history.length > 1 ? history[history.length - 2].value : currentValue;
        const trendValue = currentValue - previousValue;

        metrics.push({
          id: name.replace(/\s+/g, '_'),
          name: metricName,
          value: currentValue,
          unit,
          normalRange,
          status: latest.status || 'good',
          trend: trendValue > 0.1 ? 'up' : trendValue < -0.1 ? 'down' : 'stable',
          trendValue: Math.round(trendValue * 10) / 10,
          lastUpdated: latest.date,
          history
        });
      }
    });

    return metrics;
  };

  const generateHealthTasks = (healthProfile: any): HealthTask[] => {
    const tasks: HealthTask[] = [];
    
    // Генерируем задачи на основе профиля здоровья
    if (healthProfile.stressLevel > 6) {
      tasks.push({
        id: 'stress_management',
        title: 'Управление стрессом',
        description: 'Практикуйте техники релаксации для снижения уровня стресса',
        category: 'stress',
        priority: 'high',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        completed: false,
        points: 20,
        estimatedTime: '15 мин/день'
      });
    }

    if (healthProfile.exerciseFrequency < 3) {
      tasks.push({
        id: 'increase_exercise',
        title: 'Увеличить физическую активность',
        description: 'Добавьте 2-3 тренировки в неделю для улучшения здоровья',
        category: 'exercise',
        priority: 'high',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        completed: false,
        points: 25,
        estimatedTime: '45 мин/сессия'
      });
    }

    if (healthProfile.sleepHours < 7) {
      tasks.push({
        id: 'improve_sleep',
        title: 'Улучшить качество сна',
        description: 'Увеличьте продолжительность сна до 7-8 часов',
        category: 'sleep',
        priority: 'medium',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        completed: false,
        points: 15,
        estimatedTime: 'Постоянно'
      });
    }

    return tasks;
  };

  const calculateHealthScore = () => {
    const completedTasks = healthTasks.filter(task => task.completed).length;
    const totalPoints = healthTasks.filter(task => task.completed).reduce((sum, task) => sum + task.points, 0);
    const score = Math.min(100, Math.round((totalPoints / 90) * 100));
    setHealthScore(score);
  };

  const completeTask = async (taskId: string) => {
    setHealthTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, completed: true } : task
      )
    );
    calculateHealthScore();
  };

  return {
    vitalMetrics,
    healthTasks,
    healthScore,
    isLoading,
    completeTask,
    refreshData: loadHealthData
  };
};
