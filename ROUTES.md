# Malambo Sonríe - API Route Map

## Authentication
All protected routes require `Authorization: Bearer <token>` header.

---

## PUBLIC ROUTES (No Auth Required)

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/admin/login` | Admin login (requires admin role) |

### Projects (READ ONLY)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/projects` | List all active projects (with filters) |
| GET | `/api/projects/featured` | List featured projects |
| GET | `/api/projects/:id` | Get single project details |

### Events (READ ONLY)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/events` | List all active events (with filters) |
| GET | `/api/events/featured` | List featured upcoming events |
| GET | `/api/events/:id` | Get single event details |

### Posts/Blog (READ ONLY)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/posts` | List published posts (with filters) |
| GET | `/api/posts/featured` | List featured posts |
| GET | `/api/posts/:slug` | Get single post by slug (+ increments views) |

### Gallery (READ ONLY)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/gallery` | List all active gallery items |
| GET | `/api/gallery/featured` | List featured gallery items |
| GET | `/api/gallery/:id` | Get single gallery item |

### Contact
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/contact` | Submit contact form |

### Stats
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/stats/public` | Get public statistics |

### Volunteers
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/volunteers` | List all active users/volunteers |

---

## PROTECTED USER ROUTES (Any Authenticated User)

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/auth/me` | Get current user profile |
| PUT | `/api/auth/profile` | Update user profile |
| GET | `/api/auth/logout` | Logout user |

### Projects
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/projects/:id/join` | Join a project as volunteer |

### Events
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/events/:id/register` | Register for an event |

### Posts
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/posts/:id/comments` | Add comment to post |
| POST | `/api/posts/:id/like` | Like/unlike post |

### Volunteers
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/volunteers/profile` | Get own volunteer profile |
| PUT | `/api/volunteers/profile` | Update volunteer info |

---

## ADMIN ROUTES (Admin Role Required)
All routes under `/api/admin` require BOTH authentication AND `role === 'admin'`.

### Dashboard
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/dashboard` | Get admin dashboard stats |

### Users
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/users` | List all users (with pagination) |
| PUT | `/api/admin/users/:id` | Update user |
| DELETE | `/api/admin/users/:id` | Deactivate user |

### Projects (Full CRUD)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/projects` | List ALL projects (including inactive) |
| POST | `/api/admin/projects` | Create new project |
| PUT | `/api/admin/projects/:id` | Update project |
| DELETE | `/api/admin/projects/:id` | Soft-delete project |

### Events (Full CRUD)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/events` | List ALL events (including inactive) |
| POST | `/api/admin/events` | Create new event |
| PUT | `/api/admin/events/:id` | Update event |
| DELETE | `/api/admin/events/:id` | Soft-delete event |

### Posts (Full CRUD)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/posts` | List ALL posts (including unpublished) |
| POST | `/api/admin/posts` | Create new post |
| PUT | `/api/admin/posts/:id` | Update post |
| DELETE | `/api/admin/posts/:id` | Unpublish post |

### Gallery (Full CRUD)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/gallery` | List ALL gallery items |
| POST | `/api/admin/gallery` | Create gallery item |
| PUT | `/api/admin/gallery/:id` | Update gallery item |
| DELETE | `/api/admin/gallery/:id` | Soft-delete gallery item |

### Contacts
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/contacts` | List all contact submissions |
| PUT | `/api/admin/contacts/:id/read` | Mark contact as read |
| DELETE | `/api/admin/contacts/:id` | Delete contact message |

---

## Security Rules Summary

| Rule | Enforcement |
|------|-------------|
| Public routes | READ ONLY - no modifications allowed without auth |
| User routes | `protect` middleware - any authenticated user |
| Admin routes | `protect` + `authorize('admin')` - admin only |
| No write ops in public | All POST/PUT/DELETE for resources moved to `/api/admin` |
| Token validation | JWT with 7-day expiration |
| Password security | bcrypt hashed, min 6 chars |

---

## Role-Based Access Control

| Role | Public Read | User Actions | Admin CRUD |
|------|-------------|--------------|------------|
| Not logged in | ✅ | ❌ | ❌ |
| User (role: 'user') | ✅ | ✅ | ❌ |
| Admin (role: 'admin') | ✅ | ✅ | ✅ |

## Frontend Page Mapping

| Page | Public API Used | Admin API Used |
|------|-----------------|----------------|
| `/` (Home) | `/projects/featured`, `/events/featured`, `/posts/featured`, `/stats/public` | - |
| `/proyectos` | `/projects` | - |
| `/eventos` | `/events` | - |
| `/blog` | `/posts` | - |
| `/galeria` | `/gallery` | - |
| `/contacto` | POST `/contact` | - |
| `/login` | POST `/auth/login` | POST `/auth/admin/login` |
| `/registro` | POST `/auth/register` | - |
| `/admin` | - | ALL `/admin/*` endpoints |

