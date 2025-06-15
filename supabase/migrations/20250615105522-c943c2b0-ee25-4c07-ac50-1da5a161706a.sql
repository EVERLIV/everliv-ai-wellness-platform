
-- Enable RLS for moscow_specialists table
ALTER TABLE public.moscow_specialists ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view published specialists (public directory)
CREATE POLICY "Anyone can view moscow specialists" 
  ON public.moscow_specialists 
  FOR SELECT 
  USING (true);

-- Only admins can create, update, or delete specialists
CREATE POLICY "Admins can manage moscow specialists" 
  ON public.moscow_specialists 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Also enable RLS for specialist_reviews table for consistency
ALTER TABLE public.specialist_reviews ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view published specialist reviews
CREATE POLICY "Anyone can view published specialist reviews" 
  ON public.specialist_reviews 
  FOR SELECT 
  USING (is_published = true);

-- Allow authenticated users to create reviews
CREATE POLICY "Authenticated users can create specialist reviews" 
  ON public.specialist_reviews 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Admins can update reviews (for moderation)
CREATE POLICY "Admins can update specialist reviews" 
  ON public.specialist_reviews 
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Admins can delete reviews (for moderation)
CREATE POLICY "Admins can delete specialist reviews" 
  ON public.specialist_reviews 
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Enable RLS for related public tables that should be readable by everyone
ALTER TABLE public.doctor_specializations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view doctor specializations" 
  ON public.doctor_specializations 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage doctor specializations" 
  ON public.doctor_specializations 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

ALTER TABLE public.medical_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view medical categories" 
  ON public.medical_categories 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage medical categories" 
  ON public.medical_categories 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

ALTER TABLE public.medical_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published medical articles" 
  ON public.medical_articles 
  FOR SELECT 
  USING (published = true);

CREATE POLICY "Admins can manage medical articles" 
  ON public.medical_articles 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

ALTER TABLE public.patient_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published patient reviews" 
  ON public.patient_reviews 
  FOR SELECT 
  USING (is_published = true);

CREATE POLICY "Authenticated users can create patient reviews" 
  ON public.patient_reviews 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update patient reviews" 
  ON public.patient_reviews 
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete patient reviews" 
  ON public.patient_reviews 
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));
