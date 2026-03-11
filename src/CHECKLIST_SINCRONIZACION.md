# ✅ Checklist Interactivo: Sincronización Figma Make → Vercel

## 🎯 Objetivo
Sincronizar el código actualizado de Figma Make (con las 3 pestañas de Admin) con tu aplicación en producción en Vercel.

---

## 📝 Pre-requisitos

Marca cada elemento que YA tengas listo:

```
□ Tengo una cuenta en GitHub/GitLab/Bitbucket
□ Tengo una cuenta en Vercel
□ Tengo Git instalado en mi computadora
□ Sé cómo abrir la terminal/línea de comandos
□ He descargado el código de Figma Make (archivo ZIP)
```

**Si tienes todos marcados ✅, continúa a Fase 1.**
**Si falta alguno ❌, ve a la sección "Setup Inicial" al final.**

---

## 🚀 FASE 1: Preparación (5 minutos)

### Paso 1.1: Descargar código de Figma Make
```
□ Abrí Figma Make en el navegador
□ Encontré el botón de "Export" o "Download"
□ Descargué el archivo ZIP
□ Descomprimí el ZIP en mi computadora
□ La carpeta contiene: App.tsx, components/, supabase/, etc.
```

**Ruta donde descomprimí:**
```
_____________________________________________________
```

### Paso 1.2: Verificar estructura del código
```
En la carpeta descomprimida, verifica que existan estos archivos:

□ /App.tsx
□ /components/admin.tsx
□ /components/registros-qr-section.tsx
□ /supabase/functions/server/index.tsx
□ /package.json
□ /styles/globals.css
```

**Si todos existen ✅, continúa a Fase 2.**

---

## 🔧 FASE 2: Repositorio Git (10 minutos)

### Opción A: Ya tengo un repositorio Git ✅
```
□ Sé dónde está mi repositorio local (carpeta en mi PC)
□ Está conectado a GitHub/GitLab/Bitbucket

Ruta de mi repositorio:
_____________________________________________________

Comando para verificar:
$ cd /ruta/a/mi/repositorio
$ git remote -v

Resultado esperado:
origin  https://github.com/mi-usuario/mi-repo.git (fetch)
origin  https://github.com/mi-usuario/mi-repo.git (push)

□ Veo la URL correcta de mi repositorio
```

**Si todo correcto ✅, salta a Fase 3.**

### Opción B: NO tengo repositorio Git ❌

#### Paso 2.1: Instalar Git
```
□ Windows: Descargué de https://git-scm.com/download/win
□ Mac: Instalé con `brew install git`
□ Linux: Instalé con `sudo apt-get install git`

Verificar instalación:
$ git --version

□ Veo la versión de Git instalada (ej: git version 2.40.1)
```

#### Paso 2.2: Configurar Git
```
$ git config --global user.name "Tu Nombre"
$ git config --global user.email "tu@email.com"

□ Ejecuté ambos comandos
```

#### Paso 2.3: Inicializar repositorio local
```
$ cd /ruta/donde/descomprimi/figma-make
$ git init
$ git add .
$ git commit -m "Código inicial desde Figma Make"
$ git branch -M main

□ Ejecuté todos los comandos sin errores
```

#### Paso 2.4: Crear repositorio en GitHub
```
□ Fui a https://github.com/new
□ Nombre del repositorio: gestion-camareros
□ Privacidad: [Público/Privado] (tu elección)
□ ❌ NO marqué "Initialize with README"
□ Hice clic en "Create repository"
□ Copié la URL que me mostró

URL de mi repositorio:
_____________________________________________________
```

#### Paso 2.5: Conectar local con GitHub
```
$ git remote add origin <URL_DE_TU_REPOSITORIO>
$ git push -u origin main

□ Ejecuté ambos comandos sin errores
□ Vi el progreso de la subida
□ Terminó con "Branch 'main' set up to track remote branch 'main'"
```

---

## ☁️ FASE 3: Conectar con Vercel (10 minutos)

### Opción A: Mi app YA está en Vercel ✅
```
□ Sé la URL de mi aplicación (ej: miapp.vercel.app)

URL de mi app:
_____________________________________________________

□ Sé qué repositorio está conectado en Vercel
□ Es el MISMO repositorio que configuré en Fase 2

Verificar en Vercel:
1. Ve a https://vercel.com/dashboard
2. Haz clic en tu proyecto
3. Ve a Settings → Git

□ Confirmé que el repositorio es el correcto
```

**Si todo correcto ✅, salta a Fase 4.**

### Opción B: Mi app NO está en Vercel ❌

#### Paso 3.1: Crear cuenta en Vercel
```
□ Fui a https://vercel.com/signup
□ Me registré con mi cuenta de GitHub
□ Autorizo a Vercel a acceder a mis repositorios
```

#### Paso 3.2: Importar proyecto
```
□ Fui a https://vercel.com/new
□ Hice clic en "Import Git Repository"
□ Seleccioné mi repositorio "gestion-camareros"
□ En "Framework Preset": Dejé en "Create React App" o "Vite"
□ NO modifiqué "Build Command" ni "Output Directory"
```

#### Paso 3.3: Configurar Variables de Entorno
```
⚠️ CRÍTICO: Sin estas variables, la app NO funcionará

En Vercel, antes de hacer deploy:
□ Hice clic en "Environment Variables"

Agregué TODAS estas variables (copiadas desde mi app actual):

□ SUPABASE_URL
□ SUPABASE_ANON_KEY
□ SUPABASE_SERVICE_ROLE_KEY
□ SUPABASE_DB_URL
□ WHATSAPP_PHONE_ID
□ WHATSAPP_API_KEY
□ WHATSAPP_VERIFY_TOKEN
□ FN_SECRET
□ EMAIL_FROM
□ RESEND_API_KEY (si uso Resend)
□ MAILGUN_API_KEY (si uso Mailgun)
□ MAILGUN_DOMAIN (si uso Mailgun)

Para cada variable:
□ Seleccioné: Production, Preview, Development (todas)
□ Hice clic en "Add"
```

#### Paso 3.4: Hacer el deploy inicial
```
□ Hice clic en "Deploy"
□ Esperé 2-3 minutos
□ Vi el mensaje "Congratulations! Your project is live"
□ Hice clic en "Visit" para ver mi aplicación

□ La aplicación cargó correctamente
□ Puedo hacer login
□ Veo las secciones principales

URL de mi nueva app:
_____________________________________________________
```

---

## 🔄 FASE 4: Sincronizar el Código Actualizado (5 minutos)

### Paso 4.1: Copiar archivos actualizados
```
Terminal:

$ cd /ruta/a/mi/repositorio/git

# Crear backup por seguridad
$ git branch backup-$(date +%Y%m%d)

□ Creé la rama de backup

# Copiar TODOS los archivos de Figma Make
$ cp -r /ruta/donde/descomprimi/figma-make/* .

□ Copié todos los archivos
```

### Paso 4.2: Verificar los cambios
```
$ git status

Deberías ver archivos modificados, especialmente:
□ modified: components/admin.tsx
□ modified: components/registros-qr-section.tsx

$ git diff components/admin.tsx

□ Veo los cambios en admin.tsx (debe mostrar las 3 pestañas)
```

### Paso 4.3: Hacer commit y push
```
$ git add .
$ git commit -m "Actualización: Admin con Coordinadores, Altas y Registros QR"
$ git push origin main

□ Ejecuté los 3 comandos sin errores
□ Vi el progreso de la subida
□ Terminó exitosamente
```

---

## ⏳ FASE 5: Esperar y Verificar Deploy (5 minutos)

### Paso 5.1: Monitorear el deploy en Vercel
```
□ Fui a https://vercel.com/dashboard
□ Seleccioné mi proyecto
□ Hice clic en la pestaña "Deployments"

□ Veo un nuevo deployment en progreso
□ Muestra "Building..." o "Deploying..."

Tiempo de espera: 2-3 minutos

□ El deploy cambió a estado "Ready" ✅
□ Tiene una marca verde ✅

Hora del deploy:
_____________________________________________________
```

### Paso 5.2: Ver los logs del build (opcional pero recomendado)
```
□ Hice clic en el deployment más reciente
□ Revisé "Build Logs"
□ NO veo errores rojos
□ Termina con "Build Completed" o similar
```

### Paso 5.3: Verificar la aplicación actualizada
```
□ Hice clic en "Visit" en Vercel
□ O abrí mi URL directamente: _______________________

En el navegador:
□ Limpié la caché: Ctrl+Shift+R (Win) o Cmd+Shift+R (Mac)
□ La página cargó correctamente
□ Hice login
```

---

## ✅ FASE 6: Verificación Final - ¡El Momento de la Verdad!

### Paso 6.1: Ir a la sección Admin
```
En la aplicación:

□ Hice clic en la sección "Admin" en el menú
□ La página cargó sin errores

Verificar las pestañas:

□ ✅ Veo la pestaña "Coordinadores"
□ ✅ Veo la pestaña "Altas"
□ ✅ Veo la pestaña "Registros QR"

¡SI VES LAS 3 PESTAÑAS, LA SINCRONIZACIÓN FUE EXITOSA! 🎉
```

### Paso 6.2: Probar funcionalidad
```
Coordinadores:
□ Puedo ver la lista de coordinadores
□ Puedo crear un nuevo coordinador
□ El formulario funciona correctamente

Altas:
□ Veo la tabla de altas
□ Puedo aplicar filtros
□ El botón "Exportar Excel" funciona

Registros QR:
□ Veo la tabla de registros
□ Puedo aplicar filtros
□ Veo los estados de entrada/salida
```

### Paso 6.3: Verificar otras secciones
```
Verificar que NO se rompió nada:

□ Dashboard funciona correctamente
□ Camareros funciona correctamente
□ Pedidos funciona correctamente
□ Informes funciona correctamente
□ Envíos funciona correctamente

□ Todas las secciones funcionan ✅
```

---

## 🎉 ¡COMPLETADO!

```
╔════════════════════════════════════════════════════╗
║                                                    ║
║        🎊 ¡SINCRONIZACIÓN EXITOSA! 🎊            ║
║                                                    ║
║  Tu aplicación en Vercel ahora está actualizada   ║
║  con el código más reciente de Figma Make.        ║
║                                                    ║
╚════════════════════════════════════════════════════╝
```

### 📊 Resumen de lo que lograste:

```
✅ Configuraste Git correctamente
✅ Creaste/actualizaste tu repositorio en GitHub
✅ Conectaste GitHub con Vercel
✅ Sincronizaste el código de Figma Make
✅ Verificaste que el deploy fue exitoso
✅ Confirmaste que la app funciona correctamente
```

### 📝 Anota esta información para el futuro:

```
Repositorio Git:
_____________________________________________________

URL de Vercel:
_____________________________________________________

Última sincronización:
_____________________________________________________

Rama principal: main / master (tacha lo que no corresponda)
```

---

## 🔄 Para Futuras Actualizaciones

Cada vez que actualices en Figma Make:

```
1. □ Descargar nuevo código de Figma Make
2. □ cd /ruta/a/mi/repositorio
3. □ cp -r /ruta/figma-make-nuevo/* .
4. □ git add .
5. □ git commit -m "Descripción del cambio"
6. □ git push origin main
7. □ Esperar 2-3 minutos
8. □ Verificar en Vercel Dashboard
9. □ Abrir la app y refrescar (Ctrl+Shift+R)
10. □ Confirmar que funciona
```

---

## 🆘 Si Algo Salió Mal

### Problema: No veo las 3 pestañas en Admin

```
Verificaciones:

□ El deploy en Vercel tiene estado "Ready" (no "Failed")
□ Limpié la caché del navegador (Ctrl+Shift+R)
□ El archivo components/admin.tsx se subió correctamente:
  - Verificar en GitHub: https://github.com/usuario/repo/blob/main/components/admin.tsx
  - Debe tener las líneas 176-184 con las 3 pestañas

□ Probé en modo incógnito
□ Probé en otro navegador
□ Probé en otro dispositivo
```

### Problema: El deploy falló en Vercel

```
□ Fui a Vercel → Deployments → Click en el fallido
□ Leí el error en "Build Logs"

Errores comunes:
□ "Module not found": Falta instalar una dependencia
   → Verificar package.json
□ "Environment variable missing": Falta una variable de entorno
   → Agregarla en Vercel Settings → Environment Variables
□ "Build command failed": Error de sintaxis en el código
   → Revisar el error específico y corregir
```

### Problema: No puedo hacer git push

```
□ Error "Permission denied":
  $ git remote set-url origin https://github.com/usuario/repo.git
  
□ Error "Updates were rejected":
  $ git pull origin main --rebase
  $ git push origin main

□ Error "fatal: not a git repository":
  $ git init
```

---

## 📚 Recursos Adicionales

```
📄 SINCRONIZAR_CON_VERCEL.md - Guía detallada
📄 SOLUCION_DESINCRONIZACION.md - Resolución paso a paso
📄 DIAGRAMA_DESINCRONIZACION.md - Diagramas visuales
📄 COMANDOS_SINCRONIZACION.md - Comandos para copiar/pegar
📄 scripts/sincronizar-vercel.sh - Script automatizado
```

---

**Fecha de completación:** _____________________

**Tiempo total invertido:** _____ minutos

**¿Todo funcionó correctamente?** □ Sí □ No

**Notas adicionales:**
```
________________________________________________________
________________________________________________________
________________________________________________________
```

---

**Última actualización:** Marzo 6, 2026
