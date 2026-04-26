-- ============================================
-- SCHEMA COMPLETO - SISTEMA DE GESTIÓN DE CAMAREROS
-- ============================================
-- Versión: 1.0
-- Fecha: 2026-04-26
-- Descripción: Schema completo con 10 tablas estructuradas

-- ============================================
-- TABLA 1: COORDINADORES
-- ============================================
CREATE TABLE IF NOT EXISTS coordinadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  apellido TEXT DEFAULT '',
  email TEXT NOT NULL,
  telefono TEXT DEFAULT '',
  zona TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_coordinadores_codigo ON coordinadores(codigo);
CREATE INDEX IF NOT EXISTS idx_coordinadores_email ON coordinadores(email);

-- Comentarios
COMMENT ON TABLE coordinadores IS 'Coordinadores del sistema. Código formato: COORD001, COORD002...';
COMMENT ON COLUMN coordinadores.codigo IS 'Código correlativo único (COORD001, COORD002, etc.)';

-- ============================================
-- TABLA 2: CAMAREROS
-- ============================================
CREATE TABLE IF NOT EXISTS camareros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  apellido TEXT DEFAULT '',
  email TEXT NOT NULL,
  telefono TEXT DEFAULT '',
  disponibilidad TEXT DEFAULT '',
  categoria TEXT DEFAULT 'Camarero',
  experiencia TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_camareros_codigo ON camareros(codigo);
CREATE INDEX IF NOT EXISTS idx_camareros_email ON camareros(email);
CREATE INDEX IF NOT EXISTS idx_camareros_categoria ON camareros(categoria);

-- Comentarios
COMMENT ON TABLE camareros IS 'Perfiles de personal. Códigos por tipo: CAM001=Camareros, COC001=Cocina, BAR001=Barra, LIM001=Limpieza, SEG001=Seguridad';
COMMENT ON COLUMN camareros.codigo IS 'Código correlativo según tipo (CAM001, COC001, BAR001, etc.)';
COMMENT ON COLUMN camareros.categoria IS 'Tipo de perfil: Camarero, Cocina, Barra, Limpieza, Seguridad';

-- ============================================
-- TABLA 3: CLIENTES
-- ============================================
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_clientes_codigo ON clientes(codigo);

-- Comentarios
COMMENT ON TABLE clientes IS 'Clientes del sistema. Código formato: CLI001, CLI002...';
COMMENT ON COLUMN clientes.codigo IS 'Código correlativo único (CLI001, CLI002, etc.)';
COMMENT ON COLUMN clientes.nombre IS 'Nombre de la empresa/cliente';

-- NOTA: Información de contacto (contacto_1, telefono_1, mail_1, contacto_2, telefono_2, mail_2, notas)
-- se almacena en KV Store con la key: cliente_contacto:{id}

-- ============================================
-- TABLA 4: PEDIDOS/EVENTOS
-- ============================================
CREATE TABLE IF NOT EXISTS pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  cliente TEXT NOT NULL,
  tipo_evento TEXT DEFAULT '',
  dia_evento DATE NOT NULL,
  hora_entrada TIME DEFAULT NULL,
  hora_salida TIME DEFAULT NULL,
  lugar TEXT DEFAULT '',
  numero_personas INTEGER DEFAULT 0,
  observaciones TEXT DEFAULT '',
  coordinador TEXT DEFAULT '',
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmado', 'completado', 'cancelado')),
  cantidad_camareros INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_pedidos_codigo ON pedidos(codigo);
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente ON pedidos(cliente);
CREATE INDEX IF NOT EXISTS idx_pedidos_dia_evento ON pedidos(dia_evento);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_coordinador ON pedidos(coordinador);

-- Comentarios
COMMENT ON TABLE pedidos IS 'Pedidos/Eventos del sistema. Código formato: PED001, PED002...';
COMMENT ON COLUMN pedidos.codigo IS 'Código correlativo único (PED001, PED002, etc.)';
COMMENT ON COLUMN pedidos.estado IS 'Estado del pedido: pendiente, confirmado, completado, cancelado';

-- NOTA: Campos adicionales se almacenan en KV Store con la key: pedido_extras:{id}
-- Incluye: numero, ubicacion, cantidadCamareros2, horaEntrada2, horaSalida2,
-- totalHoras, totalHoras2, catering, camisa, coordinadorId, coordinadorNombre, asignaciones

-- ============================================
-- TABLA 5: ASIGNACIONES
-- ============================================
CREATE TABLE IF NOT EXISTS asignaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  camarero_codigo TEXT NOT NULL,
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmado', 'rechazado')),
  turno TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_asignaciones_pedido ON asignaciones(pedido_id);
CREATE INDEX IF NOT EXISTS idx_asignaciones_camarero ON asignaciones(camarero_codigo);
CREATE INDEX IF NOT EXISTS idx_asignaciones_estado ON asignaciones(estado);

-- Constraint único: un camarero solo puede tener una asignación por pedido
CREATE UNIQUE INDEX IF NOT EXISTS idx_asignaciones_unique
ON asignaciones(pedido_id, camarero_codigo);

-- Comentarios
COMMENT ON TABLE asignaciones IS 'Asignaciones de camareros a pedidos/eventos';
COMMENT ON COLUMN asignaciones.estado IS 'Estado: pendiente, confirmado, rechazado';
COMMENT ON COLUMN asignaciones.turno IS 'Turno asignado (ej: mañana, tarde, noche)';

-- ============================================
-- TABLA 6: USUARIOS
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  rol TEXT NOT NULL CHECK (rol IN ('admin', 'coordinador', 'camarero')),
  camarero_codigo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);
CREATE INDEX IF NOT EXISTS idx_usuarios_camarero_codigo ON usuarios(camarero_codigo);

-- Comentarios
COMMENT ON TABLE usuarios IS 'Usuarios del sistema con autenticación';
COMMENT ON COLUMN usuarios.rol IS 'Rol del usuario: admin, coordinador, camarero';
COMMENT ON COLUMN usuarios.camarero_codigo IS 'Código del camarero si rol=camarero';
COMMENT ON COLUMN usuarios.password_hash IS 'Hash bcrypt de la contraseña';

-- ============================================
-- TABLA 7: QR_TOKENS
-- ============================================
CREATE TABLE IF NOT EXISTS qr_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  tipo TEXT DEFAULT 'general' CHECK (tipo IN ('general', 'entrada', 'salida')),
  activo BOOLEAN DEFAULT true,
  expira_en TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_qr_tokens_token ON qr_tokens(token);
CREATE INDEX IF NOT EXISTS idx_qr_tokens_pedido ON qr_tokens(pedido_id);
CREATE INDEX IF NOT EXISTS idx_qr_tokens_activo ON qr_tokens(activo);

-- Comentarios
COMMENT ON TABLE qr_tokens IS 'Tokens para códigos QR de registro de asistencia';
COMMENT ON COLUMN qr_tokens.tipo IS 'Tipo de registro: general, entrada, salida';
COMMENT ON COLUMN qr_tokens.activo IS 'Si el token está activo o fue regenerado';

-- NOTA: Actualmente se usa KV Store con la key: qr_token:{pedidoId}

-- ============================================
-- TABLA 8: REGISTROS_ASISTENCIA
-- ============================================
CREATE TABLE IF NOT EXISTS registros_asistencia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  camarero_codigo TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('entrada', 'salida')),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_registros_pedido ON registros_asistencia(pedido_id);
CREATE INDEX IF NOT EXISTS idx_registros_camarero ON registros_asistencia(camarero_codigo);
CREATE INDEX IF NOT EXISTS idx_registros_timestamp ON registros_asistencia(timestamp);

-- Comentarios
COMMENT ON TABLE registros_asistencia IS 'Registro de entradas y salidas mediante código QR';
COMMENT ON COLUMN registros_asistencia.tipo IS 'Tipo de registro: entrada o salida';

-- ============================================
-- TABLA 9: CONFIRMACIONES
-- ============================================
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

-- Índices
CREATE INDEX IF NOT EXISTS idx_confirmaciones_token ON confirmaciones(token);
CREATE INDEX IF NOT EXISTS idx_confirmaciones_pedido ON confirmaciones(pedido_id);
CREATE INDEX IF NOT EXISTS idx_confirmaciones_camarero ON confirmaciones(camarero_codigo);

-- Constraint único: un camarero solo puede tener una confirmación por pedido
CREATE UNIQUE INDEX IF NOT EXISTS idx_confirmaciones_unique
ON confirmaciones(pedido_id, camarero_codigo);

-- Comentarios
COMMENT ON TABLE confirmaciones IS 'Tokens de confirmación de asistencia enviados a camareros';
COMMENT ON COLUMN confirmaciones.token IS 'Token único para el link de confirmación';
COMMENT ON COLUMN confirmaciones.estado IS 'Estado: pendiente, confirmado, rechazado';
COMMENT ON COLUMN confirmaciones.fecha_confirmacion IS 'Fecha en que el camarero confirmó/rechazó';

-- ============================================
-- TABLA 10: CHATS
-- ============================================
CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  coordinador_id UUID,
  titulo TEXT NOT NULL,
  fecha_evento DATE,
  hora_fin_evento TIME DEFAULT NULL,
  fecha_eliminacion_programada TIMESTAMPTZ,
  mensajes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_chats_pedido ON chats(pedido_id);
CREATE INDEX IF NOT EXISTS idx_chats_coordinador ON chats(coordinador_id);
CREATE INDEX IF NOT EXISTS idx_chats_fecha_evento ON chats(fecha_evento);
CREATE INDEX IF NOT EXISTS idx_chats_fecha_eliminacion ON chats(fecha_eliminacion_programada);

-- Comentarios
COMMENT ON TABLE chats IS 'Chats grupales automáticos cuando todos confirman asistencia';
COMMENT ON COLUMN chats.mensajes IS 'Array JSON de mensajes del chat';
COMMENT ON COLUMN chats.fecha_eliminacion_programada IS 'Fecha de auto-eliminación 48h después del evento';

-- ============================================
-- TRIGGERS PARA UPDATED_AT
-- ============================================

-- Función genérica para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para cada tabla
CREATE TRIGGER trigger_coordinadores_updated_at
  BEFORE UPDATE ON coordinadores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_camareros_updated_at
  BEFORE UPDATE ON camareros
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_clientes_updated_at
  BEFORE UPDATE ON clientes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_pedidos_updated_at
  BEFORE UPDATE ON pedidos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_asignaciones_updated_at
  BEFORE UPDATE ON asignaciones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_usuarios_updated_at
  BEFORE UPDATE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_confirmaciones_updated_at
  BEFORE UPDATE ON confirmaciones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_chats_updated_at
  BEFORE UPDATE ON chats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) - OPCIONAL
-- ============================================
-- Descomentar si deseas habilitar RLS

-- ALTER TABLE coordinadores ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE camareros ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE asignaciones ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE qr_tokens ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE registros_asistencia ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE confirmaciones ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS DE EJEMPLO (si usas RLS)
-- ============================================
-- CREATE POLICY "Allow all for authenticated users" ON coordinadores
--   FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================
-- 1. DATOS EN KV STORE:
--    - cliente_contacto:{id} → datos de contacto del cliente
--    - pedido_extras:{id} → campos adicionales del pedido + asignaciones
--    - qr_token:{pedidoId} → tokens QR activos
--    - alerta_enviada:{pedidoId}:{camareroCodigo} → control de alertas
--
-- 2. CÓDIGOS CORRELATIVOS:
--    - COORD001, COORD002... → Coordinadores
--    - CAM001, CAM002... → Camareros
--    - COC001, COC002... → Cocina
--    - BAR001, BAR002... → Barra
--    - LIM001, LIM002... → Limpieza
--    - SEG001, SEG002... → Seguridad
--    - CLI001, CLI002... → Clientes
--    - PED001, PED002... → Pedidos
--
-- 3. MIGRACION FUTURA:
--    - Evaluar migrar campos de KV Store a columnas JSONB en las tablas
--    - Migrar qr_tokens completamente a tabla SQL
--    - Agregar constraints de foreign key donde aplique
