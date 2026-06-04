-- Supabase Schema for ViralPrompt

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table: prompts
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  image_url TEXT,
  tags TEXT[],
  style TEXT,
  model TEXT,
  submitted_by UUID REFERENCES profiles(id),
  source_reel TEXT,
  view_count INT DEFAULT 0,
  save_count INT DEFAULT 0,
  is_public BOOL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table: saved_prompts
CREATE TABLE saved_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  prompt_id UUID REFERENCES prompts(id),
  saved_at TIMESTAMPTZ DEFAULT now(),
  notes TEXT,
  UNIQUE(user_id, prompt_id)
);

-- Table: reel_requests
CREATE TABLE reel_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  reel_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  prompt_id UUID REFERENCES prompts(id) NULL,
  error_msg TEXT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reel_requests ENABLE ROW LEVEL SECURITY;

-- Add standard RLS policies
-- Profiles: everyone can read, user can update own
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Prompts: public prompts are viewable by everyone. Users can insert their own. Users can update their own.
CREATE POLICY "Public prompts are viewable by everyone." ON prompts FOR SELECT USING (is_public = true OR auth.uid() = submitted_by);
CREATE POLICY "Users can insert prompts." ON prompts FOR INSERT WITH CHECK (auth.uid() = submitted_by);
CREATE POLICY "Users can update own prompts." ON prompts FOR UPDATE USING (auth.uid() = submitted_by);

-- Saved Prompts: user can only see/insert/update/delete their own
CREATE POLICY "Users can see own saved prompts." ON saved_prompts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved prompts." ON saved_prompts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own saved prompts." ON saved_prompts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved prompts." ON saved_prompts FOR DELETE USING (auth.uid() = user_id);

-- Reel Requests: user can only see/insert their own
CREATE POLICY "Users can see own reel requests." ON reel_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reel requests." ON reel_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Setup trigger to handle new user signups and insert into profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'user_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- RPC for incrementing view count safely
CREATE OR REPLACE FUNCTION increment_view_count(row_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE prompts
  SET view_count = view_count + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC for incrementing save count
CREATE OR REPLACE FUNCTION increment_save_count(row_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE prompts
  SET save_count = save_count + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC for decrementing save count
CREATE OR REPLACE FUNCTION decrement_save_count(row_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE prompts
  SET save_count = GREATEST(0, save_count - 1)
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Table: tool_usage (rate limiting & analytics for AI tools)
CREATE TABLE tool_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NULL,
  tool_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table: prompt_packs (monetization)
CREATE TABLE prompt_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  prompt_count INT DEFAULT 0,
  price_inr NUMERIC(10,2) DEFAULT 0,
  preview_prompts JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for tool_usage
ALTER TABLE tool_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert tool usage." ON tool_usage FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can see own tool usage." ON tool_usage FOR SELECT USING (auth.uid() = user_id);

-- RLS for prompt_packs
ALTER TABLE prompt_packs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active packs are viewable by everyone." ON prompt_packs FOR SELECT USING (is_active = true);
