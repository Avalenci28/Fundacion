-- ============================================================
-- RLS Security Migration — Fundación Malambo Sonríe
-- Tablas en INGLÉS: users, projects, events, posts, contacts,
--                   participations, volunteers, gallery
-- ============================================================

-- ──────────────────────────────────────────────
-- 1. HABILITAR RLS EN TODAS LAS TABLAS
-- ──────────────────────────────────────────────
ALTER TABLE public.users           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteers     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery        ENABLE ROW LEVEL SECURITY;

-- ──────────────────────────────────────────────
-- 2. TABLAS PÚBLICAS — lectura sin autenticación
--    projects, events, posts, gallery son contenido público
-- ──────────────────────────────────────────────

DROP POLICY IF EXISTS "public_read_projects" ON public.projects;
CREATE POLICY "public_read_projects" ON public.projects
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_events" ON public.events;
CREATE POLICY "public_read_events" ON public.events
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_posts" ON public.posts;
CREATE POLICY "public_read_posts" ON public.posts
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_gallery" ON public.gallery;
CREATE POLICY "public_read_gallery" ON public.gallery
  FOR SELECT USING (true);

-- ──────────────────────────────────────────────
-- 3. CONTACTS — cualquier persona puede insertar; solo admins leen
-- ──────────────────────────────────────────────

DROP POLICY IF EXISTS "public_insert_contacts" ON public.contacts;
CREATE POLICY "public_insert_contacts" ON public.contacts
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_contacts" ON public.contacts;
CREATE POLICY "auth_read_contacts" ON public.contacts
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "auth_update_contacts" ON public.contacts;
CREATE POLICY "auth_update_contacts" ON public.contacts
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "auth_delete_contacts" ON public.contacts;
CREATE POLICY "auth_delete_contacts" ON public.contacts
  FOR DELETE USING (auth.role() = 'authenticated');

-- ──────────────────────────────────────────────
-- 4. PARTICIPATIONS — cualquier persona puede inscribirse; solo admins leen
-- ──────────────────────────────────────────────

DROP POLICY IF EXISTS "public_insert_participations" ON public.participations;
CREATE POLICY "public_insert_participations" ON public.participations
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_participations" ON public.participations;
CREATE POLICY "auth_read_participations" ON public.participations
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "auth_update_participations" ON public.participations;
CREATE POLICY "auth_update_participations" ON public.participations
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "auth_delete_participations" ON public.participations;
CREATE POLICY "auth_delete_participations" ON public.participations
  FOR DELETE USING (auth.role() = 'authenticated');

-- ──────────────────────────────────────────────
-- 5. VOLUNTEERS — cualquier persona puede registrarse; solo admins leen
-- ──────────────────────────────────────────────

DROP POLICY IF EXISTS "public_insert_volunteers" ON public.volunteers;
CREATE POLICY "public_insert_volunteers" ON public.volunteers
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_volunteers" ON public.volunteers;
CREATE POLICY "auth_read_volunteers" ON public.volunteers
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "auth_update_volunteers" ON public.volunteers;
CREATE POLICY "auth_update_volunteers" ON public.volunteers
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "auth_delete_volunteers" ON public.volunteers;
CREATE POLICY "auth_delete_volunteers" ON public.volunteers
  FOR DELETE USING (auth.role() = 'authenticated');

-- ──────────────────────────────────────────────
-- 6. USERS — tabla sensible, solo admins
--    La tabla users NO tiene auth_id (usa id SERIAL),
--    así que las políticas verifican role = 'admin'
-- ──────────────────────────────────────────────

DROP POLICY IF EXISTS "admin_read_users" ON public.users;
CREATE POLICY "admin_read_users" ON public.users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE role = 'admin')
  );

DROP POLICY IF EXISTS "admin_all_users" ON public.users;
CREATE POLICY "admin_all_users" ON public.users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE role = 'admin')
  );

-- ──────────────────────────────────────────────
-- 7. VERIFICACIÓN
-- ──────────────────────────────────────────────
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies WHERE schemaname = 'public'
ORDER BY tablename, policyname;

SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users','projects','events','posts','contacts','participations','volunteers','gallery');