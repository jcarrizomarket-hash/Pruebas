# 🔐 Probar Login en Producción

## ✅ Estado Actual

```
✅ Usuarios importados en producción (5 usuarios)
✅ Build de producción generado
✅ Preview server iniciado
```

---

## 🌐 Acceder a la Aplicación

### Servidor de Preview Iniciado

**URL:** http://localhost:4173/

**Configuración:**
- Ambiente: production
- Proyecto Supabase: bvnbwqsvldsfdfzifcp
- Base de datos: Con 5 usuarios importados

---

## 🔑 Credenciales para Probar

Usa alguno de los 5 usuarios que importaste desde desarrollo.

### Usuarios Típicos del Sistema:

**Admin (si existe):**
```
Email:    admin@ejemplo.com
Password: (el que configuraste en desarrollo)
```

**Coordinador (si existe):**
```
Email:    coordinador@ejemplo.com
Password: (el que configuraste en desarrollo)
```

**Camarero (si existe):**
```
Email:    camarero@ejemplo.com
Password: (el que configuraste en desarrollo)
```

**Nota:** Las credenciales exactas dependen de los usuarios que hayas creado en desarrollo.

---

## ✅ Checklist de Verificación

### 1. Acceso a la Aplicación
- [ ] Abrir http://localhost:4173/
- [ ] La aplicación carga correctamente
- [ ] No hay errores 404 o de consola
- [ ] Aparece la pantalla de login

### 2. Login Funciona
- [ ] Ingresar email y password
- [ ] El login es exitoso
- [ ] Redirecciona al dashboard
- [ ] No hay errores en consola (F12)

### 3. Conexión con Supabase Producción
- [ ] Dashboard carga datos
- [ ] Se ven coordinadores (si hay)
- [ ] Se ven camareros (si hay)
- [ ] Se ven clientes (si hay)
- [ ] Se ven pedidos/eventos (si hay)

### 4. Funcionalidad Básica
- [ ] Menú de navegación funciona
- [ ] Puedes navegar entre secciones
- [ ] Los permisos según rol funcionan
- [ ] Puedes hacer logout

### 5. Operaciones CRUD (Opcional)
- [ ] Crear un nuevo registro (ej: cliente)
- [ ] Editar registro existente
- [ ] Eliminar registro
- [ ] Códigos correlativos se generan

---

## 🐛 Troubleshooting

### Error: "Cannot connect to Supabase"

**Verificar:**
1. Variables en `.env.production` son correctas
2. Build usó las variables correctas: `pnpm build:prod`
3. Proyecto Supabase de producción está activo

**Solución:**
```bash
# Verificar .env.production
cat .env.production | grep SUPABASE

# Rebuild si es necesario
pnpm build:prod
pnpm preview:prod
```

### Login Falla - "Usuario no encontrado"

**Verificar:**
1. Los usuarios están en la tabla de producción:
   - https://supabase.com/dashboard/project/bvnbwqsvldsfdgfzifcp/editor/17697

2. El email y password son correctos

**Verificar en SQL Editor:**
```sql
SELECT id, nombre, email, rol 
FROM usuarios 
ORDER BY created_at;
```

### Login Falla - "Password incorrecto"

**Nota:** El sistema actual guarda passwords en texto plano.

Verifica que el `password_hash` en la base de datos coincide con lo que estás ingresando.

```sql
-- Ver password del usuario
SELECT email, password_hash 
FROM usuarios 
WHERE email = 'tu-email@ejemplo.com';
```

### Consola del Navegador Muestra Errores

**Abrir consola:** Presiona F12 → Console

**Errores comunes:**
- `401 Unauthorized` → Credenciales de Supabase incorrectas
- `404 Not Found` → Tabla no existe o mal configurada
- `Network Error` → Problema de conexión

---

## 📊 Verificar Variables de Entorno

### En la Consola del Navegador (F12):

```javascript
// Verificar Project ID
console.log(import.meta.env.VITE_SUPABASE_PROJECT_ID);
// Debería mostrar: bvnbwqsvldsfdfzifcp

// Verificar URL
console.log(import.meta.env.VITE_SUPABASE_URL);
// Debería mostrar: https://bvnbwqsvldsfdfzifcp.supabase.co
```

---

## 🔄 Si Necesitas Rebuild

Si cambiaste algo en `.env.production`:

```bash
# 1. Detener preview (Ctrl+C)

# 2. Rebuild
pnpm build:prod

# 3. Reiniciar preview
pnpm preview:prod
```

---

## 🎯 Objetivo del Test

**Verificar que:**
1. ✅ El build de producción funciona
2. ✅ Se conecta al Supabase de producción
3. ✅ El login autentica correctamente
4. ✅ Los usuarios importados funcionan
5. ✅ La aplicación está lista para deploy

---

## 🚀 Después del Test Exitoso

Si todo funciona correctamente:

### Opción A: Deploy a Vercel
```bash
npm install -g vercel
vercel --prod
```

### Opción B: Deploy a Netlify
1. Ir a: https://app.netlify.com
2. "Add new site" → "Deploy manually"
3. Arrastrar carpeta `dist/`

### Opción C: Deploy a Cloudflare Pages
1. Ir a: https://pages.cloudflare.com
2. Conectar repositorio
3. Configurar build: `pnpm build:prod`
4. Output: `dist`

---

## 📝 Reporte del Test

Una vez completado el test, documenta:

```
✅ Login funciona: [Sí/No]
✅ Dashboard carga: [Sí/No]
✅ Datos se muestran: [Sí/No]
✅ CRUD funciona: [Sí/No]

Problemas encontrados:
- [Ninguno / Describir]

Usuarios probados:
- Email: ___________
- Rol: ___________
- Resultado: [OK / Error]
```

---

## 🎉 Éxito

Si el login funciona correctamente, significa que:
- ✅ Configuración de producción es correcta
- ✅ Usuarios se importaron bien
- ✅ Build está optimizado y funcional
- ✅ Listo para deploy real

---

## 📞 Siguiente Paso

Una vez verificado el login:
1. Hacer commit de cualquier cambio
2. Elegir plataforma de deploy
3. Deployar a producción
4. Probar en el dominio real

---

## 🔐 Seguridad Post-Deploy

Después del primer deploy:
- [ ] Cambiar passwords de usuarios
- [ ] Implementar bcrypt para passwords
- [ ] Configurar HTTPS (automático en Vercel/Netlify)
- [ ] Habilitar Row Level Security en Supabase
- [ ] Implementar rate limiting
- [ ] Agregar autenticación con JWT
