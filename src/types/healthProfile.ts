
export interface LabResults {
  // Общий анализ крови
  hemoglobin?: number; // г/л
  erythrocytes?: number; // млн/мкл
  hematocrit?: number; // %
  mcv?: number; // фл
  mchc?: number; // г/дл
  platelets?: number; // тыс/мкл
  serumIron?: number; // мкмоль/л
  
  // Биохимические исследования
  cholesterol?: number; // ммоль/л
  bloodSugar?: number; // ммоль/л
  ldh?: number; // Ед/л (лактатдегидрогеназа)
  
  // Метаданные
  lastUpdated?: string;
  testDate?: string;
}

export interface HealthProfileData {
  age: number;
  gender: string;
  height: number;
  weight: number;
  physicalActivity?: string;
  exerciseFrequency: number;
  fitnessLevel?: string;
  stressLevel: number;
  anxietyLevel: number;
  moodChanges?: string;
  mentalHealthSupport?: string;
  smokingStatus?: string;
  alcoholConsumption?: string;
  dietType?: string;
  waterIntake: number;
  caffeineIntake: number;
  sleepHours: number;
  sleepQuality?: string;
  sleepIssues?: string[];
  chronicConditions?: string[];
  currentSymptoms?: string[];
  familyHistory?: string[];
  allergies?: string[];
  medications?: string[];
  previousSurgeries?: string[];
  lastCheckup?: string;
  
  // Новые лабораторные данные
  labResults?: LabResults;
}
