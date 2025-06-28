
export const normalizeStatus = (status: string): 'optimal' | 'good' | 'attention' | 'risk' | 'normal' | 'high' | 'low' | 'unknown' => {
  if (!status) return 'unknown';
  
  const statusLower = status.toLowerCase();
  
  if (statusLower.includes('optimal') || statusLower.includes('отличн') || statusLower.includes('идеальн')) {
    return 'optimal';
  }
  if (statusLower.includes('good') || statusLower.includes('хорош') || statusLower.includes('норм')) {
    return 'good';
  }
  if (statusLower.includes('normal') || statusLower.includes('в норме') || statusLower.includes('нормальн')) {
    return 'normal';
  }
  if (statusLower.includes('attention') || statusLower.includes('внимание') || statusLower.includes('осторожн')) {
    return 'attention';
  }
  if (statusLower.includes('risk') || statusLower.includes('риск') || statusLower.includes('опасн')) {
    return 'risk';
  }
  if (statusLower.includes('high') || statusLower.includes('высок') || statusLower.includes('повышен')) {
    return 'high';
  }
  if (statusLower.includes('low') || statusLower.includes('низк') || statusLower.includes('пониж')) {
    return 'low';
  }
  
  return 'unknown';
};

export const generateAIRecommendation = (biomarkerName: string, value: number, status: string): string => {
  const recommendations: Record<string, Record<string, string>> = {
    'Глюкоза': {
      'risk': 'Критически важно контролировать уровень сахара. Рекомендуется немедленная консультация эндокринолога.',
      'attention': 'Повышенный уровень глюкозы. Ограничьте простые углеводы, увеличьте физическую активность.'
    },
    'Холестерин': {
      'risk': 'Высокий риск сердечно-сосудистых заболеваний. Необходима консультация кардиолога.',
      'attention': 'Повышенный холестерин. Рекомендуется диета с низким содержанием насыщенных жиров.'
    },
    'Гемоглобин': {
      'risk': 'Критический уровень гемоглобина. Требуется срочная консультация гематолога.',
      'attention': 'Пониженный гемоглобин. Включите в рацион железосодержащие продукты.'
    }
  };

  const biomarkerKey = Object.keys(recommendations).find(key => 
    biomarkerName.toLowerCase().includes(key.toLowerCase())
  );

  if (biomarkerKey && recommendations[biomarkerKey][status]) {
    return recommendations[biomarkerKey][status];
  }

  return status === 'risk' 
    ? 'Показатель вне нормы. Рекомендуется консультация с врачом.'
    : 'Показатель требует внимания. Следите за динамикой.';
};
