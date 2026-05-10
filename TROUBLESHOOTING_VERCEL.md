# 🔧 Troubleshooting - Variables de Entorno en Vercel

Guía paso a paso para verificar que las variables de entorno funcionen correctamente.

---

## ✅ Checklist de Verificación

### 1. Variables de Entorno Configuradas

**Settings → Environment Variables**

Debes tener EXACTAMENTE esto:

```
┌─────────────────────┬─────────────┬──────────────────────────────┐
│ NAME                │ VALUE       │ ENVIRONMENTS                 │
├─────────────────────┼─────────────┼──────────────────────────────┤
│ VITE_VERCEL_ENV     │ production  │ ✅ Production                │
│ VITE_VERCEL_ENV     │ development │ ✅ Preview                   │
└─────────────────────┴─────────────┴──────────────────────────────┘
```

⚠️ **IMPORTANTE:**
- Son DOS variables con el MISMO nombre
- Una tiene value "production" y scope "Production"
- Otra tiene value "development" y scope "Preview"
- NO marcar "Development" en ninguna

### 2. Build Command Correcto

**Settings → General → Build & Development Settings**

```
Build Command: pnpm run build:prod
```

O:
```
Build Command: pnpm build:prod
```

### 3. Redeploy con Variables Nuevas

Después de agregar/modificar variables:

1. Ve a **Deployments**
2. Click en el último deployment
3. Click en **"..."** (tres puntos)
4. **Redeploy**
5. ⚠️ **IMPORTANTE:** Desmarca "Use existing Build Cache"

---

## 🔍 Verificar en Deployment Logs

### Paso 1: Ver Build Logs

1. Ve a **Deployments**
2. Click en el deployment
3. Click en **"Building"** para expandir logs

### Paso 2: Buscar Variables

En los logs, busca:
```
VITE_VERCEL_ENV=production
```

O verifica todas las variables:
```
Environment Variables:
  VITE_VERCEL_ENV=production
```

**Si NO aparece:**
- Las variables no están configuradas correctamente
- Necesitas redeploy sin cache

### Paso 3: Ver Console Logs en el Sitio

1. Abre tu sitio deployado
2. Abre DevTools (F12)
3. Ve a Console
4. Busca:
```
🔧 Supabase Config: {
  environment: "production",  // ← Debe decir "production"
  projectId: "bvnbwqsvldsfdgfzifcp",  // ← Project correcto
  viteVercelEnv: "production",  // ← Debe mostrar la variable
  ...
}
```

---

## 🐛 Problemas Comunes

### Problema 1: Variable sale "unknown"

**Console muestra:**
```
viteVercelEnv: "unknown"
```

**Causa:** La variable no está disponible en el build

**Solución:**
1. Verifica que el nombre sea exactamente `VITE_VERCEL_ENV` (con VITE_ al inicio)
2. Redeploy sin cache
3. Verifica en logs del build que aparece la variable

---

### Problema 2: Siempre usa "production"

**Console muestra:**
```
environment: "production"
projectId: "bvnbwqsvldsfdgfzifcp"
```

En TODOS los deploys (incluso preview)

**Causa:** Solo tienes variable en Production, falta en Preview

**Solución:**
1. Settings → Environment Variables
2. Agregar segunda variable:
   - Name: `VITE_VERCEL_ENV`
   - Value: `development`
   - Environments: ✅ **Preview** (solo Preview)

---

### Problema 3: Siempre usa "development"

**Console muestra:**
```
environment: "development"
projectId: "eubjevjqcpsvpgxmdpvy"
```

En deploy de producción

**Causa:** 
- Variable de Production no configurada
- O Build Command usa `build:dev`

**Solución:**
1. Verifica variable Production existe
2. Verifica Build Command: `pnpm run build:prod`
3. Redeploy sin cache

---

### Problema 4: Detecta por hostname en vez de variable

**Console muestra:**
```
environment: "development"
viteVercelEnv: "unknown"
hostname: "tu-proyecto.vercel.app"
```

**Causa:** Variable no disponible, usa fallback por hostname

**Solución:**
1. Verifica el nombre: `VITE_VERCEL_ENV` (no `VERCEL_ENV` solo)
2. Vite solo expone variables que empiezan con `VITE_`
3. Redeploy sin cache

---

## 📋 Pasos de Diagnóstico

### Paso 1: Verificar Configuración

```
□ Settings → Environment Variables
  □ VITE_VERCEL_ENV = production (Production scope)
  □ VITE_VERCEL_ENV = development (Preview scope)

□ Settings → Build & Development Settings
  □ Build Command = pnpm run build:prod
```

### Paso 2: Hacer Redeploy

```
□ Deployments → Último deployment → ... → Redeploy
□ Desmarcar "Use existing Build Cache"
□ Esperar build completo
```

### Paso 3: Verificar Logs

```
□ Build logs muestran: VITE_VERCEL_ENV=production
□ No hay errores en build
□ Build completó exitosamente
```

### Paso 4: Verificar en Browser

```
□ Abrir sitio deployado
□ DevTools Console
□ Buscar log: "🔧 Supabase Config:"
□ Verificar environment y projectId correctos
□ Verificar viteVercelEnv tiene valor (no "unknown")
```

---

## 🔬 Test Específico

### En Production

**URL:** `tu-dominio.com` o `tu-proyecto.vercel.app`

**Console debe mostrar:**
```javascript
{
  environment: "production",
  projectId: "bvnbwqsvldsfdgfzifcp",
  viteVercelEnv: "production"  // ← Clave
}
```

### En Preview

**URL:** `tu-proyecto-git-development-team.vercel.app`

**Console debe mostrar:**
```javascript
{
  environment: "development",
  projectId: "eubjevjqcpsvpgxmdpvy",
  viteVercelEnv: "development"  // ← Clave
}
```

---

## ⚡ Solución Rápida

Si nada funciona, ejecuta estos pasos en orden:

1. **Borrar todas las variables VITE_VERCEL_ENV**
2. **Crear de nuevo:**
   - Name: `VITE_VERCEL_ENV`, Value: `production`, Env: Production
   - Name: `VITE_VERCEL_ENV`, Value: `development`, Env: Preview
3. **Commit código actualizado** (con el nuevo console.log)
4. **Push a GitHub**
5. **En Vercel:** Deployments → Redeploy (sin cache)
6. **Verificar console del sitio**

---

## 📞 Última Opción: Verificar Code en Vercel

Si las variables están bien pero no funciona:

1. Ve al deployment en Vercel
2. Click en **"Source"** para ver el código deployado
3. Busca `supabase.config.ts`
4. Verifica que tenga el código actualizado con el nuevo log

Si el código es viejo → Problema de Git/Deploy
Si el código es nuevo → Problema de variables

---

## ✅ Cuando Todo Funciona

Console debe mostrar:

**Production:**
```
🔧 Supabase Config: {
  environment: "production",
  projectId: "bvnbwqsvldsfdgfzifcp",
  url: "https://bvnbwqsvldsfdgfzifcp.supabase.co",
  mode: "production",
  prod: true,
  dev: false,
  viteVercelEnv: "production",  // ✅
  hostname: "tu-dominio.com"
}
```

**Preview/Development:**
```
🔧 Supabase Config: {
  environment: "development",
  projectId: "eubjevjqcpsvpgxmdpvy",
  url: "https://eubjevjqcpsvpgxmdpvy.supabase.co",
  mode: "production",
  prod: true,
  dev: false,
  viteVercelEnv: "development",  // ✅
  hostname: "tu-proyecto-git-dev.vercel.app"
}
```
