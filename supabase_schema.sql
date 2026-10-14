-- =========================================================================
-- BHARAT VISION: SUPABASE PRODUCTION DATABASE SCHEMA
-- File: supabase_schema.sql
-- =========================================================================

-- 1. Safely drop old setup if re-running
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.commuter_profiles CASCADE;

-- 2. Create the commuter_profiles table with CASCADE deletion
CREATE TABLE public.commuter_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name TEXT DEFAULT 'Commuter',
  wallet_balance NUMERIC(10, 2) DEFAULT 0.00,
  karma_points INTEGER DEFAULT 0,
  carbon_saved_grams INTEGER DEFAULT 0,
  is_student_verified BOOLEAN DEFAULT false,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable enterprise-grade Row Level Security (RLS)
ALTER TABLE public.commuter_profiles ENABLE ROW LEVEL SECURITY;

-- 4. Complete RLS Policies (SELECT, INSERT, UPDATE)
CREATE POLICY "Users can view own profile"
ON public.commuter_profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON public.commuter_profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.commuter_profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 5. Auto-Create Profile Trigger on Auth Signup
-- This ensures the profile is instantly created the moment a commuter registers!
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.commuter_profiles (id, full_name, wallet_balance, karma_points, carbon_saved_grams, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1), 'Commuter'),
    0.00,
    0,
    0,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Enable Realtime updates (for live balance and karma sync)
ALTER PUBLICATION supabase_realtime ADD TABLE public.commuter_profiles;
