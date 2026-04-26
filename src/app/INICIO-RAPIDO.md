# 🚀 INICIO RÁPIDO - Sistema de Gestión de Camareros v2.6.2

## ✅ Estado Actual

- ✅ **Build**: v2.6.2 - Error 404 RESUELTO
- ✅ **Backend**: Supabase Edge Functions desplegado
- ✅ **Base de Datos**: 10 tablas SQL configuradas
- ✅ **Email**: Resend conectado y funcionando
- ✅ **Desarrollo Local**: Funcionando correctamente
- ⏳ **GitHub**: Pendiente
- ⏳ **Vercel**: Pendiente

---

## 🏃 COMENZAR AHORA (3 pasos)

### 1️⃣ Iniciar el Servidor

```bash
npm run dev
```

El navegador se abrirá automáticamente en: http://localhost:5173/

### 2️⃣ Verificar en el Navegador

Presiona **F12** para abrir la consola. Deberías ver:

```javascript
🚀 App iniciando - Build v2.6.2
📍 Location: http://localhost:5173/
🔧 Environment: development
```

### 3️⃣ Iniciar Sesión

**Usuario Admin** (si ya lo creaste):
- Email: `admin@test.com`
- Password: tu password

**O crear uno nuevo**:
1. Ir a la pestaña **"Inicializar BD"** (solo visible para admins)
2. Crear usuario administrador

---

## 🛠️ Comandos Principales

```bash
# Desarrollo local
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Deploy a Supabase Functions
npm run deploy:supabase

# Ver logs del servidor
npm run logs:supabase

# Verificar configuración
bash verificar-local.sh        # Linux/Mac
verificar-local.bat            # Windows
```

---

## 📚 Documentación Importante

### 🐛 Si tienes problemas:

1. **Error 404 resuelto**: Lee [`SOLUCION-ERROR-404.md`](./SOLUCION-ERROR-404.md)
2. **Pruebas locales**: Lee [`PRUEBA-LOCAL.md`](./PRUEBA-LOCAL.md)
3. **Deployment**: Lee [`DEPLOYMENT-FIX-2.6.2.md`](./DEPLOYMENT-FIX-2.6.2.md)

### 📖 Guías Completas:

- **Sistema de Email**: [`EMAIL_SYSTEM_OVERVIEW.md`](./EMAIL_SYSTEM_OVERVIEW.md)
- **WhatsApp API**: [`WHATSAPP_SETUP.md`](./WHATSAPP_SETUP.md)
- **Arquitectura**: [`ARCHITECTURE.md`](./ARCHITECTURE.md)
- **Base de Datos**: [`MIGRACION_SQL.md`](./MIGRACION_SQL.md)

---

## 🔧 Configuración de Variables de Entorno

El sistema **ya tiene configuradas** las siguientes variables en Supabase:

```env
✅ SUPABASE_URL
✅ SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_ROLE_KEY
✅ SUPABASE_DB_URL
✅ RESEND_API_KEY
```

**No necesitas crear archivo `.env` local** - todo está en Supabase.

---

## 📊 Estructura del Proyecto

```
/
├── App.tsx                    # Componente principal
├── src/
│   ├── main.tsx              # Entry point
│   └── utils/
│       └── supabase/
│           └── info.tsx      # Configuración Supabase
├── components/
│   ├── login.tsx             # Login
│   ├── dashboard.tsx         # Dashboard
│   ├── camareros.tsx         # Gestión de personal
│   ├── pedidos.tsx           # Gestión de pedidos
│   ├── admin.tsx             # Panel admin
│   ├── informes.tsx          # Informes y KPIs
│   ├── envios.tsx            # WhatsApp/Email
│   └── configuracion.tsx     # Configuración
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx     # API principal
│           ├── db-helpers.ts # Helpers SQL
│           └── kv_store.tsx  # Key-value (legacy)
└── styles/
    └── globals.css           # Estilos globales
```

---

## 🎯 Funcionalidades Principales

### 👥 Gestión de Personal
- Códigos correlativos automáticos (CAM001, COC001, etc.)
- Estados visuales con colores
- Confirmación de disponibilidad
- Historial de asistencias

### 📦 Gestión de Pedidos
- Entrada de pedidos
- Asignación de personal
- Estados de confirmación
- Tabla de asignaciones con colores alternos

### 📊 Informes
- KPIs en tiempo real
- Métricas detalladas
- Exportación de datos
- Gráficos visuales

### 📧 Comunicaciones
- Email multi-proveedor (Resend/SendGrid/Mailgun)
- WhatsApp Business API
- Chats grupales automáticos
- Templates personalizables

### 🔐 Seguridad
- Sistema de roles (Admin/Coordinador/Perfil)
- Autenticación con Supabase Auth
- Protección de rutas
- Logs de auditoría

---

## ⚡ Quick Start para Diferentes Casos de Uso

### Caso 1: Solo quiero probar localmente
```bash
npm run dev
# Abre http://localhost:5173/
```

### Caso 2: Quiero agregar un camarero
1. Iniciar sesión como admin
2. Ir a pestaña **"Personal"**
3. Click en **"+ Nuevo Camarero"**
4. Rellenar formulario
5. Guardar

### Caso 3: Quiero crear un pedido
1. Ir a pestaña **"Pedidos"**
2. Click en **"+ Nuevo Pedido"**
3. Seleccionar cliente y fecha
4. Asignar camareros
5. Guardar

### Caso 4: Quiero enviar WhatsApp
1. Ir a pestaña **"Configuración"**
2. Configurar WhatsApp Business API
3. Ir a **"Envíos"**
4. Seleccionar destinatarios
5. Enviar mensaje

### Caso 5: Quiero ver informes
1. Ir a pestaña **"Informes"**
2. Seleccionar rango de fechas
3. Ver KPIs y métricas
4. Exportar si es necesario

---

## 🆘 Solución de Problemas Comunes

### Error: "Cannot GET /"
```bash
# El servidor no está corriendo
npm run dev
```

### Error: Puerto 5173 en uso
```bash
# Matar el proceso
npx kill-port 5173

# O usar otro puerto
npm run dev -- --port 3000
```

### Error: 404 en archivos
```bash
# Limpiar caché
rm -rf .vite dist
npm run dev
```

### Error: "Cannot find module"
```bash
# Reinstalar dependencias
rm -rf node_modules
npm install
```

### Pantalla en blanco
1. Abrir F12 (DevTools)
2. Ver errores en Console
3. Ver si algún archivo da 404 en Network
4. Si es así, ejecutar: `bash verificar-local.sh`

---

## 📞 Información del Sistema

- **Proyecto Supabase**: `eubjevjqcpsvpgxmdpvy`
- **API Endpoint**: `https://eubjevjqcpsvpgxmdpvy.supabase.co/functions/v1/make-server-ce05fe95`
- **Framework**: Vite + React + TypeScript
- **UI**: Tailwind CSS v4 + Lucide Icons
- **Backend**: Supabase Edge Functions (Deno)
- **Base de Datos**: PostgreSQL (Supabase)

---

## ✅ Checklist para Comenzar

- [ ] Node.js 18+ instalado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Servidor corriendo (`npm run dev`)
- [ ] Sin errores en consola
- [ ] Pantalla de login visible
- [ ] Variables de entorno en Supabase
- [ ] Backend Supabase desplegado

---

## 🚀 Próximos Pasos

1. **Ahora**: Probar localmente
2. **Después**: Configurar GitHub
3. **Luego**: Deploy en Vercel
4. **Finalmente**: Configurar dominio personalizado

---

**¿Listo para comenzar?** → Ejecuta `npm run dev` 🚀

**¿Necesitas ayuda?** → Lee [`SOLUCION-ERROR-404.md`](./SOLUCION-ERROR-404.md)

**¿Quieres entender el sistema?** → Lee [`ARCHITECTURE.md`](./ARCHITECTURE.md)

---

**Build**: v2.6.2  
**Última actualización**: Marzo 11, 2026  
**Status**: ✅ Funcionando correctamente
