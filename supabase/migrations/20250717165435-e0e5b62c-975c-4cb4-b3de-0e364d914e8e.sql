-- Создание таблицы для календарных событий
CREATE TABLE public.calendar_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  event_type TEXT NOT NULL DEFAULT 'custom', -- 'analysis', 'appointment', 'reminder', 'custom'
  priority TEXT NOT NULL DEFAULT 'medium', -- 'high', 'medium', 'low'
  status TEXT NOT NULL DEFAULT 'planned', -- 'planned', 'completed', 'cancelled'
  related_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Create policies for calendar events
CREATE POLICY "Users can view their own calendar events" 
ON public.calendar_events 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own calendar events" 
ON public.calendar_events 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calendar events" 
ON public.calendar_events 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calendar events" 
ON public.calendar_events 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_calendar_events_updated_at
BEFORE UPDATE ON public.calendar_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Создание таблицы для аналитических инсайтов пользователя
CREATE TABLE public.user_analytics_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  insights_date DATE NOT NULL,
  health_score NUMERIC(5,2),
  insights_data JSONB NOT NULL DEFAULT '{}',
  recommendations JSONB NOT NULL DEFAULT '[]',
  trending_metrics JSONB NOT NULL DEFAULT '[]',
  key_findings TEXT[],
  next_update_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_analytics_insights ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics insights
CREATE POLICY "Users can view their own analytics insights" 
ON public.user_analytics_insights 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analytics insights" 
ON public.user_analytics_insights 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analytics insights" 
ON public.user_analytics_insights 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analytics insights" 
ON public.user_analytics_insights 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_analytics_insights_updated_at
BEFORE UPDATE ON public.user_analytics_insights
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Создание индексов для производительности
CREATE INDEX idx_calendar_events_user_date ON public.calendar_events(user_id, event_date);
CREATE INDEX idx_calendar_events_type ON public.calendar_events(event_type);
CREATE INDEX idx_user_analytics_insights_user_date ON public.user_analytics_insights(user_id, insights_date);

-- Создание уникального индекса для предотвращения дублирования аналитики за один день
CREATE UNIQUE INDEX idx_user_analytics_insights_unique_date ON public.user_analytics_insights(user_id, insights_date);