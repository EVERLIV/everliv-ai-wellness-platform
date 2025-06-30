
-- Создаем таблицу для сохранения рецептов пользователей
CREATE TABLE public.user_recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
  nutrition_info JSONB,
  cooking_time INTEGER, -- в минутах
  difficulty TEXT DEFAULT 'medium',
  category TEXT DEFAULT 'main',
  source_foods TEXT[], -- продукты из рекомендаций, на основе которых создан рецепт
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS
ALTER TABLE public.user_recipes ENABLE ROW LEVEL SECURITY;

-- Политики доступа - пользователи могут видеть только свои рецепты
CREATE POLICY "Users can view their own recipes" 
  ON public.user_recipes 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recipes" 
  ON public.user_recipes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipes" 
  ON public.user_recipes 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipes" 
  ON public.user_recipes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Триггер для обновления updated_at
CREATE TRIGGER update_user_recipes_updated_at
  BEFORE UPDATE ON public.user_recipes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
