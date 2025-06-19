
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

interface WeatherData {
  temperature: number;
  pressure: number;
  humidity: number;
  condition: string;
  city: string;
}

interface HealthProfile {
  age?: number;
  chronicConditions?: string[];
  medications?: string[];
  region?: string;
}

async function getWeatherData(city: string = 'Moscow'): Promise<WeatherData | null> {
  try {
    // Используем простой API для получения погоды
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=demo&units=metric`);
    
    if (!response.ok) {
      // Возвращаем моковые данные если API недоступен
      return {
        temperature: Math.floor(Math.random() * 30) - 10,
        pressure: Math.floor(Math.random() * 50) + 740,
        humidity: Math.floor(Math.random() * 40) + 40,
        condition: ['sunny', 'cloudy', 'rainy', 'snowy'][Math.floor(Math.random() * 4)],
        city: city
      };
    }

    const data = await response.json();
    return {
      temperature: Math.round(data.main.temp),
      pressure: Math.round(data.main.pressure * 0.75), // конвертируем в мм рт.ст.
      humidity: data.main.humidity,
      condition: data.weather[0].main.toLowerCase(),
      city: data.name
    };
  } catch (error) {
    console.error('Weather API error:', error);
    // Возвращаем моковые данные
    return {
      temperature: Math.floor(Math.random() * 30) - 10,
      pressure: Math.floor(Math.random() * 50) + 740,
      humidity: Math.floor(Math.random() * 40) + 40,
      condition: ['sunny', 'cloudy', 'rainy', 'snowy'][Math.floor(Math.random() * 4)],
      city: city
    };
  }
}

async function getMagneticStormData(): Promise<{ level: string; regions: string[]; description: string }> {
  // Симулируем данные о магнитных бурях
  const levels = ['низкий', 'средний', 'высокий'];
  const level = levels[Math.floor(Math.random() * levels.length)];
  
  const allRegions = [
    'Москва и Московская область',
    'Санкт-Петербург и Ленинградская область', 
    'Сибирский федеральный округ',
    'Дальневосточный федеральный округ',
    'Уральский федеральный округ'
  ];
  
  const affectedRegions = level === 'высокий' 
    ? allRegions.slice(0, 4)
    : level === 'средний' 
    ? allRegions.slice(0, 2)
    : [];
    
  return {
    level,
    regions: affectedRegions,
    description: level === 'высокий' 
      ? 'Ожидается сильная магнитная буря'
      : level === 'средний'
      ? 'Возможны слабые геомагнитные возмущения'
      : 'Магнитная обстановка спокойная'
  };
}

async function generateSmartTips(userId: string): Promise<any[]> {
  try {
    console.log('Generating smart tips for user:', userId);

    // Получаем профиль пользователя
    const { data: healthProfile } = await supabase
      .from('health_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Получаем актуальные данные
    const weatherData = await getWeatherData(healthProfile?.city || 'Moscow');
    const magneticData = await getMagneticStormData();

    // Формируем контекст для ИИ
    const context = {
      weather: weatherData,
      magnetic: magneticData,
      userProfile: {
        age: healthProfile?.age || 30,
        region: healthProfile?.city || 'Москва',
        chronicConditions: healthProfile?.chronic_conditions || [],
        hasHypertension: healthProfile?.chronic_conditions?.includes('гипертония') || false
      },
      currentTime: new Date().toLocaleString('ru-RU')
    };

    console.log('Context for AI:', context);

    const prompt = `
Ты - эксперт по здоровью и персональный помощник. Создай 2-3 умные подсказки на основе следующих данных:

ПОГОДА:
- Температура: ${weatherData?.temperature}°C
- Давление: ${weatherData?.pressure} мм рт.ст.
- Влажность: ${weatherData?.humidity}%
- Условия: ${weatherData?.condition}

МАГНИТНАЯ ОБСТАНОВКА:
- Уровень: ${magneticData.level}
- Описание: ${magneticData.description}
- Затронутые регионы: ${magneticData.regions.join(', ')}

ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ:
- Возраст: ${context.userProfile.age}
- Регион: ${context.userProfile.region}
- Хронические заболевания: ${context.userProfile.chronicConditions.join(', ') || 'нет'}
- Гипертония: ${context.userProfile.hasHypertension ? 'да' : 'нет'}

Создай подсказки в формате JSON массива объектов со следующими полями:
- id: уникальный идентификатор
- title: заголовок подсказки
- description: описание (не более 120 символов)
- category: тип подсказки ('weather', 'magnetic', 'health', 'meditation')
- priority: важность ('high', 'medium', 'low')
- action: текст кнопки действия (если нужна)
- actionType: тип действия ('reminder', 'exercise', 'meditation', 'info')

ПРАВИЛА:
1. Подсказки должны быть актуальными и полезными
2. Учитывай влияние погоды на давление и самочувствие
3. Предупреждай о магнитных бурях для людей с гипертонией
4. Давай рекомендации по медитации/дыханию при стрессе
5. Советы должны быть короткими и действенными
6. Используй эмодзи для категорий

Ответь ТОЛЬКО JSON массивом, без дополнительного текста.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Ты эксперт по здоровью, который создает персональные подсказки на основе погоды, магнитной обстановки и профиля пользователя. Отвечай только валидным JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      }),
    });

    const aiResponse = await response.json();
    console.log('AI Response:', aiResponse);

    if (!aiResponse.choices?.[0]?.message?.content) {
      throw new Error('Invalid AI response');
    }

    const tips = JSON.parse(aiResponse.choices[0].message.content);
    console.log('Generated tips:', tips);

    return Array.isArray(tips) ? tips : [];

  } catch (error) {
    console.error('Error generating smart tips:', error);
    
    // Возвращаем статические подсказки в случае ошибки
    return [
      {
        id: 'fallback-1',
        title: '🌡️ Следите за давлением',
        description: 'При перепадах атмосферного давления измеряйте своё давление чаще',
        category: 'weather',
        priority: 'medium',
        action: 'Измерить давление',
        actionType: 'reminder'
      },
      {
        id: 'fallback-2', 
        title: '🧘‍♀️ Время для медитации',
        description: 'Сделайте 5-минутную дыхательную практику для снятия стресса',
        category: 'meditation',
        priority: 'low',
        action: 'Начать медитацию',
        actionType: 'meditation'
      }
    ];
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
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

    const tips = await generateSmartTips(userId);

    return new Response(
      JSON.stringify({ tips }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in smart-tips-ai function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
