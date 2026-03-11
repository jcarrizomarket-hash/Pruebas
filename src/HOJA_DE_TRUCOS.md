# ⚡ HOJA DE TRUCOS - Sincronización Rápida

## 🎯 El Problema en Una Línea

**Figma Make y Vercel NO están conectados → Necesitas Git/GitHub como puente**

---

## ✅ Solución Ultra-Rápida (Expertos)

```bash
# 1. Descargar y descomprimir Figma Make

# 2. Copiar al repo
cd /tu/repo && cp -r /ruta/figma/* .

# 3. Git
git add . && git commit -m "Update" && git push

# 4. Esperar 2min → Ctrl+Shift+R → ✅
```

---

## 📚 Guías Disponibles - Elige Una

| Si eres...                    | Usa esta guía                          | Tiempo    |
|-------------------------------|----------------------------------------|-----------|
| 👶 Nunca usé Git              | `CHECKLIST_SINCRONIZACION.md`          | 30-45 min |
| 🧑 Conozco Git básico         | `SINCRONIZAR_CON_VERCEL.md`            | 20-30 min |
| 👨‍💻 Domino Git                | `COMANDOS_SINCRONIZACION.md`           | 10-15 min |
| 🎨 Prefiero diagramas         | `DIAGRAMA_DESINCRONIZACION.md`         | 10-15 min |
| 🚨 Tengo un problema          | `SOLUCION_DESINCRONIZACION.md`         | 20-30 min |
| 🗺️ Ver todas las opciones     | `INDICE_SINCRONIZACION.md`             | 5 min     |
| 🚀 Punto de entrada           | `EMPIEZA_AQUI_SINCRONIZACION.md`       | 5 min     |

---

## 🔧 Comandos Esenciales

### Setup Inicial (Solo primera vez)

```bash
# Instalar Git (si no lo tienes)
# Windows: https://git-scm.com/download/win
# Mac: brew install git
# Linux: sudo apt-get install git

# Configurar identidad
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# Inicializar repo (si es nuevo)
cd /ruta/proyecto
git init
git branch -M main

# Conectar con GitHub (reemplaza URL)
git remote add origin https://github.com/usuario/repo.git
```

### Actualizar Código (Cada vez)

```bash
# 1. Ir al repo
cd /ruta/a/tu/repo

# 2. Backup (opcional pero recomendado)
git branch backup-$(date +%Y%m%d)

# 3. Copiar nuevos archivos
cp -r /ruta/figma-make-nuevo/* .

# 4. Revisar cambios
git status
git diff

# 5. Subir
git add .
git commit -m "Actualización desde Figma Make"
git push origin main
```

---

## 🔐 Variables de Entorno en Vercel

```
Settings → Environment Variables → Add New

Agregar TODAS (marca las que ya configuraste):

□ SUPABASE_URL
□ SUPABASE_ANON_KEY
□ SUPABASE_SERVICE_ROLE_KEY
□ SUPABASE_DB_URL
□ WHATSAPP_PHONE_ID
□ WHATSAPP_API_KEY
□ WHATSAPP_VERIFY_TOKEN
□ FN_SECRET
□ EMAIL_FROM
□ RESEND_API_KEY (si usas Resend)
□ MAILGUN_API_KEY (si usas Mailgun)
□ MAILGUN_DOMAIN (si usas Mailgun)

Para cada una:
✓ Production ✓ Preview ✓ Development

Después: Deployments → ... → Redeploy
```

---

## 🆘 Troubleshooting Rápido

| Error                                    | Solución                                   |
|------------------------------------------|--------------------------------------------|
| `git: command not found`                 | Instalar Git                               |
| `fatal: not a git repository`            | `git init`                                 |
| `Permission denied (publickey)`          | `git remote set-url origin https://...`    |
| `Your branch is behind`                  | `git pull origin main`                     |
| No veo cambios en Vercel                 | Esperar 2-3 min + Ctrl+Shift+R             |
| Deploy falló en Vercel                   | Ver Build Logs en Vercel Dashboard         |
| Sigo viendo versión antigua              | Limpiar caché: Ctrl+Shift+R o modo incógnito|

---

## ✅ Checklist Express

```
□ Git instalado
□ Cuenta GitHub
□ Cuenta Vercel
□ Código de Figma Make descargado
□ Repo local inicializado
□ Repo remoto en GitHub
□ Vercel conectado a GitHub
□ Variables de entorno configuradas
□ Código copiado
□ Git push realizado
□ Deploy completado
□ App actualizada verificada
```

---

## 📋 Verificación Post-Deploy

```bash
# En Vercel Dashboard
# 1. Deployments → Último debe estar "Ready" ✅
# 2. Build Logs → No debe haber errores ❌

# En tu navegador
# 1. Abrir: https://tu-dominio.vercel.app
# 2. Ctrl+Shift+R (limpiar caché)
# 3. Login → Admin → Ver 3 pestañas ✅
```

---

## 🎯 Flujo Completo Simplificado

```
1. Figma Make → Export → proyecto.zip
   ↓
2. Descomprimir → /descargas/proyecto/
   ↓
3. cd /tu/repo
   ↓
4. cp -r /descargas/proyecto/* .
   ↓
5. git add . && git commit -m "msg" && git push
   ↓
6. Vercel detecta → Build (2-3min) → Deploy
   ↓
7. https://tu-dominio.vercel.app → ✅
```

---

## ⚡ Scripts Útiles

### Script de Sincronización

```bash
#!/bin/bash
# Guardar como: sync.sh
# Uso: ./sync.sh /ruta/a/figma-make

FIGMA_PATH="$1"
cd /tu/repo
git branch backup-$(date +%Y%m%d)
cp -r "$FIGMA_PATH"/* .
git add .
git commit -m "Sync: $(date +%Y-%m-%d)"
git push origin main
echo "✅ Sincronizado. Espera 2-3 min para deploy."
```

### Script de Verificación

```bash
#!/bin/bash
# Guardar como: verify.sh
# Uso: ./verify.sh

echo "🔍 Verificando configuración..."
command -v git >/dev/null && echo "✅ Git" || echo "❌ Git"
[ -d .git ] && echo "✅ Repo Git" || echo "❌ Repo Git"
git remote -v | grep origin && echo "✅ Remoto" || echo "❌ Remoto"
echo "Rama: $(git branch --show-current)"
```

---

## 📞 Enlaces Útiles

```
Vercel Dashboard:     https://vercel.com/dashboard
GitHub:               https://github.com
Git Docs:             https://git-scm.com/doc
Vercel Docs:          https://vercel.com/docs
```

---

## 💡 Tips Pro

```
✓ Siempre crear backup antes: git branch backup-$(date +%Y%m%d)
✓ Usar .gitignore para node_modules/
✓ Commit messages descriptivos: "Fix: bug en Admin"
✓ Ver cambios antes de commit: git diff
✓ Limpiar caché siempre: Ctrl+Shift+R
✓ Verificar logs en Vercel si falla
✓ Modo incógnito para verificar sin caché
```

---

## 🔄 Workflow Diario

```
Mañana:
1. git pull origin main      (sincronizar con remoto)
2. Trabajar en Figma Make
3. Descargar cambios
4. cp -r ... (copiar)
5. git add . && commit && push
6. Verificar deploy

Tarde:
7. Repetir 2-6 si hay cambios

Noche:
8. git push (si quedó algo pendiente)
```

---

## 📊 Estado del Deploy

```
Vercel Deployment States:

🟢 Ready          → ✅ Todo OK, app actualizada
🟡 Building       → ⏳ Compilando, espera 2-3min
🟡 Queued         → ⏳ En cola, espera un momento
🔴 Error          → ❌ Falló, revisar Build Logs
⚪ Canceled       → ⛔ Cancelado manualmente
```

---

## 🎯 Resultado Esperado

```
Admin en Vercel debe mostrar:

✅ Pestaña 1: Coordinadores
✅ Pestaña 2: Altas
✅ Pestaña 3: Registros QR

Si ves esto, ¡sincronización exitosa! 🎉
```

---

## 📝 Comandos Git Más Usados

```bash
git status                    # Ver estado actual
git log --oneline -5          # Ver últimos 5 commits
git diff                      # Ver cambios sin commit
git diff HEAD~1               # Comparar con commit anterior
git branch                    # Listar ramas
git branch -a                 # Listar todas (local + remoto)
git checkout -b nueva-rama    # Crear y cambiar a rama
git merge otra-rama           # Fusionar rama
git reset --hard HEAD         # Descartar TODOS los cambios
git reset --soft HEAD~1       # Deshacer último commit (keep changes)
git clean -fd                 # Eliminar archivos no trackeados
git remote -v                 # Ver remoto configurado
git remote set-url origin URL # Cambiar URL remoto
```

---

## 🚀 One-Liner Mágico

```bash
# Todo en una línea (para expertos)
cd /tu/repo && git add . && git commit -m "$(date +%Y-%m-%d)" && git push && echo "✅ Done! Wait 2min for deploy"
```

---

## 📚 Si Necesitas Más Ayuda

```
Guía detallada:     CHECKLIST_SINCRONIZACION.md
Troubleshooting:    SOLUCION_DESINCRONIZACION.md
Comandos completos: COMANDOS_SINCRONIZACION.md
Inicio rápido:      EMPIEZA_AQUI_SINCRONIZACION.md
Índice completo:    INDICE_SINCRONIZACION.md
```

---

**Guardado:** Marzo 6, 2026  
**Versión:** 1.0

```
╔════════════════════════════════════════╗
║                                        ║
║  📋 Imprime esta hoja y tenla a mano  ║
║                                        ║
╚════════════════════════════════════════╝
```
