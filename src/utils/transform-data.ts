// Utilidades para transformar datos del backend al formato esperado por el frontend

export function transformCamareros(camareros: any[]) {
  if (!Array.isArray(camareros)) return [];
  
  return camareros.map(cam => ({
    ...cam,
    // Asegurar que todos los campos booleanos estén correctamente formateados
    disponible: cam.disponible === true || cam.disponible === 'true',
    // Asegurar compatibilidad con formatos antiguos
    estado: cam.estado || 'disponible'
  }));
}

export function transformPedidos(pedidos: any[]) {
  if (!Array.isArray(pedidos)) return [];
  
  return pedidos.map(ped => ({
    ...ped,
    // Asegurar que las fechas sean strings
    fecha_evento: ped.fecha_evento || '',
    // Asegurar que los arrays estén correctamente formateados
    camareros: Array.isArray(ped.camareros) ? ped.camareros : [],
    // Normalizar estados
    estado: ped.estado || 'pendiente'
  }));
}

export function transformCoordinadores(coordinadores: any[]) {
  if (!Array.isArray(coordinadores)) return [];
  
  return coordinadores;
}

export function transformClientes(clientes: any[]) {
  if (!Array.isArray(clientes)) return [];
  
  return clientes;
}
