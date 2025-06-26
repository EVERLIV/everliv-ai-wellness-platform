
-- Добавляем отсутствующий столбец created_at в таблицу user_protocols
ALTER TABLE public.user_protocols 
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone NOT NULL DEFAULT now();

-- Добавляем триггер для автоматического обновления updated_at в user_protocols  
CREATE TRIGGER update_user_protocols_updated_at
    BEFORE UPDATE ON public.user_protocols
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Включаем RLS для таблицы user_health_goals если не включена
ALTER TABLE public.user_health_goals ENABLE ROW LEVEL SECURITY;

-- Удаляем старые политики если они есть
DROP POLICY IF EXISTS "Users can view their health goals" ON public.user_health_goals;
DROP POLICY IF EXISTS "Users can create their health goals" ON public.user_health_goals;
DROP POLICY IF EXISTS "Users can update their health goals" ON public.user_health_goals;
DROP POLICY IF EXISTS "Users can delete their health goals" ON public.user_health_goals;

-- Создаем правильные RLS политики для user_health_goals
CREATE POLICY "Users can view their health goals" 
  ON public.user_health_goals 
  FOR SELECT 
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create their health goals" 
  ON public.user_health_goals 
  FOR INSERT 
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their health goals" 
  ON public.user_health_goals 
  FOR UPDATE 
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their health goals" 
  ON public.user_health_goals 
  FOR DELETE 
  USING ((select auth.uid()) = user_id);

-- Добавляем RLS политики для user_protocols если их нет
ALTER TABLE public.user_protocols ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their protocols" ON public.user_protocols;
DROP POLICY IF EXISTS "Users can create their protocols" ON public.user_protocols;
DROP POLICY IF EXISTS "Users can update their protocols" ON public.user_protocols;
DROP POLICY IF EXISTS "Users can delete their protocols" ON public.user_protocols;

CREATE POLICY "Users can view their protocols" 
  ON public.user_protocols 
  FOR SELECT 
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create their protocols" 
  ON public.user_protocols 
  FOR INSERT 
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their protocols" 
  ON public.user_protocols 
  FOR UPDATE 
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their protocols" 
  ON public.user_protocols 
  FOR DELETE 
  USING ((select auth.uid()) = user_id);

-- Добавляем индексы для улучшения производительности
CREATE INDEX IF NOT EXISTS idx_user_health_goals_user_id ON public.user_health_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_protocols_user_id ON public.user_protocols(user_id);
