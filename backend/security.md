# Supabase RLS Security Policies

## Implemented Policies

### 1. Row Level Security Enabled
RLS activated on:
- `public.users`
- `public.projects`
- `public.events`
- `public.posts`
- `public.gallery`
- `public.contacts`
- `public.participations`
- `public.volunteers`

### 2. Public Read Access
```
projects, events, posts, gallery: SELECT USING (true)
```

### 3. Authenticated Access
```
participations, contacts, volunteers: ALL USING (auth.role() = 'authenticated')
```

### 4. Users Table
- **Self-access**: `ALL USING (auth.uid() = auth_id)`
- **Admin full**: `ALL USING (EXISTS admin user with auth.uid())`
- Sensitive columns (password, email) protected via column policies or views.

## Prerequisites
- Add `auth_id UUID REFERENCES auth.users(id)` to `users` if missing.
- Ensure backend/frontend auth integrates with Supabase Auth.

## Testing
Run in Supabase SQL Editor:
```sql
-- Test public read
SELECT * FROM public.projects LIMIT 1;

-- Test authenticated (as anon fails)
SET ROLE authenticated;
SELECT * FROM public.contacts LIMIT 1;
```

## Migration Script
`backend/scripts/00_enable_rls.sql`

