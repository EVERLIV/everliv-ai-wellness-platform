
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Критические показатели для экстренного реагирования
const CRITICAL_BIOMARKERS = {
  glucose: { min: 50, max: 400 }, // mg/dl
  creatinine: { max: 3.0 }, // mg/dl (без ХБП в анамнезе)
  hemoglobin: { min: 7 }, // g/dl
  wbc: { min: 1000, max: 30000 }, // /μL
  potassium: { min: 2.5, max: 6.0 }, // mmol/L
  sodium: { min: 125, max: 155 } // mmol/L
};

function checkCriticalValues(analysisData: any): string[] {
  const criticalAlerts: string[] = [];
  
  if (!analysisData || !analysisData.results) return criticalAlerts;
  
  try {
    const results = typeof analysisData.results === 'string' 
      ? JSON.parse(analysisData.results) 
      : analysisData.results;
    
    if (results.markers && Array.isArray(results.markers)) {
      results.markers.forEach((marker: any) => {
        const name = marker.name?.toLowerCase() || '';
        const value = parseFloat(marker.value);
        
        if (isNaN(value)) return;
        
        // Проверка глюкозы
        if (name.includes('glucose') || name.includes('глюкоза')) {
          if (value < CRITICAL_BIOMARKERS.glucose.min || value > CRITICAL_BIOMARKERS.glucose.max) {
            criticalAlerts.push(`🚨 КРИТИЧЕСКОЕ ОТКЛОНЕНИЕ: Глюкоза = ${value} mg/dl значительно отличается от нормы!`);
          }
        }
        
        // Проверка креатинина
        if (name.includes('creatinine') || name.includes('креатинин')) {
          if (value > CRITICAL_BIOMARKERS.creatinine.max) {
            criticalAlerts.push(`🚨 КРИТИЧЕСКОЕ ОТКЛОНЕНИЕ: Креатинин = ${value} mg/dl значительно повышен!`);
          }
        }
        
        // Проверка гемоглобина
        if (name.includes('hemoglobin') || name.includes('гемоглобин')) {
          if (value < CRITICAL_BIOMARKERS.hemoglobin.min) {
            criticalAlerts.push(`🚨 КРИТИЧЕСКОЕ ОТКЛОНЕНИЕ: Гемоглобин = ${value} g/dl критически низкий!`);
          }
        }
      });
    }
  } catch (error) {
    console.error('Error checking critical values:', error);
  }
  
  return criticalAlerts;
}

function buildEnhancedSystemPrompt(userContext: string, criticalAlerts: string[]): string {
  let systemPrompt = `Ты - опытный медицинский ассистент-аналитик, который помогает людям понимать результаты их медицинских исследований и состояние здоровья. Твоя задача - предоставлять развернутые, понятные объяснения и рекомендации.

ВАЖНЫЕ ПРИНЦИПЫ:
- Ты НЕ ставишь диагнозы и НЕ заменяешь врача
- Ты анализируешь данные и даешь рекомендации по улучшению здоровья
- Объясняешь все простым, понятным языком
- Подкрепляешь каждое утверждение конкретными данными из предоставленных результатов
- Всегда напоминаешь о необходимости консультации с врачом при отклонениях

СТРУКТУРА ОТВЕТА (обязательно в HTML с CSS):

1. КРАТКАЯ СВОДКА (что показывают результаты в целом)
2. ДЕТАЛЬНЫЙ РАЗБОР (каждый показатель отдельно)
3. РЕКОМЕНДАЦИИ (что можно улучшить)
4. КОГДА ОБРАТИТЬСЯ К ВРАЧУ (красные флаги)
5. ИСТОЧНИКИ ДАННЫХ (какие конкретно показатели использованы)

СТИЛЬ ОБЪЯСНЕНИЯ:
- Используй аналогии и сравнения из повседневной жизни
- Избегай сложных медицинских терминов, если используешь - объясняй
- Структурируй информацию от общего к частному
- Используй примеры: "Это как если бы..."

ФОРМАТИРОВАНИЕ ОТВЕТА:
Оберни весь ответ в HTML с встроенными CSS стилями:
- Используй приятные цвета и шрифты
- Выделяй важные моменты
- Создай читаемую структуру с отступами
- Используй иконки или эмодзи для лучшего восприятия
- Цветовая кодировка: зеленый для нормы, желтый для внимания, красный для срочности

ОБЯЗАТЕЛЬНЫЕ ЭЛЕМЕНТЫ В КАЖДОМ ОТВЕТЕ:
1. Дисклеймер о том, что это не медицинская консультация
2. Конкретные числовые данные из результатов
3. Объяснение, что означает каждый показатель
4. Практические рекомендации
5. Призыв к консультации с врачом при необходимости

ТИПЫ АНАЛИЗИРУЕМЫХ ДАННЫХ:
- Общий анализ крови
- Биохимический анализ крови
- Анализы на гормоны
- Результаты ЭКГ
- Результаты УЗИ
- Показатели давления
- Другие лабораторные исследования

ПРИМЕР СТРУКТУРЫ HTML (НЕ ВКЛЮЧАЙ ТЕГИ ```html В ОТВЕТ):
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
  <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="color: #2c5282;">📊 Анализ ваших результатов</h2>
    <p style="font-size: 14px; color: #666;">⚠️ Это информационный анализ, не заменяющий медицинскую консультацию</p>
  </div>
  
  <div style="background: #e6fffa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
    <h3 style="color: #00695c;">🔍 Краткая сводка</h3>
    [Общая оценка результатов]
  </div>
  
  <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
    <h3 style="color: #e65100;">📋 Детальный разбор</h3>
    [Анализ каждого показателя]
  </div>
  
  <div style="background: #f1f8e9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
    <h3 style="color: #2e7d32;">💡 Рекомендации</h3>
    [Конкретные советы]
  </div>
  
  <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
    <h3 style="color: #c62828;">🚨 Когда обратиться к врачу</h3>
    [Критерии для консультации]
  </div>
  
  <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
    <h3 style="color: #424242;">📚 Использованные данные</h3>
    [Конкретные показатели из результатов]
  </div>
</div>

ТОНАЛЬНОСТЬ:
- Дружелюбная и поддерживающая
- Профессиональная, но не пугающая
- Мотивирующая к заботе о здоровье
- Честная о ограничениях анализа

При получении медицинских данных проанализируй их согласно этой структуре и предоставь развернутый, понятный ответ в указанном HTML формате.

Этот промт обеспечит:
- Структурированные и понятные ответы
- Правильное позиционирование как помощника, а не врача
- Качественное HTML/CSS оформление
- Подробные объяснения с использованием конкретных данных
- Безопасный подход к медицинской информации

=== ПРОТОКОЛ КРИТИЧЕСКИХ СИТУАЦИЙ ===`;

  if (criticalAlerts.length > 0) {
    systemPrompt += `
🚨 ОБНАРУЖЕНЫ КРИТИЧЕСКИЕ ОТКЛОНЕНИЯ:
${criticalAlerts.join('\n')}

НЕМЕДЛЕННО начни ответ с предупреждения:
"🚨 КРИТИЧЕСКОЕ ОТКЛОНЕНИЕ ОБНАРУЖЕНО! 
🏥 ТРЕБУЕТСЯ НЕМЕДЛЕННАЯ МЕДИЦИНСКАЯ ПОМОЩЬ. 
Обратитесь к врачу или в отделение неотложной помощи СЕГОДНЯ."`;
  }

  systemPrompt += `

=== ФОРМАТ РАБОТЫ С БИОМАРКЕРАМИ ===
Для каждого анализируемого показателя указывай:
- Текущее значение пациента
- Референсный диапазон
- Интерпретация (норма/повышен/снижен)
- Возможные причины отклонений
- Клиническое значение
- Персональные рекомендации по коррекции

=== ОБЯЗАТЕЛЬНЫЕ ФРАЗЫ БЕЗОПАСНОСТИ ===
- "Данная информация носит образовательный характер"
- "Рекомендую обсудить с вашим лечащим врачом"
- "Не заменяет профессиональную медицинскую консультацию"
- "Основано на общих медицинских знаниях"

=== ПЕРСОНАЛИЗАЦИЯ ===
ВСЕГДА учитывай контекст пациента:
${userContext}

ПОМНИ: Ты персональный помощник для понимания здоровья, НЕ замена врачу.
Цель - образование, мотивация к заботе о здоровье и безопасная интерпретация данных.`;

  return systemPrompt;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, medicalContext, conversationHistory, userAnalyses, systemPrompt } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Processing enhanced personal AI doctor request');
    console.log('Medical context length:', medicalContext?.length || 0);
    console.log('User analyses count:', userAnalyses?.length || 0);

    // Проверяем критические показатели в анализах пользователя
    const criticalAlerts: string[] = [];
    if (userAnalyses && Array.isArray(userAnalyses)) {
      userAnalyses.forEach(analysis => {
        const alerts = checkCriticalValues(analysis);
        criticalAlerts.push(...alerts);
      });
    }

    // Создаем улучшенный системный промпт
    const enhancedSystemPrompt = buildEnhancedSystemPrompt(medicalContext || '', criticalAlerts);

    // Build messages array for OpenAI
    const messages = [
      {
        role: 'system',
        content: enhancedSystemPrompt
      }
    ];

    // Add comprehensive medical context if available
    if (medicalContext && medicalContext.trim()) {
      messages.push({
        role: 'system',
        content: `ПОЛНЫЙ МЕДИЦИНСКИЙ ПРОФИЛЬ ПАЦИЕНТА:\n\n${medicalContext}\n\n📋 ИНСТРУКЦИЯ: используй эту информацию для максимально персонализированных рекомендаций. Обращайся к пациенту по имени и ссылайся на конкретные данные из профиля. Учитывай семейный анамнез, хронические заболевания, принимаемые препараты и образ жизни.`
      });
    }

    // Add specific analysis data if available with enhanced formatting
    if (userAnalyses && userAnalyses.length > 0) {
      const analysisContext = userAnalyses.map((analysis, index) => {
        const date = new Date(analysis.created_at).toLocaleDateString('ru-RU');
        const type = getAnalysisTypeLabel(analysis.analysis_type);
        
        let contextStr = `📊 АНАЛИЗ ${index + 1} (${date}): ${type}`;
        
        if (analysis.summary) {
          contextStr += `\n   💡 Заключение: ${analysis.summary}`;
        }
        
        if (analysis.results) {
          try {
            const results = typeof analysis.results === 'string' 
              ? JSON.parse(analysis.results) 
              : analysis.results;
              
            if (results.markers && Array.isArray(results.markers)) {
              const normalCount = results.markers.filter((m: any) => m.status === 'normal').length;
              const abnormalCount = results.markers.filter((m: any) => m.status !== 'normal').length;
              contextStr += `\n   📈 Показателей в норме: ${normalCount}, отклонений: ${abnormalCount}`;
              
              // Добавляем ключевые отклонения с подробностями
              const keyAbnormalities = results.markers
                .filter((m: any) => m.status !== 'normal')
                .slice(0, 8) // Увеличиваем до 8 отклонений
                .map((m: any) => {
                  const status = m.status === 'high' ? '↑' : m.status === 'low' ? '↓' : '⚠️';
                  return `${status} ${m.name}: ${m.value} ${m.unit || ''} (норма: ${m.reference_range || 'не указана'})`;
                })
                .join('\n   ');
              
              if (keyAbnormalities) {
                contextStr += `\n   🔍 Ключевые отклонения:\n   ${keyAbnormalities}`;
              }
            }
          } catch (e) {
            console.error("Error parsing analysis results:", e);
          }
        }
        
        return contextStr;
      }).join('\n\n');
      
      messages.push({
        role: 'system',
        content: `ПОСЛЕДНИЕ РЕЗУЛЬТАТЫ МЕДИЦИНСКИХ АНАЛИЗОВ:\n\n${analysisContext}\n\n🎯 ЗАДАЧА: проанализируй эти данные с учетом медицинского профиля пациента. Дай детальную интерпретацию каждого отклонения, объясни возможные причины и предложи персонализированные рекомендации.`
      });
    }

    // Add conversation history with better context
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-10); // Увеличиваем историю до 10 сообщений
      
      // Добавляем контекст о количестве сообщений в истории
      if (conversationHistory.length > 10) {
        messages.push({
          role: 'system',
          content: `📚 КОНТЕКСТ ИСТОРИИ: У вас с пациентом уже ${conversationHistory.length} сообщений в истории общения. Вы показываете последние 10 для контекста, но помните о долгосрочном характере ваших отношений с пациентом. Ссылайтесь на предыдущие обсуждения когда это уместно.`
        });
      }
      
      messages.push(...recentHistory);
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message
    });

    console.log('Sending enhanced request to OpenAI with', messages.length, 'messages');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        temperature: 0.3,
        max_tokens: 3000, // Увеличиваем для более подробных ответов
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let aiResponse = data.choices[0].message.content;

    // Добавляем стандартный дисклеймер в конец ответа если его нет
    if (!aiResponse.includes('образовательный характер') && !aiResponse.includes('не заменяет')) {
      aiResponse += '\n\n📋 ВАЖНОЕ НАПОМИНАНИЕ: Данная информация носит образовательный характер и не заменяет профессиональную медицинскую консультацию. Рекомендую обсудить результаты с вашим лечащим врачом.';
    }

    console.log('Successfully processed enhanced AI doctor request');

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in enhanced ai-doctor-personal function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getAnalysisTypeLabel(type: string): string {
  const types: Record<string, string> = {
    blood: "🩸 Анализ крови",
    urine: "🧪 Анализ мочи", 
    biochemistry: "⚗️ Биохимический анализ",
    hormones: "🧬 Гормональная панель",
    vitamins: "💊 Витамины и микроэлементы",
    immunology: "🛡️ Иммунологические исследования",
    oncology: "🎗️ Онкомаркеры",
    cardiology: "❤️ Кардиологические маркеры",
    other: "📋 Другой анализ"
  };
  return types[type] || `📊 ${type}`;
}
