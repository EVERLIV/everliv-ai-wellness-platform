
-- Создаем таблицу для категорий медицинских статей
CREATE TABLE public.medical_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для медицинских статей
CREATE TABLE public.medical_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category_id UUID REFERENCES public.medical_categories(id),
  article_type TEXT NOT NULL CHECK (article_type IN ('symptom', 'disease', 'guide', 'faq', 'doctor_info')),
  tags TEXT[],
  author TEXT,
  medical_review_status TEXT DEFAULT 'pending' CHECK (medical_review_status IN ('pending', 'approved', 'rejected')),
  published BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для отзывов пациентов
CREATE TABLE public.patient_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID REFERENCES public.medical_articles(id),
  patient_name TEXT,
  email TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для специализаций врачей
CREATE TABLE public.doctor_specializations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  required_education TEXT,
  common_conditions TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для всех таблиц
ALTER TABLE public.medical_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_specializations ENABLE ROW LEVEL SECURITY;

-- Создаем политики для публичного чтения медицинских категорий
CREATE POLICY "Medical categories are publicly readable" 
  ON public.medical_categories 
  FOR SELECT 
  USING (true);

-- Создаем политики для публичного чтения опубликованных медицинских статей
CREATE POLICY "Published medical articles are publicly readable" 
  ON public.medical_articles 
  FOR SELECT 
  USING (published = true AND medical_review_status = 'approved');

-- Создаем политики для публичного чтения опубликованных отзывов
CREATE POLICY "Published reviews are publicly readable" 
  ON public.patient_reviews 
  FOR SELECT 
  USING (is_published = true);

-- Создаем политики для публичного чтения специализаций врачей
CREATE POLICY "Doctor specializations are publicly readable" 
  ON public.doctor_specializations 
  FOR SELECT 
  USING (true);

-- Создаем политики для создания отзывов (любой может оставить отзыв)
CREATE POLICY "Anyone can create reviews" 
  ON public.patient_reviews 
  FOR INSERT 
  WITH CHECK (true);

-- Индексы для оптимизации поиска
CREATE INDEX idx_medical_articles_category ON public.medical_articles(category_id);
CREATE INDEX idx_medical_articles_type ON public.medical_articles(article_type);
CREATE INDEX idx_medical_articles_published ON public.medical_articles(published);
CREATE INDEX idx_medical_articles_tags ON public.medical_articles USING GIN(tags);
CREATE INDEX idx_patient_reviews_article ON public.patient_reviews(article_id);

-- Вставляем начальные категории
INSERT INTO public.medical_categories (name, description, icon) VALUES
('Симптомы', 'Описание распространенных симптомов и их возможных причин', 'Stethoscope'),
('Заболевания', 'Информация о различных заболеваниях и методах лечения', 'Heart'),
('Руководства', 'Медицинские руководства и инструкции', 'BookOpen'),
('FAQ', 'Часто задаваемые вопросы о здоровье', 'HelpCircle'),
('Врачи и специализации', 'Информация о медицинских специальностях', 'UserCheck');

-- Вставляем несколько примеров специализаций врачей
INSERT INTO public.doctor_specializations (name, description, required_education, common_conditions) VALUES
('Кардиолог', 'Врач, специализирующийся на диагностике и лечении заболеваний сердечно-сосудистой системы', 'Высшее медицинское образование, ординатура по кардиологии', ARRAY['Гипертония', 'Ишемическая болезнь сердца', 'Аритмия', 'Сердечная недостаточность']),
('Эндокринолог', 'Врач, занимающийся диагностикой и лечением заболеваний эндокринной системы', 'Высшее медицинское образование, ординатура по эндокринологии', ARRAY['Сахарный диабет', 'Заболевания щитовидной железы', 'Ожирение', 'Остеопороз']),
('Невролог', 'Врач, специализирующийся на заболеваниях нервной системы', 'Высшее медицинское образование, ординатура по неврологии', ARRAY['Головные боли', 'Эпилепсия', 'Инсульт', 'Болезнь Паркинсона']);
