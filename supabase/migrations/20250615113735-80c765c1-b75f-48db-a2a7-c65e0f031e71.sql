
-- Создаем таблицу для хранения обращений в поддержку
CREATE TABLE public.support_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('rating', 'bug', 'question', 'feature')),
  rating INTEGER NULL CHECK (rating >= 1 AND rating <= 10),
  rating_comment TEXT NULL,
  problem_type TEXT NULL,
  browser_info TEXT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  admin_notes TEXT NULL,
  resolved_at TIMESTAMP WITH TIME ZONE NULL,
  resolved_by UUID NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем Row Level Security
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;

-- Политика для админов - полный доступ
CREATE POLICY "Admins can manage all support requests" 
  ON public.support_requests 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

-- Политика для обычных пользователей - только создание
CREATE POLICY "Anyone can create support requests" 
  ON public.support_requests 
  FOR INSERT 
  WITH CHECK (true);

-- Создаем индексы для быстрого поиска
CREATE INDEX idx_support_requests_status ON public.support_requests(status);
CREATE INDEX idx_support_requests_created_at ON public.support_requests(created_at DESC);
CREATE INDEX idx_support_requests_priority ON public.support_requests(priority);
CREATE INDEX idx_support_requests_email ON public.support_requests(user_email);
