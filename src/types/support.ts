
export interface SupportRequest {
  id: string;
  user_name: string;
  user_email: string;
  subject: string;
  message: string;
  request_type: 'rating' | 'bug' | 'question' | 'feature';
  rating?: number;
  rating_comment?: string;
  problem_type?: string;
  browser_info?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  admin_notes?: string;
  resolved_at?: string;
  resolved_by?: string;
  created_at: string;
  updated_at: string;
}

export interface SupportRequestInsert {
  user_name: string;
  user_email: string;
  subject: string;
  message: string;
  request_type: 'rating' | 'bug' | 'question' | 'feature';
  rating?: number;
  rating_comment?: string;
  problem_type?: string;
  browser_info?: string;
}
