import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { sessionId, doctorDiagnosis } = await req.json();

    console.log('Starting diagnostic synthesis for session:', sessionId);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    if (!sessionId) {
      throw new Error('Session ID is required');
    }

    // Get user from session
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Get all AI analyses for this session
    const { data: aiAnalyses, error: analysesError } = await supabase
      .from('ai_diagnostic_analyses')
      .select('*')
      .eq('session_id', sessionId)
      .eq('analysis_status', 'completed');

    if (analysesError) {
      throw new Error(`Failed to fetch AI analyses: ${analysesError.message}`);
    }

    // Get session details
    const { data: session, error: sessionError } = await supabase
      .from('diagnostic_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError) {
      throw new Error(`Failed to fetch session: ${sessionError.message}`);
    }

    // Prepare comprehensive analysis prompt
    const systemPrompt = `Ты - ведущий специалист по медицинской диагностике с 25+ лет опыта.
    Твоя задача - синтезировать данные ИИ-анализа с диагнозом врача и создать персонализированные рекомендации.

    Ты работаешь в трех режимах:
    1. ПОДТВЕРЖДАЮЩИЙ - ИИ соглашается с врачом
    2. ДОПОЛНЯЮЩИЙ - ИИ находит дополнительные находки  
    3. ВОПРОСИТЕЛЬНЫЙ - ИИ видит несоответствия (деликатно!)

    Твой ответ должен быть в JSON формате:
    {
      "synthesis_type": "подтверждающий/дополняющий/вопросительный",
      "agreement_level": число от 0 до 1,
      "key_findings": {
        "ai_primary": ["основные находки ИИ"],
        "doctor_primary": "диагноз врача",
        "concordant": ["совпадающие моменты"],
        "discordant": ["расхождения, если есть"]
      },
      "personalized_recommendations": {
        "immediate_actions": ["немедленные действия"],
        "monitoring": ["что отслеживать"],
        "lifestyle": ["изменения образа жизни"],
        "follow_up": ["дальнейшее обследование"],
        "medications": ["медикаментозные рекомендации, если применимо"]
      },
      "risk_stratification": {
        "current_risk": "низкий/средний/высокий/критический",
        "risk_factors": ["выявленные факторы риска"],
        "protective_factors": ["защитные факторы"]
      },
      "educational_content": {
        "condition_explanation": "объяснение состояния пациенту",
        "warning_signs": ["на что обратить внимание"],
        "when_to_seek_help": "когда обращаться к врачу срочно"
      },
      "confidence_score": число от 0 до 1,
      "clinical_reasoning": "объяснение логики рекомендаций"
    }`;

    const aiAnalysisData = aiAnalyses.map(analysis => ({
      type: analysis.analysis_type,
      findings: analysis.ai_findings,
      confidence: analysis.confidence_score
    }));

    const userPrompt = `Проанализируй и синтезируй следующие данные:

    СЕССИЯ ДИАГНОСТИКИ:
    - Тип: ${session.session_type}
    - Описание: ${session.description || 'Не указано'}

    ИИ-АНАЛИЗЫ:
    ${JSON.stringify(aiAnalysisData, null, 2)}

    ДИАГНОЗ ВРАЧА:
    ${JSON.stringify(doctorDiagnosis, null, 2)}

    Создай персонализированный синтез с рекомендациями на русском языке.
    Учти специфику состояния, возможные коморбидности и индивидуальные факторы.
    Будь деликатен при указании на расхождения с врачебным диагнозом.`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.4,
        max_tokens: 3000
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const aiResponse = await response.json();
    const synthesisText = aiResponse.choices[0].message.content;

    // Parse synthesis result
    let synthesisData;
    try {
      synthesisData = JSON.parse(synthesisText);
    } catch (parseError) {
      console.log('Failed to parse synthesis as JSON, storing as text');
      synthesisData = {
        raw_synthesis: synthesisText,
        parsing_error: true,
        confidence_score: 0.5
      };
    }

    // Create synthesis analysis record
    const { data: synthesisRecord, error: synthesisError } = await supabase
      .from('ai_diagnostic_analyses')
      .insert({
        session_id: sessionId,
        user_id: user.id,
        analysis_type: 'synthesis',
        analysis_status: 'completed',
        input_data: { 
          ai_analyses: aiAnalysisData,
          doctor_diagnosis: doctorDiagnosis 
        },
        ai_findings: synthesisData,
        confidence_score: synthesisData.confidence_score || 0.8
      })
      .select()
      .single();

    if (synthesisError) {
      throw new Error(`Failed to create synthesis record: ${synthesisError.message}`);
    }

    // Generate comprehensive recommendations
    if (synthesisData.personalized_recommendations) {
      const recommendations = [];
      const recData = synthesisData.personalized_recommendations;

      // Immediate actions
      if (recData.immediate_actions) {
        recData.immediate_actions.forEach((action: string, index: number) => {
          recommendations.push({
            session_id: sessionId,
            user_id: user.id,
            recommendation_type: 'immediate',
            title: `Немедленное действие ${index + 1}`,
            description: action,
            priority: 'high',
            category: 'immediate_care',
            ai_generated: true
          });
        });
      }

      // Monitoring recommendations
      if (recData.monitoring) {
        recData.monitoring.forEach((monitor: string, index: number) => {
          recommendations.push({
            session_id: sessionId,
            user_id: user.id,
            recommendation_type: 'monitoring',
            title: `Мониторинг ${index + 1}`,
            description: monitor,
            priority: 'medium',
            category: 'monitoring',
            ai_generated: true
          });
        });
      }

      // Lifestyle recommendations
      if (recData.lifestyle) {
        recData.lifestyle.forEach((lifestyle: string, index: number) => {
          recommendations.push({
            session_id: sessionId,
            user_id: user.id,
            recommendation_type: 'lifestyle',
            title: `Образ жизни ${index + 1}`,
            description: lifestyle,
            priority: 'medium',
            category: 'lifestyle',
            ai_generated: true
          });
        });
      }

      if (recommendations.length > 0) {
        await supabase
          .from('diagnostic_recommendations')
          .insert(recommendations);
      }
    }

    console.log('Diagnostic synthesis completed successfully');

    return new Response(JSON.stringify({
      success: true,
      synthesis_id: synthesisRecord.id,
      synthesis: synthesisData,
      recommendations_created: synthesisData.personalized_recommendations ? 
        Object.values(synthesisData.personalized_recommendations).flat().length : 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in diagnostic synthesis:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});