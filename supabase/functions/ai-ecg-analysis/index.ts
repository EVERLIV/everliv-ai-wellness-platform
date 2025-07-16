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
    const { sessionId, fileUrl, analysisType = 'ecg' } = await req.json();

    console.log('Starting ECG analysis for session:', sessionId, 'file:', fileUrl);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    if (!sessionId || !fileUrl) {
      throw new Error('Session ID and file URL are required');
    }

    // Get user from session
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Create AI analysis record
    const { data: analysisRecord, error: analysisError } = await supabase
      .from('ai_diagnostic_analyses')
      .insert({
        session_id: sessionId,
        user_id: user.id,
        analysis_type: analysisType,
        analysis_status: 'processing',
        input_data: { file_url: fileUrl }
      })
      .select()
      .single();

    if (analysisError) {
      throw new Error(`Failed to create analysis record: ${analysisError.message}`);
    }

    // Prepare prompt for ECG analysis
    const systemPrompt = `Ты - опытный кардиолог с 20+ лет опыта в интерпретации ЭКГ. 
    Проанализируй загруженное изображение или данные ЭКГ и предоставь детальный медицинский анализ.

    Твой ответ должен быть в формате JSON со следующими полями:
    {
      "rhythm_analysis": {
        "rhythm_type": "синусовый/мерцательная аритмия/трепетание предсердий/другое",
        "heart_rate": число (уд/мин),
        "regularity": "регулярный/нерегулярный"
      },
      "intervals": {
        "pr_interval": "нормальный/укороченный/удлиненный",
        "qrs_duration": "нормальная/расширенная",
        "qt_interval": "нормальный/укороченный/удлиненный"
      },
      "morphology": {
        "p_waves": "описание морфологии зубцов P",
        "qrs_complex": "описание комплекса QRS",
        "t_waves": "описание зубцов T"
      },
      "pathological_findings": [
        "список выявленных патологических изменений"
      ],
      "clinical_interpretation": "общая клиническая интерпретация",
      "recommendations": [
        "список рекомендаций по дальнейшему обследованию/лечению"
      ],
      "risk_assessment": {
        "level": "низкий/средний/высокий",
        "factors": ["факторы риска"]
      },
      "confidence_score": число от 0 до 1
    }

    Если изображение неясное или данные неполные, укажи это в анализе и снизь confidence_score.`;

    const userPrompt = `Проанализируй эту ЭКГ. Файл находится по адресу: ${fileUrl}
    
    Обрати особое внимание на:
    1. Ритм и частоту сердечных сокращений
    2. Интервалы и сегменты
    3. Морфологию зубцов и комплексов
    4. Признаки ишемии, гипертрофии или нарушений проводимости
    5. Аритмии любого типа
    
    Предоставь детальный анализ на русском языке.`;

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
        temperature: 0.3,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const aiResponse = await response.json();
    const analysisText = aiResponse.choices[0].message.content;

    // Try to parse JSON response
    let aiFindings;
    try {
      aiFindings = JSON.parse(analysisText);
    } catch (parseError) {
      console.log('Failed to parse AI response as JSON, storing as text');
      aiFindings = {
        raw_analysis: analysisText,
        parsing_error: true,
        confidence_score: 0.5
      };
    }

    // Update analysis record with results
    const { error: updateError } = await supabase
      .from('ai_diagnostic_analyses')
      .update({
        ai_findings: aiFindings,
        confidence_score: aiFindings.confidence_score || 0.7,
        analysis_status: 'completed'
      })
      .eq('id', analysisRecord.id);

    if (updateError) {
      throw new Error(`Failed to update analysis: ${updateError.message}`);
    }

    // Update ECG record if exists
    if (analysisType === 'ecg' && aiFindings.rhythm_analysis) {
      await supabase
        .from('ecg_records')
        .update({
          analysis_status: 'completed',
          heart_rate: aiFindings.rhythm_analysis.heart_rate,
          rhythm_type: aiFindings.rhythm_analysis.rhythm_type,
          intervals: aiFindings.intervals
        })
        .eq('session_id', sessionId)
        .eq('file_url', fileUrl);
    }

    // Generate recommendations based on findings
    if (aiFindings.recommendations && Array.isArray(aiFindings.recommendations)) {
      const recommendations = aiFindings.recommendations.map((rec: string, index: number) => ({
        session_id: sessionId,
        user_id: user.id,
        recommendation_type: 'medical',
        title: `Рекомендация ${index + 1}`,
        description: rec,
        priority: aiFindings.risk_assessment?.level === 'высокий' ? 'high' : 'medium',
        category: 'cardiology',
        ai_generated: true
      }));

      await supabase
        .from('diagnostic_recommendations')
        .insert(recommendations);
    }

    console.log('ECG analysis completed successfully');

    return new Response(JSON.stringify({
      success: true,
      analysis_id: analysisRecord.id,
      findings: aiFindings
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI ECG analysis:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});