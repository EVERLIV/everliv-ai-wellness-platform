
-- Создаем таблицу для подписок, если её ещё нет (проверяем существующую структуру)
-- Обновляем таблицу подписок для поддержки базовой подписки
UPDATE subscription_plans 
SET is_active = true 
WHERE type = 'basic';

-- Если базового плана нет, создаем его
INSERT INTO subscription_plans (name, type, description, price, features, limits, is_active, is_popular)
VALUES (
  'Базовый',
  'basic', 
  'Бесплатный тариф с базовыми возможностями',
  0,
  '["1 лабораторный анализ в месяц", "99 сообщений в базовом чате", "Дневник питания"]'::jsonb,
  '{"labAnalysesPerMonth": 1, "chatMessagesPerMonth": 99, "nutritionDiary": true}'::jsonb,
  true,
  false
)
ON CONFLICT (type) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  features = EXCLUDED.features,
  limits = EXCLUDED.limits,
  is_active = true;

-- Создаем функцию для автоматического создания базовой подписки при регистрации
CREATE OR REPLACE FUNCTION public.create_basic_subscription_for_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Создаем базовую подписку для нового пользователя
  INSERT INTO public.subscriptions (user_id, plan_type, status, expires_at)
  VALUES (
    new.id,
    'basic',
    'active',
    now() + interval '1 year' -- Базовая подписка на год
  );
  RETURN new;
END;
$$;

-- Создаем триггер для автоматического создания базовой подписки
DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;
CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.create_basic_subscription_for_new_user();
