# 🔑 Obtener Nuevas API Keys de Supabase

## ⚠️ Problema

```
Error: "Legacy API keys are disabled"
Fecha de deshabilitación: 2026-03-18
```

Las claves **legacy** (anon, service_role) fueron deshabilitadas por Supabase.

Necesitas obtener las **nuevas claves**:
- ✅ **Publishable Key** (reemplaza anon key)
- ✅ **Secret Key** (reemplaza service_role key)

---

## 📋 Paso 1: Ir al Dashboard de Supabase

### Proyecto de Desarrollo
```
https://supabase.com/dashboard/project/eubjevjqcpsvpgxmdpvy/settings/api
```

### Proyecto de Producción
```
https://supabase.com/dashboard/project/bvnbwqsvldsfdfzifcp/settings/api
```

---

## 📋 Paso 2: Obtener las Nuevas Claves

En la página de **Settings → API**, verás:

### 🔑 Sección "API Keys"

**Publishable (anon) key:**
```
Nombre en dashboard: "Publishable (anon) key" o "Publishable key"
Uso: Frontend/Cliente (público)
```

**Secret (service_role) key:**
```
Nombre en dashboard: "Secret (service_role) key" o "Secret key"
Uso: Backend/Servidor (privado)
⚠️ NUNCA exponer en frontend
```

---

## 📋 Paso 3: Re-habilitar Legacy Keys (Opcional)

Si prefieres seguir usando las claves antiguas:

1. En el mismo dashboard: **Settings → API**
2. Buscar sección: **"Legacy API Keys"**
3. Click en: **"Re-enable legacy keys"**

Pero **NO es recomendado** - mejor usar las nuevas.

---

## 📝 Paso 4: Actualizar Configuración

### Opción A: Actualizar archivo de configuración

Una vez que tengas las nuevas claves, cópialas aquí:

```typescript
// src/app/config/supabase.config.ts

const configs = {
  development: {
    projectId: 'eubjevjqcpsvpgxmdpvy',
    url: 'https://eubjevjqcpsvpgxmdpvy.supabase.co',
    anonKey: 'PEGAR_NUEVA_PUBLISHABLE_KEY_DESARROLLO'  // ← Aquí
  },
  production: {
    projectId: 'bvnbwqsvldsfdfzifcp',
    url: 'https://bvnbwqsvldsfdfzifcp.supabase.co',
    anonKey: 'PEGAR_NUEVA_PUBLISHABLE_KEY_PRODUCCION'  // ← Aquí
  }
};
```

### Opción B: Decirme las claves

Pégame aquí las nuevas claves y yo actualizo la configuración:

**Para Desarrollo (eubjevjqcpsvpgxmdpvy):**
```
Publishable key: [PEGAR AQUÍ]
Secret key: [PEGAR AQUÍ]
```

**Para Producción (bvnbwqsvldsfdfzifcp):**
```
Publishable key: [PEGAR AQUÍ]
Secret key: [PEGAR AQUÍ]
```

---

## 🔍 Dónde Encontrar las Claves

### En el Dashboard de Supabase

1. **Dashboard** → Tu Proyecto
2. **Settings** (⚙️ en el menú lateral)
3. **API**
4. Scroll hasta **"Project API keys"**

Verás algo como:

```
┌─────────────────────────────────────────┐
│ Project API keys                        │
├─────────────────────────────────────────┤
│ Publishable (anon) key                  │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...     │ ← Copiar esta
│ [Show] [Copy]                           │
├─────────────────────────────────────────┤
│ Secret (service_role) key               │
│ ••••••••••••••••••••••••••••••••        │
│ [Show] [Copy]                           │ ← Click "Show" y copiar
└─────────────────────────────────────────┘
```

---

## ⚡ Solución Rápida (Re-habilitar Legacy)

Si quieres que funcione **inmediatamente** sin cambiar claves:

### 1. Ir a Settings → API

**Desarrollo:**
```
https://supabase.com/dashboard/project/eubjevjqcpsvpgxmdpvy/settings/api
```

**Producción:**
```
https://supabase.com/dashboard/project/bvnbwqsvldsfdfzifcp/settings/api
```

### 2. Scroll hasta "Legacy API Keys"

Verás un mensaje:
```
⚠️ Legacy API keys were disabled on 2026-03-18
```

### 3. Click en "Re-enable"

Esto restaurará las claves antiguas (anon_key y service_role_key).

### 4. Refresh la app

```
http://localhost:4173/
```

El login debería funcionar inmediatamente.

---

## 🎯 Recomendación

**Mejor práctica:**
1. ✅ Obtener las nuevas Publishable/Secret keys
2. ✅ Actualizar `supabase.config.ts`
3. ✅ Rebuild: `pnpm build:prod`
4. ✅ Probar login

**Solución rápida (temporal):**
1. Re-habilitar legacy keys en dashboard
2. Login funciona inmediatamente
3. Planear migración a nuevas keys después

---

## 📞 Siguiente Paso

**Por favor proporciona:**

1. **Nuevas Publishable keys** (desarrollo y producción)
   
   O

2. **Confirma** que re-habilitaste las legacy keys

Y yo actualizo la configuración para que el login funcione.

---

## 🔐 Nota de Seguridad

**Publishable key (anon):**
- ✅ Segura para exponer en frontend
- ✅ Limitada por Row Level Security (RLS)
- ✅ Puede estar en GitHub

**Secret key (service_role):**
- ❌ NUNCA en frontend
- ❌ NUNCA en GitHub
- ✅ Solo en backend/servidor
- ✅ Solo en variables de entorno de hosting

---

## 📱 URLs de Acceso Rápido

**Desarrollo - API Settings:**
```
https://supabase.com/dashboard/project/eubjevjqcpsvpgxmdpvy/settings/api
```

**Producción - API Settings:**
```
https://supabase.com/dashboard/project/bvnbwqsvldsfdfzifcp/settings/api
```

**Login de Supabase:**
```
https://supabase.com/dashboard/sign-in
```
