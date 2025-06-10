
-- Сначала проверим и добавим недостающие колонки в subscription_plans
ALTER TABLE public.subscription_plans 
ADD COLUMN IF NOT EXISTS limits JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Обновляем таблицу подписок пользователей
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Создаем таблицу для отслеживания использования лимитов
CREATE TABLE IF NOT EXISTS public.usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  feature_type TEXT NOT NULL,
  usage_count INTEGER NOT NULL DEFAULT 0,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, feature_type, period_start)
);

-- Включаем RLS для новых таблиц
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- Удаляем существующие политики если они есть
DROP POLICY IF EXISTS "usage_tracking_select_own" ON public.usage_tracking;
DROP POLICY IF EXISTS "usage_tracking_insert_own" ON public.usage_tracking;
DROP POLICY IF EXISTS "usage_tracking_update_own" ON public.usage_tracking;
DROP POLICY IF EXISTS "subscriptions_select_own" ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions_insert_own" ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions_update_own" ON public.subscriptions;

-- Политики для usage_tracking (пользователи видят только свою статистику)
CREATE POLICY "usage_tracking_select_own" ON public.usage_tracking
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "usage_tracking_insert_own" ON public.usage_tracking
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "usage_tracking_update_own" ON public.usage_tracking
  FOR UPDATE USING (user_id = auth.uid());

-- Политики для subscriptions (пользователи видят только свои подписки)
CREATE POLICY "subscriptions_select_own" ON public.subscriptions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "subscriptions_insert_own" ON public.subscriptions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "subscriptions_update_own" ON public.subscriptions
  FOR UPDATE USING (user_id = auth.uid());

-- Обновляем или вставляем базовые тарифные планы
INSERT INTO public.subscription_plans (name, type, description, price, features, limits) VALUES 
(
  'Базовый', 
  'basic', 
  'Бесплатный тариф с базовыми возможностями',
  0,
  '["Лабораторные анализы", "Доступ к базовому чату", "Дневник питания"]'::jsonb,
  '{"lab_analyses_per_month": 1, "chat_messages_per_month": 99, "nutrition_diary": true}'::jsonb
),
(
  'Премиум', 
  'premium', 
  'Расширенные возможности для полноценной заботы о здоровье',
  999,
  '["Лабораторные анализы", "Доступ к премиум чату", "Профиль здоровья", "Дневник питания"]'::jsonb,
  '{"lab_analyses_per_month": 15, "chat_messages_per_month": 199, "nutrition_diary": true, "health_profile": true}'::jsonb
)
ON CONFLICT (type) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  features = EXCLUDED.features,
  limits = EXCLUDED.limits,
  updated_at = now();
