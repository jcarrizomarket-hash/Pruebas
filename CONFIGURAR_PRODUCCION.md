# 🚀 Guía: Configurar Entorno de Producción

## 📋 Pasos para Configurar Producción

### Paso 1: Obtener Credenciales del Proyecto de Producción

Necesitas las credenciales del **nuevo proyecto de Supabase** que creaste para producción.

#### 1.1 Ir al Dashboard de Supabase

Abre en tu navegador:
```
https://app.supabase.com
```

#### 1.2 Seleccionar tu Proyecto de Producción

- Busca el **nuevo proyecto** que creaste (diferente de `eubjevjqcpsvpgxmdpvy`)
- Haz clic en el proyecto para abrirlo

#### 1.3 Obtener el Project ID

En la URL verás algo como:
```
https://app.supabase.com/project/ABC123XYZ/...
                                   ^^^^^^^^^
                                   Este es tu Project ID
```

**Copia este ID** (ej: `abc123xyz`)

#### 1.4 Ir a Settings → API

En el menú lateral:
1. Clic en **Settings** (⚙️)
2. Clic en **API**

#### 1.5 Copiar las Credenciales

En la página de API encontrarás:

**Project URL:**
```
https://abc123xyz.supabase.co
```

**API Keys:**
- **anon/public** (Publishable key)
  ```
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
  ```

- **service_role** (Secret key)
  ```
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
  ```

⚠️ **IMPORTANTE:** La `service_role` key es confidencial. Nunca la compartas.

---

### Paso 2: Actualizar .env.production

Una vez tengas las credenciales, edita el archivo `.env.production` con estos valores:

```bash
# Reemplaza estos valores:

VITE_SUPABASE_PROJECT_ID=abc123xyz  # ← Tu nuevo Project ID
VITE_SUPABASE_URL=https://abc123xyz.supabase.co  # ← Tu nuevo URL
VITE_SUPABASE_ANON_KEY=eyJhbGci...  # ← Tu anon/public key

SUPABASE_URL=https://abc123xyz.supabase.co  # ← Mismo URL
SUPABASE_ANON_KEY=eyJhbGci...  # ← Misma anon key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...  # ← Tu service_role key
```

**Notas:**
- `VITE_SUPABASE_ANON_KEY` y `SUPABASE_ANON_KEY` tienen el **mismo valor**
- `RESEND_API_KEY` puede ser la misma de desarrollo o una nueva
- Las variables de WhatsApp son opcionales

---

### Paso 3: Verificar que las Tablas Existen en Producción

⚠️ **MUY IMPORTANTE:** Antes de continuar, asegúrate de que el proyecto de producción tiene las 10 tablas creadas.

#### 3.1 Verificar en Supabase Dashboard

1. Ir a tu proyecto de producción
2. Menú lateral → **Table Editor**
3. Verificar que existen estas tablas:
   - coordinadores
   - camareros
   - clientes
   - pedidos
   - asignaciones
   - usuarios
   - qr_tokens
   - registros_asistencia
   - confirmaciones
   - chats

#### 3.2 Si NO existen las tablas

**Ejecutar el script SQL:**

1. En Supabase → **SQL Editor**
2. Copiar el contenido de: `src/app/supabase/migrations/00_schema_completo.sql`
3. Pegar en el editor
4. Hacer clic en **Run**
5. Verificar que se crearon las 10 tablas

---

### Paso 4: Verificar Configuración

Una vez actualizado `.env.production`, ejecuta:

```bash
pnpm test:env:prod
```

**Deberías ver:**
```
✅ VERIFICACIÓN DE CONFIGURACIÓN COMPLETADA

🔑 Variables críticas:
   ✅ VITE_SUPABASE_PROJECT_ID: abc123xyz...
   ✅ VITE_SUPABASE_URL: https://abc123xyz...
   ✅ VITE_SUPABASE_ANON_KEY: eyJhbGci...
   ...

📊 Verificando tablas en Supabase...
   ✅ coordinadores: X registros
   ✅ camareros: X registros
   ...
```

---

## 🔐 Seguridad

### ✅ Archivos que SÍ se guardan en Git

- `package.json`
- `src/**/*.tsx`
- Documentación (*.md)
- Scripts de configuración

### ❌ Archivos que NO se guardan en Git

- `.env.production` ← Credenciales sensibles
- `.env.development` ← Credenciales sensibles
- `node_modules/`

Estos archivos están protegidos por `.gitignore`.

---

## 📊 Diferencias entre Ambientes

| Característica | **Desarrollo** | **Producción** |
|----------------|----------------|----------------|
| **Branch** | `develop` | `main` |
| **Archivo .env** | `.env.development` | `.env.production` |
| **Proyecto Supabase** | `eubjevjqcpsvpgxmdpvy` | Tu nuevo proyecto |
| **Datos** | Datos de prueba | Datos reales |
| **Build** | `pnpm build:dev` | `pnpm build:prod` |
| **Servidor** | `pnpm dev` | Deploy a hosting |

---

## 🚀 Proceso Completo Resumido

### 1️⃣ Obtener Credenciales
```
1. Ir a https://app.supabase.com
2. Abrir proyecto de producción
3. Settings → API
4. Copiar Project ID, URL y API Keys
```

### 2️⃣ Actualizar .env.production
```
Editar .env.production con las credenciales reales
```

### 3️⃣ Verificar Tablas
```
Asegurarse que las 10 tablas existen en producción
Si no existen: ejecutar 00_schema_completo.sql
```

### 4️⃣ Probar Configuración
```bash
pnpm test:env:prod
```

### 5️⃣ Build de Producción
```bash
git checkout main
pnpm build:prod
```

---

## ❓ FAQ

### ¿Puedo usar el mismo proyecto de Supabase para desarrollo y producción?

**No recomendado.** Es mejor tener:
- Un proyecto para desarrollo/pruebas
- Un proyecto separado para producción

Así evitas mezclar datos de prueba con datos reales.

### ¿Qué pasa con los datos de desarrollo?

Los datos de desarrollo (en proyecto `eubjevjqcpsvpgxmdpvy`) se mantienen separados.

Producción puede:
- Empezar vacía (sin datos)
- Importar datos específicos desde desarrollo (opcional)

### ¿Tengo que pagar dos proyectos de Supabase?

Supabase tiene un plan **gratuito** que incluye 2 proyectos activos.

### ¿Las variables .env se suben a Git?

**NO.** Los archivos `.env.*` están en `.gitignore` y **nunca se suben**.

Esto es correcto por seguridad. Cada ambiente (local, servidor) debe tener su propio archivo `.env`.

---

## 📞 Siguiente Paso

Una vez completados los pasos 1-4 de esta guía:

```bash
# Verificar configuración de producción
pnpm test:env:prod

# Si todo está correcto, hacer build
git checkout main
pnpm build:prod
```

---

## 📚 Documentación Relacionada

- `CONFIGURACION_AMBIENTES.md` - Guía detallada de variables de entorno
- `src/app/supabase/migrations/README.md` - Guía de migraciones SQL
- `WORKFLOW_BRANCHES.md` - Workflow con branches
