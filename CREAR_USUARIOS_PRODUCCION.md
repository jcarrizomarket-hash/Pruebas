# 👤 Crear Usuarios en Producción

## 📊 Estado Actual

```
❌ No hay usuarios en la base de datos de desarrollo
```

La exportación mostró que **no hay usuarios en la tabla `usuarios` de desarrollo**.

---

## 🎯 Soluciones

Tienes 2 opciones para crear usuarios en producción:

### Opción 1: Crear Usuario Administrador Directamente (Recomendado)

**Script SQL listo para usar:** `crear_usuario_admin.sql`

#### Pasos:

1. **Ir a Supabase Dashboard de PRODUCCIÓN:**
   ```
   https://app.supabase.com/project/bvnbwqsvldsfdfzifcp
   ```

2. **Abrir SQL Editor:**
   - Menú lateral → **SQL Editor**

3. **Copiar el contenido del archivo:**
   ```
   crear_usuario_admin.sql
   ```

4. **Pegar en el SQL Editor**

5. **Hacer clic en Run (▶️)**

6. **Verificar que se creó el usuario**

#### Usuario Creado:

```
Email:    admin@camareros.app
Password: admin123
Rol:      admin
```

⚠️ **IMPORTANTE:** Cambia la contraseña después del primer login.

---

### Opción 2: Crear Usuarios en Desarrollo Primero

Si prefieres tener usuarios en desarrollo y luego exportarlos:

#### 1. Crear usuario en desarrollo

**Ir a SQL Editor del proyecto de desarrollo:**
```
https://app.supabase.com/project/eubjevjqcpsvpgxmdpvy
```

**Ejecutar:**
```sql
INSERT INTO usuarios (
  id,
  nombre,
  email,
  password_hash,
  rol,
  camarero_codigo,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),
  'Admin Desarrollo',
  'admin@test.com',
  'admin123',
  'admin',
  NULL,
  NOW(),
  NOW()
);
```

#### 2. Exportar usuarios

Ejecutar el script de exportación:
```bash
./export-usuarios-simple.sh
```

#### 3. Importar a producción

El script generará `import_usuarios_produccion.sql` que puedes ejecutar en el SQL Editor de producción.

---

## 🔐 Sistema de Autenticación

### ⚠️ IMPORTANTE: Passwords

Actualmente el sistema guarda passwords **en texto plano** (`password_hash`).

**Para producción REAL, debes:**

1. **Usar bcrypt o similar:**
   ```javascript
   import bcrypt from 'bcrypt';
   const hash = await bcrypt.hash('password123', 10);
   ```

2. **Actualizar el login para verificar:**
   ```javascript
   const valid = await bcrypt.compare(passwordIngresado, user.password_hash);
   ```

### Para Testing (actual):

Puedes usar passwords simples como `'admin123'` directamente.

---

## 📋 Usuarios Recomendados para Testing

```sql
-- Usuario Admin
INSERT INTO usuarios (id, nombre, email, password_hash, rol)
VALUES (
  gen_random_uuid(),
  'Administrador',
  'admin@camareros.app',
  'admin123',
  'admin'
);

-- Usuario Coordinador
INSERT INTO usuarios (id, nombre, email, password_hash, rol)
VALUES (
  gen_random_uuid(),
  'Juan Coordinador',
  'coordinador@test.com',
  'coord123',
  'coordinador'
);

-- Usuario Camarero
INSERT INTO usuarios (id, nombre, email, password_hash, rol, camarero_codigo)
VALUES (
  gen_random_uuid(),
  'María Camarera',
  'camarero@test.com',
  'cam123',
  'camarero',
  'CAM001'
);
```

---

## 🧪 Probar Login

Una vez creado el usuario administrador:

### 1. Build y Deploy

```bash
# Si aún no lo hiciste
git checkout main
pnpm build:prod
```

### 2. Probar Localmente

```bash
# Preview del build
pnpm preview:prod
```

Abre: http://localhost:4173/

### 3. Login

```
Email:    admin@camareros.app
Password: admin123
```

### 4. Verificar

- ✅ Login exitoso
- ✅ Dashboard carga
- ✅ Rol de admin funciona
- ✅ Menús y permisos correctos

---

## 🎯 Recomendación Rápida

**Para probar el login ahora mismo:**

1. Ejecuta el script `crear_usuario_admin.sql` en Supabase producción
2. Haz preview del build: `pnpm preview:prod`
3. Prueba login con: `admin@camareros.app` / `admin123`

---

## 📝 Checklist

- [ ] Ejecutar `crear_usuario_admin.sql` en producción
- [ ] Verificar que el usuario se creó
- [ ] Probar login localmente (preview)
- [ ] Cambiar password después del primer login
- [ ] (Opcional) Crear usuarios adicionales para testing

---

## 🚀 Siguiente Paso

Una vez que confirmes que el login funciona:

1. Deploy a tu plataforma (Vercel/Netlify/etc)
2. Probar login en producción
3. Crear usuarios adicionales según necesites

---

## ⚠️ Seguridad para Producción Real

Antes de usar en producción con datos reales:

- [ ] Implementar bcrypt para passwords
- [ ] Agregar autenticación con JWT
- [ ] Habilitar HTTPS
- [ ] Implementar rate limiting
- [ ] Agregar verificación de email
- [ ] Implementar recuperación de contraseña
- [ ] Habilitar Row Level Security (RLS) en Supabase
