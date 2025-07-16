-- Создание основных таблиц для модуля диагностики

-- Таблица сессий диагностики
CREATE TABLE public.diagnostic_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'Новая диагностика',
  description TEXT,
  session_type TEXT NOT NULL DEFAULT 'ecg',
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Таблица ЭКГ записей
CREATE TABLE public.ecg_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  user_id UUID NOT NULL,
  file_url TEXT,
  file_type TEXT,
  analysis_status TEXT NOT NULL DEFAULT 'pending',
  heart_rate NUMERIC,
  rhythm_type TEXT,
  intervals JSONB,
  raw_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Таблица диагностических файлов
CREATE TABLE public.diagnostic_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  upload_status TEXT NOT NULL DEFAULT 'uploading',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Таблица ИИ-анализов
CREATE TABLE public.ai_diagnostic_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  user_id UUID NOT NULL,
  analysis_type TEXT NOT NULL,
  input_data JSONB,
  ai_findings JSONB,
  confidence_score NUMERIC,
  analysis_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Таблица диагнозов врачей
CREATE TABLE public.doctor_diagnoses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  user_id UUID NOT NULL,
  icd_code TEXT,
  icd_description TEXT,
  primary_diagnosis TEXT NOT NULL,
  secondary_diagnoses TEXT[],
  severity_level TEXT,
  complications TEXT[],
  doctor_comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Таблица рекомендаций
CREATE TABLE public.diagnostic_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  user_id UUID NOT NULL,
  recommendation_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  category TEXT NOT NULL,
  ai_generated BOOLEAN NOT NULL DEFAULT true,
  doctor_approved BOOLEAN,
  implementation_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включение RLS
ALTER TABLE public.diagnostic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecg_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_diagnostic_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_recommendations ENABLE ROW LEVEL SECURITY;

-- Политики RLS для diagnostic_sessions
CREATE POLICY "Users can view their own diagnostic sessions" 
ON public.diagnostic_sessions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own diagnostic sessions" 
ON public.diagnostic_sessions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diagnostic sessions" 
ON public.diagnostic_sessions FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diagnostic sessions" 
ON public.diagnostic_sessions FOR DELETE 
USING (auth.uid() = user_id);

-- Политики RLS для ecg_records
CREATE POLICY "Users can view their own ECG records" 
ON public.ecg_records FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ECG records" 
ON public.ecg_records FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ECG records" 
ON public.ecg_records FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ECG records" 
ON public.ecg_records FOR DELETE 
USING (auth.uid() = user_id);

-- Политики RLS для diagnostic_files
CREATE POLICY "Users can view their own diagnostic files" 
ON public.diagnostic_files FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own diagnostic files" 
ON public.diagnostic_files FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diagnostic files" 
ON public.diagnostic_files FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diagnostic files" 
ON public.diagnostic_files FOR DELETE 
USING (auth.uid() = user_id);

-- Политики RLS для ai_diagnostic_analyses
CREATE POLICY "Users can view their own AI analyses" 
ON public.ai_diagnostic_analyses FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI analyses" 
ON public.ai_diagnostic_analyses FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI analyses" 
ON public.ai_diagnostic_analyses FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI analyses" 
ON public.ai_diagnostic_analyses FOR DELETE 
USING (auth.uid() = user_id);

-- Политики RLS для doctor_diagnoses
CREATE POLICY "Users can view their own doctor diagnoses" 
ON public.doctor_diagnoses FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own doctor diagnoses" 
ON public.doctor_diagnoses FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own doctor diagnoses" 
ON public.doctor_diagnoses FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own doctor diagnoses" 
ON public.doctor_diagnoses FOR DELETE 
USING (auth.uid() = user_id);

-- Политики RLS для diagnostic_recommendations
CREATE POLICY "Users can view their own diagnostic recommendations" 
ON public.diagnostic_recommendations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own diagnostic recommendations" 
ON public.diagnostic_recommendations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diagnostic recommendations" 
ON public.diagnostic_recommendations FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diagnostic recommendations" 
ON public.diagnostic_recommendations FOR DELETE 
USING (auth.uid() = user_id);

-- Создание storage bucket для диагностических файлов
INSERT INTO storage.buckets (id, name, public) VALUES ('diagnostics', 'diagnostics', true);

-- Политики для storage bucket
CREATE POLICY "Users can view their own diagnostic files" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'diagnostics' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own diagnostic files" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'diagnostics' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own diagnostic files" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'diagnostics' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own diagnostic files" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'diagnostics' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Функция для обновления updated_at
CREATE TRIGGER update_diagnostic_sessions_updated_at
BEFORE UPDATE ON public.diagnostic_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ecg_records_updated_at
BEFORE UPDATE ON public.ecg_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_diagnostic_files_updated_at
BEFORE UPDATE ON public.diagnostic_files
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_diagnostic_analyses_updated_at
BEFORE UPDATE ON public.ai_diagnostic_analyses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctor_diagnoses_updated_at
BEFORE UPDATE ON public.doctor_diagnoses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_diagnostic_recommendations_updated_at
BEFORE UPDATE ON public.diagnostic_recommendations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();