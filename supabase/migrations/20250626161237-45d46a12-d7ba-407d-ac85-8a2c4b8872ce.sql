
-- Исправляем проблему производительности RLS для таблицы subscriptions
-- Заменяем auth.uid() на (select auth.uid()) для предотвращения повторных вычислений

-- Удаляем старые неоптимизированные политики
DROP POLICY IF EXISTS "subscriptions_select_own" ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions_insert_own" ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions_update_own" ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions_delete_own" ON public.subscriptions;

-- Создаем оптимизированные политики с правильным синтаксисом
CREATE POLICY "Users can view their subscriptions" 
  ON public.subscriptions 
  FOR SELECT 
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create their subscriptions" 
  ON public.subscriptions 
  FOR INSERT 
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their subscriptions" 
  ON public.subscriptions 
  FOR UPDATE 
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Admins can manage all subscriptions"
  ON public.subscriptions
  FOR ALL
  USING (public.has_role((select auth.uid()), 'admin'::public.app_role));

-- Добавляем индекс для улучшения производительности
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id_status ON public.subscriptions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_expires_at ON public.subscriptions(expires_at);

-- Обновляем статистику
ANALYZE public.subscriptions;
