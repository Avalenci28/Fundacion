# Plan: Unified Admin User System

## Information Gathered

### Current System Status:
- **Authentication**: Has `/auth/login` for regular users and `/auth/admin/login` for admins
- **User Model**: Supports 'user' and 'admin' roles (in `backend/models/User.js`)
- **Admin Panel**: Exists at `frontend/src/app/admin/page.tsx`
- **Middleware**: `protect` and `authorize('admin')` middleware exists
- **Routes**: Admin routes are protected with admin role check
- **Public Registration**: Anyone can register via `/auth/register`

### Key Files to Modify:
- `backend/routes/auth.js` - Remove/disable public registration
- `backend/controllers/authController.js` - Unify login logic
- `backend/scripts/seed.js` - Only create admin user
- `frontend/src/app/login/page.tsx` - Use admin login only
- `frontend/src/app/registro/page.tsx` - Convert to participation form
- `frontend/src/components/Navbar.tsx` - Update button behavior
- `frontend/src/store/authStore.ts` - Update auth state handling

## Plan

### Phase 1: Backend Changes

#### 1.1 Disable Public Registration
- **File**: `backend/routes/auth.js`
- **Action**: Remove or comment out the `/register` route
- **Alternative**: Modify register to only allow admin creation during seed

#### 1.2 Unify Login Logic
- **File**: `backend/controllers/authController.js`
- **Action**: Modify `login` function to detect admin role and handle accordingly
- Keep `adminLogin` but could unify to single endpoint

#### 1.3 Create Participation Endpoint
- **File**: New route in `backend/routes/participation.js`
- **Controller**: New `backend/controllers/participationController.js`
- **Actions**:
  - Accept: name, email, phone, skills, availability, motivation
  - Save to `participations` table (new table)
  - Return success for frontend

#### 1.4 Update Seed Script
- **File**: `backend/scripts/seed.js`
- **Action**: Remove regular user creation, keep only admin user

### Phase 2: Frontend Changes

#### 2.1 Convert Registration to Participation
- **File**: `frontend/src/app/registro/page.tsx` 
- **Rename to**: `frontend/src/app/participar/page.tsx`
- **Changes**:
  - Update form fields: name, email, phone, skills, availability, motivation
  - Call participation API instead of auth register
  - Update UI to reflect "Participar" flow

#### 2.2 Update Navbar
- **File**: `frontend/src/components/Navbar.tsx`
- **Changes**:
  - Change "Participar" link to use `/participar` page
  - "Ingresar" remains at `/login` (admin only)

#### 2.3 Update Login Page
- **File**: `frontend/src/app/login/page.tsx`
- **Changes**:
  - Use `authApi.adminLogin` instead of `authApi.login`
  - Update UI text to say "Admin" explicitly
  - After login, redirect to admin panel

#### 2.4 Update Auth Store
- **File**: `frontend/src/store/authStore.ts`
- **Changes**:
  - May need to update token/user handling

### Phase 3: Database Changes

#### 3.1 Create Participations Table
- **File**: `backend/scripts/create_participations_table.sql`
- **Columns**: 
  - id (serial primary key)
  - name (varchar)
  - email (varchar)
  - phone (varchar)
  - skills (text)
  - availability (text)
  - motivation (text)
  - status (enum: pending, approved, rejected)
  - created_at (timestamp)

### Phase 4: Admin Panel Updates

#### 4.1 Add Participations Management
- **File**: `frontend/src/app/admin/page.tsx`
- **Changes**:
  - Add new tab "Participaciones" 
  - List pending participation requests
  - Allow approve/reject actions

## Dependent Files

### Backend:
- `backend/routes/auth.js`
- `backend/controllers/authController.js`  
- `backend/scripts/seed.js`
- `backend/config/database.js` (for new table)

### Frontend:
- `frontend/src/app/login/page.tsx`
- `frontend/src/app/registro/page.tsx` (rename to participar)
- `frontend/src/components/Navbar.tsx`
- `frontend/src/app/admin/page.tsx`
- `frontend/src/lib/api.ts`

## Followup Steps

1. Create database migration for participations table
2. Update seed script for admin-only
3. Modify backend routes
4. Create participation API
5. Update frontend pages
6. Update frontend API calls
7. Test full flow
8. Run seed script to create admin

## Testing Checklist

- [ ] Regular user cannot register
- [ ] Admin can login via /login page
- [ ] Participation form saves data
- [ ] Admin panel shows participation requests
- [ ] Navbar links work correctly
