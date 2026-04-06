# ⏰ Todas las Opciones para Configurar el Cron Job

Este documento presenta TODAS las formas de configurar el cron job automático para las alertas de servicio.

---

## 🏆 **OPCIÓN 1: Cron-job.org** ⭐ (MÁS FÁCIL)

### ✅ Ventajas
- Gratis hasta 5 cron jobs
- Interfaz muy simple
- No requiere código
- Logs detallados
- Notificaciones por email si falla

### 📋 Configuración

**URL del servicio**: https://cron-job.org

#### Paso 1: Crear Cuenta
1. Ve a https://cron-job.org
2. Clic en **"Sign up"**
3. Regístrate con email

#### Paso 2: Crear Cron Job
```
Title: Alertas de Servicio 3 Horas
URL: https://nkwqaekswfwfpukqfzpk.supabase.co/functions/v1/make-server-ce05fe95/verificar-alertas-servicios

Schedule: 0 * * * *
(Cada hora en punto)

Request Settings:
  Method: GET
  
Custom Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rd3FhZWtzd2Z3ZnB1a3FmenBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzU1NTMsImV4cCI6MjA0ODgxMTU1M30.wvHFcIVEvUiWRKiVRWQPpUDpO-d03PKa1O7iDuJWD6w

Email notifications: ✓ On failures
```

#### Paso 3: Guardar y Probar
- Clic en **"Create cronjob"**
- Clic en el botón ▶️ para ejecutar manualmente
- Verifica que el status sea "Success"

---

## 🏆 **OPCIÓN 2: EasyCron** ⭐ (Alternativa)

### ✅ Ventajas
- Gratis hasta 2 cron jobs
- Ejecuciones cada 10 minutos mínimo
- Dashboard con estadísticas

### 📋 Configuración

**URL del servicio**: https://www.easycron.com

#### Paso 1: Crear Cuenta
1. Ve a https://www.easycron.com
2. Clic en **"Sign Up Free"**
3. Completa el registro

#### Paso 2: Crear Cron Job
```
Cron Job Name: Alertas de Servicio
URL: https://nkwqaekswfwfpukqfzpk.supabase.co/functions/v1/make-server-ce05fe95/verificar-alertas-servicios

Cron Expression: 0 * * * *

HTTP Method: GET

HTTP Headers:
  Name: Authorization
  Value: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rd3FhZWtzd2Z3ZnB1a3FmenBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzU1NTMsImV4cCI6MjA0ODgxMTU1M30.wvHFcIVEvUiWRKiVRWQPpUDpO-d03PKa1O7iDuJWD6w

Status: Enabled
```

---

## 🏆 **OPCIÓN 3: GitHub Actions** ⭐ (Si usas GitHub)

### ✅ Ventajas
- Gratis (2,000 min/mes privados, ilimitado públicos)
- Integrado con tu repositorio
- Logs completos
- Ejecución manual con un clic

### 📋 Configuración

**Archivo creado**: `.github/workflows/alertas-servicios.yml`

#### Paso 1: Subir a GitHub
```bash
git add .github/workflows/alertas-servicios.yml
git commit -m "Add cron job for service alerts"
git push
```

#### Paso 2: Configurar Secret
1. Ve a tu repo en GitHub
2. Settings → Secrets and variables → Actions
3. New repository secret:
   - Name: `SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rd3FhZWtzd2Z3ZnB1a3FmenBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzU1NTMsImV4cCI6MjA0ODgxMTU1M30.wvHFcIVEvUiWRKiVRWQPpUDpO-d03PKa1O7iDuJWD6w`

#### Paso 3: Probar
1. Actions → "Verificar Alertas de Servicio"
2. Run workflow → Run workflow
3. Ver logs

**Ver guía completa**: `/GITHUB_ACTIONS_SETUP.md`

---

## 🏆 **OPCIÓN 4: Zapier** (Automatización)

### ✅ Ventajas
- Interfaz visual sin código
- Integración con miles de apps
- 100 tareas/mes gratis

### 📋 Configuración

**URL del servicio**: https://zapier.com

#### Paso 1: Crear Cuenta
1. Ve a https://zapier.com
2. Sign up gratis

#### Paso 2: Crear Zap
```
Trigger: Schedule by Zapier
  - Event: Every Hour
  
Action: Webhooks by Zapier
  - Event: GET
  - URL: https://nkwqaekswfwfpukqfzpk.supabase.co/functions/v1/make-server-ce05fe95/verificar-alertas-servicios
  - Headers:
    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rd3FhZWtzd2Z3ZnB1a3FmenBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzU1NTMsImV4cCI6MjA0ODgxMTU1M30.wvHFcIVEvUiWRKiVRWQPpUDpO-d03PKa1O7iDuJWD6w
```

#### Paso 3: Activar
- Clic en "Turn on Zap"
- Prueba con "Test Zap"

---

## 🏆 **OPCIÓN 5: Make (Integromat)** (Alternativa a Zapier)

### ✅ Ventajas
- Más operaciones gratis que Zapier (1,000/mes)
- Interfaz visual potente
- Más flexible

### 📋 Configuración

**URL del servicio**: https://www.make.com

#### Paso 1: Crear Cuenta
1. Ve a https://www.make.com
2. Sign up gratis

#### Paso 2: Crear Scenario
```
Trigger: Schedule
  - Every hour

Module: HTTP → Make a request
  - URL: https://nkwqaekswfwfpukqfzpk.supabase.co/functions/v1/make-server-ce05fe95/verificar-alertas-servicios
  - Method: GET
  - Headers:
    Name: Authorization
    Value: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rd3FhZWtzd2Z3ZnB1a3FmenBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzU1NTMsImV4cCI6MjA0ODgxMTU1M30.wvHFcIVEvUiWRKiVRWQPpUDpO-d03PKa1O7iDuJWD6w
```

#### Paso 3: Activar
- Turn ON
- Run once para probar

---

## 🏆 **OPCIÓN 6: Servidor Linux Propio** (Avanzado)

### ✅ Ventajas
- Control total
- Sin límites
- Privacidad completa

### 📋 Configuración

**Requisitos**: Acceso SSH a un servidor Linux

#### Paso 1: Conectar al Servidor
```bash
ssh usuario@tu-servidor.com
```

#### Paso 2: Crear Script
```bash
nano /home/usuario/alertas-servicio.sh
```

Contenido:
```bash
#!/bin/bash
curl -X GET \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rd3FhZWtzd2Z3ZnB1a3FmenBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzU1NTMsImV4cCI6MjA0ODgxMTU1M30.wvHFcIVEvUiWRKiVRWQPpUDpO-d03PKa1O7iDuJWD6w" \
  https://nkwqaekswfwfpukqfzpk.supabase.co/functions/v1/make-server-ce05fe95/verificar-alertas-servicios
```

#### Paso 3: Dar Permisos
```bash
chmod +x /home/usuario/alertas-servicio.sh
```

#### Paso 4: Configurar Crontab
```bash
crontab -e
```

Agregar línea:
```
0 * * * * /home/usuario/alertas-servicio.sh >> /home/usuario/alertas.log 2>&1
```

#### Paso 5: Verificar
```bash
# Ver cron jobs activos
crontab -l

# Ver logs
tail -f /home/usuario/alertas.log
```

---

## 🏆 **OPCIÓN 7: Vercel Cron Jobs** (Si usas Vercel)

### ✅ Ventajas
- Integrado con Vercel
- Configuración simple

### 📋 Configuración

Crear `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/verify-alerts",
      "schedule": "0 * * * *"
    }
  ]
}
```

Crear `/api/verify-alerts.ts`:
```typescript
export default async function handler(req, res) {
  const response = await fetch(
    'https://nkwqaekswfwfpukqfzpk.supabase.co/functions/v1/make-server-ce05fe95/verificar-alertas-servicios',
    {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      }
    }
  );
  const data = await response.json();
  res.json(data);
}
```

---

## 🏆 **OPCIÓN 8: Supabase Edge Functions con Deno Cron** (Experimental)

### ⚠️ Nota
Deno Cron en Supabase Edge Functions aún está en fase experimental.

### 📋 Configuración

Agregar a `/supabase/functions/server/index.tsx`:

```typescript
// Al final del archivo, antes de Deno.serve
Deno.cron("Verificar alertas de servicio", "0 * * * *", async () => {
  console.log("🔔 Ejecutando verificación automática de alertas...");
  
  try {
    // Lógica de verificación de alertas
    // (el código ya está en el endpoint)
  } catch (error) {
    console.error("Error en cron job de alertas:", error);
  }
});
```

---

## 📊 Comparación de Opciones

| Opción | Dificultad | Costo | Confiabilidad | Logs | Recomendado Para |
|--------|-----------|-------|---------------|------|------------------|
| **Cron-job.org** | ⭐ Muy Fácil | Gratis | ⭐⭐⭐⭐⭐ | ✅ Sí | Principiantes |
| **EasyCron** | ⭐ Muy Fácil | Gratis | ⭐⭐⭐⭐ | ✅ Sí | Principiantes |
| **GitHub Actions** | ⭐⭐ Fácil | Gratis | ⭐⭐⭐⭐⭐ | ✅ Sí | Proyectos en GitHub |
| **Zapier** | ⭐⭐ Fácil | Gratis (limitado) | ⭐⭐⭐⭐ | ✅ Sí | No técnicos |
| **Make** | ⭐⭐ Fácil | Gratis (más generoso) | ⭐⭐⭐⭐ | ✅ Sí | Automatización compleja |
| **Servidor Linux** | ⭐⭐⭐⭐ Difícil | Variable | ⭐⭐⭐⭐⭐ | ✅ Sí | Expertos con servidor |
| **Vercel** | ⭐⭐⭐ Medio | Gratis | ⭐⭐⭐⭐ | ✅ Sí | Apps en Vercel |
| **Deno Cron** | ⭐⭐⭐⭐ Difícil | Gratis | ⭐⭐⭐ Experimental | ⚠️ Limitado | Experimental |

---

## 🎯 Recomendación Final

### Para la mayoría de usuarios:
👉 **Opción 1: Cron-job.org**
- Más fácil de configurar
- No requiere conocimientos técnicos
- Gratis y confiable
- **Setup time: 5 minutos**

### Si ya usas GitHub:
👉 **Opción 3: GitHub Actions**
- Integrado con tu repo
- Logs completos
- Gratis ilimitado (repos públicos)
- **Setup time: 10 minutos**

### Si quieres automatizaciones visuales:
👉 **Opción 5: Make (Integromat)**
- Más operaciones gratis
- Interfaz potente
- **Setup time: 10 minutos**

---

## ✅ Pasos Siguientes

1. **Elige una opción** de la lista
2. **Sigue la guía** de configuración
3. **Prueba** la ejecución manual
4. **Verifica** los logs
5. **Espera** hasta la siguiente hora para confirmar que funciona automáticamente

---

## 🆘 Soporte

Si tienes problemas con cualquier opción:
1. Revisa los logs del servicio
2. Verifica que el endpoint responda manualmente
3. Confirma que el header de Authorization esté correcto
4. Revisa la documentación específica de cada servicio

**¿Necesitas ayuda?** Dime qué opción elegiste y te ayudo con la configuración específica. 🚀
