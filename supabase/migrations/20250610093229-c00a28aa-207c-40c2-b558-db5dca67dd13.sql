
-- Создаем таблицу для хранения аналитических данных
CREATE TABLE public.user_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  analytics_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Добавляем RLS политики
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;

-- Политики для доступа пользователей к своим данным
CREATE POLICY "Users can view their own analytics" 
  ON public.user_analytics 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics" 
  ON public.user_analytics 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analytics" 
  ON public.user_analytics 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Индекс для быстрого поиска по user_id
CREATE INDEX idx_user_analytics_user_id ON public.user_analytics(user_id);
