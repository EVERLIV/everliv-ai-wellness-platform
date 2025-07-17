-- Создание таблицы для сохраненных рекомендаций анализов
CREATE TABLE public.saved_analysis_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  recommendation_hash TEXT NOT NULL, -- хэш для проверки дубликатов
  analysis_name TEXT NOT NULL,
  analysis_type TEXT NOT NULL,
  priority TEXT NOT NULL,
  reason TEXT NOT NULL,
  scheduled_date DATE, -- когда запланирован анализ
  event_id UUID, -- связь с календарным событием
  status TEXT NOT NULL DEFAULT 'planned', -- 'planned', 'completed', 'cancelled'
  recommendation_data JSONB NOT NULL DEFAULT '{}', -- полные данные рекомендации
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.saved_analysis_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own saved recommendations" 
ON public.saved_analysis_recommendations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saved recommendations" 
ON public.saved_analysis_recommendations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved recommendations" 
ON public.saved_analysis_recommendations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved recommendations" 
ON public.saved_analysis_recommendations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_saved_analysis_recommendations_updated_at
BEFORE UPDATE ON public.saved_analysis_recommendations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes
CREATE INDEX idx_saved_analysis_recommendations_user ON public.saved_analysis_recommendations(user_id);
CREATE INDEX idx_saved_analysis_recommendations_hash ON public.saved_analysis_recommendations(user_id, recommendation_hash);
CREATE INDEX idx_saved_analysis_recommendations_date ON public.saved_analysis_recommendations(user_id, scheduled_date);

-- Create unique constraint for preventing duplicates
CREATE UNIQUE INDEX idx_saved_analysis_recommendations_unique ON public.saved_analysis_recommendations(user_id, recommendation_hash);