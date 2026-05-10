# 🔍 Debug del Login - Ver Logs

## ✅ Cambios Realizados

He agregado logs de debug para identificar el problema.

---

## 🧪 Pasos para Debuggear

### Paso 1: Abrir la Aplicación

```
http://localhost:4173/
```

### Paso 2: Abrir DevTools (F12)

### Paso 3: Ver Console Tab

Deberías ver estos logs **ANTES** de hacer login:

```javascript
🔧 Supabase Config: {
  environment: "production",        // ← Debe decir "production"
  projectId: "bvnbwqsvldsfdfzifcp", // ← Proyecto de producción
  url: "https://bvnbwqsvldsfdfzifcp.supabase.co",
  mode: "production",
  viteAppEnv: "production",
  hostname: "localhost"
}

🔑 Supabase Client Init: {
  url: "https://bvnbwqsvldsfdfzifcp.supabase.co",
  keyPrefix: "sb_publishable_H3Fwq..."
}
```

### Paso 4: Verificar Ambiente

**✅ CORRECTO:**
```
environment: "production"
projectId: "bvnbwqsvldsfdfzifcp"
keyPrefix: "sb_publishable_H3Fwq..."
```

**❌ INCORRECTO:**
```
environment: "development"
projectId: "eubjevjqcpsvpgxmdpvy"  // ← Esto es desarrollo!
```

---

## 🔍 Qué Verificar en la Console

### 1. Ambiente Detectado

Si ves:
```
environment: "development"
```

Significa que está usando desarrollo en vez de producción.

**Causa posible:**
- El modo de Vite no es "production"
- El build no se hizo con `pnpm build:prod`

**Solución:**
```bash
pnpm build:prod
pnpm preview:prod
```

### 2. Project ID

Si ves:
```
projectId: "eubjevjqcpsvpgxmdpvy"
```

Está usando el proyecto de **desarrollo**, no producción.

**Solución:** Verificar que el modo sea "production".

### 3. API Key Prefix

Si ves:
```
keyPrefix: "eyJhbGciOiJIUzI1NiI..."
```

Está usando una **legacy key** (antigua), no la nueva publishable key.

**Debe decir:**
```
keyPrefix: "sb_publishable_H3Fwq..."
```

---

## 🐛 Error Actual

El error que recibiste:

```
GoTrueClient@sb-eubjevjqcpsvpgxmdpvy-auth-token  ← Desarrollo!
Error: Invalid API key
```

Indica que:
1. ❌ Está usando **eubjevjqcpsvpgxmdpvy** (desarrollo)
2. ❌ La API key no es válida para ese proyecto

---

## 📋 Pasos a Seguir

### 1. Refresh Completo

En el navegador:
- **Chrome/Edge:** `Ctrl + Shift + R` (Windows) o `Cmd + Shift + R` (Mac)
- **Firefox:** `Ctrl + F5` (Windows) o `Cmd + Shift + R` (Mac)

Esto fuerza la recarga sin caché.

### 2. Ver Console Logs

Copia y pégame aquí los logs que aparecen:

```
🔧 Supabase Config: { ... }
🔑 Supabase Client Init: { ... }
```

### 3. Intentar Login

Usa:
```
Email:    admin@camareros.app
Password: admin123
```

### 4. Ver Errores

Si hay error, cópiame:
- El mensaje de error completo
- Los logs de la console

---

## 🔧 Si el Ambiente es Incorrecto

Si la console muestra `environment: "development"`:

### Opción 1: Limpiar Caché del Navegador

1. **DevTools (F12)** → **Application** tab
2. **Storage** → **Clear site data**
3. **Refresh** la página

### Opción 2: Rebuild Completo

```bash
# Limpiar
rm -rf dist/
rm -rf node_modules/.vite/

# Rebuild
pnpm build:prod

# Preview
pnpm preview:prod
```

### Opción 3: Forzar Modo Production

Edita `vite.config.ts` temporalmente:

```typescript
export default defineConfig(({ mode }) => {
  console.log('🔧 Vite Mode:', mode); // ← Ver qué modo está usando
  
  return {
    // ... resto de config
  }
})
```

---

## 💡 Posible Causa

El problema más probable es que el **build está usando modo "development"** en vez de "production".

Cuando ejecutas `pnpm preview:prod`, debería:
1. ✅ Leer el build de `dist/` (ya generado)
2. ✅ Usar `--mode production` (especificado en el script)
3. ✅ Detectar `MODE=production`
4. ✅ Usar configuración de producción

Si está usando desarrollo, puede ser que:
- El build no se hizo correctamente
- El modo no se está pasando bien
- Hay caché del navegador

---

## 📞 Siguiente Paso

**Por favor:**

1. Abre `http://localhost:4173/`
2. Abre DevTools (F12) → Console
3. Refresh completo (Ctrl+Shift+R)
4. Copia los logs que aparecen
5. Pégamelos aquí

Con eso puedo ver exactamente qué está detectando y corregir el problema.

---

## 🎯 Objetivo

Los logs deberían mostrar:

```javascript
✅ environment: "production"
✅ projectId: "bvnbwqsvldsfdfzifcp"
✅ keyPrefix: "sb_publishable_H3Fwq..."
```

Si no es así, hay un problema con la detección de ambiente que arreglaremos.
