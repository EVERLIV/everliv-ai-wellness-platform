
-- Удаляем возможные дубликаты из существующих таблиц
DELETE FROM doctor_specializations a USING (
  SELECT MIN(ctid) as ctid, name 
  FROM doctor_specializations 
  GROUP BY name HAVING COUNT(*) > 1
) b
WHERE a.name = b.name AND a.ctid <> b.ctid;

DELETE FROM medical_categories a USING (
  SELECT MIN(ctid) as ctid, name 
  FROM medical_categories 
  GROUP BY name HAVING COUNT(*) > 1
) b
WHERE a.name = b.name AND a.ctid <> b.ctid;

-- Добавляем уникальные ограничения
ALTER TABLE doctor_specializations ADD CONSTRAINT unique_specialization_name UNIQUE (name);
ALTER TABLE medical_categories ADD CONSTRAINT unique_category_name UNIQUE (name);

-- Создаем таблицу для московских специалистов
CREATE TABLE moscow_specialists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialization_id UUID REFERENCES doctor_specializations(id),
  experience_years INTEGER,
  education TEXT,
  workplace TEXT,
  rating DECIMAL(3,2) DEFAULT 0.00,
  reviews_count INTEGER DEFAULT 0,
  consultation_price INTEGER,
  phone TEXT,
  email TEXT,
  address TEXT,
  metro_station TEXT,
  working_hours TEXT,
  languages TEXT[],
  services TEXT[],
  achievements TEXT[],
  photo_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Создаем таблицу для отзывов о специалистах
CREATE TABLE specialist_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  specialist_id UUID REFERENCES moscow_specialists(id) ON DELETE CASCADE,
  patient_name TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  consultation_date DATE,
  is_verified BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Расширяем таблицу специализаций
ALTER TABLE doctor_specializations 
ADD COLUMN IF NOT EXISTS detailed_description TEXT,
ADD COLUMN IF NOT EXISTS health_areas TEXT[],
ADD COLUMN IF NOT EXISTS treatment_methods TEXT[],
ADD COLUMN IF NOT EXISTS typical_consultations TEXT[],
ADD COLUMN IF NOT EXISTS avg_consultation_duration INTEGER,
ADD COLUMN IF NOT EXISTS specialists_count INTEGER DEFAULT 0;

-- Вставляем расширенные данные специализаций
INSERT INTO doctor_specializations (name, description, required_education, common_conditions, detailed_description, health_areas, treatment_methods, typical_consultations, avg_consultation_duration) VALUES
('Кардиолог', 'Специалист по заболеваниям сердечно-сосудистой системы', 'Высшее медицинское образование, ординатура по кардиологии', ARRAY['Гипертония', 'Ишемическая болезнь сердца', 'Аритмия'], 'Кардиолог занимается диагностикой, лечением и профилактикой заболеваний сердца и сосудов. Специалист проводит комплексное обследование сердечно-сосудистой системы, назначает медикаментозное лечение, дает рекомендации по образу жизни.', ARRAY['Сердечно-сосудистая система', 'Артериальное давление', 'Холестерин'], ARRAY['Медикаментозная терапия', 'ЭКГ', 'УЗИ сердца', 'Холтер'], ARRAY['Диагностика боли в груди', 'Контроль давления', 'Профилактика инфаркта'], 45),

('Невролог', 'Специалист по заболеваниям нервной системы', 'Высшее медицинское образование, ординатура по неврологии', ARRAY['Мигрень', 'Остеохондроз', 'Инсульт'], 'Невролог диагностирует и лечит заболевания центральной и периферической нервной системы. Специализируется на головных болях, нарушениях сна, памяти, координации движений.', ARRAY['Головной мозг', 'Спинной мозг', 'Периферическая нервная система'], ARRAY['Медикаментозная терапия', 'Физиотерапия', 'МРТ диагностика'], ARRAY['Лечение головных болей', 'Диагностика инсульта', 'Реабилитация'], 40),

('Эндокринолог', 'Специалист по заболеваниям эндокринной системы', 'Высшее медицинское образование, ординатура по эндокринологии', ARRAY['Сахарный диабет', 'Заболевания щитовидной железы', 'Ожирение'], 'Эндокринолог занимается диагностикой и лечением нарушений гормональной системы, метаболических расстройств, помогает в вопросах контроля веса и репродуктивного здоровья.', ARRAY['Эндокринная система', 'Метаболизм', 'Гормональный баланс'], ARRAY['Гормональная терапия', 'Диетотерапия', 'УЗИ щитовидной железы'], ARRAY['Лечение диабета', 'Коррекция веса', 'Гормональные нарушения'], 50),

('Гастроэнтеролог', 'Специалист по заболеваниям ЖКТ', 'Высшее медицинское образование, ординатура по гастроэнтерологии', ARRAY['Гастрит', 'Язвенная болезнь', 'Панкреатит'], 'Гастроэнтеролог специализируется на диагностике и лечении заболеваний пищеварительной системы, включая желудок, кишечник, печень, поджелудочную железу.', ARRAY['Пищеварительная система', 'Печень', 'Поджелудочная железа'], ARRAY['Эндоскопия', 'УЗИ органов ЖКТ', 'Диетотерапия'], ARRAY['Лечение язв', 'Диагностика гепатита', 'Синдром раздраженного кишечника'], 45),

('Пульмонолог', 'Специалист по заболеваниям дыхательной системы', 'Высшее медицинское образование, ординатура по пульмонологии', ARRAY['Бронхиальная астма', 'Пневмония', 'ХОБЛ'], 'Пульмонолог занимается диагностикой и лечением заболеваний легких и дыхательных путей, проводит спирометрию, бронхоскопию.', ARRAY['Дыхательная система', 'Легкие', 'Бронхи'], ARRAY['Спирометрия', 'Бронхоскопия', 'КТ легких'], ARRAY['Лечение астмы', 'Диагностика пневмонии', 'Реабилитация'], 40),

('Дерматолог', 'Специалист по заболеваниям кожи', 'Высшее медицинское образование, ординатура по дерматологии', ARRAY['Акне', 'Псориаз', 'Экзема'], 'Дерматолог диагностирует и лечит заболевания кожи, волос, ногтей, проводит косметологические процедуры и профилактику онкологических заболеваний кожи.', ARRAY['Кожа', 'Волосы', 'Ногти'], ARRAY['Дерматоскопия', 'Биопсия', 'Лазерная терапия'], ARRAY['Лечение акне', 'Удаление новообразований', 'Косметология'], 30),

('Уролог', 'Специалист по заболеваниям мочеполовой системы', 'Высшее медицинское образование, ординатура по урологии', ARRAY['Простатит', 'Цистит', 'Мочекаменная болезнь'], 'Уролог занимается диагностикой и лечением заболеваний мочевыделительной системы и мужской репродуктивной системы.', ARRAY['Мочевыделительная система', 'Мужская репродуктивная система'], ARRAY['УЗИ почек', 'Цистоскопия', 'Урофлоуметрия'], ARRAY['Лечение простатита', 'Удаление камней', 'Мужское бесплодие'], 35),

('Гинеколог', 'Специалист по женскому здоровью', 'Высшее медицинское образование, ординатура по гинекологии', ARRAY['Эндометриоз', 'Миома матки', 'Воспалительные заболевания'], 'Гинеколог занимается диагностикой и лечением заболеваний женской репродуктивной системы, ведением беременности, планированием семьи.', ARRAY['Женская репродуктивная система', 'Беременность', 'Менопауза'], ARRAY['УЗИ органов малого таза', 'Кольпоскопия', 'Гистероскопия'], ARRAY['Профилактические осмотры', 'Планирование беременности', 'Лечение бесплодия'], 40)

ON CONFLICT (name) DO UPDATE SET
description = EXCLUDED.description,
detailed_description = EXCLUDED.detailed_description,
health_areas = EXCLUDED.health_areas,
treatment_methods = EXCLUDED.treatment_methods,
typical_consultations = EXCLUDED.typical_consultations,
avg_consultation_duration = EXCLUDED.avg_consultation_duration;

-- Добавляем московских специалистов
INSERT INTO moscow_specialists (name, specialization_id, experience_years, education, workplace, rating, reviews_count, consultation_price, phone, address, metro_station, working_hours, languages, services, bio) VALUES
('Иванов Алексей Петрович', (SELECT id FROM doctor_specializations WHERE name = 'Кардиолог'), 15, 'МГМУ им. Сеченова, к.м.н.', 'ГКБ им. Боткина', 4.8, 127, 3500, '+7 (495) 123-45-67', 'ул. Боткинский проезд, 5', 'Беговая', 'Пн-Пт 9:00-18:00', ARRAY['Русский', 'Английский'], ARRAY['ЭКГ', 'УЗИ сердца', 'Холтер'], 'Кардиолог высшей категории с 15-летним стажем. Специализируется на лечении ишемической болезни сердца и аритмий.'),

('Петрова Елена Сергеевна', (SELECT id FROM doctor_specializations WHERE name = 'Невролог'), 12, 'РНИМУ им. Пирогова, к.м.н.', 'НИИ неврологии', 4.9, 98, 4000, '+7 (495) 234-56-78', 'Волоколамское шоссе, 80', 'Сокол', 'Пн-Сб 8:00-19:00', ARRAY['Русский', 'Немецкий'], ARRAY['МРТ диагностика', 'Ботулинотерапия'], 'Невролог-эпилептолог, специалист по головным болям и нарушениям сна.'),

('Смирнов Дмитрий Владимирович', (SELECT id FROM doctor_specializations WHERE name = 'Эндокринолог'), 18, 'МГМУ им. Сеченова, д.м.н.', 'Эндокринологический центр', 4.7, 156, 3800, '+7 (495) 345-67-89', 'ул. Москворечье, 1', 'Каширская', 'Пн-Пт 9:00-17:00', ARRAY['Русский'], ARRAY['УЗИ щитовидной железы', 'Помповая инсулинотерапия'], 'Эндокринолог высшей категории, специалист по сахарному диабету и заболеваниям щитовидной железы.');

-- Обновляем категории без дублирования
INSERT INTO medical_categories (name, description, icon) VALUES
('Заболевания сердца', 'Информация о сердечно-сосудистых заболеваниях', 'Heart'),
('Неврологические расстройства', 'Заболевания нервной системы и головного мозга', 'Brain'),
('Эндокринные нарушения', 'Гормональные расстройства и метаболические заболевания', 'Activity'),
('Пищеварительная система', 'Заболевания желудочно-кишечного тракта', 'Stomach'),
('Дыхательная система', 'Болезни легких и дыхательных путей', 'Lungs')
ON CONFLICT (name) DO NOTHING;
