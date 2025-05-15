
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
