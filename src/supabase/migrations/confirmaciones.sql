-- ============================================
-- TABLA DE CONFIRMACIONES DE ASISTENCIA
-- ============================================
-- Almacena los tokens de confirmación enviados a los camareros

CREATE TABLE IF NOT EXISTS confirmaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  camarero_codigo TEXT NOT NULL,
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmado', 'rechazado')),
  fecha_confirmacion TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_confirmaciones_token ON confirmaciones(token);
CREATE INDEX IF NOT EXISTS idx_confirmaciones_pedido ON confirmaciones(pedido_id);
CREATE INDEX IF NOT EXISTS idx_confirmaciones_camarero ON confirmaciones(camarero_codigo);

-- Constraint único: un camarero solo puede tener una confirmación por pedido
CREATE UNIQUE INDEX IF NOT EXISTS idx_confirmaciones_unique 
ON confirmaciones(pedido_id, camarero_codigo);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_confirmaciones_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_confirmaciones_updated_at
  BEFORE UPDATE ON confirmaciones
  FOR EACH ROW
  EXECUTE FUNCTION update_confirmaciones_updated_at();

-- Comentarios
COMMENT ON TABLE confirmaciones IS 'Tokens de confirmación de asistencia enviados a camareros';
COMMENT ON COLUMN confirmaciones.token IS 'Token único para el link de confirmación';
COMMENT ON COLUMN confirmaciones.estado IS 'Estado: pendiente, confirmado, rechazado';
COMMENT ON COLUMN confirmaciones.fecha_confirmacion IS 'Fecha en que el camarero confirmó/rechazó';
