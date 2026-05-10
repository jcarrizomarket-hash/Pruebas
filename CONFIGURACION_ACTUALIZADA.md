# ✅ Configuración Actualizada - Nuevo Ambiente de Desarrollo

**Fecha:** 2026-05-10

---

## 🎯 Proyectos Actuales

### DESARROLLO (NUEVO)
```
Project ID: eubjevjqcpsvpgxmdpvy
URL: https://eubjevjqcpsvpgxmdpvy.supabase.co
Edge Functions: make-server-ce05fe95
KV Store Table: kv_store_25b11ac0
Anon Key: [PENDIENTE - Proporcionar]
```

### PRODUCCIÓN
```
Project ID: bvnbwqsvldsfdgfzifcp
URL: https://bvnbwqsvldsfdgfzifcp.supabase.co
Edge Functions: make-server-prod
KV Store Table: kv_store_prod
Anon Key: ✅ Configurado
Estado: ✅ Funcionando
```

---

## 📝 Cambios Realizados

### 1. Configuración de Supabase
**Archivo:** `src/app/config/supabase.config.ts`

```typescript
development: {
  projectId: 'eubjevjqcpsvpgxmdpvy',  // ← NUEVO
  url: 'https://eubjevjqcpsvpgxmdpvy.supabase.co',
  anonKey: 'PENDIENTE_ANON_KEY'  // ← REQUIERE ACTUALIZACIÓN
}
```

### 2. KV Store
**Archivo:** `src/app/supabase/functions/server/kv_store.tsx`

- Tabla actualizada: `kv_store_25b11ac0` (antes: `kv_store_ce05fe95`)
- Todas las funciones (set, get, del, mset, mget, mdel, getByPrefix) actualizadas

### 3. Edge Functions URL
**Archivo:** `src/app/App.tsx` (líneas 40-42)

```typescript
const baseUrl = projectId === 'bvnbwqsvldsfdgfzifcp'
  ? `https://${projectId}.supabase.co/functions/v1/make-server-prod`
  : `https://${projectId}.supabase.co/functions/v1/make-server-ce05fe95`;
```

Development ahora apunta a: `https://eubjevjqcpsvpgxmdpvy.supabase.co/functions/v1/make-server-ce05fe95`

---

## ⚠️ PASOS PENDIENTES

### 1. Obtener Anon Key del Nuevo Proyecto

**URL:** https://supabase.com/dashboard/project/eubjevjqcpsvpgxmdpvy/settings/api

1. Ve a **Settings → API**
2. Copia el **Project API keys → anon / public**
3. Actualiza `src/app/config/supabase.config.ts`:

```typescript
development: {
  projectId: 'eubjevjqcpsvpgxmdpvy',
  url: 'https://eubjevjqcpsvpgxmdpvy.supabase.co',
  anonKey: 'TU_ANON_KEY_AQUI'  // ← Reemplazar
}
```

### 2. Verificar Tabla KV Store

**URL:** https://supabase.com/dashboard/project/eubjevjqcpsvpgxmdpvy/editor

Confirmar que existe la tabla `kv_store_25b11ac0` con el schema:

```sql
CREATE TABLE kv_store_25b11ac0 (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);
```

Si no existe, créala ejecutando el SQL arriba en el SQL Editor.

### 3. Verificar Edge Functions

**URL:** https://supabase.com/dashboard/project/eubjevjqcpsvpgxmdpvy/functions

Confirmar que existe la función `make-server-ce05fe95` desplegada.

### 4. Migrar Datos (Opcional)

Si necesitas datos del ambiente anterior (`gkfpsyclglyradzeyuwz`), puedes migrarlos:

**Usuarios:**
```sql
-- En SQL Editor del nuevo proyecto (eubjevjqcpsvpgxmdpvy)
-- Ejecutar después de exportar desde el proyecto anterior
```

---

## 🧪 Testing Después de Actualizar

### 1. Build de Desarrollo
```bash
pnpm run build:dev
pnpm run preview
```

### 2. Verificar Console Logs
```
🔧 Supabase Config: {
  environment: "development",
  projectId: "eubjevjqcpsvpgxmdpvy",  // ← Debe ser el nuevo
  url: "https://eubjevjqcpsvpgxmdpvy.supabase.co",
  ...
}
```

### 3. Probar Login
- Usuario de prueba del nuevo ambiente
- Verificar que conecta al proyecto correcto

---

## 📊 Estructura Final

```
DESARROLLO (eubjevjqcpsvpgxmdpvy) ← NUEVO
├── Edge Functions: make-server-ce05fe95
├── Tabla: kv_store_25b11ac0
├── Usuarios: [Por confirmar/migrar]
└── Estado: Pendiente anon key

PRODUCCIÓN (bvnbwqsvldsfdgfzifcp)
├── Edge Functions: make-server-prod ✅
├── Tabla: kv_store_prod ✅
├── Usuarios: 5 usuarios ✅
└── Estado: Funcionando ✅
```

---

## 🔄 Proyecto Anterior (Deprecated)

```
Project ID: gkfpsyclglyradzeyuwz
Estado: Ya no se usa para desarrollo
Razón: Migrado a eubjevjqcpsvpgxmdpvy
```

---

## ✅ Checklist

- [x] Actualizar projectId en supabase.config.ts
- [x] Actualizar KV Store table name
- [x] Actualizar comentarios y URLs
- [ ] **Obtener y agregar anon key** ← SIGUIENTE PASO
- [ ] Verificar tabla kv_store_25b11ac0 existe
- [ ] Verificar Edge Functions desplegadas
- [ ] Test build:dev
- [ ] Test login en development

---

## 🚀 Siguiente Paso

**Proporciona el Anon Key del proyecto `eubjevjqcpsvpgxmdpvy`** para completar la configuración.

Puedes encontrarlo en:
https://supabase.com/dashboard/project/eubjevjqcpsvpgxmdpvy/settings/api
