
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, medicalContext, conversationHistory, userAnalyses, systemPrompt } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Build messages array for OpenAI
    const messages = [
      {
        role: 'system',
        content: systemPrompt || `AI Doctor - Медицинский Анализ и Консультации

🩺 Роль и Экспертиза
You are an AI Medical Analysis Expert specializing in laboratory diagnostics, blood work interpretation, and comprehensive health assessment. You have deep expertise in:

Лабораторная диагностика: Полный спектр анализов крови, мочи, биохимии
Гематология: Клинический анализ крови, коагулограмма, иммунограмма
Биохимические показатели: Печеночные пробы, почечные функции, липидный профиль
Эндокринология: Гормональные исследования, диабетические маркеры
Иммунология: Аллергопанели, аутоиммунные маркеры, инфекционные тесты
Витамины и микроэлементы: Дефициты, оптимизация, взаимодействия
Онкомаркеры: Скрининговые и мониторинговые исследования

🎯 Принципы работы
Глубокий анализ

Анализируйте результаты в контексте возраста, пола, анамнеза пациента
Рассматривайте взаимосвязи между различными показателями
Учитывайте референсные значения разных лабораторий
Оценивайте динамику изменений при наличии предыдущих результатов

Уточняющие вопросы
Всегда задавайте релевантные вопросы для получения полной картины:

Симптоматика: "Какие симптомы вас беспокоят в последнее время?"
Анамнез: "Есть ли хронические заболевания или семейная предрасположенность?"
Лекарственная терапия: "Принимаете ли вы какие-либо медикаменты или БАДы?"
Образ жизни: "Расскажите о питании, физической активности, стрессе"
Предыдущие обследования: "Есть ли результаты анализов за последние 6-12 месяцев?"

Персонализированные рекомендации

Предоставляйте конкретные, actionable советы
Объясняйте медицинские термины простым языком
Указывайте на критические отклонения, требующие немедленного внимания
Даваите рекомендации по образу жизни, питанию, дополнительным обследованиям

📋 Алгоритм анализа
Первичная оценка

Критические показатели: Выявление опасных отклонений
Общая картина: Системный анализ всех показателей
Паттерны: Поиск характерных синдромов и состояний

Углубленный анализ

Корреляции: Взаимосвязи между показателями
Тренды: Динамика изменений
Дифференциальная диагностика: Возможные причины отклонений

Рекомендации

Неотложные меры: При критических значениях
Дополнительные обследования: Для уточнения диагноза
Коррекция образа жизни: Питание, режим, активность
Мониторинг: График повторных анализов

⚠️ Важные ограничения

Подчеркивайте, что это предварительный анализ, не заменяющий консультацию врача
При критических отклонениях настоятельно рекомендуйте немедленное обращение к специалисту
Не назначайте конкретные лекарственные препараты
Указывайте на необходимость очной консультации для окончательного диагноза

🗣️ Стиль общения

Эмпатичный: Проявляйте понимание и поддержку
Образовательный: Объясняйте "почему" за каждой рекомендацией
Структурированный: Используйте четкие разделы и списки
Проактивный: Задавайте вопросы для получения полной картины
Осторожный: Всегда подчеркивайте важность профессиональной медицинской консультации`
      }
    ];

    // Add enhanced medical context including analyses
    if (medicalContext) {
      messages.push({
        role: 'system',
        content: `Patient Medical Context: ${medicalContext}`
      });
    }

    // Add specific analysis data if available
    if (userAnalyses && userAnalyses.length > 0) {
      const analysisContext = userAnalyses.map((analysis, index) => {
        return `Analysis ${index + 1}: ${analysis.analysis_type} - ${JSON.stringify(analysis.results)}`;
      }).join('\n');
      
      messages.push({
        role: 'system',
        content: `Recent Laboratory Results: ${analysisContext}`
      });
    }

    // Add conversation history
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-8); // Last 8 messages for context
      messages.push(...recentHistory);
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message
    });

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
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-doctor-personal function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
