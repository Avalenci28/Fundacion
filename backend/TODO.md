# TODO - Conversión Backend a ES Modules (ESM)

## ✅ PASOS COMPLETADOS
- [x] Plan detallado creado
- [x] package.json actualizado ("type": "module")
- [x] server.mjs convertido a ESM con startServer()
- [x] Models convertidos (User, Project, Event, Post, Gallery, Contact)
- [x] Middleware convertido (auth, upload, errorHandler)
- [x] Controllers convertidos (auth, project, event, post, gallery, contact, stats, volunteer, admin)
- [ ] Routes convertidas (auth, projects, events, posts, gallery, contact, admin, stats, volunteers)
- [ ] Scripts convertidos (testConnection, checkEnv, cleanEnv, validateEnv, validateAndTest, validateAndTestServer, statusMonitor, seed)
- [ ] Utils convertido (errorResponse)
- [ ] Config convertido (database, app)
- [ ] Pruebas npm run dev sin errores CommonJS
- [ ] Documentación actualizada

## 📋 ORDEN DE EJECUCIÓN
```
1. ✅ package.json
2. server.js (crítico - arranca todo)
3. Models (dependencias de controllers)
4. Middleware (dependencias de routes)
5. Controllers 
6. Routes
7. Scripts/utils/config
8. ✅ Pruebas
```

## ⚠️ DEPENDENCIAS CRÍTICAS
```
server.js → validateAndTestServer.js → config/database.js
statusMonitor.js → dotenv + nodemailer + node-fetch
seed.js → todos los models
```

**Próximo paso:** `package.json` → `server.js` → `Models`

**Estado:** Pendiente confirmación usuario
