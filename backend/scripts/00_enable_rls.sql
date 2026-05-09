-- RLS Security Migration for Fundación Malambo Sonríe
-- Run via Supabase Dashboard SQL Editor or psql
-- Enables RLS and creates policies for all public tables

-- 1. Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;

-- 2. Public read policies (projects, events, posts, gallery)
CREATE POLICY public_read_projects ON public.projects FOR SELECT USING (true);
CREATE POLICY public_read_events ON public.events FOR SELECT USING (true);
CREATE POLICY public_read_posts ON public.posts FOR SELECT USING (true);
CREATE POLICY public_read_gallery ON public.gallery FOR SELECT USING (true);

-- 3. Authenticated access (participations, contacts, volunteers)
CREATE POLICY authenticated_access_participations ON public.participations 
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY authenticated_access_contacts ON public.contacts 
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY authenticated_access_volunteers ON public.volunteers 
FOR ALL USING (auth.role() = 'authenticated');

-- 4. Users self-access + admin full access
-- Assumes users table has auth_id UUID referencing supabase.auth.users(id)
-- If not, add: ALTER TABLE public.users ADD COLUMN auth_id UUID REFERENCES auth.users(id);

CREATE POLICY user_self_access ON public.users
FOR ALL USING (auth.uid() = auth_id)
ENFORCED;

CREATE POLICY admin_full_access_users ON public.users
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE auth_id = auth.uid() AND role = 'admin'
  )
);

-- Additional: Hide sensitive columns for non-admin/non-self
CREATE POLICY users_public_view ON public.users
FOR SELECT USING (
  auth.uid() = auth_id OR
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE auth_id = auth.uid() AND role = 'admin'
  )
);

-- Verify policies created
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

