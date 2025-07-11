// Константы для нормальных значений биомаркеров с учетом пола и возраста
export interface BiomarkerNorms {
  [biomarkerName: string]: {
    male?: {
      [ageGroup: string]: string;
    };
    female?: {
      [ageGroup: string]: string;
    };
    general?: string; // Общие нормы, если не зависят от пола
  };
}

export const BIOMARKER_NORMS: BiomarkerNorms = {
  'Гемоглобин': {
    male: {
      '18-64': '130-170 г/л',
      '65+': '120-160 г/л'
    },
    female: {
      '18-50': '120-150 г/л',
      '51+': '120-160 г/л'
    }
  },
  'Эритроциты': {
    male: {
      'all': '4.0-5.1 млн/мкл'
    },
    female: {
      'all': '3.7-4.7 млн/мкл'
    }
  },
  'Лейкоциты': {
    general: '4.0-9.0 тыс/мкл'
  },
  'Тромбоциты': {
    general: '150-450 тыс/мкл'
  },
  'СОЭ': {
    male: {
      'all': '2-10 мм/ч'
    },
    female: {
      'all': '2-15 мм/ч'
    }
  },
  'Скорость оседания эритроцитов (СОЭ)': {
    male: {
      'all': '2-10 мм/ч'
    },
    female: {
      'all': '2-15 мм/ч'
    }
  },
  'Глюкоза': {
    general: '3.3-5.5 ммоль/л'
  },
  'Креатинин': {
    male: {
      'all': '62-106 мкмоль/л'
    },
    female: {
      'all': '44-80 мкмоль/л'
    }
  },
  'Мочевина': {
    general: '2.5-8.3 ммоль/л'
  },
  'Мочевая кислота': {
    male: {
      'all': '200-420 мкмоль/л'
    },
    female: {
      'all': '140-340 мкмоль/л'
    }
  },
  'Общий белок': {
    general: '64-84 г/л'
  },
  'Альбумин': {
    general: '35-52 г/л'
  },
  'Билирубин общий': {
    general: '5-21 мкмоль/л'
  },
  'Билирубин прямой': {
    general: '0-5 мкмоль/л'
  },
  'АЛТ': {
    male: {
      'all': 'до 40 Ед/л'
    },
    female: {
      'all': 'до 32 Ед/л'
    }
  },
  'АСТ': {
    male: {
      'all': 'до 40 Ед/л'
    },
    female: {
      'all': 'до 32 Ед/л'
    }
  },
  'Щелочная фосфатаза': {
    general: '40-150 Ед/л'
  },
  'Калий': {
    general: '3.5-5.1 ммоль/л'
  },
  'Натрий': {
    general: '136-145 ммоль/л'
  },
  'Хлор': {
    general: '98-107 ммоль/л'
  },
  'Кальций общий': {
    general: '2.15-2.65 ммоль/л'
  },
  'Магний': {
    general: '0.75-1.25 ммоль/л'
  },
  'Фосфор': {
    general: '0.81-1.45 ммоль/л'
  },
  'Железо': {
    male: {
      'all': '11-31 мкмоль/л'
    },
    female: {
      'all': '9-30 мкмоль/л'
    }
  },
  'Холестерин общий': {
    general: 'до 5.2 ммоль/л'
  },
  'Холестерин ЛПНП': {
    general: 'до 3.0 ммоль/л'
  },
  'Холестерин ЛПВП': {
    male: {
      'all': 'выше 1.0 ммоль/л'
    },
    female: {
      'all': 'выше 1.2 ммоль/л'
    }
  },
  'Триглицериды': {
    general: 'до 1.7 ммоль/л'
  },
  'Ретикулоциты': {
    general: '0.5-2.0%'
  },
  'Ретикулоциты (абсолютное количество)': {
    general: '20-100 тыс/мкл'
  }
};

// Функция для определения возрастной группы
export const getAgeGroup = (birthDate: string | null): string => {
  if (!birthDate) return 'all';
  
  const birth = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  
  if (age < 18) return 'all';
  if (age >= 18 && age <= 50) return '18-50';
  if (age >= 51 && age <= 64) return '51-64';
  if (age >= 65) return '65+';
  
  return 'all';
};

// Функция для получения нормы биомаркера
export const getBiomarkerNorm = (
  biomarkerName: string, 
  gender: string | null, 
  birthDate: string | null
): string => {
  const norms = BIOMARKER_NORMS[biomarkerName];
  
  if (!norms) {
    return 'Норма не определена';
  }
  
  // Если есть общие нормы, используем их
  if (norms.general) {
    return norms.general;
  }
  
  // Определяем пол и возрастную группу
  const ageGroup = getAgeGroup(birthDate);
  const genderKey = gender?.toLowerCase() === 'male' || gender?.toLowerCase() === 'м' ? 'male' : 'female';
  
  // Ищем нормы для конкретного пола и возраста
  if (norms[genderKey]) {
    const genderNorms = norms[genderKey];
    
    // Ищем точное совпадение возрастной группы
    if (genderNorms[ageGroup]) {
      return genderNorms[ageGroup];
    }
    
    // Если точного совпадения нет, ищем 'all'
    if (genderNorms['all']) {
      return genderNorms['all'];
    }
    
    // Возвращаем первую доступную норму
    const firstNorm = Object.values(genderNorms)[0];
    if (firstNorm) {
      return firstNorm;
    }
  }
  
  // Если нет норм для указанного пола, пробуем другой пол
  const otherGender = genderKey === 'male' ? 'female' : 'male';
  if (norms[otherGender]) {
    const otherGenderNorms = norms[otherGender];
    
    if (otherGenderNorms[ageGroup]) {
      return otherGenderNorms[ageGroup];
    }
    
    if (otherGenderNorms['all']) {
      return otherGenderNorms['all'];
    }
    
    const firstNorm = Object.values(otherGenderNorms)[0];
    if (firstNorm) {
      return firstNorm;
    }
  }
  
  return 'Норма не определена';
};