
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BloodAnalysisRequest {
  text?: string;
  imageBase64?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API ключ не настроен');
    }

    const { text, imageBase64 }: BloodAnalysisRequest = await req.json();

    if (!text && !imageBase64) {
      throw new Error('Необходим текст или изображение для анализа');
    }

    let messages = [];
    
    const systemPrompt = `Вы - высококвалифицированный медицинский лаборант и ИИ-помощник, специализирующийся на анализе результатов лабораторных исследований крови с расширенными возможностями OCR и интерпретации биомаркеров.

РАСШИРЕННЫЕ OCR ВОЗМОЖНОСТИ:
- Распознавание различных форматов лабораторий (Инвитро, Гемотест, CMD, KDL, местные лаборатории)
- Обработка рукописных записей врачей
- Распознавание таблиц, списков и различных макетов
- Извлечение данных из PDF-сканов и фотографий низкого качества
- Обработка многостраничных результатов

РАСШИРЕННАЯ БАЗА БИОМАРКЕРОВ:
Основные показатели:
- Гемоглобин: мужчины 130-170 г/л, женщины 120-150 г/л
- Эритроциты: мужчины 4.0-5.5×10¹²/л, женщины 3.5-5.0×10¹²/л
- Лейкоциты: 4.0-9.0×10⁹/л
- Тромбоциты: 150-400×10⁹/л
- Гематокрит: мужчины 40-48%, женщины 36-42%

Биохимические показатели:
- Глюкоза: 3.3-5.5 ммоль/л (натощак)
- Общий белок: 65-85 г/л
- Альбумин: 35-50 г/л
- АЛТ: до 35 Ед/л (женщины), до 45 Ед/л (мужчины)
- АСТ: до 35 Ед/л (женщины), до 45 Ед/л (мужчины)
- Билирубин общий: 8.5-20.5 мкмоль/л
- Креатинин: 53-97 мкмоль/л (женщины), 62-115 мкмоль/л (мужчины)
- Мочевина: 2.5-6.4 ммоль/л
- Мочевая кислота: 150-350 мкмоль/л (женщины), 210-420 мкмоль/л (мужчины)

Липидный профиль:
- Холестерин общий: <5.2 ммоль/л
- ЛПНП: <3.0 ммоль/л
- ЛПВП: >1.0 ммоль/л (мужчины), >1.2 ммоль/л (женщины)
- Триглицериды: <1.7 ммоль/л

Гормоны щитовидной железы:
- ТТГ: 0.4-4.0 мЕд/л
- Т4 свободный: 9-22 пмоль/л
- Т3 свободный: 2.6-5.7 пмоль/л

Витамины и микроэлементы:
- Витамин D (25-OH): 30-100 нг/мл
- Витамин B12: 191-663 пг/мл
- Фолиевая кислота: 4.6-18.7 нг/мл
- Железо: 9-30 мкмоль/л
- Ферритин: 15-150 нг/мл (женщины), 15-200 нг/мл (мужчины)

Воспалительные маркеры:
- СРБ: <3.0 мг/л
- СОЭ: до 15 мм/ч (мужчины), до 20 мм/ч (женщины)

ОБРАЗОВАТЕЛЬНЫЙ КОНТЕНТ:
Для каждого биомаркера включайте:
- Краткое объяснение функции в организме
- Причины повышения/понижения
- Связь с другими показателями
- Рекомендации по питанию и образу жизни
- Когда нужна консультация врача

Отвечайте ТОЛЬКО в формате JSON объекта следующей структуры:
{
  "markers": [
    {
      "name": "Название показателя",
      "value": "Обнаруженное значение с единицами измерения",
      "normalRange": "Нормальный диапазон с единицами измерения",
      "status": "normal|high|low",
      "recommendation": "Конкретная подробная рекомендация для данного показателя",
      "education": "Образовательная информация о функции биомаркера в организме",
      "lifestyle": "Рекомендации по образу жизни и питанию"
    }
  ],
  "supplements": [
    {
      "name": "Название добавки или препарата",
      "reason": "Медицинское обоснование назначения",
      "dosage": "Рекомендуемая дозировка и режим приема",
      "duration": "Рекомендуемая продолжительность приема"
    }
  ],
  "generalRecommendation": "Общая медицинская рекомендация на основе всех показателей",
  "riskFactors": ["Список выявленных факторов риска"],
  "followUpTests": ["Список рекомендуемых дополнительных анализов"],
  "urgencyLevel": "low|medium|high",
  "nextCheckup": "Рекомендуемые сроки повторного обследования"
}

ВАЖНЫЕ МЕДИЦИНСКИЕ УКАЗАНИЯ:
- Анализируйте взаимосвязи между показателями
- Выявляйте паттерны и синдромы
- Учитывайте возрастные и половые особенности
- Предоставляйте образовательную ценность
- При серьезных отклонениях указывайте высокий уровень срочности

Не включайте никакой текст вне этой JSON структуры.`;

    if (text) {
      // For text input with enhanced processing
      messages = [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Проанализируйте следующие результаты анализа крови как опытный медицинский лаборант с расширенными знаниями биомаркеров:

РЕЗУЛЬТАТЫ АНАЛИЗА:
${text}

Обратите особое внимание на:
1. Все числовые значения и их единицы измерения
2. Возможные опечатки или нестандартные обозначения
3. Взаимосвязи между показателями
4. Образовательную ценность для пациента

Ответьте строго в требуемом JSON формате с расширенными рекомендациями и образовательным контентом.`
        }
      ];
    } else if (imageBase64) {
      // Enhanced image processing with better OCR instructions
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
              text: `Проанализируйте это изображение анализа крови с расширенными возможностями OCR:

ИНСТРУКЦИИ ПО OCR:
1. Внимательно изучите весь документ, включая заголовки, таблицы, примечания
2. Распознайте все числовые значения, даже если они написаны от руки
3. Обратите внимание на единицы измерения (г/л, ×10⁹/л, ммоль/л и т.д.)
4. Учтите референсные значения, если они указаны
5. Найдите информацию о дате анализа, лаборатории, методах исследования
6. Обработайте данные даже при низком качестве изображения

ЗАДАЧИ АНАЛИЗА:
- Извлеките все биомаркеры с их значениями
- Оцените каждый показатель относительно нормы
- Предоставьте образовательную информацию о каждом биомаркере
- Дайте персонализированные рекомендации
- Укажите взаимосвязи между показателями

Ответ должен быть структурированным JSON объектом согласно системной инструкции с расширенной образовательной информацией.` 
            },
            { 
              type: "image_url", 
              image_url: { url: imageBase64 } 
            }
          ]
        }
      ];
    }

    console.log("Sending enhanced request to OpenAI...");
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: messages,
        temperature: 0.2,
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
    
    console.log("Received enhanced response from OpenAI");
    
    // Parse and validate the enhanced response
    try {
      const parsedResponse = JSON.parse(aiResponse);
      
      // Validate structure with enhanced fields
      if (!parsedResponse.markers || !Array.isArray(parsedResponse.markers)) {
        throw new Error("Invalid response structure: missing markers array");
      }
      
      // Ensure each marker has enhanced fields
      parsedResponse.markers = parsedResponse.markers.map(marker => ({
        name: marker.name || "Неизвестный показатель",
        value: marker.value || "Не указано",
        normalRange: marker.normalRange || "Не указан",
        status: marker.status || "normal",
        recommendation: marker.recommendation || "Рекомендации не предоставлены",
        education: marker.education || "Образовательная информация недоступна",
        lifestyle: marker.lifestyle || "Рекомендации по образу жизни не предоставлены"
      }));
      
      // Ensure enhanced supplements array
      if (!parsedResponse.supplements) {
        parsedResponse.supplements = [];
      } else {
        parsedResponse.supplements = parsedResponse.supplements.map(supplement => ({
          ...supplement,
          duration: supplement.duration || "Консультируйтесь с врачом"
        }));
      }
      
      // Ensure enhanced response fields
      if (!parsedResponse.generalRecommendation) {
        parsedResponse.generalRecommendation = "Рекомендуется консультация с врачом для детального обсуждения результатов.";
      }
      
      parsedResponse.riskFactors = parsedResponse.riskFactors || [];
      parsedResponse.followUpTests = parsedResponse.followUpTests || [];
      parsedResponse.urgencyLevel = parsedResponse.urgencyLevel || "low";
      parsedResponse.nextCheckup = parsedResponse.nextCheckup || "Через 6-12 месяцев";
      
      return new Response(JSON.stringify(parsedResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error("Failed to parse enhanced AI response:", parseError);
      
      // Enhanced fallback response
      const fallbackResponse = {
        markers: [{
          name: "Общий анализ",
          value: "Данные обработаны частично",
          normalRange: "Не удалось определить",
          status: "normal",
          recommendation: "Рекомендуется повторить анализ или ввести данные вручную для более точного результата.",
          education: "Анализ крови - важный диагностический инструмент для оценки состояния здоровья.",
          lifestyle: "Поддерживайте здоровый образ жизни и регулярно проходите обследования."
        }],
        supplements: [],
        generalRecommendation: "Произошла ошибка при анализе данных. Пожалуйста, попробуйте еще раз с более четким изображением или введите данные вручную.",
        riskFactors: [],
        followUpTests: [],
        urgencyLevel: "low",
        nextCheckup: "Обратитесь к врачу для консультации"
      };
      
      return new Response(JSON.stringify(fallbackResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in enhanced analyze-blood-test function:', error);
    
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
