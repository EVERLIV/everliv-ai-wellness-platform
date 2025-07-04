
import { Biomarker, AccuracyLevel } from '@/types/biologicalAge';

export const BIOMARKERS: Biomarker[] = [
  // Сердечно-сосудистая система
  {
    id: 'total_cholesterol',
    name: 'Общий холестерин',
    category: 'cardiovascular',
    description: 'Общий уровень холестерина в крови',
    analysis_type: 'Анализ крови на липидный профиль',
    normal_range: { min: 3.0, max: 5.2, optimal: 4.2 },
    unit: 'ммоль/л',
    status: 'not_filled',
    importance: 'high'
  },
  {
    id: 'ldl_cholesterol',
    name: 'ЛПНП (плохой холестерин)',
    category: 'cardiovascular',
    description: 'Липопротеины низкой плотности',
    analysis_type: 'Анализ крови на липидный профиль',
    normal_range: { min: 0.0, max: 3.0, optimal: 2.0 },
    unit: 'ммоль/л',
    status: 'not_filled',
    importance: 'high'
  },
  {
    id: 'hdl_cholesterol',
    name: 'ЛПВП (хороший холестерин)',
    category: 'cardiovascular',
    description: 'Липопротеины высокой плотности',
    analysis_type: 'Анализ крови на липидный профиль',
    normal_range: { min: 1.0, max: 3.0, optimal: 1.6 },
    unit: 'ммоль/л',
    status: 'not_filled',
    importance: 'high'
  },
  {
    id: 'triglycerides',
    name: 'Триглицериды',
    category: 'cardiovascular',
    description: 'Уровень триглицеридов в крови',
    analysis_type: 'Анализ крови на липидный профиль',
    normal_range: { min: 0.5, max: 1.7, optimal: 1.0 },
    unit: 'ммоль/л',
    status: 'not_filled',
    importance: 'medium'
  },
  {
    id: 'crp',
    name: 'С-реактивный белок (СРБ)',
    category: 'cardiovascular',
    description: 'Маркер воспаления в организме',
    analysis_type: 'Анализ крови на СРБ высокочувствительный',
    normal_range: { min: 0, max: 3.0, optimal: 1.0 },
    unit: 'мг/л',
    status: 'not_filled',
    importance: 'high'
  },
  {
    id: 'homocysteine',
    name: 'Гомоцистеин',
    category: 'cardiovascular',
    description: 'Аминокислота, маркер сердечно-сосудистого риска',
    analysis_type: 'Анализ крови на гомоцистеин',
    normal_range: { min: 5, max: 15, optimal: 8 },
    unit: 'мкмоль/л',
    status: 'not_filled',
    importance: 'medium'
  },

  // Метаболические маркеры
  {
    id: 'glucose',
    name: 'Глюкоза натощак',
    category: 'metabolic',
    description: 'Уровень сахара в крови натощак',
    analysis_type: 'Анализ крови на глюкозу',
    normal_range: { min: 3.3, max: 5.5, optimal: 4.5 },
    unit: 'ммоль/л',
    status: 'not_filled',
    importance: 'high'
  },
  {
    id: 'hba1c',
    name: 'Гликированный гемоглобин (HbA1c)',
    category: 'metabolic',
    description: 'Средний уровень глюкозы за последние 2-3 месяца',
    analysis_type: 'Анализ крови на HbA1c',
    normal_range: { min: 4.0, max: 6.0, optimal: 5.0 },
    unit: '%',
    status: 'not_filled',
    importance: 'high'
  },
  {
    id: 'insulin',
    name: 'Инсулин',
    category: 'metabolic',
    description: 'Уровень инсулина в крови',
    analysis_type: 'Анализ крови на инсулин',
    normal_range: { min: 2.6, max: 24.9, optimal: 10.0 },
    unit: 'мкЕд/мл',
    status: 'not_filled',
    importance: 'medium'
  },
  {
    id: 'homa_ir',
    name: 'HOMA-IR индекс',
    category: 'metabolic',
    description: 'Индекс инсулинорезистентности',
    analysis_type: 'Расчетный показатель инсулинорезистентности',
    normal_range: { min: 0, max: 2.7, optimal: 1.0 },
    unit: 'единицы',
    status: 'not_filled',
    importance: 'medium'
  },

  // Гормональная система
  {
    id: 'testosterone',
    name: 'Тестостерон (общий)',
    category: 'hormonal',
    description: 'Общий тестостерон в крови',
    analysis_type: 'Анализ крови на гормоны',
    normal_range: { min: 12, max: 33, optimal: 20 },
    unit: 'нмоль/л',
    status: 'not_filled',
    importance: 'high'
  },
  {
    id: 'free_testosterone',
    name: 'Тестостерон (свободный)',
    category: 'hormonal',
    description: 'Биологически активный тестостерон',
    analysis_type: 'Анализ крови на гормоны',
    normal_range: { min: 243, max: 827, optimal: 500 },
    unit: 'пмоль/л',
    status: 'not_filled',
    importance: 'medium'
  },
  {
    id: 'estradiol',
    name: 'Эстрадиол (для женщин)',
    category: 'hormonal',
    description: 'Основной женский половой гормон',
    analysis_type: 'Анализ крови на половые гормоны',
    normal_range: { min: 46, max: 607, optimal: 200 },
    unit: 'пмоль/л',
    status: 'not_filled',
    importance: 'medium'
  },
  {
    id: 'cortisol',
    name: 'Кортизол',
    category: 'hormonal',
    description: 'Гормон стресса',
    analysis_type: 'Анализ крови на кортизол',
    normal_range: { min: 138, max: 690, optimal: 400 },
    unit: 'нмоль/л',
    status: 'not_filled',
    importance: 'medium'
  },
  {
    id: 'igf1',
    name: 'Гормон роста (IGF-1)',
    category: 'hormonal',
    description: 'Инсулиноподобный фактор роста',
    analysis_type: 'Анализ крови на IGF-1',
    normal_range: { min: 115, max: 307, optimal: 200 },
    unit: 'нг/мл',
    status: 'not_filled',
    importance: 'low'
  },
  {
    id: 'tsh',
    name: 'Тиреотропный гормон (ТТГ)',
    category: 'hormonal',
    description: 'Гормон, регулирующий работу щитовидной железы',
    analysis_type: 'Анализ крови на гормоны щитовидной железы',
    normal_range: { min: 0.4, max: 4.0, optimal: 2.0 },
    unit: 'мЕд/л',
    status: 'not_filled',
    importance: 'medium'
  },
  {
    id: 't3',
    name: 'Т3 (трийодтиронин)',
    category: 'hormonal',
    description: 'Активный гормон щитовидной железы',
    analysis_type: 'Анализ крови на гормоны щитовидной железы',
    normal_range: { min: 3.1, max: 6.8, optimal: 5.0 },
    unit: 'пмоль/л',
    status: 'not_filled',
    importance: 'low'
  },
  {
    id: 't4',
    name: 'Т4 (тироксин)',
    category: 'hormonal',
    description: 'Основной гормон щитовидной железы',
    analysis_type: 'Анализ крови на гормоны щитовидной железы',
    normal_range: { min: 12, max: 22, optimal: 17 },
    unit: 'пмоль/л',
    status: 'not_filled',
    importance: 'low'
  },

  // Воспалительные маркеры
  {
    id: 'il6',
    name: 'Интерлейкин-6 (IL-6)',
    category: 'inflammatory',
    description: 'Провоспалительный цитокин',
    analysis_type: 'Анализ крови на цитокины',
    normal_range: { min: 0, max: 7.0, optimal: 2.0 },
    unit: 'пг/мл',
    status: 'not_filled',
    importance: 'low'
  },
  {
    id: 'tnf_alpha',
    name: 'Фактор некроза опухоли (TNF-α)',
    category: 'inflammatory',
    description: 'Провоспалительный цитокин',
    analysis_type: 'Анализ крови на цитокины',
    normal_range: { min: 0, max: 8.1, optimal: 3.0 },
    unit: 'пг/мл',
    status: 'not_filled',
    importance: 'low'
  },
  {
    id: 'esr',
    name: 'Скорость оседания эритроцитов (СОЭ)',
    category: 'inflammatory',
    description: 'Неспецифический показатель воспаления',
    analysis_type: 'Общий анализ крови с СОЭ',
    normal_range: { min: 0, max: 15, optimal: 5 },
    unit: 'мм/ч',
    status: 'not_filled',
    importance: 'medium'
  },

  // Окислительный стресс
  {
    id: 'vitamin_d',
    name: 'Витамин D',
    category: 'oxidative_stress',
    description: '25-гидроксивитамин D',
    analysis_type: 'Анализ крови на 25-OH витамин D',
    normal_range: { min: 30, max: 100, optimal: 50 },
    unit: 'нг/мл',
    status: 'not_filled',
    importance: 'high'
  },
  {
    id: 'vitamin_b12',
    name: 'Витамин B12',
    category: 'oxidative_stress',
    description: 'Цианокобаламин',
    analysis_type: 'Анализ крови на витамин B12',
    normal_range: { min: 208, max: 963, optimal: 500 },
    unit: 'пмоль/л',
    status: 'not_filled',
    importance: 'medium'
  },
  {
    id: 'folate',
    name: 'Фолиевая кислота',
    category: 'oxidative_stress',
    description: 'Витамин B9',
    analysis_type: 'Анализ крови на фолиевую кислоту',
    normal_range: { min: 10, max: 42, optimal: 25 },
    unit: 'нмоль/л',
    status: 'not_filled',
    importance: 'medium'
  },
  {
    id: 'selenium',
    name: 'Селен',
    category: 'oxidative_stress',
    description: 'Микроэлемент-антиоксидант',
    analysis_type: 'Анализ крови на микроэлементы',
    normal_range: { min: 0.7, max: 1.5, optimal: 1.0 },
    unit: 'мкмоль/л',
    status: 'not_filled',
    importance: 'low'
  },
  {
    id: 'zinc',
    name: 'Цинк',
    category: 'oxidative_stress',
    description: 'Микроэлемент для иммунитета',
    analysis_type: 'Анализ крови на микроэлементы',
    normal_range: { min: 10.7, max: 17.0, optimal: 14.0 },
    unit: 'мкмоль/л',
    status: 'not_filled',
    importance: 'low'  
  },

  // Почечная функция
  {
    id: 'creatinine',
    name: 'Креатинин',
    category: 'kidney_function',
    description: 'Показатель функции почек',
    analysis_type: 'Биохимический анализ крови',
    normal_range: { min: 62, max: 115, optimal: 88 },
    unit: 'мкмоль/л',
    status: 'not_filled',
    importance: 'medium'
  },
  {
    id: 'urea',
    name: 'Мочевина',
    category: 'kidney_function',
    description: 'Продукт белкового обмена',
    analysis_type: 'Биохимический анализ крови',
    normal_range: { min: 2.5, max: 8.3, optimal: 5.0 },
    unit: 'ммоль/л',
    status: 'not_filled',
    importance: 'medium'
  },
  {
    id: 'egfr',
    name: 'СКФ (скорость клубочковой фильтрации)',
    category: 'kidney_function',
    description: 'Оценка функции почек',
    analysis_type: 'Расчетный показатель',
    normal_range: { min: 90, max: 120, optimal: 100 },
    unit: 'мл/мин/1.73м²',
    status: 'not_filled',
    importance: 'medium'
  },

  // Печеночная функция
  {
    id: 'alt',
    name: 'АЛТ (аланинаминотрансфераза)',
    category: 'liver_function',
    description: 'Фермент печени',
    analysis_type: 'Биохимический анализ крови',
    normal_range: { min: 0, max: 41, optimal: 20 },
    unit: 'Ед/л',
    status: 'not_filled',
    importance: 'medium'
  },
  {
    id: 'ast',
    name: 'АСТ (аспартатаминотрансфераза)',
    category: 'liver_function',
    description: 'Фермент печени и сердца',
    analysis_type: 'Биохимический анализ крови',
    normal_range: { min: 0, max: 40, optimal: 20 },
    unit: 'Ед/л',
    status: 'not_filled',
    importance: 'medium'
  },
  {
    id: 'bilirubin',
    name: 'Билирубин общий',
    category: 'liver_function',
    description: 'Продукт распада гемоглобина',
    analysis_type: 'Биохимический анализ крови',
    normal_range: { min: 5, max: 21, optimal: 12 },
    unit: 'мкмоль/л',
    status: 'not_filled',
    importance: 'medium'
  },

  // Теломеры и эпигенетика
  {
    id: 'telomere_length',
    name: 'Длина теломер',
    category: 'telomeres_epigenetics',
    description: 'Показатель клеточного старения',
    analysis_type: 'Анализ на теломеры (специализированный)',
    normal_range: { min: 0.8, max: 1.2, optimal: 1.0 },
    unit: 'T/S отношение',
    status: 'not_filled',
    importance: 'low'
  },
  {
    id: 'epigenetic_age',
    name: 'Эпигенетический возраст',
    category: 'telomeres_epigenetics',
    description: 'Биологический возраст на основе ДНК',
    analysis_type: 'DNAm анализ (специализированный)',
    normal_range: { min: 20, max: 80, optimal: 35 },
    unit: 'лет',
    status: 'not_filled',
    importance: 'low'
  }
];

export const ACCURACY_LEVELS = {
  basic: {
    min: 8,
    percentage: 60,
    description: 'Базовый расчет'
  },
  extended: {
    min: 16,
    percentage: 80,
    description: 'Расширенный анализ'
  },
  comprehensive: {
    min: 24,
    percentage: 95,
    description: 'Максимальная точность'
  }
};
