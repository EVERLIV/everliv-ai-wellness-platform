-- Добавляем недостающие колонки в таблицу daily_health_metrics
ALTER TABLE public.daily_health_metrics 
ADD COLUMN IF NOT EXISTS weight numeric,
ADD COLUMN IF NOT EXISTS workouts_count integer DEFAULT 0;