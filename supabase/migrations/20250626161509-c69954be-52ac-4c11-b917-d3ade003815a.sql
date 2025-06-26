
-- Исправляем проблему безопасности Function Search Path Mutable
-- Устанавливаем безопасный search_path для функции calculate_dynamic_health_score

CREATE OR REPLACE FUNCTION public.calculate_dynamic_health_score(user_id_param UUID, days_back INTEGER DEFAULT 7)
RETURNS NUMERIC(5,2)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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
