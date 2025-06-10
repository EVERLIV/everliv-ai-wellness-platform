
import { expandedBiomarkersData, ExpandedBiomarker } from '@/data/expandedBiomarkers';

export interface BiomarkerResult {
  biomarker: ExpandedBiomarker;
  value: number;
  status: 'optimal' | 'good' | 'attention' | 'high' | 'low' | 'critical';
  interpretation: string;
  interpretationRu: string;
  recommendations: string[];
  recommendationsRu: string[];
}

export const analyzeBiomarker = (
  biomarkerCode: string,
  value: number,
  gender: 'male' | 'female',
  age?: number
): BiomarkerResult | null => {
  const biomarker = expandedBiomarkersData[biomarkerCode];
  if (!biomarker) return null;

  const isOptimalRange = biomarker.optimalRangeMaleMin && biomarker.optimalRangeMaleMax;
  const genderPrefix = gender === 'male' ? 'male' : 'female';
  
  // Определяем референсные значения с учетом возраста
  let normalMin, normalMax, optimalMin, optimalMax;
  
  if (age && biomarker.ageRanges) {
    const ageGroup = getAgeGroup(age);
    const ageRange = biomarker.ageRanges[ageGroup];
    if (ageRange) {
      normalMin = gender === 'male' ? ageRange.maleMin : ageRange.femaleMin;
      normalMax = gender === 'male' ? ageRange.maleMax : ageRange.femaleMax;
    }
  }
  
  if (!normalMin || !normalMax) {
    normalMin = gender === 'male' ? biomarker.normalRangeMaleMin : biomarker.normalRangeFemaleMin;
    normalMax = gender === 'male' ? biomarker.normalRangeMaleMax : biomarker.normalRangeFemaleMax;
  }

  if (isOptimalRange) {
    optimalMin = gender === 'male' ? biomarker.optimalRangeMaleMin! : biomarker.optimalRangeFemaleMin!;
    optimalMax = gender === 'male' ? biomarker.optimalRangeMaleMax! : biomarker.optimalRangeFemaleMax!;
  }

  // Определяем статус
  let status: BiomarkerResult['status'];
  let interpretation: string;
  let interpretationRu: string;
  
  if (optimalMin && optimalMax) {
    if (value >= optimalMin && value <= optimalMax) {
      status = 'optimal';
      interpretation = 'Value is in optimal range';
      interpretationRu = 'Значение в оптимальном диапазоне';
    } else if (value >= normalMin && value <= normalMax) {
      status = 'good';
      interpretation = 'Value is in normal range but not optimal';
      interpretationRu = 'Значение в норме, но не оптимально';
    } else if (value < normalMin) {
      if (value < normalMin * 0.7) {
        status = 'critical';
        interpretation = 'Critically low value requiring immediate attention';
        interpretationRu = 'Критически низкое значение, требующее немедленного внимания';
      } else {
        status = 'low';
        interpretation = 'Below normal range';
        interpretationRu = 'Ниже нормы';
      }
    } else {
      if (value > normalMax * 1.5) {
        status = 'critical';
        interpretation = 'Critically high value requiring immediate attention';
        interpretationRu = 'Критически высокое значение, требующее немедленного внимания';
      } else {
        status = 'high';
        interpretation = 'Above normal range';
        interpretationRu = 'Выше нормы';
      }
    }
  } else {
    if (value >= normalMin && value <= normalMax) {
      status = 'good';
      interpretation = 'Value is in normal range';
      interpretationRu = 'Значение в пределах нормы';
    } else if (value < normalMin) {
      status = 'low';
      interpretation = 'Below normal range';
      interpretationRu = 'Ниже нормы';
    } else {
      status = 'high';
      interpretation = 'Above normal range';
      interpretationRu = 'Выше нормы';
    }
  }

  // Генерируем рекомендации
  const recommendations = generateRecommendations(biomarker, status, value);
  const recommendationsRu = generateRecommendationsRu(biomarker, status, value);

  return {
    biomarker,
    value,
    status,
    interpretation,
    interpretationRu,
    recommendations,
    recommendationsRu
  };
};

const getAgeGroup = (age: number): string => {
  if (age <= 30) return "18-30";
  if (age <= 50) return "31-50";
  if (age <= 70) return "51-70";
  return "70+";
};

const generateRecommendations = (
  biomarker: ExpandedBiomarker,
  status: BiomarkerResult['status'],
  value: number
): string[] => {
  const recommendations: string[] = [biomarker.recommendations];
  
  if (status === 'critical') {
    recommendations.unshift('Seek immediate medical attention');
  } else if (status === 'high' || status === 'low') {
    recommendations.unshift('Consult with healthcare provider');
  }
  
  return recommendations;
};

const generateRecommendationsRu = (
  biomarker: ExpandedBiomarker,
  status: BiomarkerResult['status'],
  value: number
): string[] => {
  const recommendations: string[] = [biomarker.recommendationsRu];
  
  if (status === 'critical') {
    recommendations.unshift('Требуется немедленная медицинская помощь');
  } else if (status === 'high' || status === 'low') {
    recommendations.unshift('Необходима консультация врача');
  }
  
  return recommendations;
};

export const getBiomarkerReference = (
  biomarkerCode: string,
  gender: 'male' | 'female',
  age?: number
): string => {
  const biomarker = expandedBiomarkersData[biomarkerCode];
  if (!biomarker) return 'Референсные значения не найдены';

  let min, max;
  
  if (age && biomarker.ageRanges) {
    const ageGroup = getAgeGroup(age);
    const ageRange = biomarker.ageRanges[ageGroup];
    if (ageRange) {
      min = gender === 'male' ? ageRange.maleMin : ageRange.femaleMin;
      max = gender === 'male' ? ageRange.maleMax : ageRange.femaleMax;
    }
  }
  
  if (!min || !max) {
    min = gender === 'male' ? biomarker.normalRangeMaleMin : biomarker.normalRangeFemaleMin;
    max = gender === 'male' ? biomarker.normalRangeMaleMax : biomarker.normalRangeFemaleMax;
  }

  return `${min}-${max} ${biomarker.unit}`;
};
