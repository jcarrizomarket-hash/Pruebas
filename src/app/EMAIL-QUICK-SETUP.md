# ⚡ Email Setup Rápido - 10 Minutos

Configuración express de email con DonDominio + Resend.

---

## 🚀 Setup en 7 pasos

### 1️⃣ Crear cuenta Resend (2 min)
```
https://resend.com → Sign Up → Confirmar email
```

### 2️⃣ Obtener API Key (1 min)
```
Dashboard → API Keys → Create API Key
Nombre: "Gestión Servicios"
Permisos: "Sending access"

📋 COPIAR LA CLAVE (ejemplo):
re_AbCdEfGh_1234567890abcdefghijklmnop
```

### 3️⃣ Agregar dominio en Resend (1 min)
```
Dashboard → Domains → Add Domain
Dominio: jcarrizo.com
```

### 4️⃣ Copiar registros DNS (30 seg)
Resend te dará 3 registros. **Déjalos abiertos.**

### 5️⃣ Configurar DNS en DonDominio (3 min)

**Ir a DonDominio:**
```
https://www.dondominio.com
→ Mis Dominios 
→ jcarrizo.com 
→ DNS/Zona DNS
```

**Agregar estos 3 registros:**

```
1. Registro TXT
   Nombre: _resend
   Valor: [copiar de Resend]
   
2. Registro CNAME
   Nombre: resend._domainkey
   Valor: resend._domainkey.resend.com
   
3. Registro CNAME
   Nombre: resend2._domainkey
   Valor: resend2._domainkey.resend.com
```

**Guardar cambios.**

### 6️⃣ Configurar en Supabase (2 min)

**Opción A: Desde Dashboard**
```
https://supabase.com/dashboard/project/eubjevjqcpsvpgxmdpvy
→ Edge Functions 
→ make-server-ce05fe95 
→ Settings/Secrets
→ Agregar:
   Nombre: RESEND_API_KEY
   Valor: [tu API key del paso 2]
→ Deploy
```

**Opción B: Desde terminal**
```bash
supabase secrets set RESEND_API_KEY=re_TuClaveAqui
supabase functions deploy make-server-ce05fe95 --no-verify-jwt
```

### 7️⃣ Probar (1 min)

**En tu app:**
```
Login → Admin → Tab "🧪 Test API" → Probar Email
```

**O visitar:**
```
https://gestiondeservicios.jcarrizo.com
→ Login: admin@ejemplo.com / admin123
→ Tab "⚙️ Configuración"
→ Sección "Estado de Email" → ✅ Verificar
```

---

## ✅ Checklist Rápido

```
[ ] Cuenta Resend creada
[ ] API Key copiada
[ ] Dominio agregado en Resend
[ ] DNS configurados en DonDominio (3 registros)
[ ] Esperar 15-30 min (propagación DNS)
[ ] Verificar dominio en Resend (botón "Verify")
[ ] RESEND_API_KEY en Supabase
[ ] Función re-desplegada
[ ] Email de prueba enviado
```

---

## 🎯 Registros DNS - Copiar y Pegar

**Para DonDominio, agregar exactamente así:**

```
┌──────────────────────────────────────────────────────┐
│ Registro 1: Verificación                             │
├──────────────────────────────────────────────────────┤
│ Tipo:   TXT                                          │
│ Nombre: _resend                                      │
│ Valor:  [copiar de Resend, ej: resend-domain-ver... │
│ TTL:    3600 (o auto)                                │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ Registro 2: DKIM Firma 1                             │
├──────────────────────────────────────────────────────┤
│ Tipo:   CNAME                                        │
│ Nombre: resend._domainkey                            │
│ Valor:  resend._domainkey.resend.com                 │
│ TTL:    3600                                         │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ Registro 3: DKIM Firma 2                             │
├──────────────────────────────────────────────────────┤
│ Tipo:   CNAME                                        │
│ Nombre: resend2._domainkey                           │
│ Valor:  resend2._domainkey.resend.com                │
│ TTL:    3600                                         │
└──────────────────────────────────────────────────────┘
```

---

## 🚨 Errores Comunes

### "Domain not verified"
- ⏰ Espera 30 minutos (propagación DNS)
- 🔍 Verifica los registros en DonDominio
- ❌ NO pongas punto final en los nombres

### "API Key invalid"
- 📋 Copia bien la clave completa
- 🔄 Genera nueva clave si es necesario
- ☁️ Verifica que esté en Supabase Secrets

### "Email no llega"
- ✅ Dominio verificado en Resend
- 📧 Revisa spam/correo no deseado
- 📊 Logs en Resend Dashboard

---

## 📧 Resultado Final

Tus emails se enviarán como:

```
De: Gestión de Servicios <no-reply@jcarrizo.com>
```

✅ Profesional
✅ Propio dominio
✅ Alta deliverability
✅ 100 emails/día gratis

---

## 🔗 Links Importantes

- **Resend Dashboard:** https://resend.com/dashboard
- **DonDominio:** https://www.dondominio.com
- **Supabase:** https://supabase.com/dashboard/project/eubjevjqcpsvpgxmdpvy
- **Tu App:** https://gestiondeservicios.jcarrizo.com

---

**Tiempo total:** ~10 minutos  
**Dificultad:** ⭐⭐☆☆☆  
**Gratis hasta:** 100 emails/día
