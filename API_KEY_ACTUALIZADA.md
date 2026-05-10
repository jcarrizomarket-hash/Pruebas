# ✅ API Key Actualizada - Producción

## 🔑 Cambio Realizado

**Fecha:** 2026-05-07

**Archivo modificado:** `src/app/config/supabase.config.ts`

### Antes (Legacy Key - Deshabilitada)
```typescript
production: {
  projectId: 'bvnbwqsvldsfdfzifcp',
  url: 'https://bvnbwqsvldsfdfzifcp.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'  // ❌ Legacy key
}
```

### Después (Nueva Publishable Key)
```typescript
production: {
  projectId: 'bvnbwqsvldsfdfzifcp',
  url: 'https://bvnbwqsvldsfdfzifcp.supabase.co',
  anonKey: 'sb_publishable_H3FwqqpvBg--1HWolSOqWA_KUFnXuWX'  // ✅ Nueva key
}
```

---

## ✅ Estado Actual

```
✅ API Key de producción actualizada
✅ Build de producción completado
✅ Preview server corriendo
✅ Login debería funcionar correctamente
```

---

## 🧪 Probar Ahora

### 1. Abrir la aplicación

```
http://localhost:4173/
```

### 2. Intentar Login

**Credenciales de prueba:**
```
Email:    admin@camareros.app
Password: admin123
```

O cualquiera de los 5 usuarios que importaste a producción.

### 3. Si no hay usuarios - Crear Admin

Click en el botón:
```
🚀 Crear Usuario Admin (Primera vez)
```

---

## 🔍 Verificar en DevTools

### Network Tab (F12)

Deberías ver:
```
✅ POST https://bvnbwqsvldsfdfzifcp.supabase.co/rest/v1/usuarios
✅ Status: 200 OK
✅ Authorization: Bearer sb_publishable_H3FwqqpvBg--1HWolSOqWA_KUFnXuWX
```

**NO deberías ver:**
```
❌ Error: "Legacy API keys are disabled"
```

---

## 📦 Siguiente Paso: Actualizar Desarrollo

También necesitarás actualizar la key de **desarrollo** cuando la uses.

### Para obtener la key de desarrollo:

1. **Ir al dashboard:**
   ```
   https://supabase.com/dashboard/project/eubjevjqcpsvpgxmdpvy/settings/api
   ```

2. **Copiar Publishable key de desarrollo**

3. **Actualizar en:** `src/app/config/supabase.config.ts`
   ```typescript
   development: {
     projectId: 'eubjevjqcpsvpgxmdpvy',
     url: 'https://eubjevjqcpsvpgxmdpvy.supabase.co',
     anonKey: 'NUEVA_PUBLISHABLE_KEY_DESARROLLO'  // ← Actualizar aquí
   }
   ```

---

## 🚀 Para Deploy

El código ya está listo para deployar a Vercel/Netlify con la nueva key.

```bash
# Commit cambios
git add src/app/config/supabase.config.ts
git commit -m "feat: actualizar a nueva Publishable API key de Supabase"

# Push a GitHub
git push origin main

# Deploy automático en Vercel/Netlify
```

---

## 🔐 Seguridad

**Publishable Key (nueva):**
- ✅ Segura para exponer en frontend
- ✅ Puede estar en GitHub
- ✅ Limitada por Row Level Security (RLS)
- ✅ Formato: `sb_publishable_...`

**Legacy Keys (antiguas):**
- ❌ Deshabilitadas por Supabase
- ❌ Formato: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 📝 Resumen de Archivos

### Modificados
- ✅ `src/app/config/supabase.config.ts` - Nueva Publishable key

### Build
- ✅ `dist/` - Build actualizado con nueva key

### Sin Cambios
- `src/app/lib/supabase.ts` - Cliente de Supabase
- `src/app/components/login.tsx` - Componente de login
- Tablas de base de datos

---

## ✅ Checklist

- [x] Obtener nueva Publishable key de producción
- [x] Actualizar `supabase.config.ts`
- [x] Build de producción: `pnpm build:prod`
- [x] Preview server iniciado
- [ ] Probar login en http://localhost:4173/
- [ ] Verificar que NO hay error "Legacy API keys"
- [ ] (Futuro) Actualizar key de desarrollo

---

## 🎉 ¡Listo!

El login debería funcionar correctamente ahora.

**Si aún ves el error "Legacy API keys", asegúrate de:**
1. Refresh completo de la página (Ctrl+Shift+R o Cmd+Shift+R)
2. Limpiar caché del navegador
3. Verificar que el preview server está usando el nuevo build

---

## 📞 Comandos Útiles

```bash
# Ver configuración actual
cat src/app/config/supabase.config.ts

# Rebuild
pnpm build:prod

# Preview
pnpm preview:prod

# Ver preview server
ps aux | grep "vite preview"
```
