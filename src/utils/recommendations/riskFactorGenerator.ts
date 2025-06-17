
import { HealthProfileData } from '@/types/healthProfile';

export const generateRiskFactors = (healthProfile?: HealthProfileData): string[] => {
  const riskFactors: string[] = [];

  if (!healthProfile) {
    return ['Заполните профиль здоровья для анализа факторов риска'];
  }

  // Calculate BMI and check for risk factors
  const bmi = healthProfile.weight / ((healthProfile.height / 100) ** 2);
  
  if (bmi > 30) {
    riskFactors.push('Ожирение (ИМТ > 30)');
  } else if (bmi > 25) {
    riskFactors.push('Избыточный вес (ИМТ > 25)');
  }

  if (healthProfile.smokingStatus === 'regular') {
    riskFactors.push('Курение');
  }

  if (healthProfile.alcoholConsumption === 'daily') {
    riskFactors.push('Ежедневное употребление алкоголя');
  }

  if (healthProfile.stressLevel > 7) {
    riskFactors.push('Высокий уровень стресса');
  }

  if (healthProfile.sleepHours < 6) {
    riskFactors.push('Недостаток сна');
  }

  return riskFactors.length > 0 ? riskFactors : ['Значительных факторов риска не выявлено'];
};
