
import { HealthProfileData } from '@/types/healthProfile';

export const generateSpecialistRecommendations = (healthProfile?: HealthProfileData): string[] => {
  const specialists: string[] = [];

  if (!healthProfile) {
    return ['Терапевт - для общего осмотра'];
  }

  // Always recommend general practitioner
  specialists.push('Терапевт - ежегодный осмотр');

  // BMI-based recommendations
  const bmi = healthProfile.weight / ((healthProfile.height / 100) ** 2);
  if (bmi > 30) {
    specialists.push('Эндокринолог - консультация по метаболизму');
  }

  // Mental health recommendations
  if (healthProfile.stressLevel > 7 || healthProfile.anxietyLevel > 7) {
    specialists.push('Психолог/Психотерапевт - работа со стрессом');
  }

  // Sleep recommendations
  if (healthProfile.sleepHours < 6 || healthProfile.sleepQuality === 'poor') {
    specialists.push('Сомнолог - диагностика нарушений сна');
  }

  // Chronic conditions
  if (healthProfile.chronicConditions && healthProfile.chronicConditions.length > 0) {
    specialists.push('Узкие специалисты по хроническим заболеваниям');
  }

  return specialists;
};
