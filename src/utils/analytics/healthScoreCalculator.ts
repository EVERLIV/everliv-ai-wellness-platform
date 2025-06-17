
// Функция для нормализации уровня риска
export const normalizeRiskLevel = (riskLevel: string): string => {
  if (!riskLevel || riskLevel === 'unknown') return 'средний';
  
  const level = riskLevel.toLowerCase().trim();
  
  if (level.includes('низк') || level === 'low' || level === 'минимальный') return 'низкий';
  if (level.includes('высок') || level === 'high' || level === 'критический') return 'высокий';
  if (level.includes('средн') || level === 'medium' || level === 'умеренный') return 'средний';
  
  return 'средний';
};

// Функция для расчета базового уровня риска на основе профиля
export const calculateDefaultRiskLevel = (healthProfile: any): string => {
  let riskFactors = 0;
  
  // Проверяем факторы риска
  if (healthProfile.smokingStatus === 'regular' || healthProfile.smokingStatus === 'occasional') {
    riskFactors += 2;
  }
  
  if (healthProfile.physicalActivity === 'sedentary') {
    riskFactors += 1;
  }
  
  if (healthProfile.alcoholConsumption === 'heavy') {
    riskFactors += 1;
  }
  
  if (healthProfile.sleepHours < 6) {
    riskFactors += 1;
  }
  
  if (healthProfile.stressLevel > 7) {
    riskFactors += 1;
  }
  
  if (healthProfile.age > 50) {
    riskFactors += 1;
  }
  
  // Определяем уровень риска
  if (riskFactors >= 3) return 'высокий';
  if (riskFactors >= 1) return 'средний';
  return 'низкий';
};

// Функция для расчета базового балла здоровья
export const calculateDefaultHealthScore = (healthProfile: any): number => {
  let score = 80; // Базовый балл
  
  // Вычитаем за негативные факторы
  if (healthProfile.smokingStatus === 'regular') score -= 15;
  else if (healthProfile.smokingStatus === 'occasional') score -= 8;
  
  if (healthProfile.physicalActivity === 'sedentary') score -= 10;
  else if (healthProfile.physicalActivity === 'light') score -= 5;
  
  if (healthProfile.alcoholConsumption === 'heavy') score -= 10;
  else if (healthProfile.alcoholConsumption === 'moderate') score -= 3;
  
  if (healthProfile.sleepHours < 6) score -= 8;
  else if (healthProfile.sleepHours < 7) score -= 4;
  
  if (healthProfile.stressLevel > 7) score -= 8;
  else if (healthProfile.stressLevel > 5) score -= 4;
  
  // Добавляем за позитивные факторы
  if (healthProfile.exerciseFrequency >= 5) score += 5;
  else if (healthProfile.exerciseFrequency >= 3) score += 3;
  
  if (healthProfile.waterIntake >= 8) score += 3;
  
  return Math.max(30, Math.min(100, score));
};
