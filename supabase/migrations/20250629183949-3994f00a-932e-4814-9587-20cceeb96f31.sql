
-- Удаляем все существующие политики для health_profiles
DROP POLICY IF EXISTS "health_profiles_select_own" ON public.health_profiles;
DROP POLICY IF EXISTS "health_profiles_insert_own" ON public.health_profiles;
DROP POLICY IF EXISTS "health_profiles_update_own" ON public.health_profiles;
DROP POLICY IF EXISTS "health_profiles_delete_own" ON public.health_profiles;

-- Создаем правильные RLS политики для health_profiles
CREATE POLICY "Users can view their own health profiles" 
  ON public.health_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own health profiles" 
  ON public.health_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health profiles" 
  ON public.health_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health profiles" 
  ON public.health_profiles 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Убеждаемся, что RLS включен
ALTER TABLE public.health_profiles ENABLE ROW LEVEL SECURITY;
