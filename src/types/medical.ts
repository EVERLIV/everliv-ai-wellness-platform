
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
  article_type: 'symptom' | 'disease' | 'guide' | 'faq' | 'doctor_info';
  tags?: string[];
  author?: string;
  medical_review_status: 'pending' | 'approved' | 'rejected';
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
  created_at: string;
}
