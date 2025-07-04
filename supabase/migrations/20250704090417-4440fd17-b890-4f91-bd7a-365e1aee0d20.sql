-- Включаем реальном времени обновления для отслеживания изменений
ALTER TABLE public.medical_analyses REPLICA IDENTITY FULL;
ALTER TABLE public.health_profiles REPLICA IDENTITY FULL;

-- Добавляем таблицы в публикацию для реального времени
ALTER PUBLICATION supabase_realtime ADD TABLE medical_analyses;
ALTER PUBLICATION supabase_realtime ADD TABLE health_profiles;