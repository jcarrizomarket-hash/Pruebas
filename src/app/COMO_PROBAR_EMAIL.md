# 📧 Cómo Probar el Sistema de Email - Guía Paso a Paso

## 🎯 Objetivo
Verificar que el sistema de email está funcionando correctamente enviando un email de prueba.

---

## 📝 Pasos Simples

### 1️⃣ Abre la Aplicación
- Accede a tu aplicación web de Gestión de Perfiles

### 2️⃣ Ve a Configuración
- En la barra superior, haz clic en la pestaña **"Configuración"**
- Verás un panel con varias sub-pestañas

### 3️⃣ Selecciona "Prueba de Email"
- Haz clic en la sub-pestaña **"Prueba de Email"** 
- (Es la que tiene un ícono de sobre 📧)

### 4️⃣ Rellena el Formulario

**Campo 1: Destinatario** ⭐ IMPORTANTE
```
Ingresa: barjupiterbcn@gmail.com
```
> ⚠️ Usa este email porque Resend está en modo sandbox

**Campo 2: Asunto**
```
Viene pre-rellenado: "Test de Email - Sistema de Gestión de Perfiles"
```
> Puedes dejarlo así o cambiarlo

**Campo 3: Mensaje**
```
Viene pre-rellenado con un mensaje de prueba
```
> Puedes personalizarlo o dejarlo como está

### 5️⃣ Enviar
- Haz clic en el botón azul grande: **"Enviar Email de Prueba"**
- Verás un spinner de carga que dice "Enviando email de prueba..."

### 6️⃣ Espera el Resultado

**Si es EXITOSO** ✅:
```
✅ Email enviado exitosamente usando Resend!

Revisa tu bandeja de entrada en: barjupiterbcn@gmail.com
```

**Si hay ERROR** ❌:
```
❌ Error al enviar: [mensaje de error]
```
> Si ves un error, revisa la sección de "Solución de Problemas" más abajo

### 7️⃣ Revisa tu Email
1. Abre tu cliente de correo (Gmail, Outlook, etc.)
2. Ve a la bandeja de entrada
3. Busca un email de: `onboarding@resend.dev`
4. **Si no lo ves**, revisa:
   - 📁 Carpeta de **Spam**
   - 📁 Carpeta de **Promociones** (en Gmail)
   - 📁 Carpeta de **Correo no deseado**

---

## ✉️ ¿Qué Email Recibirás?

El email incluirá:

```
┌─────────────────────────────────────────┐
│  ✅ PRUEBA DE EMAIL EXITOSA             │
├─────────────────────────────────────────┤
│                                         │
│  🎉 ¡Felicidades!                       │
│  Tu sistema de email está configurado  │
│  correctamente y funcionando.           │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Componente    │ Estado          │   │
│  │───────────────│─────────────────│   │
│  │ Servidor      │ ✅ Funcionando  │   │
│  │ Email         │ ✅ Conectado    │   │
│  │ HTML          │ ✅ Activo       │   │
│  │ Formato       │ ✅ Aplicado     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  📋 Cliente de Prueba: Empresa XYZ     │
│  📅 Fecha: [fecha actual]               │
│  📍 Lugar: Salón de Eventos Principal  │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎨 Panel de Estado

**ANTES de enviar**, verás un panel de estado:

### ✅ Si todo está bien:
```
┌───────────────────────────────────────────────┐
│ ✅ Servicio de Email Configurado              │
│                                               │
│ Email configurado correctamente con Resend    │
│                                               │
│ 🚀 Proveedor Activo: Resend                  │
│ 📧 Remitente: onboarding@resend.dev          │
│                                               │
│ ✓ Envío automático de emails activado        │
│ ✓ Partes con formato profesional             │
│ ✓ Copia opcional a coordinadores             │
└───────────────────────────────────────────────┘
```

### ⚠️ Si está en modo Sandbox:
```
┌───────────────────────────────────────────────┐
│ ⚠️ MODO SANDBOX ACTIVO                        │
│                                               │
│ Solo puedes enviar emails de prueba a        │
│ barjupiterbcn@gmail.com                       │
│                                               │
│ Para enviar a cualquier destinatario:         │
│ 1. Ve a resend.com/domains                   │
│ 2. Agrega tu dominio                          │
│ 3. Configura DNS                              │
│ 4. Cambia EMAIL_FROM                          │
└───────────────────────────────────────────────┘
```

---

## 🔧 Solución de Problemas

### ❌ "No recibo el email"

**Solución 1**: Revisa Spam
- El email viene de `onboarding@resend.dev`
- Es común que vaya a spam la primera vez

**Solución 2**: Espera 1-2 minutos
- A veces puede tardar un poco

**Solución 3**: Verifica el destinatario
- Asegúrate de haber escrito bien: `barjupiterbcn@gmail.com`

### ❌ "Error: You can only send testing emails to..."

**Causa**: Resend está en modo sandbox

**Solución**: 
```
Usa como destinatario: barjupiterbcn@gmail.com
```

### ❌ "Error: Domain is not verified"

**Causa**: El dominio del remitente no está verificado

**Solución**: 
- Ya está configurado con `onboarding@resend.dev` (dominio por defecto)
- El sistema lo corrige automáticamente
- No deberías ver este error

### ❌ "Error de conexión"

**Solución**:
1. Verifica tu conexión a internet
2. Recarga la página
3. Intenta de nuevo

---

## 🌟 Consejos Importantes

### ✅ DO (Hacer):
- Usa `barjupiterbcn@gmail.com` como destinatario
- Revisa la carpeta de Spam
- Espera 1-2 minutos si no llega inmediatamente
- Verifica el panel de estado antes de enviar

### ❌ DON'T (No Hacer):
- No uses otros emails (no funcionará en modo sandbox)
- No envíes múltiples pruebas muy rápido
- No te preocupes si va a Spam (es normal con `onboarding@resend.dev`)

---

## 📊 Verificar en el Panel de Resend

También puedes verificar que se envió en el panel de Resend:

1. Ve a: [https://resend.com/emails](https://resend.com/emails)
2. Inicia sesión con tu cuenta de Resend
3. Verás todos los emails enviados
4. Busca el email de prueba más reciente

---

## 🎉 ¡Listo para Producción!

Una vez que confirmes que el email llegó:

✅ **El sistema está 100% operativo**
✅ Los partes de servicio se enviarán automáticamente
✅ Las notificaciones funcionan
✅ Email + WhatsApp integrados

---

## 📞 Resumen Ultra-Rápido

```bash
1. Configuración → Prueba de Email
2. Destinatario: barjupiterbcn@gmail.com
3. Clic en "Enviar Email de Prueba"
4. Revisa tu bandeja (o spam)
5. ✅ ¡Funcionando!
```

---

## 🚀 Estado Actual del Sistema

```
✅ RESEND_API_KEY    → Configurada
✅ EMAIL_FROM        → onboarding@resend.dev
✅ Función wrapper   → Creada
✅ Endpoints         → Activos
✅ Componente UI     → Listo
✅ Modo              → Sandbox

TODO LISTO PARA PROBAR 🎉
```

---

**¿Tienes problemas?** Revisa los logs en la consola del navegador (F12) o contacta al equipo de soporte.
