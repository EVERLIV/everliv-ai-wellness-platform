
-- Включаем расширение pgvector для работы с векторами
CREATE EXTENSION IF NOT EXISTS vector;

-- Создаем таблицу для векторов медицинских статей
CREATE TABLE IF NOT EXISTS public.medical_article_embeddings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.medical_articles(id) ON DELETE CASCADE,
  embedding vector(1536), -- OpenAI text-embedding-3-small использует 1536 размерность
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем индекс для быстрого поиска по векторам (HNSW индекс для косинусного расстояния)
CREATE INDEX IF NOT EXISTS medical_article_embeddings_embedding_idx 
ON public.medical_article_embeddings 
USING hnsw (embedding vector_cosine_ops);

-- Создаем таблицу для векторов протоколов
CREATE TABLE IF NOT EXISTS public.protocol_embeddings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  protocol_id UUID NOT NULL REFERENCES public.user_protocols(id) ON DELETE CASCADE,
  embedding vector(1536),
  protocol_features jsonb, -- дополнительные характеристики протокола для рекомендаций
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем индекс для протоколов
CREATE INDEX IF NOT EXISTS protocol_embeddings_embedding_idx 
ON public.protocol_embeddings 
USING hnsw (embedding vector_cosine_ops);

-- Создаем таблицу для пользовательских предпочтений и истории
CREATE TABLE IF NOT EXISTS public.user_preferences_embeddings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  preference_type TEXT NOT NULL, -- 'medical_interests', 'protocol_history', 'health_goals'
  embedding vector(1536),
  metadata jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем индекс для пользовательских предпочтений
CREATE INDEX IF NOT EXISTS user_preferences_embeddings_embedding_idx 
ON public.user_preferences_embeddings 
USING hnsw (embedding vector_cosine_ops);

-- Функция для семантического поиска медицинских статей
CREATE OR REPLACE FUNCTION search_medical_articles_by_embedding(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  article_id uuid,
  title text,
  content text,
  excerpt text,
  similarity float
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    ma.id,
    ma.title,
    ma.content,
    ma.excerpt,
    1 - (mae.embedding <=> query_embedding) AS similarity
  FROM medical_article_embeddings mae
  JOIN medical_articles ma ON mae.article_id = ma.id
  WHERE 
    ma.published = true 
    AND ma.medical_review_status = 'approved'
    AND 1 - (mae.embedding <=> query_embedding) > match_threshold
  ORDER BY mae.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Функция для рекомендации протоколов на основе пользовательских предпочтений
CREATE OR REPLACE FUNCTION recommend_protocols_for_user(
  user_id_param uuid,
  match_threshold float DEFAULT 0.6,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  protocol_id uuid,
  title text,
  description text,
  category text,
  similarity float,
  recommendation_reason text
)
LANGUAGE sql
STABLE
AS $$
  WITH user_avg_embedding AS (
    SELECT avg(embedding) as avg_embedding
    FROM user_preferences_embeddings 
    WHERE user_id = user_id_param
  )
  SELECT 
    up.id,
    up.title,
    up.description,
    up.category,
    1 - (pe.embedding <=> uae.avg_embedding) AS similarity,
    'Based on your health interests and goals' as recommendation_reason
  FROM protocol_embeddings pe
  JOIN user_protocols up ON pe.protocol_id = up.id
  CROSS JOIN user_avg_embedding uae
  WHERE 
    up.user_id != user_id_param -- исключаем протоколы самого пользователя
    AND 1 - (pe.embedding <=> uae.avg_embedding) > match_threshold
  ORDER BY pe.embedding <=> uae.avg_embedding
  LIMIT match_count;
$$;

-- Включаем RLS для новых таблиц
ALTER TABLE public.medical_article_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protocol_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences_embeddings ENABLE ROW LEVEL SECURITY;

-- Политики RLS для medical_article_embeddings (публичное чтение)
CREATE POLICY "Anyone can view medical article embeddings" 
  ON public.medical_article_embeddings 
  FOR SELECT 
  USING (true);

-- Политики RLS для protocol_embeddings (публичное чтение)
CREATE POLICY "Anyone can view protocol embeddings" 
  ON public.protocol_embeddings 
  FOR SELECT 
  USING (true);

-- Политики RLS для user_preferences_embeddings (только свои данные)
CREATE POLICY "Users can view own preferences embeddings" 
  ON public.user_preferences_embeddings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences embeddings" 
  ON public.user_preferences_embeddings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences embeddings" 
  ON public.user_preferences_embeddings 
  FOR UPDATE 
  USING (auth.uid() = user_id);
