# ✅ Configuración Final de Producción

## 🔧 Cambios Realizados

**Fecha:** 2026-05-07

### 1. Project ID Corregido

**Antes (incorrecto):**
```
projectId: 'bvnbwqsvldsfdfzifcp'
```

**Ahora (correcto):**
```
projectId: 'gkfpsyclglyradzeyuwz'  ✅
```

### 2. Publishable Key Correcta

```typescript
production: {
  projectId: 'gkfpsyclglyradzeyuwz',
  url: 'https://gkfpsyclglyradzeyuwz.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrZnBzeWNsZ2x5cmFkemV5dXd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3ODI5NTcsImV4cCI6MjA4MDM1ODk1N30.xLocJeCGlckxtGJJ0Q_a4ckTyOGM-6WQW_4aNWcmSsg'
}
```

### 3. Detección de Ambiente Mejorada

Ahora usa `import.meta.env.PROD` que es más confiable que `MODE` para preview builds.

```typescript
// Antes: Solo usaba MODE
if (import.meta.env?.MODE === 'production') { ... }

// Ahora: Usa PROD primero (más confiable)
if (import.meta.env?.PROD !== undefined) {
  return import.meta.env.PROD ? 'production' : 'development';
}
```

### 4. Logs Mejorados

Ahora muestra:
- `environment` - Ambiente detectado
- `projectId` - ID del proyecto
- `mode` - Modo de Vite
- `prod` - Variable PROD de Vite ✅
- `dev` - Variable DEV de Vite

---

## 🧪 Probar Ahora

### Paso 1: Refresh Completo

**Windows/Linux:** `Ctrl + Shift + R`  
**Mac:** `Cmd + Shift + R`

### Paso 2: Ver Console (F12)

Deberías ver:

```javascript
🔧 Supabase Config: {
  environment: "production",  // ✅ Ahora debe decir "production"
  projectId: "gkfpsyclglyradzeyuwz",  // ✅ ID correcto
  url: "https://gkfpsyclglyradzeyuwz.supabase.co",
  mode: "production",
  prod: true,  // ✅ Debe ser true
  dev: false,
  ...
}

🔑 Supabase Client Init: {
  url: "https://gkfpsyclglyradzeyuwz.supabase.co",  // ✅ URL correcta
  keyPrefix: "eyJhbGciOiJIUzI1NiI..."  // ✅ Key correcta
}
```

### Paso 3: Intentar Login

```
Email:    admin@camareros.app
Password: admin123
```

O usa el botón **"🚀 Crear Usuario Admin"** si no tienes usuarios en este proyecto.

---

## ✅ Verificación

### ✅ Correcto

```
environment: "production"
projectId: "gkfpsyclglyradzeyuwz"
prod: true
dev: false
```

### ❌ Si Aún Está Mal

Si sigue mostrando `development` o el project ID antiguo:

1. **Limpiar caché del navegador:**
   - DevTools (F12) → Application → Clear site data
   
2. **Rebuild completo:**
   ```bash
   rm -rf dist/
   pnpm build:prod
   pnpm preview:prod
   ```

3. **Probar en ventana incógnito/privada**

---

## 📊 Configuración Completa

### Desarrollo
```typescript
development: {
  projectId: 'eubjevjqcpsvpgxmdpvy',
  url: 'https://eubjevjqcpsvpgxmdpvy.supabase.co',
  anonKey: 'sb_publishable_MVXqXEDINiCZYnfFb4mf9A_Zg7PKYLs'
}
```

**Dashboard:**
```
https://supabase.com/dashboard/project/eubjevjqcpsvpgxmdpvy
```

### Producción
```typescript
production: {
  projectId: 'gkfpsyclglyradzeyuwz',
  url: 'https://gkfpsyclglyradzeyuwz.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
}
```

**Dashboard:**
```
https://supabase.com/dashboard/project/gkfpsyclglyradzeyuwz
```

---

## 🎯 Detección Automática

| Script | Ambiente | Project ID |
|--------|----------|------------|
| `pnpm dev` | development | eubjevjqcpsvpgxmdpvy |
| `pnpm build:dev` | development | eubjevjqcpsvpgxmdpvy |
| `pnpm build:prod` | production | gkfpsyclglyradzeyuwz |
| `pnpm preview:prod` | production | gkfpsyclglyradzeyuwz |

---

## 🔐 Usuarios en Producción

Si el proyecto `gkfpsyclglyradzeyuwz` no tiene usuarios:

### Opción 1: Crear Admin desde la App

Click en el botón **"🚀 Crear Usuario Admin"** en la pantalla de login.

### Opción 2: SQL en Dashboard

```sql
-- Dashboard de producción
-- https://supabase.com/dashboard/project/gkfpsyclglyradzeyuwz/editor

INSERT INTO usuarios (
  id,
  nombre,
  email,
  password_hash,
  rol,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),
  'Administrador',
  'admin@camareros.app',
  'admin123',
  'admin',
  NOW(),
  NOW()
);
```

---

## ⚠️ Importante

### Los Proyectos Son Diferentes

Ahora tienes **3 proyectos** configurados:

1. **Desarrollo:** `eubjevjqcpsvpgxmdpvy`
2. **Producción ANTIGUO:** `bvnbwqsvldsfdfzifcp` (ya no se usa)
3. **Producción CORRECTO:** `gkfpsyclglyradzeyuwz` ✅

El proyecto correcto de producción es **gkfpsyclglyradzeyuwz**.

Si tienes datos/usuarios en `bvnbwqsvldsfdfzifcp`, necesitarás:
- Exportarlos desde ese proyecto
- Importarlos a `gkfpsyclglyradzeyuwz`

O trabajar directamente con `gkfpsyclglyradzeyuwz`.

---

## 📝 Próximos Pasos

1. ✅ Verificar que detecta `production`
2. ✅ Probar login
3. ✅ Si no hay usuarios, crear admin
4. ✅ Verificar que conecta a la BD correcta
5. ✅ Commit y push a GitHub
6. ✅ Deploy a Vercel/Netlify

---

## 🎉 ¡Listo!

Con esta configuración, el login debería funcionar correctamente conectándose a:

✅ **Producción:** `gkfpsyclglyradzeyuwz.supabase.co`  
✅ Con la Publishable key correcta  
✅ Detectando automáticamente el ambiente  

**Preview server corriendo en:** `http://localhost:4173/`
