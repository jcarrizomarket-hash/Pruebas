/**
 * Script de Inicialización de Datos de Prueba
 * 
 * Este archivo contiene datos de prueba realistas para poblar la base de datos
 * Use este script para crear datos iniciales en una nueva instancia de Supabase
 * 
 * ACTUALIZADO: Ahora usa las tablas SQL de Supabase en lugar del KV store
 */

import { projectId, publicAnonKey } from '../utils/supabase/info';

const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-25b11ac0`;

// ============== DATOS DE PRUEBA ==============

// 1. COORDINADORES
export const coordinadoresPrueba = [
  {
    nombre: 'María',
    apellido: 'González',
    email: 'maria.gonzalez@empresa.com',
    telefono: '+34 600 111 222',
    zona: 'Madrid Centro'
  },
  {
    nombre: 'Carlos',
    apellido: 'Rodríguez',
    email: 'carlos.rodriguez@empresa.com',
    telefono: '+34 600 333 444',
    zona: 'Barcelona'
  }
];

// 2. CAMAREROS
export const camarerosPrueba = [
  {
    nombre: 'Ana',
    apellido: 'Martínez',
    email: 'ana.martinez@email.com',
    telefono: '+34 611 111 111',
    disponibilidad: 'Fines de semana',
    categoria: 'Camarero',
    experiencia: '3 años'
  },
  {
    nombre: 'Juan',
    apellido: 'López',
    email: 'juan.lopez@email.com',
    telefono: '+34 622 222 222',
    disponibilidad: 'Todos los días',
    categoria: 'Camarero',
    experiencia: '5 años'
  },
  {
    nombre: 'Laura',
    apellido: 'García',
    email: 'laura.garcia@email.com',
    telefono: '+34 633 333 333',
    disponibilidad: 'Entre semana',
    categoria: 'Camarero',
    experiencia: '2 años'
  },
  {
    nombre: 'Pedro',
    apellido: 'Sánchez',
    email: 'pedro.sanchez@email.com',
    telefono: '+34 644 444 444',
    disponibilidad: 'Fines de semana',
    categoria: 'Jefe de sala',
    experiencia: '7 años'
  },
  {
    nombre: 'Carmen',
    apellido: 'Ruiz',
    email: 'carmen.ruiz@email.com',
    telefono: '+34 655 555 555',
    disponibilidad: 'Todos los días',
    categoria: 'Camarero',
    experiencia: '4 años'
  }
];

// 3. CLIENTES
export const clientesPrueba = [
  {
    nombre: 'Hotel Gran Vía',
    contacto: 'Roberto Fernández',
    email: 'eventos@hotelgranvia.com',
    telefono: '+34 91 555 1234',
    direccion: 'Gran Vía 45, Madrid',
    tipo: 'Hotel'
  },
  {
    nombre: 'Restaurante El Patio',
    contacto: 'Isabel Moreno',
    email: 'info@elpatio.com',
    telefono: '+34 93 555 5678',
    direccion: 'Paseo de Gracia 88, Barcelona',
    tipo: 'Restaurante'
  },
  {
    nombre: 'Catering Premium',
    contacto: 'Miguel Ángel Torres',
    email: 'contacto@cateringpremium.com',
    telefono: '+34 91 555 9999',
    direccion: 'Calle Mayor 123, Madrid',
    tipo: 'Empresa de Catering'
  }
];

// 4. PEDIDOS/EVENTOS
export const pedidosPrueba = [
  {
    cliente: 'Hotel Gran Vía',
    tipoEvento: 'Boda',
    diaEvento: '2025-04-15',
    horaEntrada: '18:00',
    horaSalida: '02:00',
    lugar: 'Salón Imperial - Hotel Gran Vía',
    numeroPersonas: 150,
    observaciones: 'Servicio de cóctel y cena. Dress code: traje oscuro.',
    coordinador: 'María González',
    estado: 'confirmado',
    cantidadCamareros: 8
  },
  {
    cliente: 'Restaurante El Patio',
    tipoEvento: 'Evento Corporativo',
    diaEvento: '2025-04-20',
    horaEntrada: '19:00',
    horaSalida: '23:00',
    lugar: 'Terraza - Restaurante El Patio',
    numeroPersonas: 80,
    observaciones: 'Cena de empresa con presentación. Servicio de canapés.',
    coordinador: 'Carlos Rodríguez',
    estado: 'pendiente',
    cantidadCamareros: 5
  },
  {
    cliente: 'Catering Premium',
    tipoEvento: 'Comunión',
    diaEvento: '2025-05-10',
    horaEntrada: '13:00',
    horaSalida: '19:00',
    lugar: 'Finca Los Olivos',
    numeroPersonas: 120,
    observaciones: 'Servicio de comida y merienda. Menú infantil incluido.',
    coordinador: 'María González',
    estado: 'confirmado',
    cantidadCamareros: 6
  }
];

// 5. USUARIOS DEL SISTEMA
export const usuariosPrueba = [
  {
    nombre: 'Administrador',
    email: 'admin@gestion.com',
    password: 'Admin123!',
    rol: 'admin'
  },
  {
    nombre: 'Coordinador Prueba',
    email: 'coordinador@gestion.com',
    password: 'Coord123!',
    rol: 'coordinador'
  },
  {
    nombre: 'Ana Martínez',
    email: 'ana.martinez@email.com',
    password: 'Ana123!',
    rol: 'perfil'
  }
];

// ============== FUNCIONES DE INICIALIZACIÓN ==============

export async function inicializarCoordinadores() {
  console.log('🔄 Creando coordinadores...');
  const resultados = [];
  
  for (const coord of coordinadoresPrueba) {
    try {
      const response = await fetch(`${baseUrl}/coordinadores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(coord)
      });
      const data = await response.json();
      resultados.push({ nombre: coord.nombre, success: data.success });
      console.log(`  ${data.success ? '✅' : '❌'} ${coord.nombre} ${coord.apellido}`);
    } catch (error) {
      console.error(`  ❌ Error creando ${coord.nombre}:`, error);
    }
  }
  
  return resultados;
}

export async function inicializarCamareros() {
  console.log('🔄 Creando camareros...');
  const resultados = [];
  
  for (const cam of camarerosPrueba) {
    try {
      const response = await fetch(`${baseUrl}/camareros`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(cam)
      });
      const data = await response.json();
      resultados.push({ nombre: cam.nombre, success: data.success });
      console.log(`  ${data.success ? '✅' : '❌'} ${cam.nombre} ${cam.apellido}`);
    } catch (error) {
      console.error(`  ❌ Error creando ${cam.nombre}:`, error);
    }
  }
  
  return resultados;
}

export async function inicializarClientes() {
  console.log('🔄 Creando clientes...');
  const resultados = [];
  
  for (const cliente of clientesPrueba) {
    try {
      const response = await fetch(`${baseUrl}/clientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(cliente)
      });
      const data = await response.json();
      resultados.push({ nombre: cliente.nombre, success: data.success });
      console.log(`  ${data.success ? '✅' : '❌'} ${cliente.nombre}`);
    } catch (error) {
      console.error(`  ❌ Error creando ${cliente.nombre}:`, error);
    }
  }
  
  return resultados;
}

export async function inicializarPedidos() {
  console.log('🔄 Creando pedidos/eventos...');
  const resultados = [];
  
  for (const pedido of pedidosPrueba) {
    try {
      const response = await fetch(`${baseUrl}/pedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(pedido)
      });
      const data = await response.json();
      resultados.push({ cliente: pedido.cliente, success: data.success });
      console.log(`  ${data.success ? '✅' : '❌'} ${pedido.cliente} - ${pedido.tipoEvento}`);
    } catch (error) {
      console.error(`  ❌ Error creando pedido ${pedido.cliente}:`, error);
    }
  }
  
  return resultados;
}

export async function inicializarUsuarios() {
  console.log('🔄 Creando usuarios del sistema...');
  const resultados = [];
  
  for (const usuario of usuariosPrueba) {
    try {
      const response = await fetch(`${baseUrl}/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(usuario)
      });
      const data = await response.json();
      resultados.push({ email: usuario.email, success: data.success });
      console.log(`  ${data.success ? '✅' : '❌'} ${usuario.email} (${usuario.rol})`);
    } catch (error) {
      console.error(`  ❌ Error creando usuario ${usuario.email}:`, error);
    }
  }
  
  return resultados;
}

// ============== FUNCIÓN PRINCIPAL ==============

export async function inicializarTodosDatos() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('🚀 INICIALIZACIÓN DE DATOS DE PRUEBA');
  console.log('   Base de datos: Pruebas Gestion de servicios');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  
  try {
    // Orden de creación: Coordinadores → Clientes → Camareros → Pedidos → Usuarios
    await inicializarCoordinadores();
    console.log('');
    
    await inicializarClientes();
    console.log('');
    
    await inicializarCamareros();
    console.log('');
    
    await inicializarPedidos();
    console.log('');
    
    await inicializarUsuarios();
    console.log('');
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ INICIALIZACIÓN COMPLETADA');
    console.log('');
    console.log('📋 CREDENCIALES DE ACCESO:');
    console.log('');
    console.log('   👤 Admin:');
    console.log('      Email: admin@gestion.com');
    console.log('      Password: Admin123!');
    console.log('');
    console.log('   👤 Coordinador:');
    console.log('      Email: coordinador@gestion.com');
    console.log('      Password: Coord123!');
    console.log('');
    console.log('   👤 Perfil (Camarero):');
    console.log('      Email: ana.martinez@email.com');
    console.log('      Password: Ana123!');
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Error durante la inicialización:', error);
    return { success: false, error };
  }
}

// ============== FUNCIÓN DE LIMPIEZA (USAR CON PRECAUCIÓN) ==============

export async function limpiarBaseDatos() {
  console.log('');
  console.log('⚠️  ADVERTENCIA: Esto eliminará TODOS los datos de la base de datos');
  console.log('');
  
  const confirmar = confirm('¿Estás seguro de que quieres eliminar TODOS los datos?');
  
  if (!confirmar) {
    console.log('❌ Operación cancelada');
    return { success: false, message: 'Cancelado por el usuario' };
  }
  
  console.log('🗑️  Limpiando base de datos...');
  
  try {
    // Esta funcionalidad requeriría endpoints específicos en el backend
    console.log('ℹ️  Nota: La limpieza completa debe hacerse desde el panel de Supabase');
    console.log('   o implementando endpoints de eliminación masiva en el servidor');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
    return { success: false, error };
  }
}