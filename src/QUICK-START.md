# ⚡ Quick Start - Deployment en 5 Minutos

Esta guía te llevará de **0 a deployed** en 5 minutos.

---

## 🎯 Paso 1: Instalar Herramientas (2 min)

### macOS / Linux:
```bash
# Instalar Supabase CLI
npm install -g supabase

# Instalar Vercel CLI
npm install -g vercel
```

### Windows:
```bash
npm install -g supabase vercel
```

---

## 🔐 Paso 2: Configurar Credenciales (1 min)

```bash
# Login en Supabase
supabase login

# Login en Vercel (solo la primera vez)
vercel login
```

---

## ⚙️ Paso 3: Configurar Proyecto (1 min)

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Editar .env con tu clave ANON de Supabase
# (Obtenerla de: https://supabase.com/dashboard/project/eubjevjqcpsvpgxmdpvy/settings/api)
```

Edita `.env`:
```env
VITE_SUPABASE_URL=https://eubjevjqcpsvpgxmdpvy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc... # <-- Pega tu clave aquí
```

---

## 🚀 Paso 4: Desplegar Todo (1 min)

### Un solo comando:

**macOS / Linux:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Windows:**
```bash
deploy.bat
```

El script:
1. ✅ Despliega Edge Function a Supabase
2. ✅ Hace build del proyecto
3. ✅ Despliega a Vercel
4. ✅ Te muestra las URLs finales

---

## ✅ Paso 5: Verificar (30 seg)

1. **Abre:** https://gestiondeservicios.jcarrizo.com
2. **Click en:** "🚀 Crear Usuario Admin (Primera vez)"
3. **Inicia sesión con:**
   - Email: `admin@ejemplo.com`
   - Password: `admin123`
4. **Explora la app** 🎉

---

## 🎯 Configurar Variables en Vercel

**IMPORTANTE:** Después del primer deployment, configura las variables en Vercel:

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto
3. **Settings** → **Environment Variables**
4. Agrega:
   - `VITE_SUPABASE_URL` = `https://eubjevjqcpsvpgxmdpvy.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = Tu clave ANON

5. **Re-despliega:**
   ```bash
   vercel --prod
   ```

---

## 📊 ¿Qué sigue?

Ya tienes tu app desplegada! Ahora puedes:

- ✅ Crear coordinadores y camareros
- ✅ Gestionar pedidos y eventos
- ✅ Enviar comunicaciones por WhatsApp/Email
- ✅ Ver reportes y analytics
- ✅ Probar la API con el tab "🧪 Test API"

---

## 🐛 ¿Algo salió mal?

**Error común 1: "Supabase CLI not found"**
```bash
npm install -g supabase
```

**Error común 2: "Project not linked"**
```bash
supabase link --project-ref eubjevjqcpsvpgxmdpvy
```

**Error común 3: "Build failed"**
```bash
npm install
npm run build
```

**Ver más soluciones:** [DEPLOY-GUIDE.md](./DEPLOY-GUIDE.md)

---

## 📞 Necesitas ayuda?

1. Ejecuta el diagnóstico:
   ```bash
   ./pre-deploy-check.sh
   ```

2. Revisa los logs:
   - **Supabase:** https://supabase.com/dashboard/project/eubjevjqcpsvpgxmdpvy/logs
   - **Vercel:** https://vercel.com/dashboard

3. Lee la guía completa: [DEPLOY-GUIDE.md](./DEPLOY-GUIDE.md)

---

## 🎉 ¡Listo!

Tu aplicación está corriendo en:
- 🌐 https://gestiondeservicios.jcarrizo.com

**Usuario admin:**
- Email: `admin@ejemplo.com`
- Password: `admin123`

---

**Tiempo total:** ⏱️ 5 minutos  
**Dificultad:** ⭐⭐☆☆☆ (Fácil)
