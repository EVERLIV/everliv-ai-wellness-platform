
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { analyses, userId } = await req.json();

    // Создаем клиент Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Получаем профиль пользователя
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Генерируем комплексную аналитику
    const healthData = await generateComprehensiveAnalytics(analyses, profile);

    return new Response(JSON.stringify({ healthData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating health analytics:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateComprehensiveAnalytics(analyses: any[], profile: any) {
  // Извлекаем все биомаркеры из всех анализов
  const allBiomarkers = extractAllBiomarkers(analyses);
  
  // Анализируем тренды и динамику
  const trendsAnalysis = analyzeTrends(allBiomarkers);
  
  // Рассчитываем общий балл здоровья
  const healthScore = calculateOverallHealthScore(allBiomarkers, profile);
  
  // Определяем уровень риска
  const riskLevel = determineOverallRiskLevel(allBiomarkers, profile);
  
  // Генерируем действенные рекомендации
  const healthImprovementActions = generateHealthImprovementActions(allBiomarkers, profile, trendsAnalysis);
  
  // Рекомендуемые медицинские тесты
  const recommendedTests = generateRecommendedTests(allBiomarkers, profile);
  
  // Консультации специалистов
  const specialistConsultations = generateSpecialistRecommendations(allBiomarkers, profile);
  
  // Ключевые показатели здоровья
  const keyHealthIndicators = generateKeyHealthIndicators(allBiomarkers, profile);
  
  // Рекомендации по образу жизни
  const lifestyleRecommendations = generateLifestyleRecommendations(allBiomarkers, profile);
  
  // Факторы риска
  const riskFactors = identifyComprehensiveRiskFactors(allBiomarkers, profile, trendsAnalysis);
  
  // Персональные добавки
  const supplements = recommendPersonalizedSupplements(allBiomarkers, profile);

  return {
    overview: {
      healthScore,
      riskLevel,
      lastUpdated: new Date().toISOString(),
      totalAnalyses: analyses.length,
      trendsAnalysis
    },
    biomarkers: allBiomarkers.slice(0, 10), // Показываем только последние ключевые
    healthImprovementActions,
    recommendedTests,
    specialistConsultations,
    keyHealthIndicators,
    lifestyleRecommendations,
    riskFactors,
    supplements
  };
}

function extractAllBiomarkers(analyses: any[]) {
  const biomarkersMap = new Map();
  
  for (const analysis of analyses) {
    if (analysis.results?.markers) {
      for (const marker of analysis.results.markers) {
        const key = marker.name;
        if (!biomarkersMap.has(key)) {
          biomarkersMap.set(key, []);
        }
        biomarkersMap.get(key).push({
          id: `${analysis.id}_${marker.name}`,
          name: marker.name,
          value: parseFloat(marker.value) || 0,
          unit: marker.unit || '',
          status: marker.status || 'unknown',
          referenceRange: marker.reference_range || 'Н/Д',
          date: analysis.created_at,
          analysisType: analysis.analysis_type
        });
      }
    }
  }
  
  // Берем последние значения для каждого биомаркера и добавляем тренд
  const latestBiomarkers = [];
  biomarkersMap.forEach((values, name) => {
    values.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const latest = values[0];
    latest.trend = calculateTrend(values);
    latest.lastMeasured = latest.date;
    latestBiomarkers.push(latest);
  });
  
  return latestBiomarkers;
}

function calculateTrend(values: any[]) {
  if (values.length < 2) return 'stable';
  
  const latest = values[0].value;
  const previous = values[1].value;
  
  const change = ((latest - previous) / previous) * 100;
  
  if (change > 5) return 'up';
  if (change < -5) return 'down';
  return 'stable';
}

function analyzeTrends(biomarkers: any[]) {
  const improving = biomarkers.filter(b => 
    (b.trend === 'up' && ['optimal', 'good'].includes(b.status)) ||
    (b.trend === 'down' && ['attention', 'risk'].includes(b.status))
  ).length;
  
  const worsening = biomarkers.filter(b => 
    (b.trend === 'down' && ['optimal', 'good'].includes(b.status)) ||
    (b.trend === 'up' && ['attention', 'risk'].includes(b.status))
  ).length;
  
  const stable = biomarkers.filter(b => b.trend === 'stable').length;
  
  return { improving, worsening, stable };
}

function calculateOverallHealthScore(biomarkers: any[], profile: any) {
  if (biomarkers.length === 0) return 75;
  
  let totalScore = 0;
  let weightedSum = 0;
  
  const criticalMarkers = ['холестерин', 'глюкоза', 'давление', 'гемоглобин'];
  
  for (const marker of biomarkers) {
    let score = 0;
    let weight = 1;
    
    // Повышенный вес для критических маркеров
    if (criticalMarkers.some(critical => marker.name.toLowerCase().includes(critical))) {
      weight = 2;
    }
    
    switch (marker.status) {
      case 'optimal':
        score = 100;
        break;
      case 'good':
        score = 85;
        break;
      case 'attention':
        score = 60;
        break;
      case 'risk':
        score = 30;
        break;
      default:
        score = 70;
    }
    
    // Учитываем тренд
    if (marker.trend === 'up' && ['optimal', 'good'].includes(marker.status)) {
      score += 5;
    } else if (marker.trend === 'down' && ['attention', 'risk'].includes(marker.status)) {
      score += 5;
    } else if (marker.trend === 'down' && ['optimal', 'good'].includes(marker.status)) {
      score -= 10;
    } else if (marker.trend === 'up' && ['attention', 'risk'].includes(marker.status)) {
      score -= 10;
    }
    
    totalScore += score * weight;
    weightedSum += weight;
  }
  
  let finalScore = Math.round(totalScore / weightedSum);
  
  // Возрастные корректировки
  if (profile?.date_of_birth) {
    const age = calculateAge(profile.date_of_birth);
    if (age > 60) finalScore = Math.max(finalScore - 5, 0);
    if (age > 70) finalScore = Math.max(finalScore - 10, 0);
  }
  
  return Math.min(Math.max(finalScore, 0), 100);
}

function determineOverallRiskLevel(biomarkers: any[], profile: any) {
  const riskCount = biomarkers.filter(m => m.status === 'risk').length;
  const attentionCount = biomarkers.filter(m => m.status === 'attention').length;
  const worseningTrends = biomarkers.filter(m => 
    (m.trend === 'down' && ['optimal', 'good'].includes(m.status)) ||
    (m.trend === 'up' && ['attention', 'risk'].includes(m.status))
  ).length;
  
  if (riskCount > 2 || (riskCount > 0 && worseningTrends > 2)) return 'high';
  if (riskCount > 0 || attentionCount > 2 || worseningTrends > 1) return 'medium';
  return 'low';
}

function generateHealthImprovementActions(biomarkers: any[], profile: any, trendsAnalysis: any) {
  const actions = [];
  
  // Анализируем проблемные области
  const cholesterolIssues = biomarkers.filter(b => 
    b.name.toLowerCase().includes('холестерин') && ['attention', 'risk'].includes(b.status)
  );
  
  const glucoseIssues = biomarkers.filter(b => 
    (b.name.toLowerCase().includes('глюкоза') || b.name.toLowerCase().includes('гликированный')) 
    && ['attention', 'risk'].includes(b.status)
  );
  
  const vitaminDeficiencies = biomarkers.filter(b => 
    b.name.toLowerCase().includes('витамин') && ['attention', 'risk'].includes(b.status)
  );
  
  const ironIssues = biomarkers.filter(b => 
    (b.name.toLowerCase().includes('железо') || b.name.toLowerCase().includes('гемоглобин') || 
     b.name.toLowerCase().includes('ферритин')) && ['attention', 'risk'].includes(b.status)
  );
  
  // Генерируем конкретные действия
  if (cholesterolIssues.length > 0) {
    actions.push({
      id: 'cholesterol_management',
      category: 'Сердечно-сосудистая система',
      title: 'Нормализация уровня холестерина',
      priority: cholesterolIssues.some(i => i.status === 'risk') ? 'high' : 'medium',
      actions: [
        'Исключить трансжиры и ограничить насыщенные жиры до <10% калорий',
        'Добавить 25-30г клетчатки в день (овсянка, бобовые, овощи)',
        'Включить омега-3: жирная рыба 2-3 раза в неделю',
        'Кардиотренировки 150 минут в неделю умеренной интенсивности'
      ],
      expectedResult: 'Снижение общего холестерина на 10-15% за 2-3 месяца'
    });
  }
  
  if (glucoseIssues.length > 0) {
    actions.push({
      id: 'glucose_control',
      category: 'Метаболизм',
      title: 'Контроль уровня глюкозы',
      priority: glucoseIssues.some(i => i.status === 'risk') ? 'high' : 'medium',
      actions: [
        'Ограничить простые углеводы и сахар',
        'Питание каждые 3-4 часа небольшими порциями',
        'Добавить 10-15 минут ходьбы после каждого приема пищи',
        'Включить продукты с низким гликемическим индексом'
      ],
      expectedResult: 'Стабилизация уровня глюкозы за 4-6 недель'
    });
  }
  
  if (vitaminDeficiencies.length > 0) {
    actions.push({
      id: 'vitamin_optimization',
      category: 'Витаминный статус',
      title: 'Коррекция дефицитов витаминов',
      priority: 'medium',
      actions: [
        'Ежедневно 15-20 минут на солнце для витамина D',
        'Включить в рацион продукты, богатые дефицитными витаминами',
        'Рассмотреть качественные добавки после консультации с врачом',
        'Контрольный анализ через 2-3 месяца'
      ],
      expectedResult: 'Нормализация уровня витаминов за 2-3 месяца'
    });
  }
  
  if (ironIssues.length > 0) {
    actions.push({
      id: 'iron_management',
      category: 'Кроветворение',
      title: 'Коррекция железодефицита',
      priority: ironIssues.some(i => i.status === 'risk') ? 'high' : 'medium',
      actions: [
        'Включить красное мясо, печень 2-3 раза в неделю',
        'Принимать железосодержащие продукты с витамином C',
        'Избегать чая/кофе во время еды (снижают усвоение железа)',
        'Рассмотреть добавки железа по назначению врача'
      ],
      expectedResult: 'Улучшение показателей железа за 6-8 недель'
    });
  }
  
  // Общие рекомендации на основе возраста и пола
  if (profile) {
    const age = profile.date_of_birth ? calculateAge(profile.date_of_birth) : null;
    
    if (age && age > 40) {
      actions.push({
        id: 'age_related_prevention',
        category: 'Возрастная профилактика',
        title: 'Предотвращение возрастных изменений',
        priority: 'medium',
        actions: [
          'Силовые тренировки 2-3 раза в неделю для сохранения мышечной массы',
          'Регулярные кардиологические обследования',
          'Контроль плотности костной ткани',
          'Когнитивные тренировки и социальная активность'
        ],
        expectedResult: 'Замедление возрастных изменений'
      });
    }
    
    if (profile.gender === 'female' && age && age > 35) {
      actions.push({
        id: 'female_health',
        category: 'Женское здоровье',
        title: 'Поддержка женского здоровья',
        priority: 'medium',
        actions: [
          'Регулярный контроль гормонального фона',
          'Достаточное потребление кальция и магния',
          'Профилактика остеопороза',
          'Контроль веса и метаболических показателей'
        ],
        expectedResult: 'Поддержание гормонального баланса'
      });
    }
  }
  
  // Если тренды ухудшаются
  if (trendsAnalysis.worsening > trendsAnalysis.improving) {
    actions.push({
      id: 'trend_reversal',
      category: 'Срочные меры',
      title: 'Остановка негативных трендов',
      priority: 'high',
      actions: [
        'Комплексное медицинское обследование в течение 2 недель',
        'Анализ факторов стресса и их устранение',
        'Оптимизация режима сна (7-9 часов)',
        'Временное усиление контроля за питанием и активностью'
      ],
      expectedResult: 'Стабилизация показателей за 4-6 недель'
    });
  }
  
  return actions;
}

function generateRecommendedTests(biomarkers: any[], profile: any) {
  const tests = [];
  const age = profile?.date_of_birth ? calculateAge(profile.date_of_birth) : null;
  
  // Базовые тесты на основе имеющихся данных
  const hasRecentBlood = biomarkers.some(b => 
    new Date(b.date) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
  );
  
  if (!hasRecentBlood) {
    tests.push({
      id: 'complete_blood_panel',
      name: 'Расширенный анализ крови',
      frequency: 'Каждые 3-6 месяцев',
      priority: 'high',
      reason: 'Базовая оценка состояния здоровья и мониторинг динамики',
      includes: ['Общий анализ крови', 'Биохимия', 'Липидный профиль', 'Гормоны щитовидной железы']
    });
  }
  
  // Специфичные тесты на основе проблем
  const hasCardiovascularRisks = biomarkers.some(b => 
    (b.name.toLowerCase().includes('холестерин') || b.name.toLowerCase().includes('давление')) 
    && ['attention', 'risk'].includes(b.status)
  );
  
  if (hasCardiovascularRisks) {
    tests.push({
      id: 'cardiovascular_screening',
      name: 'Кардиологическое обследование',
      frequency: 'Каждые 6-12 месяцев',
      priority: 'high',
      reason: 'Выявленные риски сердечно-сосудистых заболеваний',
      includes: ['ЭКГ', 'ЭХО сердца', 'Стресс-тест', 'Артериальное давление 24ч']
    });
  }
  
  const hasMetabolicIssues = biomarkers.some(b => 
    b.name.toLowerCase().includes('глюкоза') && ['attention', 'risk'].includes(b.status)
  );
  
  if (hasMetabolicIssues) {
    tests.push({
      id: 'diabetes_screening',
      name: 'Диагностика диабета',
      frequency: 'Каждые 3-6 месяцев',
      priority: 'high',
      reason: 'Нарушения углеводного обмена',
      includes: ['Глюкоза натощак', 'HbA1c', 'ОГТТ', 'Инсулин', 'С-пептид']
    });
  }
  
  // Возрастные рекомендации
  if (age && age > 40) {
    tests.push({
      id: 'cancer_screening',
      name: 'Онкологический скрининг',
      frequency: 'Ежегодно',
      priority: 'medium',
      reason: 'Возрастная профилактика онкологических заболеваний',
      includes: ['Онкомаркеры', 'КТ органов грудной клетки', 'Колоноскопия (каждые 5 лет)']
    });
  }
  
  if (profile?.gender === 'female') {
    tests.push({
      id: 'female_health_screening',
      name: 'Женское здоровье',
      frequency: 'Ежегодно',
      priority: 'medium',
      reason: 'Профилактика заболеваний репродуктивной системы',
      includes: ['Гинекологический осмотр', 'УЗИ малого таза', 'Маммография (после 40 лет)', 'Цитология']
    });
  }
  
  if (profile?.gender === 'male' && age && age > 45) {
    tests.push({
      id: 'male_health_screening',
      name: 'Мужское здоровье',
      frequency: 'Ежегодно',
      priority: 'medium',
      reason: 'Профилактика заболеваний предстательной железы',
      includes: ['ПСА', 'УЗИ предстательной железы', 'Урологический осмотр']
    });
  }
  
  // Проверка дефицитов
  const hasVitaminIssues = biomarkers.some(b => 
    b.name.toLowerCase().includes('витамин') && ['attention', 'risk'].includes(b.status)
  );
  
  if (hasVitaminIssues) {
    tests.push({
      id: 'vitamin_panel',
      name: 'Витаминный статус',
      frequency: 'Каждые 6 месяцев',
      priority: 'medium',
      reason: 'Контроль коррекции витаминных дефицитов',
      includes: ['Витамин D', 'B12', 'Фолиевая кислота', 'Витамин B6', 'Железо и ферритин']
    });
  }
  
  return tests;
}

function generateSpecialistRecommendations(biomarkers: any[], profile: any) {
  const specialists = [];
  const age = profile?.date_of_birth ? calculateAge(profile.date_of_birth) : null;
  
  // Кардиолог
  const cardioRisks = biomarkers.filter(b => 
    (b.name.toLowerCase().includes('холестерин') || b.name.toLowerCase().includes('давление')) 
    && ['attention', 'risk'].includes(b.status)
  );
  
  if (cardioRisks.length > 0) {
    specialists.push({
      id: 'cardiologist',
      specialist: 'Кардиолог',
      urgency: cardioRisks.some(r => r.status === 'risk') ? 'В течение 2 недель' : 'В течение месяца',
      reason: 'Выявлены нарушения сердечно-сосудистой системы',
      purpose: 'Оценка рисков, назначение лечения, профилактические рекомендации',
      preparation: 'Принести результаты всех анализов, список принимаемых препаратов'
    });
  }
  
  // Эндокринолог
  const endocrineIssues = biomarkers.filter(b => 
    (b.name.toLowerCase().includes('глюкоза') || b.name.toLowerCase().includes('инсулин') || 
     b.name.toLowerCase().includes('ттг') || b.name.toLowerCase().includes('т4')) 
    && ['attention', 'risk'].includes(b.status)
  );
  
  if (endocrineIssues.length > 0) {
    specialists.push({
      id: 'endocrinologist',
      specialist: 'Эндокринолог',
      urgency: endocrineIssues.some(i => i.status === 'risk') ? 'В течение 2 недель' : 'В течение месяца',
      reason: 'Нарушения эндокринной системы и метаболизма',
      purpose: 'Диагностика диабета/предиабета, коррекция гормональных нарушений',
      preparation: 'Анализы натощак, дневник питания за неделю'
    });
  }
  
  // Гематолог
  const bloodIssues = biomarkers.filter(b => 
    (b.name.toLowerCase().includes('гемоглобин') || b.name.toLowerCase().includes('железо') || 
     b.name.toLowerCase().includes('эритроциты') || b.name.toLowerCase().includes('лейкоциты')) 
    && ['attention', 'risk'].includes(b.status)
  );
  
  if (bloodIssues.length > 0) {
    specialists.push({
      id: 'hematologist',
      specialist: 'Гематолог',
      urgency: 'В течение месяца',
      reason: 'Нарушения показателей крови',
      purpose: 'Диагностика анемии, нарушений свертываемости',
      preparation: 'Общий анализ крови с лейкоформулой, коагулограмма'
    });
  }
  
  // Терапевт (базовая консультация)
  if (specialists.length === 0 && biomarkers.some(b => ['attention', 'risk'].includes(b.status))) {
    specialists.push({
      id: 'general_practitioner',
      specialist: 'Терапевт',
      urgency: 'В течение месяца',
      reason: 'Общая оценка состояния здоровья и планирование дальнейших действий',
      purpose: 'Комплексная оценка, направления к узким специалистам',
      preparation: 'Все имеющиеся анализы, список жалоб и симптомов'
    });
  }
  
  // Возрастные рекомендации
  if (age && age > 50) {
    specialists.push({
      id: 'preventive_checkup',
      specialist: 'Врач профилактической медицины',
      urgency: 'Ежегодно',
      reason: 'Возрастная профилактика и раннее выявление заболеваний',
      purpose: 'Комплексное обследование, скрининг онкологии',
      preparation: 'Подготовка к расширенному обследованию'
    });
  }
  
  return specialists;
}

function generateKeyHealthIndicators(biomarkers: any[], profile: any) {
  const indicators = [];
  const age = profile?.date_of_birth ? calculateAge(profile.date_of_birth) : null;
  
  // Ключевые показатели на основе возраста и пола
  indicators.push({
    id: 'cardiovascular_health',
    category: 'Сердечно-сосудистая система',
    indicators: [
      {
        name: 'Общий холестерин',
        target: '< 5.2 ммоль/л',
        importance: 'Основной фактор риска атеросклероза',
        frequency: 'Каждые 3-6 месяцев'
      },
      {
        name: 'ЛПНП ("плохой" холестерин)',
        target: '< 3.0 ммоль/л',
        importance: 'Прямой фактор развития атеросклероза',
        frequency: 'Каждые 3-6 месяцев'
      },
      {
        name: 'Артериальное давление',
        target: '< 130/80 мм рт.ст.',
        importance: 'Контроль гипертонии и рисков инсульта',
        frequency: 'Ежедневно при проблемах'
      }
    ]
  });
  
  indicators.push({
    id: 'metabolic_health',
    category: 'Метаболическое здоровье',
    indicators: [
      {
        name: 'Глюкоза натощак',
        target: '3.9-5.9 ммоль/л',
        importance: 'Ранняя диагностика диабета',
        frequency: 'Каждые 3-6 месяцев'
      },
      {
        name: 'HbA1c (при наличии)',
        target: '< 5.7%',
        importance: 'Долгосрочный контроль сахара',
        frequency: 'Каждые 3-6 месяцев при рисках'
      },
      {
        name: 'Индекс массы тела',
        target: '18.5-24.9 кг/м²',
        importance: 'Контроль веса и метаболических рисков',
        frequency: 'Еженедельно'
      }
    ]
  });
  
  indicators.push({
    id: 'vital_nutrients',
    category: 'Витаминно-минеральный статус',
    indicators: [
      {
        name: 'Витамин D',
        target: '30-100 нг/мл',
        importance: 'Иммунитет, здоровье костей, настроение',
        frequency: 'Каждые 6 месяцев'
      },
      {
        name: 'Витамин B12',
        target: '> 300 пг/мл',
        importance: 'Нервная система, энергетический обмен',
        frequency: 'Ежегодно или при симптомах'
      },
      {
        name: 'Ферритин',
        target: profile?.gender === 'female' ? '15-150 нг/мл' : '30-400 нг/мл',
        importance: 'Запасы железа, профилактика анемии',
        frequency: 'Каждые 6-12 месяцев'
      }
    ]
  });
  
  // Возрастные и гендерные особенности
  if (profile?.gender === 'female') {
    indicators.push({
      id: 'female_health',
      category: 'Женское здоровье',
      indicators: [
        {
          name: 'Гемоглобин',
          target: '120-140 г/л',
          importance: 'Профилактика железодефицитной анемии',
          frequency: 'Каждые 3-6 месяцев'
        },
        {
          name: 'Фолиевая кислота',
          target: '> 3 нг/мл',
          importance: 'Репродуктивное здоровье, профилактика анемии',
          frequency: 'Ежегодно'
        }
      ]
    });
  }
  
  if (age && age > 50) {
    indicators.push({
      id: 'age_related',
      category: 'Возрастные показатели',
      indicators: [
        {
          name: 'ПСА (для мужчин)',
          target: '< 4.0 нг/мл',
          importance: 'Ранняя диагностика рака простаты',
          frequency: 'Ежегодно после 50 лет'
        },
        {
          name: 'Плотность костной ткани',
          target: 'T-score > -1.0',
          importance: 'Профилактика остеопороза',
          frequency: 'Каждые 2-3 года'
        },
        {
          name: 'Креатинин',
          target: '< 115 мкмоль/л',
          importance: 'Контроль функции почек',
          frequency: 'Каждые 6-12 месяцев'
        }
      ]
    });
  }
  
  return indicators;
}

function generateLifestyleRecommendations(biomarkers: any[], profile: any) {
  const recommendations = [];
  const age = profile?.date_of_birth ? calculateAge(profile.date_of_birth) : null;
  
  // Питание
  const nutritionRecs = {
    id: 'nutrition',
    category: 'Питание',
    recommendations: []
  };
  
  const hasCardioRisks = biomarkers.some(b => 
    b.name.toLowerCase().includes('холестерин') && ['attention', 'risk'].includes(b.status)
  );
  
  if (hasCardioRisks) {
    nutritionRecs.recommendations.push({
      advice: 'Средиземноморская диета',
      benefit: 'Снижение холестерина и воспаления',
      howTo: 'Больше рыбы, оливкового масла, орехов, овощей и фруктов'
    });
  }
  
  const hasMetabolicIssues = biomarkers.some(b => 
    b.name.toLowerCase().includes('глюкоза') && ['attention', 'risk'].includes(b.status)
  );
  
  if (hasMetabolicIssues) {
    nutritionRecs.recommendations.push({
      advice: 'Контроль гликемического индекса',
      benefit: 'Стабилизация уровня сахара в крови',
      howTo: 'Цельнозерновые продукты, белок в каждом приеме пищи, ограничение сладкого'
    });
  }
  
  nutritionRecs.recommendations.push({
    advice: 'Адекватная гидратация',
    benefit: 'Улучшение метаболизма и детоксикации',
    howTo: '30-35 мл воды на кг веса в день, больше при физических нагрузках'
  });
  
  recommendations.push(nutritionRecs);
  
  // Физическая активность
  const activityRecs = {
    id: 'physical_activity',
    category: 'Физическая активность',
    recommendations: [
      {
        advice: 'Кардиотренировки',
        benefit: 'Улучшение сердечно-сосудистой системы и обмена веществ',
        howTo: '150 минут умеренной активности в неделю (ходьба, плавание, велосипед)'
      },
      {
        advice: 'Силовые тренировки',
        benefit: 'Сохранение мышечной массы и плотности костей',
        howTo: '2-3 раза в неделю, все группы мышц'
      },
      {
        advice: 'Ежедневная активность',
        benefit: 'Поддержание метаболизма в течение дня',
        howTo: 'Минимум 8000-10000 шагов в день, перерывы каждый час'
      }
    ]
  };
  
  recommendations.push(activityRecs);
  
  // Сон и восстановление
  const sleepRecs = {
    id: 'sleep_recovery',
    category: 'Сон и восстановление',
    recommendations: [
      {
        advice: 'Качественный сон',
        benefit: 'Восстановление и регуляция гормонов',
        howTo: '7-9 часов сна, одинаковое время отхода ко сну, темная прохладная комната'
      },
      {
        advice: 'Управление стрессом',
        benefit: 'Снижение кортизола и воспаления',
        howTo: 'Медитация, йога, дыхательные практики, хобби'
      },
      {
        advice: 'Регулярность режима',
        benefit: 'Синхронизация биологических ритмов',
        howTo: 'Одинаковое время приема пищи, сна и активности'
      }
    ]
  };
  
  recommendations.push(sleepRecs);
  
  // Профилактика
  const preventionRecs = {
    id: 'prevention',
    category: 'Профилактика',
    recommendations: [
      {
        advice: 'Регулярные медосмотры',
        benefit: 'Раннее выявление проблем со здоровьем',
        howTo: 'Ежегодный чек-ап, специализированные обследования по возрасту'
      },
      {
        advice: 'Вакцинация',
        benefit: 'Защита от инфекционных заболеваний',
        howTo: 'Согласно национальному календарю, дополнительно по рискам'
      }
    ]
  };
  
  if (age && age > 40) {
    preventionRecs.recommendations.push({
      advice: 'Онкологический скрининг',
      benefit: 'Раннее выявление онкологии',
      howTo: 'Маммография, колоноскопия, анализы на онкомаркеры по возрасту'
    });
  }
  
  recommendations.push(preventionRecs);
  
  // Дополнительные рекомендации для проблемных областей
  const hasVitaminIssues = biomarkers.some(b => 
    b.name.toLowerCase().includes('витамин') && ['attention', 'risk'].includes(b.status)
  );
  
  if (hasVitaminIssues) {
    recommendations.push({
      id: 'supplements',
      category: 'Добавки и витамины',
      recommendations: [
        {
          advice: 'Персонализированная витаминотерапия',
          benefit: 'Коррекция выявленных дефицитов',
          howTo: 'По результатам анализов, с контролем через 2-3 месяца'
        },
        {
          advice: 'Натуральные источники витаминов',
          benefit: 'Лучшая усвояемость и синергия',
          howTo: 'Разнообразное питание, сезонные овощи и фрукты'
        }
      ]
    });
  }
  
  return recommendations;
}

function identifyComprehensiveRiskFactors(biomarkers: any[], profile: any, trendsAnalysis: any) {
  const riskFactors = [];
  
  // Анализируем критические риски
  const criticalMarkers = biomarkers.filter(b => b.status === 'risk');
  const attentionMarkers = biomarkers.filter(b => b.status === 'attention');
  const worseningTrends = biomarkers.filter(b => 
    (b.trend === 'down' && ['optimal', 'good'].includes(b.status)) ||
    (b.trend === 'up' && ['attention', 'risk'].includes(b.status))
  );
  
  // Сердечно-сосудистые риски
  const cardioRisks = criticalMarkers.filter(b => 
    b.name.toLowerCase().includes('холестерин') || b.name.toLowerCase().includes('давление')
  );
  
  if (cardioRisks.length > 0) {
    riskFactors.push({
      id: 'cardiovascular_risk',
      factor: 'Высокий сердечно-сосудистый риск',
      level: 'high',
      description: `Критические нарушения: ${cardioRisks.map(r => r.name).join(', ')}. Риск инфаркта и инсульта.`,
      mitigation: 'Срочная консультация кардиолога, коррекция образа жизни, возможна медикаментозная терапия',
      timeframe: 'Действовать в течение 1-2 недель'
    });
  }
  
  // Метаболические риски
  const metabolicRisks = criticalMarkers.filter(b => 
    b.name.toLowerCase().includes('глюкоза') || b.name.toLowerCase().includes('инсулин')
  );
  
  if (metabolicRisks.length > 0) {
    riskFactors.push({
      id: 'diabetes_risk',
      factor: 'Риск развития диабета',
      level: 'high',
      description: `Нарушения углеводного обмена: ${metabolicRisks.map(r => r.name).join(', ')}`,
      mitigation: 'Консультация эндокринолога, строгий контроль питания, регулярные физические нагрузки',
      timeframe: 'Начать изменения немедленно'
    });
  }
  
  // Риски дефицитов
  const vitaminDeficits = criticalMarkers.filter(b => 
    b.name.toLowerCase().includes('витамин') || b.name.toLowerCase().includes('железо')
  );
  
  if (vitaminDeficits.length > 0) {
    riskFactors.push({
      id: 'nutritional_deficiency',
      factor: 'Серьезные нутритивные дефициты',
      level: 'medium',
      description: `Критические дефициты: ${vitaminDeficits.map(v => v.name).join(', ')}. Риск анемии, нарушений иммунитета`,
      mitigation: 'Коррекция питания, качественные добавки, контрольные анализы через 2-3 месяца',
      timeframe: 'Начать коррекцию в течение недели'
    });
  }
  
  // Риски ухудшающихся трендов
  if (trendsAnalysis.worsening > trendsAnalysis.improving + 1) {
    riskFactors.push({
      id: 'negative_trends',
      factor: 'Негативная динамика показателей здоровья',
      level: 'medium',
      description: `${trendsAnalysis.worsening} показателей ухудшаются, что может указывать на системные проблемы`,
      mitigation: 'Комплексное обследование, анализ образа жизни, коррекция факторов риска',
      timeframe: 'Обследование в течение месяца'
    });
  }
  
  // Возрастные риски
  if (profile?.date_of_birth) {
    const age = calculateAge(profile.date_of_birth);
    
    if (age > 50 && attentionMarkers.length > 2) {
      riskFactors.push({
        id: 'age_related_decline',
        factor: 'Возрастные изменения здоровья',
        level: 'medium',
        description: `В возрасте ${age} лет множественные отклонения требуют пристального внимания`,
        mitigation: 'Активная профилактика, регулярные обследования, поддержка здорового образа жизни',
        timeframe: 'Постоянный мониторинг'
      });
    }
    
    if (age > 65) {
      riskFactors.push({
        id: 'elderly_health_risks',
        factor: 'Специфические риски пожилого возраста',
        level: 'medium',
        description: 'Повышенные риски сердечно-сосудистых заболеваний, остеопороза, когнитивных нарушений',
        mitigation: 'Комплексная гериатрическая оценка, профилактика падений, когнитивная стимуляция',
        timeframe: 'Регулярное наблюдение каждые 3-6 месяцев'
      });
    }
  }
  
  // Гендерные риски
  if (profile?.gender === 'female') {
    const femaleRisks = biomarkers.filter(b => 
      (b.name.toLowerCase().includes('железо') || b.name.toLowerCase().includes('гемоглобин')) 
      && ['attention', 'risk'].includes(b.status)
    );
    
    if (femaleRisks.length > 0) {
      riskFactors.push({
        id: 'female_anemia_risk',
        factor: 'Риск железодефицитной анемии',
        level: 'medium',
        description: 'Низкие показатели железа/гемоглобина характерны для женщин репродуктивного возраста',
        mitigation: 'Коррекция питания, добавки железа, контроль менструального цикла',
        timeframe: 'Начать коррекцию немедленно'
      });
    }
  }
  
  return riskFactors;
}

function recommendPersonalizedSupplements(biomarkers: any[], profile: any) {
  const supplements = [];
  
  // Анализируем дефициты для персонализированных рекомендаций
  for (const marker of biomarkers) {
    const markerName = marker.name.toLowerCase();
    
    if (marker.status === 'attention' || marker.status === 'risk') {
      // Витамин D
      if (markerName.includes('витамин d')) {
        supplements.push({
          id: `vitamin_d_${marker.id}`,
          name: 'Витамин D3 (холекальциферол)',
          dosage: marker.status === 'risk' ? '4000-5000 МЕ/день' : '2000-3000 МЕ/день',
          benefit: 'Поддержка иммунитета, здоровья костей, настроения и мышечной функции',
          timing: 'Утром с жирной пищей (авокадо, орехи, масло)',
          duration: '3-6 месяцев с контрольным анализом',
          interactions: 'Улучшает усвоение кальция, принимать с магнием для лучшего эффекта',
          expectedImprovement: 'Повышение уровня до 40-60 нг/мл за 2-3 месяца'
        });
      }
      
      // Железо
      if (markerName.includes('железо') || markerName.includes('гемоглобин') || markerName.includes('ферритин')) {
        supplements.push({
          id: `iron_${marker.id}`,
          name: 'Железо в биодоступной форме (бисглицинат)',
          dosage: marker.status === 'risk' ? '25-30 мг элементарного железа/день' : '18-25 мг/день',
          benefit: 'Профилактика и лечение анемии, улучшение транспорта кислорода, повышение энергии',
          timing: 'Натощак за 1 час до еды с витамином C (апельсиновый сок)',
          duration: '3-6 месяцев с контролем ферритина',
          interactions: 'НЕ принимать с кальцием, чаем, кофе. Усиливается витамином C',
          expectedImprovement: 'Повышение гемоглобина на 10-20 г/л за 6-8 недель'
        });
      }
      
      // B12
      if (markerName.includes('b12') || markerName.includes('кобаламин')) {
        supplements.push({
          id: `b12_${marker.id}`,
          name: 'Витамин B12 (метилкобаламин)',
          dosage: marker.status === 'risk' ? '1000-2000 мкг/день' : '500-1000 мкг/день',
          benefit: 'Поддержка нервной системы, энергетического обмена, синтеза ДНК',
          timing: 'Утром сублингвально (под язык) на пустой желудок',
          duration: '2-3 месяца, затем поддерживающая доза',
          interactions: 'Синергия с фолиевой кислотой и B6',
          expectedImprovement: 'Нормализация уровня за 4-6 недель'
        });
      }
      
      // Фолиевая кислота
      if (markerName.includes('фолат') || markerName.includes('фолиевая')) {
        supplements.push({
          id: `folate_${marker.id}`,
          name: 'Фолиевая кислота (L-метилфолат)',
          dosage: '400-800 мкг/день',
          benefit: 'Поддержка сердечно-сосудистой системы, синтез ДНК, профилактика анемии',
          timing: 'С едой в любое время дня',
          duration: '2-3 месяца',
          interactions: 'Работает в синергии с B12 и B6',
          expectedImprovement: 'Нормализация за 6-8 недель'
        });
      }
    }
  }
  
  // Базовые добавки для общего здоровья
  const age = profile?.date_of_birth ? calculateAge(profile.date_of_birth) : null;
  
  // Омега-3 для всех
  if (!supplements.find(s => s.name.includes('Омега'))) {
    supplements.push({
      id: 'omega3_basic',
      name: 'Омега-3 (EPA/DHA из рыбьего жира)',
      dosage: '1000-2000 мг/день (EPA 600-800 мг, DHA 400-600 мг)',
      benefit: 'Поддержка сердца, мозга, суставов, противовоспалительное действие',
      timing: 'С едой, лучше с жирной пищей',
      duration: 'Постоянно',
      interactions: 'Может усиливать действие антикоагулянтов',
      expectedImprovement: 'Улучшение липидного профиля за 6-8 недель'
    });
  }
  
  // Магний
  if (!supplements.find(s => s.name.includes('Магний'))) {
    supplements.push({
      id: 'magnesium_basic',
      name: 'Магний (глицинат или цитрат)',
      dosage: '300-400 мг/день',
      benefit: 'Поддержка мышечной и нервной функции, улучшение сна, регуляция давления',
      timing: 'Вечером за 1-2 часа до сна',
      duration: 'Постоянно',
      interactions: 'Улучшает усвоение витамина D, не принимать с железом',
      expectedImprovement: 'Улучшение сна и снижение мышечных спазмов за 2-4 недели'
    });
  }
  
  // Возрастные добавки
  if (age && age > 50) {
    supplements.push({
      id: 'coq10_age',
      name: 'Коэнзим Q10 (убихинол)',
      dosage: '100-200 мг/день',
      benefit: 'Поддержка сердечно-сосудистой системы, антиоксидантная защита, энергетический обмен',
      timing: 'С жирной пищей, лучше утром',
      duration: 'Курсами по 3-6 месяцев',
      interactions: 'Может снижать эффективность варфарина',
      expectedImprovement: 'Повышение энергии и выносливости за 4-6 недель'
    });
  }
  
  // Для женщин
  if (profile?.gender === 'female' && age && age < 50) {
    supplements.push({
      id: 'female_complex',
      name: 'Женский витаминно-минеральный комплекс',
      dosage: 'По инструкции (обычно 1-2 таблетки/день)',
      benefit: 'Поддержка женского здоровья, содержит железо, фолиевую кислоту, кальций',
      timing: 'Утром с завтраком',
      duration: 'Постоянно с перерывами',
      interactions: 'Комплексный состав, следить за суммарной дозировкой других добавок',
      expectedImprovement: 'Общее улучшение самочувствия за 4-6 недель'
    });
  }
  
  // Для людей с сердечно-сосудистыми рисками
  const hasCardioRisks = biomarkers.some(b => 
    (b.name.toLowerCase().includes('холестерин') || b.name.toLowerCase().includes('давление'))
    && ['attention', 'risk'].includes(b.status)
  );
  
  if (hasCardioRisks) {
    supplements.push({
      id: 'cardio_support',
      name: 'Натуральные статины (красный дрожжевой рис)',
      dosage: '600-1200 мг/день (содержащий 3-5 мг монаколина К)',
      benefit: 'Естественное снижение холестерина без побочных эффектов',
      timing: 'Вечером с едой',
      duration: '3-6 месяцев с контролем липидограммы',
      interactions: 'Не принимать со статинами, может взаимодействовать с варфарином',
      expectedImprovement: 'Снижение общего холестерина на 15-25% за 6-8 недель'
    });
  }
  
  return supplements.slice(0, 8); // Ограничиваем количество для удобства восприятия
}

function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}
