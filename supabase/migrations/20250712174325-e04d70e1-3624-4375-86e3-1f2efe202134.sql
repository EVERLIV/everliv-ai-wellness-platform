-- Обновляем статусы биомаркеров, которые должны быть понижены

-- Обновляем Лимфоциты - они должны быть понижены
UPDATE biomarkers 
SET status = 'понижен' 
WHERE name = 'Лимфоциты' 
AND value = '30 %' 
AND status = 'normal';

-- Обновляем Моноциты - они должны быть понижены  
UPDATE biomarkers 
SET status = 'понижен'
WHERE name = 'Моноциты' 
AND value = '7 %'
AND status = 'normal';

-- Также обновим статус Ретикулоцитов для единообразия (с 'low' на 'понижен')
UPDATE biomarkers 
SET status = 'понижен'
WHERE name = 'Ретикулоциты' 
AND value = '1 %'
AND status = 'low';