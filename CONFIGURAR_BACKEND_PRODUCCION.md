# 🔧 Configurar Backend en Producción

## 📊 Estado Actual

```
✅ Tablas principales creadas (10 tablas)
✅ Usuarios importados (5 usuarios)
❌ Tabla confirmaciones (falta crear)
❌ Edge Functions (no desplegadas)
❌ API Keys externas (no configuradas)
```

---

## 🎯 Componentes Backend a Configurar

### 1. Tabla Confirmaciones (SQL)
**Archivo:** `src/app/supabase/migrations/confirmaciones.sql`

**Funcionalidad:**
- Almacena tokens de confirmación de asistencia
- Enviados a camareros para confirmar/rechazar eventos
- Incluye trigger para `updated_at`

### 2. Edge Functions (Servidor Backend)
**Ubicación:** `src/app/supabase/functions/server/`

**Funcionalidad:**
- API REST para operaciones del backend
- Envío de emails de confirmación
- Manejo de chatbot
- Operaciones con base de datos
- Almacenamiento KV

### 3. API Keys Externas
**Servicios:**
- **Email Providers:** Resend, SendGrid o Mailgun
- **WhatsApp Business API** (opcional)

---

## 📋 Paso 1: Crear Tabla Confirmaciones

### Ejecutar en SQL Editor de Producción

1. **Ir a SQL Editor:**
   ```
   https://app.supabase.com/project/bvnbwqsvldsfdfzifcp/sql
   ```

2. **Copiar contenido del archivo:**
   ```
   src/app/supabase/migrations/confirmaciones.sql
   ```

3. **Ejecutar el script**

4. **Verificar que se creó:**
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'confirmaciones';
   ```

---

## 📋 Paso 2: Configurar API Keys

### Opción A: Para Testing (sin funcionalidad de email)

Puedes probar el login y funcionalidad básica **sin configurar APIs externas**.

Las funciones de email simplemente fallarán silenciosamente o mostrarán error, pero el resto de la app funcionará.

### Opción B: Configurar Email Provider (Producción Real)

Necesitas una cuenta en alguno de estos servicios:

#### Resend (Recomendado - Fácil y Gratis)

1. **Crear cuenta:** https://resend.com/signup
2. **Obtener API Key:** Dashboard → API Keys → Create API Key
3. **Plan Free:** 100 emails/día gratis

**Agregar a `.env.production`:**
```bash
RESEND_API_KEY=re_tu_api_key_aqui
```

#### SendGrid (Alternativa)

1. **Crear cuenta:** https://signup.sendgrid.com/
2. **API Key:** Settings → API Keys → Create API Key
3. **Plan Free:** 100 emails/día gratis

**Agregar a `.env.production`:**
```bash
SENDGRID_API_KEY=SG.tu_api_key_aqui
```

#### Mailgun (Alternativa)

1. **Crear cuenta:** https://signup.mailgun.com/
2. **API Key:** Settings → API Keys
3. **Domain:** Settings → Domains

**Agregar a `.env.production`:**
```bash
MAILGUN_API_KEY=tu_api_key_aqui
MAILGUN_DOMAIN=tu_dominio.mailgun.org
```

---

## 📋 Paso 3: Desplegar Edge Functions (Opcional)

Las Edge Functions son el backend API. Si no las desplegas, la app funcionará parcialmente (solo operaciones directas a la base de datos).

### Requisitos

```bash
# Instalar Supabase CLI
npm install -g supabase

# Verificar instalación
supabase --version
```

### Login en Supabase

```bash
supabase login
```

Te pedirá un Access Token. Generarlo en:
```
https://app.supabase.com/account/tokens
```

### Link al Proyecto de Producción

```bash
supabase link --project-ref bvnbwqsvldsfdfzifcp
```

### Desplegar Functions

```bash
cd src/app/supabase

# Desplegar todas las funciones
supabase functions deploy make-server-ce05fe95

# O desplegar función específica
supabase functions deploy make-server-ce05fe95 --project-ref bvnbwqsvldsfdfzifcp
```

### Configurar Secrets en Producción

Las Edge Functions necesitan acceso a las API keys:

```bash
# Configurar secrets
supabase secrets set RESEND_API_KEY=re_tu_key \
  --project-ref bvnbwqsvldsfdfzifcp

# Verificar secrets
supabase secrets list --project-ref bvnbwqsvldsfdfzifcp
```

---

## 🔍 Verificar Configuración

### 1. Verificar Tabla Confirmaciones

```sql
-- En SQL Editor de producción
SELECT * FROM confirmaciones LIMIT 1;
```

### 2. Verificar Edge Functions

Si desplegaste las functions:

```bash
curl https://bvnbwqsvldsfdfzifcp.supabase.co/functions/v1/make-server-ce05fe95/test
```

Debería devolver:
```json
{
  "success": true,
  "message": "¡Servidor funcionando correctamente!"
}
```

### 3. Verificar Variables de Entorno

**En tu `.env.production`:**

```bash
cat .env.production
```

Debe contener:
```
VITE_SUPABASE_PROJECT_ID=bvnbwqsvldsfdfzifcp
VITE_SUPABASE_URL=https://bvnbwqsvldsfdfzifcp.supabase.co
VITE_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Opcional: Si configuraste email
RESEND_API_KEY=re_...
# O
SENDGRID_API_KEY=SG....
# O
MAILGUN_API_KEY=...
MAILGUN_DOMAIN=...
```

---

## 🎯 Configuración Mínima vs Completa

### Configuración Mínima (Solo Login y CRUD)

✅ Lo que ya tienes:
- Schema completo (10 tablas)
- Usuarios importados
- Build de producción
- Variables de entorno básicas

❌ NO necesitas configurar:
- Edge Functions
- API Keys de email
- WhatsApp API

**Con esto puedes:**
- Probar login ✅
- CRUD de todas las tablas ✅
- Navegación completa ✅
- Asignaciones ✅
- Códigos correlativos ✅

**NO funcionará:**
- Envío de emails de confirmación ❌
- Chatbot ❌
- Notificaciones WhatsApp ❌

---

### Configuración Completa (Todas las Features)

✅ Necesitas configurar:
1. Tabla confirmaciones
2. Edge Functions desplegadas
3. Al menos un Email Provider (Resend recomendado)
4. (Opcional) WhatsApp Business API

**Con esto funcionará:**
- Login ✅
- CRUD completo ✅
- Envío de emails ✅
- Confirmaciones de asistencia ✅
- Chatbot ✅
- Notificaciones ✅

---

## 🚀 Recomendación para Empezar

**Fase 1: Testing Básico (AHORA)**
1. ✅ Probar login con configuración actual
2. ✅ Verificar CRUD de tablas principales
3. ✅ Navegación y permisos por rol

**Fase 2: Funcionalidad Completa (DESPUÉS)**
1. Crear tabla confirmaciones
2. Configurar Resend (gratis, 100 emails/día)
3. Desplegar Edge Functions
4. Probar envío de emails

---

## 📝 Checklist

### Para Probar Login (Mínimo)
- [x] Schema creado (10 tablas)
- [x] Usuarios importados (5 usuarios)
- [x] Build de producción generado
- [x] Variables de entorno configuradas
- [ ] Preview server iniciado
- [ ] Login probado

### Para Producción Completa (Opcional)
- [ ] Tabla confirmaciones creada
- [ ] Email provider configurado (Resend/SendGrid/Mailgun)
- [ ] Edge Functions desplegadas
- [ ] Secrets configurados en Supabase
- [ ] Funcionalidad de email probada

---

## 🎯 Siguiente Paso

**Para probar el login ahora:**

```bash
# Iniciar preview con configuración de producción
pnpm preview:prod
```

Abrir: http://localhost:4173/

Login con:
```
Email: admin@camareros.app
Password: admin123
```

(O las credenciales de los 5 usuarios que importaste)

---

## 📞 Comandos Útiles

```bash
# Ver variables de producción
cat .env.production | grep VITE_SUPABASE

# Rebuild si cambias .env
pnpm build:prod

# Preview de producción
pnpm preview:prod

# Ver logs de Edge Functions (si las desplegaste)
supabase functions logs make-server-ce05fe95 --project-ref bvnbwqsvldsfdfzifcp
```

---

## ⚠️ Notas Importantes

1. **API Keys son opcionales para testing básico** - El login y CRUD funcionan sin ellas

2. **Edge Functions son opcionales inicialmente** - Puedes desplegarlas después cuando necesites funcionalidad de email

3. **Tabla confirmaciones** - Créala cuando vayas a usar la funcionalidad de confirmaciones por email

4. **Secrets en Supabase** - Solo necesarios si despliegas Edge Functions

5. **Para deploy real** - Considera configurar todo en Fase 2 antes de ir a producción con usuarios reales

---

## 🔐 Seguridad

**NUNCA commitees a Git:**
- ❌ API Keys reales
- ❌ Tokens de acceso
- ❌ Service Role Keys
- ❌ Archivos `.env*` con credenciales

**SÍ commitea:**
- ✅ `.env.example` (con placeholders)
- ✅ Scripts SQL de migración
- ✅ Código de Edge Functions
- ✅ Documentación
