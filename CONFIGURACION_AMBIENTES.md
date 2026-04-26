# Configuración de Ambientes (Desarrollo y Producción)

## 📋 Pasos para Completar la Configuración

### 1️⃣ Rellenar Credenciales de DESARROLLO

Edita el archivo `.env.development` con tus credenciales actuales:

```bash
# Ir a: https://app.supabase.com/project/eubjevjqcpsvpgxmdpvy/settings/api

VITE_SUPABASE_PROJECT_ID=eubjevjqcpsvpgxmdpvy  # ✅ Ya configurado
VITE_SUPABASE_URL=https://eubjevjqcpsvpgxmdpvy.supabase.co  # ✅ Ya configurado

# Copiar de Supabase Dashboard → Settings → API:
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # ⬅️ Reemplazar
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...      # ⬅️ Mismo valor
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # ⬅️ Reemplazar

# Tu API key actual de Resend:
RESEND_API_KEY=re_123abc...  # ⬅️ Tu key actual
```

### 2️⃣ Rellenar Credenciales de PRODUCCIÓN

Edita el archivo `.env.production` con las credenciales del **nuevo proyecto** que acabas de crear:

```bash
# Ir a tu NUEVO proyecto de producción en Supabase
# https://app.supabase.com/project/[TU-NUEVO-PROJECT-ID]/settings/api

# Reemplazar estos valores:
VITE_SUPABASE_PROJECT_ID=abc123xyz  # ⬅️ Tu nuevo Project ID
VITE_SUPABASE_URL=https://abc123xyz.supabase.co  # ⬅️ Tu nuevo URL
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # ⬅️ Del nuevo proyecto
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...      # ⬅️ Mismo valor
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # ⬅️ Del nuevo proyecto

# Para producción considera usar un dominio propio con Resend:
RESEND_API_KEY=re_prod_key...  # ⬅️ Puedes usar la misma o crear una nueva
```

### 3️⃣ Obtener Credenciales de Supabase

#### Para el Proyecto Actual (Desarrollo):
1. Ir a: https://app.supabase.com/project/eubjevjqcpsvpgxmdpvy
2. Menú lateral → **Settings** → **API**
3. Copiar:
   - **anon/public** → Pegar en `VITE_SUPABASE_ANON_KEY` y `SUPABASE_ANON_KEY`
   - **service_role** → Pegar en `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **NUNCA exponer en frontend**

#### Para el Nuevo Proyecto (Producción):
1. Ir a tu nuevo proyecto en: https://app.supabase.com
2. Mismo proceso que arriba
3. Guardar las credenciales en `.env.production`

---

## 🔐 Seguridad IMPORTANTE

### ✅ Variables Seguras para el Frontend (VITE_):
- `VITE_SUPABASE_URL` → Puede ser pública
- `VITE_SUPABASE_ANON_KEY` → Puede ser pública (tiene permisos limitados)
- `VITE_SUPABASE_PROJECT_ID` → Puede ser pública

### ❌ Variables NUNCA en el Frontend:
- `SUPABASE_SERVICE_ROLE_KEY` → Solo para backend/Supabase Functions
- `RESEND_API_KEY` → Solo para backend

### 🛡️ Archivo .gitignore
Los archivos `.env.*` están en `.gitignore` para **NO subirlos a Git**.

**Nunca hagas commit de:**
- `.env`
- `.env.development`
- `.env.production`
- Cualquier archivo con credenciales

---

## 🚀 Uso de los Ambientes

### Desarrollo Local:
```bash
# El proyecto usará automáticamente .env.development
npm run dev
```

### Build para Producción:
```bash
# Usar las variables de .env.production
npm run build:prod
```

---

## 📦 Próximos Pasos

Una vez configuradas las credenciales:

1. ✅ **Verificar que funcionan:**
   ```bash
   npm run dev
   # Verificar que la app se conecta a Supabase
   ```

2. ✅ **Exportar datos de desarrollo** (si quieres migrar datos):
   ```bash
   cd src/app/supabase/migrations
   deno run --allow-net --allow-write export-data.ts
   ```

3. ✅ **Importar datos a producción** (opcional):
   - Usar el archivo SQL generado en `exports/import_data_YYYY-MM-DD.sql`
   - Ejecutarlo en el SQL Editor del proyecto de producción

4. ✅ **Configurar deploy automático** según tu plataforma:
   - Vercel / Netlify / Cloudflare Pages
   - Configurar las variables de entorno en el dashboard de tu plataforma

---

## 🔍 Verificar Configuración

### Test Rápido (Frontend):
```javascript
// En la consola del navegador
import { isConfigValid, getConfig } from './src/api/client'
console.log(getConfig())  // Ver valores actuales
console.log(isConfigValid())  // Debe retornar true
```

### Test Backend (Supabase Functions):
```bash
# Verificar que las variables están disponibles
deno run src/app/supabase/functions/server/index.tsx
```

---

## 📞 Soporte

Si tienes problemas:
1. Verificar que las credenciales están correctas
2. Verificar que las tablas están creadas (ver `00_schema_completo.sql`)
3. Revisar logs en Supabase Dashboard → Logs
