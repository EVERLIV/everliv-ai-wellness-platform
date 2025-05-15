
import { Database } from '@/integrations/supabase/types';

// Blog Post Types
export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];
export type BlogPostUpdate = Database['public']['Tables']['blog_posts']['Update'];

// Page Types
export type Page = Database['public']['Tables']['pages']['Row'];
export type PageInsert = Database['public']['Tables']['pages']['Insert'];
export type PageUpdate = Database['public']['Tables']['pages']['Update'];

// Page Content Types
export type PageContent = Database['public']['Tables']['page_contents']['Row'];
export type PageContentInsert = Database['public']['Tables']['page_contents']['Insert'];
export type PageContentUpdate = Database['public']['Tables']['page_contents']['Update'];

// Protocol Types
export type ProtocolWellbeing = Database['public']['Tables']['protocol_wellbeing']['Row'];
export type ProtocolWellbeingInsert = Database['public']['Tables']['protocol_wellbeing']['Insert'];
export type ProtocolWellbeingUpdate = Database['public']['Tables']['protocol_wellbeing']['Update'];

export type ProtocolSupplement = Database['public']['Tables']['protocol_supplements']['Row'];
export type ProtocolSupplementInsert = Database['public']['Tables']['protocol_supplements']['Insert'];
export type ProtocolSupplementUpdate = Database['public']['Tables']['protocol_supplements']['Update'];

export type ProtocolEvent = Database['public']['Tables']['protocol_events']['Row'];
export type ProtocolEventInsert = Database['public']['Tables']['protocol_events']['Insert'];
export type ProtocolEventUpdate = Database['public']['Tables']['protocol_events']['Update'];

// User Protocol Types
export type UserProtocol = Database['public']['Tables']['user_protocols']['Row'];
export type UserProtocolInsert = Database['public']['Tables']['user_protocols']['Insert'];
export type UserProtocolUpdate = Database['public']['Tables']['user_protocols']['Update'];

// Feature Trial Types
export type FeatureTrial = Database['public']['Tables']['feature_trials']['Row'];
export type FeatureTrialInsert = Database['public']['Tables']['feature_trials']['Insert'];
export type FeatureTrialUpdate = Database['public']['Tables']['feature_trials']['Update'];
