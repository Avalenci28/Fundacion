# RLS Security — Fundación Malambo Sonríe
## Estado: ✅ IMPLEMENTADO (2026-05-09)

### Tablas con RLS habilitado
- `public.users`
- `public.projects`
- `public.events`
- `public.posts`
- `public.contacts`
- `public.participations`
- `public.volunteers`
- `public.gallery`

### Políticas creadas

#### Tablas públicas (lectura sin autenticación)
```sql
projects  → SELECT USING (true)
events    → SELECT USING (true)
posts     → SELECT USING (true)
gallery   → SELECT USING (true)
```

#### Tablas de escritura pública (cualquiera puede insertar, admins leen)
```sql
contacts       → INSERT (true), SELECT/UPDATE/DELETE (authenticated)
participations → INSERT (true), SELECT/UPDATE/DELETE (authenticated)
volunteers     → INSERT (true), SELECT/UPDATE/DELETE (authenticated)
```

#### Users (solo admins)
```sql
users → SELECT/ALL USING (EXISTS role = 'admin')
```

### Verificación
```sql
-- RLS habilitado
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public';

-- Políticas creadas
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies WHERE schemaname = 'public';
```

### Importante
- La tabla `users` usa `id SERIAL` (no tiene `auth_id`), las políticas verifican `role = 'admin'` directamente.
- El backend usa **Service Role Key** para operaciones de admin — nunca la clave anon.
- El Security Advisor de Supabase puede tardar unos minutos en actualizar después de aplicar los cambios.