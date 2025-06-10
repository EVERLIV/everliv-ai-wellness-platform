
-- Create health_profiles table
CREATE TABLE public.health_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.health_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view their own health profiles
CREATE POLICY "Users can view their own health profiles" 
  ON public.health_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to insert their own health profiles
CREATE POLICY "Users can create their own health profiles" 
  ON public.health_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to update their own health profiles
CREATE POLICY "Users can update their own health profiles" 
  ON public.health_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to delete their own health profiles
CREATE POLICY "Users can delete their own health profiles" 
  ON public.health_profiles 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create unique constraint to ensure one profile per user
CREATE UNIQUE INDEX health_profiles_user_id_idx ON public.health_profiles(user_id);
