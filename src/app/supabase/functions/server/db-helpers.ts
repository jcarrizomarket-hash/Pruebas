/**
 * Funciones Helper para interactuar con las tablas de Supabase
 * Reemplaza el sistema KV Store con queries SQL directas
 */

import { SupabaseClient } from 'npm:@supabase/supabase-js@2.39.3';
import * as kv from './kv_store.tsx';

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
  // Filtrar solo los campos que existen en la tabla de Supabase
  const camposValidos: any = {
    codigo: datos.codigo,
    nombre: datos.nombre,
    apellido: datos.apellido,
    email: datos.email,
    telefono: datos.telefono,
    disponibilidad: datos.disponibilidad || '',
    categoria: datos.categoria || datos.tipoPerfil || 'Camarero',
    experiencia: datos.experiencia || ''
  };

  // Eliminar campos undefined
  Object.keys(camposValidos).forEach(key => {
    if (camposValidos[key] === undefined) delete camposValidos[key];
  });

  const { data, error } = await supabase
    .from('camareros')
    .update(camposValidos)
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
  // Validar que el nombre existe
  if (!datos.nombre || datos.nombre.trim() === '') {
    throw new Error('El nombre del cliente es requerido');
  }

  // Generar código correlativo
  const codigo = await generarSiguienteCodigo(supabase, 'clientes', 'CLI');

  console.log('➕ Creando cliente con código:', codigo);
  console.log('📋 Nombre del cliente:', datos.nombre);

  // Crear cliente en la tabla SQL solo con código y nombre
  const { data, error } = await supabase
    .from('clientes')
    .insert({
      codigo,
      nombre: datos.nombre.trim()
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Error de Supabase al crear cliente:', JSON.stringify(error));
    throw new Error(`Error al crear cliente: ${error.message || JSON.stringify(error)}`);
  }

  if (!data) {
    console.error('❌ No se recibieron datos después de insertar');
    throw new Error('No se pudo crear el cliente: no se recibieron datos');
  }

  console.log('✅ Cliente insertado en SQL con ID:', data.id);

  // Guardar información de contacto en KV store
  const contactoInfo = {
    contacto_1: datos.contacto_1 || '',
    telefono_1: datos.telefono_1 || '',
    mail_1: datos.mail_1 || '',
    contacto_2: datos.contacto_2 || '',
    telefono_2: datos.telefono_2 || '',
    mail_2: datos.mail_2 || '',
    notas: datos.notas || ''
  };

  try {
    await kv.set(`cliente_contacto:${data.id}`, contactoInfo);
    console.log('✅ Información de contacto guardada en KV store');
  } catch (kvError) {
    console.error('⚠️ Error al guardar contacto en KV (no crítico):', kvError);
    // No lanzar error, el cliente ya fue creado
  }
  
  console.log('✅ Cliente creado exitosamente:', codigo);
  
  // Retornar cliente con información de contacto
  return {
    ...data,
    ...contactoInfo
  };
}

export async function actualizarCliente(supabase: SupabaseClient, id: string, datos: any) {
  console.log('🔄 Actualizando cliente ID:', id);
  
  // Actualizar solo el nombre en la tabla SQL
  const { data, error } = await supabase
    .from('clientes')
    .update({
      nombre: datos.nombre
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('❌ Error de Supabase al actualizar cliente:', JSON.stringify(error));
    throw new Error(`Error al actualizar cliente: ${error.message || JSON.stringify(error)}`);
  }
  
  if (!data) {
    throw new Error(`No se encontró el cliente con ID: ${id}`);
  }

  // Actualizar información de contacto en KV store
  const contactoInfo = {
    contacto_1: datos.contacto_1 || '',
    telefono_1: datos.telefono_1 || '',
    mail_1: datos.mail_1 || '',
    contacto_2: datos.contacto_2 || '',
    telefono_2: datos.telefono_2 || '',
    mail_2: datos.mail_2 || '',
    notas: datos.notas || ''
  };

  // Actualizar contacto en KV
  await kv.set(`cliente_contacto:${id}`, contactoInfo);
  
  console.log('✅ Cliente actualizado exitosamente:', data.codigo);
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

export async function obtenerClientePorId(supabase: SupabaseClient, id: string) {
  // Obtener cliente de SQL
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) return null;

  // Obtener información de contacto del KV store
  try {
    const contactoInfo = await kv.get(`cliente_contacto:${id}`);
    return {
      ...data,
      ...(contactoInfo || {})
    };
  } catch (kvError) {
    console.error('⚠️ Error al obtener contacto del KV store:', kvError);
    // Retornar solo los datos del SQL si falla el KV
    return data;
  }
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

  console.log('➕ Creando pedido con código:', codigo);
  console.log('📋 Datos del pedido:', JSON.stringify(datos));

  const { data, error } = await supabase
    .from('pedidos')
    .insert({
      codigo,
      cliente: datos.cliente,
      tipo_evento: datos.tipoEvento || datos.tipo_evento || '',
      dia_evento: datos.diaEvento || datos.dia_evento,
      hora_entrada: datos.horaEntrada || datos.hora_entrada || '',
      hora_salida: datos.horaSalida || datos.hora_salida || '',
      lugar: datos.lugar || '',
      numero_personas: Number(datos.numeroPersonas || datos.numero_personas || 0),
      observaciones: datos.observaciones || datos.notas || '',
      coordinador: datos.coordinador || datos.coordinadorNombre || '',
      estado: datos.estado || 'pendiente',
      cantidad_camareros: Number(datos.cantidadCamareros || datos.cantidad_camareros || 0)
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Error al crear pedido en SQL:', JSON.stringify(error));
    throw error;
  }

  console.log('✅ Pedido creado en SQL con ID:', data.id, '- Código:', data.codigo);

  // Guardar campos adicionales en KV store (campos que no están en la tabla SQL)
  const camposExtras = {
    numero: datos.numero,
    ubicacion: datos.ubicacion || '',
    // Entrada 2 (turno adicional)
    cantidadCamareros2: Number(datos.cantidadCamareros2 || 0),
    horaEntrada2: datos.horaEntrada2 || '',
    horaSalida2: datos.horaSalida2 || '',
    totalHoras: datos.totalHoras || '',
    totalHoras2: datos.totalHoras2 || '',
    // Extras
    catering: datos.catering || 'no',
    camisa: datos.camisa || 'negra',
    // Coordinador
    coordinadorId: datos.coordinadorId || '',
    coordinadorNombre: datos.coordinadorNombre || '',
    // ASIGNACIONES (crítico para gestión de pedidos)
    asignaciones: datos.asignaciones || []
  };

  try {
    await kv.set(`pedido_extras:${data.id}`, camposExtras);
    console.log('✅ Campos extras guardados en KV store');
  } catch (kvError) {
    console.error('⚠️ Error al guardar extras en KV (no crítico):', kvError);
  }

  return data;
}

export async function actualizarPedido(supabase: SupabaseClient, id: string, datos: any) {
  console.log('🔄 Actualizando pedido ID:', id);
  
  // Mapear campos del frontend (camelCase) al backend (snake_case)
  const camposPermitidos: any = {};
  
  if (datos.cliente !== undefined) camposPermitidos.cliente = datos.cliente;
  if (datos.tipoEvento !== undefined) camposPermitidos.tipo_evento = datos.tipoEvento;
  if (datos.tipo_evento !== undefined) camposPermitidos.tipo_evento = datos.tipo_evento;
  if (datos.diaEvento !== undefined) camposPermitidos.dia_evento = datos.diaEvento;
  if (datos.dia_evento !== undefined) camposPermitidos.dia_evento = datos.dia_evento;
  if (datos.horaEntrada !== undefined) camposPermitidos.hora_entrada = datos.horaEntrada;
  if (datos.hora_entrada !== undefined) camposPermitidos.hora_entrada = datos.hora_entrada;
  if (datos.horaSalida !== undefined) camposPermitidos.hora_salida = datos.horaSalida;
  if (datos.hora_salida !== undefined) camposPermitidos.hora_salida = datos.hora_salida;
  if (datos.lugar !== undefined) camposPermitidos.lugar = datos.lugar;
  if (datos.numeroPersonas !== undefined) camposPermitidos.numero_personas = Number(datos.numeroPersonas) || 0;
  if (datos.numero_personas !== undefined) camposPermitidos.numero_personas = Number(datos.numero_personas) || 0;
  if (datos.observaciones !== undefined) camposPermitidos.observaciones = datos.observaciones;
  if (datos.notas !== undefined) camposPermitidos.observaciones = datos.notas;
  if (datos.coordinador !== undefined) camposPermitidos.coordinador = datos.coordinador;
  if (datos.coordinadorNombre !== undefined) camposPermitidos.coordinador = datos.coordinadorNombre;
  if (datos.estado !== undefined) camposPermitidos.estado = datos.estado;
  if (datos.cantidadCamareros !== undefined) camposPermitidos.cantidad_camareros = Number(datos.cantidadCamareros) || 0;
  if (datos.cantidad_camareros !== undefined) camposPermitidos.cantidad_camareros = Number(datos.cantidad_camareros) || 0;
  
  // Actualizar en SQL solo los campos que existen en la tabla
  const { data, error } = await supabase
    .from('pedidos')
    .update(camposPermitidos)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('❌ Error al actualizar pedido en SQL:', JSON.stringify(error));
    throw error;
  }

  console.log('✅ Pedido actualizado en SQL');

  // Actualizar campos extras en KV store
  const camposExtras = {
    numero: datos.numero,
    ubicacion: datos.ubicacion || '',
    // Entrada 2 (turno adicional)
    cantidadCamareros2: Number(datos.cantidadCamareros2 || 0),
    horaEntrada2: datos.horaEntrada2 || '',
    horaSalida2: datos.horaSalida2 || '',
    totalHoras: datos.totalHoras || '',
    totalHoras2: datos.totalHoras2 || '',
    // Extras
    catering: datos.catering || 'no',
    camisa: datos.camisa || 'negra',
    // Coordinador
    coordinadorId: datos.coordinadorId || '',
    coordinadorNombre: datos.coordinadorNombre || '',
    // ASIGNACIONES (crítico para gestión de pedidos)
    asignaciones: datos.asignaciones || []
  };

  try {
    await kv.set(`pedido_extras:${id}`, camposExtras);
    console.log('✅ Campos extras actualizados en KV store (incluye', camposExtras.asignaciones?.length || 0, 'asignaciones)');
  } catch (kvError) {
    console.error('⚠️ Error al actualizar extras en KV (no crítico):', kvError);
  }

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

export async function obtenerPedidoPorId(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
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
  const { data, error } = await supabase
    .from('usuarios')
    .insert({
      nombre: datos.nombre,
      email: datos.email,
      password_hash: datos.password || datos.password_hash, // Nota: En producción usar bcrypt
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
  // Buscar en KV store por token
  // Como el token tiene el formato "pedidoId-timestamp-random", extraemos el pedidoId
  const pedidoId = token.split('-')[0];
  
  const tokenData = await kv.get(`qr_token:${pedidoId}`);
  
  if (!tokenData || !tokenData.activo || tokenData.token !== token) {
    return null;
  }
  
  return tokenData;
}

export async function obtenerOCrearQRTokenPorPedido(supabase: SupabaseClient, pedidoId: string) {
  console.log('🔍 Buscando token QR existente para pedido:', pedidoId);
  
  // Buscar token existente en KV store
  const existente = await kv.get(`qr_token:${pedidoId}`);

  if (existente && existente.activo) {
    console.log('✅ Token existente encontrado:', existente.token);
    return existente;
  }

  console.log('➕ Creando nuevo token QR...');
  
  // Crear nuevo token
  const token = `${pedidoId}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  
  const tokenData = {
    token,
    pedido_id: pedidoId,
    tipo: 'general',
    activo: true,
    created_at: new Date().toISOString()
  };
  
  await kv.set(`qr_token:${pedidoId}`, tokenData);
  
  console.log('✅ Nuevo token creado:', token);
  return tokenData;
}

export async function regenerarQRToken(supabase: SupabaseClient, pedidoId: string) {
  console.log('🔄 Regenerando token para pedido:', pedidoId);
  
  // Desactivar token anterior
  const existente = await kv.get(`qr_token:${pedidoId}`);
  if (existente) {
    console.log('⚠️ Desactivando token anterior:', existente.token);
  }

  console.log('➕ Creando nuevo token QR...');
  
  // Crear nuevo token
  const token = `${pedidoId}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  
  const tokenData = {
    token,
    pedido_id: pedidoId,
    tipo: 'general',
    activo: true,
    created_at: new Date().toISOString()
  };
  
  await kv.set(`qr_token:${pedidoId}`, tokenData);
  
  console.log('✅ Token regenerado exitosamente:', token);
  return tokenData;
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

// ============== SISTEMA DE ALERTAS ==============

/**
 * Obtiene los pedidos que empiezan en las próximas 3 horas
 * y que tienen asignaciones confirmadas que aún no han recibido alerta
 */
export async function obtenerPedidosParaAlerta(supabase: SupabaseClient) {
  try {
    const ahora = new Date();
    const en3Horas = new Date(ahora.getTime() + 3 * 60 * 60 * 1000);
    
    // Obtener todos los pedidos cuya fecha de evento es HOY
    const hoy = ahora.toISOString().split('T')[0];
    
    const { data: pedidos, error } = await supabase
      .from('pedidos')
      .select('*')
      .eq('dia_evento', hoy);
    
    if (error) {
      console.error('Error obteniendo pedidos para alerta:', error);
      return [];
    }
    
    if (!pedidos || pedidos.length === 0) {
      return [];
    }
    
    // Filtrar pedidos que empiezan en aproximadamente 3 horas
    const pedidosFiltrados = pedidos.filter(pedido => {
      if (!pedido.hora_entrada) return false;
      
      try {
        // Construir fecha/hora completa
        const [horas, minutos] = pedido.hora_entrada.split(':');
        const fechaHoraEvento = new Date(ahora);
        fechaHoraEvento.setHours(parseInt(horas), parseInt(minutos), 0, 0);
        
        // Calcular diferencia en minutos
        const diffMinutos = (fechaHoraEvento.getTime() - ahora.getTime()) / (1000 * 60);
        
        // Rango: entre 2:45 y 3:15 horas (165-195 minutos)
        // Esto da una ventana de 30 minutos para enviar la alerta
        return diffMinutos >= 165 && diffMinutos <= 195;
      } catch (e) {
        console.error('Error procesando hora de entrada:', pedido.hora_entrada, e);
        return false;
      }
    });
    
    return pedidosFiltrados;
  } catch (error) {
    console.error('Error en obtenerPedidosParaAlerta:', error);
    return [];
  }
}

/**
 * Verifica si ya se envió alerta para una asignación específica
 */
export async function yaSeEnvioAlerta(pedidoId: string, camareroCodigo: string): Promise<boolean> {
  try {
    const key = `alerta_enviada:${pedidoId}:${camareroCodigo}`;
    const alerta = await kv.get(key);
    return alerta !== null;
  } catch (error) {
    console.error('Error verificando alerta enviada:', error);
    return false;
  }
}

/**
 * Marca una alerta como enviada
 */
export async function marcarAlertaEnviada(pedidoId: string, camareroCodigo: string): Promise<void> {
  try {
    const key = `alerta_enviada:${pedidoId}:${camareroCodigo}`;
    await kv.set(key, {
      pedido_id: pedidoId,
      camarero_codigo: camareroCodigo,
      enviado_en: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error marcando alerta enviada:', error);
  }
}

/**
 * Obtiene las asignaciones confirmadas de un pedido
 */
export async function obtenerAsignacionesConfirmadas(supabase: SupabaseClient, pedidoId: string) {
  const { data, error } = await supabase
    .from('asignaciones')
    .select('*')
    .eq('pedido_id', pedidoId)
    .eq('estado', 'confirmado');
  
  if (error) {
    console.error('Error obteniendo asignaciones confirmadas:', error);
    return [];
  }
  
  return data || [];
}