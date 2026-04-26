# 🔧 SOLUCIÓN: Error "Failed to fetch" al hacer Login

## 🚨 **PROBLEMA**
```
Error al iniciar sesión: TypeError: Failed to fetch
```

Este error indica que el navegador no puede conectarse al servidor backend.

---

## ✅ **SOLUCIONES**

### **Solución 1: Verificar que el Servidor Está Desplegado** ⭐ MÁS COMÚN

El Edge Function del servidor necesita estar **desplegado en Supabase** para funcionar.

#### Pasos:
1. **Ir a Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/eubjevjqcpsvpgxmdpvy
   ```

2. **Verificar Edge Functions:**
   - Ir a: **Edge Functions** (menú lateral)
   - Buscar: `make-server`
   - Estado debe ser: **Deployed ✅**

3. **Si NO está desplegado o tiene errores:**
   
   **Opción A: Desplegar desde Dashboard**
   - Click en "Deploy new version"
   - Subir archivo `/supabase/functions/server/index.tsx`
   
   **Opción B: Desplegar desde CLI** (recomendado)
   ```bash
   # Instalar Supabase CLI si no lo tienes
   npm install -g supabase
   
   # Login
   supabase login
   
   # Link al proyecto
   supabase link --project-ref eubjevjqcpsvpgxmdpvy
   
   # Desplegar función
   supabase functions deploy make-server --project-ref eubjevjqcpsvpgxmdpvy
   ```

4. **Verificar logs:**
   - En Supabase Dashboard → Edge Functions → make-server → Logs
   - Buscar errores de inicio

---

### **Solución 2: Verificar URL del Servidor**

#### Verificar en App.tsx (línea 34):
```typescript
const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-25b11ac0`;
```

#### Debe coincidir con:
- `projectId` = `"eubjevjqcpsvpgxmdpvy"`
- URL completa: `https://eubjevjqcpsvpgxmdpvy.supabase.co/functions/v1/make-server-25b11ac0`

#### Prueba manual:
Abre en el navegador:
```
https://eubjevjqcpsvpgxmdpvy.supabase.co/functions/v1/make-server-25b11ac0/clientes
```

**Respuesta esperada:**
- Si funciona: JSON con lista de clientes
- Si falla: Error 404 o error de servidor

---

### **Solución 3: Verificar Variables de Entorno**

El servidor necesita estas variables en Supabase:

1. **Ir a:** Dashboard → Settings → Edge Functions → Secrets

2. **Verificar que existan:**
   ```
   SUPABASE_URL
   SUPABASE_SERVICE_ROLE_KEY
   SUPABASE_DB_URL
   ```

3. **Si faltan, añadirlas:**
   ```bash
   # Desde CLI
   supabase secrets set SUPABASE_URL=https://eubjevjqcpsvpgxmdpvy.supabase.co
   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
   ```

---

### **Solución 4: Verificar CORS**

El servidor tiene CORS habilitado globalmente (línea 10 de index.tsx):
```typescript
app.use('*', cors());
```

Si aún hay problemas de CORS:

1. Verificar que la configuración está en el servidor
2. Limpiar caché del navegador
3. Probar en modo incógnito

---

### **Solución 5: Crear Usuario de Prueba**

Si el servidor funciona pero no hay usuarios en la BD:

#### Opción A: Desde Supabase SQL Editor
```sql
INSERT INTO usuarios (nombre, email, password_hash, rol)
VALUES ('Admin', 'admin@test.com', 'admin123', 'admin');
```

#### Opción B: Desde la app
1. Ir a Configuración → Inicializar BD
2. Click en "Inicializar Datos de Prueba"
3. Esto creará:
   - Usuario admin: `admin@test.com` / `admin123`
   - Usuario coordinador: `coord@test.com` / `coord123`
   - Usuario perfil: `camarero1@test.com` / `pass123`

---

## 🔍 **DIAGNÓSTICO PASO A PASO**

### 1. Abrir Consola del Navegador
```
F12 → Console
```

### 2. Verificar Request
Debería ver:
```
POST https://eubjevjqcpsvpgxmdpvy.supabase.co/functions/v1/make-server-25b11ac0/login
```

### 3. Ver detalles del error:
- **ERR_CONNECTION_REFUSED:** Servidor no está corriendo
- **404 Not Found:** Ruta incorrecta o función no desplegada
- **CORS Error:** Problema de CORS
- **Failed to fetch:** Problema de red o servidor caído

---

## 🧪 **PRUEBA RÁPIDA**

### Test 1: Verificar que el servidor responde

Abrir consola del navegador (F12) y ejecutar:

```javascript
fetch('https://eubjevjqcpsvpgxmdpvy.supabase.co/functions/v1/make-server-25b11ac0/clientes', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1YmpldmpxY3BzdnBneG1kcHZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2NzI5MTcsImV4cCI6MjA0NzI0ODkxN30.0hPfW0JqjQMwNGdULqX_qG3YzLU-JnABBVS7rrewgSo'
  }
})
.then(r => r.json())
.then(d => console.log('✅ Servidor funciona:', d))
.catch(e => console.error('❌ Error:', e));
```

**Resultado esperado:**
```json
{
  "success": true,
  "data": [...]
}
```

---

### Test 2: Verificar Login

```javascript
fetch('https://eubjevjqcpsvpgxmdpvy.supabase.co/functions/v1/make-server-25b11ac0/login', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1YmpldmpxY3BzdnBneG1kcHZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2NzI5MTcsImV4cCI6MjA0NzI0ODkxN30.0hPfW0JqjQMwNGdULqX_qG3YzLU-JnABBVS7rrewgSo',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@test.com',
    password: 'admin123'
  })
})
.then(r => r.json())
.then(d => console.log('✅ Login:', d))
.catch(e => console.error('❌ Error:', e));
```

---

## 🎯 **RESUMEN: Qué hacer AHORA**

1. ✅ **Ir a Supabase Dashboard** → Edge Functions
2. ✅ **Verificar que "make-server" está desplegado**
3. ✅ Si NO está desplegado → **Desplegarlo**
4. ✅ **Ejecutar Test 1 y Test 2** en consola del navegador
5. ✅ Si funciona → **Inicializar datos de prueba**
6. ✅ **Intentar login** con `admin@test.com` / `admin123`

---

## 📞 **Si sigue sin funcionar:**

Comparte:
1. Resultado de Test 1 (consola)
2. Resultado de Test 2 (consola)
3. Screenshot de Supabase → Edge Functions
4. Logs del servidor (Supabase Dashboard → Edge Functions → Logs)

---

**¡La solución más común es desplegar el Edge Function!** 🚀
