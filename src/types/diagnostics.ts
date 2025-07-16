export interface DiagnosticSession {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  session_type: 'ecg' | 'ultrasound' | 'xray' | 'blood_test' | 'mixed' | 'other';
  status: 'draft' | 'in_progress' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface ECGRecord {
  id: string;
  session_id: string;
  user_id: string;
  file_url?: string;
  file_type?: string;
  analysis_status: 'pending' | 'processing' | 'completed' | 'failed';
  heart_rate?: number;
  rhythm_type?: string;
  intervals?: {
    pr_interval?: number;
    qrs_duration?: number;
    qt_interval?: number;
    qtc_interval?: number;
  };
  raw_data?: any;
  created_at: string;
  updated_at: string;
}

export interface DiagnosticFile {
  id: string;
  session_id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size?: number;
  upload_status: 'uploading' | 'uploaded' | 'processed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface AIDiagnosticAnalysis {
  id: string;
  session_id: string;
  user_id: string;
  analysis_type: 'ecg' | 'image' | 'text' | 'combined' | 'synthesis';
  input_data?: any;
  ai_findings?: {
    // ECG Analysis specific fields
    rhythm_analysis?: {
      rhythm_type?: string;
      heart_rate?: number;
      regularity?: string;
    };
    intervals?: {
      pr_interval?: string;
      qrs_duration?: string;
      qt_interval?: string;
      qtc_interval?: string;
    };
    morphology?: {
      p_waves?: string;
      qrs_complex?: string;
      t_waves?: string;
    };
    pathological_findings?: string[];
    clinical_interpretation?: string;
    risk_assessment?: {
      level?: string;
      factors?: string[];
    };
    // General fields
    primary_findings?: string[];
    abnormalities?: string[];
    risk_factors?: string[];
    recommendations?: string[];
    confidence_score?: number;
    parsing_error?: boolean;
    raw_analysis?: string;
  };
  confidence_score?: number;
  analysis_status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface DoctorDiagnosis {
  id: string;
  session_id: string;
  user_id: string;
  icd_code?: string;
  icd_description?: string;
  primary_diagnosis: string;
  secondary_diagnoses?: string[];
  severity_level?: 'mild' | 'moderate' | 'severe' | 'critical';
  complications?: string[];
  doctor_comments?: string;
  created_at: string;
  updated_at: string;
}

export interface DiagnosticRecommendation {
  id: string;
  session_id: string;
  user_id: string;
  recommendation_type: 'medication' | 'lifestyle' | 'monitoring' | 'procedure' | 'referral';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  ai_generated: boolean;
  doctor_approved?: boolean;
  implementation_status: 'pending' | 'started' | 'completed' | 'declined';
  created_at: string;
  updated_at: string;
}

export interface DiagnosticSessionWithDetails extends DiagnosticSession {
  files?: DiagnosticFile[];
  ecg_records?: ECGRecord[];
  ai_analyses?: AIDiagnosticAnalysis[];
  doctor_diagnoses?: DoctorDiagnosis[];
  recommendations?: DiagnosticRecommendation[];
}