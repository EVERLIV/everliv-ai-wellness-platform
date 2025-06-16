
-- Enable realtime for AI Doctor tables
ALTER TABLE public.ai_doctor_chats REPLICA IDENTITY FULL;
ALTER TABLE public.ai_doctor_messages REPLICA IDENTITY FULL;

-- Enable realtime for medical analyses
ALTER TABLE public.medical_analyses REPLICA IDENTITY FULL;

-- Enable realtime for food entries
ALTER TABLE public.food_entries REPLICA IDENTITY FULL;

-- Enable realtime for subscriptions
ALTER TABLE public.subscriptions REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_doctor_chats;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_doctor_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.medical_analyses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.food_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.subscriptions;
