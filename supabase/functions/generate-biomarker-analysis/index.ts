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