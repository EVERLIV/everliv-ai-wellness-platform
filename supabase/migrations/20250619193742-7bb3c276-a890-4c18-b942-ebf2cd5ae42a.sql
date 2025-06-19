
-- Создаем таблицу для персональных рекомендаций
CREATE TABLE public.personal_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('nutrition', 'exercise', 'sleep', 'stress', 'medical', 'lifestyle')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  source_data JSONB
);

-- Добавляем Row Level Security
ALTER TABLE public.personal_recommendations ENABLE ROW LEVEL SECURITY;

-- Политики RLS для персональных рекомендаций
CREATE POLICY "Users can view their own recommendations" 
  ON public.personal_recommendations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recommendations" 
  ON public.personal_recommendations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recommendations" 
  ON public.personal_recommendations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recommendations" 
  ON public.personal_recommendations 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Создаем индексы для производительности
CREATE INDEX idx_personal_recommendations_user_id ON public.personal_recommendations(user_id);
CREATE INDEX idx_personal_recommendations_category ON public.personal_recommendations(category);
CREATE INDEX idx_personal_recommendations_completed ON public.personal_recommendations(is_completed);
