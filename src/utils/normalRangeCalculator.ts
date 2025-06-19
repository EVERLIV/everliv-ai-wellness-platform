
interface NormalRangeData {
  min: number;
  max: number;
  optimal?: number;
}

interface AgeGenderAdjustment {
  [key: string]: {
    male?: {
      [ageRange: string]: NormalRangeData;
    };
    female?: {
      [ageRange: string]: NormalRangeData;
    };
  };
}

// Научно обоснованные нормы с учетом возраста и пола
const AGE_GENDER_ADJUSTMENTS: AgeGenderAdjustment = {
  'cholesterol_total': {
    male: {
      '18-29': { min: 3.0, max: 5.2, optimal: 4.5 },
      '30-39': { min: 3.5, max: 5.8, optimal: 5.0 },
      '40-49': { min: 3.8, max: 6.2, optimal: 5.2 },
      '50-59': { min: 4.0, max: 6.5, optimal: 5.5 },
      '60+': { min: 4.2, max: 6.8, optimal: 5.8 }
    },
    female: {
      '18-29': { min: 3.0, max: 5.0, optimal: 4.2 },
      '30-39': { min: 3.2, max: 5.5, optimal: 4.5 },
      '40-49': { min: 3.5, max: 5.8, optimal: 4.8 },
      '50-59': { min: 4.0, max: 6.5, optimal: 5.2 },
      '60+': { min: 4.2, max: 6.8, optimal: 5.5 }
    }
  },
  'hdl_cholesterol': {
    male: {
      '18-29': { min: 1.0, max: 1.8, optimal: 1.5 },
      '30-39': { min: 1.0, max: 1.8, optimal: 1.4 },
      '40-49': { min: 1.0, max: 1.7, optimal: 1.3 },
      '50-59': { min: 1.0, max: 1.6, optimal: 1.2 },
      '60+': { min: 1.0, max: 1.5, optimal: 1.2 }
    },
    female: {
      '18-29': { min: 1.2, max: 2.2, optimal: 1.8 },
      '30-39': { min: 1.2, max: 2.1, optimal: 1.7 },
      '40-49': { min: 1.2, max: 2.0, optimal: 1.6 },
      '50-59': { min: 1.2, max: 1.9, optimal: 1.5 },
      '60+': { min: 1.2, max: 1.8, optimal: 1.4 }
    }
  },
  'glucose': {
    male: {
      '18-29': { min: 3.9, max: 5.6, optimal: 4.5 },
      '30-39': { min: 4.0, max: 5.8, optimal: 4.7 },
      '40-49': { min: 4.1, max: 6.0, optimal: 4.9 },
      '50-59': { min: 4.2, max: 6.2, optimal: 5.1 },
      '60+': { min: 4.3, max: 6.5, optimal: 5.3 }
    },
    female: {
      '18-29': { min: 3.8, max: 5.4, optimal: 4.3 },
      '30-39': { min: 3.9, max: 5.6, optimal: 4.5 },
      '40-49': { min: 4.0, max: 5.8, optimal: 4.7 },
      '50-59': { min: 4.1, max: 6.0, optimal: 4.9 },
      '60+': { min: 4.2, max: 6.2, optimal: 5.1 }
    }
  },
  'testosterone': {
    male: {
      '18-29': { min: 14.0, max: 35.0, optimal: 25.0 },
      '30-39': { min: 12.0, max: 32.0, optimal: 22.0 },
      '40-49': { min: 10.0, max: 28.0, optimal: 19.0 },
      '50-59': { min: 8.0, max: 25.0, optimal: 16.0 },
      '60+': { min: 6.0, max: 22.0, optimal: 14.0 }
    },
    female: {
      '18-29': { min: 0.5, max: 2.5, optimal: 1.5 },
      '30-39': { min: 0.4, max: 2.3, optimal: 1.3 },
      '40-49': { min: 0.3, max: 2.0, optimal: 1.1 },
      '50-59': { min: 0.2, max: 1.8, optimal: 1.0 },
      '60+': { min: 0.1, max: 1.5, optimal: 0.8 }
    }
  }
};

function getAgeGroup(age: number): string {
  if (age < 30) return '18-29';
  if (age < 40) return '30-39';
  if (age < 50) return '40-49';
  if (age < 60) return '50-59';
  return '60+';
}

export function calculateNormalRange(
  biomarkerId: string,
  age: number,
  gender: string,
  defaultRange: NormalRangeData
): NormalRangeData {
  const ageGroup = getAgeGroup(age);
  const genderKey = gender.toLowerCase() === 'мужской' ? 'male' : 'female';
  
  const adjustments = AGE_GENDER_ADJUSTMENTS[biomarkerId];
  if (adjustments && adjustments[genderKey] && adjustments[genderKey]![ageGroup]) {
    return adjustments[genderKey]![ageGroup];
  }
  
  // Если нет специфических данных, возвращаем базовый диапазон
  return defaultRange;
}

export function isValueInRange(value: number, range: NormalRangeData): 'low' | 'normal' | 'high' {
  if (value < range.min) return 'low';
  if (value > range.max) return 'high';
  return 'normal';
}

export function getValueStatus(value: number, range: NormalRangeData): {
  status: 'low' | 'normal' | 'high' | 'optimal';
  color: string;
  description: string;
} {
  if (range.optimal && Math.abs(value - range.optimal) <= (range.max - range.min) * 0.1) {
    return {
      status: 'optimal',
      color: 'text-emerald-600',
      description: 'Оптимально'
    };
  }
  
  const rangeStatus = isValueInRange(value, range);
  
  switch (rangeStatus) {
    case 'low':
      return {
        status: 'low',
        color: 'text-blue-600',
        description: 'Ниже нормы'
      };
    case 'high':
      return {
        status: 'high',
        color: 'text-red-600',
        description: 'Выше нормы'
      };
    default:
      return {
        status: 'normal',
        color: 'text-green-600',
        description: 'В норме'
      };
  }
}
