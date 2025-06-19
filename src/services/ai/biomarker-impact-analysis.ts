
// Данные о влиянии биомаркеров на биологический возраст основаны на научных исследованиях
export interface BiomarkerImpact {
  name: string;
  impact: 'high' | 'medium' | 'low';
  description: string;
  scientificBasis: string;
}

export const BIOMARKER_IMPACTS: Record<string, BiomarkerImpact> = {
  // Сердечно-сосудистая система
  'cholesterol_total': {
    name: 'Общий холестерин',
    impact: 'high',
    description: 'Высокое влияние',
    scientificBasis: 'Высокий уровень холестерина значительно ускоряет старение сердечно-сосудистой системы'
  },
  'ldl_cholesterol': {
    name: 'ЛПНП',
    impact: 'high',
    description: 'Высокое влияние',
    scientificBasis: 'ЛПНП является ключевым фактором атеросклероза и сосудистого старения'
  },
  'hdl_cholesterol': {
    name: 'ЛПВП',
    impact: 'high',
    description: 'Высокое влияние',
    scientificBasis: 'Низкий ЛПВП связан с ускоренным старением и повышенным риском ССЗ'
  },
  'triglycerides': {
    name: 'Триглицериды',
    impact: 'medium',
    description: 'Среднее влияние',
    scientificBasis: 'Повышенные триглицериды влияют на метаболическое здоровье и старение'
  },
  'crp': {
    name: 'С-реактивный белок',
    impact: 'high',
    description: 'Высокое влияние',
    scientificBasis: 'Хроническое воспаление - ключевой фактор ускоренного старения'
  },
  'homocysteine': {
    name: 'Гомоцистеин',
    impact: 'medium',
    description: 'Среднее влияние',
    scientificBasis: 'Повышенный гомоцистеин связан с сосудистым старением'
  },

  // Метаболические маркеры
  'glucose': {
    name: 'Глюкоза',
    impact: 'high',
    description: 'Высокое влияние',
    scientificBasis: 'Гипергликемия ускоряет процессы гликации и старения'
  },
  'hba1c': {
    name: 'HbA1c',
    impact: 'high',
    description: 'Высокое влияние',
    scientificBasis: 'Гликированный гемоглобин - маркер долгосрочного метаболического старения'
  },
  'insulin': {
    name: 'Инсулин',
    impact: 'high',
    description: 'Высокое влияние',
    scientificBasis: 'Инсулинорезистентность - ключевой фактор метаболического старения'
  },
  'homa_ir': {
    name: 'HOMA-IR',
    impact: 'high',
    description: 'Высокое влияние',
    scientificBasis: 'Индекс инсулинорезистентности напрямую связан с биологическим возрастом'
  },

  // Гормональная система
  'testosterone': {
    name: 'Тестостерон',
    impact: 'high',
    description: 'Высокое влияние',
    scientificBasis: 'Снижение тестостерона - маркер гормонального старения'
  },
  'estradiol': {
    name: 'Эстрадиол',
    impact: 'high',
    description: 'Высокое влияние',
    scientificBasis: 'Эстрогены критически важны для женского здоровья и замедления старения'
  },
  'cortisol': {
    name: 'Кортизол',
    impact: 'medium',
    description: 'Среднее влияние',
    scientificBasis: 'Хронически повышенный кортизол ускоряет старение'
  },
  'igf1': {
    name: 'IGF-1',
    impact: 'medium',
    description: 'Среднее влияние',
    scientificBasis: 'IGF-1 связан с процессами роста и старения'
  },
  'tsh': {
    name: 'ТТГ',
    impact: 'medium',
    description: 'Среднее влияние',
    scientificBasis: 'Функция щитовидной железы влияет на метаболизм и старение'
  },
  't3': {
    name: 'Т3',
    impact: 'medium',
    description: 'Среднее влияние',
    scientificBasis: 'Гормоны щитовидной железы регулируют метаболические процессы'
  },
  't4': {
    name: 'Т4',
    impact: 'medium',
    description: 'Среднее влияние',
    scientificBasis: 'Т4 важен для поддержания метаболического здоровья'
  },

  // Воспалительные маркеры
  'il6': {
    name: 'Интерлейкин-6',
    impact: 'high',
    description: 'Высокое влияние',
    scientificBasis: 'IL-6 - ключевой маркер воспалительного старения'
  },
  'tnf_alpha': {
    name: 'TNF-α',
    impact: 'high',
    description: 'Высокое влияние',
    scientificBasis: 'TNF-α способствует хроническому воспалению и старению'
  },
  'esr': {
    name: 'СОЭ',
    impact: 'low',
    description: 'Слабое влияние',
    scientificBasis: 'СОЭ - общий маркер воспаления с умеренным влиянием на старение'
  },

  // Окислительный стресс
  'vitamin_d': {
    name: 'Витамин D',
    impact: 'medium',
    description: 'Среднее влияние',
    scientificBasis: 'Дефицит витамина D связан с ускоренным старением'
  },
  'vitamin_b12': {
    name: 'Витамин B12',
    impact: 'medium',
    description: 'Среднее влияние',
    scientificBasis: 'B12 важен для неврологического здоровья и замедления когнитивного старения'
  },
  'folate': {
    name: 'Фолиевая кислота',
    impact: 'low',
    description: 'Слабое влияние',
    scientificBasis: 'Фолаты поддерживают синтез ДНК и клеточное здоровье'
  },
  'selenium': {
    name: 'Селен',
    impact: 'low',
    description: 'Слабое влияние',
    scientificBasis: 'Селен - антиоксидант, защищающий от окислительного стресса'
  },
  'zinc': {
    name: 'Цинк',
    impact: 'low',
    description: 'Слабое влияние',
    scientificBasis: 'Цинк поддерживает иммунную функцию и заживление'
  },

  // Почечная функция
  'creatinine': {
    name: 'Креатинин',
    impact: 'medium',
    description: 'Среднее влияние',
    scientificBasis: 'Функция почек влияет на общее здоровье и продолжительность жизни'
  },
  'urea': {
    name: 'Мочевина',
    impact: 'low',
    description: 'Слабое влияние',
    scientificBasis: 'Мочевина отражает почечную функцию и белковый метаболизм'
  },
  'egfr': {
    name: 'СКФ',
    impact: 'medium',
    description: 'Среднее влияние',
    scientificBasis: 'Скорость клубочковой фильтрации - прямой маркер почечного старения'
  },

  // Печеночная функция
  'alt': {
    name: 'АЛТ',
    impact: 'low',
    description: 'Слабое влияние',
    scientificBasis: 'Печеночные ферменты отражают функциональное состояние печени'
  },
  'ast': {
    name: 'АСТ',
    impact: 'low',
    description: 'Слабое влияние',
    scientificBasis: 'АСТ - маркер печеночной и мышечной функции'
  },
  'bilirubin': {
    name: 'Билирубин',
    impact: 'low',
    description: 'Слабое влияние',
    scientificBasis: 'Билирубин отражает функцию печени и метаболизм гема'
  },

  // Теломеры и эпигенетика
  'telomere_length': {
    name: 'Длина теломер',
    impact: 'high',
    description: 'Высокое влияние',
    scientificBasis: 'Длина теломер - прямой маркер клеточного старения'
  },
  'dna_methylation': {
    name: 'Метилирование ДНК',
    impact: 'high',
    description: 'Высокое влияние',
    scientificBasis: 'Эпигенетические часы - наиболее точный предиктор биологического возраста'
  }
};

export function getBiomarkerImpact(biomarkerName: string): BiomarkerImpact {
  // Пытаемся найти точное совпадение
  const exactMatch = Object.values(BIOMARKER_IMPACTS).find(
    impact => impact.name.toLowerCase() === biomarkerName.toLowerCase()
  );
  
  if (exactMatch) return exactMatch;

  // Пытаемся найти частичное совпадение
  const partialMatch = Object.values(BIOMARKER_IMPACTS).find(
    impact => biomarkerName.toLowerCase().includes(impact.name.toLowerCase()) ||
              impact.name.toLowerCase().includes(biomarkerName.toLowerCase())
  );
  
  if (partialMatch) return partialMatch;

  // Возвращаем стандартное значение
  return {
    name: biomarkerName,
    impact: 'low',
    description: 'Слабое влияние',
    scientificBasis: 'Требуется дополнительная оценка влияния на биологический возраст'
  };
}
