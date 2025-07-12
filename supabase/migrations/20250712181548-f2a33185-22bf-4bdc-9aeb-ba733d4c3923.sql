-- Исправляем RLS политики для ai_recommendations
DROP POLICY IF EXISTS "Users can create their own AI recommendations" ON public.ai_recommendations;
DROP POLICY IF EXISTS "Users can view their own AI recommendations" ON public.ai_recommendations;
DROP POLICY IF EXISTS "Users can update their own AI recommendations" ON public.ai_recommendations;
DROP POLICY IF EXISTS "Users can delete their own AI recommendations" ON public.ai_recommendations;

-- Создаем правильные RLS политики
CREATE POLICY "Users can manage their own AI recommendations" 
ON public.ai_recommendations 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Проверяем, что RLS включен
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;