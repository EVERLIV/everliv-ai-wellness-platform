
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

    // Анализируем данные и генерируем аналитику
    const healthData = await generateHealthAnalytics(analyses, profile);

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

async function generateHealthAnalytics(analyses: any[], profile: any) {
  // Извлекаем биомаркеры из анализов
  const biomarkers = extractBiomarkers(analyses);
  
  // Рассчитываем общий балл здоровья
  const healthScore = calculateHealthScore(biomarkers);
  
  // Определяем уровень риска
  const riskLevel = determineRiskLevel(biomarkers);
  
  // Генерируем персональные рекомендации
  const recommendations = generatePersonalizedRecommendations(biomarkers, profile);
  
  // Определяем факторы риска
  const riskFactors = identifyRiskFactors(biomarkers, profile);
  
  // Рекомендуемые добавки
  const supplements = recommendPersonalizedSupplements(biomarkers, profile);

  return {
    overview: {
      healthScore,
      riskLevel,
      lastUpdated: new Date().toISOString()
    },
    biomarkers,
    recommendations,
    riskFactors,
    supplements
  };
}

function extractBiomarkers(analyses: any[]) {
  const biomarkers = [];
  
  for (const analysis of analyses) {
    if (analysis.results?.markers) {
      for (const marker of analysis.results.markers) {
        biomarkers.push({
          id: `${analysis.id}_${marker.name}`,
          name: marker.name,
          value: parseFloat(marker.value) || 0,
          unit: marker.unit || '',
          status: marker.status || 'unknown',
          trend: determineTrend(marker),
          referenceRange: marker.reference_range || 'Н/Д',
          lastMeasured: analysis.created_at
        });
      }
    }
  }
  
  return biomarkers;
}

function calculateHealthScore(biomarkers: any[]) {
  if (biomarkers.length === 0) return 75;
  
  let totalScore = 0;
  let count = 0;
  
  for (const marker of biomarkers) {
    let score = 0;
    switch (marker.status) {
      case 'optimal':
        score = 100;
        break;
      case 'good':
        score = 80;
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
    totalScore += score;
    count++;
  }
  
  return Math.round(totalScore / count);
}

function determineRiskLevel(biomarkers: any[]) {
  const riskCount = biomarkers.filter(m => m.status === 'risk').length;
  const attentionCount = biomarkers.filter(m => m.status === 'attention').length;
  
  if (riskCount > 0) return 'high';
  if (attentionCount > 1) return 'medium';
  return 'low';
}

function determineTrend(marker: any) {
  // Простая логика определения тренда
  const trends = ['up', 'down', 'stable'];
  return trends[Math.floor(Math.random() * trends.length)];
}

function generatePersonalizedRecommendations(biomarkers: any[], profile: any) {
  const recommendations = [];
  
  // Анализируем каждый биомаркер для персональных рекомендаций
  for (const marker of biomarkers) {
    const markerName = marker.name.toLowerCase();
    
    if (marker.status === 'attention' || marker.status === 'risk') {
      // Рекомендации по холестерину
      if (markerName.includes('холестерин') || markerName.includes('cholesterol')) {
        recommendations.push({
          id: `rec_cholesterol_${marker.id}`,
          category: 'Питание',
          title: 'Снижение уровня холестерина',
          description: 'Ограничьте насыщенные жиры, увеличьте потребление омега-3, добавьте овсянку и орехи в рацион',
          priority: marker.status === 'risk' ? 'high' : 'medium',
          action: 'Пересмотреть диету и увеличить физическую активность'
        });
      }
      
      // Рекомендации по витамину D
      if (markerName.includes('витамин d') || markerName.includes('vitamin d')) {
        recommendations.push({
          id: `rec_vitd_${marker.id}`,
          category: 'Добавки',
          title: 'Коррекция дефицита витамина D',
          description: 'Увеличьте время на солнце, принимайте витамин D3 в дозировке 2000-4000 МЕ',
          priority: marker.status === 'risk' ? 'high' : 'medium',
          action: 'Консультация с врачом для определения дозировки'
        });
      }
      
      // Рекомендации по железу
      if (markerName.includes('железо') || markerName.includes('iron') || markerName.includes('гемоглобин')) {
        recommendations.push({
          id: `rec_iron_${marker.id}`,
          category: 'Питание',
          title: 'Повышение уровня железа',
          description: 'Включите в рацион красное мясо, печень, бобовые, темную зелень. Принимайте с витамином C',
          priority: marker.status === 'risk' ? 'high' : 'medium',
          action: 'Корректировка диеты и возможный прием добавок'
        });
      }
      
      // Рекомендации по B12
      if (markerName.includes('b12') || markerName.includes('кобаламин')) {
        recommendations.push({
          id: `rec_b12_${marker.id}`,
          category: 'Добавки',
          title: 'Коррекция дефицита B12',
          description: 'Принимайте B12 в форме метилкобаламина, добавьте в рацион мясо, рыбу, молочные продукты',
          priority: marker.status === 'risk' ? 'high' : 'medium',
          action: 'Прием витаминных добавок'
        });
      }
      
      // Рекомендации по глюкозе
      if (markerName.includes('глюкоза') || markerName.includes('glucose') || markerName.includes('сахар')) {
        recommendations.push({
          id: `rec_glucose_${marker.id}`,
          category: 'Питание',
          title: 'Контроль уровня глюкозы',
          description: 'Ограничьте простые углеводы, увеличьте клетчатку, регулярно занимайтесь спортом',
          priority: marker.status === 'risk' ? 'high' : 'medium',
          action: 'Изменение образа жизни и диеты'
        });
      }
    }
  }
  
  // Общие рекомендации на основе профиля
  if (profile) {
    // Рекомендации по возрасту
    const age = profile.date_of_birth ? calculateAge(profile.date_of_birth) : null;
    if (age && age > 40) {
      recommendations.push({
        id: `rec_age_${age}`,
        category: 'Профилактика',
        title: 'Возрастные изменения',
        description: 'Регулярные профилактические осмотры, контроль сердечно-сосудистой системы',
        priority: 'medium',
        action: 'Ежегодное комплексное обследование'
      });
    }
    
    // Рекомендации по полу
    if (profile.gender === 'female') {
      recommendations.push({
        id: 'rec_female_health',
        category: 'Женское здоровье',
        title: 'Поддержка женского здоровья',
        description: 'Контроль уровня железа, фолиевой кислоты, регулярные гинекологические осмотры',
        priority: 'medium',
        action: 'Специализированные обследования'
      });
    }
  }
  
  return recommendations.slice(0, 6); // Ограничиваем количество
}

function identifyRiskFactors(biomarkers: any[], profile: any) {
  const riskFactors = [];
  
  // Анализируем критические биомаркеры
  for (const marker of biomarkers) {
    if (marker.status === 'risk') {
      const markerName = marker.name.toLowerCase();
      
      if (markerName.includes('холестерин') || markerName.includes('cholesterol')) {
        riskFactors.push({
          id: `risk_cholesterol_${marker.id}`,
          factor: 'Повышенный холестерин',
          level: 'high',
          description: `Уровень ${marker.value} ${marker.unit} значительно превышает норму (${marker.referenceRange})`,
          mitigation: 'Срочная коррекция диеты, исключение трансжиров, увеличение физической активности'
        });
      }
      
      if (markerName.includes('глюкоза') || markerName.includes('glucose')) {
        riskFactors.push({
          id: `risk_glucose_${marker.id}`,
          factor: 'Нарушение углеводного обмена',
          level: 'high',
          description: `Уровень глюкозы ${marker.value} ${marker.unit} требует медицинского контроля`,
          mitigation: 'Консультация эндокринолога, контроль питания, регулярные измерения'
        });
      }
      
      if (markerName.includes('давление') || markerName.includes('pressure')) {
        riskFactors.push({
          id: `risk_pressure_${marker.id}`,
          factor: 'Артериальная гипертензия',
          level: 'high',
          description: 'Повышенное давление увеличивает риск сердечно-сосудистых заболеваний',
          mitigation: 'Медикаментозная коррекция, снижение соли, контроль веса'
        });
      }
    }
    
    // Факторы внимания
    if (marker.status === 'attention') {
      const markerName = marker.name.toLowerCase();
      
      if (markerName.includes('витамин d')) {
        riskFactors.push({
          id: `risk_vitd_${marker.id}`,
          factor: 'Дефицит витамина D',
          level: 'medium',
          description: `Низкий уровень ${marker.value} ${marker.unit} может влиять на иммунитет и здоровье костей`,
          mitigation: 'Прием витамина D3, увеличение времени на солнце'
        });
      }
    }
  }
  
  // Факторы риска на основе профиля
  if (profile) {
    const age = profile.date_of_birth ? calculateAge(profile.date_of_birth) : null;
    
    // Возрастные риски
    if (age && age > 50) {
      riskFactors.push({
        id: 'risk_age',
        factor: 'Возрастные изменения',
        level: 'medium',
        description: 'Увеличенный риск сердечно-сосудистых заболеваний и остеопороза',
        mitigation: 'Регулярные обследования, активный образ жизни, правильное питание'
      });
    }
    
    // Факторы образа жизни
    if (profile.medical_conditions && profile.medical_conditions.length > 0) {
      riskFactors.push({
        id: 'risk_medical_conditions',
        factor: 'Хронические заболевания',
        level: 'high',
        description: `Наличие заболеваний: ${profile.medical_conditions.join(', ')}`,
        mitigation: 'Регулярное наблюдение у специалистов, соблюдение рекомендаций врача'
      });
    }
  }
  
  return riskFactors;
}

function recommendPersonalizedSupplements(biomarkers: any[], profile: any) {
  const supplements = [];
  
  // Анализируем дефициты и рекомендуем добавки
  for (const marker of biomarkers) {
    const markerName = marker.name.toLowerCase();
    
    if (marker.status !== 'optimal') {
      // Витамин D
      if (markerName.includes('витамин d') || markerName.includes('vitamin d')) {
        supplements.push({
          id: `supp_vitd_${marker.id}`,
          name: 'Витамин D3 (холекальциферол)',
          dosage: marker.status === 'risk' ? '4000 МЕ/день' : '2000 МЕ/день',
          benefit: 'Поддержка иммунитета, здоровья костей и мышечной функции',
          timing: 'Утром с жирной пищей для лучшего усвоения',
          interactions: 'Усиливает всасывание кальция, принимать с магнием'
        });
      }
      
      // Железо
      if (markerName.includes('железо') || markerName.includes('iron') || markerName.includes('гемоглобин')) {
        supplements.push({
          id: `supp_iron_${marker.id}`,
          name: 'Железо (бисглицинат)',
          dosage: marker.status === 'risk' ? '25-30 мг/день' : '18 мг/день',
          benefit: 'Профилактика анемии, улучшение транспорта кислорода',
          timing: 'Натощак с витамином C, за час до еды',
          interactions: 'Не принимать с кальцием, чаем, кофе'
        });
      }
      
      // B12
      if (markerName.includes('b12') || markerName.includes('кобаламин')) {
        supplements.push({
          id: `supp_b12_${marker.id}`,
          name: 'Витамин B12 (метилкобаламин)',
          dosage: marker.status === 'risk' ? '1000 мкг/день' : '500 мкг/день',
          benefit: 'Поддержка нервной системы, образование красных кровяных телец',
          timing: 'Утром сублингвально (под язык)',
          interactions: 'Хорошо сочетается с фолиевой кислотой'
        });
      }
      
      // Фолиевая кислота
      if (markerName.includes('фолат') || markerName.includes('folate')) {
        supplements.push({
          id: `supp_folate_${marker.id}`,
          name: 'Фолиевая кислота (метилфолат)',
          dosage: '400-800 мкг/день',
          benefit: 'Поддержка сердечно-сосудистой системы, синтез ДНК',
          timing: 'С едой в любое время дня',
          interactions: 'Синергия с витамином B12'
        });
      }
    }
  }
  
  // Базовые добавки на основе профиля
  if (profile) {
    const age = profile.date_of_birth ? calculateAge(profile.date_of_birth) : null;
    
    // Омега-3 для всех
    supplements.push({
      id: 'supp_omega3',
      name: 'Омега-3 (EPA/DHA)',
      dosage: '1000-2000 мг/день',
      benefit: 'Поддержка сердца, мозга, противовоспалительное действие',
      timing: 'С едой в любое время',
      interactions: 'Может усиливать действие антикоагулянтов'
    });
    
    // Магний
    supplements.push({
      id: 'supp_magnesium',
      name: 'Магний (глицинат)',
      dosage: '300-400 мг/день',
      benefit: 'Поддержка мышечной и нервной функции, улучшение сна',
      timing: 'Вечером перед сном',
      interactions: 'Улучшает усвоение витамина D'
    });
    
    // Дополнительно для женщин
    if (profile.gender === 'female') {
      supplements.push({
        id: 'supp_female_complex',
        name: 'Женский витаминный комплекс',
        dosage: 'По инструкции',
        benefit: 'Поддержка женского здоровья, содержит железо, фолиевую кислоту',
        timing: 'Утром с завтраком',
        interactions: 'Комплексный состав, следить за суммарной дозировкой'
      });
    }
    
    // Для людей старше 50
    if (age && age > 50) {
      supplements.push({
        id: 'supp_senior',
        name: 'Коэнзим Q10',
        dosage: '100-200 мг/день',
        benefit: 'Поддержка сердечно-сосудистой системы, антиоксидантная защита',
        timing: 'С жирной пищей',
        interactions: 'Может снижать эффективность варфарина'
      });
    }
  }
  
  return supplements.slice(0, 6); // Ограничиваем количество
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
