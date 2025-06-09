
-- Создаем таблицу для целей питания пользователя
CREATE TABLE public.nutrition_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  daily_calories INTEGER NOT NULL DEFAULT 2000,
  daily_protein INTEGER NOT NULL DEFAULT 150,
  daily_carbs INTEGER NOT NULL DEFAULT 250,
  daily_fat INTEGER NOT NULL DEFAULT 65,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Создаем таблицу для записей о приемах пищи
CREATE TABLE public.food_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  food_name TEXT NOT NULL,
  calories INTEGER NOT NULL DEFAULT 0,
  protein DECIMAL(5,2) NOT NULL DEFAULT 0,
  carbs DECIMAL(5,2) NOT NULL DEFAULT 0,
  fat DECIMAL(5,2) NOT NULL DEFAULT 0,
  portion_size TEXT,
  image_url TEXT,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для AI анализа изображений еды
CREATE TABLE public.food_analysis_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  image_url TEXT NOT NULL,
  analysis_result JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для всех таблиц
ALTER TABLE public.nutrition_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_analysis_requests ENABLE ROW LEVEL SECURITY;

-- Создаем политики для nutrition_goals
CREATE POLICY "Users can view their own nutrition goals" 
  ON public.nutrition_goals 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own nutrition goals" 
  ON public.nutrition_goals 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own nutrition goals" 
  ON public.nutrition_goals 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Создаем политики для food_entries
CREATE POLICY "Users can view their own food entries" 
  ON public.food_entries 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own food entries" 
  ON public.food_entries 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own food entries" 
  ON public.food_entries 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own food entries" 
  ON public.food_entries 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Создаем политики для food_analysis_requests
CREATE POLICY "Users can view their own food analysis requests" 
  ON public.food_analysis_requests 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own food analysis requests" 
  ON public.food_analysis_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own food analysis requests" 
  ON public.food_analysis_requests 
  FOR UPDATE 
  USING (auth.uid() = user_id);
