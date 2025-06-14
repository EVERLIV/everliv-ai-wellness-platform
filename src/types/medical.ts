
export interface MedicalCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface MedicalArticle {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  category_id?: string;
  article_type: string;
  tags?: string[];
  author?: string;
  medical_review_status: string;
  published: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
  category?: MedicalCategory;
}

export interface PatientReview {
  id: string;
  article_id?: string;
  patient_name?: string;
  email?: string;
  rating: number;
  review_text: string;
  is_verified: boolean;
  is_published: boolean;
  created_at: string;
}

export interface DoctorSpecialization {
  id: string;
  name: string;
  description?: string;
  required_education?: string;
  common_conditions?: string[];
  detailed_description?: string;
  health_areas?: string[];
  treatment_methods?: string[];
  typical_consultations?: string[];
  avg_consultation_duration?: number;
  specialists_count?: number;
  created_at: string;
}

export interface MoscowSpecialist {
  id: string;
  name: string;
  specialization_id?: string;
  experience_years?: number;
  education?: string;
  workplace?: string;
  rating?: number;
  reviews_count?: number;
  consultation_price?: number;
  phone?: string;
  email?: string;
  address?: string;
  metro_station?: string;
  working_hours?: string;
  languages?: string[];
  services?: string[];
  achievements?: string[];
  photo_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
  specialization?: DoctorSpecialization;
}

export interface SpecialistReview {
  id: string;
  specialist_id?: string;
  patient_name?: string;
  rating?: number;
  review_text?: string;
  consultation_date?: string;
  is_verified?: boolean;
  is_published?: boolean;
  created_at: string;
}
