-- Обновляем подписку для hoaandrey@gmail.com на актуальную дату
UPDATE subscriptions 
SET 
  expires_at = now() + interval '1 year',
  updated_at = now()
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'hoaandrey@gmail.com'
);

-- Проверяем результат
SELECT 
  au.email,
  s.plan_type,
  s.status,
  s.expires_at
FROM auth.users au
JOIN subscriptions s ON s.user_id = au.id
WHERE au.email = 'hoaandrey@gmail.com';