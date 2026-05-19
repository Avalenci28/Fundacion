# TODO - Fix imágenes que no cargan (rutas variables)

- [ ] Revisar cómo se construyen las URLs de imágenes en el frontend (proyectos, proyecto/[id], eventos, galería).
- [ ] Unificar el uso de un helper único para normalizar rutas (uploads/..., /uploads/..., URLs absolutas http(s)://...).
- [ ] Corregir el uso de `next/image` en las páginas para que reciba URLs absolutas correctas.
- [ ] Ajustar `frontend/src/lib/image.ts` si hace falta (detectar strings raros con espacios, etc.).
- [ ] Aplicar el helper unificado en: 
  - [ ] `frontend/src/components/ProjectsSection.tsx`
  - [ ] `frontend/src/app/proyectos/page.tsx`
  - [ ] `frontend/src/app/proyectos/[id]/page.tsx`
  - [ ] `frontend/src/components/EventsSection.tsx`
  - [ ] `frontend/src/app/eventos/page.tsx`
  - [ ] `frontend/src/app/galeria/page.tsx` (si aplica)
- [ ] Verificar que el backend sirva correctamente `/uploads` (ya está en server.js).
- [ ] Probar en navegador: imágenes locales subidas y URLs externas.

