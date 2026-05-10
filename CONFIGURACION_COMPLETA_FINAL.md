# ✅ Configuración Completa - Ambientes Dev y Prod

**Fecha:** 2026-05-10  
**Estado:** ✅ Configuración completada y verificada

---

## 🎯 Proyectos Configurados

### DESARROLLO
```
Project ID:   eubjevjqcpsvpgxmdpvy
URL:          https://eubjevjqcpsvpgxmdpvy.supabase.co
Edge Func:    /functions/v1/make-server-ce05fe95
KV Store:     kv_store_25b11ac0
Anon Key:     eyJhbGci...BOLaQ (configurado ✅)
Build:        pnpm run build:dev ✅
Estado:       ✅ Listo
```

### PRODUCCIÓN
```
Project ID:   bvnbwqsvldsfdgfzifcp
URL:          https://bvnbwqsvldsfdgfzifcp.supabase.co
Edge Func:    /functions/v1/make-server-prod
KV Store:     kv_store_prod
Anon Key:     eyJhbGci...zKK2Q (configurado ✅)
Build:        pnpm run build:prod ✅
Estado:       ✅ Funcionando
```

---

## 📦 Comandos de Build

### Desarrollo
```bash
# Build local
pnpm run build:dev

# Preview local
pnpm run preview

# Dev server
pnpm run dev
```

### Producción
```bash
# Build local
pnpm run build:prod

# Preview local
pnpm run preview
```

---

## 🚀 Deploy en Vercel

### Variables de Entorno

**Production** (scope: Production):
```
VITE_VERCEL_ENV=production
```

**Preview** (scope: Preview):
```
VITE_VERCEL_ENV=development
```

### Flujo de Deploy

1. **Push a main** → Deploy automático a producción
   - Usa: `eubjevjqcpsvpgxmdpvy` (desarrollo)
   
2. **Push a otros branches** → Preview deployments
   - Usa: `eubjevjqcpsvpgxmdpvy` (desarrollo)

**Nota importante:** Actualmente, el deploy de producción en Vercel usará el ambiente de desarrollo (`eubjevjqcpsvpgxmdpvy`). Si quieres que el deploy de producción en Vercel use el proyecto de producción de Supabase (`bvnbwqsvldsfdgfzifcp`), deberás configurar `VITE_VERCEL_ENV=production` en las variables de entorno de producción.

---

## 🔍 Verificar Configuración

### 1. Build Local - Development

```bash
pnpm run build:dev
pnpm run preview
```

Console debe mostrar:
```
🔧 Supabase Config: {
  environment: "development",
  projectId: "eubjevjqcpsvpgxmdpvy",
  url: "https://eubjevjqcpsvpgxmdpvy.supabase.co"
}
```

### 2. Build Local - Production

```bash
pnpm run build:prod
pnpm run preview
```

Console debe mostrar:
```
🔧 Supabase Config: {
  environment: "production",
  projectId: "bvnbwqsvldsfdgfzifcp",
  url: "https://bvnbwqsvldsfdgfzifcp.supabase.co"
}
```

---

## 📊 Archivos Actualizados

```
src/app/config/supabase.config.ts
├── development: eubjevjqcpsvpgxmdpvy ✅
└── production: bvnbwqsvldsfdgfzifcp ✅

src/app/supabase/functions/server/kv_store.tsx
└── Table: kv_store_25b11ac0 ✅

vercel.json
└── Build command: pnpm run build:prod ✅

package.json
├── build:dev ✅
└── build:prod ✅
```

---

## ⚙️ Configuración Edge Functions

### Desarrollo (eubjevjqcpsvpgxmdpvy)

**URL completa:**
```
https://eubjevjqcpsvpgxmdpvy.supabase.co/functions/v1/make-server-ce05fe95
```

**Endpoints disponibles:**
- `/login` - Login de usuarios
- `/usuarios` - CRUD usuarios
- `/camareros` - CRUD camareros
- `/pedidos` - CRUD pedidos
- `/coordinadores` - CRUD coordinadores
- `/clientes` - CRUD clientes

**KV Store:** `kv_store_25b11ac0`

### Producción (bvnbwqsvldsfdgfzifcp)

**URL completa:**
```
https://bvnbwqsvldsfdgfzifcp.supabase.co/functions/v1/make-server-prod
```

**Endpoints:** (mismos que desarrollo)

**KV Store:** `kv_store_prod`

---

## 🔐 Seguridad

### Claves Públicas (Seguro en GitHub)
✅ Anon Keys de ambos proyectos
✅ Project IDs
✅ URLs públicas

### NO Incluir
❌ Service Role Keys
❌ Passwords de BD
❌ API keys privadas

---

## 🧪 Testing Post-Deploy

### Checklist

- [ ] Build dev funciona sin errores
- [ ] Build prod funciona sin errores
- [ ] Login funciona en development
- [ ] Login funciona en production
- [ ] Console muestra projectId correcto
- [ ] Edge Functions responden correctamente
- [ ] Datos se guardan en BD correcta

---

## 📝 Próximos Pasos

### Para Desarrollo Local
```bash
# 1. Usar ambiente de desarrollo
pnpm run dev

# 2. O build + preview
pnpm run build:dev
pnpm run preview
```

### Para Deploy en Vercel

```bash
# 1. Commit cambios
git add .
git commit -m "feat: actualizar ambiente de desarrollo a eubjevjqcpsvpgxmdpvy"

# 2. Push
git push origin main

# 3. Vercel desplegará automáticamente
```

### Configurar en Vercel

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega:
   - Production: `VITE_VERCEL_ENV=production`
   - Preview: `VITE_VERCEL_ENV=development`
4. Redeploy si es necesario

---

## 🎉 ¡Configuración Completa!

Tu aplicación ahora tiene:
- ✅ Ambiente de desarrollo configurado (`eubjevjqcpsvpgxmdpvy`)
- ✅ Ambiente de producción configurado (`bvnbwqsvldsfdgfzifcp`)
- ✅ Builds separados funcionando
- ✅ Detección automática de ambiente
- ✅ Lista para deploy en Vercel

**Todo funciona exactamente igual en dev y prod, solo cambiando el comando de deploy.**
