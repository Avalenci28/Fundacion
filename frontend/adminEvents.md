# Admin Events CRUD Documentation

## Backend
- `GET /admin/events` → list with pagination
- `POST /admin/events` → create with image upload to Supabase
- `PUT /admin/events/:id` → update with optional new image
- `DELETE /admin/events/:id` → soft delete

**Validation (Joi)**:
```
title.required (3-200 chars)
description.required (10-2000 chars)
date.required (ISO date)
type.required (max 50)
capacity.required (1-10000)
location.required (max 200)
```

**Image**: Supabase `images/events/`, publicUrl returned.

## Frontend EventsTab
- Table: title, date, type, capacity, location, actions (edit/delete)
- Modal: form with Zod validation, image preview
- Mutations: create/update/delete with React Query
- Feedback: toast success/error

**Zod Schema**:
```
title.min(3).max(200)
description.min(10)
date.min(1)
type.min(1)
capacity.number().min(1)
location.min(3)
```

**Production ready - full CRUD + upload + validation!**

