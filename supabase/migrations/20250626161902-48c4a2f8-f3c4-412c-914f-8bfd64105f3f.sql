
-- Исправляем проблему безопасности Function Search Path Mutable
-- Устанавливаем безопасный search_path для функции update_updated_at_column

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$$;
