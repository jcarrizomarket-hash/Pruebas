# Workflow de Desarrollo con Branches

## 🌳 Estructura de Branches

Tu proyecto ahora está configurado con **2 branches**:

```
develop (desarrollo)  → Proyecto Supabase: eubjevjqcpsvpgxmdpvy
  ↓
  | Cuando esté listo para producción
  ↓
main (producción)     → Proyecto Supabase: [nuevo proyecto]
```

## 📍 Branch Actual: `develop`

Estás actualmente en el branch de **desarrollo**.

---

## 🔄 Flujo de Trabajo

### 1️⃣ **Trabajar en Desarrollo** (Branch: `develop`)

```bash
# Verificar que estás en develop
git branch

# Hacer cambios en tu código
# Editar archivos, crear features, etc.

# Guardar cambios
git add .
git commit -m "Descripción de los cambios"
```

**Este branch usa:**
- Proyecto Supabase: `eubjevjqcpsvpgxmdpvy` (actual)
- Variables: `.env.development`
- Base de datos: La que ya tienes con datos de prueba

### 2️⃣ **Probar en Desarrollo**

```bash
# Ejecutar en modo desarrollo
npm run dev

# Build de desarrollo
npm run build:dev
```

### 3️⃣ **Pasar a Producción** (Branch: `main`)

Cuando tus cambios estén listos y probados:

```bash
# Cambiar al branch de producción
git checkout main

# Traer los cambios desde develop
git merge develop

# Ahora main tiene todos los cambios de develop
```

### 4️⃣ **Configurar Producción**

**Antes del primer deploy a producción**, necesitas configurar las credenciales:

```bash
# Asegúrate de estar en branch main
git checkout main

# Editar .env.production con credenciales del NUEVO proyecto
# (Completa con las credenciales que obtuviste al crear el nuevo proyecto)
```

**Variables a completar en `.env.production`:**
```bash
VITE_SUPABASE_PROJECT_ID=tu-nuevo-project-id
VITE_SUPABASE_URL=https://tu-nuevo-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=tu-nueva-anon-key
SUPABASE_ANON_KEY=tu-nueva-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-nueva-service-role-key
```

### 5️⃣ **Deploy a Producción**

```bash
# Build para producción
npm run build:prod

# Preview del build de producción (opcional)
npm run preview:prod
```

---

## 📊 Comparación de Ambientes

| Característica | **develop** | **main** |
|----------------|-------------|----------|
| **Propósito** | Desarrollo y pruebas | Producción (usuarios reales) |
| **Supabase Project** | `eubjevjqcpsvpgxmdpvy` | Nuevo proyecto (producción) |
| **Datos** | Datos de prueba | Datos reales de producción |
| **Variables** | `.env.development` | `.env.production` |
| **Build Command** | `npm run build:dev` | `npm run build:prod` |

---

## 🚨 IMPORTANTE: Variables de Entorno por Branch

### Los archivos .env NO se suben a Git

Los archivos `.env.development` y `.env.production` están en `.gitignore`, lo que significa:

✅ **Bueno:** Tus credenciales están seguras  
⚠️ **Importante:** Cada branch necesita sus propias variables configuradas

### ¿Cómo funciona?

Cuando cambias de branch, los archivos `.env` **NO cambian automáticamente** porque están ignorados por Git.

**Solución recomendada:**

1. **Crea archivos de plantilla versionados:**
   ```bash
   .env.development.template  → Sí se versiona (sin credenciales reales)
   .env.production.template   → Sí se versiona (sin credenciales reales)
   ```

2. **Mantén los archivos reales locales:**
   ```bash
   .env.development  → NO se versiona (credenciales reales)
   .env.production   → NO se versiona (credenciales reales)
   ```

3. **Documenta las credenciales por separado** (gestor de contraseñas, 1Password, etc.)

---

## 🔧 Comandos Útiles

### Ver en qué branch estás
```bash
git branch
# El branch activo tiene un asterisco (*)
```

### Cambiar de branch
```bash
# A desarrollo
git checkout develop

# A producción
git checkout main
```

### Ver diferencias entre branches
```bash
# Ver qué hay en develop que no está en main
git log main..develop
```

### Ver estado de ambos branches
```bash
git log --oneline --graph --all
```

---

## 📋 Checklist: Antes del Primer Deploy a Producción

### En Branch `main`:

- [ ] Obtener credenciales del nuevo proyecto Supabase
- [ ] Completar `.env.production` con las credenciales reales
- [ ] Verificar que las 10 tablas están creadas en el proyecto de producción
- [ ] (Opcional) Importar datos iniciales a producción
- [ ] Probar build de producción: `npm run build:prod`
- [ ] Configurar plataforma de deploy (Vercel/Netlify/etc) con variables de producción

### En Branch `develop`:

- [ ] Completar `.env.development` con credenciales actuales ✅ (Ya hecho)
- [ ] Verificar que funciona: `npm run dev`
- [ ] Hacer commits de cualquier cambio pendiente

---

## 🎯 Ejemplo de Workflow Completo

### Escenario: Agregar nueva funcionalidad

```bash
# 1. Asegurarte de estar en develop
git checkout develop

# 2. Crear feature
# [editar archivos, agregar nueva funcionalidad]

# 3. Probar localmente
npm run dev

# 4. Guardar cambios
git add .
git commit -m "feat: nueva funcionalidad de reportes"

# 5. Cuando esté lista para producción
git checkout main
git merge develop

# 6. Build y deploy de producción
npm run build:prod
# [deploy a plataforma de hosting]
```

---

## ❓ Preguntas Frecuentes

### ¿Puedo trabajar directamente en `main`?
**No recomendado.** Siempre trabaja en `develop` y solo usa `main` para desplegar a producción.

### ¿Qué pasa si me equivoco de branch?
Puedes mover cambios con `git stash`:
```bash
git stash          # Guarda cambios temporalmente
git checkout develop  # Cambia al branch correcto
git stash pop      # Recupera los cambios
```

### ¿Cómo revierto cambios en producción?
```bash
git checkout main
git revert HEAD    # Revierte el último commit
# O
git reset --hard HEAD~1  # ⚠️ Peligroso: borra el último commit
```

### ¿Necesito dos proyectos de Figma Make?
**No.** Un solo proyecto de Figma Make puede manejar múltiples branches. El deployment se maneja por branch según tu plataforma de hosting.

---

## 📞 Próximos Pasos

1. ✅ Branches configurados (develop y main)
2. ⏳ Completar `.env.production` con credenciales del nuevo proyecto
3. ⏳ Configurar plataforma de deploy
4. ⏳ Primer deploy a producción

**Estado actual:** Trabajando en branch `develop` 🟢
