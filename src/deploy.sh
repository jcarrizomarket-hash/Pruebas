#!/bin/bash

# 🚀 Script Automatizado de Deployment
# Gestión de Servicios - Deploy a Vercel + Supabase
# ================================================

set -e  # Detener si hay errores

echo "🚀 ====================================="
echo "🚀  DEPLOYMENT AUTOMATIZADO"
echo "🚀  Gestión de Servicios"
echo "🚀 ====================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ============================================
# PASO 1: Verificar dependencias
# ============================================
echo -e "${BLUE}📋 Paso 1: Verificando dependencias...${NC}"

if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI no está instalado${NC}"
    echo "Instalar con: npm install -g supabase"
    exit 1
fi

if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI no está instalado${NC}"
    echo "Instalar con: npm install -g vercel"
    exit 1
fi

echo -e "${GREEN}✅ Todas las dependencias instaladas${NC}"
echo ""

# ============================================
# PASO 2: Verificar autenticación
# ============================================
echo -e "${BLUE}📋 Paso 2: Verificando autenticación...${NC}"

# Verificar login de Supabase
if ! supabase projects list &> /dev/null; then
    echo -e "${YELLOW}⚠️  No estás autenticado en Supabase${NC}"
    echo "Ejecutando: supabase login"
    supabase login
fi

echo -e "${GREEN}✅ Autenticación verificada${NC}"
echo ""

# ============================================
# PASO 3: Desplegar Edge Function a Supabase
# ============================================
echo -e "${BLUE}📋 Paso 3: Desplegando Edge Function a Supabase...${NC}"

# Verificar si el proyecto está vinculado
if [ ! -f ".supabase/config.toml" ]; then
    echo -e "${YELLOW}⚠️  Proyecto no vinculado. Vinculando...${NC}"
    supabase link --project-ref eubjevjqcpsvpgxmdpvy
fi

# Desplegar la función
echo "Desplegando make-server-ce05fe95..."
supabase functions deploy make-server-ce05fe95

echo -e "${GREEN}✅ Edge Function desplegada exitosamente${NC}"
echo ""

# ============================================
# PASO 4: Verificar variables de entorno
# ============================================
echo -e "${BLUE}📋 Paso 4: Verificando variables de entorno...${NC}"

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Archivo .env no encontrado${NC}"
    echo "Creando .env.example como referencia..."
    
    cat > .env.example << 'EOF'
VITE_SUPABASE_URL=https://eubjevjqcpsvpgxmdpvy.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anon_aqui
EOF
    
    echo -e "${RED}❌ Por favor, crea un archivo .env basado en .env.example${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Variables de entorno verificadas${NC}"
echo ""

# ============================================
# PASO 5: Build del proyecto
# ============================================
echo -e "${BLUE}📋 Paso 5: Construyendo proyecto...${NC}"

if [ -f "package.json" ]; then
    echo "Instalando dependencias..."
    npm install
    
    echo "Ejecutando build..."
    npm run build
    
    echo -e "${GREEN}✅ Build completado${NC}"
else
    echo -e "${YELLOW}⚠️  No se encontró package.json, saltando build...${NC}"
fi
echo ""

# ============================================
# PASO 6: Desplegar a Vercel
# ============================================
echo -e "${BLUE}📋 Paso 6: Desplegando a Vercel...${NC}"

# Preguntar si es producción o preview
read -p "¿Desplegar a PRODUCCIÓN? (s/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo "Desplegando a PRODUCCIÓN..."
    vercel --prod
else
    echo "Desplegando a PREVIEW..."
    vercel
fi

echo -e "${GREEN}✅ Deployment a Vercel completado${NC}"
echo ""

# ============================================
# PASO 7: Configurar variables en Vercel
# ============================================
echo -e "${BLUE}📋 Paso 7: Recordatorio de variables de entorno en Vercel${NC}"
echo ""
echo -e "${YELLOW}⚠️  Asegúrate de configurar estas variables en Vercel Dashboard:${NC}"
echo ""
echo "   VITE_SUPABASE_URL = https://eubjevjqcpsvpgxmdpvy.supabase.co"
echo "   VITE_SUPABASE_ANON_KEY = tu_clave_anon"
echo ""
echo "   👉 https://vercel.com/dashboard → Tu Proyecto → Settings → Environment Variables"
echo ""

# ============================================
# FINALIZACIÓN
# ============================================
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}✅  DEPLOYMENT COMPLETADO${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""
echo -e "${BLUE}📊 Resumen:${NC}"
echo "   ✅ Edge Function desplegada en Supabase"
echo "   ✅ Frontend desplegado en Vercel"
echo ""
echo -e "${BLUE}🔗 URLs:${NC}"
echo "   🌐 Producción: https://gestiondeservicios.jcarrizo.com"
echo "   🔧 Supabase: https://supabase.com/dashboard/project/eubjevjqcpsvpgxmdpvy"
echo "   ⚙️  Vercel: https://vercel.com/dashboard"
echo ""
echo -e "${YELLOW}📝 Próximos pasos:${NC}"
echo "   1. Verificar que el sitio carga correctamente"
echo "   2. Probar el botón 'Crear Usuario Admin'"
echo "   3. Iniciar sesión con: admin@ejemplo.com / admin123"
echo "   4. Verificar que el tab '🧪 Test API' funciona"
echo ""
echo -e "${GREEN}🎉 ¡Listo para usar!${NC}"