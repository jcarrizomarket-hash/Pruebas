-- ============================================
-- CREAR USUARIO ADMINISTRADOR EN PRODUCCIÓN
-- ============================================

-- Este script crea un usuario administrador para probar el login

-- IMPORTANTE: Ejecutar en SQL Editor de Supabase PRODUCCIÓN
-- https://app.supabase.com/project/bvnbwqsvldsfdfzifcp

-- Usuario: admin@camareros.app
-- Password: admin123 (CAMBIAR DESPUÉS DEL PRIMER LOGIN)

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
  'Administrador',
  'admin@camareros.app',
  'admin123',  -- ⚠️ IMPORTANTE: Cambiar después del primer login
  'admin',
  NULL,
  NOW(),
  NOW()
);

-- Verificar que se creó correctamente
SELECT id, nombre, email, rol, created_at
FROM usuarios
WHERE email = 'admin@camareros.app';

-- Ver todos los usuarios
SELECT id, nombre, email, rol, created_at
FROM usuarios
ORDER BY created_at DESC;
