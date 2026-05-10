# 🚀 Deploy en Vercel

Guía completa para desplegar la aplicación en Vercel con ambientes separados.

---

## 📋 Configuración Actual

### Ambientes
- **Producción**: Usa proyecto Supabase `bvnbwqsvldsfdgfzifcp`
- **Development/Preview**: Usa proyecto Supabase `gkfpsyclglyradzeyuwz`

### URLs de Deploy
- **Production**: Tu dominio principal en Vercel
- **Preview**: URLs automáticas para cada branch/PR

---

## 🔧 Setup Inicial en Vercel

### 1. Crear Proyecto en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Click en **"Add New Project"**
3. Importa tu repositorio de GitHub
4. Configuración del proyecto:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (raíz del proyecto)
   - **Build Command**: `pnpm run build:prod`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`

### 2. Configurar Variables de Entorno

En tu proyecto de Vercel, ve a **Settings → Environment Variables** y agrega:

#### Para Production

```
VITE_VERCEL_ENV=production
```

**Scope**: Production

#### Para Preview/Development

```
VITE_VERCEL_ENV=development
```

**Scope**: Preview

---

## 🎯 Cómo Funciona

### Detección de Ambiente

El archivo `src/app/config/supabase.config.ts` detecta automáticamente el ambiente:

1. **En Vercel**: Usa `VITE_VERCEL_ENV`
   - `production` → Proyecto Supabase de producción
   - `development` → Proyecto Supabase de desarrollo

2. **En local**: Usa el `--mode` del comando
   - `pnpm run build:prod` → Producción
   - `pnpm run build:dev` → Desarrollo

### URLs Resultantes

**Production Build** (`bvnbwqsvldsfdgfzifcp`):
```
Edge Functions: https://bvnbwqsvldsfdgfzifcp.supabase.co/functions/v1/make-server-prod
```

**Development/Preview Build** (`gkfpsyclglyradzeyuwz`):
```
Edge Functions: https://gkfpsyclglyradzeyuwz.supabase.co/functions/v1/make-server-ce05fe95
```

---

## 📦 Comandos de Build

### Local

```bash
# Build de producción
pnpm run build:prod

# Build de desarrollo
pnpm run build:dev

# Preview local
pnpm run preview
```

### Vercel (Automático)

Vercel ejecuta automáticamente según el branch:

- **main branch** → Production build con `VITE_VERCEL_ENV=production`
- **otros branches** → Preview build con `VITE_VERCEL_ENV=development`

---

## 🔍 Verificar Deploy

Después de cada deploy, verifica:

### 1. Console Logs
Abre DevTools Console y busca:
```
🔧 Supabase Config: {
  environment: "production", // o "development"
  projectId: "bvnbwqsvldsfdgfzifcp", // o "gkfpsyclglyradzeyuwz"
  ...
}
```

### 2. Login Funcional
- Intenta hacer login con credenciales válidas
- Verifica que conecte al ambiente correcto

### 3. Edge Functions
Verifica en Network tab que llama a:
- Production: `make-server-prod`
- Development: `make-server-ce05fe95`

---

## 🐛 Troubleshooting

### Problema: Login falla en producción

**Solución**:
1. Verifica los logs de console
2. Confirma que `projectId === 'bvnbwqsvldsfdgfzifcp'`
3. Verifica que las tablas `kv_store_prod` y `kv_store_ce05fe95` existan en Supabase

### Problema: Preview usa producción

**Solución**:
1. Ve a Vercel Settings → Environment Variables
2. Asegúrate que `VITE_VERCEL_ENV=development` tenga scope **Preview**
3. Re-deploy el preview branch

### Problema: Build falla

**Solución**:
1. Verifica que `pnpm run build:prod` funcione localmente
2. Revisa los logs de build en Vercel
3. Confirma que todas las dependencias estén en `package.json`

---

## 📊 Checklist de Deploy

Antes de cada deploy a producción:

- [ ] Tests locales pasan
- [ ] `pnpm run build:prod` funciona sin errores
- [ ] Login funciona en preview
- [ ] Variables de entorno configuradas en Vercel
- [ ] Edge Functions desplegadas en Supabase
- [ ] Tablas KV Store creadas en ambiente correspondiente
- [ ] Commits pusheados a `main` branch

---

## 🚀 ¡Listo para Deploy!

```bash
# 1. Commit tus cambios
git add .
git commit -m "feat: preparar para deploy en vercel"

# 2. Push a main (producción) o development (preview)
git push origin main

# 3. Vercel desplegará automáticamente
# Monitorea en: https://vercel.com/dashboard
```
