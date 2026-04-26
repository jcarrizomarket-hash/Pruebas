# 🚀 MIGRACIÓN A SQL COMPLETADA

## ✅ Estado de la Migración

**Fecha:** 10 de Marzo, 2026  
**Base de Datos:** Pruebas Gestión de Servicios (eubjevjqcpsvpgxmdpvy)  
**Estado:** ✅ COMPLETADO

---

## 📊 Tablas Creadas en Supabase

### 1. **coordinadores**
- ✅ Códigos correlativos: `COORD001`, `COORD002`, ...
- Campos: id, codigo, nombre, apellido, email, telefono, zona
- Índice en: email

### 2. **camareros**
- ✅ Códigos correlativos por tipo:
  - `CAM001` - Camareros
  - `COC001` - Cocina
  - `BAR001` - Barra
  - `LIM001` - Limpieza
  - `SEG001` - Seguridad
- Campos: id, codigo, nombre, apellido, email, telefono, disponibilidad, categoria, experiencia
- Índice en: email

### 3. **clientes**
- ✅ Códigos correlativos: `CLI001`, `CLI002`, ...
- Campos: id, codigo, nombre, contacto, email, telefono, direccion, tipo
- Índice en: nombre

### 4. **pedidos**
- ✅ Códigos correlativos: `PED001`, `PED002`, ...
- Campos: id, codigo, cliente, tipo_evento, dia_evento, hora_entrada, hora_salida, lugar, numero_personas, observaciones, coordinador, estado, cantidad_camareros
- Índices en: dia_evento, estado

### 5. **asignaciones**
- Relaciona camareros con pedidos
- Campos: id, pedido_id, camarero_codigo, estado, turno, hora_entrada_real, hora_salida_real
- Foreign key: pedido_id → pedidos(id) ON DELETE CASCADE
- Índices en: pedido_id, camarero_codigo
- Constraint único: (pedido_id, camarero_codigo)

### 6. **usuarios**
- Sistema de autenticación
- Campos: id, nombre, email, password_hash, rol, camarero_codigo
- Roles: admin, coordinador, perfil
- Índice en: email

### 7. **qr_tokens**
- Tokens QR para entrada/salida
- Campos: id, token, pedido_id, tipo, activo, expira_en
- Foreign key: pedido_id → pedidos(id) ON DELETE CASCADE
- Índice en: token

### 8. **registros_asistencia**
- Histórico de entradas/salidas
- Campos: id, pedido_id, camarero_codigo, tipo, timestamp
- Foreign key: pedido_id → pedidos(id) ON DELETE CASCADE

### 9. **chats**
- Chats grupales de WhatsApp
- Campos: id, pedido_id, grupo_whatsapp_id, nombre_grupo, activo
- Foreign key: pedido_id → pedidos(id) ON DELETE CASCADE

---

## 🔄 Endpoints Migrados a SQL

### ✅ CLIENTES
- `GET /clientes` - Obtener todos
- `POST /clientes` - Crear (genera código automático)
- `PUT /clientes/:id` - Actualizar
- `DELETE /clientes/:id` - Eliminar

### ✅ CAMAREROS
- `GET /camareros` - Obtener todos
- `POST /camareros` - Crear (genera código automático según tipo)
- `PUT /camareros/:id` - Actualizar
- `DELETE /camareros/:id` - Eliminar

### ✅ COORDINADORES
- `GET /coordinadores` - Obtener todos
- `POST /coordinadores` - Crear (genera código automático)
- `PUT /coordinadores/:id` - Actualizar
- `DELETE /coordinadores/:id` - Eliminar

### ✅ PEDIDOS/EVENTOS
- `GET /pedidos` - Obtener todos
- `POST /pedidos` - Crear (genera código automático)
- `PUT /pedidos/:id` - Actualizar
- `DELETE /pedidos/:id` - Eliminar

### ✅ ASIGNACIONES
- `GET /asignaciones?pedidoId=xxx` - Obtener asignaciones
- `POST /asignaciones` - Crear asignación
- `PUT /asignaciones/:id` - Actualizar asignación
- `DELETE /asignaciones/:pedidoId/:camareroCodigo` - Eliminar

### ✅ USUARIOS Y AUTENTICACIÓN
- `GET /usuarios` - Obtener todos (sin passwords)
- `POST /usuarios` - Crear usuario
- `POST /login` - Iniciar sesión
- `PUT /usuarios/:id` - Actualizar usuario
- `DELETE /usuarios/:id` - Eliminar usuario

### ✅ QR TOKENS Y ASISTENCIA
- `GET /pedidos/:id/qr-token` - Obtener/generar token QR
- `POST /pedidos/:id/qr-regenerate` - Regenerar token
- `GET /qr-scan/:token` - Validar token y obtener pedido
- `POST /qr-scan/:token/registro` - Registrar entrada/salida
- `GET /registros-qr` - Todos los registros de asistencia
- `GET /registros-asistencia?pedidoId=xxx` - Registros por pedido
- `GET /registros-perfil?email=xxx` - Registros de un camarero

### ✅ INFORMES
- `GET /informes/cliente?cliente=xxx&desde=xxx&hasta=xxx` - Informe por cliente
- `GET /informes/camarero?camareroCodigo=xxx&desde=xxx&hasta=xxx` - Informe por camarero

---

## 🛠️ Archivos Actualizados

### `/supabase/functions/server/db-helpers.ts` ✨ NUEVO
Funciones helper para todas las operaciones SQL:
- Generación de códigos correlativos
- CRUD completo para todas las entidades
- Gestión de QR tokens
- Registros de asistencia

### `/supabase/functions/server/index.tsx` 🔄 ACTUALIZADO
- Importa `db-helpers.ts`
- Rutas principales migradas a SQL
- Mantiene compatibilidad con frontend existente

### `/utils/init-test-data.tsx` 🔄 ACTUALIZADO
- Actualizado para usar las nuevas tablas SQL
- Genera datos de prueba con códigos correlativos

---

## 🔥 Características Implementadas

### 1. **Códigos Correlativos Automáticos**
```typescript
// Ejemplo: Crear un camarero
POST /camareros
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@email.com",
  "categoria": "Camarero"
}

// Respuesta:
{
  "success": true,
  "data": {
    "id": "uuid-generado",
    "codigo": "CAM001",  // ← Generado automáticamente
    "nombre": "Juan",
    ...
  }
}
```

### 2. **Relaciones con Foreign Keys**
- Eliminación en cascada (ON DELETE CASCADE)
- Integridad referencial garantizada
- Constraints de unicidad

### 3. **Timestamps Automáticos**
- `created_at` - Fecha de creación
- `updated_at` - Actualizado automáticamente con triggers

### 4. **Sistema de QR Mejorado**
- Tokens almacenados en tabla dedicada
- Posibilidad de regenerar tokens
- Histórico de registros de asistencia separado
- Soporte para múltiples tipos de tokens

---

## ⚠️ Funcionalidades que AÚN usan KV Store

Las siguientes funcionalidades todavía usan el sistema KV y están pendientes de migración:

### Pendientes de Migrar:
- 📧 **Sistema de Email** (Resend, SendGrid, Mailgun)
- 💬 **WhatsApp Business API**
- 🤖 **Chatbot conversacional** (9 pasos)
- 👥 **Chats grupales automáticos**
- 📄 **Generación de PDFs** (partes de servicio)
- 🔔 **Confirmaciones de servicios** (aceptar/rechazar)
- 📨 **Sistema de notificaciones**

**Nota:** Estas funcionalidades seguirán funcionando normalmente con KV store hasta que se migren.

---

## 📋 Checklist de Uso

### Paso 1: Verificar Tablas en Supabase
- [ ] Ir a Supabase Dashboard
- [ ] Table Editor
- [ ] Verificar que existen las 9 tablas
- [ ] Verificar que tienen los índices

### Paso 2: Inicializar Datos de Prueba
- [ ] Abrir la aplicación
- [ ] Ir a "Configuración" → "Inicializar BD"
- [ ] Click en "Inicializar Datos de Prueba"
- [ ] Esperar confirmación

### Paso 3: Verificar Datos
- [ ] Ir a "Perfiles" → Ver camareros con códigos CAM001, CAM002...
- [ ] Ir a "Coordinadores" → Ver códigos COORD001...
- [ ] Ir a "Pedidos" → Ver códigos PED001...
- [ ] Verificar que los códigos son correlativos

### Paso 4: Probar Funcionalidades
- [ ] Crear un nuevo camarero → Verificar que genera CAM006
- [ ] Crear un nuevo cliente → Verificar que genera CLI004
- [ ] Crear un nuevo pedido → Verificar que genera PED004
- [ ] Generar QR de un pedido → Verificar que funciona
- [ ] Registrar entrada/salida con QR

---

## 🔍 Queries SQL Útiles

### Ver todos los códigos generados:
```sql
SELECT codigo, nombre FROM camareros ORDER BY codigo;
SELECT codigo, nombre FROM coordinadores ORDER BY codigo;
SELECT codigo, nombre FROM clientes ORDER BY codigo;
SELECT codigo, cliente FROM pedidos ORDER BY codigo;
```

### Ver asignaciones con información completa:
```sql
SELECT 
  a.id,
  p.codigo AS pedido_codigo,
  c.codigo AS camarero_codigo,
  c.nombre || ' ' || c.apellido AS camarero_nombre,
  a.estado,
  a.turno
FROM asignaciones a
JOIN pedidos p ON a.pedido_id = p.id
JOIN camareros c ON a.camarero_codigo = c.codigo
ORDER BY p.dia_evento DESC;
```

### Ver registros de asistencia:
```sql
SELECT 
  r.timestamp,
  r.tipo,
  c.codigo AS camarero_codigo,
  c.nombre || ' ' || c.apellido AS camarero_nombre,
  p.codigo AS pedido_codigo,
  p.cliente
FROM registros_asistencia r
JOIN camareros c ON r.camarero_codigo = c.codigo
JOIN pedidos p ON r.pedido_id = p.id
ORDER BY r.timestamp DESC;
```

### Ver tokens QR activos:
```sql
SELECT 
  t.token,
  t.tipo,
  p.codigo AS pedido_codigo,
  p.cliente,
  p.dia_evento
FROM qr_tokens t
JOIN pedidos p ON t.pedido_id = p.id
WHERE t.activo = true
ORDER BY t.created_at DESC;
```

---

## 💡 Ventajas de la Migración

### ✅ Antes (KV Store)
- IDs complejos: `camarero:1731234567890-abc123def-1`
- Sin códigos correlativos
- Búsquedas por prefijo (lento)
- Sin integridad referencial
- Difícil de consultar

### ✅ Ahora (SQL)
- IDs simples: UUID
- Códigos correlativos: `CAM001`, `PED001`
- Índices optimizados (rápido)
- Foreign keys con cascada
- Queries SQL potentes
- Escalable para producción

---

## 🚨 Importante

### Compatibilidad con Frontend
- ✅ El frontend funciona **SIN CAMBIOS**
- ✅ Las rutas mantienen la misma interfaz
- ✅ Los datos se transforman en el servidor
- ✅ Retrocompatibilidad garantizada

### Datos Antiguos
- ⚠️ Los datos del KV store **NO se migran automáticamente**
- Usa "Inicializar Datos de Prueba" para empezar limpio
- O crea un script de migración personalizado si necesitas preservar datos antiguos

---

## 📞 Soporte

Si encuentras algún problema:

1. **Revisa los logs del servidor:**
   - Supabase Dashboard → Edge Functions → make-server
   - Ver logs en tiempo real

2. **Revisa la consola del navegador:**
   - F12 → Console
   - Buscar errores en requests

3. **Verifica las tablas:**
   - Supabase Dashboard → Table Editor
   - Confirma que los datos se están guardando

---

## ✅ Próximos Pasos Sugeridos

1. **Probar toda la funcionalidad** básica
2. **Migrar funcionalidades avanzadas** (WhatsApp, Email, etc.)
3. **Implementar backup automático** de la base de datos
4. **Añadir políticas RLS** para mayor seguridad
5. **Optimizar queries** con índices adicionales si es necesario

---

**¡La migración está completa y lista para usar!** 🎉
