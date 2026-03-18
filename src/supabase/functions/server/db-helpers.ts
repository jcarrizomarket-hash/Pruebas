/**
 * Funciones Helper para interactuar con las tablas de Supabase
 * Reemplaza el sistema KV Store con queries SQL directas
 */
import { SupabaseClient } from 'npm:@supabase/supabase-js@2.39.3';
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts';
// ============== GENERACIÓN DE CÓDIGOS CORRELATIVOS ==============
/**
 * Genera el siguiente código correlativo para una tabla
 * Formato: PREFIJO + número (ej: CAM001, COC001, CLI001)
 */
export async function generarSiguienteCodigo(
  supabase: SupabaseClient,
  tabla: string,
  prefijo: string
): Promise<string> {
  try {
    // Obtener el último código de la tabla
    const { data, error } = await supabase
      .from(tabla)
      .select('codigo')
      .order('codigo', { ascending: false })
      .limit(1);
    if (error) throw error;
    if (!data || data.length === 0) {
      // Primera vez: retornar PREFIJO001
      return `${prefijo}001`;
    }
    // Extraer el número del último código
    const ultimoCodigo = data[0].codigo;
    const numero = parseInt(ultimoCodigo.replace(prefijo, ''), 10);
    const siguienteNumero = numero + 1;
    // Formatear con ceros a la izquierda (mínimo 3 dígitos)
    return `${prefijo}${siguienteNumero.toString().padStart(3, '0')}`;
  } catch (error) {
    console.error('Error generando código:', error);
    // Fallback: generar código con timestamp
    return `${prefijo}${Date.now()}`;
  }
}
// ============== COORDINADORES ==============
export async function obtenerCoordinadores(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('coordinadores')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}
export async function crearCoordinador(supabase: SupabaseClient, datos: any) {
  // Generar código correlativo
  const codigo = await generarSiguienteCodigo(supabase, 'coordinadores', 'COORD');
  const { data, error } = await supabase
    .from('coordinadores')
    .insert({
      codigo,
      nombre: datos.nombre,
      apellido: datos.apellido || '',
      email: datos.email,
      telefono: datos.telefono || '',
      zona: datos.zona || ''
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
export async function actualizarCoordinador(supabase: SupabaseClient, id: string, datos: any) {
  const { data, error } = await supabase
    .from('coordinadores')
    .update(datos)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
export async function eliminarCoordinador(supabase: SupabaseClient, id: string) {
  const { error } = await supabase
    .from('coordinadores')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}
// ============== CAMAREROS ==============
export async function obtenerCamareros(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('camareros')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}
export async function crearCamarero(supabase: SupabaseClient, datos: any) {
  // Determinar el prefijo según el tipo de perfil
  const tipoPerfil = datos.tipoPerfil || datos.categoria || 'Camarero';
  let prefijo = 'CAM'; // Default
  
  if (tipoPerfil.toLowerCase().includes('cocina')) prefijo = 'COC';
  else if (tipoPerfil.toLowerCase().includes('barra')) prefijo = 'BAR';
  else if (tipoPerfil.toLowerCase().includes('limpieza')) prefijo = 'LIM';
  else if (tipoPerfil.toLowerCase().includes('seguridad')) prefijo = 'SEG';
  // Generar código correlativo
  const codigo = datos.codigo || await generarSiguienteCodigo(supabase, 'camareros', prefijo);
  const { data, error } = await supabase
    .from('camareros')
    .insert({
      codigo,
      nombre: datos.nombre,
      apellido: datos.apellido || '',
      email: datos.email,
      telefono: datos.telefono || '',
      disponibilidad: datos.disponibilidad || '',
      categoria: datos.categoria || tipoPerfil,
      experiencia: datos.experiencia || ''
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
export async function actualizarCamarero(supabase: SupabaseClient, id: string, datos: any) {
  const { data, error } = await supabase
    .from('camareros')
    .update(datos)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
export async function eliminarCamarero(supabase: SupabaseClient, id: string) {
  const { error } = await supabase
    .from('camareros')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}
export async function obtenerCamareroPorEmail(supabase: SupabaseClient, email: string) {
  const { data, error } = await supabase
    .from('camareros')
    .select('*')
    .eq('email', email)
    .single();
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no encontrado
  return data;
}
export async function obtenerCamareroPorCodigo(supabase: SupabaseClient, codigo: string) {
  const { data, error } = await supabase
    .from('camareros')
    .select('*')
    .eq('codigo', codigo)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}
// ============== CLIENTES ==============
export async function obtenerClientes(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}
export async function crearCliente(supabase: SupabaseClient, datos: any) {
  const codigo = await generarSiguienteCodigo(supabase, 'clientes', 'CLI');
  const { data, error } = await supabase
    .from('clientes')
    .insert({
      codigo,
      nombre: datos.nombre,
      contacto1: datos.contacto1 || '',
      contacto2: datos.contacto2 || '',
      mail1: datos.mail1 || '',
      mail2: datos.mail2 || '',
      telefono1: datos.telefono1 || '',
      telefono2: datos.telefono2 || '',
      notas: datos.notas || ''
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
export async function actualizarCliente(supabase: SupabaseClient, id: string, datos: any) {
  const { data, error } = await supabase
    .from('clientes')
    .update(datos)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
export async function eliminarCliente(supabase: SupabaseClient, id: string) {
  const { error } = await supabase
    .from('clientes')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}
// ============== PEDIDOS/EVENTOS ==============
export async function obtenerPedidos(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}
export async function crearPedido(supabase: SupabaseClient, datos: any) {
  // Generar código correlativo
  const codigo = await generarSiguienteCodigo(supabase, 'pedidos', 'PED');
  const { data, error } = await supabase
    .from('pedidos')
    .insert({
      codigo,
      cliente: datos.cliente,
      tipo_evento: datos.tipoEvento || datos.tipo_evento,
      dia_evento: datos.diaEvento || datos.dia_evento,
      hora_entrada: datos.horaEntrada || datos.hora_entrada,
      hora_salida: datos.horaSalida || datos.hora_salida,
      lugar: datos.lugar || '',
      numero_personas: datos.numeroPersonas || datos.numero_personas || 0,
      observaciones: datos.observaciones || '',
      coordinador: datos.coordinador || '',
      estado: datos.estado || 'pendiente',
      cantidad_camareros: datos.cantidadCamareros || datos.cantidad_camareros || 0
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
export async function actualizarPedido(supabase: SupabaseClient, id: string, datos: any) {
  const { data, error } = await supabase
    .from('pedidos')
    .update(datos)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
export async function eliminarPedido(supabase: SupabaseClient, id: string) {
  const { error } = await supabase
    .from('pedidos')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}
// ============== ASIGNACIONES ==============
export async function obtenerAsignaciones(supabase: SupabaseClient, pedidoId?: string) {
  let query = supabase.from('asignaciones').select('*');
  
  if (pedidoId) {
    query = query.eq('pedido_id', pedidoId);
  }
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}
export async function crearAsignacion(supabase: SupabaseClient, datos: any) {
  const { data, error } = await supabase
    .from('asignaciones')
    .insert({
      pedido_id: datos.pedido_id || datos.pedidoId,
      camarero_codigo: datos.camarero_codigo || datos.camareroCodigo,
      estado: datos.estado || 'pendiente',
      turno: datos.turno || ''
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
export async function actualizarAsignacion(supabase: SupabaseClient, id: string, datos: any) {
  const { data, error } = await supabase
    .from('asignaciones')
    .update(datos)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
export async function eliminarAsignacion(supabase: SupabaseClient, pedidoId: string, camareroCodigo: string) {
  const { error } = await supabase
    .from('asignaciones')
    .delete()
    .eq('pedido_id', pedidoId)
    .eq('camarero_codigo', camareroCodigo);
  if (error) throw error;
  return true;
}
// ============== USUARIOS ==============
export async function obtenerUsuarios(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, nombre, email, rol, camarero_codigo, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}
export async function crearUsuario(supabase: SupabaseClient, datos: any) {
  const rawPassword = datos.password || datos.password_hash;
  if (!rawPassword) throw new Error('Se requiere una contraseña para crear el usuario.');
  const passwordHash = await bcrypt.hash(rawPassword);
  const { data, error } = await supabase
    .from('usuarios')
    .insert({
      nombre: datos.nombre,
      email: datos.email,
      password_hash: passwordHash,
      rol: datos.rol,
      camarero_codigo: datos.camarero_codigo || datos.camareroCodigo || null
    })
    .select('id, nombre, email, rol, camarero_codigo, created_at')
    .single();
  if (error) throw error;
  return data;
}
export async function obtenerUsuarioPorEmail(supabase: SupabaseClient, email: string) {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}
export async function actualizarUsuario(supabase: SupabaseClient, id: string, datos: any) {
  const { data, error } = await supabase
    .from('usuarios')
    .update(datos)
    .eq('id', id)
    .select('id, nombre, email, rol, camarero_codigo, created_at')
    .single();
  if (error) throw error;
  return data;
}
export async function eliminarUsuario(supabase: SupabaseClient, id: string) {
  const { error } = await supabase
    .from('usuarios')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}
// ============== QR TOKENS ==============
export async function crearQRToken(supabase: SupabaseClient, datos: any) {
  const { data, error } = await supabase
    .from('qr_tokens')
    .insert({
      token: datos.token,
      pedido_id: datos.pedido_id || datos.pedidoId,
      tipo: datos.tipo,
      activo: datos.activo !== undefined ? datos.activo : true,
      expira_en: datos.expira_en || datos.expiraEn
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
export async function obtenerQRTokenPorToken(supabase: SupabaseClient, token: string) {
  const { data, error } = await supabase
    .from('qr_tokens')
    .select('*')
    .eq('token', token)
    .eq('activo', true)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}
export async function obtenerOCrearQRTokenPorPedido(supabase: SupabaseClient, pedidoId: string) {
  // Buscar token existente activo
  const { data: existente, error: errorBuscar } = await supabase
    .from('qr_tokens')
    .select('*')
    .eq('pedido_id', pedidoId)
    .eq('activo', true)
    .eq('tipo', 'general')
    .maybeSingle();
  if (errorBuscar && errorBuscar.code !== 'PGRST116') throw errorBuscar;
  if (existente) {
    return existente;
  }
  // Crear nuevo token
  const token = `${pedidoId}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  
  const { data, error } = await supabase
    .from('qr_tokens')
    .insert({
      token,
      pedido_id: pedidoId,
      tipo: 'general',
      activo: true
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
export async function regenerarQRToken(supabase: SupabaseClient, pedidoId: string) {
  // Desactivar tokens anteriores
  await supabase
    .from('qr_tokens')
    .update({ activo: false })
    .eq('pedido_id', pedidoId);
  // Crear nuevo token
  const token = `${pedidoId}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  
  const { data, error } = await supabase
    .from('qr_tokens')
    .insert({
      token,
      pedido_id: pedidoId,
      tipo: 'general',
      activo: true
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
// ============== REGISTROS DE ASISTENCIA ==============
export async function registrarAsistencia(supabase: SupabaseClient, datos: any) {
  const { data, error } = await supabase
    .from('registros_asistencia')
    .insert({
      pedido_id: datos.pedido_id || datos.pedidoId,
      camarero_codigo: datos.camarero_codigo || datos.camareroCodigo,
      tipo: datos.tipo
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
export async function obtenerRegistrosAsistencia(supabase: SupabaseClient, pedidoId?: string) {
  let query = supabase.from('registros_asistencia').select('*');
  
  if (pedidoId) {
    query = query.eq('pedido_id', pedidoId);
  }
  const { data, error } = await query.order('timestamp', { ascending: false });
  if (error) throw error;
  return data || [];
}
// ============== CONFIRMACIONES ==============
export async function crearConfirmacion(supabase: SupabaseClient, datos: any) {
  const token = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  
  const { data, error } = await supabase
    .from('confirmaciones')
    .insert({
      token,
      pedido_id: datos.pedido_id || datos.pedidoId,
      camarero_codigo: datos.camarero_codigo || datos.camareroCodigo,
      estado: 'pendiente'
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
export async function obtenerConfirmacionPorToken(supabase: SupabaseClient, token: string) {
  const { data, error } = await supabase
    .from('confirmaciones')
    .select('*')
    .eq('token', token)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}
export async function actualizarConfirmacion(supabase: SupabaseClient, token: string, estado: string) {
  const { data, error } = await supabase
    .from('confirmaciones')
    .update({
      estado,
      fecha_confirmacion: new Date().toISOString()
    })
    .eq('token', token)
    .select()
    .single();
  if (error) throw error;
  return data;
}
export async function obtenerConfirmacionesPorPedido(supabase: SupabaseClient, pedidoId: string) {
  const { data, error } = await supabase
    .from('confirmaciones')
    .select('*')
    .eq('pedido_id', pedidoId);
  if (error) throw error;
  return data || [];
}
// ============== CHATS ==============
export async function obtenerChats(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}
export async function obtenerChatsPorCoordinador(supabase: SupabaseClient, coordinadorId: string) {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('coordinador_id', coordinadorId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}
export async function obtenerChatPorId(supabase: SupabaseClient, chatId: string) {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('id', chatId)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}
export async function crearChat(supabase: SupabaseClient, datos: any) {
  const { data, error } = await supabase
    .from('chats')
    .insert({
      pedido_id: datos.pedido_id || datos.pedidoId,
      coordinador_id: datos.coordinador_id || datos.coordinadorId,
      titulo: datos.titulo,
      fecha_evento: datos.fecha_evento || datos.fechaEvento,
      hora_fin_evento: datos.hora_fin_evento || datos.horaSalida,
      fecha_eliminacion_programada: datos.fecha_eliminacion_programada,
      mensajes: datos.mensajes || []
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
export async function actualizarChat(supabase: SupabaseClient, chatId: string, datos: any) {
  const { data, error } = await supabase
    .from('chats')
    .update(datos)
    .eq('id', chatId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
export async function eliminarChat(supabase: SupabaseClient, chatId: string) {
  const { error } = await supabase
    .from('chats')
    .delete()
    .eq('id', chatId);
  if (error) throw error;
  return true;
}
export async function agregarMensajeAlChat(supabase: SupabaseClient, chatId: string, mensaje: any) {
  // Primero obtenemos el chat actual
  const chatActual = await obtenerChatPorId(supabase, chatId);
  
  if (!chatActual) {
    throw new Error(`Chat ${chatId} no encontrado`);
  }
  // Agregamos el nuevo mensaje al array
  const mensajesActualizados = [...(chatActual.mensajes || []), mensaje];
  // Actualizamos el chat con los mensajes nuevos
  const { data, error } = await supabase
    .from('chats')
    .update({ mensajes: mensajesActualizados })
    .eq('id', chatId)
    .select()
    .single();
  if (error) throw error;
  return data;
}