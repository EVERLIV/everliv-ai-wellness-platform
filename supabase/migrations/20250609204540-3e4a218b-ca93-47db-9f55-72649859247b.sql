
-- Create medical_analyses table to store AI analysis results
CREATE TABLE public.medical_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL,
  results JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.medical_analyses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own medical analyses" 
  ON public.medical_analyses 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own medical analyses" 
  ON public.medical_analyses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medical analyses" 
  ON public.medical_analyses 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medical analyses" 
  ON public.medical_analyses 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_medical_analyses_user_id ON public.medical_analyses(user_id);
CREATE INDEX idx_medical_analyses_created_at ON public.medical_analyses(created_at DESC);
