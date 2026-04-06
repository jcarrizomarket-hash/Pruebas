/**
 * Utilidad para transformar datos de la API
 * Asegura que los datos tengan el formato correcto para el frontend
 */

export function transformCamareros(camareros: any[]) {
  if (!Array.isArray(camareros)) return [];
  
  return camareros.map(cam => ({
    ...cam,
    disponibilidad: Array.isArray(cam.disponibilidad) ? cam.disponibilidad : []
  }));
}

export function transformCamarero(camarero: any) {
  if (!camarero) return null;
  
  return {
    ...camarero,
    disponibilidad: Array.isArray(camarero.disponibilidad) ? camarero.disponibilidad : []
  };
}

export function transformPedidos(pedidos: any[]) {
  if (!Array.isArray(pedidos)) return [];
  
  return pedidos.map(p => ({
    ...p,
    numero_personas: p.numero_personas ? Number(p.numero_personas) : 0,
    cantidad_camareros: p.cantidad_camareros ? Number(p.cantidad_camareros) : 0,
    cantidadCamareros: p.cantidad_camareros ? Number(p.cantidad_camareros) : 0
  }));
}

export function transformPedido(pedido: any) {
  if (!pedido) return null;
  
  return {
    ...pedido,
    numero_personas: pedido.numero_personas ? Number(pedido.numero_personas) : 0,
    cantidad_camareros: pedido.cantidad_camareros ? Number(pedido.cantidad_camareros) : 0,
    cantidadCamareros: pedido.cantidad_camareros ? Number(pedido.cantidad_camareros) : 0
  };
}