
-- Создаем таблицу для хранения рекомендаций по здоровью
CREATE TABLE public.health_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  priority TEXT NOT NULL DEFAULT 'medium',
  type TEXT NOT NULL DEFAULT 'ai_generated',
  status TEXT NOT NULL DEFAULT 'active',
  source_data JSONB DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем Row Level Security
ALTER TABLE public.health_recommendations ENABLE ROW LEVEL SECURITY;

-- Создаем политики RLS для пользователей
CREATE POLICY "Users can view their own health recommendations" 
  ON public.health_recommendations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own health recommendations" 
  ON public.health_recommendations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health recommendations" 
  ON public.health_recommendations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health recommendations" 
  ON public.health_recommendations 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Создаем триггер для автоматического обновления updated_at
CREATE TRIGGER update_health_recommendations_updated_at
  BEFORE UPDATE ON public.health_recommendations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
