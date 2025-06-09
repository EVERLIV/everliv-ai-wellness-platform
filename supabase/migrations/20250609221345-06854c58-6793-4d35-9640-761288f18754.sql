
-- Сначала добавим уникальное ограничение на user_id в таблицу subscriptions
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_user_id_unique UNIQUE (user_id);

-- Теперь создаем премиум подписку для пользователя 1111hoaandrey@gmail.com
INSERT INTO subscriptions (user_id, plan_type, status, started_at, expires_at)
SELECT 
  id as user_id,
  'premium' as plan_type,
  'active' as status,
  now() as started_at,
  (now() + interval '1 year') as expires_at
FROM auth.users 
WHERE email = '1111hoaandrey@gmail.com'
ON CONFLICT (user_id) 
DO UPDATE SET 
  plan_type = 'premium',
  status = 'active',
  expires_at = (now() + interval '1 year'),
  updated_at = now();
