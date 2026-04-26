# Sistema de Usuarios y Roles - Gestión de Perfiles

## 🎯 Resumen Ejecutivo

Se ha implementado un sistema completo de autenticación y gestión de usuarios con 3 roles diferentes y control de acceso granular.

## 📋 Funcionalidades Implementadas

### 1. Sistema de Roles

#### **Admin** 👑
- **Acceso completo** a todas las secciones
- Puede ver: Dashboard, Pedidos, Personal, Admin, Informes, Envíos y **Configuración**
- Puede gestionar usuarios y contraseñas
- Puede enviar emails de restablecimiento de contraseña
- Puede activar/desactivar usuarios

#### **Coordinador** 👔
- **Acceso operativo** limitado
- Puede ver: Dashboard, Pedidos, Personal, Admin, Informes y Envíos
- **NO puede acceder a Configuración**
- No puede gestionar usuarios

#### **Perfil** 👤
- **Acceso restringido** solo a sus datos personales
- Solo ve una tabla con sus registros de trabajo:
  - Fecha
  - Cliente
  - Evento
  - Lugar
  - Hora de Entrada
  - Hora de Salida
  - Horas Trabajadas
- Puede exportar sus registros a Excel

### 2. Panel de Control de Contraseñas

**Ubicación:** Configuración → Contraseñas y Usuarios (solo Admin)

**Funcionalidades:**
- ✅ Crear nuevos usuarios con email, nombre, rol y contraseña
- ✅ Ver lista de todos los usuarios del sistema
- ✅ Activar/desactivar usuarios
- ✅ Enviar email de restablecimiento de contraseña
- ✅ Visualización clara de roles con iconos y colores

### 3. Sistema de Autenticación

**Login mejorado:**
- Autenticación por email y contraseña
- Validación en backend contra base de datos
- Manejo de errores claro
- Verificación de usuario activo
- Persistencia de sesión en localStorage

## 🔧 Endpoints del Backend

### Gestión de Usuarios

```
GET    /usuarios                  - Listar todos los usuarios
POST   /usuarios                  - Crear nuevo usuario
PUT    /usuarios/:id/estado       - Activar/desactivar usuario
POST   /login                     - Autenticar usuario
POST   /enviar-reset-password     - Enviar email de reset
GET    /registros-perfil?email=   - Obtener registros de un perfil
```

## 📊 Estructura de Datos

### Usuario
```javascript
{
  id: "usuario:timestamp",
  email: "usuario@ejemplo.com",
  nombre: "Nombre Completo",
  rol: "admin" | "coordinador" | "perfil",
  password: "hashed_password", // Base64 (mejorar en producción)
  activo: true,
  fechaCreacion: "2026-03-10T..."
}
```

## 🚀 Cómo Usar

### Crear el Primer Usuario Administrador

1. Accede a la aplicación (verás el login)
2. Como aún no hay usuarios, necesitas crearlos vía backend directamente o usando la siguiente estrategia:

**Opción A: Crear usuario admin inicial vía consola del navegador**

Abre la consola del navegador y ejecuta:

```javascript
const baseUrl = 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-25b11ac0';
const publicAnonKey = 'YOUR_ANON_KEY';

fetch(`${baseUrl}/usuarios`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${publicAnonKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@ejemplo.com',
    nombre: 'Administrador',
    rol: 'admin',
    password: 'admin123'
  })
})
.then(r => r.json())
.then(console.log);
```

**Opción B: Usuario admin temporal hardcodeado**

Si necesitas acceso inmediato, puedes agregar un usuario admin temporal en el código del backend.

### Flujo de Trabajo Normal

1. **Admin crea usuarios:**
   - Va a Configuración → Contraseñas y Usuarios
   - Click en "+ Nuevo Usuario"
   - Completa: email, nombre, rol, contraseña
   - Click en "Crear Usuario"

2. **Usuarios inician sesión:**
   - Ingresan su email y contraseña
   - El sistema les muestra la interfaz según su rol

3. **Restablecer contraseña:**
   - Admin ingresa el email del usuario
   - Se envía un email con token de restablecimiento
   - Usuario recibe el token por email

## 🎨 Interfaz de Usuario

### Vistas por Rol

**Admin y Coordinador:**
- Navegación completa con tabs
- Header con nombre de usuario y rol
- Botón de cerrar sesión

**Perfil:**
- Vista simplificada solo con tabla de registros
- Estadísticas: Total eventos, Horas totales, Clientes diferentes
- Botón de exportar a Excel
- Botón de cerrar sesión

## 🔒 Seguridad

### Implementado
- ✅ Autenticación obligatoria
- ✅ Verificación de contraseña
- ✅ Control de acceso por rol
- ✅ Usuarios activos/inactivos
- ✅ No se envían contraseñas al frontend
- ✅ Tokens de reset con expiración

### Mejoras Recomendadas para Producción
- 🔄 Usar bcrypt/argon2 para hashear contraseñas (actualmente usa Base64)
- 🔄 Implementar rate limiting en login
- 🔄 Agregar 2FA (autenticación de dos factores)
- 🔄 Tokens JWT con expiración
- 🔄 Logs de auditoría de accesos
- 🔄 Política de contraseñas fuertes

## 📧 Integración con Email

El sistema de restablecimiento de contraseña utiliza el sistema de email multi-proveedor existente:
- Intenta enviar con Resend si está configurado
- Si falla, intenta con Mailgun
- Email con formato HTML profesional
- Token de reset válido por 1 hora

## 🧪 Testing

### Casos de Prueba

1. **Login exitoso con cada rol**
   - Verificar que cada rol ve las secciones correctas

2. **Login fallido**
   - Email no existe
   - Contraseña incorrecta
   - Usuario inactivo

3. **Creación de usuarios**
   - Email duplicado (debe fallar)
   - Todos los roles
   - Activar/desactivar

4. **Restricciones de acceso**
   - Coordinador no debe ver Configuración
   - Perfil solo debe ver su tabla

5. **Vista de Perfil**
   - Debe mostrar solo registros del usuario logueado
   - Cálculo correcto de horas trabajadas
   - Exportación a Excel funcional

## 📝 Archivos Modificados/Creados

### Nuevos Componentes
- `/components/password-control-panel.tsx` - Panel de gestión de usuarios
- `/components/perfil-view.tsx` - Vista para rol Perfil
- `/SISTEMA_USUARIOS_ROLES.md` - Esta documentación

### Componentes Modificados
- `/App.tsx` - Sistema de roles y vistas condicionales
- `/components/login.tsx` - Autenticación por email/password
- `/components/configuracion.tsx` - Nueva pestaña de Contraseñas

### Backend
- `/supabase/functions/server/index.tsx` - 6 nuevos endpoints

## 🎓 Ejemplo de Uso

```javascript
// Crear usuario coordinador
const nuevoCoordinador = {
  email: 'maria@empresa.com',
  nombre: 'María García',
  rol: 'coordinador',
  password: 'segura123'
};

// Crear usuario perfil
const nuevoPerfil = {
  email: 'juan@empresa.com',
  nombre: 'Juan Pérez',
  rol: 'perfil',
  password: 'mi_password'
};

// Login
const credentials = {
  email: 'admin@ejemplo.com',
  password: 'admin123'
};
```

## ✅ Checklist de Verificación

- [x] Sistema de roles implementado
- [x] Login funcional con email/password
- [x] Panel de gestión de usuarios
- [x] Restricciones de acceso por rol
- [x] Vista especial para Perfiles
- [x] Envío de email de reset
- [x] Exportación Excel en vista de Perfil
- [x] Activar/desactivar usuarios
- [x] Interfaz visual clara con badges de roles
- [x] Persistencia de sesión
- [x] Cerrar sesión funcional

## 🚦 Estado

**✅ COMPLETADO Y LISTO PARA USAR**

El sistema de usuarios y roles está completamente funcional. Solo necesitas crear el primer usuario administrador y ya puedes empezar a gestionar el acceso de tu equipo.

---

**Última actualización:** 10 de marzo de 2026
**Versión:** 2.3
