
-- Удаляем существующие политики, если они есть
DROP POLICY IF EXISTS "Users can view own health profile" ON public.health_profiles;
DROP POLICY IF EXISTS "Users can create own health profile" ON public.health_profiles;
DROP POLICY IF EXISTS "Users can update own health profile" ON public.health_profiles;
DROP POLICY IF EXISTS "Users can delete own health profile" ON public.health_profiles;

DROP POLICY IF EXISTS "Users can view their own health profiles" ON public.health_profiles;
DROP POLICY IF EXISTS "Users can create their own health profiles" ON public.health_profiles;
DROP POLICY IF EXISTS "Users can update their own health profiles" ON public.health_profiles;
DROP POLICY IF EXISTS "Users can delete their own health profiles" ON public.health_profiles;

-- Создаем корректные RLS политики
CREATE POLICY "health_profiles_select_own" 
  ON public.health_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "health_profiles_insert_own" 
  ON public.health_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "health_profiles_update_own" 
  ON public.health_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "health_profiles_delete_own" 
  ON public.health_profiles 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Убеждаемся, что RLS включен
ALTER TABLE public.health_profiles ENABLE ROW LEVEL SECURITY;
