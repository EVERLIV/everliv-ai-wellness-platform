
-- Удаляем старое ограничение категории
ALTER TABLE personal_recommendations DROP CONSTRAINT IF EXISTS personal_recommendations_category_check;

-- Добавляем новое ограничение с правильными категориями
ALTER TABLE personal_recommendations ADD CONSTRAINT personal_recommendations_category_check 
CHECK (category IN ('nutrition', 'exercise', 'sleep', 'stress', 'supplements', 'biohacking', 'general', 'cardiovascular', 'cognitive', 'metabolism', 'immunity', 'longevity'));
