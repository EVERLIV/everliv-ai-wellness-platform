
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
  
  // Генерируем рекомендации
  const recommendations = generateRecommendations(biomarkers, profile);
  
  // Определяем факторы риска
  const riskFactors = identifyRiskFactors(biomarkers);
  
  // Рекомендуемые добавки
  const supplements = recommendSupplements(biomarkers);

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
  // В реальном приложении здесь должен быть анализ исторических данных
  const trends = ['up', 'down', 'stable'];
  return trends[Math.floor(Math.random() * trends.length)];
}

function generateRecommendations(biomarkers: any[], profile: any) {
  const recommendations = [];
  
  for (const marker of biomarkers) {
    if (marker.status === 'attention' || marker.status === 'risk') {
      if (marker.name.toLowerCase().includes('холестерин')) {
        recommendations.push({
          id: `rec_${marker.id}`,
          category: 'Питание',
          title: 'Снижение уровня холестерина',
          description: 'Ограничьте потребление насыщенных жиров, увеличьте клетчатку',
          priority: marker.status === 'risk' ? 'high' : 'medium',
          action: 'Пересмотреть диету'
        });
      }
      
      if (marker.name.toLowerCase().includes('витамин')) {
        recommendations.push({
          id: `rec_${marker.id}`,
          category: 'Добавки',
          title: `Коррекция уровня ${marker.name}`,
          description: 'Рассмотрите прием соответствующих добавок',
          priority: marker.status === 'risk' ? 'high' : 'medium',
          action: 'Консультация с врачом'
        });
      }
    }
  }
  
  return recommendations;
}

function identifyRiskFactors(biomarkers: any[]) {
  const riskFactors = [];
  
  for (const marker of biomarkers) {
    if (marker.status === 'risk') {
      riskFactors.push({
        id: `risk_${marker.id}`,
        factor: `Отклонение ${marker.name}`,
        level: 'high',
        description: `Значение ${marker.value} ${marker.unit} требует внимания`,
        mitigation: 'Обратитесь к врачу для назначения лечения'
      });
    }
  }
  
  return riskFactors;
}

function recommendSupplements(biomarkers: any[]) {
  const supplements = [];
  
  for (const marker of biomarkers) {
    if (marker.name.toLowerCase().includes('витамин d') && marker.status !== 'optimal') {
      supplements.push({
        id: `supp_${marker.id}`,
        name: 'Витамин D3',
        dosage: '2000-4000 МЕ',
        benefit: 'Поддержка иммунитета и здоровья костей',
        timing: 'Утром с жирной пищей'
      });
    }
    
    if (marker.name.toLowerCase().includes('железо') && marker.status !== 'optimal') {
      supplements.push({
        id: `supp_${marker.id}`,
        name: 'Железо',
        dosage: '18-27 мг',
        benefit: 'Профилактика анемии',
        timing: 'Натощак с витамином C'
      });
    }
  }
  
  return supplements;
}
