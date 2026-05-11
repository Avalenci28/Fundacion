# Favicon Debug

## Qué debe pasar
- El favicon debe ser accesible desde el servidor por una URL como:
  - `http://localhost:3000/favicon.ico`
- Si responde 404/304 raro o no carga, el navegador seguirá mostrando el default/ninguno.

## Pasos
1) Abre en Chrome: `http://TU_HOST:TU_PUERTO/favicon.ico`
2) Verifica que la respuesta sea **200** y que el contenido sea `image/x-icon`.
3) Luego hard refresh:
   - `Ctrl + Shift + R`
4) Si no aparece:
   - Incógnito o borra caché de **Cached images and files**.

## Por qué
Los favicons se cachean agresivamente. También se bloquean recursos `file:///...`.

