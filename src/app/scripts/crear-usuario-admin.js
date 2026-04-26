#!/usr/bin/env node

/**
 * Script para crear el primer usuario administrador
 * 
 * Uso:
 *   node scripts/crear-usuario-admin.js
 * 
 * O desde la consola del navegador, copia y pega el código de la función crearAdmin()
 */

// Configuración - Reemplaza estos valores con los tuyos
const PROJECT_ID = 'TU_PROJECT_ID'; // Obtener de /utils/supabase/info.tsx
const ANON_KEY = 'TU_ANON_KEY';     // Obtener de /utils/supabase/info.tsx

const baseUrl = `https://${PROJECT_ID}.supabase.co/functions/v1/make-server-25b11ac0`;

async function crearUsuarioAdmin(email, nombre, password) {
  try {
    console.log('🔐 Creando usuario administrador...');
    console.log(`Email: ${email}`);
    console.log(`Nombre: ${nombre}`);
    
    const response = await fetch(`${baseUrl}/usuarios`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        nombre,
        rol: 'admin',
        password
      })
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ Usuario administrador creado exitosamente!');
      console.log('📧 Email:', result.data.email);
      console.log('👤 Nombre:', result.data.nombre);
      console.log('🔑 Rol:', result.data.rol);
      console.log('\n🎉 Ya puedes iniciar sesión con estas credenciales.');
    } else {
      console.error('❌ Error al crear usuario:', result.error);
    }

    return result;
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    return { success: false, error: error.message };
  }
}

// Datos del usuario admin por defecto
const adminData = {
  email: 'admin@gestionperfiles.com',
  nombre: 'Administrador Principal',
  password: 'admin123' // ⚠️ CAMBIAR ESTA CONTRASEÑA DESPUÉS DEL PRIMER LOGIN
};

// Si se ejecuta como script de Node.js
if (typeof window === 'undefined') {
  // Modo Node.js
  if (PROJECT_ID === 'TU_PROJECT_ID' || ANON_KEY === 'TU_ANON_KEY') {
    console.log('⚠️  CONFIGURACIÓN NECESARIA ⚠️\n');
    console.log('Por favor, edita el archivo scripts/crear-usuario-admin.js');
    console.log('y reemplaza PROJECT_ID y ANON_KEY con tus valores reales.\n');
    console.log('Puedes encontrarlos en /utils/supabase/info.tsx\n');
    process.exit(1);
  }

  crearUsuarioAdmin(adminData.email, adminData.nombre, adminData.password);
} else {
  // Modo navegador - exponer función global
  window.crearAdmin = async function(email, nombre, password) {
    // Detectar automáticamente PROJECT_ID y ANON_KEY del DOM
    const baseUrl = `${window.location.origin}/functions/v1/make-server-25b11ac0`;
    
    const response = await fetch(`${baseUrl}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email || adminData.email,
        nombre: nombre || adminData.nombre,
        rol: 'admin',
        password: password || adminData.password
      })
    });

    const result = await response.json();
    console.log(result);
    return result;
  };

  console.log('📌 Función crearAdmin() disponible en la consola');
  console.log('Uso: crearAdmin("admin@ejemplo.com", "Nombre Admin", "password123")');
}

// Exportar para uso en otros scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { crearUsuarioAdmin };
}
