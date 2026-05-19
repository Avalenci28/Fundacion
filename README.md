# Malambo Sonríe - Plataforma Web Full Stack

**Conectando corazones, construyendo comunidad.**

Una plataforma web profesional, moderna segura y visualmente impactante para la organización social **"Malambo Sonríe"**, enfocada en mejorar la calidad de vida de las personas mediante actividades comunitarias, proyectos sociales, eventos culturales y participación ciudadana.

---

## Architecture

- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind CSS + Framer Motion + Zustand
- **Backend:** Node.js + Express + PostgreSQL (Supabase Session Pooler)
- **Security:** JWT auth, bcrypt, helmet, rate limiting, CORS, input validation
- **Admin:** Full CRUD dashboard with protected routes

---

## Key Features

### Public Website
- **Hero Section** - Animated landing with impact counters
- **Mission & Vision** - Organization values
- **What We Do** - 4 interactive cards (Social, Events, Environment, Citizenship)
- **Projects** - Filterable by status (Completed, In Progress, Upcoming)
- **Events** - Calendar view with registration
- **Blog/News** - Posts with comments
- **Gallery** - Photo & video lightbox
- **Contact** - Functional form

### Authentication
- User registration & login
- JWT-based sessions
- Protected routes

### Admin Dashboard (/admin)
- Secure login with role verification
- **Projects CRUD** - Manage all projects with status control
- **Events CRUD** - Manage events
- **Blog/Posts CRUD** - Create and edit news
- **Gallery CRUD** - Upload and manage media
- **Messages** - View contact form submissions
- **Statistics** - Platform metrics

### Extra Features
- Dark mode toggle
- Animated scroll effects
- Toast notifications
- Microinteractions
- Responsive design (mobile-first)

---

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (Supabase) connection string

### Backend Setup

```bash
cd backend
npm install
# Create .env file (already provided with Supabase credentials)
npm run dev     # Start development server on port 5000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev     # Start on http://localhost:3000
```

### Build for Production

```bash
cd frontend
npm run build
npm start
```

---

## Project Structure

```
WEB FUNDACION/
├── backend/
│   ├── controllers/      # API route handlers
│   ├── middleware/       # Auth, upload middleware
│   ├── db/             # PostgreSQL query utilities
│   ├── routes/          # API routes
│   ├── scripts/         # Seed scripts
│   ├── server.js        # Express server
│   └── .env             # Environment variables
├── frontend/
│   ├── src/app/         # Next.js App Router pages
│   ├── src/components/  # React components
│   ├── src/store/       # Zustand state management
│   ├── src/lib/         # API utilities
│   └── public/          # Static assets
└── README.md
```

---

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/volunteer` - Register as volunteer
- `POST /api/auth/admin-login` - Admin login

### Projects
- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create (admin)
- `PUT /api/projects/:id` - Update (admin)
- `DELETE /api/projects/:id` - Delete (admin)

### Events
- `GET /api/events` - List events
- `POST /api/events/:id/register` - Register for event
- `POST /api/events` - Create (admin)
- `PUT /api/events/:id` - Update (admin)
- `DELETE /api/events/:id` - Delete (admin)

### Posts
- `GET /api/posts` - List posts
- `GET /api/posts/:slug` - Get single post
- `POST /api/posts/:id/comments` - Add comment
- `POST /api/posts` - Create (admin)
- `PUT /api/posts/:id` - Update (admin)

### Gallery
- `GET /api/gallery` - List media
- `POST /api/gallery` - Upload (admin)
- `DELETE /api/gallery/:id` - Delete (admin)

### Contact
- `POST /api/contact` - Submit message
- `GET /api/contact` - List messages (admin)

### Stats
- `GET /api/stats` - Platform statistics

---


---

## Design System

### Colors
- **Primary:** `#ff2e88` (Pink)
- **Secondary:** `#7b2cbf` (Purple)
- **Background:** White / Dark mode support

### Typography
- **Body:** Inter
- **Display:** Poppins

### Animations
- Framer Motion for scroll animations
- Hover effects on cards
- Page transitions

---

## Security

- JWT authentication with httpOnly cookies
- Bcrypt password hashing
- Helmet security headers
- Rate limiting
- Input validation with express-validator
- XSS protection
- CORS configuration
- Role-based access control (RBAC)

---

## Team

Built with love for the **Malambo Sonríe** community.

**"Cada pequeña acción cuenta. Juntos hacemos de Malambo un mejor lugar para vivir."**


