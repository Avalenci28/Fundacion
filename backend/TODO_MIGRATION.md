# TODO: Migración MongoDB → PostgreSQL

## Pasos completados:
- [x] 1. Instalar pg (cliente oficial de PostgreSQL)
- [x] 2. Actualizar backend/config/database.js con Pool
- [x] 3. Crear backend/scripts/initDb.js con tablas SQL
- [x] 4. Actualizar backend/server.mjs (conectar y /status)
- [x] 5. Crear backend/db/query.js (helpers SQL)
- [x] 6. Actualizar controllers a SQL
- [x] 7. Actualizar middleware/auth.js

## Pendiente:
- [ ] 8. Inicializar base de datos: npm run init-db
- [ ] 9. Verificar conexión: npm run dev
