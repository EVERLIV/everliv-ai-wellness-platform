
-- Добавляем RLS политики для health_profiles
ALTER TABLE public.health_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view their own health profiles" 
  ON public.health_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can create their own health profiles" 
  ON public.health_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own health profiles" 
  ON public.health_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own health profiles" 
  ON public.health_profiles 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Добавляем RLS политики для medical_analyses
ALTER TABLE public.medical_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view their own medical analyses" 
  ON public.medical_analyses 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can create their own medical analyses" 
  ON public.medical_analyses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own medical analyses" 
  ON public.medical_analyses 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own medical analyses" 
  ON public.medical_analyses 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Добавляем RLS политики для food_entries
ALTER TABLE public.food_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view their own food entries" 
  ON public.food_entries 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can create their own food entries" 
  ON public.food_entries 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own food entries" 
  ON public.food_entries 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own food entries" 
  ON public.food_entries 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Добавляем RLS политики для ai_doctor_chats
ALTER TABLE public.ai_doctor_chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view their own ai doctor chats" 
  ON public.ai_doctor_chats 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can create their own ai doctor chats" 
  ON public.ai_doctor_chats 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own ai doctor chats" 
  ON public.ai_doctor_chats 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own ai doctor chats" 
  ON public.ai_doctor_chats 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Добавляем RLS политики для user_analytics
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view their own analytics" 
  ON public.user_analytics 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can create their own analytics" 
  ON public.user_analytics 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own analytics" 
  ON public.user_analytics 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own analytics" 
  ON public.user_analytics 
  FOR DELETE 
  USING (auth.uid() = user_id);
