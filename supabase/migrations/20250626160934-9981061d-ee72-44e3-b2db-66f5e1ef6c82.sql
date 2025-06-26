
-- Осторожное исправление проблем производительности RLS
-- Фокусируемся только на таблицах с подтвержденными проблемами

-- 1. Исправляем health_profiles (только если есть дубли)
DROP POLICY IF EXISTS "Users can view their own health profiles" ON public.health_profiles;
DROP POLICY IF EXISTS "Users can create their own health profiles" ON public.health_profiles;
DROP POLICY IF EXISTS "Users can update their own health profiles" ON public.health_profiles;
DROP POLICY IF EXISTS "Users can delete their own health profiles" ON public.health_profiles;

-- Создаем единые оптимизированные политики для health_profiles
CREATE POLICY "Users can view their health profile" 
  ON public.health_profiles 
  FOR SELECT 
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create their health profile" 
  ON public.health_profiles 
  FOR INSERT 
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their health profile" 
  ON public.health_profiles 
  FOR UPDATE 
  USING ((select auth.uid()) = user_id);

-- 2. Исправляем ai_doctor_chats (убираем дубли)
DROP POLICY IF EXISTS "Users can view their own chats" ON public.ai_doctor_chats;
DROP POLICY IF EXISTS "Users can create their own chats" ON public.ai_doctor_chats;
DROP POLICY IF EXISTS "Users can update their own chats" ON public.ai_doctor_chats;
DROP POLICY IF EXISTS "Users can delete their own chats" ON public.ai_doctor_chats;

-- Создаем оптимизированные политики для ai_doctor_chats
CREATE POLICY "Users can view their AI doctor chats" 
  ON public.ai_doctor_chats 
  FOR SELECT 
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create their AI doctor chats" 
  ON public.ai_doctor_chats 
  FOR INSERT 
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their AI doctor chats" 
  ON public.ai_doctor_chats 
  FOR UPDATE 
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their AI doctor chats" 
  ON public.ai_doctor_chats 
  FOR DELETE 
  USING ((select auth.uid()) = user_id);

-- 3. Исправляем ai_doctor_messages (убираем дубли)
DROP POLICY IF EXISTS "Users can view messages from their own chats" ON public.ai_doctor_messages;
DROP POLICY IF EXISTS "Users can create messages in their own chats" ON public.ai_doctor_messages;
DROP POLICY IF EXISTS "Users can update messages in their own chats" ON public.ai_doctor_messages;
DROP POLICY IF EXISTS "Users can delete messages in their own chats" ON public.ai_doctor_messages;

-- Создаем оптимизированные политики для ai_doctor_messages
CREATE POLICY "Users can view their chat messages" 
  ON public.ai_doctor_messages 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.ai_doctor_chats adc 
      WHERE adc.id = ai_doctor_messages.chat_id 
      AND adc.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can create chat messages" 
  ON public.ai_doctor_messages 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.ai_doctor_chats adc 
      WHERE adc.id = ai_doctor_messages.chat_id 
      AND adc.user_id = (select auth.uid())
    )
  );

-- 4. Создаем только критически важные индексы (если их нет)
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id_role ON public.user_roles(user_id, role);
CREATE INDEX IF NOT EXISTS idx_personal_recommendations_user_id_category ON public.personal_recommendations(user_id, category);
CREATE INDEX IF NOT EXISTS idx_ai_doctor_chats_user_id_updated ON public.ai_doctor_chats(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_doctor_messages_chat_created ON public.ai_doctor_messages(chat_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_health_profiles_user_updated ON public.health_profiles(user_id, updated_at DESC);

-- 5. Обновляем статистику только для измененных таблиц
ANALYZE public.user_roles;
ANALYZE public.personal_recommendations;
ANALYZE public.ai_doctor_chats;
ANALYZE public.ai_doctor_messages;
ANALYZE public.health_profiles;
