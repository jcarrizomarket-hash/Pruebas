# ✅ Deployment Checklist

Usa esta lista para asegurarte que todo está configurado correctamente antes de desplegar.

---

## 📋 Pre-Deployment

### Instalación de Herramientas
- [ ] Node.js 18+ instalado (`node --version`)
- [ ] npm instalado (`npm --version`)
- [ ] Supabase CLI instalado (`supabase --version`)
- [ ] Vercel CLI instalado (`vercel --version`)

### Autenticación
- [ ] Login en Supabase (`supabase login`)
- [ ] Login en Vercel (`vercel login`)
- [ ] Proyecto vinculado con Supabase (`supabase link`)

### Configuración
- [ ] Archivo `.env` creado (copiar de `.env.example`)
- [ ] `VITE_SUPABASE_URL` configurado en `.env`
- [ ] `VITE_SUPABASE_ANON_KEY` configurado en `.env`
- [ ] Dependencias instaladas (`npm install`)

### Archivos Críticos
- [ ] `App.tsx` existe
- [ ] `package.json` existe
- [ ] `vercel.json` existe
- [ ] `supabase/functions/server/index.tsx` existe
- [ ] `components/login.tsx` existe
- [ ] `components/TestEdgeFunction.tsx` existe

---

## 🚀 Durante Deployment

### Edge Function (Supabase)
- [ ] Edge Function desplegada (`supabase functions deploy make-server-ce05fe95`)
- [ ] Sin errores en deployment
- [ ] Función aparece en Supabase Dashboard

### Frontend (Vercel)
- [ ] Build exitoso (`npm run build`)
- [ ] Deploy a Vercel completado (`vercel --prod`)
- [ ] Sin errores en deployment

### Variables de Entorno en Vercel
- [ ] `VITE_SUPABASE_URL` configurado en Vercel Dashboard
- [ ] `VITE_SUPABASE_ANON_KEY` configurado en Vercel Dashboard
- [ ] Re-deploy después de configurar variables

### Dominio
- [ ] Dominio configurado en Vercel (`gestiondeservicios.jcarrizo.com`)
- [ ] DNS configurado correctamente
- [ ] SSL/HTTPS funcionando

---

## ✅ Post-Deployment

### Verificación de Backend
- [ ] Edge Function responde: `/test` endpoint
  ```bash
  curl https://eubjevjqcpsvpgxmdpvy.supabase.co/functions/v1/make-server-ce05fe95/test
  ```
- [ ] Respuesta exitosa (200 OK)
- [ ] JSON válido en respuesta

### Verificación de Frontend
- [ ] Sitio accesible en `https://gestiondeservicios.jcarrizo.com`
- [ ] Página de login se carga correctamente
- [ ] No hay errores 404 o 500
- [ ] No hay errores en consola del navegador (F12)

### Funcionalidad Básica
- [ ] Botón "🚀 Crear Usuario Admin" visible
- [ ] Click en botón crea usuario exitosamente
- [ ] Login funciona con: `admin@ejemplo.com` / `admin123`
- [ ] Dashboard se carga después del login
- [ ] Todos los tabs son visibles (Dashboard, Pedidos, Personal, etc.)
- [ ] Tab "🧪 Test API" funciona correctamente

### Tests de API
- [ ] `/test` endpoint funciona
- [ ] `/clientes` endpoint funciona
- [ ] `/camareros` endpoint funciona
- [ ] `/coordinadores` endpoint funciona
- [ ] `/pedidos` endpoint funciona

### Logs y Monitoreo
- [ ] Logs en Supabase Dashboard no muestran errores
- [ ] Logs en Vercel Dashboard no muestran errores
- [ ] No hay errores de CORS
- [ ] Tiempo de respuesta < 3 segundos

---

## 🔒 Seguridad

- [ ] `.env` está en `.gitignore`
- [ ] SERVICE_ROLE_KEY NO está en el frontend
- [ ] Solo ANON_KEY está en variables de entorno públicas
- [ ] HTTPS habilitado en producción
- [ ] Contraseña de admin cambiada del default

---

## 📊 Performance

- [ ] Tamaño del bundle < 500KB
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 4s
- [ ] No hay memory leaks en consola

---

## 📱 Compatibilidad

- [ ] Funciona en Chrome/Edge
- [ ] Funciona en Firefox
- [ ] Funciona en Safari
- [ ] Responsive en móvil
- [ ] Responsive en tablet

---

## 📝 Documentación

- [ ] README.md actualizado
- [ ] DEPLOY-GUIDE.md disponible
- [ ] Variables de entorno documentadas
- [ ] Changelog actualizado

---

## 🎯 Próximos Pasos Post-Deployment

1. **Cambiar contraseña de admin**
   - Login con: `admin@ejemplo.com` / `admin123`
   - Ir a configuración y cambiar contraseña

2. **Crear usuarios adicionales**
   - Coordinadores
   - Personal

3. **Configurar integraciones**
   - WhatsApp Business API
   - Email (Resend/SendGrid/Mailgun)

4. **Probar flujos completos**
   - Crear un pedido
   - Asignar camareros
   - Enviar comunicaciones
   - Ver reportes

5. **Monitoreo continuo**
   - Configurar alertas en Supabase
   - Configurar alertas en Vercel
   - Revisar logs periódicamente

---

## ✅ Final Check

**Todo está ✅ si:**
- Sitio accesible en producción
- Login funciona
- No hay errores en consola
- API responde correctamente
- Variables de entorno configuradas
- Logs limpios sin errores

---

## 🎉 ¡Deployment Exitoso!

Si todos los checkboxes están marcados, tu aplicación está correctamente desplegada y lista para producción.

**URL Producción:** https://gestiondeservicios.jcarrizo.com  
**Usuario Admin:** admin@ejemplo.com / admin123

---

**Última revisión:** Marzo 2026  
**Versión:** 2.5.0
