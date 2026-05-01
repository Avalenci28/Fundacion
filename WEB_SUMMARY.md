# 🌟 Fundación Malambo Sonríe - Resumen del Proyecto

## 📋 Descripción del Proyecto

**Fundación Malambo Sonríe** es una plataforma web integral para una organización social sin fines de lucro, diseñada para conectar corazones y construir comunidad mediante actividades comunitarias, proyectos sociales y participación ciudadana.

---

## 🚀 Características de la Página Web

### **Páginas Públicas**

| Página | Descripción |
|--------|-------------|
| **Inicio (/)** | Página principal con hero section, estadísticas en vivo y proyectos destacados |
| **Proyectos (/proyectos)** | Catálogo de proyectos sociales con filtros y búsqueda |
| **Eventos (/eventos)** | Calendario de eventos comunitarios |
| **Blog (/blog)** | Artículos y noticias de la fundación |
| **Galería (/galeria)** | Galería de fotos y videos de actividades |
| **Contacto (/contacto)** | Formulario de contacto |
| **Participar (/participar)** | Registro de voluntarios |

### **Páginas de Acceso Privado**

| Página | Descripción |
|--------|-------------|
| **Login (/login)** | Panel de acceso para administradores |
| **Admin (/admin)** | Panel de administración completo |

---

## 🔧 Funcionalidades del Sistema

### **Backend (API REST)**

- **Autenticación JWT** - Login seguro con tokens
- **Gestión de Usuarios** - CRUD completo (admin)
- **Proyectos** - Crear, editar, eliminar proyectos
- **Eventos** - Gestión de eventos comunitarios
- **Publicaciones (Blog)** - Artículos y noticias
- **Galería** - Imágenes y videos
- **Contactos** - Formularios de contacto
- **Participaciones** - Registro de voluntarios
- **Estadísticas** - Dashboard con métricas

### **Frontend (Next.js 14)**

- **Diseño Responsivo** - Funciona en móvil y escritorio
- **Modo Oscuro/Claro** - Soporte para tema oscuro
- **Animaciones** - Framer Motion para transiciones
- **Conexión API** - Consumo del backend
- ** State Management** - Zustand para estado global

---

## 💻 Tecnología Utilizada

### **Frontend**
```
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion (animaciones)
- Zustand (estado)
- Axios (HTTP)
- Lucide React (iconos)
```

### **Backend**
```
- Node.js
- Express.js
- PostgreSQL (Supabase)
- JWT (autenticación)
- bcryptjs (encriptación)
- express-validator
- cors, helmet (seguridad)
- dotenv (variables de entorno)
```

### **Base de Datos**
```
- Supabase (PostgreSQL)
- Session Pooler (IPv4)
-SSL habilitado
```

---

## ⚙️ Configuración de Conexión

### **Session Pooler (Supabase)**
```
PGHOST=aws-1-us-west-2.pooler.supabase.com
PGPORT=5432
PGUSER=postgres.fulgeedluudhpmglteqp
PGPASSWORD=1044616328base
PGDATABASE=postgres
```

### **JWT**
```
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
```

---

## 🔑 Credenciales de Acceso Admin

| Campo | Valor |
|-------|-------|
| **URL** | http://localhost:3000/login |
| **Email** | admin@fundacion.org |
| **Password** | Admin2024! |

---

## 📁 Estructura del Proyecto

```
WEB FUNDACION/
├── backend/                    # Servidor API
│   ├── config/                # Configuraciones
│   │   ├── app.js            # Config Express
│   │   └── database.js       # Pool PostgreSQL
│   ├── controllers/           # Lógica de negocio
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── eventController.js
│   │   └── ...
│   ├── routes/               # Rutas API
│   ├── middleware/           # Middlewares
│   ├── scripts/               # Scripts utilitarios
│   ├── .env                  # Variables de entorno
│   ├── server.mjs            # Servidor principal
│   └── package.json
│
├── frontend/                  # Aplicación Next.js
│   ├── src/
│   │   ├── app/              # Páginas
│   │   │   ├── page.tsx     # Inicio
│   │   │   ├── admin/       # Panel admin
│   │   │   ├── login/      # Login
│   │   │   └── ...
│   │   ├── components/       # Componentes
│   │   ├── lib/             # Utilidades API
│   │   └── store/           # Estado global
│   ├── next.config.js
│   └── package.json
│
├── package.json               #Workspace root
├── README.md
└── WEB_SUMMARY.md         # Este archivo
```

---

## ✅ Trabajo Realizado

### **1. Configuración de Supabase**
- ✅ Configuración de Session Pooler (IPv4)
- ✅ Configuración SSL
- ✅ Pool de conexiones (max 15)
- ✅ Archivo `.env` creado

### **2. Backend**
- ✅ API REST completa
- ✅ Autenticación JWT funcionando
- ✅ Conexión a PostgreSQL/Supabase
- ✅ endPoint `/status` para verificar conexión

### **3. Frontend**
- ✅ Integración con backend
- ✅ Fetch de proyectos y estadísticas
- ✅ Sistema de login
- ✅ Panel de administración

### **4. Corrección de Errores**
- ✅ CorregidoAPI_URL → NEXT_PUBLIC_API_URL
- ✅ Corregido puerto de conexión (3000 → 5000)
- ✅ Verificadas credenciales admin

---

## 🛠️ Comandos para Iniciar

### **Iniciar Backend**
```bash
cd backend
node server.mjs
# Servidor en http://localhost:5000
```

### **Iniciar Frontend**
```bash
cd frontend
npm run dev
# Aplicación en http://localhost:3000
```

### **Verificar Conexión**
```bash
cd backend
node checkAdminUser.mjs
```

---

## 📝 Notas Importantes

1. **Puerto del Backend**: 5000
2. **Puerto del Frontend**: 3000
3. **Base de datos**: Supabase PostgreSQL
4. **Pool de conexiones**: Máximo 15 (plan Nano)
5. **SSL**: Habilitado para producción
6. **Modo de entorno**: development (default)

---

## 🎯 Próximos Pasos (Opcionales)

1. Cambiar `JWT_SECRET` en producción
2. Configurar dominio real
3. habilitar HTTPS
4. Agregar más validaciones
5. Implementar cache
6. Agregar logs estructurados
7. Tests unitarios

---

**Desarrollado por:**blackboxai  
**Última actualización:** 2024  
**Versión:** 1.0.0
