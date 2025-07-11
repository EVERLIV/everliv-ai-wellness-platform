-- Обновляем нормы биомаркеров на основе пола пользователя
-- Для гемоглобина
UPDATE biomarkers 
SET reference_range = CASE 
  WHEN EXISTS (
    SELECT 1 FROM profiles p 
    JOIN medical_analyses ma ON ma.user_id = p.id 
    WHERE ma.id = biomarkers.analysis_id 
    AND (p.gender = 'male' OR p.gender = 'м')
  ) THEN '130-170 г/л'
  WHEN EXISTS (
    SELECT 1 FROM profiles p 
    JOIN medical_analyses ma ON ma.user_id = p.id 
    WHERE ma.id = biomarkers.analysis_id 
    AND (p.gender = 'female' OR p.gender = 'ж')
  ) THEN '120-150 г/л'
  ELSE '120-170 г/л'
END
WHERE name = 'Гемоглобин' AND reference_range IS NULL;

-- Для эритроцитов
UPDATE biomarkers 
SET reference_range = CASE 
  WHEN EXISTS (
    SELECT 1 FROM profiles p 
    JOIN medical_analyses ma ON ma.user_id = p.id 
    WHERE ma.id = biomarkers.analysis_id 
    AND (p.gender = 'male' OR p.gender = 'м')
  ) THEN '4.0-5.1 млн/мкл'
  WHEN EXISTS (
    SELECT 1 FROM profiles p 
    JOIN medical_analyses ma ON ma.user_id = p.id 
    WHERE ma.id = biomarkers.analysis_id 
    AND (p.gender = 'female' OR p.gender = 'ж')
  ) THEN '3.7-4.7 млн/мкл'
  ELSE '3.7-5.1 млн/мкл'
END
WHERE name = 'Эритроциты' AND reference_range IS NULL;

-- Для креатинина
UPDATE biomarkers 
SET reference_range = CASE 
  WHEN EXISTS (
    SELECT 1 FROM profiles p 
    JOIN medical_analyses ma ON ma.user_id = p.id 
    WHERE ma.id = biomarkers.analysis_id 
    AND (p.gender = 'male' OR p.gender = 'м')
  ) THEN '62-106 мкмоль/л'
  WHEN EXISTS (
    SELECT 1 FROM profiles p 
    JOIN medical_analyses ma ON ma.user_id = p.id 
    WHERE ma.id = biomarkers.analysis_id 
    AND (p.gender = 'female' OR p.gender = 'ж')
  ) THEN '44-80 мкмоль/л'
  ELSE '44-106 мкмоль/л'
END
WHERE name = 'Креатинин' AND reference_range IS NULL;

-- Для общих биомаркеров (не зависящих от пола)
UPDATE biomarkers 
SET reference_range = '4.0-9.0 тыс/мкл'
WHERE name = 'Лейкоциты' AND reference_range IS NULL;

UPDATE biomarkers 
SET reference_range = '150-450 тыс/мкл'
WHERE name = 'Тромбоциты' AND reference_range IS NULL;

UPDATE biomarkers 
SET reference_range = '3.3-5.5 ммоль/л'
WHERE name = 'Глюкоза' AND reference_range IS NULL;

UPDATE biomarkers 
SET reference_range = '2.5-8.3 ммоль/л'
WHERE name = 'Мочевина' AND reference_range IS NULL;

UPDATE biomarkers 
SET reference_range = '64-84 г/л'
WHERE name = 'Общий белок' AND reference_range IS NULL;

UPDATE biomarkers 
SET reference_range = '5-21 мкмоль/л'
WHERE name = 'Билирубин общий' AND reference_range IS NULL;

UPDATE biomarkers 
SET reference_range = '0-5 мкмоль/л'
WHERE name = 'Билирубин прямой' AND reference_range IS NULL;

UPDATE biomarkers 
SET reference_range = '3.5-5.1 ммоль/л'
WHERE name = 'Калий' AND reference_range IS NULL;

UPDATE biomarkers 
SET reference_range = '136-145 ммоль/л'
WHERE name = 'Натрий' AND reference_range IS NULL;