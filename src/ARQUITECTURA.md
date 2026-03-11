# 🏗️ Arquitectura del Sistema - Gestión de Servicios

Documentación técnica de la arquitectura completa del sistema.

---

## 📊 Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                        USUARIO FINAL                             │
│                  (Navegador Web / Móvil)                         │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                         VERCEL CDN                               │
│              (Frontend Deployment + Edge Network)                │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            REACT APP (Single Page Application)           │  │
│  │                                                          │  │
│  │  • App.tsx (Router principal)                           │  │
│  │  • Components (Dashboard, Pedidos, Camareros, etc.)     │  │
│  │  • Tailwind CSS v4 (Estilos)                            │  │
│  │  • React Router (Navegación)                            │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Variables de entorno:                                          │
│  • VITE_SUPABASE_URL                                            │
│  • VITE_SUPABASE_ANON_KEY                                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ REST API (HTTPS)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE PLATFORM                             │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              EDGE FUNCTIONS (Deno Runtime)               │  │
│  │                                                          │  │
│  │  make-server-ce05fe95/                                  │  │
│  │  ├── index.tsx (Hono Web Server)                        │  │
│  │  │   • 50+ rutas REST                                   │  │
│  │  │   • Autenticación y autorización                     │  │
│  │  │   • Validación de datos                              │  │
│  │  │   • Manejo de errores                                │  │
│  │  │                                                       │  │
│  │  └── db-helpers.ts (Funciones de BD)                    │  │
│  │      • CRUD operations                                  │  │
│  │      • Generación de códigos correlativos               │  │
│  │      • Consultas complejas                              │  │
│  │                                                          │  │
│  │  Variables de entorno:                                  │  │
│  │  • SUPABASE_URL                                         │  │
│  │  • SUPABASE_ANON_KEY                                    │  │
│  │  • SUPABASE_SERVICE_ROLE_KEY (privada)                 │  │
│  │  • SUPABASE_DB_URL                                      │  │
│  │                                                          │  │
│  └────────────────────┬─────────────────────────────────────┘  │
│                       │                                         │
│                       │ SQL                                     │
│                       ▼                                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            POSTGRESQL DATABASE                           │  │
│  │                                                          │  │
│  │  Tablas Principales:                                    │  │
│  │  ├── coordinadores (códigos COO001, COO002...)          │  │
│  │  ├── camareros (códigos CAM001, COC001, BAR001...)      │  │
│  │  ├── clientes (códigos CLI001, CLI002...)               │  │
│  │  ├── pedidos (códigos PED001, PED002...)                │  │
│  │  ├── asignaciones                                       │  │
│  │  ├── usuarios (autenticación)                           │  │
│  │  ├── qr_tokens (códigos QR)                             │  │
│  │  ├── registros_asistencia                               │  │
│  │  ├── chats (mensajería grupal)                          │  │
│  │  ├── confirmaciones                                     │  │
│  │  └── kv_store_ce05fe95 (key-value legacy)              │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    SUPABASE AUTH                         │  │
│  │  • Gestión de sesiones                                  │  │
│  │  • Tokens JWT                                           │  │
│  │  • Social login (Google, Facebook, etc.)               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  SUPABASE STORAGE                        │  │
│  │  • Bucket: make-ce05fe95-files                          │  │
│  │  • Almacenamiento de archivos                           │  │
│  │  • URLs firmadas (private buckets)                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ API Calls (HTTPS)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SERVICIOS EXTERNOS                             │
│                                                                  │
│  • WhatsApp Business API (envío de mensajes)                    │
│  • Resend / SendGrid / Mailgun (email)                          │
│  • Unsplash API (imágenes)                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Datos Típico

### Ejemplo: Login de Usuario

```
1. Usuario ingresa email/password
   ↓
2. Frontend (React) → POST /login
   ↓
3. Edge Function recibe petición
   ↓
4. Consulta tabla 'usuarios' en PostgreSQL
   ↓
5. Verifica contraseña hasheada
   ↓
6. Genera sesión con Supabase Auth
   ↓
7. Retorna token JWT + datos de usuario
   ↓
8. Frontend guarda token en localStorage
   ↓
9. Renderiza dashboard con datos del usuario
```

### Ejemplo: Crear Pedido

```
1. Admin crea nuevo pedido en UI
   ↓
2. Frontend → POST /pedidos {datos}
   ↓
3. Edge Function valida datos
   ↓
4. Genera código correlativo (PED001, PED002...)
   ↓
5. INSERT en tabla 'pedidos'
   ↓
6. Retorna pedido creado con ID y código
   ↓
7. Frontend actualiza lista de pedidos
   ↓
8. Muestra notificación de éxito
```

---

## 📁 Estructura de Archivos

```
📦 Proyecto Root
│
├── 📄 DOCUMENTACIÓN (8 archivos .md)
│   ├── START-HERE.md              # 🎯 Guía visual para principiantes
│   ├── README.md                  # 📖 Punto de entrada principal
│   ├── INDEX.md                   # 📚 Índice de toda la documentación
│   ├── QUICK-START.md             # ⚡ Inicio rápido (5 min)
│   ├── DEPLOY-GUIDE.md            # 📘 Guía completa de deployment
│   ├── DEPLOYMENT-CHECKLIST.md    # ✅ Checklist interactivo
│   ├── COMANDOS-UTILES.md         # 🎯 Referencia de comandos
│   ├── RESUMEN-DEPLOYMENT.md      # 📊 Resumen ejecutivo
│   └── ARQUITECTURA.md            # 🏗️ Este archivo
│
├── 🚀 SCRIPTS DE DEPLOYMENT
│   ├── deploy.sh                  # Script Linux/Mac
│   ├── deploy.bat                 # Script Windows
│   └── pre-deploy-check.sh        # Verificación pre-deploy
│
├── ⚙️  CONFIGURACIÓN
│   ├── package.json               # Scripts npm + dependencias
│   ├── vercel.json                # Config Vercel
│   ├── .env.example               # Template de variables
│   ├── .gitignore                 # Exclusiones Git
│   └── tsconfig.json              # Config TypeScript
│
├── 🎨 FRONTEND (React + TypeScript)
│   │
│   ├── App.tsx                    # 🔹 Componente principal + Router
│   │
│   ├── components/                # Componentes React
│   │   ├── dashboard.tsx          # Dashboard principal con KPIs
│   │   ├── pedidos.tsx            # Gestión de pedidos
│   │   ├── camareros.tsx          # Gestión de personal
│   │   ├── admin.tsx              # Panel de administración
│   │   ├── informes.tsx           # Reportes y analytics
│   │   ├── envios.tsx             # WhatsApp/Email
│   │   ├── configuracion.tsx      # Configuración del sistema
│   │   ├── login.tsx              # Autenticación
│   │   ├── perfil-view.tsx        # Vista de perfil de camarero
│   │   ├── qr-scan-page.tsx       # Escaneo de QR
│   │   ├── init-test-panel.tsx    # Panel de inicialización
│   │   ├── TestEdgeFunction.tsx   # Test de API
│   │   │
│   │   └── ui/                    # Componentes UI reutilizables
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── modal.tsx
│   │       └── ...
│   │
│   ├── utils/                     # Utilidades
│   │   └── supabase/
│   │       └── info.tsx           # IDs y keys de Supabase
│   │
│   └── styles/
│       └── globals.css            # Estilos globales + Tailwind
│
├── 🔧 BACKEND (Supabase Edge Function)
│   │
│   └── supabase/functions/server/
│       │
│       ├── index.tsx              # 🔹 Servidor Hono principal
│       │                          # • 50+ rutas REST
│       │                          # • Middleware (CORS, logger)
│       │                          # • Manejo de errores
│       │
│       ├── db-helpers.ts          # 🔹 Helpers de base de datos
│       │                          # • Funciones CRUD
│       │                          # • Códigos correlativos
│       │                          # • Consultas complejas
│       │
│       └── kv_store.tsx           # 🔒 Sistema KV (protegido)
│                                  # • NO MODIFICAR
│
└── 📦 BUILD OUTPUT
    └── dist/                      # Archivos generados por Vite
```

---

## 🔌 API Endpoints

### Autenticación
```
POST   /login                 # Iniciar sesión
POST   /usuarios              # Crear usuario
```

### Coordinadores
```
GET    /coordinadores          # Listar todos
GET    /coordinadores/:id      # Obtener uno
POST   /coordinadores          # Crear nuevo (COO001, COO002...)
PUT    /coordinadores/:id      # Actualizar
DELETE /coordinadores/:id      # Eliminar
```

### Camareros
```
GET    /camareros              # Listar todos
GET    /camareros/:id          # Obtener uno
POST   /camareros              # Crear nuevo (CAM001, COC001...)
PUT    /camareros/:id          # Actualizar
DELETE /camareros/:id          # Eliminar
```

### Clientes
```
GET    /clientes               # Listar todos
GET    /clientes/:id           # Obtener uno
POST   /clientes               # Crear nuevo (CLI001, CLI002...)
PUT    /clientes/:id           # Actualizar
DELETE /clientes/:id           # Eliminar
```

### Pedidos
```
GET    /pedidos                # Listar todos
GET    /pedidos/:id            # Obtener uno
POST   /pedidos                # Crear nuevo (PED001, PED002...)
PUT    /pedidos/:id            # Actualizar
DELETE /pedidos/:id            # Eliminar
```

### Asignaciones
```
GET    /asignaciones           # Listar todas
POST   /asignaciones           # Crear nueva
PUT    /asignaciones/:id       # Actualizar
DELETE /asignaciones/:id       # Eliminar
```

### Chats
```
GET    /chats                  # Listar todos
GET    /chats/:id              # Obtener uno
POST   /chats                  # Crear chat grupal
POST   /chats/:id/mensaje      # Enviar mensaje
```

### Otros
```
GET    /test                   # Endpoint de prueba
GET    /qr/:codigo             # Generar QR
POST   /asistencia             # Registrar asistencia
POST   /confirmacion           # Confirmar/rechazar servicio
```

---

## 🗄️ Esquema de Base de Datos

### Tabla: coordinadores
```sql
id              UUID PRIMARY KEY
codigo          VARCHAR UNIQUE (COO001, COO002...)
nombre          VARCHAR
email           VARCHAR UNIQUE
telefono        VARCHAR
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Tabla: camareros
```sql
id              UUID PRIMARY KEY
codigo          VARCHAR UNIQUE (CAM001, COC001, BAR001...)
nombre          VARCHAR
email           VARCHAR UNIQUE
telefono        VARCHAR
tipo            VARCHAR (camarero, cocina, barra, limpieza, barman)
disponibilidad  JSONB
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Tabla: clientes
```sql
id              UUID PRIMARY KEY
codigo          VARCHAR UNIQUE (CLI001, CLI002...)
nombre          VARCHAR
empresa         VARCHAR
email           VARCHAR
telefono        VARCHAR
direccion       TEXT
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Tabla: pedidos
```sql
id              UUID PRIMARY KEY
codigo          VARCHAR UNIQUE (PED001, PED002...)
cliente_id      UUID REFERENCES clientes(id)
coordinador_id  UUID REFERENCES coordinadores(id)
fecha_evento    DATE
hora_inicio     TIME
hora_fin        TIME
ubicacion       TEXT
descripcion     TEXT
num_camareros   INTEGER
num_cocina      INTEGER
num_barra       INTEGER
estado          VARCHAR (pendiente, en_proceso, completado, cancelado)
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Tabla: asignaciones
```sql
id              UUID PRIMARY KEY
pedido_id       UUID REFERENCES pedidos(id)
camarero_id     UUID REFERENCES camareros(id)
estado          VARCHAR (pendiente, aceptado, rechazado)
confirmado_at   TIMESTAMP
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Tabla: usuarios
```sql
id              UUID PRIMARY KEY
email           VARCHAR UNIQUE
password_hash   VARCHAR
nombre          VARCHAR
rol             VARCHAR (admin, coordinador, perfil)
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Tabla: chats
```sql
id              UUID PRIMARY KEY
pedido_id       UUID REFERENCES pedidos(id)
nombre          VARCHAR
participantes   JSONB (array de camarero_ids)
mensajes        JSONB (array de mensajes)
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## 🔐 Seguridad

### Niveles de Autenticación

1. **Frontend (Público)**
   - Usa ANON_KEY (pública)
   - No puede acceder a SERVICE_ROLE_KEY
   - Autenticación vía Supabase Auth

2. **Edge Function (Privado)**
   - Tiene acceso a SERVICE_ROLE_KEY
   - Valida tokens JWT
   - Ejecuta operaciones privilegiadas

### Variables de Entorno

**Públicas (Frontend):**
- `VITE_SUPABASE_URL` - URL del proyecto
- `VITE_SUPABASE_ANON_KEY` - Clave pública anon

**Privadas (Backend):**
- `SUPABASE_SERVICE_ROLE_KEY` - Clave con permisos completos
- `SUPABASE_DB_URL` - URL directa a PostgreSQL

### Flujo de Autenticación

```
1. Usuario inicia sesión
   ↓
2. Frontend envía email/password → Edge Function
   ↓
3. Edge Function verifica en tabla 'usuarios'
   ↓
4. Genera JWT con Supabase Auth
   ↓
5. Frontend guarda JWT en localStorage
   ↓
6. Cada petición incluye: Authorization: Bearer {JWT}
   ↓
7. Edge Function valida JWT antes de procesar
```

---

## 📡 Integración con Servicios Externos

### WhatsApp Business API
```
Edge Function → WhatsApp API
• Envío de confirmaciones
• Notificaciones de eventos
• Chat grupal automático
```

### Email (Multi-proveedor)
```
Edge Function detecta provider configurado:
├── Resend (preferido)
├── SendGrid (fallback)
└── Mailgun (alternativo)
```

### Unsplash (Imágenes)
```
Frontend → Unsplash API
• Búsqueda de imágenes stock
• Para ilustraciones en UI
```

---

## 🚀 Deployment Flow

```
Código Local (Figma Make)
        ↓
    Git Commit (opcional)
        ↓
    ./deploy.sh ejecuta:
        ↓
    ┌───────────────────────────┐
    │ 1. Verifica dependencias  │
    └───────────┬───────────────┘
                ↓
    ┌───────────────────────────┐
    │ 2. Despliega Edge Function│
    │    a Supabase             │
    └───────────┬───────────────┘
                ↓
    ┌───────────────────────────┐
    │ 3. Build del frontend     │
    │    (Vite build)           │
    └───────────┬───────────────┘
                ↓
    ┌───────────────────────────┐
    │ 4. Deploy a Vercel        │
    │    (Edge Network global)  │
    └───────────────────────────┘
                ↓
        🌐 PRODUCCIÓN
```

---

## 📊 Tecnologías Utilizadas

### Frontend
- **React 18.3** - UI Library
- **TypeScript 5.6** - Type safety
- **Tailwind CSS 4.0** - Styling
- **React Router 7** - Navegación
- **Lucide React** - Iconos
- **Vite 6** - Build tool

### Backend
- **Deno Runtime** - JavaScript runtime
- **Hono** - Web framework
- **Supabase** - Backend as a Service
- **PostgreSQL** - Base de datos

### Infrastructure
- **Vercel** - Frontend hosting
- **Supabase Edge Functions** - Serverless backend
- **Supabase Database** - Managed PostgreSQL
- **Supabase Auth** - Autenticación
- **Supabase Storage** - Almacenamiento de archivos

---

## 🎯 Performance

### Frontend
- **Bundle Size:** ~300KB (gzipped)
- **First Contentful Paint:** <2s
- **Time to Interactive:** <3s
- **CDN:** Global edge network (Vercel)

### Backend
- **Cold Start:** <500ms
- **Avg Response Time:** <200ms
- **Max Concurrent:** Ilimitado (serverless)
- **Region:** Configurable (Supabase)

### Database
- **Connection Pooling:** Supabase Pooler
- **Query Performance:** Optimizado con índices
- **Backup:** Automático diario
- **Escalabilidad:** Vertical y horizontal

---

## 🔄 Estado de Migración

### Completado (78%)
- ✅ 10 tablas SQL creadas
- ✅ 18 endpoints CRUD migrados
- ✅ Sistema de códigos correlativos
- ✅ Autenticación con SQL
- ✅ Chats con SQL

### Pendiente (22%)
- 🚧 Migración completa de informes
- 🚧 Migración de configuraciones
- 🚧 Optimización de queries complejas
- 🚧 Tests unitarios

---

## 📝 Notas Técnicas

1. **Key-Value Store Legacy:**
   - La tabla `kv_store_ce05fe95` existe para compatibilidad
   - NO modificar archivos protegidos
   - Se planea deprecar completamente

2. **Códigos Correlativos:**
   - Implementados con secuencias SQL
   - Formato: `TIPO001`, `TIPO002`, etc.
   - Únicos por tipo de entidad

3. **Edge Functions:**
   - Ejecutan en Deno runtime
   - Imports vía `npm:` y `jsr:`
   - Timeout: 25 segundos máximo
   - Logs disponibles en tiempo real

4. **Vercel Deployment:**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Framework: Vite
   - Node version: 18.x

---

**Última actualización:** Marzo 2026  
**Versión:** 2.5.0  
**Arquitectura:** Three-tier (Frontend → Backend → Database)
