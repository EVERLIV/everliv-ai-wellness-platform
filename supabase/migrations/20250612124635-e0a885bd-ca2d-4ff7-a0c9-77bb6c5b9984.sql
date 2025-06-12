
-- Обновляем подписку для пользователя kamilgraf@hotmail.com на premium
UPDATE subscriptions 
SET 
  plan_type = 'premium',
  status = 'active',
  expires_at = now() + interval '1 month',
  updated_at = now()
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'kamilgraf@hotmail.com'
);

-- Если у пользователя нет подписки, создаем новую
INSERT INTO subscriptions (user_id, plan_type, status, expires_at, started_at)
SELECT 
  id,
  'premium',
  'active',
  now() + interval '1 month',
  now()
FROM auth.users 
WHERE email = 'kamilgraf@hotmail.com'
AND id NOT IN (SELECT user_id FROM subscriptions WHERE user_id = auth.users.id)
ON CONFLICT (user_id) DO NOTHING;

-- Проверяем результат
SELECT 
  au.email,
  s.plan_type,
  s.status,
  s.expires_at,
  p.first_name,
  p.last_name
FROM auth.users au
JOIN subscriptions s ON s.user_id = au.id
LEFT JOIN profiles p ON p.id = au.id
WHERE au.email = 'kamilgraf@hotmail.com';
