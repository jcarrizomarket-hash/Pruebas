# ⚡ GUÍA RÁPIDA: Configurar Cron Job en 5 Minutos

## 🎯 Opción Más Fácil: Cron-job.org

---

## ✅ PASO 1: Crear Cuenta (2 minutos)

1. **Abre tu navegador**
2. Ve a: **https://cron-job.org**
3. Haz clic en **"Sign up"** (arriba a la derecha)
4. Completa el formulario:
   - Email
   - Contraseña
   - País
5. Haz clic en **"Sign up"**
6. **Confirma tu email** (revisa tu bandeja de entrada)

---

## ✅ PASO 2: Crear el Cron Job (3 minutos)

### 2.1 - Acceder a la Configuración

1. **Inicia sesión** en cron-job.org
2. En el menú superior, haz clic en **"Cronjobs"**
3. Haz clic en **"Create cronjob"** (botón azul)

### 2.2 - Completar el Formulario

Copia y pega exactamente estos valores:

```
┌─────────────────────────────────────────────────────────────────┐
│ FORMULARIO DE CONFIGURACIÓN                                     │
└─────────────────────────────────────────────────────────────────┘

📝 Title:
Alertas de Servicio 3 Horas

🌐 Address (URL):
https://nkwqaekswfwfpukqfzpk.supabase.co/functions/v1/make-server-ce05fe95/verificar-alertas-servicios

⏰ Schedule:
Selecciona: "Every hour"
O escribe: 0 * * * *

🔧 Request method:
GET

📋 Custom request headers:
  Header name: Authorization
  Header value: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rd3FhZWtzd2Z3ZnB1a3FmenBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzU1NTMsImV4cCI6MjA0ODgxMTU1M30.wvHFcIVEvUiWRKiVRWQPpUDpO-d03PKa1O7iDuJWD6w

📧 Notifications:
  ✓ Email me on failure (opcional)
  ✓ Email me on success (opcional, solo para probar)

✅ Enabled:
  ✓ Enabled (asegúrate de que esté marcado)
```

### 2.3 - Guardar

1. Haz clic en **"Create cronjob"** (botón azul al final)
2. Verás tu cron job en la lista

---

## ✅ PASO 3: Probar que Funciona (1 minuto)

### 3.1 - Ejecución Manual

1. En la lista de cronjobs, encuentra el que acabas de crear
2. En la columna **"Actions"**, busca el botón **▶️ (Play)**
3. Haz clic en el botón **▶️**
4. Espera unos segundos

### 3.2 - Ver el Resultado

Deberías ver:
```
✅ Status: Success
📊 HTTP Code: 200
```

Si ves esto, **¡está funcionando!** 🎉

### 3.3 - Ver Detalles (Opcional)

1. Haz clic en el nombre del cronjob
2. Ve a la pestaña **"History"**
3. Verás todas las ejecuciones:
   - ✅ Verde: Exitosa
   - ❌ Roja: Error

4. Haz clic en cualquier ejecución para ver:
   - La respuesta del servidor
   - Cuántas alertas se enviaron
   - Si hubo errores

---

## ✅ PASO 4: Verificar Ejecución Automática

El cron job ahora se ejecutará **automáticamente cada hora** en punto:
- 00:00
- 01:00
- 02:00
- ...
- 23:00

Para verificar:
1. Espera hasta la siguiente hora en punto
2. Ve a la pestaña **"History"**
3. Deberías ver una nueva ejecución automática

---

## 📊 Panel de Control

### Qué verás en el Dashboard

```
┌──────────────────────────────────────────────────────────┐
│ Alertas de Servicio 3 Horas                               │
├──────────────────────────────────────────────────────────┤
│ Status: ✅ Enabled                                        │
│ Next run: 2026-03-13 14:00:00                            │
│ Last run: 2026-03-13 13:00:00 (Success)                  │
│ Success rate: 100% (24/24)                               │
└──────────────────────────────────────────────────────────┘
```

---

## 🎯 ¿Qué Hace el Cron Job?

Cada hora, el sistema:

1. ✅ Verifica si hay servicios HOY
2. ✅ Busca los que empiezan en ~3 horas
3. ✅ Obtiene los perfiles confirmados
4. ✅ Envía recordatorio por WhatsApp
5. ✅ Envía recordatorio por Email
6. ✅ Marca la alerta como enviada

---

## 📱 Ejemplo de Respuesta

Cuando hay alertas para enviar:
```json
{
  "success": true,
  "message": "Se enviaron 3 alertas de recordatorio",
  "alertasEnviadas": 3,
  "serviciosProcesados": 1,
  "detalles": [
    {
      "pedido": "PED001",
      "camarero": "CAM001",
      "nombre": "Juan Pérez",
      "enviado": true
    }
  ]
}
```

Cuando NO hay alertas:
```json
{
  "success": true,
  "message": "No hay servicios próximos en las siguientes 3 horas",
  "alertasEnviadas": 0
}
```

---

## 🔧 Solución de Problemas

### ❌ Error 401 (No autorizado)
**Causa**: El token Authorization está mal  
**Solución**: Verifica que copiaste el token completo con "Bearer " incluido

### ❌ Error 404 (No encontrado)
**Causa**: La URL está mal o el servidor no está desplegado  
**Solución**: Espera 2 minutos y vuelve a intentar

### ❌ Error 500 (Error del servidor)
**Causa**: Problema en el servidor  
**Solución**: Revisa los logs en Supabase o contacta soporte

### ⏰ No se ejecuta a la hora exacta
**Causa**: Cron-job.org puede tener un delay de 1-2 minutos  
**Solución**: Esto es normal, el servicio sigue funcionando

---

## ✅ Verificación Final

Después de configurar, verifica:

- [ ] El cron job aparece en la lista
- [ ] El status es "Enabled" ✅
- [ ] La ejecución manual fue exitosa (código 200)
- [ ] Recibiste un email de confirmación (si activaste notificaciones)
- [ ] En la siguiente hora, se ejecutó automáticamente

---

## 🎉 ¡Listo!

Tu sistema de alertas automáticas está **100% configurado** y funcionando.

**¿Qué hacer ahora?**
1. Espera a que haya un servicio próximo (3 horas antes)
2. Los perfiles confirmados recibirán el recordatorio automáticamente
3. Puedes ver los logs en cron-job.org
4. Revisa la pestaña "Alertas de Servicio" en Configuración de la app

---

## 🔗 Enlaces Útiles

- **Dashboard**: https://cron-job.org/en/members/jobs/
- **Documentación**: https://cron-job.org/en/documentation/
- **Soporte**: https://cron-job.org/en/support/

---

## 📝 Notas Finales

- **Gratis**: Hasta 5 cron jobs sin costo
- **Confiable**: 99.9% uptime
- **Logs**: Guardados durante 30 días
- **Notificaciones**: Por email si falla

**¡Tu sistema está listo para producción!** 🚀

---

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas:
1. Revisa la sección de "Solución de Problemas" arriba
2. Ve a la pestaña "History" en cron-job.org
3. Revisa los logs del servidor
4. Consulta `/CRON_JOB_OPCIONES.md` para otras alternativas

**Tiempo total de configuración**: ⏱️ 5 minutos
