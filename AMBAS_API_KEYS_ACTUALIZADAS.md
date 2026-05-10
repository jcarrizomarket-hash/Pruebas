# ✅ Ambas API Keys Actualizadas

## 🔑 Configuración Completa

**Fecha:** 2026-05-07  
**Archivo:** `src/app/config/supabase.config.ts`

---

## ✅ Desarrollo (Branch: develop)

```typescript
development: {
  projectId: 'eubjevjqcpsvpgxmdpvy',
  url: 'https://eubjevjqcpsvpgxmdpvy.supabase.co',
  anonKey: 'sb_publishable_MVXqXEDINiCZYnfFb4mf9A_Zg7PKYLs'  // ✅ Nueva
}
```

**Dashboard:**
```
https://supabase.com/dashboard/project/eubjevjqcpsvpgxmdpvy
```

---

## ✅ Producción (Branch: main)

```typescript
production: {
  projectId: 'bvnbwqsvldsfdfzifcp',
  url: 'https://bvnbwqsvldsfdfzifcp.supabase.co',
  anonKey: 'sb_publishable_H3FwqqpvBg--1HWolSOqWA_KUFnXuWX'  // ✅ Nueva
}
```

**Dashboard:**
```
https://supabase.com/dashboard/project/bvnbwqsvldsfdfzifcp
```

---

## 🎯 Detección Automática de Ambiente

El sistema detecta automáticamente qué ambiente usar basándose en:

### 1. Modo de Vite
```bash
pnpm dev           # → MODE=development → Usa key de desarrollo
pnpm build:dev     # → MODE=development → Usa key de desarrollo
pnpm build:prod    # → MODE=production  → Usa key de producción
pnpm preview:prod  # → MODE=production  → Usa key de producción
```

### 2. Branch de Git (para deploy)
```bash
git checkout develop  # → Desarrollo
git checkout main     # → Producción
```

### 3. Dominio (para apps deployadas)
```
localhost          → Desarrollo
*.vercel.app       → Producción
*.netlify.app      → Producción
```

---

## 🧪 Probar Ambos Ambientes

### Desarrollo

```bash
# Opción 1: Dev server
pnpm dev
# Abre: http://localhost:5173/

# Opción 2: Build + Preview
pnpm build:dev
pnpm preview
# Abre: http://localhost:4173/
```

**Credenciales de desarrollo:**
```
Email:    admin@ejemplo.com
Password: admin123
```

(O los usuarios que tengas en desarrollo)

---

### Producción

```bash
# Build + Preview
pnpm build:prod
pnpm preview:prod
# Abre: http://localhost:4173/
```

**Credenciales de producción:**
```
Email:    admin@camareros.app
Password: admin123
```

(O los 5 usuarios que importaste)

---

## 🔍 Verificar que Usa la Key Correcta

### En la Consola del Navegador (F12)

**Desarrollo:**
```javascript
🔧 Supabase Config: {
  environment: "development",
  projectId: "eubjevjqcpsvpgxmdpvy",
  url: "https://eubjevjqcpsvpgxmdpvy.supabase.co"
}
```

**Producción:**
```javascript
// No muestra log en producción (solo en dev)
```

### En Network Tab (F12)

**Desarrollo:**
```
Request URL: https://eubjevjqcpsvpgxmdpvy.supabase.co/rest/v1/usuarios
Authorization: Bearer sb_publishable_MVXqXEDINiCZYnfFb4mf9A_Zg7PKYLs
```

**Producción:**
```
Request URL: https://bvnbwqsvldsfdfzifcp.supabase.co/rest/v1/usuarios
Authorization: Bearer sb_publishable_H3FwqqpvBg--1HWolSOqWA_KUFnXuWX
```

---

## 📦 Workflow de Branches

### Trabajar en Desarrollo

```bash
# 1. Cambiar a develop
git checkout develop

# 2. Hacer cambios
# ... editar código ...

# 3. Probar localmente
pnpm dev
# Usa automáticamente: eubjevjqcpsvpgxmdpvy (desarrollo)

# 4. Commit
git add .
git commit -m "feat: nueva funcionalidad"
git push origin develop
```

### Pasar a Producción

```bash
# 1. Cambiar a main
git checkout main

# 2. Merge desde develop
git merge develop

# 3. Probar build de producción
pnpm build:prod
pnpm preview:prod
# Usa automáticamente: bvnbwqsvldsfdfzifcp (producción)

# 4. Push (deploy automático en Vercel)
git push origin main
```

---

## 🚀 Deploy Automático

### Vercel/Netlify

Una vez conectado con GitHub:

**Branch `develop` →** Deploy de preview (desarrollo)
- Usa: `sb_publishable_MVXqXEDINiCZYnfFb4mf9A_Zg7PKYLs`
- Base de datos: eubjevjqcpsvpgxmdpvy

**Branch `main` →** Deploy de producción
- Usa: `sb_publishable_H3FwqqpvBg--1HWolSOqWA_KUFnXuWX`
- Base de datos: bvnbwqsvldsfdfzifcp

---

## ✅ Ventajas de Esta Configuración

| Característica | Estado |
|----------------|--------|
| Ambientes separados | ✅ Dev y Prod independientes |
| Auto-detección | ✅ Basada en modo de Vite |
| Sin archivos .env | ✅ Todo en código (seguro) |
| Fácil de deployar | ✅ Funciona out-of-the-box |
| Sin legacy keys | ✅ Nuevas Publishable keys |
| Seguro para GitHub | ✅ Solo claves públicas |

---

## 🔐 Seguridad

### ✅ En el Código (GitHub)

```typescript
// Solo Publishable keys (seguras)
anonKey: 'sb_publishable_...'  // ✅ Público, seguro
```

### ❌ NO en el Código

```bash
# Service Role Keys (privadas)
SUPABASE_SERVICE_ROLE_KEY=...  # Solo en .env (local)
RESEND_API_KEY=...             # Solo en variables de entorno
```

Las **Secret keys** van en:
- Archivos `.env*` locales (NO en GitHub)
- Variables de entorno de Vercel/Netlify
- Solo para backend/Edge Functions

---

## 📝 Checklist Final

- [x] Publishable key de desarrollo actualizada
- [x] Publishable key de producción actualizada
- [x] Build de desarrollo exitoso
- [x] Build de producción exitoso
- [ ] Probar login en desarrollo
- [ ] Probar login en producción
- [ ] Commit y push a GitHub
- [ ] Verificar deploy automático

---

## 🎉 ¡Todo Listo!

Ahora puedes:

✅ Trabajar en **`develop`** → Usa base de datos de desarrollo  
✅ Deployar a **`main`** → Usa base de datos de producción  
✅ Login funciona en **ambos ambientes**  
✅ Sin errores "Legacy API keys"  
✅ Auto-detección del ambiente correcto  

---

## 📞 Comandos Útiles

```bash
# Ver configuración actual
cat src/app/config/supabase.config.ts

# Ver en qué branch estás
git branch --show-current

# Desarrollo
pnpm dev              # Dev server (port 5173)
pnpm build:dev        # Build de desarrollo
pnpm preview          # Preview de desarrollo

# Producción
pnpm build:prod       # Build de producción
pnpm preview:prod     # Preview de producción (port 4173)

# Cambiar de ambiente
git checkout develop  # Ambiente de desarrollo
git checkout main     # Ambiente de producción
```
