-- Создаем таблицу для хранения ИИ-рекомендаций
CREATE TABLE public.ai_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  recommendation_type TEXT NOT NULL, -- 'prognostic', 'actionable', 'personalized'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium', -- 'high', 'medium', 'low'
  source_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;

-- Политики RLS
CREATE POLICY "Users can view their own AI recommendations" 
ON public.ai_recommendations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI recommendations" 
ON public.ai_recommendations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI recommendations" 
ON public.ai_recommendations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI recommendations" 
ON public.ai_recommendations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Создаем индекс для быстрого поиска
CREATE INDEX idx_ai_recommendations_user_type ON public.ai_recommendations(user_id, recommendation_type);
CREATE INDEX idx_ai_recommendations_created_at ON public.ai_recommendations(created_at);

-- Триггер для обновления updated_at
CREATE TRIGGER update_ai_recommendations_updated_at
BEFORE UPDATE ON public.ai_recommendations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();