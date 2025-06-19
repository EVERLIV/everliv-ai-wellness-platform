
export interface HealthProfileData {
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // см
  weight: number; // кг
  exerciseFrequency: number; // раз в неделю
  stressLevel: number; // 1-10
  anxietyLevel: number; // 1-10
  waterIntake: number; // стаканов в день
  caffeineIntake: number; // чашек кофе в день
  sleepHours: number; // часов сна
  labResults: {
    [key: string]: {
      value: number;
      unit: string;
      referenceRange: string;
    };
  };
  // Новые настройки рекомендаций
  recommendationSettings?: {
    intermittentFasting: boolean;
    coldTherapy: boolean;
    breathingPractices: boolean;
    supplements: boolean;
    lifestyle: boolean;
    nutrition: boolean;
    exercise: boolean;
    stress: boolean;
  };
}

export interface HealthProfileFormData extends HealthProfileData {}
