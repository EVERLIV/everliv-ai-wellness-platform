-- Обновляем единственного пользователя с базовой подпиской до премиум
UPDATE subscriptions 
SET 
  plan_type = 'premium',
  expires_at = now() + interval '1 year'
WHERE plan_type = 'basic';

-- Создаем премиум подписки для пользователей без подписки
INSERT INTO subscriptions (user_id, plan_type, status, expires_at, started_at)
SELECT 
  au.id,
  'premium',
  'active',
  now() + interval '1 year',
  now()
FROM auth.users au
WHERE au.id NOT IN (SELECT user_id FROM subscriptions WHERE user_id = au.id);