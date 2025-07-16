-- Создаем таблицу для диагностических синтезов
CREATE TABLE public.diagnostic_synthesis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  user_id UUID NOT NULL,
  doctor_diagnosis TEXT NOT NULL,
  ai_analysis JSONB NOT NULL DEFAULT '{}',
  synthesis_type TEXT NOT NULL CHECK (synthesis_type IN ('confirming', 'complementing', 'questioning')),
  confidence_score NUMERIC(5,2) NOT NULL DEFAULT 0.0,
  agreements JSONB DEFAULT '[]',
  discrepancies JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '{}',
  follow_up_actions JSONB DEFAULT '[]',
  doctor_feedback JSONB DEFAULT NULL,
  is_validated BOOLEAN DEFAULT FALSE,
  validation_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS
ALTER TABLE public.diagnostic_synthesis ENABLE ROW LEVEL SECURITY;

-- Создаем политики безопасности
CREATE POLICY "Users can view their own diagnostic synthesis" 
ON public.diagnostic_synthesis 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own diagnostic synthesis" 
ON public.diagnostic_synthesis 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diagnostic synthesis" 
ON public.diagnostic_synthesis 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diagnostic synthesis" 
ON public.diagnostic_synthesis 
FOR DELETE 
USING (auth.uid() = user_id);

-- Создаем таблицу для рекомендаций по диагнозам
CREATE TABLE public.diagnosis_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  synthesis_id UUID NOT NULL REFERENCES diagnostic_synthesis(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('medication', 'lifestyle', 'monitoring', 'follow_up')),
  recommendation_text TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('critical', 'high', 'medium', 'low')) DEFAULT 'medium',
  evidence_level TEXT CHECK (evidence_level IN ('A', 'B', 'C', 'D')) DEFAULT 'C',
  personalization_factors JSONB DEFAULT '{}',
  target_values JSONB DEFAULT '{}',
  monitoring_schedule TEXT,
  contraindications TEXT[],
  is_approved BOOLEAN DEFAULT FALSE,
  doctor_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для рекомендаций
ALTER TABLE public.diagnosis_recommendations ENABLE ROW LEVEL SECURITY;

-- Политики для рекомендаций
CREATE POLICY "Users can view their diagnosis recommendations" 
ON public.diagnosis_recommendations 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM diagnostic_synthesis ds 
  WHERE ds.id = diagnosis_recommendations.synthesis_id 
  AND ds.user_id = auth.uid()
));

CREATE POLICY "Users can create their diagnosis recommendations" 
ON public.diagnosis_recommendations 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM diagnostic_synthesis ds 
  WHERE ds.id = diagnosis_recommendations.synthesis_id 
  AND ds.user_id = auth.uid()
));

CREATE POLICY "Users can update their diagnosis recommendations" 
ON public.diagnosis_recommendations 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM diagnostic_synthesis ds 
  WHERE ds.id = diagnosis_recommendations.synthesis_id 
  AND ds.user_id = auth.uid()
));

CREATE POLICY "Users can delete their diagnosis recommendations" 
ON public.diagnosis_recommendations 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM diagnostic_synthesis ds 
  WHERE ds.id = diagnosis_recommendations.synthesis_id 
  AND ds.user_id = auth.uid()
));

-- Создаем индексы для производительности
CREATE INDEX idx_diagnostic_synthesis_session ON diagnostic_synthesis(session_id);
CREATE INDEX idx_diagnostic_synthesis_user ON diagnostic_synthesis(user_id);
CREATE INDEX idx_diagnostic_synthesis_type ON diagnostic_synthesis(synthesis_type);
CREATE INDEX idx_diagnosis_recommendations_synthesis ON diagnosis_recommendations(synthesis_id);
CREATE INDEX idx_diagnosis_recommendations_category ON diagnosis_recommendations(category);

-- Триггер для обновления updated_at
CREATE TRIGGER update_diagnostic_synthesis_updated_at
  BEFORE UPDATE ON diagnostic_synthesis
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diagnosis_recommendations_updated_at
  BEFORE UPDATE ON diagnosis_recommendations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();