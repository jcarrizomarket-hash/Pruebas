# Migraciones SQL - Sistema de Gestión de Camareros

## Estructura de la Base de Datos

Este sistema cuenta con **10 tablas SQL** estructuradas en Supabase:

### Tablas Principales

1. **coordinadores** - Gestión de coordinadores (COORD001, COORD002...)
2. **camareros** - Perfiles de personal con códigos por tipo:
   - CAM001 → Camareros
   - COC001 → Cocina
   - BAR001 → Barra
   - LIM001 → Limpieza
   - SEG001 → Seguridad
3. **clientes** - Clientes/empresas (CLI001, CLI002...)
4. **pedidos** - Eventos/pedidos (PED001, PED002...)
5. **asignaciones** - Asignación de personal a eventos
6. **usuarios** - Sistema de autenticación con roles
7. **qr_tokens** - Tokens para códigos QR de asistencia
8. **registros_asistencia** - Registro de entradas/salidas
9. **confirmaciones** - Confirmaciones de asistencia vía email
10. **chats** - Chats grupales automáticos por evento

## Archivos de Migración

- `00_schema_completo.sql` - Schema completo con todas las tablas
- `confirmaciones.sql` - Migración específica para confirmaciones (legacy)

## Cómo Aplicar las Migraciones

### Opción 1: Desde la Interfaz de Supabase (Recomendado)

1. Ir a tu proyecto en [https://app.supabase.com](https://app.supabase.com)
2. Menú lateral → **SQL Editor**
3. Copiar el contenido de `00_schema_completo.sql`
4. Pegar en el editor y hacer clic en **Run**
5. Verificar que se crearon las 10 tablas

### Opción 2: Usando Supabase CLI

```bash
# Instalar Supabase CLI (si no lo tienes)
npm install -g supabase

# Login
supabase login

# Vincular proyecto
supabase link --project-ref TU_PROJECT_REF

# Aplicar migración
supabase db push
```

### Opción 3: Programáticamente (Node.js)

```javascript
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const sql = fs.readFileSync('./00_schema_completo.sql', 'utf8')
const { error } = await supabase.rpc('exec_sql', { sql_string: sql })

if (error) console.error('Error:', error)
else console.log('✅ Migración aplicada exitosamente')
```

## Verificar las Tablas Creadas

Desde el SQL Editor de Supabase:

```sql
-- Ver todas las tablas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Contar registros en cada tabla
SELECT 
  'coordinadores' as tabla, COUNT(*) as registros FROM coordinadores
UNION ALL
SELECT 'camareros', COUNT(*) FROM camareros
UNION ALL
SELECT 'clientes', COUNT(*) FROM clientes
UNION ALL
SELECT 'pedidos', COUNT(*) FROM pedidos
UNION ALL
SELECT 'asignaciones', COUNT(*) FROM asignaciones
UNION ALL
SELECT 'usuarios', COUNT(*) FROM usuarios
UNION ALL
SELECT 'qr_tokens', COUNT(*) FROM qr_tokens
UNION ALL
SELECT 'registros_asistencia', COUNT(*) FROM registros_asistencia
UNION ALL
SELECT 'confirmaciones', COUNT(*) FROM confirmaciones
UNION ALL
SELECT 'chats', COUNT(*) FROM chats;
```

## Datos Almacenados en KV Store

Algunos campos adicionales se mantienen en KV Store (Deno Deploy):

- `cliente_contacto:{id}` → Datos de contacto (teléfonos, emails, notas)
- `pedido_extras:{id}` → Campos extendidos del pedido + asignaciones
- `qr_token:{pedidoId}` → Tokens QR activos
- `alerta_enviada:{pedidoId}:{camareroCodigo}` → Control de alertas

## Exportar Datos Existentes

### Desde Supabase Dashboard

1. **SQL Editor** → Ejecutar queries de exportación:

```sql
-- Exportar coordinadores
COPY (SELECT * FROM coordinadores) TO STDOUT WITH CSV HEADER;

-- Exportar camareros
COPY (SELECT * FROM camareros) TO STDOUT WITH CSV HEADER;

-- Exportar clientes
COPY (SELECT * FROM clientes) TO STDOUT WITH CSV HEADER;

-- etc...
```

2. **Table Editor** → Seleccionar tabla → **Export to CSV**

### Usando Supabase CLI

```bash
# Exportar todas las tablas
supabase db dump -f backup_$(date +%Y%m%d).sql

# Exportar solo datos (sin schema)
supabase db dump --data-only -f data_backup_$(date +%Y%m%d).sql
```

## Importar Datos a Producción

Una vez creadas las tablas en producción:

```sql
-- Importar desde CSV
COPY coordinadores(codigo, nombre, apellido, email, telefono, zona)
FROM '/path/to/coordinadores.csv'
WITH (FORMAT csv, HEADER true);

-- O usar INSERT masivo
INSERT INTO coordinadores (codigo, nombre, email) VALUES
  ('COORD001', 'Juan Pérez', 'juan@example.com'),
  ('COORD002', 'María López', 'maria@example.com');
```

## Consideraciones para Producción

### 1. Row Level Security (RLS)

Actualmente **deshabilitado**. Para habilitar:

```sql
ALTER TABLE coordinadores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coordinadores pueden ver todos"
  ON coordinadores FOR SELECT
  USING (auth.role() = 'authenticated');
```

### 2. Backups Automáticos

- Supabase hace backups automáticos diarios en plan Pro
- Configurar backups manuales adicionales según necesidad

### 3. Indices Personalizados

Evaluar agregar índices según patrones de uso:

```sql
-- Ejemplo: Si buscas frecuentemente por fecha y cliente
CREATE INDEX idx_pedidos_cliente_fecha 
ON pedidos(cliente, dia_evento);
```

### 4. Migración de KV Store

A futuro considerar migrar datos de KV Store a columnas JSONB:

```sql
ALTER TABLE clientes ADD COLUMN contacto_info JSONB;
ALTER TABLE pedidos ADD COLUMN campos_extras JSONB;
```

## Troubleshooting

### Error: "relation already exists"

```sql
-- Eliminar tabla existente (¡CUIDADO: borra datos!)
DROP TABLE IF EXISTS nombre_tabla CASCADE;
```

### Error: "duplicate key value"

```sql
-- Verificar duplicados
SELECT codigo, COUNT(*) 
FROM camareros 
GROUP BY codigo 
HAVING COUNT(*) > 1;
```

### Resetear secuencia de códigos

```sql
-- Si los códigos están desincronizados
SELECT MAX(codigo) FROM camareros;
-- Ajustar manualmente en próxima inserción
```

## Contacto y Soporte

Para dudas sobre la estructura de datos o migraciones, consultar:
- `db-helpers.ts` → Funciones CRUD y lógica de códigos
- Este README
- Documentación de Supabase: https://supabase.com/docs
