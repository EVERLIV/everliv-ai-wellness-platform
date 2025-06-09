
-- Создаем таблицу для чатов
CREATE TABLE public.ai_doctor_chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL DEFAULT 'Новый чат',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для сообщений чата
CREATE TABLE public.ai_doctor_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES public.ai_doctor_chats(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для чатов
ALTER TABLE public.ai_doctor_chats ENABLE ROW LEVEL SECURITY;

-- Политики для чатов - пользователи могут видеть только свои чаты
CREATE POLICY "Users can view their own chats" 
  ON public.ai_doctor_chats 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chats" 
  ON public.ai_doctor_chats 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chats" 
  ON public.ai_doctor_chats 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chats" 
  ON public.ai_doctor_chats 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Включаем RLS для сообщений
ALTER TABLE public.ai_doctor_messages ENABLE ROW LEVEL SECURITY;

-- Политики для сообщений - пользователи могут видеть сообщения только из своих чатов
CREATE POLICY "Users can view messages from their own chats" 
  ON public.ai_doctor_messages 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.ai_doctor_chats 
    WHERE ai_doctor_chats.id = ai_doctor_messages.chat_id 
    AND ai_doctor_chats.user_id = auth.uid()
  ));

CREATE POLICY "Users can create messages in their own chats" 
  ON public.ai_doctor_messages 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.ai_doctor_chats 
    WHERE ai_doctor_chats.id = ai_doctor_messages.chat_id 
    AND ai_doctor_chats.user_id = auth.uid()
  ));

CREATE POLICY "Users can update messages in their own chats" 
  ON public.ai_doctor_messages 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.ai_doctor_chats 
    WHERE ai_doctor_chats.id = ai_doctor_messages.chat_id 
    AND ai_doctor_chats.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete messages in their own chats" 
  ON public.ai_doctor_messages 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.ai_doctor_chats 
    WHERE ai_doctor_chats.id = ai_doctor_messages.chat_id 
    AND ai_doctor_chats.user_id = auth.uid()
  ));

-- Создаем индексы для оптимизации
CREATE INDEX ai_doctor_chats_user_id_idx ON public.ai_doctor_chats(user_id);
CREATE INDEX ai_doctor_chats_updated_at_idx ON public.ai_doctor_chats(updated_at DESC);
CREATE INDEX ai_doctor_messages_chat_id_idx ON public.ai_doctor_messages(chat_id);
CREATE INDEX ai_doctor_messages_created_at_idx ON public.ai_doctor_messages(created_at);
