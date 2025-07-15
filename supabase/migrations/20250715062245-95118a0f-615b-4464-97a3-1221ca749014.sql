-- Добавляем поле test_date в таблицу medical_analyses для хранения даты проведения анализа
ALTER TABLE medical_analyses 
ADD COLUMN test_date DATE;

-- Заполняем существующие записи, используя дату создания как дату анализа
UPDATE medical_analyses 
SET test_date = created_at::date 
WHERE test_date IS NULL;