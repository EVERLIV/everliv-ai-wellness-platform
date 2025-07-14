-- Добавляем real-time для user_analytics и cached_recommendations
ALTER TABLE user_analytics REPLICA IDENTITY FULL;
ALTER TABLE cached_recommendations REPLICA IDENTITY FULL;
ALTER TABLE daily_health_metrics REPLICA IDENTITY FULL;

-- Добавляем таблицы в публикацию для real-time
ALTER PUBLICATION supabase_realtime ADD TABLE user_analytics;
ALTER PUBLICATION supabase_realtime ADD TABLE cached_recommendations; 
ALTER PUBLICATION supabase_realtime ADD TABLE daily_health_metrics;