import { EXPANDED_BIOMARKERS, BiomarkerInfo } from '@/data/expandedBiomarkers';

export interface BiomarkerResult {
  biomarker: BiomarkerInfo;
  value: number;
  status: 'optimal' | 'good' | 'attention' | 'high' | 'low' | 'critical';
  interpretation: string;
  interpretationRu: string;
  recommendations: string[];
  recommendationsRu: string[];
}

export const getStatusText = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'optimal': 'Оптимально',
    'good': 'Хорошо',
    'normal': 'Норма',
    'attention': 'Внимание',
    'high': 'Повышено',
    'low': 'Понижено',
    'critical': 'Критично',
    'risk': 'Риск',
    'unknown': 'Не определен'
  };
  return statusMap[status] || statusMap['unknown'];
};

export const analyzeBiomarker = (
  biomarkerCode: string,
  value: number,
  gender: 'male' | 'female',
  age?: number
): BiomarkerResult | null => {
  const biomarker = EXPANDED_BIOMARKERS[biomarkerCode];
  if (!biomarker) return null;

  // Простая логика определения статуса на основе описания
  let status: BiomarkerResult['status'] = 'good';
  let interpretation = biomarker.clinicalSignificance;
  let interpretationRu = biomarker.clinicalSignificance;

  return {
    biomarker,
    value,
    status,
    interpretation,
    interpretationRu,
    recommendations: [biomarker.function],
    recommendationsRu: [biomarker.function]
  };
};

export const getBiomarkerReference = (
  biomarkerCode: string,
  gender: 'male' | 'female',
  age?: number
): string => {
  const biomarker = EXPANDED_BIOMARKERS[biomarkerCode];
  if (!biomarker) return 'Референсные значения не найдены';
  return biomarker.normalRange || 'Не указано';
};