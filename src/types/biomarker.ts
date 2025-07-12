export interface BiomarkerKnowledge {
  id: string;
  name: string;
  alternativeNames?: string[];
  category: 'blood_general' | 'blood_biochemistry' | 'hormones' | 'immunology' | 'coagulation' | 'urine' | 'tumor_markers';
  normalRanges: {
    men?: string;
    women?: string;
    children?: string;
    general?: string;
  };
  unit: string;
  description: string;
  function: string;
  whatItMeasures: string;
  clinicalSignificance: {
    high: {
      causes: string[];
      symptoms: string[];
      recommendations: string[];
    };
    low: {
      causes: string[];
      symptoms: string[];
      recommendations: string[];
    };
  };
  relatedTests: string[];
  preparation: string[];
  frequency: string;
  riskFactors: string[];
  ageGenderFactors?: {
    age?: string;
    gender?: string;
    pregnancy?: string;
  };
  source: 'minzdrav' | 'lab_guidelines' | 'international_standards';
  lastUpdated: string;
  tags: string[];
}

export interface BiomarkerCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  count: number;
}

export const BIOMARKER_CATEGORIES: BiomarkerCategory[] = [
  {
    id: 'blood_general',
    name: 'Общий анализ крови',
    description: 'Основные показатели крови: эритроциты, лейкоциты, тромбоциты, гемоглобин',
    color: 'bg-red-500',
    icon: 'droplet',
    count: 0
  },
  {
    id: 'blood_biochemistry',
    name: 'Биохимический анализ',
    description: 'Показатели обмена веществ: глюкоза, белки, ферменты, электролиты',
    color: 'bg-blue-500',
    icon: 'flask',
    count: 0
  },
  {
    id: 'hormones',
    name: 'Гормональные показатели',
    description: 'Гормоны щитовидной железы, половые, стрессовые гормоны',
    color: 'bg-purple-500',
    icon: 'brain',
    count: 0
  },
  {
    id: 'immunology',
    name: 'Иммунологические тесты',
    description: 'Антитела, иммуноглобулины, маркеры воспаления',
    color: 'bg-green-500',
    icon: 'shield',
    count: 0
  },
  {
    id: 'coagulation',
    name: 'Коагулограмма',
    description: 'Показатели свертываемости крови',
    color: 'bg-orange-500',
    icon: 'timer',
    count: 0
  },
  {
    id: 'urine',
    name: 'Анализ мочи',
    description: 'Общий и биохимический анализ мочи',
    color: 'bg-yellow-500',
    icon: 'beaker',
    count: 0
  },
  {
    id: 'tumor_markers',
    name: 'Онкомаркеры',
    description: 'Маркеры онкологических заболеваний',
    color: 'bg-pink-500',
    icon: 'target',
    count: 0
  }
];