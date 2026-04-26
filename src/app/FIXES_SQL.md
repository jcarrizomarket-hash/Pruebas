# 🔧 SQL FIXES - Resolver Errores 404 y 500

## 📋 Problemas Identificados

### 1. ❌ Error 500 en `/usuarios/:id/estado`
**Causa:** La tabla `usuarios` no tiene la columna `activo`

### 2. ❌ Error 404 en `/login`
**Causa:** Rutas no se encuentran correctamente (posible problema de deploy)

---

## ✅ SOLUCIÓN 1: Agregar Columna `activo` a Usuarios

### Ejecutar en Supabase SQL Editor:

```sql
-- Agregar columna 'activo' a la tabla usuarios
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;

-- Actualizar usuarios existentes para que estén activos por defecto
UPDATE usuarios 
SET activo = true 
WHERE activo IS NULL;

-- Verificar que la columna se agregó correctamente
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'usuarios'
ORDER BY ordinal_position;
```

### Después de ejecutar el SQL:

1. **Descomentar la ruta en el servidor:**
   - Archivo: `/supabase/functions/server/index.tsx`
   - Buscar: `app.put('/usuarios/:id/estado'`
   - Quitar el bloque de comentarios `/* ... */`

2. **Descomentar la función en el frontend:**
   - Archivo: `/components/password-control-panel.tsx`
   - Buscar: `const toggleEstadoUsuario`
   - Quitar el código comentado y el mensaje temporal

3. **Hacer redeploy del Edge Function:**
   ```bash
   # En la terminal de Supabase o haciendo push a Git
   # Las Edge Functions se redesplegan automáticamente
   ```

---

## ✅ SOLUCIÓN 2: Verificar Despliegue del Servidor

### Verificar qué servidor está activo:

```bash
# En Supabase Dashboard:
# Settings → Edge Functions → make-server-ce05fe95 → Logs
```

### Verificar que las rutas responden:

```bash
# Test endpoint básico
curl https://eubjevjqcpsvpgxmdpvy.supabase.co/functions/v1/make-server-ce05fe95/test

# Test login endpoint (debería dar 404 o error de body, no 404 de ruta)
curl -X POST https://eubjevjqcpsvpgxmdpvy.supabase.co/functions/v1/make-server-ce05fe95/login \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}'
```

---

## ✅ SOLUCIÓN 3: Schema Completo Actualizado

### Tabla `usuarios` con todas las columnas:

```sql
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  rol VARCHAR NOT NULL CHECK (rol IN ('admin', 'coordinador', 'perfil')),
  camarero_codigo VARCHAR,
  activo BOOLEAN DEFAULT true, -- ✅ NUEVA COLUMNA
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índice en email para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_usuarios_updated_at
  BEFORE UPDATE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 🧪 TESTING POST-FIX

### 1. Verificar columna agregada:

```sql
SELECT * FROM usuarios LIMIT 5;
```

Debería mostrar la columna `activo` con valor `true` para todos.

### 2. Test de actualización de estado:

```sql
-- Marcar usuario como inactivo
UPDATE usuarios 
SET activo = false 
WHERE email = 'test@example.com';

-- Verificar
SELECT email, activo FROM usuarios WHERE email = 'test@example.com';
```

### 3. Test desde la app:

1. Ir a **⚙️ Configuración** → **Contraseñas y Usuarios**
2. Click en botón **"Activo"** de un usuario
3. Debería cambiar a **"Inactivo"**
4. No debería mostrar error 500

---

## 📝 CHECKLIST DE VERIFICACIÓN

- [ ] Ejecutar SQL para agregar columna `activo`
- [ ] Verificar que la columna existe en la tabla
- [ ] Descomentar ruta en `/supabase/functions/server/index.tsx`
- [ ] Descomentar función en `/components/password-control-panel.tsx`
- [ ] Hacer redeploy del Edge Function (automático o manual)
- [ ] Probar toggle de estado desde la UI
- [ ] Verificar que no hay errores 500 en consola
- [ ] Verificar que la tabla muestra correctamente el estado

---

## 🚀 DEPLOY

### Opción 1: Automático (Recomendado)

Si tienes el proyecto conectado a Git:
1. Commit y push de los cambios
2. Supabase redespliegara automáticamente

### Opción 2: Manual

1. Ve a Supabase Dashboard
2. Edge Functions → make-server-ce05fe95
3. Click en **"Deploy"** o **"Redeploy"**

---

## 📞 Si Persisten los Errores 404

### Verificar basePath:

```typescript
// En /supabase/functions/server/index.tsx línea 8:
const app = new Hono().basePath('/make-server-ce05fe95');
```

### Verificar que el servidor se inicia:

```typescript
// Al final del archivo index.tsx:
Deno.serve(app.fetch);
```

### Ver logs en tiempo real:

```bash
# Supabase Dashboard → Edge Functions → Logs
# Deberías ver:
# "Servidor funcionando correctamente"
# "Login exitoso: email@ejemplo.com"
```

---

## ✅ RESULTADO ESPERADO

Después de aplicar estos fixes:

- ✅ No más error 500 en `/usuarios/:id/estado`
- ✅ No más error 404 en `/login`
- ✅ Toggle de usuarios funciona correctamente
- ✅ Sistema de autenticación operativo
- ✅ Panel de control de usuarios 100% funcional

---

## 📚 Documentación Relacionada

- [MIGRACION_SQL.md](./MIGRACION_SQL.md) - Migración completa a SQL
- [PROGRESO_MIGRACION.md](./PROGRESO_MIGRACION.md) - Estado de migración
- [ARQUITECTURA.md](./ARQUITECTURA.md) - Arquitectura del sistema

---

**Fecha:** 11 de Marzo, 2026  
**Estado:** Pendiente de ejecución SQL
