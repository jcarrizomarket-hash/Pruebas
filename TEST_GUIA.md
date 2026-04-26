# Guía de Testing - Configuración de Ambientes

## ✅ Test de Configuración Completado

Has ejecutado exitosamente el test de configuración de variables de entorno.

---

## 🧪 Scripts de Testing Disponibles

### 1. **Verificar Configuración de Desarrollo**
```bash
pnpm test:env
```
o
```bash
NODE_ENV=development pnpm test:env
```

**Qué verifica:**
- ✅ Archivos .env existen
- ✅ Variables críticas están configuradas
- ✅ Estructura del proyecto es correcta
- ✅ Scripts de npm/pnpm están definidos

### 2. **Verificar Configuración de Producción**
```bash
pnpm test:env:prod
```

**Nota:** Fallará hasta que configures las credenciales de producción en `.env.production`

---

## 🚀 Próximo Paso: Probar la Aplicación en Vivo

Ahora que las variables de entorno están configuradas, prueba la aplicación completa:

### Paso 1: Iniciar el Servidor de Desarrollo

```bash
pnpm dev
```

**Qué hace:**
- Inicia Vite en modo desarrollo
- Carga variables desde `.env.development`
- Abre la aplicación en el navegador
- Habilita hot-reload

### Paso 2: Verificar la Aplicación

Una vez iniciado el servidor, verifica:

1. **✅ El servidor arranca sin errores**
   ```
   VITE v6.3.5  ready in XXX ms
   ➜  Local:   http://localhost:XXXX/
   ```

2. **✅ La aplicación se abre en el navegador**
   - Debería cargar la pantalla de login o dashboard

3. **✅ Conexión con Supabase funciona**
   - Intenta hacer login
   - Verifica que carga datos de las tablas
   - Comprueba que puedes crear/editar registros

### Paso 3: Puntos Críticos a Probar

#### 🔐 Sistema de Autenticación
```
- [ ] Login funciona
- [ ] Panel carga correctamente
- [ ] Roles se cargan (admin/coordinador/camarero)
```

#### 📊 Datos de Supabase
```
- [ ] Se cargan coordinadores
- [ ] Se cargan camareros
- [ ] Se cargan clientes
- [ ] Se cargan pedidos/eventos
```

#### ✏️ Operaciones CRUD
```
- [ ] Crear nuevo registro (ej: cliente)
- [ ] Editar registro existente
- [ ] Eliminar registro
- [ ] Códigos correlativos se generan (CLI001, CAM001, etc.)
```

#### 📧 Sistema de Email (si está configurado)
```
- [ ] Envío de confirmaciones
- [ ] Envío de partes
```

---

## 🐛 Troubleshooting

### Error: "Cannot connect to Supabase"

**Causas posibles:**
1. Credenciales incorrectas en `.env.development`
2. Proyecto Supabase pausado/inactivo
3. Tablas no creadas en Supabase

**Solución:**
```bash
# 1. Verificar credenciales
cat .env.development

# 2. Ir a Supabase Dashboard y verificar que el proyecto está activo
# https://app.supabase.com/project/eubjevjqcpsvpgxmdpvy

# 3. Verificar que las tablas existen
# SQL Editor → ejecutar:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;
```

### Error: "Variables de entorno no definidas"

**Solución:**
```bash
# Asegúrate de usar pnpm dev (no npm)
pnpm dev

# Si persiste, verifica que .env.development existe
ls -la .env.development

# Re-ejecutar el test
pnpm test:env
```

### Error: "Module not found"

**Solución:**
```bash
# Reinstalar dependencias
pnpm install

# Limpiar cache y reinstalar
rm -rf node_modules .pnpm-store
pnpm install
```

---

## 📋 Checklist de Verificación Manual

Usa esta lista para verificar manualmente que todo funciona:

### Ambiente de Desarrollo
- [x] ✅ `.env.development` creado
- [x] ✅ Credenciales de Supabase configuradas
- [x] ✅ Script `pnpm test:env` pasa exitosamente
- [ ] ⏳ `pnpm dev` inicia sin errores
- [ ] ⏳ Aplicación carga en el navegador
- [ ] ⏳ Login funciona correctamente
- [ ] ⏳ CRUD de datos funciona
- [ ] ⏳ Códigos correlativos se generan

### Ambiente de Producción (para después)
- [ ] ⏳ Nuevo proyecto Supabase creado
- [ ] ⏳ Tablas creadas en proyecto de producción
- [ ] ⏳ `.env.production` configurado con credenciales
- [ ] ⏳ `pnpm test:env:prod` pasa exitosamente
- [ ] ⏳ Build de producción: `pnpm build:prod`
- [ ] ⏳ Deploy a plataforma (Vercel/Netlify/etc)

---

## 📊 Resultados del Último Test

```
🚀 TEST DE CONFIGURACIÓN DE AMBIENTES
============================================================
📍 Ambiente: development

📁 1. Verificando archivos .env...
   ✅ .env.development: Existe
   ⚠️  .env.production:  Creado (pendiente de configurar)

📋 2. Cargando variables de entorno...
   ✅ Variables cargadas desde: .env.development

🔑 3. Verificando variables críticas...
   ✅ VITE_SUPABASE_PROJECT_ID: eubjevjqcpsvpgxmdpvy
   ✅ VITE_SUPABASE_URL: https://eubjevjqcpsvpgxmdpvy.supabase.co
   ✅ VITE_SUPABASE_ANON_KEY: Configurada ✓
   ✅ SUPABASE_URL: Configurada ✓
   ✅ SUPABASE_ANON_KEY: Configurada ✓

⚙️  4. Verificando configuración del proyecto...
   ✅ Proyecto: @figma/my-make-file
   ✅ Versión: 0.0.1
   ✅ Script "dev": vite --mode development
   ✅ Script "build": vite build

📂 5. Verificando estructura del proyecto...
   ✅ App.tsx
   ✅ index.tsx
   ✅ db-helpers.ts
   ✅ 00_schema_completo.sql

============================================================
✅ VERIFICACIÓN DE CONFIGURACIÓN COMPLETADA
============================================================
```

---

## 🎯 Siguiente Paso Recomendado

**Ejecuta ahora:**

```bash
pnpm dev
```

Y prueba la aplicación en vivo para verificar que la conexión con Supabase funciona correctamente.

---

## 📞 Ayuda Adicional

Si encuentras problemas:

1. **Revisa los logs** de la consola del navegador (F12)
2. **Revisa los logs** del terminal donde corre `pnpm dev`
3. **Verifica Supabase** en https://app.supabase.com
4. **Re-ejecuta el test** con `pnpm test:env`

---

## 📚 Documentación Relacionada

- `WORKFLOW_BRANCHES.md` - Flujo de trabajo con Git branches
- `CONFIGURACION_AMBIENTES.md` - Guía de variables de entorno
- `src/app/supabase/migrations/README.md` - Guía de migraciones SQL
