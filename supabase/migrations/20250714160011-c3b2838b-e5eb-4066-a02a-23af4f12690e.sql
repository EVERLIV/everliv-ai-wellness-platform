-- Удаляем старую view с SECURITY DEFINER
DROP VIEW IF EXISTS public.user_health_ai_profile;

-- Создаем новую view без SECURITY DEFINER (по умолчанию будет SECURITY INVOKER)
CREATE VIEW public.user_health_ai_profile AS
SELECT p.id AS user_id,
    p.first_name,
    p.last_name,
    p.gender,
    p.height,
    p.weight,
    p.date_of_birth,
        CASE
            WHEN p.date_of_birth IS NOT NULL THEN EXTRACT(year FROM age(CURRENT_DATE::timestamp with time zone, p.date_of_birth::date::timestamp with time zone))
            ELSE NULL::numeric
        END AS age,
        CASE
            WHEN p.height IS NOT NULL AND p.weight IS NOT NULL THEN round(p.weight / power(p.height / 100.0, 2::numeric), 2)
            ELSE NULL::numeric
        END AS bmi,
    p.medical_conditions,
    p.allergies,
    p.medications,
    p.goals AS profile_goals,
    hp.profile_data AS health_profile_data,
    hp.created_at AS health_profile_created,
    COALESCE(jsonb_agg(jsonb_build_object('name', b.name, 'value', b.value, 'status', b.status, 'reference_range', b.reference_range, 'test_date', ma.created_at) ORDER BY ma.created_at DESC) FILTER (WHERE b.id IS NOT NULL), '[]'::jsonb) AS biomarkers,
    count(DISTINCT ma.id) AS analyses_count,
    max(ma.created_at) AS last_analysis_date,
    avg(dhm.weight) FILTER (WHERE dhm.date >= (CURRENT_DATE - '30 days'::interval)) AS avg_weight_30d,
    avg(dhm.steps) FILTER (WHERE dhm.date >= (CURRENT_DATE - '30 days'::interval)) AS avg_steps_30d,
    avg(dhm.sleep_hours) FILTER (WHERE dhm.date >= (CURRENT_DATE - '30 days'::interval)) AS avg_sleep_30d,
    avg(dhm.exercise_minutes) FILTER (WHERE dhm.date >= (CURRENT_DATE - '30 days'::interval)) AS avg_exercise_30d,
    avg(dhm.stress_level) FILTER (WHERE dhm.date >= (CURRENT_DATE - '30 days'::interval)) AS avg_stress_30d,
    avg(dhm.mood_level) FILTER (WHERE dhm.date >= (CURRENT_DATE - '30 days'::interval)) AS avg_mood_30d,
    avg(dhm.water_intake) FILTER (WHERE dhm.date >= (CURRENT_DATE - '30 days'::interval)) AS avg_water_30d,
    avg(dhm.nutrition_quality) FILTER (WHERE dhm.date >= (CURRENT_DATE - '30 days'::interval)) AS avg_nutrition_30d,
    count(dhm.id) FILTER (WHERE dhm.date >= (CURRENT_DATE - '30 days'::interval)) AS health_metrics_count_30d,
    avg(fe.calories) FILTER (WHERE fe.entry_date >= (CURRENT_DATE - '30 days'::interval)) AS avg_calories_30d,
    avg(fe.protein) FILTER (WHERE fe.entry_date >= (CURRENT_DATE - '30 days'::interval)) AS avg_protein_30d,
    avg(fe.carbs) FILTER (WHERE fe.entry_date >= (CURRENT_DATE - '30 days'::interval)) AS avg_carbs_30d,
    avg(fe.fat) FILTER (WHERE fe.entry_date >= (CURRENT_DATE - '30 days'::interval)) AS avg_fat_30d,
    count(DISTINCT fe.entry_date) FILTER (WHERE fe.entry_date >= (CURRENT_DATE - '30 days'::interval)) AS nutrition_tracking_days_30d,
    COALESCE(jsonb_agg(jsonb_build_object('title', uhg.title, 'goal_type', uhg.goal_type, 'category', uhg.category, 'priority', uhg.priority, 'target_weight', uhg.target_weight, 'target_steps', uhg.target_steps, 'target_exercise_minutes', uhg.target_exercise_minutes, 'target_sleep_hours', uhg.target_sleep_hours, 'start_date', uhg.start_date, 'end_date', uhg.end_date, 'progress_percentage', uhg.progress_percentage, 'is_active', uhg.is_active)) FILTER (WHERE uhg.id IS NOT NULL AND uhg.is_active = true), '[]'::jsonb) AS user_goals,
    p.created_at AS profile_created,
    p.updated_at AS profile_updated
   FROM profiles p
     LEFT JOIN health_profiles hp ON p.id = hp.user_id
     LEFT JOIN medical_analyses ma ON p.id = ma.user_id
     LEFT JOIN biomarkers b ON ma.id = b.analysis_id
     LEFT JOIN daily_health_metrics dhm ON p.id = dhm.user_id
     LEFT JOIN food_entries fe ON p.id = fe.user_id
     LEFT JOIN user_health_goals uhg ON p.id = uhg.user_id
  GROUP BY p.id, p.first_name, p.last_name, p.gender, p.height, p.weight, p.date_of_birth, p.medical_conditions, p.allergies, p.medications, p.goals, p.created_at, p.updated_at, hp.profile_data, hp.created_at;