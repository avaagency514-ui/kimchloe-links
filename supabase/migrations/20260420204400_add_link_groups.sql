-- 1. Table Link Groups (VAs / Members)
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

-- 2. Modify Links Table
ALTER TABLE public.links ADD COLUMN IF NOT EXISTS link_group_id UUID REFERENCES public.link_groups(id) ON DELETE SET NULL;
