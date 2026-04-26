# 🚀 Inicio Rápido - Sistema de Usuarios

## ⚡ Crear el Primer Usuario Admin (MÉTODO RÁPIDO)

### Opción 1: Desde la Consola del Navegador (Recomendado)

1. **Abre la aplicación en tu navegador**
   
2. **Abre la consola del navegador** (F12 o Click derecho → Inspeccionar → Console)

3. **Copia y pega este código:**

```javascript
// 1. Obtener las credenciales del proyecto
const projectId = 'abcdefgh'; // Reemplazar con tu Project ID real
const publicAnonKey = 'tu_anon_key_aqui'; // Reemplazar con tu Anon Key real

// 2. Crear usuario admin
const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-25b11ac0`;

fetch(`${baseUrl}/usuarios`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${publicAnonKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@miempresa.com',
    nombre: 'Administrador',
    rol: 'admin',
    password: 'admin123'  // ⚠️ Cámbiala después del primer login
  })
})
.then(r => r.json())
.then(result => {
  if (result.success) {
    console.log('✅ Usuario creado exitosamente!');
    console.log('📧 Email:', result.data.email);
    console.log('👤 Nombre:', result.data.nombre);
    console.log('🔑 Rol:', result.data.rol);
    console.log('\n🎉 Ya puedes iniciar sesión!');
  } else {
    console.error('❌ Error:', result.error);
  }
});
```

4. **Presiona Enter**

5. **Verás el mensaje de confirmación en la consola**

6. **¡Ya puedes iniciar sesión!** con el email y contraseña que configuraste

---

## 📍 ¿Dónde encontrar tus credenciales?

### Project ID y Anon Key

Busca el archivo `/utils/supabase/info.tsx`:

```typescript
export const projectId = 'abcdefgh';  // ← Este es tu PROJECT_ID
export const publicAnonKey = 'eyJhb...'; // ← Este es tu ANON_KEY
```

---

## 👥 Crear Usuarios Adicionales

Una vez que hayas iniciado sesión como **Admin**:

1. Ve a **Configuración** → **Contraseñas y Usuarios**

2. Click en **"+ Nuevo Usuario"**

3. Completa el formulario:
   - **Email:** email del usuario
   - **Nombre:** nombre completo
   - **Rol:** 
     - `Admin` → Acceso total
     - `Coordinador` → Sin acceso a Configuración
     - `Perfil` → Solo ve sus registros
   - **Contraseña Inicial:** contraseña temporal

4. Click en **"Crear Usuario"**

5. El usuario ya puede iniciar sesión con su email y contraseña

---

## 🔐 Tipos de Usuarios

| Rol | Acceso | Descripción |
|-----|--------|-------------|
| **Admin** 👑 | Total | Dashboard, Pedidos, Personal, Admin, Informes, Envíos, **Configuración** |
| **Coordinador** 👔 | Operativo | Dashboard, Pedidos, Personal, Admin, Informes, Envíos (sin Configuración) |
| **Perfil** 👤 | Limitado | Solo tabla con sus registros (Fecha, Cliente, Evento, Horas) |

---

## 🔄 Restablecer Contraseña

### Como Admin:

1. Ve a **Configuración** → **Contraseñas y Usuarios**

2. En la sección **"Restablecer Contraseña"**:
   - Ingresa el email del usuario
   - Click en **"Enviar Email"**

3. El usuario recibirá un email con un token de restablecimiento

4. El token expira en **1 hora**

---

## 🎯 Ejemplo Completo

```javascript
// Crear Admin
{
  email: 'admin@miempresa.com',
  nombre: 'Juan Pérez',
  rol: 'admin',
  password: 'Admin2024!'
}

// Crear Coordinador
{
  email: 'maria@miempresa.com',
  nombre: 'María García',
  rol: 'coordinador',
  password: 'Coord2024!'
}

// Crear Perfil (Camarero)
{
  email: 'carlos@miempresa.com',
  nombre: 'Carlos López',
  rol: 'perfil',
  password: 'Carlos2024!'
}
```

---

## ✅ Verificación Post-Creación

1. **Cierra sesión** (si estabas logueado con el sistema antiguo)

2. **Inicia sesión** con el nuevo usuario admin

3. **Verifica que puedas acceder a Configuración**

4. **Crea un usuario de prueba** de cada rol

5. **Prueba cada tipo de usuario** en diferentes navegadores/pestañas privadas

---

## 🐛 Solución de Problemas

### "Usuario no encontrado"
- Verifica que el email sea correcto
- Asegúrate de haber creado el usuario primero

### "Contraseña incorrecta"
- Las contraseñas distinguen mayúsculas/minúsculas
- Verifica que no haya espacios al inicio o final

### "Usuario inactivo"
- Un admin debe activar el usuario desde Configuración → Contraseñas y Usuarios
- Click en el botón "Inactivo" para activarlo

### "No puedo ver Configuración"
- Solo usuarios con rol **Admin** pueden ver esta sección
- Los coordinadores NO tienen acceso a Configuración

### "Perfil solo ve tabla vacía"
- El perfil debe estar vinculado a un camarero con el mismo email
- Ve a **Personal** y edita el camarero para agregar el email correcto

---

## 📧 Vincular Perfil con Camarero

Para que un usuario con rol **Perfil** vea sus registros:

1. Ve a **Personal**

2. Busca al camarero correspondiente

3. Click en **Editar**

4. **Agrega el mismo email** que usó al crear el usuario

5. Click en **Guardar**

Ahora cuando ese usuario inicie sesión, verá sus registros de trabajo.

---

## 🎓 Recomendaciones

### Seguridad
- ✅ Cambia las contraseñas por defecto inmediatamente
- ✅ Usa contraseñas fuertes (mínimo 8 caracteres, mayúsculas, números)
- ✅ No compartas las credenciales del admin
- ✅ Desactiva usuarios que ya no trabajen en la empresa

### Organización
- ✅ Crea un admin principal y un backup
- ✅ Usa emails corporativos para coordinadores
- ✅ Usa emails personales para perfiles (camareros)
- ✅ Documenta qué usuarios tienen qué roles

---

## 📞 Soporte

Si tienes problemas:

1. Revisa la consola del navegador (F12) para ver errores
2. Verifica que el servidor esté funcionando
3. Comprueba que las variables de entorno estén configuradas
4. Lee la documentación completa en `/SISTEMA_USUARIOS_ROLES.md`

---

**¡Listo!** Ya tienes todo configurado para empezar a usar el sistema de usuarios y roles. 🎉
