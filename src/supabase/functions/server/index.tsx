import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts';
import * as kv from './kv_store.tsx';
import * as db from './db-helpers.ts';

const app = new Hono().basePath('/make-server-ce05fe95');

app.use('*', cors());
app.use('*', logger(console.log));

// Middleware de seguridad simple
const requireSecret = async (c, next) => {
  const expectedSecret = Deno.env.get('FN_SECRET');
  const providedSecret = c.req.header('x-fn-secret');
  
  // Solo validar en m√©todos mutantes
  const methodsToProtect = ['POST', 'PUT', 'DELETE', 'PATCH'];
  if (methodsToProtect.includes(c.req.method)) {
    if (expectedSecret && providedSecret !== expectedSecret) {
      console.warn(`‚ùå Acceso no autorizado: ${c.req.method} ${c.req.url}`);
      return c.json({ success: false, error: 'No autorizado' }, 401);
    }
  }
  
  await next();
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// ============== PRUEBA ==============
app.get('/test', (c) => {
  return c.json({ 
    success: true, 
    message: '¬°Servidor funcionando correctamente!',
    timestamp: new Date().toISOString(),
    basePath: '/make-server-ce05fe95'
  });
});

// ============== CLIENTES ==============
app.get('/clientes', async (c) => {
  try {
    const clientes = await db.obtenerClientes(supabase);
    return c.json({ success: true, data: clientes });
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post('/clientes', requireSecret, async (c) => {
  try {
    const datos = await c.req.json();
    const cliente = await db.crearCliente(supabase, datos);
    console.log('‚úÖ Cliente creado:', cliente.codigo, '-', cliente.nombre);
    return c.json({ success: true, data: cliente });
  } catch (error) {
    console.error('‚ùå Error al crear cliente:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.put('/clientes/:id', requireSecret, async (c) => {
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

app.delete('/clientes/:id', requireSecret, async (c) => {
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
app.get('/camareros', async (c) => {
  try {
    const camareros = await db.obtenerCamareros(supabase);
    return c.json({ success: true, data: camareros });
  } catch (error) {
    console.error('Error al obtener camareros:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post('/camareros', requireSecret, async (c) => {
  try {
    const datos = await c.req.json();
    const camarero = await db.crearCamarero(supabase, datos);
    console.log('‚úÖ Camarero creado:', camarero.codigo, '-', camarero.nombre, camarero.apellido);
    return c.json({ success: true, data: camarero });
  } catch (error) {
    console.error('‚ùå Error al crear camarero:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.put('/camareros/:id', requireSecret, async (c) => {
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

app.delete('/camareros/:id', requireSecret, async (c) => {
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
app.get('/coordinadores', async (c) => {
  try {
    const coordinadores = await db.obtenerCoordinadores(supabase);
    return c.json({ success: true, data: coordinadores });
  } catch (error) {
    console.error('Error al obtener coordinadores:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post('/coordinadores', requireSecret, async (c) => {
  try {
    const datos = await c.req.json();
    const coordinador = await db.crearCoordinador(supabase, datos);
    console.log('‚úÖ Coordinador creado:', coordinador.codigo, '-', coordinador.nombre);
    return c.json({ success: true, data: coordinador });
  } catch (error) {
    console.error('‚ùå Error al crear coordinador:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.put('/coordinadores/:id', requireSecret, async (c) => {
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

app.delete('/coordinadores/:id', requireSecret, async (c) => {
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
app.get('/pedidos', async (c) => {
  try {
    const pedidos = await db.obtenerPedidos(supabase);
    return c.json({ success: true, data: pedidos });
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post('/pedidos', requireSecret, async (c) => {
  try {
    const datos = await c.req.json();
    const pedido = await db.crearPedido(supabase, datos);
    console.log('‚úÖ Pedido creado:', pedido.codigo, '-', pedido.cliente);
    return c.json({ success: true, data: pedido });
  } catch (error) {
    console.error('‚ùå Error al crear pedido:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.put('/pedidos/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const datos = await c.req.json();
    
    console.log('üìù Actualizando pedido:', id);
    
    const pedido = await db.actualizarPedido(supabase, id, datos);
    return c.json({ success: true, data: pedido });
  } catch (error) {
    console.error('‚ùå Error al actualizar pedido:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.delete('/pedidos/:id', async (c) => {
  try {
    const id = c.req.param('id');
    console.log(`üóëÔ∏è Intentando eliminar pedido con ID: ${id}`);
    await db.eliminarPedido(supabase, id);
    console.log(`‚úÖ Pedido ${id} eliminado correctamente`);
    return c.json({ success: true });
  } catch (error) {
    console.error('‚ùå Error al eliminar pedido:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============== INFORMES ==============
app.get('/informes/cliente', async (c) => {
  try {
    const { cliente, desde, hasta } = c.req.query();
    const pedidos = await db.obtenerPedidos(supabase);
    
    const filtrados = pedidos.filter(p => {
      const matchCliente = !cliente || p.cliente === cliente;
      const matchFecha = (!desde || p.dia_evento >= desde) && (!hasta || p.dia_evento <= hasta);
      return matchCliente && matchFecha;
    });
    
    return c.json({ success: true, data: filtrados });
  } catch (error) {
    console.error('Error al obtener informe de cliente:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.get('/informes/camarero', async (c) => {
  try {
    const { camareroCodigo, desde, hasta } = c.req.query();
    const asignaciones = await db.obtenerAsignaciones(supabase);
    const pedidos = await db.obtenerPedidos(supabase);
    
    const eventos = [];
    for (const asignacion of asignaciones) {
      if (asignacion.camarero_codigo !== camareroCodigo) continue;
      
      const pedido = pedidos.find(p => p.id === asignacion.pedido_id);
      if (!pedido) continue;
      
      const matchFecha = (!desde || pedido.dia_evento >= desde) && (!hasta || pedido.dia_evento <= hasta);
      if (!matchFecha) continue;
      
      eventos.push({
        diaEvento: pedido.dia_evento,
        cliente: pedido.cliente,
        lugar: pedido.lugar,
        horaEntrada: pedido.hora_entrada,
        horaSalida: pedido.hora_salida,
        estado: asignacion.estado,
        turno: asignacion.turno
      });
    }
    
    return c.json({ success: true, data: eventos });
  } catch (error) {
    console.error('Error al obtener informe de camarero:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============== CONFIRMACIONES ==============
app.post('/guardar-token', async (c) => {
  try {
    const { token, pedidoId, camareroId, coordinadorId } = await c.req.json();
    
    await kv.set(`confirmacion:${token}`, {
      pedidoId,
      camareroId,
      coordinadorId,
      createdAt: new Date().toISOString()
    });
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Error al guardar token:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Funci√≥n para enviar notificaci√≥n al coordinador
async function notificarCoordinador(coordinadorId: string, mensaje: string) {
  try {
    const coordinador = await kv.get(coordinadorId);
    if (!coordinador || !coordinador.telefono) {
      console.log('Coordinador sin tel√©fono configurado');
      return;
    }

    // Obtener la API key de WhatsApp
    const whatsappApiKey = Deno.env.get('WHATSAPP_API_KEY');
    const whatsappPhoneId = Deno.env.get('WHATSAPP_PHONE_ID');
    
    if (!whatsappApiKey || !whatsappPhoneId) {
      console.log('WhatsApp API no configurada. Mensaje que se enviar√≠a:', mensaje);
      return;
    }

    // Limpiar n√∫mero de tel√©fono
    let numeroLimpio = coordinador.telefono.replace(/\D/g, '');
    if (numeroLimpio.length === 9) {
      numeroLimpio = '34' + numeroLimpio;
    }

    // Enviar mensaje usando WhatsApp Business API
    const response = await fetch(`https://graph.facebook.com/v18.0/${whatsappPhoneId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${whatsappApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: numeroLimpio,
        type: 'text',
        text: {
          body: mensaje
        }
      })
    });

    const result = await response.json();
    console.log('Notificaci√≥n enviada al coordinador:', result);
  } catch (error) {
    console.log('Error al notificar coordinador:', error);
  }
}

app.get('/confirmar/:token', async (c) => {
  try {
    const token = c.req.param('token');
    const confirmacionData = await kv.get(`confirmacion:${token}`);
    
    if (!confirmacionData) {
      return c.html(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Error</title>
          <style>
            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f5f5f5; }
            .container { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
            .error { color: #dc2626; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="error">‚ùå Error</h1>
            <p>El enlace de confirmaci√≥n no es v√°lido o ya ha sido utilizado.</p>
          </div>
        </body>
        </html>
      `);
    }
    
    const { pedidoId, camareroId, coordinadorId } = confirmacionData;
    const pedido = await kv.get(pedidoId);
    const camarero = await kv.get(camareroId);
    
    if (!pedido) {
      return c.html(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Error</title>
          <style>
            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f5f5f5; }
            .container { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
            .error { color: #dc2626; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="error">‚ùå Error</h1>
            <p>El pedido no existe.</p>
          </div>
        </body>
        </html>
      `);
    }
    
    // Actualizar estado a confirmado
    const asignaciones = pedido.asignaciones.map(a => 
      a.camareroId === camareroId ? { ...a, estado: 'confirmado', eliminacionProgramada: null } : a
    );
    
    await kv.set(pedidoId, { ...pedido, asignaciones });
    
    console.log(`‚úÖ CONFIRMACI√ìN: Camarero ${camarero?.nombre} ${camarero?.apellido} confirm√≥ asistencia al evento "${pedido.cliente}"`);
    console.log(`   Estado actualizado: confirmado`);
    console.log(`   Asignaciones totales: ${asignaciones.length}`);
    
    // Verificar si todos han confirmado y crear chat grupal autom√°ticamente
    const todosConfirmados = asignaciones.length > 0 && asignaciones.every(a => a.estado === 'confirmado');
    
    if (todosConfirmados) {
      const chatId = `chat:${pedidoId}`;
      const chatExistente = await kv.get(chatId);
      
      if (!chatExistente) {
        // Calcular fecha de eliminaci√≥n programada (24h despu√©s del evento)
        const fechaEvento = new Date(pedido.diaEvento);
        const horaFin = pedido.horaSalida || '23:59';
        const [horaFinH, horaFinM] = horaFin.split(':');
        fechaEvento.setHours(parseInt(horaFinH), parseInt(horaFinM), 0, 0);
        const fechaEliminacion = new Date(fechaEvento.getTime() + 24 * 60 * 60 * 1000);
        
        // Construir lista de miembros
        const miembros = [
          {
            user_id: coordinadorId,
            nombre: 'Coordinador',
            rol: 'coordinador'
          },
          ...asignaciones.map(a => ({
            user_id: a.camareroId,
            nombre: a.camareroNombre,
            rol: 'camarero'
          }))
        ];
        
        const chat = {
          id: chatId,
          pedido_id: pedidoId,
          nombre: `${pedido.cliente} - ${pedido.lugar}`,
          descripcion: `Evento: ${pedido.cliente} en ${pedido.lugar}`,
          fecha_evento: pedido.diaEvento,
          hora_fin_evento: pedido.horaSalida || '23:59',
          miembros,
          activo: true,
          fecha_eliminacion_programada: fechaEliminacion.toISOString(),
          // Campos adicionales para compatibilidad
          pedidoId,
          coordinadorId,
          camareroIds: asignaciones.map(a => a.camareroId),
          fechaCreacion: new Date().toISOString(),
          fechaEvento: pedido.diaEvento,
          cliente: pedido.cliente,
          lugar: pedido.lugar,
          horaEntrada: pedido.horaEntrada,
          estado: 'activo'
        };
        
        await kv.set(chatId, chat);
        await kv.set(`${chatId}:mensajes`, []);
        
        console.log(`‚úÖ Chat grupal creado autom√°ticamente para pedido: ${pedido.cliente} (Expira: ${fechaEliminacion.toISOString()})`);
      }
    }
    
    // Notificar al coordinador
    const nombreCamarero = camarero ? `${camarero.nombre} ${camarero.apellido}` : 'Camarero';
    const fechaEvento = new Date(pedido.diaEvento).toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
    let mensajeCoordinador = `‚úÖ CONFIRMACI√ìN RECIBIDA\n\n${nombreCamarero} ha confirmado su asistencia.\n\nEvento: ${pedido.cliente}\nFecha: ${fechaEvento}\nLugar: ${pedido.lugar}\nHora: ${pedido.horaEntrada}`;
    
    if (todosConfirmados) {
      mensajeCoordinador += `\n\nüéâ ¬°TODOS LOS CAMAREROS HAN CONFIRMADO!\n‚úÖ Chat grupal creado autom√°ticamente`;
    }
    
    await notificarCoordinador(coordinadorId, mensajeCoordinador);
    
    // Eliminar token usado
    await kv.del(`confirmacion:${token}`);
    
    return c.html(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmaci√≥n Exitosa</title>
        <style>
          body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f5f5f5; }
          .container { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
          .success { color: #16a34a; font-size: 3rem; }
          h1 { color: #16a34a; margin: 1rem 0; }
          p { color: #666; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="success">‚úì</div>
          <h1>¬°Confirmado!</h1>
          <p>Has confirmado tu asistencia al evento exitosamente.</p>
          <p>El coordinador ha sido notificado de tu confirmaci√≥n.</p>
          <p>Gracias por tu confirmaci√≥n.</p>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.log('Error al confirmar asistencia:', error);
    return c.html(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error</title>
        <style>
          body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f5f5f5; }
          .container { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
          .error { color: #dc2626; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="error">‚ùå Error</h1>
          <p>Ha ocurrido un error al procesar tu confirmaci√≥n.</p>
        </div>
      </body>
      </html>
    `);
  }
});

app.get('/no-confirmar/:token', async (c) => {
  try {
    const token = c.req.param('token');
    const confirmacionData = await kv.get(`confirmacion:${token}`);
    
    if (!confirmacionData) {
      return c.html(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Error</title>
          <style>
            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f5f5f5; }
            .container { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
            .error { color: #dc2626; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="error">‚ùå Error</h1>
            <p>El enlace no es v√°lido o ya ha sido utilizado.</p>
          </div>
        </body>
        </html>
      `);
    }
    
    const { pedidoId, camareroId, coordinadorId } = confirmacionData;
    const pedido = await kv.get(pedidoId);
    const camarero = await kv.get(camareroId);
    
    if (pedido) {
      // CAMBIO: En lugar de eliminar inmediatamente, marcar como rechazado con eliminaci√≥n programada en 5 horas
      const asignaciones = pedido.asignaciones.map(a => 
        a.camareroId === camareroId ? { 
          ...a, 
          estado: 'rechazado',
          eliminacionProgramada: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString() // 5 horas
        } : a
      );
      await kv.set(pedidoId, { ...pedido, asignaciones });
      
      console.log(`‚ùå RECHAZO: Camarero ${camarero?.nombre} ${camarero?.apellido} rechaz√≥ el evento "${pedido.cliente}"`);
      console.log(`   Estado actualizado: rechazado`);
      console.log(`   Eliminaci√≥n programada: ${new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString()}`);
      
      // Notificar al coordinador
      const nombreCamarero = camarero ? `${camarero.nombre} ${camarero.apellido}` : 'Camarero';
      const fechaEvento = new Date(pedido.diaEvento).toLocaleDateString('es-ES', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      });
      const mensajeCoordinador = `‚ùå RECHAZO DE SERVICIO\n\n${nombreCamarero} ha indicado que NO puede asistir.\n\nEvento: ${pedido.cliente}\nFecha: ${fechaEvento}\nLugar: ${pedido.lugar}\nHora: ${pedido.horaEntrada}\n\n‚ö†Ô∏è Ser√° eliminado autom√°ticamente en 5 horas.\n\nüí° ACCI√ìN REQUERIDA: Asignar un camarero de reemplazo.`;
      
      await notificarCoordinador(coordinadorId, mensajeCoordinador);
    }
    
    // Eliminar token usado
    await kv.del(`confirmacion:${token}`);
    
    return c.html(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>No Confirmado</title>
        <style>
          body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f5f5f5; }
          .container { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
          .info { color: #ea580c; font-size: 3rem; }
          h1 { color: #ea580c; margin: 1rem 0; }
          p { color: #666; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="info">‚úó</div>
          <h1>No Confirmado</h1>
          <p>Has indicado que no podr√°s asistir al evento.</p>
          <p>Ser√°s eliminado autom√°ticamente en 5 horas si no se toma acci√≥n.</p>
          <p>El coordinador ha sido notificado para buscar un reemplazo.</p>
          <p>Gracias por tu respuesta.</p>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.log('Error al procesar no confirmaci√≥n:', error);
    return c.html(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error</title>
        <style>
          body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f5f5f5; }
          .container { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
          .error { color: #dc2626; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="error">‚ùå Error</h1>
          <p>Ha ocurrido un error al procesar tu respuesta.</p>
        </div>
      </body>
      </html>
    `);
  }
});

// ============== CHATS GRUPALES ==============
// Crear chat grupal cuando todos confirmen
app.post('/crear-chat-grupal', async (c) => {
  try {
    const { pedidoId, coordinadorId } = await c.req.json();
    
    const pedido = await kv.get(pedidoId);
    if (!pedido) {
      return c.json({ success: false, error: 'Pedido no encontrado' });
    }
    
    // Verificar que todos hayan confirmado
    const asignaciones = pedido.asignaciones || [];
    const todosConfirmados = asignaciones.length > 0 && asignaciones.every(a => a.estado === 'confirmado');
    
    if (!todosConfirmados) {
      return c.json({ success: false, error: 'No todos han confirmado a√∫n' });
    }
    
    // Verificar si ya existe un chat para este pedido
    const chatIdExistente = `chat:${pedidoId}`;
    const chatExistente = await kv.get(chatIdExistente);
    
    if (chatExistente) {
      return c.json({ success: true, chatId: chatIdExistente, alreadyExists: true });
    }
    
    // Crear el chat
    const chatId = `chat:${pedidoId}`;
    
    // Calcular fecha de eliminaci√≥n programada (24h despu√©s del evento)
    const fechaEvento = new Date(pedido.diaEvento);
    const horaFin = pedido.horaSalida || '23:59'; // Usar hora de salida o fin del d√≠a
    const [horaFinH, horaFinM] = horaFin.split(':');
    fechaEvento.setHours(parseInt(horaFinH), parseInt(horaFinM), 0, 0);
    const fechaEliminacion = new Date(fechaEvento.getTime() + 24 * 60 * 60 * 1000); // +24 horas
    
    // Construir lista de miembros seg√∫n esquema
    const miembros = [
      {
        user_id: coordinadorId,
        nombre: pedido.coordinadorNombre || 'Coordinador',
        rol: 'coordinador'
      },
      ...asignaciones.map(a => ({
        user_id: a.camareroId,
        nombre: a.camareroNombre,
        rol: 'camarero'
      }))
    ];
    
    const chat = {
      id: chatId,
      pedido_id: pedidoId,
      nombre: `${pedido.cliente} - ${pedido.lugar}`,
      descripcion: `Evento: ${pedido.cliente} en ${pedido.lugar}`,
      fecha_evento: pedido.diaEvento,
      hora_fin_evento: pedido.horaSalida || '23:59',
      miembros,
      activo: true,
      fecha_eliminacion_programada: fechaEliminacion.toISOString(),
      // Campos adicionales para compatibilidad con c√≥digo existente
      pedidoId,
      coordinadorId,
      camareroIds: asignaciones.map(a => a.camareroId),
      fechaCreacion: new Date().toISOString(),
      fechaEvento: pedido.diaEvento,
      cliente: pedido.cliente,
      lugar: pedido.lugar,
      horaEntrada: pedido.horaEntrada,
      estado: 'activo'
    };
    
    await kv.set(chatId, chat);
    
    // Inicializar array de mensajes vac√≠o
    await kv.set(`${chatId}:mensajes`, []);
    
    return c.json({ success: true, chatId, chat });
  } catch (error) {
    console.log('Error al crear chat grupal:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Diagn√≥stico completo de chats
app.get('/diagnostico-chats', async (c) => {
  try {
    console.log('üîç === EJECUTANDO DIAGN√ìSTICO COMPLETO DE CHATS ===');
    
    // Obtener todos los datos relevantes - MIGRADO A SQL
    const todosLosChats = await db.obtenerChats(supabase);
    const todosLosCoordinadores = await db.obtenerCoordinadores(supabase);
    const todosLosPedidos = await db.obtenerPedidos(supabase);
    
    const ahora = new Date();
    
    // Informaci√≥n de coordinadores
    const infoCoordinadores = todosLosCoordinadores.map(coord => ({
      id: coord.id,
      nombre: coord.nombre,
      codigo: coord.codigo,
      telefono: coord.telefono
    }));
    
    // Informaci√≥n de chats con c√°lculo de expiraci√≥n
    const infoChats = todosLosChats.map(chat => {
      let fechaExpiracion;
      
      if (chat.fecha_eliminacion_programada) {
        fechaExpiracion = new Date(chat.fecha_eliminacion_programada);
      } else {
        const fechaEvento = new Date(chat.fecha_evento);
        const horaSalida = chat.hora_fin_evento || '23:59';
        const [hora, minutos] = horaSalida.split(':');
        fechaEvento.setHours(parseInt(hora), parseInt(minutos), 0, 0);
        fechaExpiracion = new Date(fechaEvento.getTime() + 24 * 60 * 60 * 1000);
      }
      
      const expirado = ahora >= fechaExpiracion;
      const horasRestantes = (fechaExpiracion.getTime() - ahora.getTime()) / (1000 * 60 * 60);
      
      return {
        id: chat.id,
        coordinadorId: chat.coordinador_id,
        pedidoId: chat.pedido_id,
        titulo: chat.titulo,
        fechaEvento: chat.fecha_evento,
        fechaCreacion: chat.created_at,
        fechaExpiracion: fechaExpiracion.toISOString(),
        expirado,
        horasRestantes: Math.round(horasRestantes * 10) / 10,
        numeroMensajes: chat.mensajes?.length || 0
      };
    });
    
    // Informaci√≥n de eventos con confirmaciones - MEJORADA
    // Nota: Necesitamos obtener asignaciones para cada pedido
    const infoEventos = [];
    
    for (const pedido of todosLosPedidos) {
      const asignaciones = await db.obtenerAsignaciones(supabase, pedido.id);
      
      if (asignaciones.length === 0) continue;
      
      const totalCamareros = asignaciones.length;
      const confirmados = asignaciones.filter(a => a.estado === 'confirmado').length;
      const todosConfirmados = confirmados === totalCamareros && totalCamareros > 0;
      const tieneChat = todosLosChats.some(chat => chat.pedido_id === pedido.id);
      
      const detalleAsignaciones = asignaciones.map(a => ({
        camareroCodigo: a.camarero_codigo,
        estado: a.estado
      }));
      
      infoEventos.push({
        pedidoId: pedido.id,
        cliente: pedido.cliente,
        lugar: pedido.lugar,
        fechaEvento: pedido.dia_evento,
        totalCamareros,
        confirmados,
        todosConfirmados,
        tieneChat,
        coordinadorId: pedido.coordinador,
        tieneCoordinadorId: !!pedido.coordinador,
        asignaciones: detalleAsignaciones
      });
    }
    
    // Agrupar chats por coordinador
    const chatsPorCoordinador = {};
    for (const chat of infoChats) {
      if (!chatsPorCoordinador[chat.coordinadorId]) {
        chatsPorCoordinador[chat.coordinadorId] = [];
      }
      chatsPorCoordinador[chat.coordinadorId].push(chat);
    }
    
    const diagnostico = {
      timestamp: ahora.toISOString(),
      resumen: {
        totalCoordinadores: infoCoordinadores.length,
        totalChats: infoChats.length,
        chatsActivos: infoChats.filter(c => !c.expirado).length,
        chatsExpirados: infoChats.filter(c => c.expirado).length,
        eventosConAsignaciones: infoEventos.length,
        eventosCompletos: infoEventos.filter(e => e.todosConfirmados).length,
        eventosConChat: infoEventos.filter(e => e.tieneChat).length,
        // NUEVO
        eventosCompletosSinChat: infoEventos.filter(e => e.todosConfirmados && !e.tieneChat).length,
        eventosSinCoordinadorId: infoEventos.filter(e => !e.tieneCoordinadorId).length
      },
      coordinadores: infoCoordinadores,
      chats: infoChats,
      chatsPorCoordinador,
      eventos: infoEventos,
      posiblesProblemas: []
    };
    
    // Detectar problemas potenciales
    for (const evento of infoEventos) {
      if (evento.todosConfirmados && !evento.tieneChat) {
        const problema = {
          tipo: 'CHAT_FALTANTE',
          mensaje: `Evento "${evento.cliente}" tiene todos confirmados pero no tiene chat`,
          pedidoId: evento.pedidoId,
          cliente: evento.cliente,
          // NUEVO: Informaci√≥n adicional
          coordinadorId: evento.coordinadorId,
          tieneCoordinadorId: evento.tieneCoordinadorId
        };
        
        if (!evento.tieneCoordinadorId) {
          problema.mensaje += ' (‚ö†Ô∏è NO TIENE coordinadorId - esta es la causa)';
        }
        
        diagnostico.posiblesProblemas.push(problema);
      }
    }
    
    if (infoChats.length > 0 && infoCoordinadores.length > 0) {
      for (const chat of infoChats) {
        const coordinadorExiste = infoCoordinadores.some(c => c.id === chat.coordinadorId);
        if (!coordinadorExiste) {
          diagnostico.posiblesProblemas.push({
            tipo: 'COORDINADOR_NO_EXISTE',
            mensaje: `Chat "${chat.cliente}" tiene un coordinadorId que no existe: ${chat.coordinadorId}`,
            chatId: chat.id,
            coordinadorId: chat.coordinadorId
          });
        }
      }
    }
    
    console.log('üìä DIAGN√ìSTICO COMPLETO:', JSON.stringify(diagnostico, null, 2));
    
    return c.json({ success: true, diagnostico });
  } catch (error) {
    console.log('‚ùå Error en diagn√≥stico:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Reparar chats faltantes autom√°ticamente
app.post('/reparar-chats', async (c) => {
  try {
    console.log('üîß === INICIANDO REPARACI√ìN DE CHATS (SQL) ===');
    
    const { pedidosIds, coordinadorIdPorDefecto } = await c.req.json();
    
    if (!pedidosIds || !Array.isArray(pedidosIds) || pedidosIds.length === 0) {
      return c.json({ 
        success: false, 
        error: 'Se requiere un array de pedidosIds' 
      });
    }
    
    const resultados = [];
    
    for (const pedidoId of pedidosIds) {
      try {
        const pedido = await db.obtenerPedidoPorId(supabase, pedidoId);
        
        if (!pedido) {
          resultados.push({
            pedidoId,
            success: false,
            error: 'Pedido no encontrado'
          });
          continue;
        }
        
        // Obtener asignaciones del pedido
        const asignaciones = await db.obtenerAsignaciones(supabase, pedidoId);
        const todosConfirmados = asignaciones.length > 0 && asignaciones.every(a => a.estado === 'confirmado');
        
        if (!todosConfirmados) {
          resultados.push({
            pedidoId,
            success: false,
            error: 'No todos los camareros han confirmado'
          });
          continue;
        }
        
        // Verificar si ya existe un chat para este pedido
        const chatsExistentes = await db.obtenerChats(supabase);
        const chatExistente = chatsExistentes.find(c => c.pedido_id === pedidoId);
        
        if (chatExistente) {
          resultados.push({
            pedidoId,
            success: true,
            accion: 'Ya existe',
            chatId: chatExistente.id
          });
          continue;
        }
        
        // Determinar coordinadorId
        let coordinadorId = pedido.coordinador || coordinadorIdPorDefecto;
        
        if (!coordinadorId) {
          resultados.push({
            pedidoId,
            success: false,
            error: 'No se puede determinar coordinadorId'
          });
          continue;
        }
        
        // Crear el chat
        const fechaEvento = new Date(pedido.dia_evento);
        const horaFin = pedido.hora_salida || '23:59';
        const [horaFinH, horaFinM] = horaFin.split(':');
        fechaEvento.setHours(parseInt(horaFinH), parseInt(horaFinM), 0, 0);
        const fechaEliminacion = new Date(fechaEvento.getTime() + 24 * 60 * 60 * 1000);
        
        const chat = await db.crearChat(supabase, {
          pedido_id: pedidoId,
          coordinador_id: coordinadorId,
          titulo: `${pedido.cliente} - ${pedido.lugar}`,
          fecha_evento: pedido.dia_evento,
          hora_fin_evento: pedido.hora_salida || '23:59',
          fecha_eliminacion_programada: fechaEliminacion.toISOString(),
          mensajes: []
        });
        
        console.log(`‚úÖ Chat creado para pedido ${pedidoId}: ${pedido.cliente}`);
        
        resultados.push({
          pedidoId,
          success: true,
          accion: 'Creado',
          chatId: chat.id,
          cliente: pedido.cliente,
          coordinadorId
        });
        
      } catch (error) {
        resultados.push({
          pedidoId,
          success: false,
          error: String(error)
        });
      }
    }
    
    const resumen = {
      total: resultados.length,
      creados: resultados.filter(r => r.accion === 'Creado').length,
      yaExistian: resultados.filter(r => r.accion === 'Ya existe').length,
      fallidos: resultados.filter(r => !r.success).length
    };
    
    console.log('üîß RESUMEN DE REPARACI√ìN:', resumen);
    
    return c.json({ 
      success: true, 
      resumen,
      resultados 
    });
  } catch (error) {
    console.log('‚ùå Error al reparar chats:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Obtener chats del coordinador (con limpieza autom√°tica de expirados)
app.get('/chats/:coordinadorId', async (c) => {
  try {
    const coordinadorId = c.req.param('coordinadorId');
    console.log(`üîç Buscando chats para coordinadorId: ${coordinadorId}`);
    
    // Usar SQL en lugar de KV
    const todosLosChats = await db.obtenerChatsPorCoordinador(supabase, coordinadorId);
    console.log(`üîç Total de chats para coordinador ${coordinadorId}: ${todosLosChats.length}`);
    
    // Limpiar chats expirados (24 horas despu√©s del evento + hora de salida)
    const ahora = new Date();
    const chatsActivos = [];
    
    for (const chat of todosLosChats) {
      // Usar fecha_eliminacion_programada si existe, sino calcular desde fecha_evento + hora
      let fechaExpiracion;
      
      if (chat.fecha_eliminacion_programada) {
        fechaExpiracion = new Date(chat.fecha_eliminacion_programada);
      } else {
        // Fallback: calcular desde fecha_evento + hora de salida + 24h
        const fechaEvento = new Date(chat.fecha_evento);
        const horaSalida = chat.hora_fin_evento || '23:59';
        const [hora, minutos] = horaSalida.split(':');
        fechaEvento.setHours(parseInt(hora), parseInt(minutos), 0, 0);
        fechaExpiracion = new Date(fechaEvento.getTime() + 24 * 60 * 60 * 1000);
      }
      
      // Si a√∫n no ha expirado, mantenerlo
      if (ahora < fechaExpiracion) {
        chatsActivos.push(chat);
      } else {
        // Eliminar chat expirado
        await db.eliminarChat(supabase, chat.id);
        console.log(`üóëÔ∏è Chat eliminado por expiraci√≥n: ${chat.id} - Expir√≥ el ${fechaExpiracion.toISOString()}`);
      }
    }
    
    console.log(`üìä Chats activos para coordinador ${coordinadorId}: ${chatsActivos.length} de ${todosLosChats.length}`);
    
    return c.json({ success: true, data: chatsActivos });
  } catch (error) {
    console.log('Error al obtener chats:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Enviar mensaje al chat
app.post('/chat-mensaje', async (c) => {
  try {
    const { chatId, mensaje, remitente, remitenteNombre } = await c.req.json();
    
    const nuevoMensaje = {
      id: `msg:${Date.now()}`,
      remitente, // coordinadorId o camareroId
      remitenteNombre,
      mensaje,
      fecha: new Date().toISOString()
    };
    
    // Agregar mensaje usando SQL
    await db.agregarMensajeAlChat(supabase, chatId, nuevoMensaje);
    
    return c.json({ success: true, mensaje: nuevoMensaje });
  } catch (error) {
    console.log('Error al enviar mensaje:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============== ENV√çO DE EMAIL ==============

// Funci√≥n para generar PDF del parte de servicio
async function generarPDFParte(pedido: any, parteHTML: string): Promise<string> {
  try {
    // Usar jsPDF en lugar de PDFKit para evitar warnings de readFileSync
    const { jsPDF } = await import('npm:jspdf@2.5.1');
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Configuraci√≥n de fuentes y estilos
    const pageWidth = 210; // A4 width in mm
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    
    let yPos = 20;
    
    // T√≠tulo
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('PARTE DE SERVICIO', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;
    
    // L√≠nea separadora
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;
    
    // Informaci√≥n del evento en dos columnas
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    
    // Columna izquierda
    doc.text('Cliente:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(pedido.cliente, margin + 30, yPos);
    
    // Columna derecha
    doc.setFont('helvetica', 'bold');
    doc.text('Lugar del evento:', pageWidth / 2 + 10, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(pedido.lugar, pageWidth / 2 + 50, yPos, { maxWidth: 70 });
    
    yPos += 8;
    
    // Segunda fila
    doc.setFont('helvetica', 'bold');
    doc.text('D√≠a:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    const fechaEvento = new Date(pedido.diaEvento).toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    doc.text(fechaEvento, margin + 30, yPos, { maxWidth: 70 });
    
    doc.setFont('helvetica', 'bold');
    doc.text('Hora entrada:', pageWidth / 2 + 10, yPos);
    doc.setFont('helvetica', 'normal');
    const horaTexto = pedido.horaEntrada2 
      ? `${pedido.horaEntrada} / ${pedido.horaEntrada2}` 
      : pedido.horaEntrada;
    doc.text(horaTexto, pageWidth / 2 + 50, yPos);
    
    yPos += 12;
    
    // L√≠nea separadora
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;
    
    // Tabla de camareros
    doc.setFontSize(9);
    
    const tableStartY = yPos;
    const colWidths = [60, 30, 30, 25, 35]; // Anchos en mm
    const rowHeight = 8;
    const headers = ['Camarero', 'Hora Entrada', 'Hora Salida', 'Total', 'Observaciones'];
    
    // Encabezados
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPos, contentWidth, rowHeight, 'FD');
    
    let xPos = margin;
    for (let i = 0; i < headers.length; i++) {
      doc.text(headers[i], xPos + 2, yPos + 5.5);
      xPos += colWidths[i];
    }
    
    yPos += rowHeight;
    
    // Filas de camareros
    doc.setFont('helvetica', 'normal');
    const camareros = pedido.asignaciones || [];
    const totalFilas = Math.max(8, camareros.length);
    
    for (let i = 0; i < totalFilas; i++) {
      const asignacion = camareros[i];
      
      // Dibujar borde de la fila
      doc.rect(margin, yPos, contentWidth, rowHeight);
      
      xPos = margin;
      
      if (asignacion) {
        const camareroText = `#${asignacion.camareroNumero} - ${asignacion.camareroNombre}`;
        doc.text(camareroText, xPos + 2, yPos + 5.5, { maxWidth: colWidths[0] - 4 });
        xPos += colWidths[0];
        
        doc.text(pedido.horaEntrada, xPos + 2, yPos + 5.5);
      } else {
        xPos += colWidths[0];
      }
      
      // L√≠neas verticales de la tabla
      for (let j = 1; j < colWidths.length; j++) {
        doc.line(xPos, yPos, xPos, yPos + rowHeight);
        xPos += colWidths[j];
      }
      
      yPos += rowHeight;
    }
    
    // Firma del responsable
    yPos += 20;
    const firmaWidth = 80;
    const firmaHeight = 35;
    const firmaX = pageWidth - margin - firmaWidth;
    
    doc.rect(firmaX, yPos, firmaWidth, firmaHeight);
    doc.setFont('helvetica', 'normal');
    doc.text('Firma del Responsable', firmaX + firmaWidth / 2, yPos + 8, { align: 'center' });
    doc.line(firmaX + 10, yPos + firmaHeight - 5, firmaX + firmaWidth - 10, yPos + firmaHeight - 5);
    
    // Generar el PDF como base64
    const pdfBase64 = doc.output('datauristring').split(',')[1];
    return pdfBase64;
  } catch (error) {
    console.log('‚ö†Ô∏è Error al generar PDF, usando fallback...', error);
    // Retornar vac√≠o si falla, el email se enviar√° sin adjunto
    return '';
  }
}

// Funci√≥n gen√©rica para enviar emails con detecci√≥n autom√°tica de proveedor
async function enviarEmailGenerico({ destinatario, cc, asunto, htmlBody, attachments }: { 
  destinatario: string; 
  cc?: string | null; 
  asunto: string; 
  htmlBody: string;
  attachments?: Array<{ filename: string; content: string; encoding: string }>;
}) {
  // Log para diagn√≥stico (sin mostrar valores completos por seguridad)
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY');
  const mailgunApiKey = Deno.env.get('MAILGUN_API_KEY');
  const emailFrom = Deno.env.get('EMAIL_FROM') || 'onboarding@resend.dev';
  
  console.log('üîç Diagn√≥stico de variables de entorno:');
  console.log(`  RESEND_API_KEY: ${resendApiKey ? `configurada (${resendApiKey.length} chars)` : 'NO CONFIGURADA'}`);
  console.log(`  SENDGRID_API_KEY: ${sendgridApiKey ? `configurada (${sendgridApiKey.length} chars)` : 'NO CONFIGURADA'}`);
  console.log(`  MAILGUN_API_KEY: ${mailgunApiKey ? `configurada (${mailgunApiKey.length} chars)` : 'NO CONFIGURADA'}`);
  console.log(`  EMAIL_FROM: ${emailFrom}`);
  console.log(`  Adjuntos: ${attachments ? attachments.length : 0}`);
  
  // 1. Intentar con Resend (prioridad 1) - Usando SDK oficial
  if (resendApiKey) {
    try {
      console.log('üìß Intentando enviar con Resend API...');
      
      // Validar y corregir el dominio del remitente
      let fromEmail = emailFrom;
      
      // Si el dominio no es resend.dev y es un dominio com√∫n no verificado, usar el por defecto
      const commonUnverifiedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
      const domain = fromEmail.split('@')[1]?.toLowerCase();
      
      if (domain && commonUnverifiedDomains.includes(domain)) {
        console.log(`‚ö†Ô∏è El dominio ${domain} no est√° verificado en Resend. Usando dominio por defecto.`);
        fromEmail = 'onboarding@resend.dev';
      }
      
      // Preparar payload seg√∫n API de Resend
      const resendBody: any = {
        from: fromEmail,
        to: [destinatario],
        subject: asunto,
        html: htmlBody
      };
      
      // Agregar CC si existe
      if (cc) {
        resendBody.cc = [cc];
      }
      
      // Agregar adjuntos si existen
      if (attachments && attachments.length > 0) {
        resendBody.attachments = attachments.map(att => ({
          filename: att.filename,
          content: att.content
        }));
      }
      
      console.log('üì§ Enviando con payload:', {
        from: resendBody.from,
        to: resendBody.to,
        subject: resendBody.subject,
        hasCC: !!resendBody.cc,
        attachmentsCount: resendBody.attachments?.length || 0
      });
      
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resendBody)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        console.log('‚úÖ Email enviado con Resend:', result);
        return { success: true, provider: 'Resend', messageId: result.id };
      } else {
        console.log('‚ùå Error de Resend:', result);
        
        // Detectar error de dominio no verificado o modo sandbox
        const errorMsg = result.message || '';
        
        if (errorMsg.includes('domain is not verified') || errorMsg.includes('domain not found')) {
          throw new Error(`El dominio del email remitente no est√° verificado en Resend. Por favor, verifica tu dominio en https://resend.com/domains o usa el dominio por defecto (onboarding@resend.dev).`);
        }
        
        // Detectar error de modo sandbox (solo puede enviar a email del propietario)
        if (errorMsg.includes('You can only send testing emails')) {
          const match = errorMsg.match(/\((.*?)\)/);
          const ownerEmail = match ? match[1] : 'tu email registrado';
          throw new Error(`‚ö†Ô∏è MODO SANDBOX ACTIVO: Resend solo permite enviar emails a ${ownerEmail} hasta que verifiques un dominio en https://resend.com/domains`);
        }
        
        throw new Error(result.message || 'Error al enviar con Resend');
      }
    } catch (error) {
      console.log('‚ö†Ô∏è Resend fall√≥, intentando siguiente proveedor...', error);
      console.error('Error completo de Resend:', error);
    }
  }
  
  // 2. Intentar con SendGrid (prioridad 2)
  if (sendgridApiKey) {
    try {
      console.log('üìß Intentando enviar con SendGrid...');
      const sendgridBody: any = {
        personalizations: [{
          to: [{ email: destinatario }],
          subject: asunto
        }],
        from: { email: emailFrom },
        content: [{
          type: 'text/html',
          value: htmlBody
        }]
      };
      
      if (cc) {
        sendgridBody.personalizations[0].cc = [{ email: cc }];
      }
      
      // Agregar adjuntos si existen
      if (attachments && attachments.length > 0) {
        sendgridBody.attachments = attachments.map(att => ({
          content: att.content,
          filename: att.filename,
          type: 'application/pdf',
          disposition: 'attachment'
        }));
      }
      
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sendgridApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendgridBody)
      });
      
      if (response.ok) {
        console.log('‚úÖ Email enviado con SendGrid');
        return { success: true, provider: 'SendGrid' };
      } else {
        const errorText = await response.text();
        console.log('‚ùå Error de SendGrid:', errorText);
        throw new Error('Error al enviar con SendGrid');
      }
    } catch (error) {
      console.log('‚ö†Ô∏è SendGrid fall√≥, intentando siguiente proveedor...', error);
    }
  }
  
  // 3. Intentar con Mailgun (prioridad 3)
  const mailgunDomain = Deno.env.get('MAILGUN_DOMAIN');
  
  if (mailgunApiKey && mailgunDomain) {
    try {
      console.log('üìß Intentando enviar con Mailgun...');
      
      const formData = new FormData();
      formData.append('from', emailFrom);
      formData.append('to', destinatario);
      if (cc) {
        formData.append('cc', cc);
      }
      formData.append('subject', asunto);
      formData.append('html', htmlBody);
      
      // Agregar adjuntos si existen
      if (attachments && attachments.length > 0) {
        for (const att of attachments) {
          const buffer = Uint8Array.from(atob(att.content), c => c.charCodeAt(0));
          const blob = new Blob([buffer], { type: 'application/pdf' });
          formData.append('attachment', blob, att.filename);
        }
      }
      
      const response = await fetch(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`api:${mailgunApiKey}`)}`
        },
        body: formData
      });
      
      const result = await response.json();
      
      if (response.ok) {
        console.log('‚úÖ Email enviado con Mailgun:', result);
        return { success: true, provider: 'Mailgun', messageId: result.id };
      } else {
        console.log('‚ùå Error de Mailgun:', result);
        throw new Error(result.message || 'Error al enviar con Mailgun');
      }
    } catch (error) {
      console.log('‚ö†Ô∏è Mailgun fall√≥:', error);
    }
  }
  
  // Si ninguno funcion√≥
  return { 
    success: false, 
    error: 'No hay ning√∫n servicio de email configurado o todos fallaron. Por favor, configura RESEND_API_KEY, SENDGRID_API_KEY, o MAILGUN_API_KEY en las variables de entorno.' 
  };
}

// Endpoint para verificar qu√© servicio de email est√° configurado
app.get('/verificar-email-config', async (c) => {
  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY');
    const mailgunApiKey = Deno.env.get('MAILGUN_API_KEY');
    const mailgunDomain = Deno.env.get('MAILGUN_DOMAIN');
    const emailFrom = Deno.env.get('EMAIL_FROM') || 'onboarding@resend.dev';
    
    // Log detallado para debugging
    console.log('üîç DIAGN√ìSTICO COMPLETO DE EMAIL:');
    console.log(`  RESEND_API_KEY: ${resendApiKey ? `‚úì configurada (${resendApiKey.length} chars, inicia con: ${resendApiKey.substring(0, 5)}...)` : '‚úó NO CONFIGURADA'}`);
    console.log(`  SENDGRID_API_KEY: ${sendgridApiKey ? `‚úì configurada (${sendgridApiKey.length} chars)` : '‚úó NO CONFIGURADA'}`);
    console.log(`  MAILGUN_API_KEY: ${mailgunApiKey ? `‚úì configurada (${mailgunApiKey.length} chars)` : '‚úó NO CONFIGURADA'}`);
    console.log(`  MAILGUN_DOMAIN: ${mailgunDomain ? `‚úì configurado: ${mailgunDomain}` : '‚úó NO CONFIGURADO'}`);
    console.log(`  EMAIL_FROM: ${emailFrom}`);
    
    const servicios = {
      resend: !!resendApiKey,
      sendgrid: !!sendgridApiKey,
      mailgun: !!(mailgunApiKey && mailgunDomain)
    };
    
    console.log(`üìä Servicios detectados:`, servicios);
    
    let servicioActivo = null;
    if (servicios.resend) servicioActivo = 'Resend';
    else if (servicios.sendgrid) servicioActivo = 'SendGrid';
    else if (servicios.mailgun) servicioActivo = 'Mailgun';
    
    console.log(`üéØ Servicio activo seleccionado: ${servicioActivo}`);
    
    const configured = servicioActivo !== null;
    
    // Construir lista de servicios disponibles con capitalizaci√≥n correcta
    const serviciosDisponiblesList = [];
    if (servicios.resend) serviciosDisponiblesList.push('Resend');
    if (servicios.sendgrid) serviciosDisponiblesList.push('SendGrid');
    if (servicios.mailgun) serviciosDisponiblesList.push('Mailgun');
    
    console.log(`‚úÖ Configurado: ${configured}, Servicios disponibles:`, serviciosDisponiblesList);
    
    // Detectar modo sandbox de Resend
    let sandboxMode = false;
    let sandboxEmail = null;
    
    if (servicioActivo === 'Resend' && emailFrom === 'onboarding@resend.dev') {
      sandboxMode = true;
      // Intentar detectar el email del propietario haciendo una petici√≥n de prueba
      console.log('üîç Detectando modo sandbox de Resend...');
    }
    
    return c.json({
      configured,
      servicioActivo,
      serviciosDisponibles: serviciosDisponiblesList,
      emailFrom,
      sandboxMode,
      sandboxEmail,
      debug: {
        hasResend: !!resendApiKey,
        hasSendgrid: !!sendgridApiKey,
        hasMailgun: !!mailgunApiKey,
        hasMailgunDomain: !!mailgunDomain,
        resendKeyLength: resendApiKey?.length || 0
      },
      message: configured 
        ? (sandboxMode 
            ? `‚ö†Ô∏è Resend en MODO SANDBOX: Solo puedes enviar emails de prueba. Verifica un dominio en https://resend.com/domains para enviar a cualquier destinatario.`
            : `Email configurado correctamente con ${servicioActivo}`)
        : '‚ö†Ô∏è No hay ning√∫n servicio de email configurado. Si acabas de configurar las variables, espera 1-2 minutos y recarga la p√°gina para que el servidor actualice la configuraci√≥n.'
    });
  } catch (error) {
    console.log('Error al verificar configuraci√≥n de email:', error);
    return c.json({
      configured: false,
      error: String(error),
      message: 'Error al verificar la configuraci√≥n'
    }, 500);
  }
});

// Endpoint para enviar parte por email
app.post('/enviar-email-parte', async (c) => {
  try {
    const { destinatario, cc, asunto, mensaje, parteHTML, pedido } = await c.req.json();
    
    if (!destinatario || !asunto || !parteHTML) {
      return c.json({ 
        success: false, 
        error: 'Faltan campos requeridos: destinatario, asunto, parteHTML' 
      });
    }
    
    console.log('üìß Procesando env√≠o de parte de servicio...');
    console.log(`   Cliente: ${pedido?.cliente}`);
    console.log(`   Fecha: ${pedido?.fecha}`);
    
    // Construir el cuerpo del email
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        ${mensaje ? `
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <p style="color: #374151; margin: 0; white-space: pre-line;">${mensaje}</p>
          </div>
        ` : ''}
        
        <div style="margin-top: 20px; padding: 20px; background: #f9fafb; border-radius: 8px;">
          <p style="color: #374151; font-size: 14px; text-align: center;">
            üìé El parte de servicio se encuentra adjunto en formato PDF para su descarga.
          </p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
          <p><strong>Sistema de Gesti√≥n de Perfiles</strong></p>
          <p>Parte de servicio para: ${pedido.cliente}</p>
          <p>Fecha: ${pedido.fecha} | Lugar: ${pedido.lugar}</p>
          <p>Email generado autom√°ticamente - No responder</p>
        </div>
      </div>
    `;
    
    // Generar PDF del parte de servicio
    console.log('üìÑ Generando PDF del parte de servicio...');
    const pdfBase64 = await generarPDFParte(pedido, parteHTML);
    
    // Preparar adjuntos si hay PDF
    const attachments: Array<{ filename: string; content: string; encoding: string }> = [];
    if (pdfBase64) {
      const nombreArchivo = `Parte_Servicio_${pedido.cliente.replace(/\s+/g, '_')}_${pedido.fecha.replace(/\//g, '-')}.pdf`;
      attachments.push({
        filename: nombreArchivo,
        content: pdfBase64,
        encoding: 'base64'
      });
      console.log(`‚úÖ PDF generado exitosamente: ${nombreArchivo} (${Math.round(pdfBase64.length / 1024)} KB)`);
    } else {
      console.log('‚ö†Ô∏è No se pudo generar el PDF, el email se enviar√° sin adjunto');
    }
    
    // Enviar usando la funci√≥n gen√©rica
    console.log('üì§ Enviando email...');
    const result = await enviarEmailGenerico({
      destinatario,
      cc,
      asunto,
      htmlBody: emailBody,
      attachments
    });
    
    if (result.success) {
      console.log(`‚úÖ Email enviado exitosamente con ${attachments.length} adjunto(s)`);
    }
    
    return c.json(result);
  } catch (error) {
    console.log('‚ùå Error al enviar email:', error);
    return c.json({ 
      success: false, 
      error: String(error) 
    }, 500);
  }
});

// ============== VERIFICAR CONFIGURACI√ìN DE WHATSAPP ==============
app.get('/verificar-whatsapp-config', async (c) => {
  try {
    const whatsappApiKey = Deno.env.get('WHATSAPP_API_KEY');
    const whatsappPhoneId = Deno.env.get('WHATSAPP_PHONE_ID');
    
    if (!whatsappApiKey || !whatsappPhoneId) {
      return c.json({
        configured: false,
        hasToken: !!whatsappApiKey,
        phoneId: !!whatsappPhoneId,
        message: 'WhatsApp Business API no est√° configurado. Necesitas configurar WHATSAPP_API_KEY y WHATSAPP_PHONE_ID en las variables de entorno.',
        configSource: 'environment'
      });
    }
    
    // üö® VALIDACI√ìN CR√çTICA: Detectar si el token es sospechosamente corto
    if (whatsappApiKey.length < 100) {
      return c.json({
        configured: false,
        hasToken: true,
        phoneId: true,
        tokenLength: whatsappApiKey.length,
        suspiciousToken: true,
        message: '‚ö†Ô∏è ERROR: El WHATSAPP_API_KEY es demasiado corto. Un token v√°lido debe tener m√°s de 200 caracteres. Es posible que hayas usado el Phone ID como token.',
        detail: `Token actual: ${whatsappApiKey.length} caracteres. Token v√°lido: 200+ caracteres. El Phone ID es DIFERENTE del API Key.`,
        configSource: 'environment'
      });
    }
    
    // Verificar si el token y phone ID son iguales (error com√∫n)
    if (whatsappApiKey === whatsappPhoneId) {
      return c.json({
        configured: false,
        hasToken: true,
        phoneId: true,
        duplicateValues: true,
        message: '‚ö†Ô∏è ERROR: WHATSAPP_API_KEY y WHATSAPP_PHONE_ID tienen el mismo valor. Son dos credenciales DIFERENTES.',
        detail: 'El Phone ID es un n√∫mero corto (15 d√≠gitos). El API Key es un token largo (200+ caracteres que empieza con "EAA...").',
        configSource: 'environment'
      });
    }
    
    return c.json({
      configured: true,
      hasToken: true,
      phoneId: whatsappPhoneId,
      tokenLength: whatsappApiKey.length,
      message: 'WhatsApp Business API configurado correctamente',
      configSource: 'environment'
    });
  } catch (error) {
    console.log('Error al verificar configuraci√≥n WhatsApp:', error);
    return c.json({
      configured: false,
      error: String(error),
      message: 'Error al verificar la configuraci√≥n'
    }, 500);
  }
});

// ============== ENVIAR WHATSAPP ==============
app.post('/enviar-whatsapp', async (c) => {
  try {
    const { telefono, mensaje } = await c.req.json();
    
    if (!telefono || !mensaje) {
      return c.json({
        success: false,
        error: 'Faltan campos requeridos: telefono y mensaje'
      }, 400);
    }
    
    const whatsappApiKey = Deno.env.get('WHATSAPP_API_KEY');
    const whatsappPhoneId = Deno.env.get('WHATSAPP_PHONE_ID');
    
    if (!whatsappApiKey || !whatsappPhoneId) {
      return c.json({
        success: false,
        needsConfiguration: true,
        error: 'WhatsApp Business API no est√° configurado',
        debugInfo: {
          configSource: 'environment',
          tokenLength: whatsappApiKey ? whatsappApiKey.length : 0,
          phoneId: whatsappPhoneId || null
        }
      });
    }
    
    // Limpiar n√∫mero de tel√©fono (remover espacios, guiones, etc.)
    let numeroLimpio = telefono.replace(/\D/g, '');
    
    // Si el n√∫mero tiene 9 d√≠gitos, agregar prefijo de Espa√±a (34)
    if (numeroLimpio.length === 9) {
      numeroLimpio = '34' + numeroLimpio;
    }
    
    console.log(`üì± Enviando WhatsApp a ${numeroLimpio}`);
    
    // Enviar mensaje usando WhatsApp Business API
    const response = await fetch(`https://graph.facebook.com/v18.0/${whatsappPhoneId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${whatsappApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: numeroLimpio,
        type: 'text',
        text: {
          body: mensaje
        }
      })
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.log('‚ùå Error de WhatsApp API:', result);
      return c.json({
        success: false,
        error: result.error?.message || 'Error al enviar mensaje por WhatsApp',
        needsConfiguration: result.error?.code === 190, // Token inv√°lido
        debugInfo: {
          httpStatus: response.status,
          whatsappError: result.error,
          phoneId: whatsappPhoneId,
          tokenLength: whatsappApiKey.length,
          tokenPrefix: whatsappApiKey.substring(0, 20) + '...'
        }
      });
    }
    
    console.log('‚úÖ WhatsApp enviado exitosamente:', result);
    return c.json({
      success: true,
      messageId: result.messages?.[0]?.id,
      data: result
    });
    
  } catch (error) {
    console.log('‚ùå Error al enviar WhatsApp:', error);
    return c.json({
      success: false,
      error: String(error)
    }, 500);
  }
});

// ============== CHAT GRUPAL ==============
// Obtener mensajes de un chat grupal
app.get('/chat-mensajes/:chatId', async (c) => {
  try {
    const chatId = c.req.param('chatId');
    const mensajes = await kv.getByPrefix(`chat-mensaje:${chatId}:`);
    
    // Ordenar por timestamp
    const mensajesOrdenados = mensajes.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    return c.json({
      success: true,
      data: mensajesOrdenados
    });
  } catch (error) {
    console.log('Error al obtener mensajes del chat:', error);
    return c.json({
      success: false,
      error: String(error)
    }, 500);
  }
});

// Crear mensaje en chat grupal
app.post('/chat-mensajes', async (c) => {
  try {
    const mensaje = await c.req.json();
    const key = `chat-mensaje:${mensaje.chatId}:${mensaje.id}`;
    
    await kv.set(key, mensaje);
    
    return c.json({
      success: true,
      data: mensaje
    });
  } catch (error) {
    console.log('Error al crear mensaje en chat:', error);
    return c.json({
      success: false,
      error: String(error)
    }, 500);
  }
});

// ============== CHATBOT DE WHATSAPP ==============

import {
  CHATBOT_FLOW,
  ConversationState,
  processUserResponse,
  replaceVariables,
  formatOptions
} from './chatbot-flow.ts';

// Webhook de verificaci√≥n de WhatsApp
app.get('/whatsapp-webhook', async (c) => {
  try {
    const mode = c.req.query('hub.mode');
    const token = c.req.query('hub.verify_token');
    const challenge = c.req.query('hub.challenge');

    const verifyToken = Deno.env.get('WHATSAPP_VERIFY_TOKEN');

    if (mode === 'subscribe' && token === verifyToken) {
      console.log('‚úÖ Webhook verificado correctamente');
      return c.text(challenge || '');
    } else {
      console.error('‚ùå Verificaci√≥n fallida');
      return c.json({ error: 'Token inv√°lido' }, 403);
    }
  } catch (error) {
    console.error('Error en verificaci√≥n de webhook:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Webhook para recibir mensajes de WhatsApp
app.post('/whatsapp-webhook', async (c) => {
  try {
    const body = await c.req.json();
    console.log('üì± Mensaje recibido de WhatsApp:', JSON.stringify(body, null, 2));

    // Extraer informaci√≥n del mensaje
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (!messages || messages.length === 0) {
      console.log('‚ÑπÔ∏è Webhook recibido pero sin mensajes (puede ser notificaci√≥n de estado)');
      return c.json({ success: true, message: 'No hay mensajes para procesar' });
    }

    const message = messages[0];
    const from = message.from; // N√∫mero de tel√©fono del usuario
    const messageText = message.text?.body || '';
    const messageId = message.id;

    console.log(`üì® Mensaje de ${from}: "${messageText}"`);

    // Obtener o crear el estado de la conversaci√≥n
    let state: ConversationState | null = await kv.get(`conversation:${from}`);

    if (!state || messageText.toLowerCase() === 'menu' || messageText.toLowerCase() === 'inicio') {
      // Nueva conversaci√≥n o reseteo
      state = {
        userId: from,
        phone: from,
        currentStep: 'menu_inicial',
        data: {},
        lastUpdate: Date.now()
      };
      await kv.set(`conversation:${from}`, state);

      // Enviar mensaje de bienvenida
      const step = CHATBOT_FLOW['menu_inicial'];
      let responseText = step.text;
      
      if (step.options) {
        responseText += '\n\n' + formatOptions(step.options);
      }

      await sendWhatsAppMessage(from, responseText);
      return c.json({ success: true, message: 'Conversaci√≥n iniciada' });
    }

    // Procesar la respuesta del usuario
    const currentStep = CHATBOT_FLOW[state.currentStep];
    
    if (!currentStep) {
      console.error(`‚ùå Paso no encontrado: ${state.currentStep}`);
      await sendWhatsAppMessage(from, '‚ö†Ô∏è Ha ocurrido un error. Escribe "menu" para reiniciar.');
      return c.json({ success: false, error: 'Paso no encontrado' });
    }

    const result = processUserResponse(messageText, currentStep, state);

    if (result.error) {
      // Error de validaci√≥n
      await sendWhatsAppMessage(from, result.error);
      return c.json({ success: true, message: 'Error de validaci√≥n enviado' });
    }

    // Actualizar el estado con los nuevos datos
    if (result.data) {
      state.data = { ...state.data, ...result.data };
    }

    // Pasar al siguiente paso
    const nextStepId = result.nextStep;

    if (!nextStepId) {
      // Fin del flujo
      if (state.currentStep === 'enviar_formulario' && state.data.confirmed) {
        // Crear el pedido
        await crearPedidoDesdeWhatsApp(state.data, from);
      }

      const finalStep = CHATBOT_FLOW[state.currentStep];
      if (finalStep.type === 'message') {
        const responseText = replaceVariables(finalStep.text, state.data);
        await sendWhatsAppMessage(from, responseText);
      }

      // Resetear la conversaci√≥n
      await kv.del(`conversation:${from}`);
      return c.json({ success: true, message: 'Flujo completado' });
    }

    const nextStep = CHATBOT_FLOW[nextStepId];

    if (!nextStep) {
      console.error(`‚ùå Siguiente paso no encontrado: ${nextStepId}`);
      await sendWhatsAppMessage(from, '‚ö†Ô∏è Ha ocurrido un error. Escribe "menu" para reiniciar.');
      return c.json({ success: false, error: 'Siguiente paso no encontrado' });
    }

    // Actualizar el estado actual
    state.currentStep = nextStepId;
    state.lastUpdate = Date.now();

    // Ejecutar acciones personalizadas
    if (nextStep.type === 'customAction' && nextStep.action === 'googleMapsSearch') {
      const query = replaceVariables(nextStep.params?.query || '', state.data);
      const mapsResults = await searchGoogleMaps(query);
      state.mapsResults = mapsResults;
      
      // Pasar autom√°ticamente al siguiente paso (confirmaci√≥n de ubicaci√≥n)
      state.currentStep = nextStep.next || 'menu_inicial';
      await kv.set(`conversation:${from}`, state);

      // Enviar las opciones de ubicaci√≥n
      const confirmStep = CHATBOT_FLOW[state.currentStep];
      let responseText = confirmStep.text + '\n\n';
      mapsResults.forEach((result, idx) => {
        responseText += `${idx + 1}. ${result.name}\n`;
      });

      await sendWhatsAppMessage(from, responseText);
      return c.json({ success: true, message: 'B√∫squeda de Maps completada' });
    }

    // Guardar el estado actualizado
    await kv.set(`conversation:${from}`, state);

    // Enviar el mensaje del siguiente paso
    let responseText = replaceVariables(nextStep.text, state.data);
    
    if (nextStep.type === 'options' && nextStep.options) {
      responseText += '\n\n' + formatOptions(nextStep.options);
    }

    await sendWhatsAppMessage(from, responseText);

    return c.json({ success: true, message: 'Mensaje procesado' });

  } catch (error) {
    console.error('‚ùå Error procesando webhook de WhatsApp:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Funci√≥n auxiliar para enviar mensajes de WhatsApp
async function sendWhatsAppMessage(to: string, message: string): Promise<void> {
  const phoneId = Deno.env.get('WHATSAPP_PHONE_ID');
  const apiKey = Deno.env.get('WHATSAPP_API_KEY');

  if (!phoneId || !apiKey) {
    console.error('‚ùå WhatsApp no configurado');
    return;
  }

  const url = `https://graph.facebook.com/v17.0/${phoneId}/messages`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: message }
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('‚úÖ Mensaje de WhatsApp enviado:', result);
    } else {
      console.error('‚ùå Error enviando mensaje de WhatsApp:', result);
    }
  } catch (error) {
    console.error('‚ùå Error en sendWhatsAppMessage:', error);
  }
}

// Funci√≥n para buscar ubicaciones en Google Maps
async function searchGoogleMaps(query: string): Promise<Array<{ name: string; url: string }>> {
  try {
    // Crear URL de b√∫squeda de Google Maps
    const baseUrl = 'https://www.google.com/maps/search/';
    const encodedQuery = encodeURIComponent(query);
    const mapsUrl = `${baseUrl}?api=1&query=${encodedQuery}`;

    // Retornar resultado √∫nico (podr√≠amos integrar con la API de Google Places en el futuro)
    return [
      {
        name: query,
        url: mapsUrl
      }
    ];
  } catch (error) {
    console.error('‚ùå Error buscando en Google Maps:', error);
    return [
      {
        name: query,
        url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
      }
    ];
  }
}

// Funci√≥n para crear un pedido desde WhatsApp
async function crearPedidoDesdeWhatsApp(data: Record<string, any>, phone: string): Promise<void> {
  try {
    console.log('üìù Creando pedido desde WhatsApp:', data);

    // Convertir fecha de DD/MM/AAAA a AAAA-MM-DD
    const [day, month, year] = data.fecha_evento.split('/');
    const fechaISO = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

    // Generar n√∫mero de pedido
    const pedidos = await kv.getByPrefix('pedido:');
    const numeros = pedidos.map((p: any) => {
      const match = p.numero?.match(/PED(\d+)/);
      return match ? parseInt(match[1]) : 0;
    });
    const maxNum = Math.max(0, ...numeros);
    const numeroPedido = `PED${String(maxNum + 1).padStart(3, '0')}`;

    // Crear el pedido
    const pedidoId = `pedido:${Date.now()}`;
    const pedido = {
      id: pedidoId,
      numero: numeroPedido,
      cliente: data.cliente,
      lugar: data.lugar_evento,
      ubicacion: data.ubicacion_maps || '',
      diaEvento: fechaISO,
      cantidadCamareros: parseInt(data.cantidad_camareros) || 1,
      horaEntrada: data.hora_evento,
      horaSalida: '', // No se pregunta en el flujo
      totalHoras: '',
      cantidadCamareros2: 0,
      horaEntrada2: '',
      horaSalida2: '',
      totalHoras2: '',
      catering: 'no',
      camisa: data.color_camisa || 'negra',
      notas: `Pedido creado v√≠a WhatsApp\nüì± Tel√©fono: ${data.telefono_contacto}\nüìß Email: ${data.mail_contacto}\n\nOrigen: ${phone}`,
      coordinadorId: '',
      coordinadorNombre: '',
      asignaciones: []
    };

    await kv.set(pedidoId, pedido);
    console.log('‚úÖ Pedido creado exitosamente:', numeroPedido);

    // Crear cliente si no existe
    const clientes = await kv.getByPrefix('cliente:');
    const clienteExiste = clientes.some((c: any) => c.nombre === data.cliente);

    if (!clienteExiste) {
      const clienteId = `cliente:${Date.now()}`;
      const cliente = {
        id: clienteId,
        nombre: data.cliente,
        telefono: data.telefono_contacto,
        email: data.mail_contacto,
        direccion: data.lugar_evento
      };
      await kv.set(clienteId, cliente);
      console.log('‚úÖ Cliente creado:', data.cliente);
    }

  } catch (error) {
    console.error('‚ùå Error creando pedido desde WhatsApp:', error);
  }
}

// ============== UTILIDADES - LIMPIEZA DE DATOS ==============
app.delete('/limpiar-datos', requireSecret, async (c) => {
  try {
    const { categorias } = await c.req.json();
    console.log('üßπ Iniciando limpieza de datos:', categorias);

    const resultados: any = {
      success: true,
      eliminados: {}
    };

    // Limpiar pedidos
    if (categorias.includes('pedidos')) {
      const pedidos = await kv.getByPrefix('pedido:');
      for (const pedido of pedidos) {
        await kv.del(pedido.id);
      }
      resultados.eliminados.pedidos = pedidos.length;
      console.log(`   ‚úÖ Eliminados ${pedidos.length} pedidos`);
    }

    // Limpiar chats grupales
    if (categorias.includes('chats')) {
      const chats = await db.obtenerChats(supabase);
      for (const chat of chats) {
        await db.eliminarChat(supabase, chat.id);
      }
      resultados.eliminados.chats = chats.length;
      console.log(`   ‚úÖ Eliminados ${chats.length} chats grupales`);
    }

    // Limpiar mensajes de chats
    if (categorias.includes('mensajes')) {
      const mensajes = await kv.getByPrefix('chat-mensaje:');
      for (const mensaje of mensajes) {
        await kv.del(mensaje.id);
      }
      resultados.eliminados.mensajes = mensajes.length;
      console.log(`   ‚úÖ Eliminados ${mensajes.length} mensajes de chats`);
    }

    // Limpiar conversaciones de chatbot
    if (categorias.includes('conversaciones')) {
      const conversaciones = await kv.getByPrefix('conversation:');
      for (const conv of conversaciones) {
        await kv.del(conv.id);
      }
      resultados.eliminados.conversaciones = conversaciones.length;
      console.log(`   ‚úÖ Eliminadas ${conversaciones.length} conversaciones de chatbot`);
    }

    console.log('‚úÖ Limpieza completada:', resultados.eliminados);
    return c.json(resultados);

  } catch (error) {
    console.error('‚ùå Error en limpieza de datos:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============== DIAGN√ìSTICO DE WHATSAPP ==============
// Endpoint para diagnosticar configuraci√≥n de WhatsApp
app.get('/diagnostico-whatsapp', async (c) => {
  console.log('üîç Ejecutando diagn√≥stico de WhatsApp...');
  
  const whatsappApiKey = Deno.env.get('WHATSAPP_API_KEY');
  const whatsappPhoneId = Deno.env.get('WHATSAPP_PHONE_ID');
  
  const diagnostico = {
    configured: !!whatsappApiKey && !!whatsappPhoneId,
    apiKeyPresent: !!whatsappApiKey,
    apiKeyLength: whatsappApiKey ? whatsappApiKey.length : 0,
    apiKeyPrefix: whatsappApiKey ? whatsappApiKey.substring(0, 10) + '...' : 'No configurado',
    phoneIdPresent: !!whatsappPhoneId,
    phoneIdValue: whatsappPhoneId || 'No configurado',
    timestamp: new Date().toISOString()
  };
  
  console.log('üìä Resultado del diagn√≥stico:', diagnostico);
  
  return c.json(diagnostico);
});

// ============== ENV√çOS - MENSAJES GRUPALES ==============
// Enviar mensaje de confirmaci√≥n a todos los camareros asignados a un evento
app.post('/enviar-mensaje-grupal', async (c) => {
  try {
    const { pedidoId, mensaje } = await c.req.json();
    console.log('üì§ Enviando mensaje grupal para pedido:', pedidoId);
    
    const pedido = await kv.get(pedidoId);
    if (!pedido) {
      console.log('‚ùå Pedido no encontrado:', pedidoId);
      return c.json({ success: false, error: 'Pedido no encontrado' });
    }
    
    const asignaciones = pedido.asignaciones || [];
    if (asignaciones.length === 0) {
      console.log('‚ùå No hay camareros asignados al pedido');
      return c.json({ success: false, error: 'No hay camareros asignados' });
    }
    
    const whatsappApiKey = Deno.env.get('WHATSAPP_API_KEY');
    const whatsappPhoneId = Deno.env.get('WHATSAPP_PHONE_ID');
    
    console.log('üîç Verificando configuraci√≥n de WhatsApp...');
    console.log('   WHATSAPP_API_KEY:', whatsappApiKey ? `‚úÖ Configurado (${whatsappApiKey.substring(0, 10)}...)` : '‚ùå No configurado');
    console.log('   WHATSAPP_PHONE_ID:', whatsappPhoneId ? `‚úÖ Configurado (${whatsappPhoneId})` : '‚ùå No configurado');
    
    if (!whatsappApiKey || !whatsappPhoneId) {
      const errorMsg = `WhatsApp no configurado correctamente. Faltan: ${!whatsappApiKey ? 'WHATSAPP_API_KEY ' : ''}${!whatsappPhoneId ? 'WHATSAPP_PHONE_ID' : ''}`;
      console.log('‚ùå', errorMsg);
      return c.json({ success: false, error: errorMsg });
    }
    
    const resultados = [];
    let exitosos = 0;
    let fallidos = 0;
    
    for (const asignacion of asignaciones) {
      try {
        const camarero = await kv.get(asignacion.camareroId);
        
        if (!camarero || !camarero.telefono) {
          console.log(`‚ö†Ô∏è Camarero ${asignacion.camareroNombre} sin tel√©fono`);
          fallidos++;
          resultados.push({ 
            camarero: asignacion.camareroNombre,
            exito: false,
            error: 'Sin tel√©fono registrado'
          });
          continue;
        }
        
        // Limpiar n√∫mero de tel√©fono
        let numeroLimpio = camarero.telefono.replace(/\D/g, '');
        if (numeroLimpio.length === 9) {
          numeroLimpio = '34' + numeroLimpio;
        }
        
        console.log(`üì± Enviando a ${camarero.nombre} ${camarero.apellido} - Tel: ${numeroLimpio}`);
        
        // Enviar mensaje por WhatsApp
        const response = await fetch(`https://graph.facebook.com/v18.0/${whatsappPhoneId}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${whatsappApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: numeroLimpio,
            type: 'text',
            text: {
              body: mensaje
            }
          })
        });
        
        const result = await response.json();
        
        if (response.ok) {
          console.log(`‚úÖ Mensaje enviado a ${camarero.nombre} ${camarero.apellido}`);
          exitosos++;
          resultados.push({ 
            camarero: `${camarero.nombre} ${camarero.apellido}`,
            telefono: numeroLimpio,
            exito: true 
          });
        } else {
          const errorDetalle = result.error?.message || JSON.stringify(result.error) || 'Error desconocido de WhatsApp API';
          console.log(`‚ùå Error enviando a ${camarero.nombre}: ${errorDetalle}`);
          
          // Detectar si es error de lista permitida (modo desarrollo)
          let errorMostrar = errorDetalle;
          if (errorDetalle.includes('not in allowed list') || errorDetalle.includes('#131030')) {
            errorMostrar = 'Tu cuenta de WhatsApp est√° en modo desarrollo. Agrega este n√∫mero a la lista permitida en Meta Business.';
          }
          
          fallidos++;
          resultados.push({ 
            camarero: `${camarero.nombre} ${camarero.apellido}`,
            telefono: numeroLimpio,
            exito: false,
            error: errorMostrar
          });
        }
      } catch (error) {
        console.log(`‚ùå Error procesando camarero ${asignacion.camareroNombre}:`, error);
        fallidos++;
        resultados.push({ 
          camarero: asignacion.camareroNombre,
          exito: false,
          error: String(error)
        });
      }
    }
    
    console.log(`üìä Resumen: ${exitosos} exitosos, ${fallidos} fallidos`);
    console.log('üìã Detalles:', JSON.stringify(resultados, null, 2));
    
    // Si no hubo exitosos, devolver error detallado
    if (exitosos === 0 && fallidos > 0) {
      const primerError = resultados.find(r => !r.exito)?.error || 'Todos los env√≠os fallaron';
      
      // Detectar tipo de error predominante
      const hayErroresWhatsApp = resultados.some(r => !r.exito && (r.error.includes('modo desarrollo') || r.error.includes('#131030') || r.error.includes('not in allowed list')));
      const hayErroresTelefono = resultados.some(r => !r.exito && r.error.includes('Sin tel√©fono'));
      
      let mensajeError = primerError;
      if (hayErroresWhatsApp && hayErroresTelefono) {
        mensajeError = `M√∫ltiples errores: WhatsApp en modo desarrollo y perfiles sin tel√©fono. ${primerError}`;
      } else if (hayErroresWhatsApp) {
        mensajeError = `#131030 - WhatsApp en modo desarrollo. Agrega los n√∫meros a la lista permitida o actualiza a producci√≥n.`;
      } else if (hayErroresTelefono) {
        mensajeError = `Algunos perfiles no tienen tel√©fono registrado. Actual√≠zalos en la secci√≥n Personal.`;
      }
      
      return c.json({ 
        success: false,
        error: `No se pudo enviar a ning√∫n camarero. ${mensajeError}`,
        exitosos: 0,
        fallidos,
        total: asignaciones.length,
        resultados
      });
    }
    
    return c.json({ 
      success: exitosos > 0,
      exitosos,
      fallidos,
      total: asignaciones.length,
      resultados
    });
  } catch (error) {
    console.log('‚ùå Error al enviar mensaje grupal:', error);
    return c.json({ success: false, error: `Error del servidor: ${String(error)}` }, 500);
  }
});

// ============== ENV√çOS - PARTES DE SERVICIO ==============
// Enviar parte de servicio por WhatsApp y/o Email
app.post('/enviar-parte', async (c) => {
  try {
    const { eventoId, clienteEmails, clienteTelefonos, mensaje } = await c.req.json();
    console.log('üìã Enviando parte de servicio para evento:', eventoId);
    console.log('üìß Emails cliente:', clienteEmails);
    console.log('üì± Tel√©fonos cliente:', clienteTelefonos);
    console.log('üìù Mensaje length:', mensaje?.length);
    
    // 1. Obtener datos completos del evento del KV store
    console.log('üîç Obteniendo datos del evento desde KV store...');
    console.log('   EventoId recibido:', eventoId);
    console.log('   Tipo de eventoId:', typeof eventoId);
    
    // Intentar primero con la clave directa (como se guarda normalmente)
    let pedidoData = await kv.get(eventoId);
    console.log('   B√∫squeda directa con:', eventoId, '-> Resultado:', pedidoData ? 'ENCONTRADO ‚úÖ' : 'NO ENCONTRADO ‚ùå');
    
    // Si no se encuentra, intentar con prefijo "pedido:"
    if (!pedidoData && !eventoId.startsWith('pedido:')) {
      const pedidoKey = `pedido:${eventoId}`;
      console.log('   Intentando con prefijo:', pedidoKey);
      pedidoData = await kv.get(pedidoKey);
      console.log('   B√∫squeda con prefijo -> Resultado:', pedidoData ? 'ENCONTRADO ‚úÖ' : 'NO ENCONTRADO ‚ùå');
    }
    
    // Si a√∫n no se encuentra, intentar sin prefijo si ven√≠a con √©l
    if (!pedidoData && eventoId.startsWith('pedido:')) {
      const sinPrefijo = eventoId.replace('pedido:', '');
      console.log('   Intentando sin prefijo:', sinPrefijo);
      pedidoData = await kv.get(sinPrefijo);
      console.log('   B√∫squeda sin prefijo -> Resultado:', pedidoData ? 'ENCONTRADO ‚úÖ' : 'NO ENCONTRADO ‚ùå');
    }
    
    // Si todav√≠a no se encuentra, listar todas las claves para debug
    if (!pedidoData) {
      console.error('‚ùå Error: Evento no encontrado en ning√∫n intento');
      console.log('   Listando algunas claves en KV store para debug...');
      try {
        const allData = await kv.getByPrefix('');
        const first10 = allData.slice(0, 10);
        console.log('   Total de registros en KV:', allData.length);
        console.log('   Primeros 10 registros:', first10.map((item: any) => ({
          id: item.id,
          numero: item.numero,
          cliente: item.cliente?.substring(0, 20)
        })));
      } catch (e) {
        console.log('   No se pudieron listar claves:', e);
      }
      
      return c.json({
        success: false,
        error: `No se pudo obtener los datos del evento. ID buscado: ${eventoId}`
      });
    }
    
    console.log('‚úÖ Evento obtenido:', pedidoData.numero, pedidoData.cliente);
    console.log('   Asignaciones en pedido:', pedidoData.asignaciones?.length || 0);
    
    // 2. Preparar datos para el PDF (las asignaciones ya est√°n en el pedido)
    const pedidoParaPDF = {
      ...pedidoData,
      asignaciones: pedidoData.asignaciones || []
    };
    
    const resultados = {
      whatsapp: { enviados: 0, fallidos: 0, errores: [] },
      email: { enviados: 0, fallidos: 0, errores: [] }
    };
    
    // 4. Generar el PDF del parte de servicio
    console.log('üìÑ Generando PDF del parte de servicio...');
    let pdfBase64 = '';
    try {
      pdfBase64 = await generarPDFParte(pedidoParaPDF, '');
      if (pdfBase64) {
        console.log('‚úÖ PDF generado correctamente');
      } else {
        console.log('‚ö†Ô∏è PDF no se pudo generar, se enviar√° sin adjunto');
      }
    } catch (pdfError) {
      console.error('‚ùå Error al generar PDF:', pdfError);
    }
    
    // Enviar por WhatsApp si hay tel√©fonos
    if (clienteTelefonos && Array.isArray(clienteTelefonos) && clienteTelefonos.length > 0) {
      console.log(`üì± Intentando enviar por WhatsApp a ${clienteTelefonos.length} n√∫mero(s)...`);
      
      const whatsappApiKey = Deno.env.get('WHATSAPP_API_KEY');
      const whatsappPhoneId = Deno.env.get('WHATSAPP_PHONE_ID');
      
      console.log('üîë WhatsApp configurado:', !!whatsappApiKey && !!whatsappPhoneId);
      
      if (whatsappApiKey && whatsappPhoneId) {
        for (const telefono of clienteTelefonos) {
          try {
            // Limpiar n√∫mero de tel√©fono
            let numeroLimpio = telefono.replace(/\D/g, '');
            if (numeroLimpio.length === 9) {
              numeroLimpio = '34' + numeroLimpio;
            }
            
            console.log('üì± Enviando a n√∫mero:', numeroLimpio);
            
            const response = await fetch(`https://graph.facebook.com/v18.0/${whatsappPhoneId}/messages`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${whatsappApiKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: numeroLimpio,
                type: 'text',
                text: {
                  body: mensaje
                }
              })
            });
            
            const result = await response.json();
            console.log('üì± WhatsApp response status:', response.status);
            console.log('üì± WhatsApp response:', result);
            
            if (response.ok) {
              console.log(`‚úÖ Parte enviado por WhatsApp a ${telefono}`);
              resultados.whatsapp.enviados++;
            } else {
              console.log(`‚ùå Error enviando por WhatsApp a ${telefono}:`, result);
              resultados.whatsapp.fallidos++;
              resultados.whatsapp.errores.push({
                telefono,
                error: result.error?.message || 'Error desconocido'
              });
            }
          } catch (error) {
            console.log(`‚ùå Error en env√≠o por WhatsApp a ${telefono}:`, error);
            resultados.whatsapp.fallidos++;
            resultados.whatsapp.errores.push({
              telefono,
              error: String(error)
            });
          }
        }
      } else {
        console.log('‚ö†Ô∏è WhatsApp no configurado');
        resultados.whatsapp.errores.push({ error: 'WhatsApp no configurado' });
      }
    } else {
      console.log('‚ö†Ô∏è No hay tel√©fonos de cliente para WhatsApp');
    }
    
    // Enviar por Email si hay emails
    if (clienteEmails && Array.isArray(clienteEmails) && clienteEmails.length > 0) {
      console.log(`üìß Intentando enviar por Email a ${clienteEmails.length} direcci√≥n(es)...`);
      
      // Crear el mensaje HTML profesional para el email
      const fechaEvento = new Date(pedidoData.diaEvento).toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
            .info-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .info-item { margin: 10px 0; }
            .info-label { font-weight: bold; color: #667eea; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; border-radius: 0 0 10px 10px; }
            .pdf-notice { background: #e8f4f8; border: 2px dashed #3b82f6; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">üìã Parte de Servicio</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Evento: ${pedidoData.numero}</p>
            </div>
            
            <div class="content">
              <p>Hola,</p>
              <p>Te enviamos el parte de servicio del evento:</p>
              
              <div class="info-box">
                <div class="info-item">
                  <span class="info-label">üè¢ Cliente:</span> ${pedidoData.cliente}
                </div>
                <div class="info-item">
                  <span class="info-label">üìÖ Fecha:</span> ${fechaEvento}
                </div>
                <div class="info-item">
                  <span class="info-label">üìç Lugar:</span> ${pedidoData.lugar}
                </div>
                <div class="info-item">
                  <span class="info-label">üïê Hora de entrada:</span> ${pedidoData.horaEntrada}
                </div>
              </div>
              
              <div class="pdf-notice">
                <p style="margin: 0; color: #1e40af; font-weight: bold;">
                  üìé El parte de servicio en formato PDF se encuentra adjunto a este correo
                </p>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #374151;">
                  Puedes imprimirlo, firmarlo y devolverlo
                </p>
              </div>
              
              <p>Puedes devolver el parte de servicio firmado.</p>
              <p>Gracias por tu atenci√≥n.</p>
              
              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                Saludos cordiales,<br>
                <strong>Sistema de Gesti√≥n de Camareros</strong>
              </p>
            </div>
            
            <div class="footer">
              <p style="margin: 0;">Este es un email autom√°tico del sistema de gesti√≥n</p>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #999;">
                Generado el ${new Date().toLocaleString('es-ES')}
              </p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      for (const email of clienteEmails) {
        try {
          // Preparar adjunto del PDF si existe
          const attachments = pdfBase64 ? [{
            filename: `Parte_Servicio_${pedidoData.numero}.pdf`,
            content: pdfBase64,
            encoding: 'base64'
          }] : undefined;
          
          const emailResult = await enviarEmailGenerico({
            destinatario: email,
            asunto: `Parte de Servicio - ${pedidoData.cliente} - ${new Date(pedidoData.diaEvento).toLocaleDateString('es-ES')}`,
            htmlBody: emailHtml,
            attachments: attachments
          });
          
          console.log(`üìß Email result para ${email}:`, emailResult);
          
          if (emailResult.success) {
            console.log(`‚úÖ Parte enviado por Email a ${email}`);
            resultados.email.enviados++;
          } else {
            console.log(`‚ùå Error enviando por Email a ${email}:`, emailResult.error);
            resultados.email.fallidos++;
            resultados.email.errores.push({
              email,
              error: emailResult.error
            });
          }
        } catch (error) {
          console.log(`‚ùå Error en env√≠o por Email a ${email}:`, error);
          resultados.email.fallidos++;
          resultados.email.errores.push({
            email,
            error: String(error)
          });
        }
      }
    } else {
      console.log('‚ö†Ô∏è No hay emails de cliente');
    }
    
    const totalEnviados = resultados.whatsapp.enviados + resultados.email.enviados;
    const success = totalEnviados > 0;
    
    console.log('üìä Resultado final:', { success, totalEnviados, resultados });
    
    let mensaje_respuesta = '';
    if (success) {
      const partes = [];
      if (resultados.whatsapp.enviados > 0) {
        partes.push(`WhatsApp: ${resultados.whatsapp.enviados} enviado(s)`);
      }
      if (resultados.email.enviados > 0) {
        partes.push(`Email: ${resultados.email.enviados} enviado(s)`);
      }
      mensaje_respuesta = `Parte enviado correctamente - ${partes.join(', ')}`;
    } else {
      mensaje_respuesta = 'No se pudo enviar el parte por ning√∫n canal';
    }
    
    return c.json({ 
      success,
      resultados,
      mensaje: mensaje_respuesta
    });
  } catch (error) {
    console.log('‚ùå Error al enviar parte:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============== C√ìDIGOS QR PARA CONTROL DE ENTRADA/SALIDA ==============

// Generar o obtener token QR para un pedido
app.get('/pedidos/:id/qr-token', async (c) => {
  try {
    const pedidoId = c.req.param('id');
    
    const pedido = await db.obtenerPedidoPorId(supabase, pedidoId);
    
    if (!pedido) {
      return c.json({ success: false, error: 'Pedido no encontrado' }, 404);
    }
    
    // Obtener o crear token
    const qrToken = await db.obtenerOCrearQRTokenPorPedido(supabase, pedidoId);
    
    // Generar URL apuntando al frontend de la aplicaci√≥n
    const frontendUrl = c.req.url.replace('/functions/v1/make-server-ce05fe95/pedidos/', '/qr-scan/').replace(`/${pedidoId}/qr-token`, '');
    const qrUrl = `${frontendUrl}${qrToken.token}`;
    
    return c.json({ 
      success: true, 
      token: qrToken.token,
      url: qrUrl
    });
  } catch (error) {
    console.error('Error al generar token QR:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Regenerar token QR para un pedido
app.post('/pedidos/:id/qr-regenerate', requireSecret, async (c) => {
  try {
    const pedidoId = c.req.param('id');
    
    const pedido = await db.obtenerPedidoPorId(supabase, pedidoId);
    
    if (!pedido) {
      return c.json({ success: false, error: 'Pedido no encontrado' }, 404);
    }
    
    // Regenerar token (desactiva el anterior y crea uno nuevo)
    const qrToken = await db.regenerarQRToken(supabase, pedidoId);
    
    // Generar URL apuntando al frontend de la aplicaci√≥n
    const frontendUrl = c.req.url.replace('/functions/v1/make-server-ce05fe95/pedidos/', '/qr-scan/').replace(`/${pedidoId}/qr-regenerate`, '');
    const qrUrl = `${frontendUrl}${qrToken.token}`;
    
    return c.json({ 
      success: true, 
      token: qrToken.token,
      url: qrUrl
    });
  } catch (error) {
    console.error('Error al regenerar token QR:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Validar token QR y obtener informaci√≥n del pedido
app.get('/qr-scan/:token', async (c) => {
  try {
    const token = c.req.param('token');
    
    const qrToken = await db.obtenerQRTokenPorToken(supabase, token);
    
    if (!qrToken) {
      return c.json({ success: false, error: 'C√≥digo QR no v√°lido o expirado' }, 404);
    }
    
    const pedido = await db.obtenerPedidoPorId(supabase, qrToken.pedido_id);
    const asignaciones = await db.obtenerAsignaciones(supabase, qrToken.pedido_id);
    
    return c.json({ 
      success: true, 
      pedido: {
        id: pedido.id,
        numero: pedido.codigo,
        cliente: pedido.cliente,
        tipoEvento: pedido.tipo_evento,
        diaEvento: pedido.dia_evento,
        horaEntrada: pedido.hora_entrada,
        horaSalida: pedido.hora_salida,
        lugar: pedido.lugar,
        asignaciones: asignaciones
      }
    });
  } catch (error) {
    console.error('Error al validar token QR:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Registrar entrada/salida mediante QR
app.post('/qr-scan/:token/registro', async (c) => {
  try {
    const token = c.req.param('token');
    const { camareroId, camareroCodigo, tipo } = await c.req.json(); // tipo: 'entrada' | 'salida'
    
    const qrToken = await db.obtenerQRTokenPorToken(supabase, token);
    
    if (!qrToken) {
      return c.json({ success: false, error: 'C√≥digo QR no v√°lido' }, 404);
    }
    
    // Obtener el c√≥digo del camarero (puede venir como camareroId o camareroCodigo)
    let codigo = camareroCodigo;
    if (!codigo && camareroId) {
      // Si viene el ID antiguo, intentar buscar por ID o email
      const camareros = await db.obtenerCamareros(supabase);
      const camarero = camareros.find(c => c.id === camareroId || c.email === camareroId);
      if (camarero) {
        codigo = camarero.codigo;
      }
    }
    
    if (!codigo) {
      return c.json({ success: false, error: 'Camarero no identificado' }, 400);
    }
    
    // Verificar que el camarero est√© asignado
    const asignaciones = await db.obtenerAsignaciones(supabase, qrToken.pedido_id);
    const asignacion = asignaciones.find(a => a.camarero_codigo === codigo);
    
    if (!asignacion) {
      return c.json({ success: false, error: 'Camarero no asignado a este evento' }, 404);
    }
    
    // Registrar asistencia
    const registro = await db.registrarAsistencia(supabase, {
      pedido_id: qrToken.pedido_id,
      camarero_codigo: codigo,
      tipo
    });
    
    // Actualizar la asignaci√≥n con la hora real
    const campoHora = tipo === 'entrada' ? 'hora_entrada_real' : 'hora_salida_real';
    await db.actualizarAsignacion(supabase, asignacion.id, {
      [campoHora]: registro.timestamp
    });
    
    return c.json({ 
      success: true, 
      mensaje: `${tipo === 'entrada' ? 'Entrada' : 'Salida'} registrada correctamente`,
      timestamp: registro.timestamp
    });
  } catch (error) {
    console.error('Error al registrar entrada/salida:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Obtener todos los registros QR de entrada/salida
app.get('/registros-qr', async (c) => {
  try {
    const pedidos = await db.obtenerPedidos(supabase);
    const camareros = await db.obtenerCamareros(supabase);
    const asignaciones = await db.obtenerAsignaciones(supabase);
    
    const registros = [];
    
    asignaciones.forEach(asignacion => {
      // Solo incluir asignaciones que tengan registro de entrada o salida
      if (asignacion.hora_entrada_real || asignacion.hora_salida_real) {
        const pedido = pedidos.find(p => p.id === asignacion.pedido_id);
        const camarero = camareros.find(c => c.codigo === asignacion.camarero_codigo);
        
        if (pedido && camarero) {
          const fechaEvento = new Date(pedido.dia_evento);
          const dias = ['Domingo', 'Lunes', 'Martes', 'Mi√©rcoles', 'Jueves', 'Viernes', 'S√°bado'];
          
          const registro = {
            id: `${pedido.id}-${camarero.codigo}`,
            pedidoId: pedido.id,
            numeroPedido: pedido.codigo,
            cliente: pedido.cliente || '',
            evento: pedido.tipo_evento || '',
            fechaEvento: pedido.dia_evento,
            fechaEventoFormateada: fechaEvento.toLocaleDateString('es-ES'),
            diaEvento: dias[fechaEvento.getDay()],
            lugar: pedido.lugar || '',
            horaEntradaPrevista: pedido.hora_entrada || '',
            horaSalidaPrevista: pedido.hora_salida || '',
            
            camareroId: camarero.id,
            codigoCamarero: camarero.codigo || '',
            nombreCamarero: `${camarero.nombre} ${camarero.apellido}`,
            telefono: camarero.telefono || '',
            
            entradaRegistrada: !!asignacion.hora_entrada_real,
            registroEntrada: asignacion.hora_entrada_real,
            salidaRegistrada: !!asignacion.hora_salida_real,
            registroSalida: asignacion.hora_salida_real,
            
            turno: asignacion.turno || '',
            estado: asignacion.estado || ''
          };
          
          // Calcular horas reales si hay registros
          if (registro.registroEntrada) {
            const horaEntrada = new Date(registro.registroEntrada);
            registro.horaEntradaReal = horaEntrada.toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            });
          }
          
          if (registro.registroSalida) {
            const horaSalida = new Date(registro.registroSalida);
            registro.horaSalidaReal = horaSalida.toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            });
          }
          
          // Calcular horas trabajadas si hay entrada y salida
          if (registro.registroEntrada && registro.registroSalida) {
            const entrada = new Date(registro.registroEntrada);
            const salida = new Date(registro.registroSalida);
            const diffMs = salida.getTime() - entrada.getTime();
            const diffHours = diffMs / (1000 * 60 * 60);
            registro.horasTrabajadas = diffHours.toFixed(2);
          }
          
          registros.push(registro);
        }
      }
    });
    
    // Ordenar por fecha de evento descendente (m√°s recientes primero)
    registros.sort((a, b) => new Date(b.fechaEvento).getTime() - new Date(a.fechaEvento).getTime());
    
    return c.json({ success: true, registros });
  } catch (error) {
    console.error('Error al obtener registros QR:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Actualizar horario de salida real manualmente
app.put('/registros-qr/:pedidoId/:camareroId/salida', async (c) => {
  try {
    const pedidoId = c.req.param('pedidoId');
    const camareroId = c.req.param('camareroId');
    const { horaSalida } = await c.req.json(); // Formato: "HH:MM"
    
    // Buscar el pedido
    const pedido = await kv.get(pedidoId);
    
    if (!pedido) {
      return c.json({ success: false, error: 'Pedido no encontrado' }, 404);
    }
    
    // Buscar la asignaci√≥n del camarero
    const asignaciones = pedido.asignaciones || [];
    const asignacionIndex = asignaciones.findIndex(a => a.camareroId === camareroId);
    
    if (asignacionIndex === -1) {
      return c.json({ success: false, error: 'Camarero no asignado a este evento' }, 404);
    }
    
    // Crear timestamp con la hora proporcionada en la fecha del evento
    const fechaEvento = new Date(pedido.diaEvento);
    const [horas, minutos] = horaSalida.split(':');
    fechaEvento.setHours(parseInt(horas), parseInt(minutos), 0, 0);
    
    // Actualizar el registro de salida
    asignaciones[asignacionIndex].registroSalida = fechaEvento.toISOString();
    asignaciones[asignacionIndex].salidaRegistrada = true;
    asignaciones[asignacionIndex].salidaEditadaManualmente = true; // Flag para indicar edici√≥n manual
    
    pedido.asignaciones = asignaciones;
    await kv.set(pedidoId, pedido);
    
    return c.json({ 
      success: true, 
      mensaje: 'Horario de salida actualizado correctamente',
      registroSalida: fechaEvento.toISOString()
    });
  } catch (error) {
    console.log('Error al actualizar horario de salida:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============== USUARIOS Y AUTENTICACI√ìN ==============

// Obtener todos los usuarios
app.get('/usuarios', async (c) => {
  try {
    const usuarios = await db.obtenerUsuarios(supabase);
    return c.json({ success: true, data: usuarios });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Crear nuevo usuario
app.post('/usuarios', async (c) => {
  try {
    const datos = await c.req.json();
    const usuario = await db.crearUsuario(supabase, datos);
    console.log('‚úÖ Usuario creado:', usuario.email, '-', usuario.rol);
    return c.json({ success: true, data: usuario });
  } catch (error) {
    console.error('‚ùå Error al crear usuario:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Login
app.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ success: false, error: 'Email y contrase√±a son requeridos' }, 400);
    }

    const usuario = await db.obtenerUsuarioPorEmail(supabase, email);
    
    if (!usuario) {
      // Respuesta gen√©rica para no revelar si el email existe
      return c.json({ success: false, error: 'Credenciales incorrectas' }, 401);
    }

    // Verificar si la contrase√±a est√° hasheada (empieza con $2) o es legacy texto plano
    let passwordValida = false;
    if (usuario.password_hash && usuario.password_hash.startsWith('$2')) {
      // Hash bcrypt ‚Äî comparaci√≥n segura
      passwordValida = await bcrypt.compare(password, usuario.password_hash);
    } else {
      // Legacy texto plano ‚Äî comparar y migrar al hash autom√°ticamente
      passwordValida = usuario.password_hash === password;
      if (passwordValida) {
        // Migrar a bcrypt en este mismo login
        const nuevoHash = await bcrypt.hash(password);
        await supabase
          .from('usuarios')
          .update({ password_hash: nuevoHash })
          .eq('id', usuario.id);
        console.log('üîí Contrase√±a migrada a bcrypt para:', email);
      }
    }

    if (!passwordValida) {
      return c.json({ success: false, error: 'Credenciales incorrectas' }, 401);
    }
    
    console.log('‚úÖ Login exitoso:', email);
    
    // Retornar datos del usuario sin la contrase√±a
    return c.json({ 
      success: true, 
      user: {
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return c.json({ success: false, error: 'Error interno del servidor' }, 500);
  }
});

// Actualizar estado de usuario (activar/desactivar)
// NOTA: La tabla 'usuarios' no tiene columna 'activo' en el schema actual
// Esta ruta est√° comentada temporalmente hasta agregar la columna en SQL
/*
app.put('/usuarios/:id/estado', async (c) => {
  try {
    const id = c.req.param('id');
    const { activo } = await c.req.json();
    
    // Primero agregar la columna en Supabase SQL Editor:
    // ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;
    
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .update({ activo })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error al actualizar estado de usuario:', error);
      return c.json({ success: false, error: String(error) }, 500);
    }
    
    if (!usuario) {
      return c.json({ success: false, error: 'Usuario no encontrado' }, 404);
    }
    
    console.log(`‚úÖ Estado de usuario actualizado: ${usuario.email} - Activo: ${activo}`);
    
    return c.json({ success: true, data: usuario });
  } catch (error) {
    console.error('Error al actualizar estado de usuario:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});
*/

// Enviar email de restablecimiento de contrase√±a
app.post('/enviar-reset-password', async (c) => {
  try {
    const { email } = await c.req.json();
    
    // Buscar usuario
    const usuarios = await kv.getByPrefix('usuario:');
    const usuario = usuarios.find(u => u.email === email);
    
    if (!usuario) {
      return c.json({ success: false, error: 'Usuario no encontrado' }, 404);
    }
    
    // Generar token de reset (simple para prototipo)
    const resetToken = btoa(`${email}:${Date.now()}`);
    
    // Guardar token con expiraci√≥n de 1 hora
    const tokenId = `reset-token:${resetToken}`;
    await kv.set(tokenId, {
      email,
      token: resetToken,
      expiracion: Date.now() + 3600000, // 1 hora
      usado: false
    });
    
    // Detectar proveedor de email configurado
    const resendKey = Deno.env.get('RESEND_API_KEY');
    const mailgunKey = Deno.env.get('MAILGUN_API_KEY');
    const mailgunDomain = Deno.env.get('MAILGUN_DOMAIN');
    
    let emailEnviado = false;
    let errorEmail = '';
    
    // Intentar con Resend
    if (resendKey) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: Deno.env.get('EMAIL_FROM') || 'noreply@example.com',
            to: email,
            subject: 'Restablecer Contrase√±a - Gesti√≥n de Perfiles',
            html: `
              <h2>Restablecer Contrase√±a</h2>
              <p>Hola ${usuario.nombre},</p>
              <p>Recibimos una solicitud para restablecer tu contrase√±a.</p>
              <p><strong>Token de restablecimiento:</strong> ${resetToken}</p>
              <p>Este token expira en 1 hora.</p>
              <p>Si no solicitaste este cambio, ignora este email.</p>
            `
          })
        });
        
        if (response.ok) {
          emailEnviado = true;
        } else {
          errorEmail = await response.text();
        }
      } catch (error) {
        errorEmail = String(error);
      }
    }
    
    // Intentar con Mailgun si Resend fall√≥
    if (!emailEnviado && mailgunKey && mailgunDomain) {
      try {
        const formData = new FormData();
        formData.append('from', Deno.env.get('EMAIL_FROM') || 'noreply@example.com');
        formData.append('to', email);
        formData.append('subject', 'Restablecer Contrase√±a - Gesti√≥n de Perfiles');
        formData.append('html', `
          <h2>Restablecer Contrase√±a</h2>
          <p>Hola ${usuario.nombre},</p>
          <p>Recibimos una solicitud para restablecer tu contrase√±a.</p>
          <p><strong>Token de restablecimiento:</strong> ${resetToken}</p>
          <p>Este token expira en 1 hora.</p>
          <p>Si no solicitaste este cambio, ignora este email.</p>
        `);
        
        const response = await fetch(
          `https://api.mailgun.net/v3/${mailgunDomain}/messages`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${btoa(`api:${mailgunKey}`)}`
            },
            body: formData
          }
        );
        
        if (response.ok) {
          emailEnviado = true;
        } else {
          errorEmail = await response.text();
        }
      } catch (error) {
        errorEmail = String(error);
      }
    }
    
    if (emailEnviado) {
      console.log('‚úÖ Email de reset enviado a:', email);
      return c.json({ success: true, message: 'Email de restablecimiento enviado' });
    } else {
      console.log('‚ùå Error al enviar email de reset:', errorEmail);
      return c.json({ 
        success: false, 
        error: 'No se pudo enviar el email. Verifica la configuraci√≥n del servicio de email.' 
      }, 500);
    }
  } catch (error) {
    console.log('Error al enviar email de reset:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Obtener registros QR de un perfil espec√≠fico (por email)
app.get('/registros-perfil', async (c) => {
  try {
    const email = c.req.query('email');
    
    if (!email) {
      return c.json({ success: false, error: 'Email requerido' }, 400);
    }
    
    // Buscar el camarero por email
    const camarero = await db.obtenerCamareroPorEmail(supabase, email);
    
    if (!camarero) {
      return c.json({ success: true, registros: [] });
    }
    
    // Obtener asignaciones y pedidos
    const asignaciones = await db.obtenerAsignaciones(supabase);
    const pedidos = await db.obtenerPedidos(supabase);
    const asignacionesCamarero = asignaciones.filter(a => a.camarero_codigo === camarero.codigo);
    
    const registros = asignacionesCamarero.map(asignacion => {
      const pedido = pedidos.find(p => p.id === asignacion.pedido_id);
      
      if (!pedido) return null;
      
      const fechaEvento = new Date(pedido.dia_evento);
      const dias = ['Domingo', 'Lunes', 'Martes', 'Mi√©rcoles', 'Jueves', 'Viernes', 'S√°bado'];
      
      const registro = {
        id: `${pedido.id}-${camarero.codigo}`,
        pedidoId: pedido.id,
        numeroPedido: pedido.codigo,
        cliente: pedido.cliente || '',
        evento: pedido.tipo_evento || '',
        fechaEvento: pedido.dia_evento,
        fechaEventoFormateada: fechaEvento.toLocaleDateString('es-ES'),
        diaEvento: dias[fechaEvento.getDay()],
        lugar: pedido.lugar || '',
        
        entradaRegistrada: !!asignacion.hora_entrada_real,
        registroEntrada: asignacion.hora_entrada_real,
        salidaRegistrada: !!asignacion.hora_salida_real,
        registroSalida: asignacion.hora_salida_real,
        
        turno: asignacion.turno || '',
        estado: asignacion.estado || ''
      };
      
      // Calcular horas reales si hay registros
      if (registro.registroEntrada) {
        const horaEntrada = new Date(registro.registroEntrada);
        registro.horaEntradaReal = horaEntrada.toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      }
      
      if (registro.registroSalida) {
        const horaSalida = new Date(registro.registroSalida);
        registro.horaSalidaReal = horaSalida.toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      }
      
      // Calcular horas trabajadas si hay entrada y salida
      if (registro.registroEntrada && registro.registroSalida) {
        const entrada = new Date(registro.registroEntrada);
        const salida = new Date(registro.registroSalida);
        const diffMs = salida.getTime() - entrada.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        registro.horasTrabajadas = diffHours.toFixed(2);
      }
      
      return registro;
    }).filter(r => r !== null);
    
    // Ordenar por fecha de evento descendente (m√°s recientes primero)
    registros.sort((a, b) => new Date(b.fechaEvento).getTime() - new Date(a.fechaEvento).getTime());
    
    return c.json({ success: true, registros });
  } catch (error) {
    console.error('Error al obtener registros de perfil:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);

// Trigger redeploy - 2026-03-10 - Migration to SQL complete
