import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { biomarkerName, currentValue, normalRange, status, trend, history } = await req.json()

    // Генерируем анализ на основе данных биомаркера
    const summary = generateSummary(biomarkerName, currentValue, normalRange, status, trend)
    const recommendation = generateRecommendation(biomarkerName, status, trend)
    const riskLevel = determineRiskLevel(status, trend)

    const response = {
      summary,
      recommendation,
      riskLevel
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})

function generateSummary(biomarkerName: string, currentValue: string, normalRange: string, status: string, trend: string): string {
  const trendText = trend === 'up' ? 'показывает тенденцию к росту' : 
                   trend === 'down' ? 'показывает тенденцию к снижению' : 
                   'остается стабильным'
  
  const statusText = status === 'normal' ? 'находится в пределах нормы' :
                    status === 'high' ? 'превышает нормальные значения' :
                    'ниже нормальных значений'

  return `Ваш уровень ${biomarkerName} составляет ${currentValue} (норма: ${normalRange}), что ${statusText}. За последний период показатель ${trendText}.`
}

function generateRecommendation(biomarkerName: string, status: string, trend: string): string {
  const biomarkerRecommendations: Record<string, Record<string, string>> = {
    'Гемоглобин': {
      'high': 'Рекомендуется увеличить потребление жидкости, ограничить курение, регулярно сдавать анализы. Консультация врача обязательна.',
      'low': 'Включите в рацион железосодержащие продукты (мясо, печень, бобовые), витамин C для лучшего усвоения железа. Обратитесь к врачу.',
      'normal': 'Поддерживайте сбалансированную диету, богатую железом и витаминами группы B.'
    },
    'Глюкоза': {
      'high': 'Ограничьте потребление простых углеводов, увеличьте физическую активность, контролируйте вес. Необходима консультация эндокринолога.',
      'low': 'Не пропускайте приемы пищи, включите сложные углеводы в рацион, избегайте длительных периодов голодания.',
      'normal': 'Поддерживайте здоровую диету с умеренным содержанием углеводов, регулярно занимайтесь спортом.'
    },
    'Холестерин': {
      'high': 'Ограничьте насыщенные жиры, увеличьте потребление омега-3, регулярно занимайтесь спортом. Консультация кардиолога рекомендована.',
      'low': 'Редкая ситуация. Включите полезные жиры в рацион (орехи, авокадо, рыба).',
      'normal': 'Поддерживайте здоровую диету с низким содержанием насыщенных жиров.'
    },
    'Ретикулоциты': {
      'high': 'Повышенные ретикулоциты могут указывать на активную регенерацию крови. Рекомендуется исследование уровня железа, B12, фолиевой кислоты.',
      'low': 'Пониженные ретикулоциты могут свидетельствовать о нарушении костномозгового кроветворения. Необходима консультация гематолога.',
      'normal': 'Нормальный уровень ретикулоцитов свидетельствует о здоровом костномозговом кроветворении.'
    },
    'Эритроциты': {
      'high': 'Повышенные эритроциты могут указывать на обезвоживание или полицитемию. Рекомендуется увеличить потребление воды.',
      'low': 'Пониженные эритроциты свидетельствуют об анемии. Необходимо обследование на дефицит железа, B12, фолиевой кислоты.',
      'normal': 'Нормальный уровень эритроцитов поддерживает адекватное кислородное снабжение тканей.'
    },
    'Лейкоциты': {
      'high': 'Повышенные лейкоциты могут указывать на инфекцию или воспаление. Рекомендуется дополнительное обследование.',
      'low': 'Пониженные лейкоциты могут свидетельствовать о снижении иммунитета. Необходима консультация врача.',
      'normal': 'Нормальный уровень лейкоцитов обеспечивает адекватную иммунную защиту.'
    },
    'Тромбоциты': {
      'high': 'Повышенные тромбоциты увеличивают риск тромбообразования. Рекомендуется консультация гематолога.',
      'low': 'Пониженные тромбоциты повышают риск кровотечений. Избегайте травматичных видов спорта, консультируйтесь с врачом.',
      'normal': 'Нормальный уровень тромбоцитов обеспечивает адекватную свертываемость крови.'
    }
  }

  const defaultRecommendations = {
    'high': 'Показатель выше нормы. Рекомендуется консультация с врачом для определения дальнейшей тактики лечения и коррекции образа жизни.',
    'low': 'Показатель ниже нормы. Необходимо обратиться к врачу для выяснения причин и назначения соответствующего лечения.',
    'normal': 'Показатель в норме. Продолжайте поддерживать здоровый образ жизни для сохранения нормальных значений.'
  }

  return biomarkerRecommendations[biomarkerName]?.[status] || defaultRecommendations[status] || defaultRecommendations['normal']
}

function determineRiskLevel(status: string, trend: string): 'low' | 'medium' | 'high' {
  if (status === 'normal') {
    return trend === 'stable' ? 'low' : 'medium'
  }
  
  if (status === 'high' || status === 'low') {
    return trend === 'up' && status === 'high' ? 'high' : 
           trend === 'down' && status === 'low' ? 'high' : 'medium'
  }
  
  return 'medium'
}