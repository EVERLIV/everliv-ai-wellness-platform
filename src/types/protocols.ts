
// Protocol-related types that aren't directly tied to database tables

// User protocol type for the My Protocols page
export type UserProtocol = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  steps: string[];
  benefits: string[];
  warnings: string[];
  category: string;
  added_at: string;
  status: 'not_started' | 'in_progress' | 'paused' | 'completed';
  completion_percentage: number;
  started_at?: string | null;
  completed_at?: string | null;
  notes?: string | null;
};

// Protocol type for the useProtocolData hook
export type Protocol = {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  difficulty: string;
  status: string;
  benefits: string[];
  steps: string[];
  completion_percentage: number;
  started_at: string | null;
};
