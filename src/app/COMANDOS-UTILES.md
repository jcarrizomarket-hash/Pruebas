# 🎯 Comandos Útiles - Gestión de Servicios

Referencia rápida de todos los comandos disponibles.

---

## 🚀 Deployment

### Deployment Completo (Recomendado)
```bash
# Linux/Mac
./deploy.sh

# Windows
deploy.bat

# O usando npm
npm run deploy          # Linux/Mac
npm run deploy:win      # Windows
```

### Deployment Parcial
```bash
# Solo Edge Function (Backend)
npm run deploy:supabase
# O manualmente:
supabase functions deploy make-server-ce05fe95 --no-verify-jwt

# Solo Frontend
npm run deploy:vercel
# O manualmente:
vercel --prod
```

---

## 🔧 Setup Inicial

### Instalación Rápida
```bash
# Setup completo automático
npm run setup

# O manual:
npm install
cp .env.example .env
# Editar .env con tus credenciales
```

### Vincular con Supabase
```bash
npm run link:supabase
# O manualmente:
supabase link --project-ref eubjevjqcpsvpgxmdpvy
```

---

## ✅ Verificación y Testing

### Pre-Deployment Check
```bash
# Verificar que todo está listo
npm run check
# O manualmente:
./pre-deploy-check.sh
```

### Test API
```bash
# Test rápido del endpoint /test
npm run test:api

# Test manual con curl
curl https://eubjevjqcpsvpgxmdpvy.supabase.co/functions/v1/make-server-ce05fe95/test

# Test de otros endpoints
curl https://eubjevjqcpsvpgxmdpvy.supabase.co/functions/v1/make-server-ce05fe95/clientes
curl https://eubjevjqcpsvpgxmdpvy.supabase.co/functions/v1/make-server-ce05fe95/camareros
curl https://eubjevjqcpsvpgxmdpvy.supabase.co/functions/v1/make-server-ce05fe95/pedidos
```

---

## 📊 Logs y Debugging

### Ver Logs de Supabase
```bash
# Logs en tiempo real
npm run logs:supabase

# O manualmente
supabase functions logs make-server-ce05fe95

# Logs con filtro
supabase functions logs make-server-ce05fe95 --filter "error"
```

### Ver Logs de Vercel
```bash
# En el dashboard
vercel logs

# Logs en tiempo real
vercel logs --follow
```

---

## 💻 Desarrollo Local

### Servidor de Desarrollo
```bash
npm run dev
# Abre: http://localhost:5173
```

### Build y Preview
```bash
# Build para producción
npm run build

# Preview del build
npm run preview
```

---

## 🔐 Autenticación

### Login en Servicios
```bash
# Supabase
supabase login

# Vercel
vercel login

# Verificar sesión actual
supabase projects list
vercel whoami
```

### Logout
```bash
# Supabase
supabase logout

# Vercel
vercel logout
```

---

## 📦 Gestión de Dependencias

### Instalar/Actualizar
```bash
# Instalar dependencias
npm install

# Actualizar dependencias
npm update

# Instalar dependencia específica
npm install nombre-paquete

# Instalar dependencia de desarrollo
npm install --save-dev nombre-paquete
```

### Limpiar
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules
npm install

# Limpiar cache de npm
npm cache clean --force
```

---

## 🌐 Configuración de Vercel

### Variables de Entorno
```bash
# Listar variables
vercel env ls

# Agregar variable
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Remover variable
vercel env rm NOMBRE_VARIABLE
```

### Dominios
```bash
# Listar dominios
vercel domains ls

# Agregar dominio
vercel domains add gestiondeservicios.jcarrizo.com

# Remover dominio
vercel domains rm gestiondeservicios.jcarrizo.com
```

---

## 🗄️ Supabase Functions

### Listar Functions
```bash
supabase functions list
```

### Deploy Function
```bash
# Con verificación JWT
supabase functions deploy make-server-ce05fe95

# Sin verificación JWT (recomendado para este proyecto)
supabase functions deploy make-server-ce05fe95 --no-verify-jwt
```

### Borrar Function
```bash
supabase functions delete make-server-ce05fe95
```

### Servir localmente
```bash
supabase functions serve make-server-ce05fe95
```

---

## 🔍 Debugging Avanzado

### Inspeccionar Build
```bash
# Build con output detallado
npm run build -- --debug

# Analizar bundle size
npx vite-bundle-visualizer
```

### Test de Performance
```bash
# Lighthouse
npx lighthouse https://gestiondeservicios.jcarrizo.com

# O usando Chrome DevTools (F12 > Lighthouse)
```

### Verificar Edge Function Localmente
```bash
# Servir función localmente
supabase start
supabase functions serve make-server-ce05fe95

# Test local
curl http://localhost:54321/functions/v1/make-server-ce05fe95/test
```

---

## 🔄 Git y Control de Versiones

### Commits Típicos
```bash
# Commit de deployment
git add .
git commit -m "Deploy: Actualización v2.5.0"
git push origin main

# Commit de features
git commit -m "feat: Agregar funcionalidad X"

# Commit de fixes
git commit -m "fix: Corregir error en login"
```

### Tags de Versión
```bash
# Crear tag
git tag -a v2.5.0 -m "Versión 2.5.0"

# Push tags
git push origin --tags

# Listar tags
git tag -l
```

---

## 🧹 Limpieza y Mantenimiento

### Limpiar archivos temporales
```bash
# Limpiar build
rm -rf dist/

# Limpiar node_modules
rm -rf node_modules/

# Limpiar todo y reinstalar
rm -rf node_modules dist
npm install
npm run build
```

### Verificar espacio
```bash
# Ver tamaño de directorios
du -sh node_modules dist

# Ver archivos grandes
find . -type f -size +1M -ls
```

---

## 📱 Testing de Endpoints

### GET Requests
```bash
# Clientes
curl https://eubjevjqcpsvpgxmdpvy.supabase.co/functions/v1/make-server-ce05fe95/clientes

# Camareros
curl https://eubjevjqcpsvpgxmdpvy.supabase.co/functions/v1/make-server-ce05fe95/camareros

# Pedidos
curl https://eubjevjqcpsvpgxmdpvy.supabase.co/functions/v1/make-server-ce05fe95/pedidos
```

### POST Requests
```bash
# Crear cliente (ejemplo)
curl -X POST https://eubjevjqcpsvpgxmdpvy.supabase.co/functions/v1/make-server-ce05fe95/clientes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"nombre":"Test","email":"test@example.com"}'

# Login
curl -X POST https://eubjevjqcpsvpgxmdpvy.supabase.co/functions/v1/make-server-ce05fe95/login \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"email":"admin@ejemplo.com","password":"admin123"}'
```

---

## 🎯 Atajos Rápidos

### Desarrollo
```bash
npm run dev              # Iniciar desarrollo
npm run build            # Build
npm run preview          # Preview del build
```

### Deployment
```bash
npm run deploy           # Deploy completo
npm run check            # Pre-check
npm run test:api         # Test rápido
```

### Logs
```bash
npm run logs:supabase    # Ver logs de Supabase
vercel logs --follow     # Ver logs de Vercel
```

### Utilidades
```bash
npm run setup            # Setup inicial
npm run link:supabase    # Vincular proyecto
```

---

## 📚 Documentación Rápida

```bash
# Ver ayuda de Supabase
supabase --help
supabase functions --help

# Ver ayuda de Vercel
vercel --help
vercel deploy --help

# Ver versiones
node --version
npm --version
supabase --version
vercel --version
```

---

## 🚨 Comandos de Emergencia

### Rollback en Vercel
```bash
# Ver deployments
vercel ls

# Rollback al anterior
vercel rollback
```

### Re-deploy Forzado
```bash
# Force re-deploy
vercel --prod --force

# Limpiar cache y re-deploy
vercel --prod --no-cache
```

### Reset Completo
```bash
# Limpiar todo y empezar de cero
rm -rf node_modules dist .vercel .supabase
npm install
./deploy.sh
```

---

## 💡 Tips y Trucos

### Alias útiles (agregar a ~/.bashrc o ~/.zshrc)
```bash
alias gs-dev='npm run dev'
alias gs-deploy='./deploy.sh'
alias gs-check='npm run check'
alias gs-logs='npm run logs:supabase'
alias gs-test='npm run test:api'
```

### Watch mode para desarrollo
```bash
# Auto-rebuild en cambios
npm run dev

# Watch para tests
npm run test -- --watch
```

---

**Última actualización:** Marzo 2026  
**Versión:** 2.5.0

Para más información, consulta:
- [README.md](./README.md) - Documentación principal
- [DEPLOY-GUIDE.md](./DEPLOY-GUIDE.md) - Guía de deployment
- [QUICK-START.md](./QUICK-START.md) - Inicio rápido
