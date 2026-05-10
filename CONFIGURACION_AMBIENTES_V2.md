# 🔧 Configuración de Ambientes - Versión 2.0

## ✅ Problema Resuelto

**Problema anterior:** Los archivos `.env.development` y `.env.production` NO se suben a GitHub (están en `.gitignore`), por lo que al descargar el código, la app siempre usaba configuración de desarrollo.

**Solución nueva:** Archivo de configuración centralizado que **SÍ se sube a GitHub** con las configuraciones de ambos ambientes.

---

## 📁 Nueva Estructura

```
src/app/config/
└── supabase.config.ts  ← Configuración centralizada (se sube a GitHub)

src/app/utils/supabase/
└── info.tsx            ← Re-exporta desde config (compatibilidad)

src/app/src/api/
└── client.ts           ← Usa config centralizada
```

---

## 🎯 Cómo Funciona

### 1. Archivo de Configuración Central

**Ubicación:** `src/app/config/supabase.config.ts`

Este archivo contiene:
- ✅ Configuración de **desarrollo**
- ✅ Configuración de **producción**
- ✅ Lógica de detección automática del ambiente
- ✅ Solo claves públicas (anon keys)
- ❌ NUNCA incluye Service Role Keys

```typescript
const configs = {
  development: {
    projectId: 'eubjevjqcpsvpgxmdpvy',
    url: 'https://eubjevjqcpsvpgxmdpvy.supabase.co',
    anonKey: '...'  // Clave pública, segura para GitHub
  },
  production: {
    projectId: 'bvnbwqsvldsfdfzifcp',
    url: 'https://bvnbwqsvldsfdfzifcp.supabase.co',
    anonKey: '...'  // Clave pública, segura para GitHub
  }
};
```

### 2. Detección Automática del Ambiente

La configuración detecta automáticamente el ambiente en este orden:

#### Opción 1: Variable de entorno `VITE_APP_ENV`
```bash
# Forzar producción
VITE_APP_ENV=production pnpm build

# Forzar desarrollo
VITE_APP_ENV=development pnpm dev
```

#### Opción 2: Modo de Vite (default)
```bash
pnpm build:prod    # → MODE=production → usa config de producción
pnpm build:dev     # → MODE=development → usa config de desarrollo
pnpm dev           # → MODE=development → usa config de desarrollo
```

#### Opción 3: Dominio (para apps deployadas)
- `localhost` → desarrollo
- `*.vercel.app` → producción
- `*.netlify.app` → producción
- `*.cloudflare.com` → producción
- Cualquier otro dominio → producción

---

## 🚀 Scripts NPM

```json
{
  "dev": "vite --mode development",           // ← Desarrollo
  "build:dev": "vite build --mode development",  // ← Build dev
  "build:prod": "vite build --mode production",  // ← Build prod ✅
  "preview:prod": "vite preview --mode production"
}
```

---

## 📦 Para Subir a GitHub

### ✅ Archivos que SÍ se suben

```
src/app/config/supabase.config.ts  ← Configuraciones (solo anon keys)
.env.example                        ← Plantilla de ejemplo
package.json                        ← Scripts de build
vite.config.ts                      ← Configuración de Vite
```

### ❌ Archivos que NO se suben (en `.gitignore`)

```
.env.development  ← Service Role Keys (sensible)
.env.production   ← Service Role Keys (sensible)
.env
.env.local
```

---

## 🔐 Seguridad

### Claves Públicas vs Privadas

**✅ Seguro para GitHub:**
- `VITE_SUPABASE_PROJECT_ID` - ID público del proyecto
- `VITE_SUPABASE_URL` - URL pública
- `VITE_SUPABASE_ANON_KEY` - Clave pública (anon key)
  - Solo permite operaciones permitidas por RLS
  - Es segura exponerla en el frontend

**❌ NUNCA subir a GitHub:**
- `SUPABASE_SERVICE_ROLE_KEY` - Clave privada
  - Bypasea Row Level Security
  - Acceso total a la base de datos
  - Solo para backend/Edge Functions

---

## 📋 Guía de Uso

### Para Desarrollo Local

```bash
# 1. Clonar repositorio
git clone https://github.com/tu-usuario/sistema-camareros.git

# 2. Instalar dependencias
pnpm install

# 3. ¡Listo! La configuración ya está incluida
pnpm dev  # ← Usa automáticamente desarrollo
```

**NO necesitas crear archivos `.env*`** para que funcione la app básica.

### Para Build de Producción

```bash
# Build con configuración de producción
pnpm build:prod

# Preview del build
pnpm preview:prod
```

### Para Deploy (Vercel/Netlify)

1. **Conectar repositorio en Vercel/Netlify**
2. **Configuración del build:**
   - Build command: `pnpm build:prod`
   - Output directory: `dist`
   - Install command: `pnpm install`

3. **Variables de entorno (opcional):**
   - Solo necesarias si quieres sobrescribir la configuración
   - `VITE_APP_ENV=production` (ya lo hace automáticamente)

---

## 🧪 Verificar el Ambiente Actual

### En Desarrollo (pnpm dev)

Abre la consola del navegador (F12) y verás:

```javascript
🔧 Supabase Config: {
  environment: "development",
  projectId: "eubjevjqcpsvpgxmdpvy",
  url: "https://eubjevjqcpsvpgxmdpvy.supabase.co"
}
```

### En Producción (build)

El log solo aparece en desarrollo. En producción no hay logs.

Para verificar, inspecciona las llamadas de red en DevTools:
- Deberían ir a `bvnbwqsvldsfdfzifcp.supabase.co` (producción)

---

## 🔄 Migración desde Versión Anterior

Si tenías la versión anterior con `.env*` files:

### Antes (Versión 1):
```typescript
// info.tsx
export const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || "dev_fallback";
```

**Problema:** Sin archivos `.env*`, siempre usaba fallback de desarrollo.

### Ahora (Versión 2):
```typescript
// supabase.config.ts
const configs = {
  development: { projectId: 'dev_id', ... },
  production: { projectId: 'prod_id', ... }
};

const currentEnv = detectEnvironment(); // Auto-detecta
export const projectId = configs[currentEnv].projectId;
```

**Solución:** Detección automática basada en modo de Vite, no en archivos externos.

---

## ⚙️ Configuración Avanzada

### Forzar un Ambiente Específico

```bash
# En desarrollo, forzar producción (para testing)
VITE_APP_ENV=production pnpm dev

# En build, forzar desarrollo (poco común)
VITE_APP_ENV=development pnpm build
```

### Agregar Nuevo Ambiente (Staging)

Edita `src/app/config/supabase.config.ts`:

```typescript
const configs = {
  development: { /* ... */ },
  staging: {
    projectId: 'staging_project_id',
    url: 'https://staging_project_id.supabase.co',
    anonKey: 'staging_anon_key'
  },
  production: { /* ... */ }
};
```

Usar:
```bash
VITE_APP_ENV=staging pnpm build
```

---

## 🎯 Ventajas de esta Solución

✅ **No depende de archivos `.env*`** - Funciona "out of the box" al clonar el repo

✅ **Detección automática** - No necesitas configurar nada manualmente

✅ **Seguro para GitHub** - Solo contiene claves públicas

✅ **Fácil de debuggear** - Console log muestra qué ambiente está usando

✅ **Compatible con hosting** - Funciona en Vercel, Netlify, Cloudflare, etc.

✅ **Fácil de mantener** - Un solo archivo centralizado

---

## 🚨 Importante

**Service Role Keys siguen en `.env*` (opcional):**

Si necesitas Service Role Keys para Edge Functions:
1. Crea `.env.production` localmente (no se sube a GitHub)
2. Agrégalo en las variables de entorno de tu plataforma de hosting
3. **NUNCA** lo agregues a `supabase.config.ts`

**Ejemplo `.env.production` (local, no en GitHub):**
```bash
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
RESEND_API_KEY=tu_resend_key
```

Estas variables NO son accesibles desde el frontend, solo desde:
- Edge Functions de Supabase
- Servidor backend (si tienes)
- Scripts de Node.js

---

## 📝 Checklist de Deploy

- [ ] Código con `supabase.config.ts` subido a GitHub
- [ ] Build local funciona: `pnpm build:prod`
- [ ] Preview local funciona: `pnpm preview:prod`
- [ ] Verificado que usa configuración de producción (inspeccionar network)
- [ ] Deploy en plataforma (Vercel/Netlify)
- [ ] Aplicación carga correctamente
- [ ] Login funciona con usuarios de producción
- [ ] Datos vienen de base de datos de producción

---

## 🎉 ¡Listo!

Con esta nueva configuración:
- ✅ El código se puede descargar y usar inmediatamente
- ✅ Automáticamente detecta desarrollo vs producción
- ✅ No hay riesgo de exponer credenciales sensibles
- ✅ Fácil de mantener y deployar

**Tu aplicación ahora funciona "out of the box" sin necesidad de configurar nada.**
