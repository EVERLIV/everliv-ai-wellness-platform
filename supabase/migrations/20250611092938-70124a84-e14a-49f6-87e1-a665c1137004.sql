
-- Add missing columns to medical_analyses table
ALTER TABLE public.medical_analyses 
ADD COLUMN IF NOT EXISTS summary TEXT,
ADD COLUMN IF NOT EXISTS input_method TEXT DEFAULT 'text';

-- Create biomarkers table to store individual biomarker data
CREATE TABLE IF NOT EXISTS public.biomarkers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_id UUID NOT NULL REFERENCES public.medical_analyses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value TEXT,
  reference_range TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for biomarkers table
ALTER TABLE public.biomarkers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for biomarkers
CREATE POLICY "Users can view biomarkers for their analyses" 
  ON public.biomarkers 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.medical_analyses 
      WHERE id = biomarkers.analysis_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create biomarkers for their analyses" 
  ON public.biomarkers 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.medical_analyses 
      WHERE id = biomarkers.analysis_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update biomarkers for their analyses" 
  ON public.biomarkers 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.medical_analyses 
      WHERE id = biomarkers.analysis_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete biomarkers for their analyses" 
  ON public.biomarkers 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.medical_analyses 
      WHERE id = biomarkers.analysis_id 
      AND user_id = auth.uid()
    )
  );

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_biomarkers_analysis_id ON public.biomarkers(analysis_id);
