import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, sessionId, includeProfile = true, includeBiomarkers = true } = await req.json();

    if (!userId) {
      throw new Error('User ID is required');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Generating smart recommendations for user:', userId);

    // Fetch user's diagnostic session data
    let sessionData = null;
    if (sessionId) {
      const { data: session } = await supabase
        .from('diagnostic_sessions')
        .select(`
          *,
          ai_diagnostic_analyses(*),
          doctor_diagnoses(*),
          ecg_records(*)
        `)
        .eq('id', sessionId)
        .eq('user_id', userId)
        .single();
      sessionData = session;
    }

    // Fetch user's health profile
    let profileData = null;
    if (includeProfile) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      const { data: healthProfile } = await supabase
        .from('health_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      profileData = { profile, healthProfile };
    }

    // Fetch recent biomarkers
    let biomarkersData = null;
    if (includeBiomarkers) {
      const { data: biomarkers } = await supabase
        .from('biomarker_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);
      biomarkersData = biomarkers;
    }

    // Fetch recent health metrics
    const { data: healthMetrics } = await supabase
      .from('daily_health_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(30);

    // Fetch existing recommendations to avoid duplicates
    const { data: existingRecommendations } = await supabase
      .from('diagnostic_recommendations')
      .select('title, description')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    // Prepare context for AI
    const context = {
      session: sessionData,
      profile: profileData,
      biomarkers: biomarkersData,
      healthMetrics: healthMetrics?.slice(0, 7), // Last 7 days
      existingRecommendations: existingRecommendations?.map(r => ({ title: r.title, description: r.description }))
    };

    console.log('Context prepared, calling OpenAI API...');

    // Generate recommendations using OpenAI
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: `Вы - персональный помощник врача и эксперт по превентивной медицине. Ваша задача - генерировать персонализированные медицинские рекомендации на основе диагностических данных пациента.

ВАЖНЫЕ ПРИНЦИПЫ:
1. Безопасность превыше всего - никогда не ставьте диагнозы
2. Рекомендации должны быть основаны на доказательной медицине
3. Всегда рекомендуйте консультацию с врачом при серьезных отклонениях
4. Используйте только проверенные медицинские источники
5. Учитывайте индивидуальные особенности пациента

ТИПЫ РЕКОМЕНДАЦИЙ:
- medication: лекарственные препараты (только безрецептурные)
- lifestyle: изменения образа жизни
- monitoring: мониторинг показателей
- procedure: медицинские процедуры
- referral: направление к специалистам

ПРИОРИТЕТЫ:
- urgent: требует немедленного внимания врача
- high: важно, рекомендуется скорая консультация
- medium: стандартные рекомендации
- low: профилактические меры

Отвечайте ТОЛЬКО в формате JSON без дополнительного текста.`
          },
          {
            role: 'user',
            content: `Проанализируйте данные пациента и создайте персонализированные медицинские рекомендации:

КОНТЕКСТ: ${JSON.stringify(context, null, 2)}

Создайте 3-8 конкретных, персонализированных рекомендаций в формате JSON:
{
  "recommendations": [
    {
      "title": "Краткое название рекомендации",
      "description": "Детальное описание с обоснованием",
      "type": "medication|lifestyle|monitoring|procedure|referral",
      "priority": "urgent|high|medium|low",
      "category": "кардиология|эндокринология|общая медицина|профилактика|питание|физическая активность",
      "reasoning": "Медицинское обоснование на основе данных",
      "implementation_steps": [
        "Конкретный шаг 1",
        "Конкретный шаг 2"
      ],
      "contraindications": "Возможные противопоказания",
      "expected_outcome": "Ожидаемый результат",
      "monitoring_schedule": "Когда оценивать эффективность"
    }
  ],
  "medical_alerts": [
    {
      "type": "warning|info|critical",
      "message": "Важная медицинская информация",
      "action_required": "Что должен сделать пациент"
    }
  ],
  "summary": "Общая оценка состояния и приоритетные направления"
}`
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`OpenAI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0].message.content;

    console.log('AI Response received, parsing...');

    let recommendationsData;
    try {
      recommendationsData = JSON.parse(aiContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback to basic recommendations
      recommendationsData = {
        recommendations: [
          {
            title: "Регулярные медицинские осмотры",
            description: "Рекомендуется проходить профилактические осмотры у терапевта каждые 6-12 месяцев для раннего выявления возможных проблем со здоровьем.",
            type: "monitoring",
            priority: "medium",
            category: "профилактика",
            reasoning: "Основано на стандартах профилактической медицины",
            implementation_steps: [
              "Записаться на прием к терапевту",
              "Подготовить список текущих жалоб и симптомов",
              "Принести результаты предыдущих анализов"
            ],
            contraindications: "Нет противопоказаний",
            expected_outcome: "Раннее выявление и профилактика заболеваний",
            monitoring_schedule: "Каждые 6-12 месяцев"
          }
        ],
        medical_alerts: [],
        summary: "Базовые рекомендации по поддержанию здоровья"
      };
    }

    // Save recommendations to database
    const recommendationsToSave = recommendationsData.recommendations.map((rec: any) => ({
      session_id: sessionId,
      user_id: userId,
      recommendation_type: rec.type || 'lifestyle',
      title: rec.title,
      description: rec.description,
      priority: rec.priority || 'medium',
      category: rec.category || 'общая медицина',
      ai_generated: true,
      doctor_approved: null,
      implementation_status: 'pending'
    }));

    if (recommendationsToSave.length > 0) {
      const { error: saveError } = await supabase
        .from('diagnostic_recommendations')
        .insert(recommendationsToSave);

      if (saveError) {
        console.error('Error saving recommendations:', saveError);
      } else {
        console.log(`Saved ${recommendationsToSave.length} recommendations`);
      }
    }

    // Also save to ai_recommendations table for analytics
    const aiRecommendationsToSave = recommendationsData.recommendations.map((rec: any) => ({
      user_id: userId,
      recommendation_type: rec.type || 'lifestyle',
      title: rec.title,
      content: rec.description,
      priority: rec.priority || 'medium',
      source_data: {
        reasoning: rec.reasoning,
        implementation_steps: rec.implementation_steps,
        contraindications: rec.contraindications,
        expected_outcome: rec.expected_outcome,
        monitoring_schedule: rec.monitoring_schedule,
        category: rec.category,
        session_id: sessionId
      }
    }));

    if (aiRecommendationsToSave.length > 0) {
      await supabase
        .from('ai_recommendations')
        .insert(aiRecommendationsToSave);
    }

    console.log('Smart recommendations generated successfully');

    return new Response(JSON.stringify({
      success: true,
      recommendations: recommendationsData.recommendations,
      medical_alerts: recommendationsData.medical_alerts || [],
      summary: recommendationsData.summary,
      generated_at: new Date().toISOString(),
      total_recommendations: recommendationsData.recommendations.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-smart-recommendations function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      recommendations: [],
      medical_alerts: [{
        type: 'info',
        message: 'Временно недоступно генерация рекомендаций. Обратитесь к врачу за персональными советами.',
        action_required: 'Запланировать консультацию с медицинским специалистом'
      }]
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});