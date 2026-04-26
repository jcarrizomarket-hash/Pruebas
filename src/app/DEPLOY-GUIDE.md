# 🚀 Guía de Deployment - Gestión de Servicios

Esta guía te ayudará a desplegar tu aplicación en **Vercel** con la Edge Function en **Supabase**.

---

## 📋 Pre-requisitos

Antes de comenzar, asegúrate de tener instalado:

### 1. Node.js y npm
```bash
node --version  # Debe ser v18 o superior
npm --version
```

### 2. Supabase CLI
```bash
npm install -g supabase
```

### 3. Vercel CLI
```bash
npm install -g vercel
```

---

## ⚡ Deployment Rápido (Un Solo Comando)

### **macOS / Linux:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### **Windows:**
```bash
deploy.bat
```

El script automáticamente:
- ✅ Verifica dependencias
- ✅ Despliega la Edge Function a Supabase
- ✅ Hace build del proyecto
- ✅ Despliega a Vercel
- ✅ Te muestra las URLs finales

---

## 🔧 Deployment Manual (Paso a Paso)

Si prefieres hacerlo manualmente o si el script falla:

### **Paso 1: Autenticación**

```bash
# Login en Supabase
supabase login

# Login en Vercel (la primera vez)
vercel login
```

### **Paso 2: Vincular proyecto Supabase**

```bash
supabase link --project-ref eubjevjqcpsvpgxmdpvy
```

### **Paso 3: Desplegar Edge Function**

```bash
supabase functions deploy make-server-ce05fe95 --no-verify-jwt
```

### **Paso 4: Configurar Variables de Entorno**

Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Edita `.env` y agrega tu clave ANON de Supabase.

### **Paso 5: Build del Proyecto**

```bash
npm install
npm run build
```

### **Paso 6: Desplegar a Vercel**

```bash
# Primera vez (configuración)
vercel

# Deployments subsecuentes (preview)
vercel

# Deploy a producción
vercel --prod
```

### **Paso 7: Configurar Variables en Vercel Dashboard**

1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings** → **Environment Variables**
4. Agrega:
   - `VITE_SUPABASE_URL` = `https://eubjevjqcpsvpgxmdpvy.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `tu_clave_anon`

5. **Re-despliega** el proyecto para que tome las variables:
   ```bash
   vercel --prod
   ```

---

## 🎯 Configurar Dominio Personalizado

### En Vercel Dashboard:

1. Ve a tu proyecto en Vercel
2. **Settings** → **Domains**
3. Agrega: `gestiondeservicios.jcarrizo.com`
4. Sigue las instrucciones para configurar DNS:
   - **CNAME** → `cname.vercel-dns.com`

---

## ✅ Verificación Post-Deployment

Después del deployment, verifica:

### 1. **Sitio accesible**
```
https://gestiondeservicios.jcarrizo.com
```

### 2. **Edge Function funcionando**
```
https://eubjevjqcpsvpgxmdpvy.supabase.co/functions/v1/make-server-ce05fe95/test
```

Deberías ver:
```json
{
  "success": true,
  "message": "¡Servidor funcionando correctamente!"
}
```

### 3. **Login y crear usuario admin**
- Click en "🚀 Crear Usuario Admin"
- Iniciar sesión con: `admin@ejemplo.com` / `admin123`
- Verificar que todos los tabs aparecen
- Probar el tab "🧪 Test API"

---

## 🐛 Troubleshooting

### Error: "Supabase CLI not found"
```bash
npm install -g supabase
```

### Error: "Vercel CLI not found"
```bash
npm install -g vercel
```

### Error: "Project not linked"
```bash
supabase link --project-ref eubjevjqcpsvpgxmdpvy
```

### Error: "Environment variables not set"
1. Verifica que `.env` existe
2. Verifica variables en Vercel Dashboard
3. Re-despliega con `vercel --prod`

### Error 404 en rutas de la Edge Function
- Verifica que la función esté desplegada: `supabase functions list`
- Revisa los logs: Supabase Dashboard → Edge Functions → Logs

### Build falla en Vercel
- Revisa los logs en Vercel Dashboard
- Verifica que `package.json` tenga script `build`
- Asegúrate que las dependencias estén en `dependencies`, no solo en `devDependencies`

---

## 📊 Flujo de Trabajo Recomendado

```
┌─────────────────────┐
│ Desarrollar en      │
│ Figma Make          │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Exportar código     │
│ (Download ZIP)      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Ejecutar            │
│ ./deploy.sh         │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Ver en:             │
│ gestiondeservicios. │
│ jcarrizo.com        │
└─────────────────────┘
```

---

## 🔄 Actualizaciones Futuras

Para actualizar el sitio después de cambios:

```bash
# Actualizar solo Edge Function
supabase functions deploy make-server-ce05fe95 --no-verify-jwt

# Actualizar solo Frontend
vercel --prod

# Actualizar TODO
./deploy.sh
```

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel Dashboard
2. Revisa los logs en Supabase Dashboard → Edge Functions
3. Verifica las variables de entorno
4. Abre la consola del navegador (F12) para ver errores de frontend

---

## 🎉 ¡Listo!

Tu aplicación ya está desplegada y funcionando en:
- 🌐 **Frontend:** https://gestiondeservicios.jcarrizo.com
- 🔧 **Backend:** https://eubjevjqcpsvpgxmdpvy.supabase.co/functions/v1/make-server-ce05fe95

**Usuario por defecto:**
- Email: `admin@ejemplo.com`
- Password: `admin123`
