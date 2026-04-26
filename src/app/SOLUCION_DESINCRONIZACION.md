# 🚨 PROBLEMA: Desincronización Figma Make ↔️ Vercel

## ❌ Situación Actual

```
┌─────────────────┐          ┌─────────────────┐
│  Figma Make     │    ❌    │     Vercel      │
│                 │          │                 │
│  ✅ Admin:      │          │  ❌ Admin:      │
│  - Coordinadores│          │  - Página       │
│  - Altas        │          │    diferente    │
│  - Registros QR │          │                 │
└─────────────────┘          └─────────────────┘
    (Desarrollo)               (Producción)
```

**El problema es que son DOS SISTEMAS SEPARADOS.**

---

## ✅ Solución en 5 Pasos

### 📥 PASO 1: Descargar desde Figma Make

1. En Figma Make (donde estás ahora):
   - Busca el botón **"Export"**, **"Download"** o **"Descargar código"**
   - Generalmente está en la esquina superior derecha
   - Descarga el archivo ZIP completo

2. Descomprime el archivo en tu computadora

### 🔍 PASO 2: Identificar tu Repositorio Git

Tu aplicación en Vercel está conectada a un repositorio. Necesitas saber cuál es:

**Opción A: Si ya tienes el repositorio localmente**
```bash
# Navega a la carpeta de tu proyecto existente
cd /ruta/a/tu/proyecto-camareros

# Verifica que es el correcto
git remote -v
# Deberías ver algo como:
# origin  https://github.com/tu-usuario/tu-repo.git
```

**Opción B: Si NO tienes el repositorio localmente**

1. Ve a [vercel.com](https://vercel.com/dashboard)
2. Entra a tu proyecto
3. Ve a **Settings** → **Git**
4. Verás el enlace a tu repositorio (ej: `github.com/usuario/repo`)
5. Clona el repositorio:
   ```bash
   git clone https://github.com/usuario/repo.git
   cd repo
   ```

### 📋 PASO 3: Copiar los Archivos Actualizados

```bash
# En tu terminal, desde la carpeta del repositorio git:

# 1. Hacer un backup de lo que tienes (por las dudas)
git branch backup-antes-actualizacion
git checkout backup-antes-actualizacion
git checkout main  # o master, según tu rama principal

# 2. Copiar TODOS los archivos de Figma Make a tu repositorio
# (Reemplaza /ruta/descargas/figma-make con la ruta real)
cp -r /ruta/descargas/figma-make/* .

# 3. Verificar los cambios
git status
# Deberías ver archivos modificados, especialmente:
# - components/admin.tsx
# - components/registros-qr-section.tsx
```

### 🚀 PASO 4: Subir los Cambios a Git

```bash
# 1. Agregar todos los cambios
git add .

# 2. Hacer commit
git commit -m "Actualización con Admin completo: Coordinadores, Altas y Registros QR"

# 3. Subir a GitHub/GitLab/Bitbucket
git push origin main
# O si tu rama es master:
# git push origin master
```

### ⏳ PASO 5: Esperar el Deploy Automático

1. Vercel detectará el push automáticamente
2. Iniciará un nuevo build (~2-3 minutos)
3. Una vez completado, tu aplicación en el dominio estará actualizada

**Ver el progreso:**
- Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
- Selecciona tu proyecto
- Ve a **Deployments**
- Verás el nuevo deployment en progreso

---

## 🔍 Verificación Final

### En Vercel Dashboard:
```
1. Deployments → Último deployment → Estado: "Ready" ✅
2. Haz clic en "Visit" → Se abre tu aplicación
3. Ve a la sección "Admin"
4. Verifica que veas las 3 pestañas
```

### En tu Navegador:
```
1. Abre tu dominio (ej: https://tuapp.vercel.app)
2. Limpia la caché: Ctrl+Shift+R (Win) o Cmd+Shift+R (Mac)
3. Ve a Admin
4. Deberías ver:
   ✅ Coordinadores
   ✅ Altas
   ✅ Registros QR
```

---

## 🛠️ Si NO Tienes Git Configurado

Si nunca has usado Git con este proyecto, aquí está el setup completo:

### Setup Inicial de Git + GitHub + Vercel

```bash
# 1. Navega a la carpeta de Figma Make descargada
cd /ruta/descargas/figma-make

# 2. Inicializa Git
git init
git add .
git commit -m "Código inicial desde Figma Make"

# 3. Crea un repositorio en GitHub
# Ve a https://github.com/new
# Nombre: gestion-camareros (o el que prefieras)
# NO inicialices con README

# 4. Conecta tu código local con GitHub
git branch -M main
git remote add origin https://github.com/tu-usuario/gestion-camareros.git
git push -u origin main
```

### Conectar GitHub con Vercel

```
1. Ve a https://vercel.com/new
2. Haz clic en "Import Project"
3. Conecta tu cuenta de GitHub si aún no lo has hecho
4. Selecciona el repositorio "gestion-camareros"
5. Configura las variables de entorno (ver sección abajo)
6. Haz clic en "Deploy"
```

---

## 🔐 Variables de Entorno en Vercel

**MUY IMPORTANTE:** Tu aplicación necesita estas variables configuradas en Vercel:

### Configuración en Vercel:

```
Settings → Environment Variables → Add New

Agregar UNA POR UNA:

1. SUPABASE_URL
   Value: https://xxxxxxxx.supabase.co

2. SUPABASE_ANON_KEY
   Value: eyJhbG...

3. SUPABASE_SERVICE_ROLE_KEY
   Value: eyJhbG... (DIFERENTE al ANON_KEY)

4. SUPABASE_DB_URL
   Value: postgresql://...

5. WHATSAPP_PHONE_ID
   Value: 123456789...

6. WHATSAPP_API_KEY
   Value: EAAG...

7. WHATSAPP_VERIFY_TOKEN
   Value: tu_token_secreto

8. RESEND_API_KEY (si usas Resend)
   Value: re_...

9. MAILGUN_API_KEY (si usas Mailgun)
   Value: key-...

10. MAILGUN_DOMAIN (si usas Mailgun)
    Value: mg.tudominio.com

11. EMAIL_FROM
    Value: noreply@tudominio.com

12. FN_SECRET
    Value: tu_secret_aleatorio
```

**Para cada variable:**
- Environment: Selecciona **Production**, **Preview** y **Development**
- Haz clic en "Save"

**Después de agregar todas las variables:**
1. Ve a **Deployments**
2. En el último deployment, haz clic en los "..." (tres puntos)
3. Selecciona **"Redeploy"**
4. Confirma para hacer un nuevo deploy con las variables

---

## 📊 Checklist de Verificación

Marca cada paso a medida que lo completas:

```
□ Descargué el código de Figma Make
□ Tengo Git instalado en mi computadora
□ Tengo un repositorio en GitHub/GitLab/Bitbucket
□ Copié los archivos de Figma Make a mi repositorio
□ Hice git add, commit y push
□ Vi el nuevo deployment en Vercel Dashboard
□ El deployment terminó con estado "Ready"
□ Configuré todas las variables de entorno
□ Limpié la caché del navegador
□ Accedí a mi dominio y veo la versión actualizada
□ La sección Admin muestra las 3 pestañas
```

---

## 🆘 Solución de Problemas

### Problema: "No sé cómo descargar de Figma Make"
**Solución:** 
- Busca en el menú superior derecho
- Puede decir "Export", "Download Code", "Descargar", o similar
- Si no encuentras la opción, contacta con soporte de Figma Make

### Problema: "git: command not found"
**Solución:**
- Instala Git desde https://git-scm.com/downloads
- Reinicia tu terminal después de instalar

### Problema: "El deployment falla en Vercel"
**Solución:**
1. Ve a Deployments → Click en el deployment fallido
2. Lee el error en "Build Logs"
3. Errores comunes:
   - **"Module not found"**: Falta una dependencia en package.json
   - **"Environment variable missing"**: Configurar las variables en Vercel
   - **"Build failed"**: Puede haber un error de sintaxis en el código

### Problema: "Sigo viendo la versión antigua"
**Solución:**
```bash
# Opción 1: Limpiar caché del navegador
Ctrl + Shift + Delete → Borrar caché

# Opción 2: Modo incógnito
Ctrl + Shift + N (Chrome) o Ctrl + Shift + P (Firefox)

# Opción 3: Verificar que Vercel haya desplegado
# Ve a Vercel Dashboard y confirma que el último
# deployment tiene estado "Ready" y la fecha/hora es reciente
```

### Problema: "Permission denied (publickey)"
**Solución:**
```bash
# Necesitas configurar SSH keys para GitHub
# Sigue esta guía:
https://docs.github.com/en/authentication/connecting-to-github-with-ssh

# O usa HTTPS en lugar de SSH:
git remote set-url origin https://github.com/usuario/repo.git
```

---

## 📞 Resumen para Soporte

Si necesitas ayuda, proporciona esta información:

```
1. URL de tu aplicación en Vercel: _______________________
2. URL de tu repositorio Git: _______________________
3. ¿Has logrado hacer git push? □ Sí □ No
4. ¿Vercel muestra el nuevo deployment? □ Sí □ No
5. Estado del deployment en Vercel: _______________________
6. ¿Has configurado las variables de entorno? □ Sí □ No
7. Captura de pantalla del error (si aplica)
```

---

**Última actualización:** Marzo 6, 2026
