# 🗄️ Crear Schema en Producción

## ⚠️ Problema Detectado

El proyecto `gkfpsyclglyradzeyuwz` **NO tiene la tabla `usuarios`** creada.

**Error actual:**
```
Could not find the table 'public.usuarios'
Hint: Perhaps you meant the table 'public.camareros'
```

Esto significa que el schema completo NO está en producción.

---

## ✅ Solución: Ejecutar el Schema SQL

### Paso 1: Abrir SQL Editor de Producción

```
https://supabase.com/dashboard/project/gkfpsyclglyradzeyuwz/sql/new
```

### Paso 2: Copiar el Schema Completo

Abre el archivo en tu proyecto local:

```
src/app/supabase/migrations/00_schema_completo.sql
```

O cópialo desde aquí: [Ver contenido completo abajo]

### Paso 3: Pegar en SQL Editor

1. Selecciona TODO el contenido del archivo
2. Pega en el SQL Editor de Supabase
3. Click en **"Run"** (▶️)

### Paso 4: Verificar

Después de ejecutar, verifica que las tablas se crearon:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Deberías ver:
```
camareros
chats
clientes
confirmaciones
coordinadores
pedidos
```

### Paso 5: Crear Usuario Admin

Una vez que el schema esté creado, ejecuta:

```sql
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

## 🚀 Acceso Rápido

**SQL Editor (Producción):**
```
https://supabase.com/dashboard/project/gkfpsyclglyradzeyuwz/sql/new
```

**Table Editor (Verificar tablas):**
```
https://supabase.com/dashboard/project/gkfpsyclglyradzeyuwz/editor
```

---

## 📋 Alternativa: Usar el Archivo Local

Si tienes acceso al archivo local, el contenido completo está en:

```
/workspaces/default/code/src/app/supabase/migrations/00_schema_completo.sql
```

Este archivo contiene:
- ✅ Tabla `coordinadores`
- ✅ Tabla `camareros`
- ✅ Tabla `clientes`
- ✅ Tabla `pedidos`
- ✅ Tabla `asignaciones`
- ✅ Tabla `alertas`
- ✅ Tabla `registros_asistencia`
- ✅ Tabla `confirmaciones`
- ✅ Tabla `chats`
- ✅ Tabla `usuarios` ← La que falta!

---

## ⚠️ Importante

**DESPUÉS** de crear el schema:

1. Refresh la app: `http://localhost:4173/`
2. Intenta login o click en "🚀 Crear Usuario Admin"
3. Debería funcionar correctamente

---

## 🎯 Checklist

- [ ] Abrir SQL Editor de producción
- [ ] Copiar contenido de `00_schema_completo.sql`
- [ ] Pegar y ejecutar en SQL Editor
- [ ] Verificar que se crearon todas las tablas
- [ ] Crear usuario admin (SQL o desde la app)
- [ ] Probar login

---

## 💡 Nota

Si no tienes acceso al archivo local `00_schema_completo.sql`, déjame saber y te genero el script SQL completo aquí para que lo copies.
