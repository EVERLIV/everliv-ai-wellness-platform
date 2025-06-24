
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UserHealthProfile {
  name?: string;
  age?: number;
  gender?: string;
  healthGoals?: string[];
  currentIssues?: string[];
  activityLevel?: string;
  chronicConditions?: string[];
  preferences?: any;
}

interface ContextData {
  timeOfDay: string;
  dayOfWeek: string;
  season: string;
  userLocation?: string;
}

async function getUserHealthProfile(userId: string): Promise<UserHealthProfile> {
  try {
    // Получаем профиль здоровья пользователя
    const { data: healthProfile } = await supabase
      .from('health_profiles')
      .select('profile_data')
      .eq('user_id', userId)
      .single();

    // Получаем цели пользователя
    const { data: goals } = await supabase
      .from('user_health_goals')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    // Получаем профиль пользователя
    const { data: profile } = await supabase
      .from('profiles')
      .select('nickname, first_name')
      .eq('id', userId)
      .single();

    const profileData = healthProfile?.profile_data || {};
    
    return {
      name: profile?.nickname || profile?.first_name || 'Пользователь',
      age: profileData.age,
      gender: profileData.gender,
      healthGoals: goals?.map(g => g.goal_type) || [],
      currentIssues: profileData.currentSymptoms || [],
      activityLevel: profileData.physicalActivity,
      chronicConditions: profileData.chronicConditions || [],
      preferences: profileData.recommendationSettings || {}
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { name: 'Пользователь' };
  }
}

function getCurrentContext(): ContextData {
  const now = new Date();
  const hour = now.getHours();
  const dayOfWeek = now.toLocaleDateString('ru-RU', { weekday: 'long' });
  const month = now.getMonth();
  
  let timeOfDay = 'день';
  if (hour >= 5 && hour < 12) timeOfDay = 'утро';
  else if (hour >= 12 && hour < 17) timeOfDay = 'день';
  else if (hour >= 17 && hour < 22) timeOfDay = 'вечер';
  else timeOfDay = 'ночь';

  let season = 'весна';
  if (month >= 2 && month <= 4) season = 'весна';
  else if (month >= 5 && month <= 7) season = 'лето';
  else if (month >= 8 && month <= 10) season = 'осень';
  else season = 'зима';

  return {
    timeOfDay,
    dayOfWeek,
    season,
    userLocation: 'Россия'
  };
}

async function generatePersonalizedTip(profile: UserHealthProfile, context: ContextData): Promise<any> {
  const systemPrompt = `
Ты - персональный ассистент по здоровью. Твоя задача - генерировать персонализированные, практичные и безопасные рекомендации по здоровью на основе профиля пользователя.

ВАЖНЫЕ ПРИНЦИПЫ:
- Всегда подчеркивай необходимость консультации с врачом при серьезных проблемах
- Давай только общие рекомендации, не заменяй медицинскую диагностику
- Фокусируйся на профилактике и здоровом образе жизни
- Учитывай индивидуальные особенности и ограничения пользователя

СТРУКТУРА ОТВЕТА:
1. Краткое приветствие с обращением по имени
2. Основная рекомендация (1-2 предложения)
3. Практический совет или действие
4. Мотивационное заключение

Ответ должен быть в формате JSON:
{
  "id": "уникальный_id",
  "title": "Заголовок подсказки",
  "description": "Основной текст подсказки (до 120 символов)",
  "category": "одна из: health, nutrition, exercise, sleep, stress, prevention",
  "priority": "high/medium/low",
  "action": "текст кнопки действия (если нужна)",
  "actionType": "reminder/exercise/meditation/info"
}
`;

  const userPrompt = `
Сгенерируй персональную подсказку по здоровью для пользователя со следующими данными:

ИМЯ: ${profile.name}
ВОЗРАСТ: ${profile.age || 'не указан'}
ПОЛ: ${profile.gender || 'не указан'}
ОСНОВНЫЕ ЦЕЛИ: ${profile.healthGoals?.join(', ') || 'не указаны'}
ТЕКУЩИЕ ПРОБЛЕМЫ: ${profile.currentIssues?.join(', ') || 'нет'}
УРОВЕНЬ АКТИВНОСТИ: ${profile.activityLevel || 'средний'}
ХРОНИЧЕСКИЕ ЗАБОЛЕВАНИЯ: ${profile.chronicConditions?.join(', ') || 'нет'}
ВРЕМЯ СУТОК: ${context.timeOfDay}
ДЕНЬ НЕДЕЛИ: ${context.dayOfWeek}
СЕЗОН: ${context.season}

Создай краткую (до 120 символов в описании), мотивирующую и практичную подсказку на русском языке.
Ответь ТОЛЬКО JSON объектом, без дополнительного текста.
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 300
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      const tipData = JSON.parse(content);
      return {
        ...tipData,
        id: `tip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString()
      };
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      // Возвращаем fallback подсказку
      return generateFallbackTip(profile, context);
    }
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return generateFallbackTip(profile, context);
  }
}

function generateFallbackTip(profile: UserHealthProfile, context: ContextData): any {
  const tips = [
    {
      id: `fallback-${Date.now()}`,
      title: '🌅 Доброе утро!',
      description: `${profile.name}, начни день с глубокого дыхания и стакана воды`,
      category: 'health',
      priority: 'medium',
      action: 'Выполнить',
      actionType: 'reminder'
    },
    {
      id: `fallback-${Date.now()}-2`,
      title: '🚶‍♀️ Активность',
      description: 'Сделай 10-минутную прогулку на свежем воздухе для заряда энергии',
      category: 'exercise',
      priority: 'medium',
      action: 'Начать',
      actionType: 'exercise'
    },
    {
      id: `fallback-${Date.now()}-3`,
      title: '🧘‍♂️ Релаксация',
      description: 'Попробуй технику дыхания 4-7-8 для снятия стресса',
      category: 'stress',
      priority: 'low',
      action: 'Попробовать',
      actionType: 'meditation'
    }
  ];

  return tips[Math.floor(Math.random() * tips.length)];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating personalized health tip for user:', userId);

    // Получаем профиль пользователя
    const userProfile = await getUserHealthProfile(userId);
    console.log('User profile:', userProfile);

    // Получаем текущий контекст
    const context = getCurrentContext();
    console.log('Context:', context);

    // Генерируем персонализированную подсказку
    const tip = await generatePersonalizedTip(userProfile, context);
    console.log('Generated tip:', tip);

    return new Response(
      JSON.stringify({ tip }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in generate-personalized-health-tips function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
