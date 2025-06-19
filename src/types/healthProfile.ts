
export interface HealthProfileData {
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // см
  weight: number; // кг
  
  // Physical health
  physicalActivity?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  exerciseFrequency: number; // раз в неделю
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
  
  // Mental health
  stressLevel: number; // 1-10
  anxietyLevel: number; // 1-10
  moodChanges?: 'stable' | 'occasional' | 'frequent';
  mentalHealthSupport?: 'none' | 'family_friends' | 'professional' | 'both';
  
  // Lifestyle
  smokingStatus?: 'never' | 'former' | 'current';
  alcoholConsumption?: 'never' | 'rarely' | 'occasionally' | 'regularly';
  dietType?: 'omnivore' | 'vegetarian' | 'vegan' | 'keto' | 'mediterranean' | 'other';
  waterIntake: number; // стаканов в день
  caffeineIntake: number; // чашек кофе в день
  
  // Sleep
  sleepHours: number; // часов сна
  sleepQuality?: 'poor' | 'fair' | 'good' | 'excellent';
  sleepIssues?: string[];
  
  // Medical history
  chronicConditions?: string[];
  currentSymptoms?: string[];
  familyHistory?: string[];
  allergies?: string[];
  medications?: string[];
  previousSurgeries?: string[];
  lastCheckup?: string;
  
  // Lab results - simplified structure
  labResults: {
    [key: string]: number | string | undefined;
    hemoglobin?: number;
    erythrocytes?: number;
    hematocrit?: number;
    mcv?: number;
    mchc?: number;
    platelets?: number;
    serumIron?: number;
    cholesterol?: number;
    bloodSugar?: number;
    ldh?: number;
    testDate?: string;
    lastUpdated?: string;
  };
  
  // Recommendation settings
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
