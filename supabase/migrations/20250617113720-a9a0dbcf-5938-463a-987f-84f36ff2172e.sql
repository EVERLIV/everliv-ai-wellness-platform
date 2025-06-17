
-- Создаем таблицу для ежедневных метрик здоровья
CREATE TABLE public.daily_health_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Физическая активность
  steps INTEGER DEFAULT 0,
  exercise_minutes INTEGER DEFAULT 0,
  activity_level INTEGER CHECK (activity_level >= 1 AND activity_level <= 10) DEFAULT 5,
  
  -- Сон
  sleep_hours NUMERIC(3,1) DEFAULT 8.0,
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10) DEFAULT 5,
  
  -- Стресс и настроение
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10) DEFAULT 5,
  mood_level INTEGER CHECK (mood_level >= 1 AND mood_level <= 10) DEFAULT 5,
  
  -- Питание
  water_intake NUMERIC(3,1) DEFAULT 8.0,
  nutrition_quality INTEGER CHECK (nutrition_quality >= 1 AND nutrition_quality <= 10) DEFAULT 5,
  
  -- Вредные привычки
  cigarettes_count INTEGER DEFAULT 0,
  alcohol_units INTEGER DEFAULT 0,
  
  -- Заметки
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id, date)
);

-- Создаем таблицу для целей пользователя
CREATE TABLE public.user_health_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Цели
  target_weight NUMERIC(5,2),
  target_steps INTEGER DEFAULT 10000,
  target_exercise_minutes INTEGER DEFAULT 30,
  target_sleep_hours NUMERIC(3,1) DEFAULT 8.0,
  target_water_intake NUMERIC(3,1) DEFAULT 8.0,
  target_stress_level INTEGER DEFAULT 3,
  
  -- Временные рамки
  goal_type TEXT NOT NULL DEFAULT 'monthly', -- daily, weekly, monthly, yearly
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  
  -- Статус
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для достижений
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  achievement_type TEXT NOT NULL, -- steps_streak, exercise_streak, sleep_goal, etc.
  achievement_name TEXT NOT NULL,
  description TEXT,
  points INTEGER NOT NULL DEFAULT 0,
  
  achieved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data JSONB DEFAULT '{}'::jsonb
);

-- Включаем RLS для всех таблиц
ALTER TABLE public.daily_health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_health_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Политики для daily_health_metrics
CREATE POLICY "Users can view their own daily metrics" 
  ON public.daily_health_metrics 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own daily metrics" 
  ON public.daily_health_metrics 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily metrics" 
  ON public.daily_health_metrics 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily metrics" 
  ON public.daily_health_metrics 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Политики для user_health_goals
CREATE POLICY "Users can view their own goals" 
  ON public.user_health_goals 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own goals" 
  ON public.user_health_goals 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" 
  ON public.user_health_goals 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" 
  ON public.user_health_goals 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Политики для user_achievements
CREATE POLICY "Users can view their own achievements" 
  ON public.user_achievements 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own achievements" 
  ON public.user_achievements 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Создаем функцию для автоматического обновления балла здоровья
CREATE OR REPLACE FUNCTION public.calculate_dynamic_health_score(user_id_param UUID, days_back INTEGER DEFAULT 7)
RETURNS NUMERIC(5,2)
LANGUAGE plpgsql
AS $$
DECLARE
  avg_metrics RECORD;
  health_score NUMERIC(5,2) := 50.0;
  score_adjustments NUMERIC(5,2) := 0.0;
BEGIN
  -- Получаем средние значения за последние дни
  SELECT 
    AVG(steps) as avg_steps,
    AVG(exercise_minutes) as avg_exercise,
    AVG(activity_level) as avg_activity,
    AVG(sleep_hours) as avg_sleep,
    AVG(sleep_quality) as avg_sleep_quality,
    AVG(stress_level) as avg_stress,
    AVG(mood_level) as avg_mood,
    AVG(water_intake) as avg_water,
    AVG(nutrition_quality) as avg_nutrition,
    AVG(cigarettes_count) as avg_cigarettes,
    AVG(alcohol_units) as avg_alcohol
  INTO avg_metrics
  FROM public.daily_health_metrics 
  WHERE user_id = user_id_param 
    AND date >= CURRENT_DATE - INTERVAL '1 day' * days_back;

  -- Если нет данных за период, используем данные профиля
  IF avg_metrics IS NULL THEN
    RETURN 50.0;
  END IF;

  -- Физическая активность (0-20 баллов)
  IF avg_metrics.avg_steps >= 10000 THEN
    score_adjustments := score_adjustments + 15;
  ELSIF avg_metrics.avg_steps >= 7500 THEN
    score_adjustments := score_adjustments + 10;
  ELSIF avg_metrics.avg_steps >= 5000 THEN
    score_adjustments := score_adjustments + 5;
  END IF;

  IF avg_metrics.avg_exercise >= 30 THEN
    score_adjustments := score_adjustments + 5;
  ELSIF avg_metrics.avg_exercise >= 15 THEN
    score_adjustments := score_adjustments + 3;
  END IF;

  -- Сон (0-15 баллов)
  IF avg_metrics.avg_sleep >= 7 AND avg_metrics.avg_sleep <= 9 THEN
    score_adjustments := score_adjustments + 10;
  ELSIF avg_metrics.avg_sleep >= 6 AND avg_metrics.avg_sleep <= 10 THEN
    score_adjustments := score_adjustments + 5;
  ELSE
    score_adjustments := score_adjustments - 5;
  END IF;

  IF avg_metrics.avg_sleep_quality >= 7 THEN
    score_adjustments := score_adjustments + 5;
  ELSIF avg_metrics.avg_sleep_quality >= 5 THEN
    score_adjustments := score_adjustments + 2;
  END IF;

  -- Стресс и настроение (0-10 баллов)
  IF avg_metrics.avg_stress <= 3 THEN
    score_adjustments := score_adjustments + 5;
  ELSIF avg_metrics.avg_stress <= 5 THEN
    score_adjustments := score_adjustments + 2;
  ELSIF avg_metrics.avg_stress >= 8 THEN
    score_adjustments := score_adjustments - 5;
  END IF;

  IF avg_metrics.avg_mood >= 7 THEN
    score_adjustments := score_adjustments + 5;
  ELSIF avg_metrics.avg_mood >= 5 THEN
    score_adjustments := score_adjustments + 2;
  END IF;

  -- Питание и вода (0-10 баллов)
  IF avg_metrics.avg_water >= 8 THEN
    score_adjustments := score_adjustments + 3;
  ELSIF avg_metrics.avg_water >= 6 THEN
    score_adjustments := score_adjustments + 2;
  END IF;

  IF avg_metrics.avg_nutrition >= 7 THEN
    score_adjustments := score_adjustments + 7;
  ELSIF avg_metrics.avg_nutrition >= 5 THEN
    score_adjustments := score_adjustments + 4;
  END IF;

  -- Вредные привычки (-15 баллов)
  IF avg_metrics.avg_cigarettes > 0 THEN
    score_adjustments := score_adjustments - (avg_metrics.avg_cigarettes * 2);
  END IF;

  IF avg_metrics.avg_alcohol > 2 THEN
    score_adjustments := score_adjustments - ((avg_metrics.avg_alcohol - 2) * 1.5);
  END IF;

  -- Финальный расчет
  health_score := health_score + score_adjustments;
  
  -- Ограничиваем значение от 0 до 100
  health_score := GREATEST(0, LEAST(100, health_score));
  
  RETURN ROUND(health_score, 2);
END;
$$;

-- Создаем индексы для оптимизации
CREATE INDEX idx_daily_health_metrics_user_date ON public.daily_health_metrics(user_id, date DESC);
CREATE INDEX idx_user_health_goals_user_active ON public.user_health_goals(user_id, is_active);
CREATE INDEX idx_user_achievements_user_type ON public.user_achievements(user_id, achievement_type);
