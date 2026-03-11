# 📧 Configuración de Email con DonDominio y Resend

Guía paso a paso para configurar el sistema de email usando tu dominio de DonDominio.

---

## 🎯 Opción Recomendada: Resend

**Por qué Resend:**
- ✅ 100 emails gratis al día (3,000/mes)
- ✅ Configuración súper simple
- ✅ Excelente deliverability
- ✅ Dashboard intuitivo
- ✅ API moderna

---

## 📋 Paso 1: Crear cuenta en Resend

1. Ve a: **https://resend.com**
2. Click en **"Sign Up"**
3. Regístrate con tu email
4. Confirma tu email

---

## 🔑 Paso 2: Obtener API Key

1. Una vez dentro de Resend Dashboard
2. Ve a **"API Keys"** en el menú lateral
3. Click en **"Create API Key"**
4. Nombre: `Gestión de Servicios`
5. Permiso: **"Sending access"**
6. Click en **"Create"**
7. **COPIA LA CLAVE** (solo se muestra una vez)

```
Ejemplo: re_AbCdEfGh_1234567890abcdefghijklmnop
```

⚠️ **GUARDA ESTA CLAVE** - La necesitarás en el Paso 5

---

## 🌐 Paso 3: Verificar tu dominio en Resend

### En Resend Dashboard:

1. Ve a **"Domains"** en el menú lateral
2. Click en **"Add Domain"**
3. Ingresa tu dominio: `jcarrizo.com` (o el que uses)
4. Click en **"Add"**
5. Resend te mostrará los registros DNS que debes agregar

**Ejemplo de registros que verás:**

```
Tipo: TXT
Nombre: _resend
Valor: resend-domain-verify=abc123def456...

Tipo: CNAME
Nombre: resend._domainkey
Valor: resend._domainkey.resend.com

Tipo: CNAME  
Nombre: resend2._domainkey
Valor: resend2._domainkey.resend.com
```

**🚨 NO CIERRES ESTA VENTANA** - Necesitas estos datos para el siguiente paso

---

## 📝 Paso 4: Configurar DNS en DonDominio

### 4.1 Acceder a DonDominio

1. Ve a: **https://www.dondominio.com**
2. Inicia sesión
3. Ve a **"Mis Dominios"**
4. Click en tu dominio: `jcarrizo.com`
5. Ve a la pestaña **"DNS"** o **"Zona DNS"**

### 4.2 Agregar los registros DNS

Ahora vas a agregar los 3 registros que Resend te dio:

#### Registro 1: Verificación de dominio

```
Tipo: TXT
Nombre/Host: _resend
Valor: [el valor que te dio Resend]
TTL: 3600 (o automático)
```

**En DonDominio:**
- Click en **"Añadir registro"**
- Tipo: TXT
- Nombre: `_resend`
- Valor: Pega el valor completo de Resend
- Guardar

#### Registro 2: DKIM 1

```
Tipo: CNAME
Nombre/Host: resend._domainkey
Valor: resend._domainkey.resend.com
TTL: 3600
```

**En DonDominio:**
- Click en **"Añadir registro"**
- Tipo: CNAME
- Nombre: `resend._domainkey`
- Valor: `resend._domainkey.resend.com`
- Guardar

#### Registro 3: DKIM 2

```
Tipo: CNAME
Nombre/Host: resend2._domainkey
Valor: resend2._domainkey.resend.com
TTL: 3600
```

**En DonDominio:**
- Click en **"Añadir registro"**
- Tipo: CNAME
- Nombre: `resend2._domainkey`
- Valor: `resend2._domainkey.resend.com`
- Guardar

### 4.3 Guardar cambios

- Click en **"Guardar cambios"** o **"Aplicar"**
- Los DNS pueden tardar de 5 minutos a 48 horas en propagarse
- Normalmente es rápido (15-30 minutos)

---

## ✅ Paso 5: Verificar en Resend

1. Vuelve al Dashboard de Resend
2. Ve a **"Domains"**
3. Click en **"Verify"** o **"Check DNS"**
4. Si todo está bien, verás: ✅ **"Verified"**

⏰ **Si no verifica inmediatamente:**
- Espera 30 minutos
- Los DNS pueden tardar en propagarse
- Intenta de nuevo más tarde

---

## 🔧 Paso 6: Configurar en Supabase

Ahora vamos a configurar la API Key en tu Edge Function.

### 6.1 Ir a Supabase Dashboard

1. Ve a: https://supabase.com/dashboard/project/eubjevjqcpsvpgxmdpvy
2. En el menú lateral: **Edge Functions**
3. Click en tu función: **make-server-ce05fe95**
4. Ve a **"Settings"** o **"Secrets"**

### 6.2 Agregar la variable de entorno

```
Nombre: RESEND_API_KEY
Valor: [tu API key que copiaste en el Paso 2]
```

**Ejemplo:**
```
RESEND_API_KEY=re_AbCdEfGh_1234567890abcdefghijklmnop
```

### 6.3 Re-desplegar la función

Para que tome la nueva variable:

```bash
supabase functions deploy make-server-ce05fe95 --no-verify-jwt
```

O desde Supabase Dashboard, click en **"Deploy"**

---

## 🧪 Paso 7: Probar el sistema

### 7.1 Desde la aplicación

1. Inicia sesión como admin: `admin@ejemplo.com` / `admin123`
2. Ve al tab **"⚙️ Configuración"**
3. Busca la sección **"Estado de Email"**
4. Deberías ver: ✅ **Resend configurado correctamente**

### 7.2 Enviar email de prueba

1. En Configuración, busca **"Probar Email"**
2. Ingresa tu email
3. Click en **"Enviar Prueba"**
4. Revisa tu bandeja de entrada

### 7.3 Desde el tab Test API

1. Ve al tab **"🧪 Test API"**
2. Busca el botón **"Probar Email"**
3. Ingresa tu email
4. Enviar

---

## 📊 Resumen de Configuración

```
✅ Cuenta Resend creada
✅ API Key obtenida
✅ Dominio verificado en Resend
✅ DNS configurados en DonDominio:
   - TXT: _resend
   - CNAME: resend._domainkey
   - CNAME: resend2._domainkey
✅ Variable RESEND_API_KEY en Supabase
✅ Función re-desplegada
✅ Email de prueba enviado
```

---

## 🎨 Personalizar el remitente

Por defecto, los emails se enviarán desde:

```
De: no-reply@jcarrizo.com
```

Para cambiar el nombre del remitente, edita el servidor:

**Archivo:** `/supabase/functions/server/index.tsx`

Busca:
```typescript
from: 'Gestión de Servicios <no-reply@YOUR_DOMAIN>'
```

Cambia a:
```typescript
from: 'Tu Nombre <no-reply@jcarrizo.com>'
```

---

## 🐛 Troubleshooting

### Problema 1: DNS no verifica

**Solución:**
- Espera 30-60 minutos
- Verifica que copiaste exactamente los valores
- En DonDominio, asegúrate de NO poner punto final (`.`) en los nombres
- Ejemplo CORRECTO: `_resend`
- Ejemplo INCORRECTO: `_resend.`

### Problema 2: "RESEND_API_KEY no configurada"

**Solución:**
```bash
# Verificar que la variable existe
supabase secrets list

# Si no existe, agregarla
supabase secrets set RESEND_API_KEY=tu_clave_aqui

# Re-desplegar
supabase functions deploy make-server-ce05fe95 --no-verify-jwt
```

### Problema 3: Emails no llegan

**Verificar:**
1. ✅ Dominio verificado en Resend (verde)
2. ✅ API Key correcta
3. ✅ Función re-desplegada después de agregar la key
4. ✅ Revisar spam/correo no deseado
5. ✅ En Resend Dashboard → Logs, ver si el email se envió

### Problema 4: Error 400 o 401

**Solución:**
- Verifica que la API Key sea correcta
- Regenera la API Key en Resend si es necesario
- Actualiza la variable en Supabase
- Re-despliega la función

---

## 📈 Límites de Resend (Gratis)

```
✅ 100 emails/día
✅ 3,000 emails/mes
✅ 1 dominio verificado
✅ API completa
✅ Webhook events
✅ Email analytics
```

**Si necesitas más:**
- Plan Pro: $20/mes = 50,000 emails
- Plan Enterprise: Custom pricing

---

## 🔄 Alternativas

Si prefieres otro proveedor:

### SendGrid
- 100 emails/día gratis
- Configuración similar
- Más complejo que Resend

### Mailgun
- 5,000 emails/mes gratis (primer mes)
- Luego: 1,000 emails/mes
- Requiere tarjeta de crédito

**El sistema detecta automáticamente cuál está configurado.**

---

## ✅ Verificación Final

Ejecuta este checklist:

- [ ] Cuenta Resend creada
- [ ] API Key copiada y guardada
- [ ] Dominio agregado en Resend
- [ ] 3 registros DNS agregados en DonDominio
- [ ] DNS propagados (verificar en Resend)
- [ ] Dominio marcado como "Verified" en Resend
- [ ] Variable RESEND_API_KEY agregada en Supabase
- [ ] Edge Function re-desplegada
- [ ] Email de prueba enviado correctamente
- [ ] Email recibido en bandeja de entrada

---

## 📞 Próximos pasos

Una vez configurado el email:

1. **Probar envíos reales** desde el módulo "Envíos"
2. **Personalizar plantillas** de email si lo deseas
3. **Configurar WhatsApp** (siguiente paso)
4. **Usar el sistema** para enviar confirmaciones a camareros

---

## 🎉 ¡Listo!

Tu sistema de email está configurado y listo para usar.

**Emails desde tu propio dominio:**
- ✅ `no-reply@jcarrizo.com`
- ✅ 100% profesional
- ✅ Excelente deliverability
- ✅ Gratis hasta 100 emails/día

---

**Creado:** Marzo 2026  
**Dominio:** jcarrizo.com (configurar con tu dominio)  
**Proveedor:** Resend (recomendado)
