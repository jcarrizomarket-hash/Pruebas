# 🎯 EMPIEZA AQUÍ - Guía Visual Rápida

## 📥 Paso 1: Exportar desde Figma Make (30 segundos)

```
En Figma Make:
┌─────────────────────────────────┐
│  Figma Make Interface           │
│                                 │
│  [Share ▼] [Export] [Preview]  │  ← Click aquí
│                                 │
└─────────────────────────────────┘

→ Click en "Export" o "Download Code"
→ Se descarga un archivo .zip
→ Descomprimir en tu computadora
```

---

## 💻 Paso 2: Abrir Terminal (10 segundos)

### macOS / Linux:
```bash
# Abrir Terminal (Cmd + Space → escribir "Terminal")
cd ruta/al/proyecto/descomprimido
```

### Windows:
```cmd
# Abrir CMD o PowerShell
cd ruta\al\proyecto\descomprimido
```

---

## 🔧 Paso 3: Instalar Herramientas (2 minutos)

```bash
# Copiar y pegar estos comandos uno por uno:

# 1. Instalar Supabase CLI
npm install -g supabase

# 2. Instalar Vercel CLI  
npm install -g vercel

# 3. Instalar dependencias del proyecto
npm install
```

**¿Cómo sé que funcionó?** ✅
```bash
# Ejecutar para verificar:
node --version     # Debe mostrar: v18.x.x o superior
supabase --version # Debe mostrar: 1.x.x
vercel --version   # Debe mostrar: 33.x.x
```

---

## 🔐 Paso 4: Login en Servicios (1 minuto)

```bash
# 1. Login en Supabase
supabase login
# → Se abre el navegador → Click en "Authorize"

# 2. Login en Vercel
vercel login
# → Se abre el navegador → Click en "Continue"
```

**Pantalla exitosa:**
```
✅ Supabase: Successfully logged in
✅ Vercel: Success! Email confirmed
```

---

## ⚙️ Paso 5: Configurar Variables (1 minuto)

```bash
# 1. Copiar archivo de ejemplo
cp .env.example .env

# 2. Editar con tu editor favorito
nano .env
# O: code .env (si tienes VS Code)
# O: notepad .env (Windows)
```

**Contenido de `.env`:**
```env
VITE_SUPABASE_URL=https://eubjevjqcpsvpgxmdpvy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3... ← PEGA TU CLAVE AQUÍ
```

**¿Dónde obtener la clave?** 🔑

1. Ve a: https://supabase.com/dashboard/project/eubjevjqcpsvpgxmdpvy/settings/api
2. Copia el valor de **"anon public"**
3. Pégalo en `.env`

---

## 🚀 Paso 6: ¡DESPLEGAR! (2-3 minutos)

```bash
# UN SOLO COMANDO:
./deploy.sh
```

**¿En Windows?**
```cmd
deploy.bat
```

**Verás esto en pantalla:**
```
🚀 =====================================
🚀  DEPLOYMENT AUTOMATIZADO
🚀  Gestión de Servicios
🚀 =====================================

📋 Paso 1: Verificando dependencias...
✅ Todas las dependencias instaladas

📋 Paso 2: Verificando autenticación...
✅ Autenticación verificada

📋 Paso 3: Desplegando Edge Function a Supabase...
✅ Edge Function desplegada exitosamente

📋 Paso 4: Verificando variables de entorno...
✅ Variables de entorno verificadas

📋 Paso 5: Construyendo proyecto...
✅ Build completado

📋 Paso 6: Desplegando a Vercel...
¿Desplegar a PRODUCCIÓN? (s/n): 
```

→ **Escribe "s" y presiona Enter**

```
✅ Deployment a Vercel completado

=====================================
✅  DEPLOYMENT COMPLETADO
=====================================

🔗 URLs:
   🌐 Producción: https://gestiondeservicios.jcarrizo.com
   🔧 Supabase: https://supabase.com/dashboard
   ⚙️  Vercel: https://vercel.com/dashboard
```

---

## 🎯 Paso 7: Configurar Vercel (1 minuto)

### Opción A: Desde el Dashboard (Recomendado)

1. **Ir a:** https://vercel.com/dashboard
2. **Click** en tu proyecto
3. **Settings** → **Environment Variables**
4. **Agregar variables:**
   
   Variable 1:
   ```
   Name:  VITE_SUPABASE_URL
   Value: https://eubjevjqcpsvpgxmdpvy.supabase.co
   ```
   
   Variable 2:
   ```
   Name:  VITE_SUPABASE_ANON_KEY
   Value: [tu clave anon copiada antes]
   ```

5. **Save**

6. **Re-desplegar:**
   ```bash
   vercel --prod
   ```

### Opción B: Desde Terminal

```bash
vercel env add VITE_SUPABASE_URL
# Pegar: https://eubjevjqcpsvpgxmdpvy.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY
# Pegar: tu_clave_anon

vercel --prod
```

---

## ✅ Paso 8: ¡VERIFICAR! (30 segundos)

### 1. Abrir tu sitio
```
https://gestiondeservicios.jcarrizo.com
```

### 2. Crear usuario admin

En la pantalla de login, verás:
```
┌────────────────────────────────┐
│   🔒 Gestión de Perfiles       │
│                                │
│   Email: [                  ]  │
│   Contraseña: [             ]  │
│                                │
│   [  Iniciar Sesión  ]         │
│                                │
│   🚀 Crear Usuario Admin       │  ← CLICK AQUÍ
│      (Primera vez)             │
│                                │
└────────────────────────────────┘
```

### 3. Verás mensaje de éxito
```
✅ Usuario admin creado exitosamente. 
   Usa: admin@ejemplo.com / admin123
```

### 4. Click en "Iniciar Sesión"

### 5. ¡LISTO! 🎉

Verás el dashboard completo con todos los tabs.

---

## 📊 Resumen Visual del Proceso

```
┌─────────────────┐
│  1. Exportar    │  30 seg
│  desde Figma    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  2. Abrir       │  10 seg
│  Terminal       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  3. Instalar    │  2 min
│  Herramientas   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  4. Login en    │  1 min
│  Servicios      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  5. Configurar  │  1 min
│  Variables      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  6. DESPLEGAR   │  2-3 min
│  ./deploy.sh    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  7. Config      │  1 min
│  Vercel         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  8. VERIFICAR   │  30 seg
│  ✅ FUNCIONA    │
└─────────────────┘

TIEMPO TOTAL: ~7-8 minutos
```

---

## 🆘 Si Algo Sale Mal

### Error: "Command not found"
```bash
# Reinstalar la herramienta faltante
npm install -g supabase vercel
```

### Error: "Login failed"
```bash
# Intentar de nuevo
supabase logout
supabase login

vercel logout
vercel login
```

### Error: "Build failed"
```bash
# Limpiar y reinstalar
rm -rf node_modules
npm install
npm run build
```

### Error: "404 Not Found"
```bash
# Re-desplegar Edge Function
supabase functions deploy make-server-ce05fe95 --no-verify-jwt
```

### Cualquier otro error
```bash
# Ejecutar diagnóstico
./pre-deploy-check.sh
```

---

## 🎯 Checklist Final

Marca cada paso conforme lo completes:

- [ ] ✅ Exportado desde Figma Make
- [ ] ✅ Descomprimido el ZIP
- [ ] ✅ Abierto terminal en la carpeta correcta
- [ ] ✅ Instalado Supabase CLI
- [ ] ✅ Instalado Vercel CLI
- [ ] ✅ Ejecutado `npm install`
- [ ] ✅ Login en Supabase exitoso
- [ ] ✅ Login en Vercel exitoso
- [ ] ✅ Creado archivo `.env`
- [ ] ✅ Copiado clave ANON en `.env`
- [ ] ✅ Ejecutado `./deploy.sh`
- [ ] ✅ Configurado variables en Vercel
- [ ] ✅ Re-desplegado con `vercel --prod`
- [ ] ✅ Sitio accesible en navegador
- [ ] ✅ Creado usuario admin
- [ ] ✅ Login funciona correctamente

**¿Todos marcados? ¡FELICITACIONES! 🎉**

Tu aplicación está en producción en:
**https://gestiondeservicios.jcarrizo.com**

---

## 📚 Siguiente Lectura

Ahora que tu app está funcionando, explora:

1. **[README.md](./README.md)** - Entender todas las funcionalidades
2. **[COMANDOS-UTILES.md](./COMANDOS-UTILES.md)** - Comandos para el día a día
3. **La aplicación** - Explora todos los módulos

---

## 💡 Tips Finales

1. **Guarda tus credenciales:**
   - Email: `admin@ejemplo.com`
   - Password: `admin123`
   - ⚠️ Cámbiala después del primer login

2. **Bookmarks útiles:**
   - Tu sitio: https://gestiondeservicios.jcarrizo.com
   - Supabase: https://supabase.com/dashboard
   - Vercel: https://vercel.com/dashboard

3. **Próximos pasos:**
   - Crear coordinadores
   - Agregar camareros
   - Crear primer pedido
   - Explorar informes

---

**¿Listo para empezar?**

```bash
./deploy.sh
```

**¡Nos vemos en producción!** 🚀

---

**Tiempo total estimado:** 7-8 minutos  
**Dificultad:** ⭐⭐☆☆☆ (Fácil)  
**Requisitos:** Terminal + 10 minutos
