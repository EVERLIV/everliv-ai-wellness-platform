
-- Добавляем новые колонки в таблицу user_health_goals для поддержки пользовательских целей
ALTER TABLE public.user_health_goals 
ADD COLUMN title TEXT,
ADD COLUMN description TEXT,
ADD COLUMN category TEXT DEFAULT 'fitness',
ADD COLUMN is_custom BOOLEAN DEFAULT FALSE,
ADD COLUMN priority TEXT DEFAULT 'medium',
ADD COLUMN unit TEXT,
ADD COLUMN progress_percentage INTEGER DEFAULT 0;

-- Обновляем существующие записи, чтобы они имели базовые значения
UPDATE public.user_health_goals 
SET 
  is_custom = FALSE,
  category = 'fitness',
  priority = 'medium',
  progress_percentage = 0
WHERE title IS NULL;

-- Создаем индекс для быстрого поиска активных целей пользователя
CREATE INDEX IF NOT EXISTS idx_user_health_goals_user_active 
ON public.user_health_goals(user_id, is_active) 
WHERE is_active = true;

-- Создаем индекс для поиска по категориям
CREATE INDEX IF NOT EXISTS idx_user_health_goals_category 
ON public.user_health_goals(category);
