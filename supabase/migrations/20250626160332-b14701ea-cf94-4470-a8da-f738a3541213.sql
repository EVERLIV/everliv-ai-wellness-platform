
-- Удаляем дублирующиеся политики и создаем одну оптимальную
DROP POLICY IF EXISTS "Users can update their own personal recommendations" ON public.personal_recommendations;
DROP POLICY IF EXISTS "Users can update their own recommendations" ON public.personal_recommendations;

-- Создаем единую оптимизированную политику для UPDATE
CREATE POLICY "Users can update their own recommendations" 
  ON public.personal_recommendations 
  FOR UPDATE 
  USING ((select auth.uid()) = user_id);

-- Проверяем и оптимизируем другие политики если они есть
DROP POLICY IF EXISTS "Users can view their own personal recommendations" ON public.personal_recommendations;
DROP POLICY IF EXISTS "Users can view their own recommendations" ON public.personal_recommendations;

-- Создаем оптимизированную политику для SELECT
CREATE POLICY "Users can view their own recommendations" 
  ON public.personal_recommendations 
  FOR SELECT 
  USING ((select auth.uid()) = user_id);

-- Проверяем политики для INSERT
DROP POLICY IF EXISTS "Users can create their own personal recommendations" ON public.personal_recommendations;
DROP POLICY IF EXISTS "Users can create their own recommendations" ON public.personal_recommendations;

-- Создаем оптимизированную политику для INSERT
CREATE POLICY "Users can create their own recommendations" 
  ON public.personal_recommendations 
  FOR INSERT 
  WITH CHECK ((select auth.uid()) = user_id);

-- Проверяем политики для DELETE
DROP POLICY IF EXISTS "Users can delete their own personal recommendations" ON public.personal_recommendations;
DROP POLICY IF EXISTS "Users can delete their own recommendations" ON public.personal_recommendations;

-- Создаем оптимизированную политику для DELETE
CREATE POLICY "Users can delete their own recommendations" 
  ON public.personal_recommendations 
  FOR DELETE 
  USING ((select auth.uid()) = user_id);
