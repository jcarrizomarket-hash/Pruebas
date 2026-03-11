import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import * as db from './db-helpers.ts';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

// Cliente de Supabase
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Middleware de seguridad simple
const requireSecret = async (c, next) => {
  const expectedSecret = Deno.env.get('SUPABASE_FN_SECRET');
  const providedSecret = c.req.header('x-fn-secret');
  
  // Solo validar en métodos mutantes
  const methodsToProtect = ['POST', 'PUT', 'DELETE', 'PATCH'];
  if (methodsToProtect.includes(c.req.method)) {
    if (expectedSecret && providedSecret !== expectedSecret) {
      console.warn(`❌ Acceso no autorizado: ${c.req.method} ${c.req.url}`);
      return c.json({ success: false, error: 'No autorizado' }, 401);
    }
  }
  
  await next();
};

// ============== CLIENTES ==============

app.get('/make-server-25b11ac0/clientes', async (c) => {
  try {
    const clientes = await db.obtenerClientes(supabase);
    return c.json({ success: true, data: clientes });
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post('/make-server-25b11ac0/clientes', requireSecret, async (c) => {
  try {
    const datos = await c.req.json();
    const cliente = await db.crearCliente(supabase, datos);
    console.log('✅ Cliente creado:', cliente.codigo, '-', cliente.nombre);
    return c.json({ success: true, data: cliente });
  } catch (error) {
    console.error('❌ Error al crear cliente:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.put('/make-server-25b11ac0/clientes/:id', requireSecret, async (c) => {
  try {
    const id = c.req.param('id');
    const datos = await c.req.json();
    const cliente = await db.actualizarCliente(supabase, id, datos);
    return c.json({ success: true, data: cliente });
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.delete('/make-server-25b11ac0/clientes/:id', requireSecret, async (c) => {
  try {
    const id = c.req.param('id');
    await db.eliminarCliente(supabase, id);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============== CAMAREROS ==============

app.get('/make-server-25b11ac0/camareros', async (c) => {
  try {
    const camareros = await db.obtenerCamareros(supabase);
    return c.json({ success: true, data: camareros });
  } catch (error) {
    console.error('Error al obtener camareros:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post('/make-server-25b11ac0/camareros', requireSecret, async (c) => {
  try {
    const datos = await c.req.json();
    const camarero = await db.crearCamarero(supabase, datos);
    console.log('✅ Camarero creado:', camarero.codigo, '-', camarero.nombre, camarero.apellido);
    return c.json({ success: true, data: camarero });
  } catch (error) {
    console.error('❌ Error al crear camarero:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.put('/make-server-25b11ac0/camareros/:id', requireSecret, async (c) => {
  try {
    const id = c.req.param('id');
    const datos = await c.req.json();
    const camarero = await db.actualizarCamarero(supabase, id, datos);
    return c.json({ success: true, data: camarero });
  } catch (error) {
    console.error('Error al actualizar camarero:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.delete('/make-server-25b11ac0/camareros/:id', requireSecret, async (c) => {
  try {
    const id = c.req.param('id');
    await db.eliminarCamarero(supabase, id);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar camarero:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============== COORDINADORES ==============

app.get('/make-server-25b11ac0/coordinadores', async (c) => {
  try {
    const coordinadores = await db.obtenerCoordinadores(supabase);
    return c.json({ success: true, data: coordinadores });
  } catch (error) {
    console.error('Error al obtener coordinadores:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post('/make-server-25b11ac0/coordinadores', requireSecret, async (c) => {
  try {
    const datos = await c.req.json();
    const coordinador = await db.crearCoordinador(supabase, datos);
    console.log('✅ Coordinador creado:', coordinador.codigo, '-', coordinador.nombre);
    return c.json({ success: true, data: coordinador });
  } catch (error) {
    console.error('❌ Error al crear coordinador:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.put('/make-server-25b11ac0/coordinadores/:id', requireSecret, async (c) => {
  try {
    const id = c.req.param('id');
    const datos = await c.req.json();
    const coordinador = await db.actualizarCoordinador(supabase, id, datos);
    return c.json({ success: true, data: coordinador });
  } catch (error) {
    console.error('Error al actualizar coordinador:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.delete('/make-server-25b11ac0/coordinadores/:id', requireSecret, async (c) => {
  try {
    const id = c.req.param('id');
    await db.eliminarCoordinador(supabase, id);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar coordinador:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============== PEDIDOS/EVENTOS ==============

app.get('/make-server-25b11ac0/pedidos', async (c) => {
  try {
    const pedidos = await db.obtenerPedidos(supabase);
    return c.json({ success: true, data: pedidos });
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post('/make-server-25b11ac0/pedidos', requireSecret, async (c) => {
  try {
    const datos = await c.req.json();
    const pedido = await db.crearPedido(supabase, datos);
    console.log('✅ Pedido creado:', pedido.codigo, '-', pedido.cliente);
    return c.json({ success: true, data: pedido });
  } catch (error) {
    console.error('❌ Error al crear pedido:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.put('/make-server-25b11ac0/pedidos/:id', requireSecret, async (c) => {
  try {
    const id = c.req.param('id');
    const datos = await c.req.json();
    const pedido = await db.actualizarPedido(supabase, id, datos);
    return c.json({ success: true, data: pedido });
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.delete('/make-server-25b11ac0/pedidos/:id', requireSecret, async (c) => {
  try {
    const id = c.req.param('id');
    await db.eliminarPedido(supabase, id);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============== ASIGNACIONES ==============

app.get('/make-server-25b11ac0/asignaciones', async (c) => {
  try {
    const pedidoId = c.req.query('pedidoId');
    const asignaciones = await db.obtenerAsignaciones(supabase, pedidoId);
    return c.json({ success: true, data: asignaciones });
  } catch (error) {
    console.error('Error al obtener asignaciones:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post('/make-server-25b11ac0/asignaciones', requireSecret, async (c) => {
  try {
    const datos = await c.req.json();
    const asignacion = await db.crearAsignacion(supabase, datos);
    console.log('✅ Asignación creada');
    return c.json({ success: true, data: asignacion });
  } catch (error) {
    console.error('❌ Error al crear asignación:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.put('/make-server-25b11ac0/asignaciones/:id', requireSecret, async (c) => {
  try {
    const id = c.req.param('id');
    const datos = await c.req.json();
    const asignacion = await db.actualizarAsignacion(supabase, id, datos);
    return c.json({ success: true, data: asignacion });
  } catch (error) {
    console.error('Error al actualizar asignación:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.delete('/make-server-25b11ac0/asignaciones/:pedidoId/:camareroCodigo', requireSecret, async (c) => {
  try {
    const pedidoId = c.req.param('pedidoId');
    const camareroCodigo = c.req.param('camareroCodigo');
    await db.eliminarAsignacion(supabase, pedidoId, camareroCodigo);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar asignación:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============== USUARIOS ==============

app.get('/make-server-25b11ac0/usuarios', async (c) => {
  try {
    const usuarios = await db.obtenerUsuarios(supabase);
    return c.json({ success: true, data: usuarios });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post('/make-server-25b11ac0/usuarios', requireSecret, async (c) => {
  try {
    const datos = await c.req.json();
    const usuario = await db.crearUsuario(supabase, datos);
    console.log('✅ Usuario creado:', usuario.email, '-', usuario.rol);
    return c.json({ success: true, data: usuario });
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post('/make-server-25b11ac0/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    const usuario = await db.obtenerUsuarioPorEmail(supabase, email);
    
    if (!usuario) {
      return c.json({ success: false, error: 'Usuario no encontrado' }, 404);
    }
    
    // Verificar password (en producción usar bcrypt)
    if (usuario.password_hash !== password) {
      return c.json({ success: false, error: 'Contraseña incorrecta' }, 401);
    }
    
    // Retornar datos del usuario sin la contraseña
    const { password_hash, ...usuarioSinPassword } = usuario;
    
    return c.json({ 
      success: true, 
      data: {
        nombre: usuarioSinPassword.nombre,
        email: usuarioSinPassword.email,
        rol: usuarioSinPassword.rol
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.put('/make-server-25b11ac0/usuarios/:id', requireSecret, async (c) => {
  try {
    const id = c.req.param('id');
    const datos = await c.req.json();
    const usuario = await db.actualizarUsuario(supabase, id, datos);
    return c.json({ success: true, data: usuario });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.delete('/make-server-25b11ac0/usuarios/:id', requireSecret, async (c) => {
  try {
    const id = c.req.param('id');
    await db.eliminarUsuario(supabase, id);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============== QR TOKENS ==============

app.post('/make-server-25b11ac0/pedidos/:id/qr-token', requireSecret, async (c) => {
  try {
    const pedidoId = c.req.param('id');
    const { tipo } = await c.req.json();
    
    // Generar token único
    const token = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const qrToken = await db.crearQRToken(supabase, {
      token,
      pedido_id: pedidoId,
      tipo,
      activo: true
    });
    
    return c.json({ success: true, data: qrToken });
  } catch (error) {
    console.error('Error al crear QR token:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.get('/make-server-25b11ac0/qr-scan/:token', async (c) => {
  try {
    const token = c.req.param('token');
    
    const qrToken = await db.obtenerQRTokenPorToken(supabase, token);
    
    if (!qrToken) {
      return c.json({ success: false, error: 'Token no válido o expirado' }, 404);
    }
    
    const pedido = await db.obtenerPedidoPorId(supabase, qrToken.pedido_id);
    
    return c.json({ 
      success: true, 
      data: {
        token: qrToken,
        pedido
      }
    });
  } catch (error) {
    console.error('Error al obtener token QR:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post('/make-server-25b11ac0/qr-scan/:token/registrar', async (c) => {
  try {
    const token = c.req.param('token');
    const { camareroCodigo } = await c.req.json();
    
    const qrToken = await db.obtenerQRTokenPorToken(supabase, token);
    
    if (!qrToken) {
      return c.json({ success: false, error: 'Token no válido' }, 404);
    }
    
    // Registrar asistencia
    const registro = await db.registrarAsistencia(supabase, {
      pedido_id: qrToken.pedido_id,
      camarero_codigo: camareroCodigo,
      tipo: qrToken.tipo
    });
    
    // Actualizar la asignación con la hora real
    const asignaciones = await db.obtenerAsignaciones(supabase, qrToken.pedido_id);
    const asignacion = asignaciones.find(a => a.camarero_codigo === camareroCodigo);
    
    if (asignacion) {
      const campoHora = qrToken.tipo === 'entrada' ? 'hora_entrada_real' : 'hora_salida_real';
      await db.actualizarAsignacion(supabase, asignacion.id, {
        [campoHora]: new Date().toISOString()
      });
    }
    
    return c.json({ success: true, data: registro });
  } catch (error) {
    console.error('Error al registrar asistencia:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.get('/make-server-25b11ac0/registros-asistencia', async (c) => {
  try {
    const pedidoId = c.req.query('pedidoId');
    const registros = await db.obtenerRegistrosAsistencia(supabase, pedidoId);
    return c.json({ success: true, data: registros });
  } catch (error) {
    console.error('Error al obtener registros de asistencia:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============== PERFIL DE CAMARERO ==============

app.get('/make-server-25b11ac0/registros-perfil', async (c) => {
  try {
    const email = c.req.query('email');
    
    if (!email) {
      return c.json({ success: false, error: 'Email requerido' }, 400);
    }
    
    // Obtener camarero por email
    const camarero = await db.obtenerCamareroPorEmail(supabase, email);
    
    if (!camarero) {
      return c.json({ success: false, error: 'Camarero no encontrado' }, 404);
    }
    
    // Obtener todas las asignaciones del camarero
    const todasAsignaciones = await db.obtenerAsignaciones(supabase);
    const asignacionesCamarero = todasAsignaciones.filter(a => a.camarero_codigo === camarero.codigo);
    
    // Obtener pedidos correspondientes
    const pedidosIds = [...new Set(asignacionesCamarero.map(a => a.pedido_id))];
    const pedidos = await db.obtenerPedidos(supabase);
    const pedidosCamarero = pedidos.filter(p => pedidosIds.includes(p.id));
    
    // Combinar información
    const registros = asignacionesCamarero.map(asignacion => {
      const pedido = pedidosCamarero.find(p => p.id === asignacion.pedido_id);
      return {
        ...asignacion,
        pedido
      };
    });
    
    return c.json({ success: true, data: registros });
  } catch (error) {
    console.error('Error al obtener registros de perfil:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============== HEALTH CHECK ==============

app.get('/make-server-25b11ac0/health', (c) => {
  return c.json({ 
    success: true, 
    message: 'Servidor funcionando con tablas SQL',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
Deno.serve(app.fetch);
