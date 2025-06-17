
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
}
