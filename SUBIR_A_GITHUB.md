# 📤 Subir Código a GitHub

## 📊 Estado Actual

```
❌ No hay repositorio remoto configurado
✅ Git está inicializado localmente
✅ Tienes 2 branches: main y develop
```

---

## 🚀 Pasos para Subir a GitHub

### Opción 1: Crear Nuevo Repositorio (Recomendado)

#### 1. Crear Repositorio en GitHub

1. **Ir a:** https://github.com/new

2. **Configurar el repositorio:**
   ```
   Repository name: sistema-camareros
   Description: Sistema de Gestión de Camareros y Servicios
   Privacy: Private (recomendado para mantener credenciales seguras)
   
   ❌ NO marcar "Initialize this repository with a README"
   ❌ NO agregar .gitignore (ya lo tienes)
   ❌ NO agregar license
   ```

3. **Hacer clic en:** "Create repository"

4. **GitHub te mostrará comandos.** Copia la URL que aparece, será algo como:
   ```
   https://github.com/tu-usuario/sistema-camareros.git
   ```

#### 2. Conectar tu Repositorio Local

```bash
# Agregar el remoto (reemplaza con tu URL)
git remote add origin https://github.com/tu-usuario/sistema-camareros.git

# Verificar que se agregó
git remote -v
```

#### 3. Hacer Commit de Archivos Pendientes

```bash
# Agregar archivos pendientes (excepto .env que ya está en .gitignore)
git add BUILD_PRODUCCION_EXITOSO.md \
        CAMBIOS_GUARDADOS.md \
        CONFIGURAR_PRODUCCION.md \
        CREAR_USUARIOS_PRODUCCION.md \
        PROBAR_LOGIN_PRODUCCION.md \
        PRODUCCION_CONFIGURADA.md \
        crear_usuario_admin.sql

# Hacer commit
git commit -m "docs: agregar documentación de producción

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

#### 4. Subir a GitHub

```bash
# Push del branch main
git push -u origin main

# Push del branch develop
git push -u origin develop
```

---

### Opción 2: Usar Repositorio Existente

Si ya tienes un repositorio en GitHub:

```bash
# Conectar con tu repo existente
git remote add origin https://github.com/tu-usuario/tu-repo.git

# Hacer commit de pendientes
git add .
git commit -m "docs: agregar documentación completa"

# Push
git push -u origin main
git push -u origin develop
```

---

## ⚠️ IMPORTANTE: Archivos Sensibles

### ✅ Ya Protegidos por .gitignore

Estos archivos **NO se subirán** a GitHub (correcto):
- `.env.development` → Credenciales de desarrollo
- `.env.production` → Credenciales de producción
- `node_modules/` → Dependencias
- `dist/` → Build generado

### 🔐 Verificar Antes de Subir

```bash
# Ver qué archivos se van a subir
git status

# Ver contenido del .gitignore
cat .gitignore
```

**NUNCA subas:**
- Archivos `.env*` con credenciales reales
- API keys
- Passwords
- Tokens de acceso

---

## 📋 Comandos Completos (Copy-Paste)

### Si creas un repositorio nuevo llamado "sistema-camareros":

```bash
# 1. Agregar archivos pendientes
git add BUILD_PRODUCCION_EXITOSO.md \
        CAMBIOS_GUARDADOS.md \
        CONFIGURAR_PRODUCCION.md \
        CREAR_USUARIOS_PRODUCCION.md \
        PROBAR_LOGIN_PRODUCCION.md \
        PRODUCCION_CONFIGURADA.md \
        SUBIR_A_GITHUB.md \
        crear_usuario_admin.sql

# 2. Hacer commit
git commit -m "docs: agregar documentación completa de producción

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# 3. Conectar con GitHub (REEMPLAZA con tu URL)
git remote add origin https://github.com/TU-USUARIO/sistema-camareros.git

# 4. Subir ambos branches
git push -u origin main
git push -u origin develop

# 5. Verificar
git remote -v
```

---

## 🌐 URL de tu Repositorio

Una vez subido, tu código estará en:

```
https://github.com/TU-USUARIO/sistema-camareros
```

**Branches disponibles:**
- `main` → Código de producción
- `develop` → Código de desarrollo

---

## 🔄 Workflow Futuro

### Después de Subir a GitHub

```bash
# Desarrollo diario
git checkout develop
# [hacer cambios]
git add .
git commit -m "descripción"
git push origin develop

# Cuando esté listo para producción
git checkout main
git merge develop
git push origin main
```

---

## 🚀 Deploy Automático desde GitHub

### Conectar con Vercel

1. Ir a: https://vercel.com
2. "Import Project"
3. Seleccionar tu repositorio de GitHub
4. Configurar:
   - **Framework Preset:** Vite
   - **Build Command:** `pnpm build:prod`
   - **Output Directory:** `dist`
   - **Install Command:** `pnpm install`

5. **Environment Variables:**
   ```
   VITE_SUPABASE_PROJECT_ID = bvnbwqsvldsfdfzifcp
   VITE_SUPABASE_URL = https://bvnbwqsvldsfdfzifcp.supabase.co
   VITE_SUPABASE_ANON_KEY = (tu key)
   ```

6. Deploy!

### Conectar con Netlify

1. Ir a: https://app.netlify.com
2. "Import from Git" → Seleccionar GitHub
3. Seleccionar repositorio
4. Configurar:
   - **Build command:** `pnpm build:prod`
   - **Publish directory:** `dist`
5. Agregar variables de entorno
6. Deploy!

---

## 📝 README.md Recomendado

Crea un archivo `README.md` en la raíz:

```markdown
# Sistema de Gestión de Camareros

Sistema completo de gestión de camareros, eventos y servicios con integración de Supabase.

## 🚀 Características

- Gestión de coordinadores, camareros y clientes
- Gestión de pedidos/eventos
- Sistema de asignaciones
- Códigos QR para registro de asistencia
- Confirmaciones por email
- Chats grupales automáticos
- Sistema de alertas

## 🛠️ Tecnologías

- React + TypeScript
- Vite
- Tailwind CSS
- Supabase
- Material UI

## 📦 Instalación

\`\`\`bash
pnpm install
\`\`\`

## 🔧 Desarrollo

\`\`\`bash
pnpm dev
\`\`\`

## 🏗️ Build

\`\`\`bash
pnpm build:prod
\`\`\`

## 📚 Documentación

Ver archivos de documentación en la raíz del proyecto.
```

---

## ✅ Checklist

- [ ] Crear repositorio en GitHub
- [ ] Copiar URL del repositorio
- [ ] Conectar repositorio local con remoto
- [ ] Hacer commit de archivos pendientes
- [ ] Push de branch main
- [ ] Push de branch develop
- [ ] Verificar que los archivos .env NO se subieron
- [ ] (Opcional) Crear README.md
- [ ] (Opcional) Conectar con Vercel/Netlify

---

## 🎯 Siguiente Paso

1. **Crear el repositorio en GitHub:** https://github.com/new
2. **Copiar la URL** que te da GitHub
3. **Pégame la URL aquí** y te ayudo a conectarlo y subir el código

---

## 🔐 Nota de Seguridad

Recuerda que después de subir a GitHub:
- Las credenciales de `.env*` NO están en GitHub (protegidas)
- Debes configurar las variables de entorno en tu plataforma de hosting
- Nunca hagas commit de archivos con credenciales reales
