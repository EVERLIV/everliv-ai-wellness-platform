
-- Fix 1: Move vector extension from public schema to a dedicated schema
CREATE SCHEMA IF NOT EXISTS extensions;

-- First, let's check what vector-related objects exist and their dependencies
-- We need to be more careful about the order of operations

-- Create the extension in the extensions schema (without CASCADE to avoid breaking existing data)
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- Now update the functions to use the correct search path
-- Fix the recommend_protocols_for_user function
CREATE OR REPLACE FUNCTION public.recommend_protocols_for_user(user_id_param uuid, match_threshold double precision DEFAULT 0.6, match_count integer DEFAULT 5)
 RETURNS TABLE(protocol_id uuid, title text, description text, category text, similarity double precision, recommendation_reason text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
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
    up.user_id != user_id_param
    AND 1 - (pe.embedding <=> uae.avg_embedding) > match_threshold
  ORDER BY pe.embedding <=> uae.avg_embedding
  LIMIT match_count;
$function$;

-- Fix the search_medical_articles_by_embedding function  
CREATE OR REPLACE FUNCTION public.search_medical_articles_by_embedding(query_embedding vector, match_threshold double precision DEFAULT 0.7, match_count integer DEFAULT 10)
 RETURNS TABLE(article_id uuid, title text, content text, excerpt text, similarity double precision)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
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
$function$;

-- Only drop the old extension if it exists in public schema and we successfully created it in extensions schema
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'vector' AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
        DROP EXTENSION vector CASCADE;
    END IF;
END
$$;
