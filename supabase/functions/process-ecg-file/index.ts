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
    const { diagnosis, hasEcgFile, fileType } = await req.json();

    if (!diagnosis) {
      return new Response(
        JSON.stringify({ error: 'Diagnosis is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

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

    console.log(`Обработка диагноза для пользователя: ${user.id}`);
    console.log(`Диагноз: ${diagnosis}`);
    console.log(`Файл ЭКГ: ${hasEcgFile ? 'да' : 'нет'}, тип: ${fileType || 'не указан'}`);

    // Получаем данные профиля пользователя
    const { data: userProfile } = await supabase
      .from('user_health_ai_profile')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Получаем последние биомаркеры
    const { data: biomarkers } = await supabase
      .from('biomarker_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Получаем дневные метрики здоровья за последние 30 дней
    const { data: healthMetrics } = await supabase
      .from('daily_health_metrics')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('date', { ascending: false });

    // Формируем контекст для ИИ
    const context = {
      userProfile: userProfile || {},
      recentBiomarkers: biomarkers || [],
      healthMetrics: healthMetrics || [],
      fileInfo: hasEcgFile ? { hasFile: true, type: fileType } : { hasFile: false }
    };

    // Генерируем рекомендации с помощью ИИ
    const recommendations = await generateRecommendations(diagnosis, context);

    return new Response(JSON.stringify({ 
      success: true, 
      recommendations,
      message: 'Рекомендации сгенерированы успешно'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Ошибка в process-ecg-file:', error);
    return new Response(JSON.stringify({ 
      error: 'Ошибка при обработке запроса', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateRecommendations(diagnosis: string, context: any): Promise<any[]> {
  console.log('Генерируем рекомендации для диагноза:', diagnosis);
  console.log('Контекст пользователя:', JSON.stringify(context, null, 2));

  if (!anthropicApiKey) {
    console.log('Anthropic API ключ не найден, используем улучшенные mock рекомендации');
    
    // Улучшенные mock рекомендации на основе диагноза
    const mockRecommendations = generateMockRecommendations(diagnosis, context);
    return mockRecommendations;
  }

  try {
    console.log('Отправляем запрос к Anthropic API...');
    
    const profileSummary = context.userProfile ? 
      `Возраст: ${context.userProfile.age || 'не указан'}, 
       Пол: ${context.userProfile.gender || 'не указан'},
       ИМТ: ${context.userProfile.bmi ? context.userProfile.bmi.toFixed(1) : 'не рассчитан'},
       Хронические заболевания: ${context.userProfile.medical_conditions?.join(', ') || 'не указаны'},
       Аллергии: ${context.userProfile.allergies?.join(', ') || 'нет'},
       Лекарства: ${context.userProfile.medications?.join(', ') || 'не принимает'}` : 'Данные профиля отсутствуют';

    const biomarkersSummary = context.recentBiomarkers?.length > 0 ? 
      context.recentBiomarkers.map(b => `${b.biomarker_name}: ${b.value} ${b.unit}`).join(', ') : 
      'Биомаркеры не добавлены';

    const healthMetricsSummary = context.healthMetrics?.length > 0 ? 
      `Средние показатели за 30 дней: 
       Сон: ${calculateAverage(context.healthMetrics, 'sleep_hours')} ч,
       Активность: ${calculateAverage(context.healthMetrics, 'steps')} шагов,
       Стресс: ${calculateAverage(context.healthMetrics, 'stress_level')}/10,
       Настроение: ${calculateAverage(context.healthMetrics, 'mood_level')}/10` : 
      'Данные о здоровье отсутствуют';

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2500,
        messages: [{
          role: 'user',
          content: `Ты опытный врач-терапевт и специалист по персонализированной медицине. 

ЗАДАЧА: Создай персонализированные медицинские рекомендации на основе всех доступных данных пациента.

ДИАГНОЗ ВРАЧА: "${diagnosis}"

ДАННЫЕ ПАЦИЕНТА:
📊 Профиль: ${profileSummary}

🩸 Биомаркеры: ${biomarkersSummary}

📈 Показатели здоровья: ${healthMetricsSummary}

🔬 ЭКГ файл: ${context.fileInfo.hasFile ? `Загружен (${context.fileInfo.type})` : 'Не загружен'}

ИНСТРУКЦИИ:
1. Создай 5-7 конкретных персонализированных рекомендаций
2. Учитывай ВСЕ данные: диагноз + биомаркеры + показатели здоровья + наличие ЭКГ
3. Делай акцент на наиболее важных для данного диагноза аспектах
4. Рекомендации должны быть практичными и выполнимыми
5. Указывай конкретные целевые значения где возможно

ФОРМАТ ОТВЕТА (ТОЛЬКО JSON, без лишнего текста):
[
  {
    "title": "Конкретное название рекомендации",
    "description": "Подробное описание с учетом персональных данных пациента. Указывайте конкретные цифры и сроки.",
    "category": "Мониторинг|Питание|Активность|Лечение|Образ жизни|Диагностика",
    "priority": "high|medium|low"
  }
]

ПРИОРИТЕТЫ:
- high: критически важно для управления заболеванием
- medium: важно для улучшения состояния
- low: полезно для общего здоровья

НЕ НАЗНАЧАЙ конкретные лекарства, только общие категории препаратов.`
        }]
      })
    });

    if (!response.ok) {
      console.error('Ошибка Anthropic API:', response.status, await response.text());
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Получен ответ от Anthropic API');
    
    const content = data.content[0]?.text;
    
    if (content) {
      try {
        // Извлекаем JSON из ответа (может быть обернут в ```json)
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        const jsonString = jsonMatch ? jsonMatch[0] : content;
        
        const recommendations = JSON.parse(jsonString);
        console.log('Рекомендации успешно сгенерированы:', recommendations.length);
        return recommendations;
      } catch (parseError) {
        console.error('Ошибка парсинга JSON от API:', parseError);
        console.log('Полученный контент:', content);
      }
    }
  } catch (error) {
    console.error('Ошибка при вызове Anthropic API:', error);
  }

  // Fallback к улучшенным mock рекомендациям
  console.log('Используем fallback рекомендации');
  return generateMockRecommendations(diagnosis, context);
}

function generateMockRecommendations(diagnosis: string, context: any): any[] {
  const recommendations = [];
  
  // Анализируем диагноз для создания релевантных рекомендаций
  const diagnosisLower = diagnosis.toLowerCase();
  
  // Базовые рекомендации в зависимости от диагноза
  if (diagnosisLower.includes('гипертон') || diagnosisLower.includes('давление')) {
    recommendations.push({
      title: 'Контроль артериального давления',
      description: `Ежедневно измеряйте давление утром и вечером. ${context.userProfile?.age > 60 ? 'Целевое значение для вашего возраста: менее 140/90 мм рт.ст.' : 'Целевые значения: менее 130/80 мм рт.ст.'}`,
      category: 'Мониторинг',
      priority: 'high'
    });
    
    recommendations.push({
      title: 'Ограничение натрия',
      description: 'Снизьте потребление соли до 5г в сутки. Исключите копчености, консервы, готовые соусы.',
      category: 'Питание',
      priority: 'high'
    });
  }
  
  if (diagnosisLower.includes('аритм') || diagnosisLower.includes('сердц')) {
    recommendations.push({
      title: 'Мониторинг ритма сердца',
      description: `${context.fileInfo.hasFile ? 'На основе вашей ЭКГ рекомендуется' : 'Рекомендуется'} регулярный контроль пульса и ритма. При нарушениях ритма обращайтесь к врачу.`,
      category: 'Мониторинг',
      priority: 'high'
    });
  }

  // Рекомендации на основе биомаркеров
  if (context.recentBiomarkers?.length > 0) {
    const hasElevatedCholesterol = context.recentBiomarkers.some(b => 
      b.biomarker_name.toLowerCase().includes('холестерин') && b.value > 5.0
    );
    
    if (hasElevatedCholesterol) {
      recommendations.push({
        title: 'Коррекция уровня холестерина',
        description: 'Ваши анализы показывают повышенный холестерин. Увеличьте потребление омега-3, овсянки, орехов. Ограничьте насыщенные жиры.',
        category: 'Питание',
        priority: 'high'
      });
    }
  }

  // Рекомендации на основе показателей здоровья
  if (context.healthMetrics?.length > 0) {
    const avgSteps = calculateAverage(context.healthMetrics, 'steps');
    const avgSleep = calculateAverage(context.healthMetrics, 'sleep_hours');
    const avgStress = calculateAverage(context.healthMetrics, 'stress_level');
    
    if (avgSteps < 5000) {
      recommendations.push({
        title: 'Увеличение физической активности',
        description: `Ваша средняя активность: ${Math.round(avgSteps)} шагов в день. Постепенно увеличивайте до 8000-10000 шагов. Начните с ежедневных прогулок по 20-30 минут.`,
        category: 'Активность',
        priority: 'medium'
      });
    }
    
    if (avgSleep < 7) {
      recommendations.push({
        title: 'Нормализация сна',
        description: `Ваш средний сон: ${avgSleep.toFixed(1)} часов. Стремитесь к 7-9 часам качественного сна. Соблюдайте режим, избегайте экранов за час до сна.`,
        category: 'Образ жизни',
        priority: 'medium'
      });
    }
    
    if (avgStress > 6) {
      recommendations.push({
        title: 'Управление стрессом',
        description: `Ваш уровень стресса повышен (${avgStress.toFixed(1)}/10). Практикуйте дыхательные упражнения, медитацию или йогу по 10-15 минут ежедневно.`,
        category: 'Образ жизни',
        priority: 'medium'
      });
    }
  }

  // Общие рекомендации
  if (recommendations.length < 4) {
    recommendations.push({
      title: 'Регулярные обследования',
      description: 'Проходите профилактические осмотры каждые 6 месяцев. Контролируйте основные показатели здоровья.',
      category: 'Диагностика',
      priority: 'medium'
    });
    
    recommendations.push({
      title: 'Здоровое питание',
      description: 'Придерживайтесь средиземноморской диеты: больше овощей, фруктов, рыбы, цельнозерновых продуктов.',
      category: 'Питание',
      priority: 'medium'
    });
  }

  return recommendations.slice(0, 6); // Ограничиваем до 6 рекомендаций
}

function calculateAverage(metrics: any[], field: string): number {
  if (!metrics?.length) return 0;
  
  const values = metrics
    .map(m => m[field])
    .filter(v => v !== null && v !== undefined && !isNaN(v));
    
  if (values.length === 0) return 0;
  
  return values.reduce((sum, val) => sum + Number(val), 0) / values.length;
}