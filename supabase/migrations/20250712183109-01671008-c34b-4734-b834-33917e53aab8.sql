-- Создание агрегированного представления для ИИ-анализа
CREATE OR REPLACE VIEW user_health_ai_profile AS
SELECT 
    -- Основная информация пользователя
    p.id as user_id,
    p.first_name,
    p.last_name,
    p.gender,
    p.height,
    p.weight,
    p.date_of_birth,
    CASE 
        WHEN p.date_of_birth IS NOT NULL 
        THEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.date_of_birth::date))
        ELSE NULL 
    END as age,
    CASE 
        WHEN p.height IS NOT NULL AND p.weight IS NOT NULL 
        THEN ROUND((p.weight / POWER(p.height / 100.0, 2))::numeric, 2)
        ELSE NULL 
    END as bmi,
    p.medical_conditions,
    p.allergies,
    p.medications,
    p.goals as profile_goals,
    
    -- Данные профиля здоровья (JSON)
    hp.profile_data as health_profile_data,
    hp.created_at as health_profile_created,
    
    -- Последние биомаркеры (агрегация)
    COALESCE(
        JSONB_AGG(
            JSONB_BUILD_OBJECT(
                'name', b.name,
                'value', b.value,
                'status', b.status,
                'reference_range', b.reference_range,
                'test_date', ma.created_at
            ) ORDER BY ma.created_at DESC
        ) FILTER (WHERE b.id IS NOT NULL), 
        '[]'::jsonb
    ) as biomarkers,
    
    -- Статистика по анализам
    COUNT(DISTINCT ma.id) as analyses_count,
    MAX(ma.created_at) as last_analysis_date,
    
    -- Средние метрики за последние 30 дней
    AVG(dhm.weight) FILTER (WHERE dhm.date >= CURRENT_DATE - INTERVAL '30 days') as avg_weight_30d,
    AVG(dhm.steps) FILTER (WHERE dhm.date >= CURRENT_DATE - INTERVAL '30 days') as avg_steps_30d,
    AVG(dhm.sleep_hours) FILTER (WHERE dhm.date >= CURRENT_DATE - INTERVAL '30 days') as avg_sleep_30d,
    AVG(dhm.exercise_minutes) FILTER (WHERE dhm.date >= CURRENT_DATE - INTERVAL '30 days') as avg_exercise_30d,
    AVG(dhm.stress_level) FILTER (WHERE dhm.date >= CURRENT_DATE - INTERVAL '30 days') as avg_stress_30d,
    AVG(dhm.mood_level) FILTER (WHERE dhm.date >= CURRENT_DATE - INTERVAL '30 days') as avg_mood_30d,
    AVG(dhm.water_intake) FILTER (WHERE dhm.date >= CURRENT_DATE - INTERVAL '30 days') as avg_water_30d,
    AVG(dhm.nutrition_quality) FILTER (WHERE dhm.date >= CURRENT_DATE - INTERVAL '30 days') as avg_nutrition_30d,
    COUNT(dhm.id) FILTER (WHERE dhm.date >= CURRENT_DATE - INTERVAL '30 days') as health_metrics_count_30d,
    
    -- Питание за последние 30 дней
    AVG(fe.calories) FILTER (WHERE fe.entry_date >= CURRENT_DATE - INTERVAL '30 days') as avg_calories_30d,
    AVG(fe.protein) FILTER (WHERE fe.entry_date >= CURRENT_DATE - INTERVAL '30 days') as avg_protein_30d,
    AVG(fe.carbs) FILTER (WHERE fe.entry_date >= CURRENT_DATE - INTERVAL '30 days') as avg_carbs_30d,
    AVG(fe.fat) FILTER (WHERE fe.entry_date >= CURRENT_DATE - INTERVAL '30 days') as avg_fat_30d,
    COUNT(DISTINCT fe.entry_date) FILTER (WHERE fe.entry_date >= CURRENT_DATE - INTERVAL '30 days') as nutrition_tracking_days_30d,
    
    -- Цели пользователя
    COALESCE(
        JSONB_AGG(
            JSONB_BUILD_OBJECT(
                'title', uhg.title,
                'goal_type', uhg.goal_type,
                'category', uhg.category,
                'priority', uhg.priority,
                'target_weight', uhg.target_weight,
                'target_steps', uhg.target_steps,
                'target_exercise_minutes', uhg.target_exercise_minutes,
                'target_sleep_hours', uhg.target_sleep_hours,
                'start_date', uhg.start_date,
                'end_date', uhg.end_date,
                'progress_percentage', uhg.progress_percentage,
                'is_active', uhg.is_active
            )
        ) FILTER (WHERE uhg.id IS NOT NULL AND uhg.is_active = true), 
        '[]'::jsonb
    ) as user_goals,
    
    -- Временные метки
    p.created_at as profile_created,
    p.updated_at as profile_updated

FROM profiles p
LEFT JOIN health_profiles hp ON p.id = hp.user_id
LEFT JOIN medical_analyses ma ON p.id = ma.user_id
LEFT JOIN biomarkers b ON ma.id = b.analysis_id
LEFT JOIN daily_health_metrics dhm ON p.id = dhm.user_id
LEFT JOIN food_entries fe ON p.id = fe.user_id
LEFT JOIN user_health_goals uhg ON p.id = uhg.user_id

GROUP BY 
    p.id, p.first_name, p.last_name, p.gender, p.height, p.weight, 
    p.date_of_birth, p.medical_conditions, p.allergies, p.medications, 
    p.goals, p.created_at, p.updated_at, hp.profile_data, hp.created_at;

-- Создание индексов для оптимизации
CREATE INDEX IF NOT EXISTS idx_medical_analyses_user_date ON medical_analyses(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_biomarkers_analysis_id ON biomarkers(analysis_id);
CREATE INDEX IF NOT EXISTS idx_daily_health_metrics_user_date ON daily_health_metrics(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_food_entries_user_date ON food_entries(user_id, entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_user_health_goals_user_active ON user_health_goals(user_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_health_profiles_user_id ON health_profiles(user_id);