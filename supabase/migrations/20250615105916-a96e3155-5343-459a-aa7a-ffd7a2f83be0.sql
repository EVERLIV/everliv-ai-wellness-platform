
-- Fix the has_role function to have a secure search_path
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Enable leaked password protection in Auth configuration
-- This needs to be done via the Supabase dashboard or API, but we can document it here
-- Go to Authentication > Settings in your Supabase dashboard and enable "Leaked Password Protection"
