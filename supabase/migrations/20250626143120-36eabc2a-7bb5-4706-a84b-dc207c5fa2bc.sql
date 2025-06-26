
-- Fix UUID validation issues and add proper RLS policies
-- First, let's ensure all tables have proper RLS policies

-- Add missing RLS policies for tables that don't have them
DO $$
BEGIN
    -- Enable RLS on tables that might not have it enabled
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables t 
        JOIN pg_class c ON c.relname = t.tablename 
        WHERE t.schemaname = 'public' AND t.tablename = 'biomarkers' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.biomarkers ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables t 
        JOIN pg_class c ON c.relname = t.tablename 
        WHERE t.schemaname = 'public' AND t.tablename = 'user_achievements' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables t 
        JOIN pg_class c ON c.relname = t.tablename 
        WHERE t.schemaname = 'public' AND t.tablename = 'subscription_plans' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables t 
        JOIN pg_class c ON c.relname = t.tablename 
        WHERE t.schemaname = 'public' AND t.tablename = 'subscriptions' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables t 
        JOIN pg_class c ON c.relname = t.tablename 
        WHERE t.schemaname = 'public' AND t.tablename = 'usage_tracking' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables t 
        JOIN pg_class c ON c.relname = t.tablename 
        WHERE t.schemaname = 'public' AND t.tablename = 'user_health_goals' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.user_health_goals ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables t 
        JOIN pg_class c ON c.relname = t.tablename 
        WHERE t.schemaname = 'public' AND t.tablename = 'nutrition_goals' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.nutrition_goals ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables t 
        JOIN pg_class c ON c.relname = t.tablename 
        WHERE t.schemaname = 'public' AND t.tablename = 'daily_health_metrics' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.daily_health_metrics ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables t 
        JOIN pg_class c ON c.relname = t.tablename 
        WHERE t.schemaname = 'public' AND t.tablename = 'newsletter_subscriptions' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables t 
        JOIN pg_class c ON c.relname = t.tablename 
        WHERE t.schemaname = 'public' AND t.tablename = 'support_requests' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables t 
        JOIN pg_class c ON c.relname = t.tablename 
        WHERE t.schemaname = 'public' AND t.tablename = 'personal_recommendations' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.personal_recommendations ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables t 
        JOIN pg_class c ON c.relname = t.tablename 
        WHERE t.schemaname = 'public' AND t.tablename = 'profiles' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables t 
        JOIN pg_class c ON c.relname = t.tablename 
        WHERE t.schemaname = 'public' AND t.tablename = 'user_roles' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables t 
        JOIN pg_class c ON c.relname = t.tablename 
        WHERE t.schemaname = 'public' AND t.tablename = 'blog_posts' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables t 
        JOIN pg_class c ON c.relname = t.tablename 
        WHERE t.schemaname = 'public' AND t.tablename = 'pages' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables t 
        JOIN pg_class c ON c.relname = t.tablename 
        WHERE t.schemaname = 'public' AND t.tablename = 'page_contents' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.page_contents ENABLE ROW LEVEL SECURITY;
    END IF;
END
$$;

-- Add comprehensive RLS policies for all tables

-- Biomarkers policies
DROP POLICY IF EXISTS "Users can view biomarkers from their analyses" ON public.biomarkers;
CREATE POLICY "Users can view biomarkers from their analyses" 
  ON public.biomarkers 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.medical_analyses ma 
      WHERE ma.id = biomarkers.analysis_id 
      AND ma.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create biomarkers for their analyses" ON public.biomarkers;
CREATE POLICY "Users can create biomarkers for their analyses" 
  ON public.biomarkers 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.medical_analyses ma 
      WHERE ma.id = biomarkers.analysis_id 
      AND ma.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update biomarkers from their analyses" ON public.biomarkers;
CREATE POLICY "Users can update biomarkers from their analyses" 
  ON public.biomarkers 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.medical_analyses ma 
      WHERE ma.id = biomarkers.analysis_id 
      AND ma.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete biomarkers from their analyses" ON public.biomarkers;
CREATE POLICY "Users can delete biomarkers from their analyses" 
  ON public.biomarkers 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.medical_analyses ma 
      WHERE ma.id = biomarkers.analysis_id 
      AND ma.user_id = auth.uid()
    )
  );

-- User achievements policies
DROP POLICY IF EXISTS "Users can view their own achievements" ON public.user_achievements;
CREATE POLICY "Users can view their own achievements" 
  ON public.user_achievements 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own achievements" ON public.user_achievements;
CREATE POLICY "Users can create their own achievements" 
  ON public.user_achievements 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Subscription plans policies (public read access)
DROP POLICY IF EXISTS "Anyone can view subscription plans" ON public.subscription_plans;
CREATE POLICY "Anyone can view subscription plans" 
  ON public.subscription_plans 
  FOR SELECT 
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage subscription plans" ON public.subscription_plans;
CREATE POLICY "Admins can manage subscription plans" 
  ON public.subscription_plans 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Subscriptions policies
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view their own subscriptions" 
  ON public.subscriptions 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can create their own subscriptions" 
  ON public.subscriptions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can update their own subscriptions" 
  ON public.subscriptions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Usage tracking policies
DROP POLICY IF EXISTS "Users can view their own usage tracking" ON public.usage_tracking;
CREATE POLICY "Users can view their own usage tracking" 
  ON public.usage_tracking 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own usage tracking" ON public.usage_tracking;
CREATE POLICY "Users can create their own usage tracking" 
  ON public.usage_tracking 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own usage tracking" ON public.usage_tracking;
CREATE POLICY "Users can update their own usage tracking" 
  ON public.usage_tracking 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- User health goals policies
DROP POLICY IF EXISTS "Users can view their own health goals" ON public.user_health_goals;
CREATE POLICY "Users can view their own health goals" 
  ON public.user_health_goals 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own health goals" ON public.user_health_goals;
CREATE POLICY "Users can create their own health goals" 
  ON public.user_health_goals 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own health goals" ON public.user_health_goals;
CREATE POLICY "Users can update their own health goals" 
  ON public.user_health_goals 
  FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own health goals" ON public.user_health_goals;
CREATE POLICY "Users can delete their own health goals" 
  ON public.user_health_goals 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Nutrition goals policies
DROP POLICY IF EXISTS "Users can view their own nutrition goals" ON public.nutrition_goals;
CREATE POLICY "Users can view their own nutrition goals" 
  ON public.nutrition_goals 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own nutrition goals" ON public.nutrition_goals;
CREATE POLICY "Users can create their own nutrition goals" 
  ON public.nutrition_goals 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own nutrition goals" ON public.nutrition_goals;
CREATE POLICY "Users can update their own nutrition goals" 
  ON public.nutrition_goals 
  FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own nutrition goals" ON public.nutrition_goals;
CREATE POLICY "Users can delete their own nutrition goals" 
  ON public.nutrition_goals 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Daily health metrics policies
DROP POLICY IF EXISTS "Users can view their own daily health metrics" ON public.daily_health_metrics;
CREATE POLICY "Users can view their own daily health metrics" 
  ON public.daily_health_metrics 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own daily health metrics" ON public.daily_health_metrics;
CREATE POLICY "Users can create their own daily health metrics" 
  ON public.daily_health_metrics 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own daily health metrics" ON public.daily_health_metrics;
CREATE POLICY "Users can update their own daily health metrics" 
  ON public.daily_health_metrics 
  FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own daily health metrics" ON public.daily_health_metrics;
CREATE POLICY "Users can delete their own daily health metrics" 
  ON public.daily_health_metrics 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Newsletter subscriptions policies
DROP POLICY IF EXISTS "Users can view their own newsletter subscriptions" ON public.newsletter_subscriptions;
CREATE POLICY "Users can view their own newsletter subscriptions" 
  ON public.newsletter_subscriptions 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own newsletter subscriptions" ON public.newsletter_subscriptions;
CREATE POLICY "Users can create their own newsletter subscriptions" 
  ON public.newsletter_subscriptions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own newsletter subscriptions" ON public.newsletter_subscriptions;
CREATE POLICY "Users can update their own newsletter subscriptions" 
  ON public.newsletter_subscriptions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own newsletter subscriptions" ON public.newsletter_subscriptions;
CREATE POLICY "Users can delete their own newsletter subscriptions" 
  ON public.newsletter_subscriptions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Support requests policies
DROP POLICY IF EXISTS "Anyone can create support requests" ON public.support_requests;
CREATE POLICY "Anyone can create support requests" 
  ON public.support_requests 
  FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all support requests" ON public.support_requests;
CREATE POLICY "Admins can view all support requests" 
  ON public.support_requests 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update support requests" ON public.support_requests;
CREATE POLICY "Admins can update support requests" 
  ON public.support_requests 
  FOR UPDATE 
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Personal recommendations policies
DROP POLICY IF EXISTS "Users can view their own personal recommendations" ON public.personal_recommendations;
CREATE POLICY "Users can view their own personal recommendations" 
  ON public.personal_recommendations 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own personal recommendations" ON public.personal_recommendations;
CREATE POLICY "Users can create their own personal recommendations" 
  ON public.personal_recommendations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own personal recommendations" ON public.personal_recommendations;
CREATE POLICY "Users can update their own personal recommendations" 
  ON public.personal_recommendations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own personal recommendations" ON public.personal_recommendations;
CREATE POLICY "Users can delete their own personal recommendations" 
  ON public.personal_recommendations 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
CREATE POLICY "Users can create their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- User roles policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
CREATE POLICY "Admins can manage user roles" 
  ON public.user_roles 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Blog posts policies
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON public.blog_posts;
CREATE POLICY "Anyone can view published blog posts" 
  ON public.blog_posts 
  FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Admins can manage blog posts" ON public.blog_posts;
CREATE POLICY "Admins can manage blog posts" 
  ON public.blog_posts 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Pages policies
DROP POLICY IF EXISTS "Anyone can view published pages" ON public.pages;
CREATE POLICY "Anyone can view published pages" 
  ON public.pages 
  FOR SELECT 
  USING (published = true);

DROP POLICY IF EXISTS "Admins can manage pages" ON public.pages;
CREATE POLICY "Admins can manage pages" 
  ON public.pages 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Page contents policies
DROP POLICY IF EXISTS "Anyone can view page contents for published pages" ON public.page_contents;
CREATE POLICY "Anyone can view page contents for published pages" 
  ON public.page_contents 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.pages p 
      WHERE p.id = page_contents.page_id 
      AND p.published = true
    )
  );

DROP POLICY IF EXISTS "Admins can manage page contents" ON public.page_contents;
CREATE POLICY "Admins can manage page contents" 
  ON public.page_contents 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Add missing foreign key constraints where appropriate
ALTER TABLE public.biomarkers 
DROP CONSTRAINT IF EXISTS biomarkers_analysis_id_fkey,
ADD CONSTRAINT biomarkers_analysis_id_fkey 
FOREIGN KEY (analysis_id) REFERENCES public.medical_analyses(id) ON DELETE CASCADE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_biomarkers_analysis_id ON public.biomarkers(analysis_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_id ON public.usage_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_user_health_goals_user_id ON public.user_health_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_goals_user_id ON public.nutrition_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_health_metrics_user_id ON public.daily_health_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_health_metrics_date ON public.daily_health_metrics(date);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_user_id ON public.newsletter_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_personal_recommendations_user_id ON public.personal_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_page_contents_page_id ON public.page_contents(page_id);

-- Fix any orphaned records that might be causing warnings
DELETE FROM public.biomarkers 
WHERE analysis_id NOT IN (SELECT id FROM public.medical_analyses);
