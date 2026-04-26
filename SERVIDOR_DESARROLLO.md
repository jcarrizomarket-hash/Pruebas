# ✅ Servidor de Desarrollo Iniciado

## 🚀 Estado del Servidor

```
✅ SERVIDOR ACTIVO

URL:      http://localhost:5173/
Modo:     development  
Puerto:   5173
Branch:   develop
Ambiente: .env.development
```

---

## 🔧 Configuración Cargada

El servidor está usando las variables de entorno de `.env.development`:

```bash
VITE_SUPABASE_PROJECT_ID=eubjevjqcpsvpgxmdpvy
VITE_SUPABASE_URL=https://eubjevjqcpsvpgxmdpvy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci... (configurada)
```

Proyecto Supabase: **eubjevjqcpsvpgxmdpvy** (desarrollo)

---

## 📋 Checklist de Verificación

Ahora verifica manualmente en el navegador:

### 1. ✅ Aplicación Carga
- [ ] Abrir http://localhost:5173/
- [ ] La aplicación carga sin errores 404
- [ ] No hay errores en la consola del navegador (F12)

### 2. ✅ Conexión con Supabase
- [ ] Pantalla de login aparece
- [ ] Puedes hacer login
- [ ] Dashboard carga correctamente

### 3. ✅ Datos se Cargan
- [ ] Lista de coordinadores se carga
- [ ] Lista de camareros se carga
- [ ] Lista de clientes se carga
- [ ] Lista de pedidos/eventos se carga

### 4. ✅ CRUD Funciona
- [ ] Crear un nuevo registro (ej: cliente)
- [ ] Se genera código correlativo (CLI001, CLI002, etc.)
- [ ] Editar registro existente
- [ ] Eliminar registro

### 5. ✅ Variables de Entorno
- [ ] En consola del navegador (F12), verificar:
  ```javascript
  console.log(import.meta.env.VITE_SUPABASE_PROJECT_ID)
  // Debe mostrar: eubjevjqcpsvpgxmdpvy
  ```

---

## 🐛 Troubleshooting

### Error: "Cannot connect to Supabase"

**Verificar:**
1. Credenciales en `.env.development`
2. Proyecto Supabase está activo
3. Tablas creadas en Supabase

```bash
# Re-ejecutar test
pnpm test:env

# Verificar variables
cat .env.development | grep SUPABASE
```

### Error: "404 Not Found"

**Solución:**
```bash
# Reiniciar servidor
# Ctrl+C para detener
pnpm dev
```

### Error: "Module not found"

**Solución:**
```bash
# Reinstalar dependencias
pnpm install

# Reiniciar servidor
pnpm dev
```

### La aplicación carga pero no muestra datos

**Verificar en Supabase:**
1. Ir a: https://app.supabase.com/project/eubjevjqcpsvpgxmdpvy
2. Table Editor → Verificar que hay datos
3. SQL Editor → Ejecutar:
   ```sql
   SELECT COUNT(*) FROM coordinadores;
   SELECT COUNT(*) FROM camareros;
   SELECT COUNT(*) FROM clientes;
   ```

---

## 🔄 Comandos del Servidor

### Detener el servidor
```bash
Ctrl+C
```

### Reiniciar el servidor
```bash
pnpm dev
```

### Ver logs en tiempo real
El servidor ya está mostrando logs en la terminal actual.

---

## 🎯 Próximos Pasos

### 1. Verificar la Aplicación
Abre http://localhost:5173/ en tu navegador y verifica:
- Login funciona
- Datos se cargan
- CRUD completo funciona

### 2. Hacer Cambios (opcional)
Si quieres probar el hot-reload:
```bash
# Edita cualquier archivo .tsx
# El navegador se actualizará automáticamente
```

### 3. Guardar Cambios en Git
Cuando termines de probar:
```bash
# Ver cambios
git status

# Guardar cambios (si hiciste alguno)
git add .
git commit -m "test: verificación del servidor de desarrollo"
```

---

## 📊 Información del Ambiente

**Branch actual:** `develop`  
**Ambiente:** development  
**Supabase:** eubjevjqcpsvpgxmdpvy (desarrollo)  
**Base de datos:** Con datos de prueba  

**Para producción:**
- Cambiar a branch `main`
- Usar `.env.production`
- Apuntar al nuevo proyecto Supabase

---

## ✅ Todo Funcionando Correctamente Si...

- [x] Servidor inició sin errores
- [ ] Aplicación carga en http://localhost:5173/
- [ ] Login funciona
- [ ] Datos se muestran correctamente
- [ ] Puedes crear/editar/eliminar registros

---

## 🎉 ¡Servidor Listo!

El servidor de desarrollo está corriendo y listo para usar.

**Abre tu navegador en:** http://localhost:5173/

Para detener el servidor: `Ctrl+C`
