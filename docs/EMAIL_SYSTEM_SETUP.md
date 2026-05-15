# Sistema de Correos Automáticos - Malambo Sonríe

## Arquitectura

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Supabase DB   │────▶│  Database Hook   │────▶│ Edge Function   │
│   (solicitudes) │     │  (solo UPDATE)   │     │ send-email-     │
└─────────────────┘     └──────────────────┘     │ notification    │
                                                  └────────┬────────┘
                                                           │
                                                           ▼
                                                  ┌─────────────────┐
                                                  │    Resend API   │
                                                  │  (Envío email)  │
                                                  └─────────────────┘
```

## Archivos Creados

- `supabase/functions/send-email-notification/index.ts` - Edge Function principal
- `supabase/functions/send-email-notification/supabase.json` - Configuración

## Paso 1: Configurar Resend (Gratuito hasta 100 emails/día)

1. Ir a https://resend.com y crear cuenta
2. Ir a API Keys → Create API Key
3. Copiar la clave (formato: re_xxxxxxx)
4. **Importante**: Agregar dominio propio o usar el gratuito `onboarding@resend.dev`

## Paso 2: Desplegar Edge Function

```bash
# Instalar Supabase CLI si no lo tienes
npm install -g supabase

# Login
supabase login

# Ir al directorio del proyecto
cd supabase/functions/send-email-notification

# Desplegar
supabase functions deploy send-email-notification

# Configurar secreto
supabase secrets set RESEND_API_KEY=re_tu_clave_aqui
```

## Paso 3: Configurar el Webhook en Supabase Dashboard

### 3.1 Crear el Webhook

1. Ir a **Supabase Dashboard** → Tu proyecto
2. Menú lateral: **Database** → **Webhooks**
3. Click **Create a webhook**
4. Configurar:
   
   | Campo | Valor |
   |-------|-------|
   | **Name** | `solicitud_status_email` |
   | **Trigger** | `INSERT` | ← Cambiar a `UPDATE` |
   | **Table** | `solicitudes` |
   | **Function** | `send-email-notification` |
   | **HTTP Headers** | `{ "Authorization": "Bearer YOUR_ANON_KEY" }` |

### 3.2 Asegurar que solo se dispare cuando cambia `estado`

El webhook se dispara en CADA actualización. La Edge Function filtra internamente:

```typescript
// Dentro de index.ts - este chequeo es crucial:
if (oldStatus === newStatus) {
  return new Response(JSON.stringify({ message: "Skipped: status unchanged" }), {
    status: 200,
  });
}
```

### 3.3 Configurar el Canal (HTTP Request)

En la sección **Webhook URL**:
```
https://[tu-proyecto-id].supabase.co/functions/v1/send-email-notification
```

Marcar:
- ✅ Enable webhook
- ✅ Retry on failure (3 intentos)
- ⏱️ Timeout: 60 seconds

## Paso 4: Probar el Sistema

### 4.1 Prueba Manual (usando SQL)

```sql
-- Simular cambio de estado en la tabla
UPDATE solicitudes 
SET estado = 'aprobado' 
WHERE id = 'tu-id-aqui';
```

### 4.2 Prueba con la Edge Function

```bash
# Invocar directamente (opcional)
curl -X POST https://tu-proyecto.supabase.co/functions/v1/send-email-notification \
  -H "Authorization: Bearer ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "UPDATE",
    "table": "solicitudes",
    "record": {
      "email": "test@example.com",
      "nombre_completo": "Juan Pérez",
      "estado": "aprobado"
    },
    "old_record": {
      "estado": "pendiente"
    }
  }'
```

## Notas Importantes

### Sobre el Email de Rechazo (español)
El mensaje actual dice:

> "Gracias por tu interés en unirte a nuestra comunidad de voluntarios. Después de una evaluación cuidadosa, lamentamos informarte que no podemos continuar con tu solicitud en este momento.
> 
> Esta decisión no refleja tus capacidades. Te animamos a aplicar nuevamente en el futuro para otras oportunidades."

### Cambiar el Remitente
Para usar tu propio dominio:

1. En Resend, agregar y verificar tu dominio (malambosonrie.org o similar)
2. Cambiar en `index.ts` la línea:
   ```typescript
   const FROM_EMAIL = "Malambo Sonríe <voluntarios@malambosonrie.org>";
   ```

### Seguridad
- La API key de Resend está configurada como secreto en Supabase
- No exponer nunca `RESEND_API_KEY` en código público
- El webhook usa autenticación Bearer con la Anon Key de Supabase

### Límites Gratuitos de Resend
- 100 emails/día gratis
- 3000 emails/mes gratis
- Si necesitas más, actualizar a plan de pago (~$20/mes para ilimitado)

## Alternativa: Nodemailer con SMTP

Si prefieres no usar Resend, puedes modificar la función para usar Nodemailer:

```typescript
import nodemailer from "https://deno.land/x/nodemailer@1.0.0/mod.ts";

const transporter = nodemailer.createTransport({
  host: "smtp.tu-servidor.com",
  port: 587,
  secure: false,
  auth: {
    user: "tu-correo@ejemplo.com",
    pass: "tu-password",
  },
});
```

## Troubleshooting

### El email no se envía
1. Verificar que `RESEND_API_KEY` esté configurado como secreto
2. Revisar logs en Supabase Dashboard → Edge Functions → Logs
3. Verificar que el formato del email sea válido

### El webhook no se dispara
1. Verificar que el webhook está habilitado
2. Confirmar que el Trigger es correcto (debe incluir UPDATE)
3. Revisar políticas RLS de la tabla `solicitudes`

### Error de CORS
La función ya incluye headers CORS para permitir requests desde cualquier origen.
