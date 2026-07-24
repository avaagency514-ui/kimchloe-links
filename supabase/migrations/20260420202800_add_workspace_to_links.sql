-- Migration to add workspace grouping to links
ALTER TABLE public.links 
ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update RLS policies to handle workspace_id if necessary, 
-- but since links are already viewable by owner (user_id), it's fine for now.
