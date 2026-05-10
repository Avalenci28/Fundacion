# 🌟 Fundación Malambo Sonríe - Documentación Completa

## 📋 Descripción del Proyecto

**Fundación Malambo Sonríe** es una plataforma web full-stack para una organización social sin fines de lucro en Malambo, Atlántico, Colombia. La plataforma conecta corazones y construye comunidad mediante actividades comunitarias, proyectos sociales, eventos culturales y participación ciudadana.

---

## 🏗️ Arquitectura General

### Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| **UI/Animaciones** | Framer Motion, Lucide React Icons |
| **Estado** | Zustand (auth store con persistencia) |
| **HTTP Client** | Axios con interceptores |
| **Backend** | Node.js + Express.js |
| **Base de Datos** | PostgreSQL via Supabase Session Pooler |
| **Autenticación** | JWT (httpOnly cookies + Bearer token) |
| **Seguridad** | Helmet, bcryptjs, express-rate-limit, express-validator |

---

## 📁 Estructura del Proyecto

```
WEB FUNDACION/
├── backend/                          # Servidor API Express
│   ├── config/
│   │   ├── app.js                   # Configuración centralizada de middlewares
│   │   └── database.js              # Pool PostgreSQL (Supabase Session Pooler)
│   ├── controllers/                 # Controladores de rutas
│   │   ├── authController.js        # Login, registro, perfil, logout
│   │   ├── projectController.js     # CRUD pública de proyectos
│   │   ├── eventController.js       # CRUD pública de eventos
│   │   ├── postController.js        # CRUD pública de posts/blog
│   │   ├── galleryController.js     # CRUD pública de galería
│   │   ├── contactController.js     # Envío de mensajes de contacto
│   │   ├── participationController.js # Registro de voluntarios
│   │   ├── statsController.js       # Estadísticas públicas
│   │   ├── volunteerController.js   # Gestión de voluntarios
│   │   ├── adminController.js       # Dashboard, usuarios, contactos admin
│   │   ├── adminProjectController.js # CRUD completo admin proyectos
│   │   ├── adminEventController.js  # CRUD completo admin eventos
│   │   ├── adminPostController.js   # CRUD completo admin posts
│   │   ├── adminGalleryController.js # CRUD completo admin galería
│   ├── routes/                      # Definición de rutas API
│   │   ├── auth.js                  # /api/auth
│   │   ├── projects.js              # /api/projects
│   │   ├── events.js               # /api/events
│   │   ├── posts.js                # /api/posts
│   │   ├── gallery.js              # /api/gallery
│   │   ├── contact.js              # /api/contact
│   │   ├── participation.js        # /api/participation
│   │   ├── stats.js                # /api/stats
│   │   ├── volunteers.js           # /api/volunteers
│   │   └── admin.js                # /api/admin (todas las rutas admin)
│   ├── middleware/
│   │   ├── auth.js                 # protect, authorize, optionalAuth
│   │   ├── errorHandler.js         # Manejador global de errores
│   │   └── upload.js               # Middleware de upload (multer)
│   ├── db/
│   │   └── query.js                # Helpers de consultas PostgreSQL
│   ├── models/                      # Modelos de datos (User, Project, Event, etc.)
│   ├── scripts/                     # Scripts de migración y seed
│   ├── server.js                    # Entry point del servidor Express
│   └── package.json
│
├── frontend/                        # Aplicación Next.js
│   ├── src/
│   │   ├── app/                     # Páginas (App Router)
│   │   │   ├── page.tsx            # Homepage
│   │   │   ├── layout.tsx          # Layout principal con Navbar y Footer
│   │   │   ├── admin/page.tsx      # Panel de administración
│   │   │   ├── blog/page.tsx       # Página de blog
│   │   │   ├── eventos/page.tsx    # Página de eventos
│   │   │   ├── galeria/page.tsx    # Página de galería
│   │   │   ├── contacto/page.tsx   # Página de contacto
│   │   │   ├── proyectos/page.tsx  # Página de proyectos
│   │   │   ├── login/page.tsx      # Login de administrador
│   │   │   ├── registro/page.tsx   # Registro de voluntario
│   │   │   ├── participar/page.tsx # Formulario de participación
│   │   │   └── participar/success/page.tsx # Página de éxito
│   │   ├── components/
│   │   │   ├── Navbar.tsx          # Navegación principal
│   │   │   ├── Footer.tsx          # Pie de página
│   │   │   ├── HeroSection.tsx     # Sección hero animada
│   │   │   ├── ProjectsSection.tsx # Proyectos destacados
│   │   │   ├── EventsSection.tsx   # Eventos destacados
│   │   │   ├── StatsSection.tsx    # Estadísticas de impacto
│   │   │   ├── Providers.tsx       # Providers (React Query, Toaster)
│   │   │   └── admin/
│   │   │       ├── AdminProjectsCRUD.tsx
│   │   │       ├── AdminEventsCRUD.tsx
│   │   │       ├── AdminPostsCRUD.tsx
│   │   │       ├── AdminGalleryCRUD.tsx
│   │   │       ├── AdminContactsCRUD.tsx
│   │   │       └── AdminParticipationsCRUD.tsx
│   │   ├── lib/
│   │   │   └── api.ts              # Cliente Axios con interceptores
│   │   ├── store/
│   │   │   └── authStore.ts        # Estado de autenticación (Zustand)
│   │   ├── types/
│   │   │   └── global.d.ts         # Definiciones de tipos TypeScript
│   │   └── utils/supabase/         # Utilidades Supabase SSR
│   ├── public/
│   │   ├── logo.svg                # Logo de la fundación
│   │   └── favicon.ico
│   ├── tailwind.config.js          # Configuración de Tailwind
│   ├── next.config.js              # Configuración de Next.js
│   └── package.json
│
├── .github/workflows/              # GitHub Actions CI/CD
├── playwright/                     # Tests E2E con Playwright
├── tests/                          # Tests adicionales
└── package.json                    # Workspace root
```

---

## 🌐 Páginas del Frontend

### Páginas Públicas

| Ruta | Descripción | Componentes Principales |
|------|-------------|------------------------|
| `/` | Homepage | HeroSection, ProjectsSection, StatsSection, misión/visión, CTA |
| `/proyectos` | Catálogo de proyectos | Filtros por estado, grid de proyectos |
| `/eventos` | Calendario de eventos | Filtros por categoría, cards de eventos |
| `/blog` | Artículos y noticias | Grid de posts con imágenes |
| `/galeria` | Galería de fotos/videos | Lightbox, filtros por categoría |
| `/contacto` | Formulario de contacto | Info de contacto + formulario |
| `/participar` | Registro de voluntarios | Formulario multi-campo |
| `/participar/success` | Confirmación | Mensaje de éxito |

### Páginas de Autenticación

| Ruta | Descripción |
|------|-------------|
| `/login` | Login administrador (protege acceso al admin) |
| `/registro` | Registro de usuario (future use) |

### Panel de Administración

| Ruta | Descripción |
|------|-------------|
| `/admin` | Dashboard completo con tabs: Dashboard, Proyectos, Eventos, Blog, Galería, Mensajes, Participaciones |

---

## 🔌 API REST Endpoints

### Autenticación (`/api/auth`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/login` | No | Login unificado (usuario o admin) |
| POST | `/admin/login` | No | Login específico admin (legacy) |
| GET | `/me` | JWT | Obtener perfil del usuario actual |
| PUT | `/profile` | JWT | Actualizar perfil |
| POST | `/logout` | No | Cerrar sesión |

### Proyectos (`/api/projects`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/` | No | Listar proyectos (con filtros) |
| GET | `/featured` | No | Proyectos destacados |
| GET | `/:id` | No | Detalle de proyecto |
| POST | `/:id/join` | JWT | Unirse a proyecto |

### Eventos (`/api/events`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/` | No | Listar eventos (con filtros) |
| GET | `/featured` | No | Eventos próximos destacados |
| GET | `/:id` | No | Detalle de evento |
| POST | `/:id/register` | JWT | Registrarse en evento |

### Posts/Blog (`/api/posts`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/` | No | Listar posts publicados |
| GET | `/featured` | No | Posts destacados |
| GET | `/:slug` | No | Post por slug |
| POST | `/:id/comments` | JWT | Agregar comentario |
| POST | `/:id/like` | JWT | Likear post |

### Galería (`/api/gallery`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/` | No | Listar items activos |
| GET | `/featured` | No | Items destacados |
| GET | `/:id` | No | Detalle de item |

### Contacto (`/api/contact`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/` | No | Enviar mensaje de contacto |

### Participación (`/api/participation`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/` | No | Enviar solicitud de voluntario |

### Estadísticas (`/api/stats`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/public` | No | Estadísticas públicas |

### Voluntarios (`/api/volunteers`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/` | No | Listar voluntarios activos |
| GET | `/profile` | JWT | Perfil propio |
| PUT | `/profile` | JWT | Actualizar perfil propio |

### Admin (`/api/admin`) - Requiere JWT + rol `admin`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/dashboard` | Estadísticas del dashboard |
| GET | `/users` | Listar usuarios |
| PUT | `/users/:id` | Actualizar usuario |
| DELETE | `/users/:id` | Desactivar usuario |
| GET/POST/PUT/DELETE | `/projects` | CRUD completo proyectos |
| GET/POST/PUT/DELETE | `/events` | CRUD completo eventos |
| GET/POST/PUT/DELETE | `/posts` | CRUD completo posts |
| GET/POST/PUT/DELETE | `/gallery` | CRUD completo galería |
| GET/PUT/DELETE | `/contacts` | CRUD mensajes de contacto |
| GET/PUT/DELETE | `/participations` | CRUD solicitudes de participación |

---

## 🎨 Sistema de Diseño

### Paleta de Colores

```css
Primary (Pink):    #ff2e88 (50-900)
Secondary (Purple): #7b2cbf (50-900)
Gris oscuro:       #111827 (gray-900)
Gris claro:        #f9fafb (gray-50)
```

### Tipografía

- **Display/Fonts**: Poppins (headings)
- **Body**: Inter (texto general)

### Animaciones

- Framer Motion para scroll animations
- Hover effects con scale y translate
- Page transitions suaves
- Glass morphism effects en navbar

---

## 🔐 Seguridad Implementada

1. **JWT Authentication** - Tokens con expiración de 7 días
2. **bcryptjs** - Hash de contraseñas (12 rounds)
3. **Helmet** - Headers de seguridad HTTP
4. **express-rate-limit** - Rate limiting en API
5. **CORS** - Configuración de orígenes permitidos
6. **express-validator** - Validación de inputs
7. **xss-clean** - Protección XSS
8. **hpp** - Protection against HTTP Parameter Pollution
9. **Role-Based Access Control** - Roles: `user`, `admin`, `volunteer`

---

## 📊 Modelo de Datos (PostgreSQL)

### Tablas Principales

- **users** - Usuarios autenticados (id, name, email, password, role, avatar, phone, bio, is_active)
- **projects** - Proyectos sociales (title, description, status, category, beneficiaries, image, is_featured, is_active)
- **events** - Eventos (title, description, date, location, capacity, type, image, is_featured, is_active)
- **posts** - Blog/posts (title, content, slug, author, image, is_published, is_featured, category)
- **gallery** - Galería (title, image, category, is_featured, is_active)
- **contacts** - Mensajes de contacto (name, email, phone, subject, message, is_read, is_replied)
- **participations** - Solicitudes de voluntario (name, email, phone, skills, availability, motivation, status)

---

## 🚀 Comandos para Iniciar

### Backend

```bash
cd backend
npm install
npm run dev        # Desarrollo en puerto 5000
npm start          # Producción
```

### Frontend

```bash
cd frontend
npm install
npm run dev        # Desarrollo en puerto 3000
npm run build      # Build de producción
```

### Credenciales Admin

```
Email:    admin@malambosonrie.org
Password: Admin2024!
```

---

## 🔧 Variables de Entorno (Backend)

```env
PORT=5000
PGHOST=aws-0-us-west-2.pooler.supabase.com
PGUSER=postgres.fulgeedluudhpmglteqp
PGPASSWORD=1044616328base
PGDATABASE=postgres
PGPORT=5432
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@malambosonrie.org
NODE_ENV=development
```

### Variables Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## ✅ Características Implementadas

### Frontend
- [x] Diseño responsivo (mobile-first)
- [x] Modo oscuro/claro
- [x] Animaciones con Framer Motion
- [x] Navegación con menú móvil
- [x] Hero section con estadísticas animadas
- [x] Secciones de proyectos, eventos destacados
- [x] Galería con lightbox
- [x] Formulario de contacto funcional
- [x] Formulario de participación de voluntarios
- [x] Panel admin con tabs y CRUD completo
- [x] Toast notifications
- [x] Lazy loading con React Query

### Backend
- [x] API REST completa
- [x] Autenticación JWT con httpOnly cookies
- [x] CRUD completo para admin
- [x] Validación de inputs con express-validator
- [x] Conexión a PostgreSQL via Supabase
- [x] Middlewares de seguridad (helmet, rate-limit, cors)
- [x] Manejador de errores centralizado
- [x] Soft delete en todos los recursos

---

## 📝 Notas de Desarrollo

1. El backend usa `import` (ESM) por `type: "module"` en package.json
2. El pool de conexiones PostgreSQL tiene máximo 15 conexiones (plan Nano)
3. La variable `NEXT_PUBLIC_API_URL` debe apuntar al backend (puerto 5000)
4. Los archivos de idioma (`locale`) detectados no están activos en la app actual
5. El panel admin está completamente protegido por JWT + rol admin
6. Las solicitudes de participación crean un registro `pending` que el admin debe aprobar

---

**Versión:** 1.0.0
**Última actualización:** Mayo 2026
**Stack:** Next.js 14 + Express.js + PostgreSQL/Supabase