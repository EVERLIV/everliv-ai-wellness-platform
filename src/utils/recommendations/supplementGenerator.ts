
import { HealthProfileData } from '@/types/healthProfile';
import { Supplement } from '@/types/detailedRecommendations';

export const generateSupplementRecommendations = (healthProfile?: HealthProfileData): Supplement[] => {
  const supplements: Supplement[] = [];

  // Базовые добавки для всех
  supplements.push({
    id: 'vitamin-d',
    name: 'Витамин D3',
    dosage: '1000-2000 МЕ',
    timing: 'Утром с жирной пищей',
    benefit: 'Поддержка иммунитета и здоровья костей',
    duration: 'Постоянно, особенно зимой',
    cost: '500-1000₽ за упаковку',
    whereToBuy: 'Аптеки, проверенные интернет-магазины'
  });

  if (!healthProfile) {
    return supplements;
  }

  // Добавки на основе уровня стресса
  if (healthProfile.stressLevel > 6) {
    supplements.push({
      id: 'magnesium',
      name: 'Магний',
      dosage: '300-400 мг',
      timing: 'Вечером с едой',
      benefit: 'Снижение стресса, улучшение сна',
      duration: '2-3 месяца',
      cost: '800-1500₽',
      whereToBuy: 'Аптеки'
    });
  }

  return supplements;
};
