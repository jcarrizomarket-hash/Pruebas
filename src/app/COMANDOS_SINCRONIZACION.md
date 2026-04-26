# 🎯 Comandos Rápidos para Sincronizar

## ⚡ Copiar y Pegar - Método Rápido

### 📋 Escenario 1: Ya tienes Git configurado

```bash
# 1. Ve a tu repositorio local
cd /ruta/a/tu/proyecto-camareros

# 2. Verifica que estés en el repositorio correcto
git remote -v
# Deberías ver tu repositorio de GitHub/GitLab

# 3. Crea un backup por seguridad
git branch backup-$(date +%Y%m%d)

# 4. Copia los archivos de Figma Make
# Reemplaza /ruta/a/figma-make con la ruta real donde descargaste
cp -r /ruta/a/figma-make/* .

# 5. Revisa los cambios
git status

# 6. Agrega todos los cambios
git add .

# 7. Crea el commit
git commit -m "Actualización: Admin con Coordinadores, Altas y Registros QR"

# 8. Sube los cambios
git push origin main
# Si tu rama principal se llama 'master' en vez de 'main':
# git push origin master

# ✅ ¡Listo! Vercel se actualizará automáticamente
```

---

### 📋 Escenario 2: NO tienes Git configurado (Setup completo)

```bash
# PARTE A: Instalar y configurar Git
# (Si ya tienes Git instalado, salta a PARTE B)

# En Windows: Descarga desde https://git-scm.com/download/win
# En Mac: 
brew install git

# En Linux (Ubuntu/Debian):
sudo apt-get update
sudo apt-get install git

# Configurar tu identidad
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# Verificar instalación
git --version
```

```bash
# PARTE B: Inicializar repositorio local

# 1. Ve a la carpeta donde descargaste Figma Make
cd /ruta/a/figma-make

# 2. Inicializa Git
git init

# 3. Agrega todos los archivos
git add .

# 4. Primer commit
git commit -m "Código inicial desde Figma Make"

# 5. Crea la rama main (si no existe)
git branch -M main
```

```bash
# PARTE C: Crear repositorio en GitHub y conectar

# 1. Ve a GitHub en tu navegador:
#    https://github.com/new

# 2. Crea un repositorio nuevo:
#    - Nombre: gestion-camareros (o el que prefieras)
#    - Privado o Público: tu elección
#    - ❌ NO marques "Initialize with README"
#    - ❌ NO agregues .gitignore ni licencia

# 3. Una vez creado, copia la URL que te muestra
#    Será algo como: https://github.com/tu-usuario/gestion-camareros.git

# 4. En tu terminal, conecta local con remoto:
#    (Reemplaza la URL con la tuya)
git remote add origin https://github.com/tu-usuario/gestion-camareros.git

# 5. Verifica la conexión
git remote -v

# 6. Sube el código por primera vez
git push -u origin main

# ✅ Tu código está ahora en GitHub
```

```bash
# PARTE D: Conectar GitHub con Vercel

# En tu navegador:
# 1. Ve a https://vercel.com/new
# 2. Haz clic en "Import Git Repository"
# 3. Si es la primera vez, autoriza a Vercel a acceder a GitHub
# 4. Selecciona el repositorio "gestion-camareros"
# 5. En "Build & Development Settings": déjalo en automático
# 6. ⚠️ IMPORTANTE: Ve a "Environment Variables"
# 7. Agrega TODAS las variables (ver sección abajo)
# 8. Haz clic en "Deploy"
# 9. Espera 2-3 minutos

# ✅ Tu aplicación está ahora en Vercel
```

---

## 🔐 Variables de Entorno para Vercel

### Copiar y Pegar en Vercel (Settings → Environment Variables)

```
SUPABASE_URL=https://xxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_DB_URL=postgresql://postgres:...
WHATSAPP_PHONE_ID=123456789012345
WHATSAPP_API_KEY=EAAGxxxxx...
WHATSAPP_VERIFY_TOKEN=tu_token_secreto_123
FN_SECRET=secret_aleatorio_xyz789
EMAIL_FROM=noreply@tudominio.com
```

**Si usas Resend:**
```
RESEND_API_KEY=re_xxxxxxxxx
```

**Si usas Mailgun:**
```
MAILGUN_API_KEY=key-xxxxxxxxx
MAILGUN_DOMAIN=mg.tudominio.com
```

**Importante:**
- Para cada variable, selecciona: **Production**, **Preview** y **Development**
- Después de agregar todas, ve a Deployments → Click en "..." → "Redeploy"

---

## 🔄 Actualizaciones Futuras (Después del setup inicial)

```bash
# Cada vez que actualices en Figma Make:

# 1. Descarga el nuevo código de Figma Make
# 2. Ve a tu repositorio local
cd /ruta/a/tu/proyecto-camareros

# 3. Copia los archivos actualizados
cp -r /ruta/a/figma-make-nuevo/* .

# 4. Revisa cambios
git status
git diff

# 5. Agrega cambios
git add .

# 6. Commit con mensaje descriptivo
git commit -m "Actualización: [describe qué cambiaste]"

# 7. Push
git push origin main

# 8. Vercel detectará el cambio y desplegará automáticamente
# 9. Espera 2-3 minutos
# 10. Visita tu dominio y refresca con Ctrl+Shift+R
```

---

## 🛠️ Comandos de Utilidad

### Ver el estado actual
```bash
git status
```

### Ver historial de commits
```bash
git log --oneline -10
```

### Ver cambios antes de hacer commit
```bash
git diff
```

### Deshacer cambios NO commiteados
```bash
git checkout .
```

### Volver a un commit anterior
```bash
# Ver lista de commits
git log --oneline

# Volver a un commit específico (reemplaza abc123 con el hash)
git checkout abc123
```

### Crear y cambiar de rama
```bash
# Crear nueva rama
git branch nombre-rama

# Cambiar a esa rama
git checkout nombre-rama

# Crear y cambiar en un solo comando
git checkout -b nombre-rama
```

### Ver qué remoto está configurado
```bash
git remote -v
```

### Cambiar la URL del remoto
```bash
git remote set-url origin https://github.com/nuevo-usuario/nuevo-repo.git
```

### Forzar push (⚠️ usar con cuidado)
```bash
git push -f origin main
```

---

## 🆘 Solución de Problemas

### Error: "fatal: not a git repository"
```bash
# Solución: Inicializa Git
git init
```

### Error: "Permission denied (publickey)"
```bash
# Opción 1: Usa HTTPS en vez de SSH
git remote set-url origin https://github.com/usuario/repo.git

# Opción 2: Configura SSH keys
# Sigue: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
```

### Error: "Your branch is behind"
```bash
# Descarga los cambios del servidor primero
git pull origin main

# Si hay conflictos, Git te dirá qué archivos tienen problemas
# Resuelve los conflictos manualmente y luego:
git add .
git commit -m "Merge conflicts resolved"
git push origin main
```

### Error: "fatal: refusing to merge unrelated histories"
```bash
# Si necesitas forzar el merge:
git pull origin main --allow-unrelated-histories
```

### Ver archivos que Git ignora
```bash
git status --ignored
```

### Limpiar archivos no trackeados
```bash
# Ver qué se eliminará (simulación)
git clean -n

# Eliminar archivos no trackeados
git clean -f

# Eliminar también directorios
git clean -fd
```

---

## 📊 Verificación Post-Deploy

```bash
# 1. Verifica que el deploy esté completo en Vercel
curl -I https://tu-dominio.vercel.app

# Deberías ver: HTTP/2 200

# 2. Verifica que Git esté sincronizado
git status
# Debería decir: "nothing to commit, working tree clean"

# 3. Verifica el último commit
git log -1
# Debería mostrar tu último commit

# 4. Verifica que esté en el servidor
git log origin/main -1
# Debería ser el mismo commit
```

---

## 🎯 Checklist Ejecutable

```bash
# Ejecuta estos comandos uno por uno y marca cada uno

# □ git --version
# □ git status
# □ git remote -v
# □ git branch
# □ git log -1
# □ git diff
# □ git add .
# □ git commit -m "test"
# □ git push origin main

# Si TODOS funcionan sin error, estás listo ✅
```

---

## 🚀 Script de Verificación Completa

```bash
#!/bin/bash

echo "🔍 Verificando configuración..."

echo ""
echo "1. Verificando Git..."
if command -v git &> /dev/null; then
    echo "✅ Git instalado: $(git --version)"
else
    echo "❌ Git NO está instalado"
    exit 1
fi

echo ""
echo "2. Verificando repositorio Git..."
if [ -d .git ]; then
    echo "✅ Es un repositorio Git"
else
    echo "❌ NO es un repositorio Git"
    exit 1
fi

echo ""
echo "3. Verificando remoto..."
REMOTE=$(git remote -v | grep origin | head -1)
if [ -n "$REMOTE" ]; then
    echo "✅ Remoto configurado:"
    echo "   $REMOTE"
else
    echo "❌ NO hay remoto configurado"
    exit 1
fi

echo ""
echo "4. Verificando rama..."
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "✅ Rama actual: $BRANCH"

echo ""
echo "5. Verificando cambios pendientes..."
STATUS=$(git status --porcelain)
if [ -z "$STATUS" ]; then
    echo "✅ No hay cambios pendientes"
else
    echo "⚠️  Hay cambios sin commitear:"
    git status --short
fi

echo ""
echo "6. Verificando conectividad con remoto..."
if git ls-remote origin HEAD &> /dev/null; then
    echo "✅ Conexión con remoto exitosa"
else
    echo "❌ No se puede conectar con el remoto"
    exit 1
fi

echo ""
echo "════════════════════════════════════"
echo "✅ Todo está configurado correctamente"
echo "════════════════════════════════════"
```

Guarda este script como `verificar-git.sh`, dale permisos y ejecútalo:

```bash
chmod +x verificar-git.sh
./verificar-git.sh
```

---

**Última actualización:** Marzo 6, 2026
