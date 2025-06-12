
-- Включаем Row Level Security для таблицы health_profiles
ALTER TABLE public.health_profiles ENABLE ROW LEVEL SECURITY;

-- Политика для чтения: пользователи могут видеть только свои данные
CREATE POLICY "Users can view own health profile" 
  ON public.health_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Политика для вставки: пользователи могут создавать только свои профили
CREATE POLICY "Users can create own health profile" 
  ON public.health_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Политика для обновления: пользователи могут обновлять только свои профили
CREATE POLICY "Users can update own health profile" 
  ON public.health_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Политика для удаления: пользователи могут удалять только свои профили
CREATE POLICY "Users can delete own health profile" 
  ON public.health_profiles 
  FOR DELETE 
  USING (auth.uid() = user_id);
