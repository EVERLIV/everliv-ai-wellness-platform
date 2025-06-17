
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HealthProfileData {
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  smokingStatus?: string;
  physicalActivity?: string;
  alcoholConsumption?: string;
  sleepHours?: number;
  stressLevel?: number;
  exerciseFrequency?: number;
  waterIntake?: number;
  chronicDiseases?: string[];
  familyHistory?: string[];
  allergies?: string[];
  medications?: string[];
  bloodPressure?: { systolic: number; diastolic: number };
  restingHeartRate?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { healthProfile, analyses, chats } = await req.json();

    console.log('Processing enhanced health analytics request:', {
      hasHealthProfile: !!healthProfile,
      analysesCount: analyses?.length || 0,
      chatsCount: chats?.length || 0
    });

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Подготавливаем данные для анализа
    const profileSummary = createHealthProfileSummary(healthProfile);
    const analysisHistory = createAnalysisHistory(analyses);
    const consultationHistory = createConsultationHistory(chats);

    const systemPrompt = `Вы - эксперт по персонализированной медицине и анализу здоровья. Проанализируйте комплексные данные о здоровье пациента и предоставьте детальную оценку.

МЕТОДОЛОГИЯ РАСЧЕТА БАЛЛА ЗДОРОВЬЯ:
1. Базовый балл: 85 (оптимистичный подход)
2. Возрастные корректировки: 
   - <25 лет: +5, 25-35: +2, 35-45: 0, 45-55: -3, 55-65: -6, 65-75: -10, >75: -15
3. Образ жизни (максимальное влияние ±30 баллов):
   - Курение: регулярное (-20), эпизодическое (-10)
   - Физическая активность: сидячий (-15), умеренная (0), активная (+8), очень активная (+12)
   - Сон: <6ч (-12), 6-7ч (-6), 7-9ч (+5), >9ч (0)
   - Стресс: высокий >8 (-12), средний 6-8 (-6), низкий <6 (+3)
   - Алкоголь: злоупотребление (-15), умеренное (-3), не употребляет (+2)
4. Медицинские состояния (до -30 баллов):
   - Критические (диабет, ССЗ, онкология): -10 до -20
   - Хронические (астма, гипертония): -5 до -12
   - Легкие состояния: -2 до -5
5. Семейная история (до -15 баллов):
   - Тяжелые наследственные заболевания: -5 до -10
6. Лабораторные показатели (до ±20 баллов):
   - Критические отклонения биомаркеров

УРОВНИ РИСКА:
- Критический: <40 баллов или >4 серьезных факторов риска
- Высокий: 40-59 баллов или 3-4 фактора риска  
- Средний: 60-74 балла или 1-2 фактора риска
- Низкий: 75+ баллов и минимальные факторы риска

Верните JSON СТРОГО в этом формате:
{
  "analysis": {
    "healthScore": number (20-100),
    "riskLevel": "низкий" | "средний" | "высокий" | "критический",
    "riskDescription": "детальное описание состояния здоровья",
    "recommendations": ["специфичная рекомендация 1", "рекомендация 2", "рекомендация 3"],
    "strengths": ["сильная сторона 1", "сильная сторона 2"],
    "concerns": ["проблема 1", "проблема 2"],
    "scoreExplanation": "подробное объяснение расчета балла с указанием факторов"
  }
}`;

    const userPrompt = `Проанализируйте комплексные данные здоровья:

ПРОФИЛЬ ПАЦИЕНТА:
${profileSummary}

ИСТОРИЯ ЛАБОРАТОРНЫХ АНАЛИЗОВ:
${analysisHistory}

ИСТОРИЯ КОНСУЛЬТАЦИЙ:
${consultationHistory}

Предоставьте расширенный анализ с учетом всех факторов и взаимосвязей между ними.`;

    console.log('Sending request to OpenAI...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('Received AI response:', aiResponse.substring(0, 200) + '...');

    let result;
    try {
      result = JSON.parse(aiResponse);
      
      // Валидация результата
      if (!result.analysis || typeof result.analysis.healthScore !== 'number') {
        throw new Error('Invalid response structure');
      }

      // Проверяем и нормализуем уровень риска
      const validRiskLevels = ['низкий', 'средний', 'высокий', 'критический'];
      if (!validRiskLevels.includes(result.analysis.riskLevel)) {
        const riskMapping: Record<string, string> = {
          'low': 'низкий',
          'medium': 'средний', 
          'high': 'высокий',
          'critical': 'критический'
        };
        result.analysis.riskLevel = riskMapping[result.analysis.riskLevel] || 'средний';
      }

      console.log('Processed result:', {
        healthScore: result.analysis.healthScore,
        riskLevel: result.analysis.riskLevel,
        recommendationsCount: result.analysis.recommendations?.length || 0
      });

    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw response:', aiResponse);
      
      // Возвращаем базовый результат
      result = {
        analysis: {
          healthScore: 65,
          riskLevel: "средний",
          riskDescription: "Базовая оценка - требуется более детальный анализ",
          recommendations: [
            "Регулярные медицинские осмотры",
            "Поддержание активного образа жизни",
            "Сбалансированное питание"
          ],
          strengths: ["Проактивный подход к здоровью"],
          concerns: ["Требуется детализация данных"],
          scoreExplanation: "Базовая оценка из-за недостатка данных или ошибки анализа"
        }
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-health-analytics function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        analysis: {
          healthScore: 60,
          riskLevel: "средний",
          riskDescription: "Ошибка анализа - используется базовая оценка",
          recommendations: ["Обратитесь к врачу для полного обследования"],
          strengths: [],
          concerns: ["Технические неполадки в анализе"],
          scoreExplanation: "Базовая оценка из-за технической ошибки"
        }
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function createHealthProfileSummary(profile: HealthProfileData): string {
  if (!profile) return "Профиль здоровья не предоставлен";

  const sections = [];

  // Базовые данные
  if (profile.age || profile.gender || profile.height || profile.weight) {
    const bmi = profile.height && profile.weight ? 
      (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1) : 'не указан';
    sections.push(`Возраст: ${profile.age || 'не указан'}, Пол: ${profile.gender || 'не указан'}, ИМТ: ${bmi}`);
  }

  // Образ жизни
  const lifestyle = [];
  if (profile.smokingStatus) lifestyle.push(`курение: ${profile.smokingStatus}`);
  if (profile.physicalActivity) lifestyle.push(`активность: ${profile.physicalActivity}`);
  if (profile.sleepHours) lifestyle.push(`сон: ${profile.sleepHours}ч`);
  if (profile.stressLevel) lifestyle.push(`стресс: ${profile.stressLevel}/10`);
  if (lifestyle.length) sections.push(`Образ жизни: ${lifestyle.join(', ')}`);

  // Медицинские данные
  if (profile.chronicDiseases?.length) {
    sections.push(`Хронические заболевания: ${profile.chronicDiseases.join(', ')}`);
  }
  if (profile.familyHistory?.length) {
    sections.push(`Семейная история: ${profile.familyHistory.join(', ')}`);
  }
  if (profile.medications?.length) {
    sections.push(`Медикаменты: ${profile.medications.join(', ')}`);
  }

  return sections.join('\n');
}

function createAnalysisHistory(analyses: any[]): string {
  if (!analyses?.length) return "Лабораторные анализы не загружены";

  const summaries = analyses.slice(0, 3).map((analysis, index) => {
    const date = new Date(analysis.created_at).toLocaleDateString('ru-RU');
    const markers = analysis.results?.markers || [];
    
    const abnormalMarkers = markers.filter((m: any) => 
      m.status && !['optimal', 'good', 'normal'].includes(m.status)
    );

    return `Анализ ${index + 1} (${date}): ${markers.length} показателей, ${abnormalMarkers.length} отклонений`;
  });

  return summaries.join('\n');
}

function createConsultationHistory(chats: any[]): string {
  if (!chats?.length) return "Консультации с ИИ-доктором не проводились";

  const recentCount = chats.filter(chat => {
    const chatDate = new Date(chat.created_at);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return chatDate > monthAgo;
  }).length;

  return `Всего консультаций: ${chats.length}, за последний месяц: ${recentCount}`;
}
