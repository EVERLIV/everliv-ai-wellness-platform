
import { Biomarker } from '@/types/biologicalAge';

export const BIOMARKERS: Biomarker[] = [
  // Сердечно-сосудистая система
  {
    id: 'total_cholesterol',
    name: 'Общий холестерин',
    category: 'cardiovascular',
    description: 'Анализ крови на липидный профиль',
    analysis_type: 'Липидный профиль',
    normal_range: { min: 3.6, max: 5.2, optimal: 4.5 },
    unit: 'ммоль/л',
    status: 'not_filled',
    importance: 'high'
  },
  {
    id: 'ldl_cholesterol',
    name: 'ЛПНП (плохой холестерин)',
    category: 'cardiovascular',
    description: 'Анализ крови на липидный профиль',
    analysis_type: 'Липидный профиль',
    normal_range: { min: 0, max: 3.0, optimal: 2.5 },
    unit: 'ммоль/л',
    status: 'not_filled',
    importance: 'high'
  },
  {
    id: 'hdl_cholesterol',
    name: 'ЛПВП (хороший холестерин)',
    category: 'cardiovascular',
    description: 'Анализ крови на липидный профиль',
    analysis_type: 'Липидный профиль',
    normal_range: { min: 1.0, max: 2.5, optimal: 1.5 },
    unit: 'ммоль/л',
    status: 'not_filled',
    importance: 'high'
  },
  {
    id: 'triglycerides',
    name: 'Триглицериды',
    category: 'cardiovascular',
    description: 'Анализ крови на липидный профиль',
    analysis_type: 'Липидный профиль',
    normal_range: { min: 0, max: 1.7, optimal: 1.0 },
    unit: 'ммоль/л',
    status: 'not_filled',
    importance: 'high'
  },
  {
    id: 'crp',
    name: 'С-реактивный белок (СРБ)',
    category: 'cardiovascular',
    description: 'Анализ крови на СРБ высокочувствительный',
    analysis_type: 'СРБ высокочувствительный',
    normal_range: { min: 0, max: 3.0, optimal: 1.0 },
    unit: 'мг/л',
    status: 'not_filled',
    importance: 'medium'
  },
  {
    id: 'homocysteine',
    name: 'Гомоцистеин',
    category: 'cardiovascular',
    description: 'Анализ крови на гомоцистеин',
    analysis_type: 'Гомоцистеин',
    normal_range: { min: 5, max: 15, optimal: 10 },
    unit: 'мкмоль/л',
    status: 'not_filled',
    importance: 'medium'
  },

  // Метаболические маркеры
  {
    id: 'glucose',
    name: 'Глюкоза натощак',
    category: 'metabolic',
    description: 'Анализ крови на глюкозу',
    analysis_type: 'Глюкоза крови',
    normal_range: { min: 3.9, max: 6.1, optimal: 5.0 },
    unit: 'ммоль/л',
    status: 'not_filled',
    importance: 'high'
  },
  {
    id: 'hba1c',
    name: 'Гликированный гемоглобин (HbA1c)',
    category: 'metabolic',
    description: 'Анализ крови на HbA1c',
    analysis_type: 'HbA1c',
    normal_range: { min: 4.0, max: 6.0, optimal: 5.0 },
    unit: '%',
    status: 'not_filled',
    importance: 'high'
  },
  {
    id: 'insulin',
    name: 'Инсулин',
    category: 'metabolic',
    description: 'Анализ крови на инсулин',
    analysis_type: 'Инсулин',
    normal_range: { min: 2.6, max: 24.9, optimal: 10.0 },
    unit: 'мкЕД/мл',
    status: 'not_filled',
    importance: 'medium'
  },

  // Гормональная система
  {
    id: 'testosterone',
    name: 'Тестостерон общий',
    category: 'hormonal',
    description: 'Анализ крови на гормоны',
    analysis_type: 'Половые гормоны',
    normal_range: { min: 8.64, max: 29.0, optimal: 20.0, gender_dependent: true },
    unit: 'нмоль/л',
    status: 'not_filled',
    importance: 'high'
  },
  {
    id: 'estradiol',
    name: 'Эстрадиол',
    category: 'hormonal',
    description: 'Анализ крови на половые гормоны',
    analysis_type: 'Половые гормоны',
    normal_range: { min: 46, max: 607, optimal: 300, gender_dependent: true },
    unit: 'пмоль/л',
    status: 'not_filled',
    importance: 'high'
  },
  {
    id: 'cortisol',
    name: 'Кортизол',
    category: 'hormonal',
    description: 'Анализ крови на кортизол',
    analysis_type: 'Кортизол',
    normal_range: { min: 171, max: 536, optimal: 350 },
    unit: 'нмоль/л',
    status: 'not_filled',
    importance: 'medium'
  },
  {
    id: 'igf1',
    name: 'Гормон роста (IGF-1)',
    category: 'hormonal',
    description: 'Анализ крови на IGF-1',
    analysis_type: 'IGF-1',
    normal_range: { min: 115, max: 307, optimal: 200, age_dependent: true },
    unit: 'нг/мл',
    status: 'not_filled',
    importance: 'medium'
  },
  {
    id: 'tsh',
    name: 'Тиреотропный гормон (ТТГ)',
    category: 'hormonal',
    description: 'Анализ крови на гормоны щитовидной железы',
    analysis_type: 'Гормоны щитовидной железы',
    normal_range: { min: 0.27, max: 4.2, optimal: 2.0 },
    unit: 'мЕД/л',
    status: 'not_filled',
    importance: 'high'
  },
  {
    id: 't3',
    name: 'Т3 (трийодтиронин)',
    category: 'hormonal',
    description: 'Анализ крови на гормоны щитовидной железы',
    analysis_type: 'Гормоны щитовидной железы',
    normal_range: { min: 1.2, max: 3.1, optimal: 2.0 },
    unit: 'нмоль/л',
    status: 'not_filled',
    importance: 'medium'
  },
  {
    id: 't4',
    name: 'Т4 (тироксин)',
    category: 'hormonal',
    description: 'Анализ крови на гормоны щитовидной железы',
    analysis_type: 'Гормоны щитовидной железы',
    normal_range: { min: 66, max: 181, optimal: 120 },
    unit: 'нмоль/л',
    status: 'not_filled',
    importance: 'medium'
  },

  // Воспалительные маркеры
  {
    id: 'il6',
    name: 'Интерлейкин-6 (IL-6)',
    category: 'inflammatory',
    description: 'Анализ крови на цитокины',
    analysis_type: 'Цитокины',
    normal_range: { min: 0, max: 7.0, optimal: 2.0 },
    unit: 'пг/мл',
    status: 'not_filled',
    importance: 'low'
  },
  {
    id: 'tnf_alpha',
    name: 'Фактор некроза опухоли (TNF-α)',
    category: 'inflammatory',
    description: 'Анализ крови на цитокины',
    analysis_type: 'Цитокины',
    normal_range: { min: 0, max: 8.1, optimal: 3.0 },
    unit: 'пг/мл',
    status: 'not_filled',
    importance: 'low'
  },
  {
    id: 'esr',
    name: 'Скорость оседания эритроцитов (СОЭ)',
    category: 'inflammatory',
    description: 'Общий анализ крови с СОЭ',
    analysis_type: 'Общий анализ крови',
    normal_range: { min: 0, max: 20, optimal: 10, gender_dependent: true },
    unit: 'мм/ч',
    status: 'not_filled',
    importance: 'medium'
  },

  // Окислительный стресс
  {
    id: 'vitamin_d',
    name: 'Витамин D',
    category: 'oxidative_stress',
    description: 'Анализ крови на 25-OH витамин D',
    analysis_type: '25-OH витамин D',
    normal_range: { min: 30, max: 100, optimal: 50 },
    unit: 'нг/мл',
    status: 'not_filled',
    importance: 'high'
  },
  {
    id: 'vitamin_b12',
    name: 'Витамин B12',
    category: 'oxidative_stress',
    description: 'Анализ крови на витамин B12',
    analysis_type: 'Витамин B12',
    normal_range: { min: 191, max: 663, optimal: 400 },
    unit: 'пг/мл',
    status: 'not_filled',
    importance: 'medium'
  },
  {
    id: 'folate',
    name: 'Фолиевая кислота',
    category: 'oxidative_stress',
    description: 'Анализ крови на фолиевую кислоту',
    analysis_type: 'Фолиевая кислота',
    normal_range: { min: 2.7, max: 17.0, optimal: 10.0 },
    unit: 'нг/мл',
    status: 'not_filled',
    importance: 'medium'
  },

  // Почечная функция
  {
    id: 'creatinine',
    name: 'Креатинин',
    category: 'kidney_function',
    description: 'Биохимический анализ крови',
    analysis_type: 'Биохимический анализ',
    normal_range: { min: 62, max: 115, optimal: 85, gender_dependent: true },
    unit: 'мкмоль/л',
    status: 'not_filled',
    importance: 'high'
  },
  {
    id: 'urea',
    name: 'Мочевина',
    category: 'kidney_function',
    description: 'Биохимический анализ крови',
    analysis_type: 'Биохимический анализ',
    normal_range: { min: 2.5, max: 6.4, optimal: 4.0 },
    unit: 'ммоль/л',
    status: 'not_filled',
    importance: 'medium'
  },

  // Печеночная функция
  {
    id: 'alt',
    name: 'АЛТ',
    category: 'liver_function',
    description: 'Биохимический анализ крови',
    analysis_type: 'Биохимический анализ',
    normal_range: { min: 7, max: 56, optimal: 30, gender_dependent: true },
    unit: 'Ед/л',
    status: 'not_filled',
    importance: 'medium'
  },
  {
    id: 'ast',
    name: 'АСТ',
    category: 'liver_function',
    description: 'Биохимический анализ крови',
    analysis_type: 'Биохимический анализ',
    normal_range: { min: 10, max: 40, optimal: 25, gender_dependent: true },
    unit: 'Ед/л',
    status: 'not_filled',
    importance: 'medium'
  },
  {
    id: 'bilirubin',
    name: 'Билирубин',
    category: 'liver_function',
    description: 'Биохимический анализ крови',
    analysis_type: 'Биохимический анализ',
    normal_range: { min: 5, max: 21, optimal: 12 },
    unit: 'мкмоль/л',
    status: 'not_filled',
    importance: 'medium'
  }
];

export const BIOMARKER_CATEGORIES = {
  cardiovascular: 'Сердечно-сосудистая система',
  metabolic: 'Метаболические маркеры',
  hormonal: 'Гормональная система',
  inflammatory: 'Воспалительные маркеры',
  oxidative_stress: 'Окислительный стресс',
  kidney_function: 'Почечная функция',
  liver_function: 'Печеночная функция',
  telomeres_epigenetics: 'Теломеры и эпигенетика'
};

export const ACCURACY_LEVELS = {
  basic: { min: 3, max: 5, percentage: 60, description: 'Базовый расчет' },
  extended: { min: 10, max: 15, percentage: 80, description: 'Расширенный анализ' },
  comprehensive: { min: 20, max: 30, percentage: 95, description: 'Полный профиль' }
};
