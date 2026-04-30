# TODO: Fix Register Controller to Use PostgreSQL Directly

## Task
Corrige el controlador de registro de usuarios para que use PostgreSQL con `pool.query` y elimine cualquier referencia a `users` de Mongoose.

## Steps Completed
- [x] Analyze current implementation (authController.js uses pool + db/query.js helper)
- [x] Understand the difference between current approach and required approach

## Steps to Implement
- [ ] Refactor `register` function in `authController.js`:
  - Use `pool.query` directly instead of `users.findByEmail()` and `users.create()`
  - Check if email exists with direct SQL query
  - Insert new user with direct SQL query  
  - Return response: `{ success: true, message: "Usuario creado con éxito" }`

## Verification
- [ ] Run `npm run dev` to test
- [ ] Verify PostgreSQL connection message
- [ ] Test registration endpoint returns correct response format
