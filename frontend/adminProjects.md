# Admin Projects CRUD Documentation

## Flujo Completo

### 1. Listar Proyectos
- `GET /admin/projects` → `adminApi.getAllProjects()`
- Tabla con título, estado, beneficiarios, acciones (edit/delete)

### 2. Crear Proyecto
1. Click "Nuevo Proyecto" → Modal con form
2. Validación Zod: title*, description*, start_date*, status*, beneficiaries*, image
3. Upload image → Supabase Storage (`images/projects/`)
4. `POST /admin/projects` FormData → Backend multer + Supabase upload → PG insert
5. Success → invalidateQueries + close modal

### 3. Editar Proyecto
1. Click Edit → Load project data → Modal edit mode
2. Update form → Same validation
3. `PUT /admin/projects/:id` → Update PG + optional new image (old delete TODO)
4. Success → invalidate + close

### 4. Eliminar Proyecto
1. Click Delete → Confirm dialog
2. `DELETE /admin/projects/:id` → Soft delete (is_active=false)
3. Success → invalidate

## Backend Validación (Joi)
```
create/update: title.required, description.required, etc.
```

## UI Components
- Modal: framer-motion
- Form: react-hook-form + Zod resolver
- Icons: lucide-react
- Query: react-query
- Toast: react-hot-toast

## Seguridad
```
middleware: protect (JWT) + authorize('admin')
Public read: /api/projects (unauth ok)
```

## Dependencias
```
FE: zod react-hook-form @hookform/resolvers
BE: joi multer @supabase/supabase-js pg
```

**Production ready CRUD integrated!**

