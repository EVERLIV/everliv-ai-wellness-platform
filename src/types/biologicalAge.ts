
export interface BiologicalAgeData {
  id?: string;
  user_id: string;
  biomarkers: Biomarker[];
  health_profile_data?: any;
  calculated_age?: number;
  chronological_age: number;
  accuracy_level: number;
  ai_analysis?: string;
  recommendations?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Biomarker {
  id: string;
  name: string;
  category: BiomarkerCategory;
  description: string;
  analysis_type: string;
  normal_range: NormalRange;
  value?: number;
  unit: string;
  status: 'not_filled' | 'filled';
  importance: 'high' | 'medium' | 'low';
}

export interface NormalRange {
  min: number;
  max: number;
  optimal?: number;
  age_dependent?: boolean;
  gender_dependent?: boolean;
}

export type BiomarkerCategory = 
  | 'cardiovascular'
  | 'metabolic'
  | 'hormonal'
  | 'inflammatory'
  | 'oxidative_stress'
  | 'kidney_function'
  | 'liver_function'
  | 'telomeres_epigenetics';

export interface BiologicalAgeResult {
  biological_age: number;
  chronological_age: number;
  age_difference: number;
  accuracy_percentage: number;
  confidence_level: number;
  analysis: string;
  recommendations: string[];
  missing_analyses: string[];
  next_suggested_tests: string[];
}

export interface AccuracyLevel {
  level: 'basic' | 'extended' | 'comprehensive';
  percentage: number;
  required_tests: number;
  current_tests: number;
  description: string;
}
