
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MedicalAnalysisRequest {
  text?: string;
  imageBase64?: string;
  analysisType: string;
  userId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API ключ не настроен');
    }

    const { text, imageBase64, analysisType, userId }: MedicalAnalysisRequest = await req.json();

    if (!text && !imageBase64) {
      throw new Error('Необходим текст или изображение для анализа');
    }

    if (!userId) {
      throw new Error('Не указан пользователь');
    }

    let messages = [];
    
    const systemPrompt = `Вы - высококвалифицированный медицинский специалист и ИИ-помощник, специализирующийся на анализе всех типов лабораторных исследований.

ТИП АНАЛИЗА: ${analysisType}

МЕДИЦИНСКИЕ ЗНАНИЯ:
- Глубокие знания в области клинической лабораторной диагностики
- Знание нормальных референсных значений для всех биомаркеров
- Понимание взаимосвязей между различными показателями
- Экспертиза в анализе крови, мочи, биохимии, гормонов, витаминов и других исследований

РЕФЕРЕНСНЫЕ ЗНАЧЕНИЯ для разных типов анализов:
- Анализ крови: Гемоглобин (муж 130-170 г/л, жен 120-150 г/л), Эритроциты (муж 4.0-5.5×10¹²/л, жен 3.5-5.0×10¹²/л)
- Анализ мочи: Белок (до 0.033 г/л), Глюкоза (отсутствует), Лейкоциты (до 3 в п/з)
- Биохимия: Глюкоза (3.3-5.5 ммоль/л), АЛТ/АСТ (до 35/45 Ед/л), Креатинин (53-115 мкмоль/л)
- Гормоны: ТТГ (0.4-4.0 мЕд/л), Т4 св (10.8-22.0 пмоль/л), Тестостерон (муж 8.6-29.0 нмоль/л)

Отвечайте ТОЛЬКО в формате JSON:
{
  "analysisType": "${analysisType}",
  "markers": [
    {
      "name": "Название показателя",
      "value": "Значение с единицами",
      "normalRange": "Нормальный диапазон",
      "status": "normal|high|low",
      "recommendation": "Детальная рекомендация"
    }
  ],
  "supplements": [
    {
      "name": "Название добавки/препарата",
      "reason": "Медицинское обоснование",
      "dosage": "Рекомендуемая дозировка"
    }
  ],
  "generalRecommendation": "Общая медицинская рекомендация",
  "riskLevel": "low|medium|high",
  "followUpTests": ["Список рекомендуемых дополнительных анализов"],
  "summary": "Краткое резюме состояния здоровья"
}

ВАЖНО:
- Определяйте тип анализа из контекста если не указан явно
- Предоставляйте точные медицинские рекомендации
- При серьезных отклонениях рекомендуйте консультацию врача
- Учитывайте взаимосвязи между показателями

Не включайте никакой текст вне JSON структуры.`;

    if (text) {
      messages = [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Проанализируйте следующие результаты медицинского анализа:

ТИП: ${analysisType}
РЕЗУЛЬТАТЫ:
${text}

Предоставьте полный медицинский анализ в требуемом JSON формате.`
        }
      ];
    } else if (imageBase64) {
      messages = [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: `Проанализируй этот медицинский анализ типа "${analysisType}". Определи все показатели, их значения и нормальные диапазоны. Дай конкретные медицинские рекомендации. Ответь строго в JSON формате согласно системной инструкции.` 
            },
            { 
              type: "image_url", 
              image_url: { url: imageBase64 } 
            }
          ]
        }
      ];
    }

    console.log("Отправляем запрос в OpenAI для анализа:", analysisType);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: messages,
        temperature: 0.3,
        max_tokens: 4000,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log("Получен ответ от OpenAI");
    
    try {
      const parsedResponse = JSON.parse(aiResponse);
      
      // Валидация структуры ответа
      if (!parsedResponse.markers || !Array.isArray(parsedResponse.markers)) {
        throw new Error("Invalid response structure: missing markers array");
      }
      
      // Нормализация данных
      parsedResponse.markers = parsedResponse.markers.map(marker => ({
        name: marker.name || "Неизвестный показатель",
        value: marker.value || "Не указано",
        normalRange: marker.normalRange || "Не указан",
        status: marker.status || "normal",
        recommendation: marker.recommendation || "Рекомендации не предоставлены"
      }));
      
      if (!parsedResponse.supplements) {
        parsedResponse.supplements = [];
      }
      
      if (!parsedResponse.generalRecommendation) {
        parsedResponse.generalRecommendation = "Рекомендуется консультация с врачом для детального обсуждения результатов.";
      }

      if (!parsedResponse.riskLevel) {
        parsedResponse.riskLevel = "low";
      }

      if (!parsedResponse.followUpTests) {
        parsedResponse.followUpTests = [];
      }

      if (!parsedResponse.summary) {
        parsedResponse.summary = "Анализ обработан успешно.";
      }

      // Сохранение результата в базу данных
      const analysisRecord = {
        user_id: userId,
        analysis_type: analysisType,
        results: parsedResponse,
        created_at: new Date().toISOString()
      };

      const { data: savedAnalysis, error: saveError } = await supabase
        .from('medical_analyses')
        .insert(analysisRecord)
        .select()
        .single();

      if (saveError) {
        console.error('Ошибка сохранения анализа:', saveError);
        // Не блокируем ответ, но логируем ошибку
      } else {
        console.log('Анализ успешно сохранен:', savedAnalysis.id);
        parsedResponse.analysisId = savedAnalysis.id;
      }
      
      return new Response(JSON.stringify(parsedResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error("Ошибка парсинга ответа ИИ:", parseError);
      
      const fallbackResponse = {
        analysisType: analysisType,
        markers: [{
          name: "Общий анализ",
          value: "Данные обработаны частично",
          normalRange: "Не удалось определить",
          status: "normal",
          recommendation: "Рекомендуется повторить анализ или ввести данные вручную для более точного результата."
        }],
        supplements: [],
        generalRecommendation: "Произошла ошибка при анализе данных. Пожалуйста, попробуйте еще раз с более четким изображением или введите данные вручную.",
        riskLevel: "low",
        followUpTests: [],
        summary: "Ошибка обработки данных"
      };
      
      return new Response(JSON.stringify(fallbackResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Ошибка в функции analyze-medical-test:', error);
    
    let errorMessage = "Произошла ошибка при анализе";
    if (error.message?.includes('API key')) {
      errorMessage = "Ошибка API ключа OpenAI. Пожалуйста, проверьте настройки.";
    } else if (error.message?.includes('quota')) {
      errorMessage = "Превышен лимит запросов к OpenAI. Попробуйте позже.";
    }
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
