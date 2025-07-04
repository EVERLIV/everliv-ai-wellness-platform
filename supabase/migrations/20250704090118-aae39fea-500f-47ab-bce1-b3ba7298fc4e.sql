-- Создаем таблицу для кэшированных рекомендаций
CREATE TABLE public.cached_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  recommendations_type TEXT NOT NULL CHECK (recommendations_type IN ('analytics', 'dashboard')),
  recommendations_data JSONB NOT NULL DEFAULT '[]'::jsonb,
  source_hash TEXT NOT NULL, -- хэш для отслеживания изменений источников
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, recommendations_type)
);

-- Включаем RLS
ALTER TABLE public.cached_recommendations ENABLE ROW LEVEL SECURITY;

-- Политики для пользователей
CREATE POLICY "Users can view their own cached recommendations" 
ON public.cached_recommendations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cached recommendations" 
ON public.cached_recommendations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cached recommendations" 
ON public.cached_recommendations 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Триггер для updated_at
CREATE TRIGGER update_cached_recommendations_updated_at
BEFORE UPDATE ON public.cached_recommendations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();