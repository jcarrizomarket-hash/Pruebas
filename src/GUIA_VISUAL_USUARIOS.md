# 🎨 Guía Visual - Sistema de Usuarios y Roles

## 🖼️ Capturas de Pantalla (Descripción)

### 1. Pantalla de Login

```
┌─────────────────────────────────────────────┐
│              🔒 [Ícono Lock]                │
│                                             │
│         Gestión de Perfiles                 │
│    Ingresa tus credenciales para continuar  │
│                                             │
│  Email                                      │
│  ┌───────────────────────────────────────┐ │
│  │ email@ejemplo.com                     │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  Contraseña                                 │
│  ┌───────────────────────────────────────┐ │
│  │ ••••••••                           👁 │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │        Iniciar Sesión                 │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  ¿Olvidaste tu contraseña? Contacta al...  │
│                                             │
│  ▼ ¿Primera vez? Crear usuario admin       │
│  └─ (Desplegable con código JavaScript)    │
└─────────────────────────────────────────────┘
```

---

### 2. Vista Admin - Panel de Usuarios

**Ruta:** Configuración → Contraseñas y Usuarios

```
┌─────────────────────────────────────────────────────────────┐
│ 🔑 Panel de Control de Usuarios y Contraseñas              │
│ Gestiona usuarios, roles y restablecimiento de contraseñas │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─ Restablecer Contraseña ──────────────────────────────┐  │
│ │ 📧 Envía un email de restablecimiento a un usuario    │  │
│ │                                                        │  │
│ │ ┌──────────────────────────┐  ┌──────────────────┐   │  │
│ │ │ email@ejemplo.com        │  │ 📨 Enviar Email  │   │  │
│ │ └──────────────────────────┘  └──────────────────┘   │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌─ Usuarios del Sistema ─────────────────────────────────┐ │
│ │ 🛡️ Usuarios                       [+ Nuevo Usuario]   │ │
│ │                                                        │ │
│ │ ┌────────────────────────────────────────────────────┐│ │
│ │ │ 🟣 Admin    Juan Pérez                             ││ │
│ │ │             admin@empresa.com      10/03/2026      ││ │
│ │ │                                     [✅ Activo]    ││ │
│ │ └────────────────────────────────────────────────────┘│ │
│ │                                                        │ │
│ │ ┌────────────────────────────────────────────────────┐│ │
│ │ │ 🔵 Coordinador  María García                       ││ │
│ │ │                 maria@empresa.com  10/03/2026      ││ │
│ │ │                                     [✅ Activo]    ││ │
│ │ └────────────────────────────────────────────────────┘│ │
│ │                                                        │ │
│ │ ┌────────────────────────────────────────────────────┐│ │
│ │ │ 🟢 Perfil    Carlos López                          ││ │
│ │ │              carlos@empresa.com    10/03/2026      ││ │
│ │ │                                     [❌ Inactivo]  ││ │
│ │ └────────────────────────────────────────────────────┘│ │
│ └────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─ Permisos por Rol ─────────────────────────────────────┐ │
│ │ 🟣 Admin      → Acceso completo                        │ │
│ │ 🔵 Coordinador → Dashboard, Pedidos, Personal...       │ │
│ │ 🟢 Perfil     → Solo tabla con sus registros          │ │
│ └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

### 3. Formulario Crear Usuario

```
┌─ Nuevo Usuario ────────────────────────────────┐
│                                                │
│  Email                     Nombre              │
│  ┌──────────────────┐     ┌──────────────────┐│
│  │ email@ejemplo.com│     │ Nombre Completo  ││
│  └──────────────────┘     └──────────────────┘│
│                                                │
│  Rol                       Contraseña Inicial │
│  ┌──────────────────┐     ┌──────────────────┐│
│  │ [Perfil ▼]       │     │ ••••••••         ││
│  │ • Admin          │     └──────────────────┘│
│  │ • Coordinador    │                         │
│  │ • Perfil         │                         │
│  └──────────────────┘                         │
│                                                │
│              [🛡️ Crear Usuario]               │
└────────────────────────────────────────────────┘
```

---

### 4. Vista Perfil - Mis Registros

```
┌─────────────────────────────────────────────────────────────────────┐
│ 📋 Mis Registros de Trabajo                                        │
│ Historial de entradas y salidas en eventos      [📥 Exportar Excel]│
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│ │ 📅 15       │  │ ⏱️ 120.5h   │  │ 👥 8        │                 │
│ │ Total       │  │ Horas       │  │ Clientes    │                 │
│ │ Eventos     │  │ Totales     │  │ Diferentes  │                 │
│ └─────────────┘  └─────────────┘  └─────────────┘                 │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ Fecha      │ Cliente      │ Evento    │ Lugar    │ H.Entrada│H.Salida│Horas│
├────────────┼──────────────┼───────────┼──────────┼──────────┼────────┼─────┤
│📅 10/03/26│ Hotel Plaza  │ Boda      │ Madrid   │ 🕐 18:00 │🕐 02:00│8.0h │
│   Viernes  │              │           │          │          │        │     │
├────────────┼──────────────┼───────────┼──────────┼──────────┼────────┼─────┤
│📅 08/03/26│ Rest. Gourmet│ Congreso  │ Barcelona│ 🕐 09:00 │🕐 18:00│9.0h │
│   Miércoles│              │           │          │          │        │     │
├────────────┼──────────────┼───────────┼──────────┼──────────┼────────┼─────┤
│📅 05/03/26│ Catering XYZ │ Cocktail  │ Valencia │ 🕐 20:00 │🕐 01:00│5.0h │
│   Domingo  │              │           │          │          │        │     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Códigos de Color

### Roles
```
🟣 Admin        → #9333EA (Púrpura)
🔵 Coordinador  → #2563EB (Azul)
🟢 Perfil       → #16A34A (Verde)
```

### Estados
```
✅ Activo    → Verde claro (#10B981)
❌ Inactivo  → Rojo claro (#EF4444)
```

### Badges
```
┌─────────────────┐
│ 👑 Admin        │  Fondo: #F3E8FF, Texto: #6B21A8
└─────────────────┘

┌─────────────────┐
│ 👔 Coordinador  │  Fondo: #DBEAFE, Texto: #1E40AF
└─────────────────┘

┌─────────────────┐
│ 👤 Perfil       │  Fondo: #DCFCE7, Texto: #15803D
└─────────────────┘
```

---

## 📱 Navegación por Rol

### Admin
```
┌─────────────────────────────────────────────────────────────┐
│ [Dashboard] [Pedidos] [Personal] [Admin] [Informes] [Envíos] [Configuración] │
└─────────────────────────────────────────────────────────────┘
                         ↑ TODAS las pestañas visibles
```

### Coordinador
```
┌───────────────────────────────────────────────────────┐
│ [Dashboard] [Pedidos] [Personal] [Admin] [Informes] [Envíos] │
└───────────────────────────────────────────────────────┘
                   ↑ SIN pestaña Configuración
```

### Perfil
```
┌─────────────────────────────────────────┐
│   Mis Registros de Trabajo              │
│   (Vista única, sin pestañas)           │
└─────────────────────────────────────────┘
```

---

## 🔄 Flujo de Trabajo Visual

### Crear Primer Admin
```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Abrir   │ →  │  Abrir   │ →  │ Ejecutar │ →  │  Login   │
│  App     │    │  F12     │    │  Script  │    │   como   │
│  Login   │    │ Console  │    │   API    │    │  Admin   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                      ↓
                              Usuario admin creado
```

### Admin Crea Usuario
```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Login   │ →  │   Ir a   │ →  │ Completar│ →  │ Usuario  │
│   como   │    │  Config  │    │ Formulario│    │  creado  │
│  Admin   │    │  →Users  │    │  + Enviar │    │  y listo │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

### Usuario Inicia Sesión
```
┌──────────┐    ┌──────────┐    ┌──────────┐
│  Ingresar│ →  │ Validar  │ →  │  Vista   │
│   Email  │    │  en API  │    │  según   │
│   + Pass │    │          │    │   Rol    │
└──────────┘    └──────────┘    └──────────┘
```

---

## 🎯 Casos de Uso Visuales

### Caso 1: Nuevo Empleado
```
1. Admin crea usuario → Rol: Perfil
2. Admin crea camarero en Personal → Mismo email
3. Empleado hace login
4. Ve tabla con sus registros (inicialmente vacía)
5. Después del primer evento, ve sus horas trabajadas
```

### Caso 2: Promoción a Coordinador
```
1. Admin va a Configuración → Usuarios
2. Busca al usuario Perfil
3. (Actualmente necesitaría crear nuevo usuario)
   → Mejora futura: Botón "Cambiar Rol"
```

### Caso 3: Usuario Olvida Contraseña
```
1. Usuario contacta a Admin
2. Admin va a Config → Usuarios
3. Ingresa email del usuario
4. Click "Enviar Email"
5. Usuario recibe email con token
6. (Próxima mejora: Pantalla de reset en app)
```

---

## 📊 Estructura de Datos Visual

```
Usuario
├── id: "usuario:1710086400000"
├── email: "juan@empresa.com"
├── nombre: "Juan Pérez"
├── rol: "admin" | "coordinador" | "perfil"
├── password: [HASH]
├── activo: true | false
└── fechaCreacion: "2026-03-10T10:00:00Z"

        ↓ Si es Perfil

Camarero (con mismo email)
├── id: "camarero:123..."
├── nombre: "Juan"
├── apellido: "Pérez"
├── email: "juan@empresa.com"  ← Mismo email!
└── ...

        ↓ Tiene asignaciones en

Pedidos
└── asignaciones[]
    └── camareroId: "camarero:123..."
        ├── entradaRegistrada: true
        ├── registroEntrada: "2026-03-10T18:00:00Z"
        ├── salidaRegistrada: true
        └── registroSalida: "2026-03-11T02:00:00Z"

        ↓ Se muestran en

Vista de Perfil
└── Tabla con registros filtrados por email
```

---

## 🎬 Animaciones y Transiciones

### Hover States
```
Botones:      Normal → Hover (scale 1.05, shadow)
Tarjetas:     Normal → Hover (shadow aumenta)
Links:        Gray → Blue (transition 200ms)
```

### Loading States
```
Login:        Spinner en botón
Crear User:   "Creando..." con spinner
Cargar Tabla: Skeleton o spinner
```

### Estados Visuales
```
✅ Activo:    Verde, animación pulse
❌ Inactivo:  Rojo, opacidad reducida
🔄 Cargando:  Azul, spinner rotando
```

---

## 🎨 Iconografía

```
👑 Admin          - Corona (superioridad)
👔 Coordinador    - Corbata (profesionalismo)
👤 Perfil         - Usuario (individual)
🔒 Login          - Candado (seguridad)
🔑 Contraseñas    - Llave (acceso)
📧 Email          - Sobre (comunicación)
✅ Activo         - Check verde (aprobado)
❌ Inactivo       - X roja (bloqueado)
📊 Dashboard      - Gráfica (métricas)
📋 Registros      - Clipboard (lista)
📥 Exportar       - Descarga (archivo)
```

---

## 📐 Layout Responsivo

### Desktop (>1024px)
```
├─ Navegación horizontal completa
├─ Formularios en 2 columnas
├─ Tablas con scroll horizontal si necesario
└─ Estadísticas en fila (3 cards)
```

### Tablet (768px - 1024px)
```
├─ Navegación horizontal con scroll
├─ Formularios en 2 columnas
├─ Tablas responsivas
└─ Estadísticas en fila
```

### Mobile (<768px)
```
├─ Navegación horizontal con scroll
├─ Formularios en 1 columna
├─ Tablas con scroll horizontal
└─ Estadísticas apiladas (columna)
```

---

## ✨ Detalles de UX

### Feedback Visual
```
✅ Éxito    → Toast verde, 3 segundos
❌ Error    → Toast rojo, 5 segundos
⚠️ Advertencia → Toast amarillo, 4 segundos
ℹ️ Info     → Toast azul, 3 segundos
```

### Estados del Formulario
```
Vacío      → Border gris
Focus      → Border azul, ring azul
Error      → Border rojo, texto rojo
Disabled   → Fondo gris, cursor not-allowed
```

### Validación en Tiempo Real
```
Email      → Validación al blur
Password   → Mostrar/ocultar con ícono ojo
Rol        → Dropdown con descripciones
```

---

## 🚀 Performance

### Optimizaciones Visuales
```
✅ Lazy loading de componentes pesados
✅ Memoización de listas grandes
✅ Debounce en búsquedas (si se implementa)
✅ Paginación en tablas (futuro)
```

### Tiempos de Respuesta
```
Login:           < 500ms
Crear Usuario:   < 300ms
Cargar Registros: < 1s
Exportar Excel:  < 2s (dependiendo de cantidad)
```

---

**Esta guía visual te ayuda a entender cómo se ve y funciona el sistema de usuarios en cada aspecto.**

**Última actualización:** 10 de marzo de 2026
