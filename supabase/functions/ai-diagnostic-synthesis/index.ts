import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId, doctorDiagnosis, patientData } = await req.json();

    // Инициализируем Supabase клиент
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Получаем пользователя
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Получаем данные пациента из сессии
    const { data: sessionData, error: sessionError } = await supabase
      .from('diagnostic_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError) {
      throw new Error(`Ошибка получения данных сессии: ${sessionError.message}`);
    }

    // Получаем файлы и анализы ЭКГ
    const { data: files } = await supabase
      .from('diagnostic_files')
      .select('*')
      .eq('session_id', sessionId);

    const { data: ecgRecords } = await supabase
      .from('ecg_records')
      .select('*')
      .eq('session_id', sessionId);

    // Получаем данные профиля пользователя
    const { data: userProfile } = await supabase
      .from('user_health_ai_profile')
      .select('*')
      .eq('user_id', sessionData.user_id)
      .single();

    // Получаем биомаркеры пользователя
    const { data: biomarkers } = await supabase
      .from('biomarker_history')
      .select('*')
      .eq('user_id', sessionData.user_id)
      .order('created_at', { ascending: false })
      .limit(20);

    console.log(`Анализ диагноза для сессии: ${sessionId}`);
    console.log(`Диагноз врача: ${doctorDiagnosis}`);

    // Формируем контекст для ИИ анализа
    const analysisContext = {
      sessionInfo: sessionData,
      files: files || [],
      ecgData: ecgRecords || [],
      userProfile: userProfile || {},
      recentBiomarkers: biomarkers || [],
      patientData: patientData || {}
    };

    // Вызываем Anthropic API для синтеза
    const anthropicResponse = await callAnthropicAPI(doctorDiagnosis, analysisContext);

    if (!anthropicResponse) {
      throw new Error('Не удалось получить анализ от ИИ');
    }

    // Определяем тип синтеза на основе анализа ИИ
    const synthesisType = determineSynthesisType(anthropicResponse, doctorDiagnosis);

    // Сохраняем результат синтеза
    const { data: synthesis, error: synthesisError } = await supabase
      .from('diagnostic_synthesis')
      .insert({
        session_id: sessionId,
        user_id: sessionData.user_id,
        doctor_diagnosis: doctorDiagnosis,
        ai_analysis: anthropicResponse.analysis,
        synthesis_type: synthesisType,
        confidence_score: anthropicResponse.confidence_score,
        agreements: anthropicResponse.agreements,
        discrepancies: anthropicResponse.discrepancies,
        recommendations: anthropicResponse.recommendations,
        follow_up_actions: anthropicResponse.follow_up_actions
      })
      .select()
      .single();

    if (synthesisError) {
      throw new Error(`Ошибка сохранения синтеза: ${synthesisError.message}`);
    }

    // Сохраняем детальные рекомендации
    if (anthropicResponse.detailed_recommendations && anthropicResponse.detailed_recommendations.length > 0) {
      const recommendations = anthropicResponse.detailed_recommendations.map((rec: any) => ({
        synthesis_id: synthesis.id,
        category: rec.category,
        recommendation_text: rec.text,
        priority: rec.priority,
        evidence_level: rec.evidence_level,
        personalization_factors: rec.personalization_factors,
        target_values: rec.target_values,
        monitoring_schedule: rec.monitoring_schedule,
        contraindications: rec.contraindications
      }));

      await supabase
        .from('diagnosis_recommendations')
        .insert(recommendations);
    }

    return new Response(JSON.stringify({
      synthesis,
      analysis: anthropicResponse,
      synthesis_type: synthesisType
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Ошибка в ai-diagnostic-synthesis:', error);
    return new Response(JSON.stringify({ 
      error: 'Внутренняя ошибка сервера', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function callAnthropicAPI(doctorDiagnosis: string, context: any, attempt = 1): Promise<any> {
  const maxAttempts = 3;
  
  try {
    console.log(`Вызов Anthropic API (попытка ${attempt})`);
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: `Ты - экспертная система медицинской диагностики. Проанализируй диагноз врача и данные пациента.

ДИАГНОЗ ВРАЧА: "${doctorDiagnosis}"

ДАННЫЕ ПАЦИЕНТА:
${JSON.stringify(context, null, 2)}

Выполни диагностический синтез и верни результат в JSON формате:

{
  "analysis": {
    "ai_findings": ["Находки ИИ на основе данных"],
    "data_analysis": "Анализ представленных данных",
    "risk_factors": ["Выявленные факторы риска"],
    "missing_data": ["Какие данные недостают для полной оценки"]
  },
  "confidence_score": 85.5,
  "agreements": [
    {
      "point": "С чем согласен ИИ",
      "evidence": "Обоснование согласия",
      "strength": "high|medium|low"
    }
  ],
  "discrepancies": [
    {
      "point": "Где есть расхождения",
      "ai_perspective": "Точка зрения ИИ",
      "concern_level": "high|medium|low",
      "suggestion": "Что предлагает ИИ"
    }
  ],
  "recommendations": {
    "immediate": ["Немедленные действия"],
    "monitoring": ["Что нужно мониторить"],
    "investigations": ["Дополнительные исследования"],
    "lifestyle": ["Рекомендации по образу жизни"]
  },
  "follow_up_actions": [
    {
      "action": "Описание действия",
      "timeframe": "Временные рамки",
      "priority": "critical|high|medium|low"
    }
  ],
  "detailed_recommendations": [
    {
      "category": "medication|lifestyle|monitoring|follow_up",
      "text": "Детальная рекомендация",
      "priority": "critical|high|medium|low",
      "evidence_level": "A|B|C|D",
      "personalization_factors": {},
      "target_values": {},
      "monitoring_schedule": "График мониторинга",
      "contraindications": ["Противопоказания"]
    }
  ]
}

ВАЖНО:
- Будь тактичным при указании на расхождения
- Учитывай индивидуальные особенности пациента
- Предлагай конкретные, выполнимые рекомендации
- Указывай уровень доказательности для каждой рекомендации
- Персонализируй советы под конкретного пациента`
        }]
      })
    });

    console.log(`Статус ответа Anthropic API (попытка ${attempt}): ${response.status}`);

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Ошибка Anthropic API (попытка ${attempt}): ${response.status} ${errorData}`);
      
      if (attempt < maxAttempts) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Ожидание ${delay}мс перед повторной попыткой...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return callAnthropicAPI(doctorDiagnosis, context, attempt + 1);
      }
      
      throw new Error(`Anthropic API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    console.log('Успешный ответ от Anthropic API');
    
    const content = data.content[0]?.text;
    if (!content) {
      throw new Error('Пустой ответ от Anthropic API');
    }

    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.error('Ошибка парсинга JSON от Anthropic:', parseError);
      throw new Error('Ошибка парсинга ответа ИИ');
    }

  } catch (error) {
    console.error(`Попытка ${attempt} неудачна:`, error);
    
    if (attempt < maxAttempts) {
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Ожидание ${delay}мс перед повторной попыткой...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return callAnthropicAPI(doctorDiagnosis, context, attempt + 1);
    }
    
    throw error;
  }
}

function determineSynthesisType(aiAnalysis: any, doctorDiagnosis: string): string {
  const discrepanciesCount = aiAnalysis.discrepancies?.length || 0;
  const agreementsCount = aiAnalysis.agreements?.length || 0;
  const confidenceScore = aiAnalysis.confidence_score || 0;

  // Вопросительный анализ - если есть серьезные расхождения
  if (discrepanciesCount > 0) {
    const highConcernDiscrepancies = aiAnalysis.discrepancies.filter(
      (d: any) => d.concern_level === 'high'
    ).length;
    
    if (highConcernDiscrepancies > 0 || confidenceScore < 60) {
      return 'questioning';
    }
  }

  // Дополняющий анализ - если есть дополнительные находки
  if (aiAnalysis.analysis?.ai_findings?.length > 0 || 
      aiAnalysis.recommendations?.investigations?.length > 0) {
    return 'complementing';
  }

  // Подтверждающий анализ - если в основном согласие
  if (agreementsCount > discrepanciesCount && confidenceScore >= 70) {
    return 'confirming';
  }

  return 'complementing'; // по умолчанию
}