
-- Fix RLS performance issues by optimizing auth function calls
-- Replace auth.uid() with (select auth.uid()) to prevent re-evaluation for each row

-- Health profiles policies optimization
DROP POLICY IF EXISTS "Users can view their own health profile" ON public.health_profiles;
CREATE POLICY "Users can view their own health profile" 
  ON public.health_profiles 
  FOR SELECT 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create their own health profile" ON public.health_profiles;
CREATE POLICY "Users can create their own health profile" 
  ON public.health_profiles 
  FOR INSERT 
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own health profile" ON public.health_profiles;
CREATE POLICY "Users can update their own health profile" 
  ON public.health_profiles 
  FOR UPDATE 
  USING ((select auth.uid()) = user_id);

-- Apply the same optimization to all other policies for better performance
DROP POLICY IF EXISTS "Users can view their own medical analyses" ON public.medical_analyses;
CREATE POLICY "Users can view their own medical analyses" 
  ON public.medical_analyses 
  FOR SELECT 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create their own medical analyses" ON public.medical_analyses;
CREATE POLICY "Users can create their own medical analyses" 
  ON public.medical_analyses 
  FOR INSERT 
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own medical analyses" ON public.medical_analyses;
CREATE POLICY "Users can update their own medical analyses" 
  ON public.medical_analyses 
  FOR UPDATE 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own medical analyses" ON public.medical_analyses;
CREATE POLICY "Users can delete their own medical analyses" 
  ON public.medical_analyses 
  FOR DELETE 
  USING ((select auth.uid()) = user_id);

-- AI Doctor chats policies optimization
DROP POLICY IF EXISTS "Users can view their own AI doctor chats" ON public.ai_doctor_chats;
CREATE POLICY "Users can view their own AI doctor chats" 
  ON public.ai_doctor_chats 
  FOR SELECT 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create their own AI doctor chats" ON public.ai_doctor_chats;
CREATE POLICY "Users can create their own AI doctor chats" 
  ON public.ai_doctor_chats 
  FOR INSERT 
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own AI doctor chats" ON public.ai_doctor_chats;
CREATE POLICY "Users can update their own AI doctor chats" 
  ON public.ai_doctor_chats 
  FOR UPDATE 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own AI doctor chats" ON public.ai_doctor_chats;
CREATE POLICY "Users can delete their own AI doctor chats" 
  ON public.ai_doctor_chats 
  FOR DELETE 
  USING ((select auth.uid()) = user_id);

-- AI Doctor messages policies optimization
DROP POLICY IF EXISTS "Users can view messages from their chats" ON public.ai_doctor_messages;
CREATE POLICY "Users can view messages from their chats" 
  ON public.ai_doctor_messages 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.ai_doctor_chats adc 
      WHERE adc.id = ai_doctor_messages.chat_id 
      AND adc.user_id = (select auth.uid())
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
      AND adc.user_id = (select auth.uid())
    )
  );

-- Food entries policies optimization
DROP POLICY IF EXISTS "Users can view their own food entries" ON public.food_entries;
CREATE POLICY "Users can view their own food entries" 
  ON public.food_entries 
  FOR SELECT 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create their own food entries" ON public.food_entries;
CREATE POLICY "Users can create their own food entries" 
  ON public.food_entries 
  FOR INSERT 
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own food entries" ON public.food_entries;
CREATE POLICY "Users can update their own food entries" 
  ON public.food_entries 
  FOR UPDATE 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own food entries" ON public.food_entries;
CREATE POLICY "Users can delete their own food entries" 
  ON public.food_entries 
  FOR DELETE 
  USING ((select auth.uid()) = user_id);

-- Feature trials policies optimization
DROP POLICY IF EXISTS "Users can view their own feature trials" ON public.feature_trials;
CREATE POLICY "Users can view their own feature trials" 
  ON public.feature_trials 
  FOR SELECT 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create their own feature trials" ON public.feature_trials;
CREATE POLICY "Users can create their own feature trials" 
  ON public.feature_trials 
  FOR INSERT 
  WITH CHECK ((select auth.uid()) = user_id);

-- User analytics policies optimization
DROP POLICY IF EXISTS "Users can view their own analytics" ON public.user_analytics;
CREATE POLICY "Users can view their own analytics" 
  ON public.user_analytics 
  FOR SELECT 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create their own analytics" ON public.user_analytics;
CREATE POLICY "Users can create their own analytics" 
  ON public.user_analytics 
  FOR INSERT 
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own analytics" ON public.user_analytics;
CREATE POLICY "Users can update their own analytics" 
  ON public.user_analytics 
  FOR UPDATE 
  USING ((select auth.uid()) = user_id);

-- User protocols policies optimization
DROP POLICY IF EXISTS "Users can view their own protocols" ON public.user_protocols;
CREATE POLICY "Users can view their own protocols" 
  ON public.user_protocols 
  FOR SELECT 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create their own protocols" ON public.user_protocols;
CREATE POLICY "Users can create their own protocols" 
  ON public.user_protocols 
  FOR INSERT 
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own protocols" ON public.user_protocols;
CREATE POLICY "Users can update their own protocols" 
  ON public.user_protocols 
  FOR UPDATE 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own protocols" ON public.user_protocols;
CREATE POLICY "Users can delete their own protocols" 
  ON public.user_protocols 
  FOR DELETE 
  USING ((select auth.uid()) = user_id);

-- Daily health metrics policies optimization
DROP POLICY IF EXISTS "Users can view their own daily metrics" ON public.daily_health_metrics;
CREATE POLICY "Users can view their own daily metrics" 
  ON public.daily_health_metrics 
  FOR SELECT 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create their own daily metrics" ON public.daily_health_metrics;
CREATE POLICY "Users can create their own daily metrics" 
  ON public.daily_health_metrics 
  FOR INSERT 
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own daily metrics" ON public.daily_health_metrics;
CREATE POLICY "Users can update their own daily metrics" 
  ON public.daily_health_metrics 
  FOR UPDATE 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own daily metrics" ON public.daily_health_metrics;
CREATE POLICY "Users can delete their own daily metrics" 
  ON public.daily_health_metrics 
  FOR DELETE 
  USING ((select auth.uid()) = user_id);

-- User health goals policies optimization
DROP POLICY IF EXISTS "Users can view their own goals" ON public.user_health_goals;
CREATE POLICY "Users can view their own goals" 
  ON public.user_health_goals 
  FOR SELECT 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create their own goals" ON public.user_health_goals;
CREATE POLICY "Users can create their own goals" 
  ON public.user_health_goals 
  FOR INSERT 
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own goals" ON public.user_health_goals;
CREATE POLICY "Users can update their own goals" 
  ON public.user_health_goals 
  FOR UPDATE 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own goals" ON public.user_health_goals;
CREATE POLICY "Users can delete their own goals" 
  ON public.user_health_goals 
  FOR DELETE 
  USING ((select auth.uid()) = user_id);

-- User achievements policies optimization
DROP POLICY IF EXISTS "Users can view their own achievements" ON public.user_achievements;
CREATE POLICY "Users can view their own achievements" 
  ON public.user_achievements 
  FOR SELECT 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create their own achievements" ON public.user_achievements;
CREATE POLICY "Users can create their own achievements" 
  ON public.user_achievements 
  FOR INSERT 
  WITH CHECK ((select auth.uid()) = user_id);
