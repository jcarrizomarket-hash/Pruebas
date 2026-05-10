# 🚀 Deploy en Vercel - Dos Dominios (Dev y Prod)

Configuración para tener dos URLs diferentes usando un solo proyecto en Vercel.

---

## 🎯 Resultado Final

```
Producción:  tudominio.com           → Supabase: bvnbwqsvldsfdgfzifcp
Desarrollo:  dev.tudominio.com       → Supabase: eubjevjqcpsvpgxmdpvy
```

---

## 📋 Pasos de Configuración

### 1. Subir Código a GitHub

```bash
# Inicializar Git (si no lo has hecho)
git init
git add .
git commit -m "feat: configuración inicial con ambientes dev y prod"

# Crear repositorio en GitHub y conectar
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main

# Crear branch de desarrollo
git checkout -b development
git push -u origin development
```

### 2. Crear Proyecto en Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. **Import Git Repository** → Selecciona tu repo
3. Configuración inicial:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `pnpm run build:prod`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`
4. Click **Deploy**

### 3. Configurar Variables de Entorno

En Vercel: **Settings → Environment Variables**

#### Para Production

**Variable:**
```
VITE_VERCEL_ENV
```

**Value:**
```
production
```

**Environment:** ✅ Production

---

#### Para Development/Preview

**Variable:**
```
VITE_VERCEL_ENV
```

**Value:**
```
development
```

**Environment:** ✅ Preview

---

### 4. Configurar Production Branch

**Settings → Git → Production Branch**

- **Production Branch**: `main`

Esto significa:
- Commits a `main` → Deploy a producción
- Commits a `development` u otros → Preview deployments

### 5. Configurar Dominios

#### Dominio de Producción

**Settings → Domains**

1. Click **Add Domain**
2. Ingresa: `tudominio.com`
3. Configura DNS según instrucciones de Vercel
4. Este dominio se asignará automáticamente a la **Production** (branch `main`)

#### Dominio de Desarrollo

1. Click **Add Domain**
2. Ingresa: `dev.tudominio.com`
3. Configura DNS (CNAME)
4. **Assign to a Git Branch**: Selecciona `development`

---

## 🔧 Configurar Build Commands por Branch

Para que cada branch use su build correcto, actualiza `vercel.json`:

```json
{
  "buildCommand": "pnpm run build:prod",
  "github": {
    "silent": true
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Nota:** Para el branch `development`, Vercel usa las env vars de Preview, que tienen `VITE_VERCEL_ENV=development`, por lo que el código automáticamente detectará el ambiente correcto.

---

## 📦 Flujo de Trabajo

### Desarrollo

```bash
# 1. Trabaja en branch development
git checkout development

# 2. Haz cambios
git add .
git commit -m "feat: nueva funcionalidad"

# 3. Push
git push origin development

# 4. Vercel despliega automáticamente a:
#    https://dev.tudominio.com
#    (usa eubjevjqcpsvpgxmdpvy)
```

### Producción

```bash
# 1. Merge development a main
git checkout main
git merge development

# 2. Push
git push origin main

# 3. Vercel despliega automáticamente a:
#    https://tudominio.com
#    (usa bvnbwqsvldsfdgfzifcp)
```

---

## 🔍 Verificar Deploy

### En Development (dev.tudominio.com)

1. Abre: `https://dev.tudominio.com`
2. Abre DevTools Console
3. Verifica:
```
🔧 Supabase Config: {
  environment: "development",
  projectId: "eubjevjqcpsvpgxmdpvy",
  ...
}
```

### En Production (tudominio.com)

1. Abre: `https://tudominio.com`
2. Abre DevTools Console
3. Verifica:
```
🔧 Supabase Config: {
  environment: "production",
  projectId: "bvnbwqsvldsfdgfzifcp",
  ...
}
```

---

## 🎨 Estructura de Branches

```
main (producción)
├── Dominio: tudominio.com
├── Supabase: bvnbwqsvldsfdgfzifcp
└── Build: pnpm run build:prod

development (staging)
├── Dominio: dev.tudominio.com
├── Supabase: eubjevjqcpsvpgxmdpvy
└── Build: pnpm run build:dev (via VITE_VERCEL_ENV)

feature/* (features)
└── URLs preview: [proyecto]-[hash]-[team].vercel.app
```

---

## ⚡ Preview Deployments

Cada PR automáticamente crea una preview URL:
```
https://tu-proyecto-git-feature-nombre-team.vercel.app
```

Estas usan las variables de **Preview** (development).

---

## 🐛 Troubleshooting

### Problema: Development usa producción

**Solución:**
1. Verifica env vars en Settings → Environment Variables
2. `VITE_VERCEL_ENV=development` debe tener scope **Preview**
3. Redeploy el branch development

### Problema: No puedo agregar dominio

**Solución:**
1. Verifica que el dominio esté configurado en tu DNS provider
2. Espera propagación DNS (puede tardar hasta 48hrs)
3. Usa el DNS checker de Vercel

### Problema: Build falla

**Solución:**
1. Verifica logs en Vercel
2. Prueba build local: `pnpm run build:prod`
3. Verifica que todas las dependencias estén en package.json

---

## 📊 Resumen Visual

```
GitHub Repository
├── main branch
│   └── Push → Vercel Deploy → tudominio.com (PROD)
│
└── development branch
    └── Push → Vercel Deploy → dev.tudominio.com (DEV)
```

**Un proyecto Vercel, dos dominios, dos ambientes.**

---

## ✅ Checklist

- [ ] Código subido a GitHub
- [ ] Branches main y development creados
- [ ] Proyecto creado en Vercel
- [ ] Variables de entorno configuradas
- [ ] Production branch = main
- [ ] Dominio producción agregado (tudominio.com)
- [ ] Dominio desarrollo agregado (dev.tudominio.com)
- [ ] Dominio desarrollo asignado a branch development
- [ ] Test deploy en ambos dominios
- [ ] Verificar console logs en ambos

---

## 🎉 ¡Listo!

Ahora tienes dos URLs funcionando:
- **tudominio.com** → Producción (bvnbwqsvldsfdgfzifcp)
- **dev.tudominio.com** → Desarrollo (eubjevjqcpsvpgxmdpvy)

Todo automático con cada push. 🚀
