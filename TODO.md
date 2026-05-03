# Admin Login Fix - TODO Progress

## Plan Approved - Steps:

**Pending:**
- [ ] Test in browser after server start

**Completed:**
- [x] 1. Check admin exists → YES (ID=2, role=admin, hash ok)
- [x] 2. Admin exists
- [x] 3. Update pw → Already correct, bcrypt verified

**Notes:**
- ✅ Credenciales correctas: email='admin@fundacion.org' password='Admin2024!'
- Backend /auth/admin/login returns 'Invalid credentials' if wrong pw/email/role
- Update frontend placeholder to match
- Server likely on port 5000 or 3001? Check server.js
