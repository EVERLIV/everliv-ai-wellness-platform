
-- Performance and security improvements to fix Supabase warnings
-- Add missing policies for medical analyses and other user-related tables

-- First, ensure all user-related tables have proper RLS policies
DO $$
BEGIN
    -- Enable RLS on remaining tables that might not have it
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables t 
        JOIN pg_class c ON c.relname = t.tablename 
        WHERE t.schemaname = 'public' AND t.tablename = 'medical_analyses' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.medical_analyses ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables t 
        JOIN pg_class c ON c.relname = t.tablename 
        WHERE t.schemaname = 'public' AND t.tablename = 'health_profiles' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.health_profiles ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables t 
        JOIN pg_class c ON c.relname = t.tablename 
        WHERE t.schemaname = 'public' AND t.tablename = 'ai_doctor_chats' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.ai_doctor_chats ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables t 
        JOIN pg_class c ON c.relname = t.tablename 
        WHERE t.schemaname = 'public' AND t.tablename = 'ai_doctor_messages' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.ai_doctor_messages ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables t 
        JOIN pg_class c ON c.relname = t.tablename 
        WHERE t.schemaname = 'public' AND t.tablename = 'food_entries' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.food_entries ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables t 
        JOIN pg_class c ON c.relname = t.tablename 
        WHERE t.schemaname = 'public' AND t.tablename = 'feature_trials' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.feature_trials ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables t 
        JOIN pg_class c ON c.relname = t.tablename 
        WHERE t.schemaname = 'public' AND t.tablename = 'user_analytics' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables t 
        JOIN pg_class c ON c.relname = t.tablename 
        WHERE t.schemaname = 'public' AND t.tablename = 'user_protocols' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.user_protocols ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables t 
        JOIN pg_class c ON c.relname = t.tablename 
        WHERE t.schemaname = 'public' AND t.tablename = 'protocol_events' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.protocol_events ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables t 
        JOIN pg_class c ON c.relname = t.tablename 
        WHERE t.schemaname = 'public' AND t.tablename = 'protocol_supplements' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.protocol_supplements ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables t 
        JOIN pg_class c ON c.relname = t.tablename 
        WHERE t.schemaname = 'public' AND t.tablename = 'protocol_wellbeing' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.protocol_wellbeing ENABLE ROW LEVEL SECURITY;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_tables t 
        JOIN pg_class c ON c.relname = t.tablename 
        WHERE t.schemaname = 'public' AND t.tablename = 'food_analysis_requests' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.food_analysis_requests ENABLE ROW LEVEL SECURITY;
    END IF;
END
$$;

-- Add comprehensive RLS policies for medical analyses
DROP POLICY IF EXISTS "Users can view their own medical analyses" ON public.medical_analyses;
CREATE POLICY "Users can view their own medical analyses" 
  ON public.medical_analyses 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own medical analyses" ON public.medical_analyses;
CREATE POLICY "Users can create their own medical analyses" 
  ON public.medical_analyses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own medical analyses" ON public.medical_analyses;
CREATE POLICY "Users can update their own medical analyses" 
  ON public.medical_analyses 
  FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own medical analyses" ON public.medical_analyses;
CREATE POLICY "Users can delete their own medical analyses" 
  ON public.medical_analyses 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Health profiles policies
DROP POLICY IF EXISTS "Users can view their own health profile" ON public.health_profiles;
CREATE POLICY "Users can view their own health profile" 
  ON public.health_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own health profile" ON public.health_profiles;
CREATE POLICY "Users can create their own health profile" 
  ON public.health_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own health profile" ON public.health_profiles;
CREATE POLICY "Users can update their own health profile" 
  ON public.health_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- AI Doctor chats policies
DROP POLICY IF EXISTS "Users can view their own AI doctor chats" ON public.ai_doctor_chats;
CREATE POLICY "Users can view their own AI doctor chats" 
  ON public.ai_doctor_chats 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own AI doctor chats" ON public.ai_doctor_chats;
CREATE POLICY "Users can create their own AI doctor chats" 
  ON public.ai_doctor_chats 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own AI doctor chats" ON public.ai_doctor_chats;
CREATE POLICY "Users can update their own AI doctor chats" 
  ON public.ai_doctor_chats 
  FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own AI doctor chats" ON public.ai_doctor_chats;
CREATE POLICY "Users can delete their own AI doctor chats" 
  ON public.ai_doctor_chats 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- AI Doctor messages policies
DROP POLICY IF EXISTS "Users can view messages from their chats" ON public.ai_doctor_messages;
CREATE POLICY "Users can view messages from their chats" 
  ON public.ai_doctor_messages 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.ai_doctor_chats adc 
      WHERE adc.id = ai_doctor_messages.chat_id 
      AND adc.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create messages in their chats" ON public.ai_doctor_messages;
CREATE POLICY "Users can create messages in their chats" 
  ON public.ai_doctor_messages 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.ai_doctor_chats adc 
      WHERE adc.id = ai_doctor_messages.chat_id 
      AND adc.user_id = auth.uid()
    )
  );

-- Food entries policies
DROP POLICY IF EXISTS "Users can view their own food entries" ON public.food_entries;
CREATE POLICY "Users can view their own food entries" 
  ON public.food_entries 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own food entries" ON public.food_entries;
CREATE POLICY "Users can create their own food entries" 
  ON public.food_entries 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own food entries" ON public.food_entries;
CREATE POLICY "Users can update their own food entries" 
  ON public.food_entries 
  FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own food entries" ON public.food_entries;
CREATE POLICY "Users can delete their own food entries" 
  ON public.food_entries 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Feature trials policies
DROP POLICY IF EXISTS "Users can view their own feature trials" ON public.feature_trials;
CREATE POLICY "Users can view their own feature trials" 
  ON public.feature_trials 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own feature trials" ON public.feature_trials;
CREATE POLICY "Users can create their own feature trials" 
  ON public.feature_trials 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- User analytics policies
DROP POLICY IF EXISTS "Users can view their own analytics" ON public.user_analytics;
CREATE POLICY "Users can view their own analytics" 
  ON public.user_analytics 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own analytics" ON public.user_analytics;
CREATE POLICY "Users can create their own analytics" 
  ON public.user_analytics 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own analytics" ON public.user_analytics;
CREATE POLICY "Users can update their own analytics" 
  ON public.user_analytics 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- User protocols policies
DROP POLICY IF EXISTS "Users can view their own protocols" ON public.user_protocols;
CREATE POLICY "Users can view their own protocols" 
  ON public.user_protocols 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own protocols" ON public.user_protocols;
CREATE POLICY "Users can create their own protocols" 
  ON public.user_protocols 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own protocols" ON public.user_protocols;
CREATE POLICY "Users can update their own protocols" 
  ON public.user_protocols 
  FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own protocols" ON public.user_protocols;
CREATE POLICY "Users can delete their own protocols" 
  ON public.user_protocols 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Protocol events policies
DROP POLICY IF EXISTS "Users can view their own protocol events" ON public.protocol_events;
CREATE POLICY "Users can view their own protocol events" 
  ON public.protocol_events 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own protocol events" ON public.protocol_events;
CREATE POLICY "Users can create their own protocol events" 
  ON public.protocol_events 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own protocol events" ON public.protocol_events;
CREATE POLICY "Users can update their own protocol events" 
  ON public.protocol_events 
  FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own protocol events" ON public.protocol_events;
CREATE POLICY "Users can delete their own protocol events" 
  ON public.protocol_events 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Protocol supplements policies
DROP POLICY IF EXISTS "Users can view their own protocol supplements" ON public.protocol_supplements;
CREATE POLICY "Users can view their own protocol supplements" 
  ON public.protocol_supplements 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own protocol supplements" ON public.protocol_supplements;
CREATE POLICY "Users can create their own protocol supplements" 
  ON public.protocol_supplements 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own protocol supplements" ON public.protocol_supplements;
CREATE POLICY "Users can update their own protocol supplements" 
  ON public.protocol_supplements 
  FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own protocol supplements" ON public.protocol_supplements;
CREATE POLICY "Users can delete their own protocol supplements" 
  ON public.protocol_supplements 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Protocol wellbeing policies
DROP POLICY IF EXISTS "Users can view their own protocol wellbeing" ON public.protocol_wellbeing;
CREATE POLICY "Users can view their own protocol wellbeing" 
  ON public.protocol_wellbeing 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own protocol wellbeing" ON public.protocol_wellbeing;
CREATE POLICY "Users can create their own protocol wellbeing" 
  ON public.protocol_wellbeing 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own protocol wellbeing" ON public.protocol_wellbeing;
CREATE POLICY "Users can update their own protocol wellbeing" 
  ON public.protocol_wellbeing 
  FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own protocol wellbeing" ON public.protocol_wellbeing;
CREATE POLICY "Users can delete their own protocol wellbeing" 
  ON public.protocol_wellbeing 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Food analysis requests policies
DROP POLICY IF EXISTS "Users can view their own food analysis requests" ON public.food_analysis_requests;
CREATE POLICY "Users can view their own food analysis requests" 
  ON public.food_analysis_requests 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own food analysis requests" ON public.food_analysis_requests;
CREATE POLICY "Users can create their own food analysis requests" 
  ON public.food_analysis_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own food analysis requests" ON public.food_analysis_requests;
CREATE POLICY "Users can update their own food analysis requests" 
  ON public.food_analysis_requests 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add missing foreign key constraints
ALTER TABLE public.ai_doctor_messages 
DROP CONSTRAINT IF EXISTS ai_doctor_messages_chat_id_fkey,
ADD CONSTRAINT ai_doctor_messages_chat_id_fkey 
FOREIGN KEY (chat_id) REFERENCES public.ai_doctor_chats(id) ON DELETE CASCADE;

ALTER TABLE public.protocol_events 
DROP CONSTRAINT IF EXISTS protocol_events_protocol_id_fkey,
ADD CONSTRAINT protocol_events_protocol_id_fkey 
FOREIGN KEY (protocol_id) REFERENCES public.user_protocols(id) ON DELETE CASCADE;

ALTER TABLE public.protocol_supplements 
DROP CONSTRAINT IF EXISTS protocol_supplements_protocol_id_fkey,
ADD CONSTRAINT protocol_supplements_protocol_id_fkey 
FOREIGN KEY (protocol_id) REFERENCES public.user_protocols(id) ON DELETE CASCADE;

ALTER TABLE public.protocol_wellbeing 
DROP CONSTRAINT IF EXISTS protocol_wellbeing_protocol_id_fkey,
ADD CONSTRAINT protocol_wellbeing_protocol_id_fkey 
FOREIGN KEY (protocol_id) REFERENCES public.user_protocols(id) ON DELETE CASCADE;

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_medical_analyses_user_id ON public.medical_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_medical_analyses_created_at ON public.medical_analyses(created_at);
CREATE INDEX IF NOT EXISTS idx_health_profiles_user_id ON public.health_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_doctor_chats_user_id ON public.ai_doctor_chats(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_doctor_messages_chat_id ON public.ai_doctor_messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_ai_doctor_messages_created_at ON public.ai_doctor_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_food_entries_user_id ON public.food_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_food_entries_entry_date ON public.food_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_feature_trials_user_id ON public.feature_trials(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_trials_feature_name ON public.feature_trials(feature_name);
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON public.user_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_protocols_user_id ON public.user_protocols(user_id);
CREATE INDEX IF NOT EXISTS idx_protocol_events_protocol_id ON public.protocol_events(protocol_id);
CREATE INDEX IF NOT EXISTS idx_protocol_events_user_id ON public.protocol_events(user_id);
CREATE INDEX IF NOT EXISTS idx_protocol_supplements_protocol_id ON public.protocol_supplements(protocol_id);
CREATE INDEX IF NOT EXISTS idx_protocol_supplements_user_id ON public.protocol_supplements(user_id);
CREATE INDEX IF NOT EXISTS idx_protocol_wellbeing_protocol_id ON public.protocol_wellbeing(protocol_id);
CREATE INDEX IF NOT EXISTS idx_protocol_wellbeing_user_id ON public.protocol_wellbeing(user_id);
CREATE INDEX IF NOT EXISTS idx_food_analysis_requests_user_id ON public.food_analysis_requests(user_id);

-- Clean up any orphaned data that might be causing warnings
DELETE FROM public.ai_doctor_messages 
WHERE chat_id NOT IN (SELECT id FROM public.ai_doctor_chats);

DELETE FROM public.protocol_events 
WHERE protocol_id NOT IN (SELECT id FROM public.user_protocols);

DELETE FROM public.protocol_supplements 
WHERE protocol_id NOT IN (SELECT id FROM public.user_protocols);

DELETE FROM public.protocol_wellbeing 
WHERE protocol_id NOT IN (SELECT id FROM public.user_protocols);

-- Add triggers to automatically update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables that have updated_at columns
DROP TRIGGER IF EXISTS update_medical_analyses_updated_at ON public.medical_analyses;
CREATE TRIGGER update_medical_analyses_updated_at 
  BEFORE UPDATE ON public.medical_analyses 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_health_profiles_updated_at ON public.health_profiles;
CREATE TRIGGER update_health_profiles_updated_at 
  BEFORE UPDATE ON public.health_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ai_doctor_chats_updated_at ON public.ai_doctor_chats;
CREATE TRIGGER update_ai_doctor_chats_updated_at 
  BEFORE UPDATE ON public.ai_doctor_chats 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Optimize query performance by analyzing tables
ANALYZE public.medical_analyses;
ANALYZE public.health_profiles;
ANALYZE public.ai_doctor_chats;
ANALYZE public.ai_doctor_messages;
ANALYZE public.food_entries;
ANALYZE public.feature_trials;
ANALYZE public.user_analytics;
ANALYZE public.user_protocols;
ANALYZE public.protocol_events;
ANALYZE public.protocol_supplements;
ANALYZE public.protocol_wellbeing;
ANALYZE public.food_analysis_requests;
