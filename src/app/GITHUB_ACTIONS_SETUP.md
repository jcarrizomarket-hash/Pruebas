# 🔧 Configuración de GitHub Actions para Alertas Automáticas

## ✅ Archivo Creado

El archivo `.github/workflows/alertas-servicios.yml` ya está creado en tu proyecto.

---

## 📋 Pasos para Activar GitHub Actions

### Paso 1: Subir el Archivo a GitHub

Si aún no has subido los cambios:

```bash
git add .github/workflows/alertas-servicios.yml
git commit -m "feat: Agregar cron job para alertas de servicio"
git push origin main
```

### Paso 2: Configurar el Secret en GitHub

1. **Ve a tu repositorio en GitHub**
2. Haz clic en **Settings** (⚙️)
3. En el menú lateral, ve a **Secrets and variables** → **Actions**
4. Haz clic en **"New repository secret"**
5. Completa:
   - **Name**: `SUPABASE_ANON_KEY`
   - **Secret**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rd3FhZWtzd2Z3ZnB1a3FmenBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzU1NTMsImV4cCI6MjA0ODgxMTU1M30.wvHFcIVEvUiWRKiVRWQPpUDpO-d03PKa1O7iDuJWD6w`
6. Haz clic en **"Add secret"**

### Paso 3: Verificar que Funciona

#### Opción A: Ejecución Manual (Recomendado para primera prueba)

1. Ve a tu repositorio en GitHub
2. Haz clic en la pestaña **Actions**
3. En el menú lateral, selecciona **"Verificar Alertas de Servicio"**
4. Haz clic en **"Run workflow"** (botón a la derecha)
5. Selecciona la branch (usualmente `main`)
6. Haz clic en **"Run workflow"**
7. Espera unos segundos y verás la ejecución
8. Haz clic en la ejecución para ver los logs

#### Opción B: Esperar Ejecución Automática

El workflow se ejecutará automáticamente cada hora en punto (00:00, 01:00, 02:00, etc.)

### Paso 4: Revisar Logs

En la pestaña Actions → Workflow execution:
- ✅ Verde: Ejecución exitosa
- ❌ Rojo: Error (revisa los logs)

Los logs mostrarán:
```
🔔 Verificando alertas de servicios...
📊 Código de respuesta: 200
📋 Respuesta del servidor:
{
  "success": true,
  "message": "Se enviaron 2 alertas de recordatorio",
  "alertasEnviadas": 2,
  "serviciosProcesados": 1
}
✅ Verificación exitosa
```

---

## 🎯 Personalización

### Cambiar la Frecuencia

Edita el archivo `.github/workflows/alertas-servicios.yml`:

```yaml
on:
  schedule:
    # Cada hora (actual)
    - cron: '0 * * * *'
    
    # Cada 30 minutos
    # - cron: '*/30 * * * *'
    
    # Cada 2 horas
    # - cron: '0 */2 * * *'
    
    # Solo en horario laboral (9-21h) cada hora
    # - cron: '0 9-21 * * *'
```

### Agregar Notificaciones por Email

Agrega al final del archivo:

```yaml
      - name: Enviar notificación si falla
        if: failure()
        uses: dawidd6/action-send-mail@v3
        with:
          server_address: smtp.gmail.com
          server_port: 465
          username: ${{ secrets.EMAIL_USERNAME }}
          password: ${{ secrets.EMAIL_PASSWORD }}
          subject: ❌ Fallo en verificación de alertas
          body: El cron job de alertas de servicio ha fallado. Revisa los logs en GitHub Actions.
          to: tu-email@ejemplo.com
          from: Sistema de Alertas
```

(Requiere configurar `EMAIL_USERNAME` y `EMAIL_PASSWORD` como secrets)

---

## ✅ Ventajas de GitHub Actions

- ✅ **Gratis**: 2,000 minutos/mes en repositorios privados, ilimitado en públicos
- ✅ **Confiable**: Infraestructura de GitHub
- ✅ **Logs completos**: Puedes ver cada ejecución
- ✅ **Ejecución manual**: Botón para ejecutar cuando quieras
- ✅ **Notificaciones**: Email si algo falla
- ✅ **Sin configuración externa**: Todo en tu repositorio

---

## ⚠️ Limitaciones

- ⏰ **Delay de 3-5 minutos**: GitHub Actions puede tener un ligero retraso
- 📊 **Máximo 20 workflows**: Si tienes muchos workflows
- 🔒 **Repositorio privado**: Consume minutos del plan gratuito (2,000/mes)

---

## 🆘 Solución de Problemas

### Error: "Secret SUPABASE_ANON_KEY not found"
**Solución**: Asegúrate de haber agregado el secret en Settings → Secrets and variables → Actions

### El workflow no se ejecuta
**Solución**: 
- Verifica que el archivo esté en la ruta correcta: `.github/workflows/alertas-servicios.yml`
- Asegúrate de que el repositorio esté en GitHub
- Espera hasta la próxima hora en punto

### El workflow falla con error 401
**Solución**: El token está mal configurado. Verifica el valor del secret `SUPABASE_ANON_KEY`

---

## 📝 Resumen

1. ✅ Archivo `.github/workflows/alertas-servicios.yml` creado
2. ⬆️ Sube el archivo a GitHub
3. 🔑 Configura el secret `SUPABASE_ANON_KEY`
4. ▶️ Ejecuta manualmente para probar
5. ⏰ El cron job se ejecutará automáticamente cada hora

**¡Listo para producción!** 🚀
