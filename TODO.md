# TODO

## Problemas Resueltos ✅
- [x] HeroSection.tsx: Cambiado de `fetch` hardcodeado a `publicApi.getPublicStats()` con mapeo correcto de campos
- [x] ProjectsSection.tsx: Cambiado de `fetch` hardcodeado a `publicApi.getProjects()`
- [x] registro/page.tsx: Campo `motivation` duplicado - dividido en `experience` y `motivation`
- [x] registro/page.tsx: Función renombrada de `ParticipationPage` a `RegistroPage`
- [x] registro/page.tsx: Imports no utilizados eliminados (ArrowRight, Filter)
- [x] layout.tsx: Removido `appleWebApp` (no es Metadata válida en Next.js) - agregado `mobile-web-app-capable` en `other`
- [x] Tabla users creada correctamente en PostgreSQL (CREATE TABLE IF NOT EXISTS)
- [x] Import de globals.css corregido en layout.tsx (ruta correcta ./globals.css)
- [x] Tabla users creada y validada en PostgreSQL
- [x] Inserción y consulta de prueba ejecutadas correctamente

## Pendiente
- [ ] Verificar que el backend esté corriendo en puerto 5000 para pruebas de integración

## Notas
- Providers.tsx usa `QueryClientProvider` correctamente (de react-query)
- StatsSection.tsx usa `useQuery` correctamente con `publicApi`
- Blog, galeria, proyectos, eventos, contacto usan `useQuery` y `publicApi` correctamente
- Backend controllers y routes están correctamente configurados para PostgreSQL/Supabase

