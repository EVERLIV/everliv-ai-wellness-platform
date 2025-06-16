
-- Создаем таблицу для newsletter подписок
CREATE TABLE public.newsletter_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  frequency TEXT NOT NULL DEFAULT 'weekly',
  categories TEXT[] NOT NULL DEFAULT '{"general"}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Добавляем RLS для безопасности
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Политики доступа - пользователи могут управлять только своими подписками
CREATE POLICY "Users can view their own newsletter subscriptions" 
  ON public.newsletter_subscriptions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own newsletter subscriptions" 
  ON public.newsletter_subscriptions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own newsletter subscriptions" 
  ON public.newsletter_subscriptions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own newsletter subscriptions" 
  ON public.newsletter_subscriptions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Добавляем недостающую колонку nickname в таблицу profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nickname TEXT;

-- Включаем realtime для newsletter подписок
ALTER TABLE public.newsletter_subscriptions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.newsletter_subscriptions;
