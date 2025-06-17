
import { HealthProfileData } from '@/types/healthProfile';

export const generatePersonalizedRecommendations = (healthProfile?: HealthProfileData): string[] => {
  const recommendations: string[] = [];

  if (!healthProfile) {
    return [
      'Заполните профиль здоровья для получения персональных рекомендаций',
      'Регулярно проходите медицинские осмотры',
      'Поддерживайте здоровый образ жизни'
    ];
  }

  // Add recommendations based on health profile data
  if (healthProfile.stressLevel > 6) {
    recommendations.push('Рассмотрите техники управления стрессом');
  }

  if (healthProfile.sleepHours < 7) {
    recommendations.push('Увеличьте продолжительность сна до 7-9 часов');
  }

  if (healthProfile.waterIntake < 6) {
    recommendations.push('Увеличьте потребление воды до 8 стаканов в день');
  }

  return recommendations.length > 0 ? recommendations : [
    'Продолжайте поддерживать здоровый образ жизни',
    'Регулярно контролируйте показатели здоровья'
  ];
};
