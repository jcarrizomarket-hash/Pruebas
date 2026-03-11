# 🔄 Cómo Sincronizar Figma Make con Vercel

## 📋 Problema Actual

Estás viendo diferentes versiones de la aplicación:
- **En Figma Make**: Versión actualizada con pestañas Coordinadores, Altas y Registros QR
- **En Vercel**: Versión antigua con contenido diferente

## 🎯 Solución: 3 Pasos para Sincronizar

### Paso 1: Descargar el Código de Figma Make

1. En Figma Make, haz clic en el botón **"Export"** o **"Descargar"** (generalmente en la esquina superior derecha)
2. Esto descargará un archivo ZIP con todo tu código actualizado
3. Descomprime el archivo en tu computadora

### Paso 2: Actualizar tu Repositorio Git

Asumiendo que tu proyecto en Vercel está conectado a un repositorio de GitHub/GitLab/Bitbucket:

```bash
# Navega a la carpeta donde descomprimiste el código
cd /ruta/a/tu/proyecto

# Si aún no has inicializado git:
git init
git add .
git commit -m "Actualización con pestañas Admin completas"

# Si ya tienes un repositorio remoto:
git add .
git commit -m "Actualización con pestañas Admin completas"
git push origin main
```

### Paso 3: Vercel Se Actualizará Automáticamente

Una vez que hagas `git push`, Vercel detectará el cambio y:
1. Iniciará un nuevo deployment automáticamente
2. Compilará el código actualizado
3. Lo desplegará en tu dominio

Esto generalmente toma 1-3 minutos.

---

## 🔍 Verificar la Sincronización

### En Vercel Dashboard:

1. Ve a [vercel.com](https://vercel.com)
2. Entra a tu proyecto
3. Ve a la pestaña **"Deployments"**
4. Deberías ver un nuevo deployment en progreso o completado
5. Una vez completado, haz clic en **"Visit"** para ver tu sitio actualizado

### En tu Dominio:

1. Abre tu aplicación en el navegador
2. **Refresca con caché limpio**: `Ctrl + Shift + R` (Windows/Linux) o `Cmd + Shift + R` (Mac)
3. Ve a la sección **Admin**
4. Deberías ver las tres pestañas: Coordinadores, Altas y Registros QR

---

## ⚠️ Problemas Comunes

### Problema 1: "Sigo viendo la versión antigua"
**Solución**: Limpia la caché del navegador
- Chrome: `Ctrl + Shift + Delete` → Selecciona "Imágenes y archivos en caché"
- O abre una ventana de incógnito: `Ctrl + Shift + N`

### Problema 2: "No tengo un repositorio Git configurado"
**Solución**: Importa tu código a GitHub primero

```bash
# Crea un nuevo repositorio en GitHub (hazlo desde github.com)
# Luego conecta tu código local:

git init
git add .
git commit -m "Código inicial desde Figma Make"
git branch -M main
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main
```

Después, en Vercel:
1. Ve a "Add New Project"
2. Importa tu repositorio de GitHub
3. Vercel lo detectará y desplegará automáticamente

### Problema 3: "El deploy falla en Vercel"
**Solución**: Revisa los logs de build

1. En Vercel Dashboard → Tu proyecto → Deployments
2. Haz clic en el deployment fallido
3. Ve a "Build Logs" para ver el error
4. Los errores comunes son:
   - Falta instalar dependencias → Verifica `package.json`
   - Variables de entorno faltantes → Configúralas en Vercel

---

## 🔐 Variables de Entorno en Vercel

Si tu aplicación usa variables de entorno (como `SUPABASE_URL`, `SUPABASE_ANON_KEY`, etc.), debes configurarlas en Vercel:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega cada variable con su valor correspondiente:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `WHATSAPP_PHONE_ID`
   - `WHATSAPP_API_KEY`
   - `RESEND_API_KEY` (si usas Resend)
   - `MAILGUN_API_KEY` y `MAILGUN_DOMAIN` (si usas Mailgun)
   - `FN_SECRET`
   - Etc.

4. Selecciona para qué ambientes aplican: Production, Preview, Development
5. Guarda los cambios
6. Haz un nuevo deployment (o redeploya el actual)

---

## 📦 Archivos Importantes a Incluir

Asegúrate de que tu repositorio incluya:

```
✅ /components/admin.tsx          (Con las 3 pestañas)
✅ /components/registros-qr-section.tsx
✅ /supabase/functions/server/index.tsx
✅ /supabase/functions/server/kv_store.tsx
✅ /utils/supabase/info.tsx
✅ package.json
✅ vercel.json (si tienes configuración especial)
```

---

## 🚀 Flujo de Trabajo Recomendado

A partir de ahora, para cada cambio:

1. **Desarrolla en Figma Make** (prototipa rápido)
2. **Cuando estés satisfecho**, descarga el código
3. **Actualiza tu repositorio Git**
4. **Git push** → Vercel se actualiza automáticamente
5. **Verifica en tu dominio** que todo funcione

---

## 📞 Si Sigues Teniendo Problemas

Si después de seguir estos pasos sigues viendo la versión antigua:

1. **Verifica el deployment en Vercel**: ¿Está en estado "Ready"?
2. **Revisa los logs de build**: ¿Hay algún error?
3. **Comprueba que estés viendo el dominio correcto**
4. **Limpia completamente la caché del navegador**
5. **Prueba en otro navegador o dispositivo**

---

## ✨ Automatización (Opcional)

Para sincronizar automáticamente cada vez que hagas cambios en Figma Make:

1. Usa Figma Make's Export API (si está disponible)
2. Configura un webhook que haga commit automático a tu repositorio
3. Vercel detectará los cambios y desplegará automáticamente

---

## 📝 Notas Importantes

- **Figma Make NO está conectado directamente a Vercel**
- Son dos entornos completamente separados
- Necesitas **sincronizar manualmente** el código entre ambos
- Vercel solo se actualiza cuando haces `git push` a tu repositorio

---

**Última actualización**: Marzo 6, 2026
