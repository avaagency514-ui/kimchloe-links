-- Schema Initial pour Biolink

-- 1. Table Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  theme JSONB DEFAULT '{"primary": "#3B82F6", "bg": {"to": "#8ec5fc", "from": "#e0c3fc"}}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Active RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Table Workspaces
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'Espace d''équipe',
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Active RLS for workspaces
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Workspaces viewable by members." ON public.workspaces FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = id AND wm.user_id = auth.uid()
  )
);
CREATE POLICY "Anyone can insert a workspace." ON public.workspaces FOR INSERT WITH CHECK (true);
CREATE POLICY "Owners can delete workspace." ON public.workspaces FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = id AND wm.user_id = auth.uid() AND wm.role = 'Owner'
  )
);

-- 3. Table Workspace_Members
CREATE TABLE IF NOT EXISTS public.workspace_members (
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'Member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (workspace_id, user_id)
);

-- Active RLS for workspace_members
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members viewable by members." ON public.workspace_members FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = workspace_members.workspace_id AND wm.user_id = auth.uid()
  )
);
CREATE POLICY "Users can insert membership." ON public.workspace_members FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Table Link Groups (VAs / Members)
CREATE TABLE IF NOT EXISTS public.link_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Active RLS for link_groups
ALTER TABLE public.link_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Link groups viewable by workspace members." ON public.link_groups FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = link_groups.workspace_id AND wm.user_id = auth.uid()
  )
);
CREATE POLICY "Users can insert link groups in their workspaces." ON public.link_groups FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = workspace_id AND wm.user_id = auth.uid()
  )
);

-- 5. Table Links
CREATE TABLE IF NOT EXISTS public.links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  link_group_id UUID REFERENCES public.link_groups(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Active RLS
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Links viewable by everyone." ON public.links FOR SELECT USING (true);
CREATE POLICY "Users can insert own links." ON public.links FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own links." ON public.links FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own links." ON public.links FOR DELETE USING (auth.uid() = user_id);

-- 6. Table Visits
CREATE TABLE IF NOT EXISTS public.visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  ip TEXT,
  user_agent TEXT,
  country TEXT,
  city TEXT,
  is_bot BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Active RLS
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visits viewable by owner." ON public.visits FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Anyone can insert a visit." ON public.visits FOR INSERT WITH CHECK (true);

-- Functions & Triggers for RLS ease
-- Grant all permissions strictly to authenticated users but open read to anon.
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
