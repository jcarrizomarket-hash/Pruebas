# 🔍 VERIFICAR BUILD DE VERCEL - CHECKLIST

## 🎯 Objetivo
Verificar que el build de Vercel se complete correctamente y diagnosticar errores si los hay.

---

## ✅ PASOS DE VERIFICACIÓN:

### 1️⃣ **Acceder a los Build Logs**

1. Ve a: https://vercel.com/dashboard
2. Click en tu proyecto
3. Click en la pestaña **"Deployments"**
4. Click en el deployment más reciente (el de arriba)
5. Verás una pantalla con el log del build

---

### 2️⃣ **Verificar que el Build se completó**

Busca estas líneas en el log:

#### ✅ **Build EXITOSO debe mostrar:**

```
[14:23:45.678] Running "npm run build"
[14:23:46.123] > gestion-servicios@2.6.2 build
[14:23:46.123] > vite build

[14:23:47.456] vite v6.0.3 building for production...
[14:23:48.789] ✓ 1234 modules transformed.
[14:23:49.012] dist/index.html                   1.23 kB │ gzip:  0.56 kB
[14:23:49.012] dist/assets/index-a1b2c3d4.css   45.67 kB │ gzip: 12.34 kB
[14:23:49.012] dist/assets/index-e5f6g7h8.js   890.12 kB │ gzip: 234.56 kB
[14:23:49.123] ✓ built in 2.34s

[14:23:49.234] Build Completed in /vercel/output [2s]
[14:23:49.345] Deployment ready
```

#### ❌ **Build FALLIDO mostrará:**

```
[14:23:45.678] ✗ Error: ...
[14:23:45.678] Build failed
```

---

### 3️⃣ **Diagnóstico de Errores Comunes**

#### Error: `ENOENT: no such file or directory`
**Solución:** Verifica que `dist/` esté siendo generado
```bash
# Localmente:
npm run build
ls -la dist/
```

#### Error: `Type error: ...`
**Solución:** Error de TypeScript
```bash
# Localmente:
npm run build
# Corrige los errores que aparezcan
```

#### Error: `Cannot find module ...`
**Solución:** Dependencia faltante
```bash
# Verifica package.json
npm install
npm run build
```

#### Error: `Environment variable not defined`
**Solución:** Variables de entorno faltantes en Vercel
1. Ve a Settings → Environment Variables
2. Agrega las variables faltantes
3. Redeploy

---

### 4️⃣ **Verificar Output Directory**

En el log, busca:

```
[HH:MM:SS.mmm] Uploading build outputs...
[HH:MM:SS.mmm] Uploading dist/index.html
[HH:MM:SS.mmm] Uploading dist/assets/...
```

**Si NO ves esto:** El build no generó archivos en `dist/`

**Solución:**
1. Verifica que `vercel.json` tenga: `"outputDirectory": "dist"`
2. Verifica que `vite.config.ts` tenga: `build: { outDir: 'dist' }`

---

### 5️⃣ **Verificar que los Assets se subieron**

Busca en el log:

```
[HH:MM:SS.mmm] Deployment ready
[HH:MM:SS.mmm] Assigning domains...
[HH:MM:SS.mmm] Success! Domain assigned: gestiondeservicios.jcarrizo.com
```

**Si NO ves "Deployment ready":** El deployment falló

---

## 🔧 **SOLUCIONES RÁPIDAS:**

### Si el build falla localmente:

```bash
# 1. Limpiar dependencias
rm -rf node_modules package-lock.json
npm install

# 2. Intentar build
npm run build

# 3. Si funciona, subir a GitHub
git add .
git commit -m "fix: Corregir dependencias"
git push origin main
```

### Si el build funciona localmente pero falla en Vercel:

1. **Verificar versión de Node.js:**
   - Vercel usa Node.js 18.x por defecto
   - Verifica en `package.json`: `"engines": { "node": ">=18.0.0" }`

2. **Verificar variables de entorno:**
   - Ve a Vercel → Settings → Environment Variables
   - Asegúrate de que las variables estén aplicadas a **Production**

3. **Limpiar cache de Vercel:**
   - Ve a Deployments
   - Click en "..." → Redeploy
   - **DESMARCA** "Use existing Build Cache"

---

## 📊 **TABLA DE DIAGNÓSTICO:**

| Síntoma | Causa Probable | Solución |
|---------|----------------|----------|
| 404 Not Found | Build no generó archivos | Verificar outputDirectory en vercel.json |
| Invalid JWT | Variables de entorno faltantes | Agregar VITE_SUPABASE_* en Vercel |
| Module not found | Dependencia faltante | npm install y push a GitHub |
| Type error | Error de TypeScript | Corregir el código y push |
| Build timeout | Build muy lento | Revisar dependencias pesadas |

---

## ✅ **CHECKLIST FINAL:**

Antes de redeploy, verifica:

- [ ] ✅ `vercel.json` tiene `"outputDirectory": "dist"`
- [ ] ✅ `vercel.json` tiene `"buildCommand": "npm run build"`
- [ ] ✅ `package.json` tiene `"build": "vite build"`
- [ ] ✅ Variables de entorno configuradas en Vercel
- [ ] ✅ `npm run build` funciona localmente
- [ ] ✅ Carpeta `dist/` se crea con `index.html` y `assets/`
- [ ] ✅ Cambios subidos a GitHub (`git push`)

---

## 🆘 **Si sigue fallando:**

Proporciona:

1. **Build Logs completos** (copia todo el texto del log de Vercel)
2. **Output de `npm run build` local** (ejecuta en tu computadora)
3. **Contenido de `dist/`** (después de `npm run build` local):
   ```bash
   ls -la dist/
   ```
4. **Screenshot de Variables de Entorno** (Vercel → Settings → Environment Variables)

---

**🎯 Después de verificar todo, haz un redeploy SIN CACHE desde Vercel.**
