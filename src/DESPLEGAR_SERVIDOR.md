# 🚀 CÓMO DESPLEGAR EL SERVIDOR

## ❌ **PROBLEMA ACTUAL**
```
GET https://eubjevjqcpsvpgxmdpvy.supabase.co/functions/v1/make-server-25b11ac0/clientes
Status: 404 (Not Found)
```

**Causa:** El Edge Function no está desplegado en Supabase.

---

## ✅ **SOLUCIÓN PARA FIGMA MAKE**

En Figma Make, el despliegue del servidor es **automático**, pero a veces necesita un "empuje" para sincronizar.

### **Método 1: Forzar Re-despliegue** ⭐ RECOMENDADO

1. **Edita cualquier archivo del servidor:**
   - Abre `/supabase/functions/server/index.tsx`
   - Añade un comentario al final del archivo:
   ```typescript
   Deno.serve(app.fetch);
   
   // Trigger redeploy - [fecha actual]
   ```

2. **Guarda el archivo** (Ctrl+S o Cmd+S)

3. **Espera 30-60 segundos** para que Figma Make detecte el cambio y redespliegue

4. **Verifica en el navegador:**
   ```
   https://eubjevjqcpsvpgxmdpvy.supabase.co/functions/v1/make-server-25b11ac0/clientes
   ```

---

### **Método 2: Verificar Estado del Servidor**

Figma Make debería mostrar el estado del servidor en la interfaz.

**Busca:**
- Indicador de "Deploying..." o "Deployed"
- Mensajes de error en la consola
- Logs del servidor

---

### **Método 3: Reiniciar Preview** (Si los métodos anteriores no funcionan)

Si Figma Make tiene un botón de "Restart" o "Refresh":
1. Click en el botón de restart/refresh
2. Espera a que la aplicación se recargue
3. Verifica nuevamente la URL

---

## 🔍 **VERIFICAR SI FUNCIONÓ**

### Test 1: Endpoint de Clientes
Abre en el navegador:
```
https://eubjevjqcpsvpgxmdpvy.supabase.co/functions/v1/make-server-25b11ac0/clientes
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": []
}
```

### Test 2: Endpoint de Login (desde consola F12)
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
.then(d => console.log('✅ Resultado:', d))
.catch(e => console.error('❌ Error:', e));
```

---

## 🛠️ **SI AÚN NO FUNCIONA**

### Opción A: Despliegue Manual desde Supabase

1. **Ir a Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/eubjevjqcpsvpgxmdpvy/functions
   ```

2. **Ver si existe una función llamada "server" o "make-server"**

3. **Si no existe:**
   - Click "Create a new function"
   - Nombre: `server` (importante: sin "make-" al inicio)
   - Copiar todo el contenido de `/supabase/functions/server/index.tsx`
   - Pegar en el editor
   - Click "Deploy"

4. **Configurar variables de entorno:**
   - Ir a Settings → Edge Functions → Secrets
   - Añadir si no existen:
     ```
     SUPABASE_URL=https://eubjevjqcpsvpgxmdpvy.supabase.co
     SUPABASE_SERVICE_ROLE_KEY=[tu-service-role-key]
     SUPABASE_DB_URL=[tu-db-url]
     ```

---

### Opción B: Usar Supabase CLI

```bash
# 1. Instalar Supabase CLI
npm install -g supabase

# 2. Login
supabase login

# 3. Link al proyecto
supabase link --project-ref eubjevjqcpsvpgxmdpvy

# 4. Desplegar la función
supabase functions deploy server

# 5. Verificar
curl https://eubjevjqcpsvpgxmdpvy.supabase.co/functions/v1/server/make-server-25b11ac0/clientes
```

**NOTA:** El nombre de la función es "server", pero las rutas internas usan el prefijo "/make-server-25b11ac0/..."

---

## 📋 **CHECKLIST DE VERIFICACIÓN**

Antes de continuar, verifica:

- [ ] El archivo `/supabase/functions/server/index.tsx` existe
- [ ] El archivo termina con `Deno.serve(app.fetch);`
- [ ] Las rutas usan el prefijo `/make-server-25b11ac0/`
- [ ] El archivo `db-helpers.ts` está en la misma carpeta
- [ ] El archivo `kv_store.tsx` está en la misma carpeta
- [ ] No hay errores de sintaxis en el código

---

## 🎯 **PRÓXIMOS PASOS DESPUÉS DEL DESPLIEGUE**

Una vez que el servidor funcione (test 1 pasa):

1. **Ir a la app**
2. **Configuración** → **Inicializar BD**
3. **Click "Inicializar Datos de Prueba"**
4. **Login con:**
   ```
   Email: admin@test.com
   Password: admin123
   ```

---

## 💡 **EXPLICACIÓN TÉCNICA**

### Estructura actual:
```
/supabase/functions/server/index.tsx
```

### Esto crea un Edge Function llamado:
```
"server"
```

### Accesible en:
```
https://PROJECT_ID.supabase.co/functions/v1/server
```

### Las rutas dentro del servidor usan prefijo:
```
/make-server-25b11ac0/clientes
```

### Por lo tanto, la URL completa es:
```
https://PROJECT_ID.supabase.co/functions/v1/make-server-25b11ac0/clientes
```

**ESPERA... HAY UN PROBLEMA AQUÍ** ⚠️

La URL debería ser:
```
https://PROJECT_ID.supabase.co/functions/v1/server/make-server-25b11ac0/clientes
```

**PERO** el código del App.tsx usa:
```
https://PROJECT_ID.supabase.co/functions/v1/make-server-25b11ac0/clientes
```

Esto significa que **el nombre de la función en Supabase debe ser "make-server-25b11ac0"**, no "server".

---

## 🔧 **CORRECCIÓN NECESARIA**

Hay dos opciones:

### **Opción 1: Cambiar el nombre de la carpeta** (Recomendado)

Renombrar:
```
/supabase/functions/server/
```

A:
```
/supabase/functions/make-server-25b11ac0/
```

Pero **NO PUEDO HACER ESTO** porque Figma Make puede no soportar carpetas con nombres especiales.

### **Opción 2: Cambiar las rutas en el servidor** (Más fácil)

En lugar de:
```typescript
app.get('/make-server-25b11ac0/clientes', ...)
```

Usar:
```typescript
app.get('/clientes', ...)
```

Y en el App.tsx cambiar:
```typescript
const baseUrl = `https://${projectId}.supabase.co/functions/v1/server`;
```

---

## ⚠️ **DECISIÓN IMPORTANTE**

¿Qué prefieres?

**A)** Mantener nombre "server" y quitar prefijo de rutas  
**B)** Intentar renombrar carpeta a "make-server-25b11ac0"  
**C)** Crear un archivo de configuración especial

**Necesito tu decisión para continuar** 🤔
