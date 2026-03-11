# 🧪 Guía de Prueba Local - Build v2.6.2

## ✅ PROBLEMA RESUELTO

**Error Original**: `(index):1 Failed to load resource: the server responded with a status of 404 (Not Found)`

**Causa**: Archivo conflictivo `/public/_headers/main.tsx` (archivo de configuración de Netlify que NO debería existir)

**Solución**: ✅ Archivo eliminado

---

## 🚀 Pasos para Probar Localmente

### 1. Detener el Servidor (si está corriendo)

En la terminal donde corre `npm run dev`, presiona:
```
Ctrl + C
```

### 2. Limpiar y Reinstalar (OPCIONAL, solo si hay problemas)

```bash
# Eliminar node_modules y cache
rm -rf node_modules dist .vite

# Reinstalar
npm install
```

### 3. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

Deberías ver algo como:
```
  VITE v6.0.3  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 4. Abrir el Navegador

El navegador debería abrirse automáticamente en:
```
http://localhost:5173/
```

Si no se abre, abre manualmente la URL.

---

## ✅ Qué Deberías Ver

### En la Consola del Navegador (F12 → Console):

```
🚀 App iniciando - Build v2.6.2
📍 Location: http://localhost:5173/
🔧 Environment: development
```

### En Network Tab (F12 → Network):

Todos los archivos con **Status 200**:
- ✅ `localhost:5173/` → **200** (index.html)
- ✅ `src/main.tsx` → **200**
- ✅ `App.tsx` → **200**
- ✅ `styles/globals.css` → **200**
- ✅ `node_modules/...` → **200**

### En la Pantalla:

Deberías ver la **Pantalla de Login** del sistema:
```
┌─────────────────────────────────┐
│  Gestión de Perfiles            │
│  para Eventos                   │
│                                 │
│  Email: [___________________]  │
│  Password: [_______________]   │
│                                 │
│  [  Iniciar Sesión  ]          │
└─────────────────────────────────┘
```

---

## ❌ Qué NO Deberías Ver

- ❌ Errores 404 en la consola
- ❌ "Failed to load resource"
- ❌ Pantalla en blanco
- ❌ Errores de importación de módulos
- ❌ Referencias a `_headers`

---

## 🔍 Si Aún Hay Errores

### Error: "Cannot GET /"
**Causa**: El servidor no está corriendo  
**Solución**: `npm run dev`

### Error: "EADDRINUSE: address already in use ::5173"
**Causa**: El puerto 5173 ya está en uso  
**Solución**:
```bash
# Matar el proceso
npx kill-port 5173

# O usar otro puerto
npm run dev -- --port 3000
```

### Error: "Cannot find module..."
**Causa**: Dependencias no instaladas  
**Solución**:
```bash
npm install
```

### Error: 404 en archivos
**Causa**: Posibles archivos residuales  
**Solución**:
```bash
# Limpiar caché de Vite
rm -rf .vite
npm run dev
```

---

## 🧪 Test de Funcionalidad Básica

### 1. Test de Login

**Usuario de Prueba** (si ya lo creaste):
- Email: `admin@test.com`
- Password: (la que configuraste)

**O crear uno nuevo** desde el Panel de Test:
1. Abrir: http://localhost:5173/
2. En la consola del navegador, ejecutar:
```javascript
// Ir temporalmente al panel de inicialización
window.location.href = '/init-test';
```

### 2. Test de Conexión con Supabase

En la consola del navegador:
```javascript
// Verificar que las credenciales existen
console.log('Project ID:', import.meta.env.VITE_SUPABASE_PROJECT_ID || 'eubjevjqcpsvpgxmdpvy');
console.log('Anon Key existe:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

// Test rápido de conexión
fetch('https://eubjevjqcpsvpgxmdpvy.supabase.co/functions/v1/make-server-ce05fe95/test', {
  headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1YmpldmpxY3BzdnBneG1kcHZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzNjIyOTEsImV4cCI6MjA1MTkzODI5MX0.CU0i8fPHnLW5ZWnvyGvd5Wj96AW6UdPBW2_g2E0ufW0' }
})
.then(r => r.json())
.then(d => console.log('✅ Servidor responde:', d))
.catch(e => console.error('❌ Error:', e));
```

---

## 📊 Estructura de Archivos Correcta

```
/
├── public/
│   ├── robots.txt ✅
│   └── vite.svg ✅
├── src/
│   ├── main.tsx ✅
│   ├── api/
│   ├── types.ts
│   └── utils/
├── components/
│   ├── login.tsx ✅
│   ├── dashboard.tsx
│   └── ... (otros)
├── styles/
│   └── globals.css ✅
├── App.tsx ✅
├── index.html ✅
├── vite.config.ts ✅
├── package.json ✅
└── tsconfig.json ✅
```

### ❌ Archivos/Directorios que NO Deben Existir:

- ❌ `/public/_headers/` (directorio completo)
- ❌ `/public/404.html`
- ❌ `netlify.toml`
- ❌ `_redirects`

---

## 🎯 Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build de producción (genera /dist)
npm run build

# Preview del build
npm run preview

# Ver logs del servidor Supabase
npm run logs:supabase

# Test rápido de API
npm run test:api

# Deploy a Supabase Functions
npm run deploy:supabase
```

---

## ✅ Checklist de Verificación

- [ ] Servidor local corre sin errores (`npm run dev`)
- [ ] No hay errores 404 en la consola (F12)
- [ ] Pantalla de login se ve correctamente
- [ ] Logs de consola muestran "Build v2.6.2"
- [ ] Network tab muestra todos los archivos con Status 200
- [ ] No hay referencias a `_headers` en ninguna parte

---

**Build**: v2.6.2  
**Fecha**: Marzo 11, 2026  
**Status**: ✅ Archivo conflictivo eliminado - Listo para pruebas
