#!/bin/bash

# 🔍 Pre-Deployment Check Script
# Verifica que todo esté listo antes de desplegar
# ================================================

set -e

echo "🔍 ====================================="
echo "🔍  PRE-DEPLOYMENT CHECK"
echo "🔍  Gestión de Servicios"
echo "🔍 ====================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0

# ============================================
# 1. Verificar Node.js
# ============================================
echo "1️⃣  Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}   ✅ Node.js instalado: $NODE_VERSION${NC}"
else
    echo -e "${RED}   ❌ Node.js NO instalado${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# ============================================
# 2. Verificar npm
# ============================================
echo "2️⃣  Verificando npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}   ✅ npm instalado: $NPM_VERSION${NC}"
else
    echo -e "${RED}   ❌ npm NO instalado${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# ============================================
# 3. Verificar Supabase CLI
# ============================================
echo "3️⃣  Verificando Supabase CLI..."
if command -v supabase &> /dev/null; then
    SUPABASE_VERSION=$(supabase --version 2>&1 | head -n 1)
    echo -e "${GREEN}   ✅ Supabase CLI instalado: $SUPABASE_VERSION${NC}"
else
    echo -e "${RED}   ❌ Supabase CLI NO instalado${NC}"
    echo -e "${YELLOW}   📝 Instalar: npm install -g supabase${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# ============================================
# 4. Verificar Vercel CLI
# ============================================
echo "4️⃣  Verificando Vercel CLI..."
if command -v vercel &> /dev/null; then
    VERCEL_VERSION=$(vercel --version)
    echo -e "${GREEN}   ✅ Vercel CLI instalado: $VERCEL_VERSION${NC}"
else
    echo -e "${RED}   ❌ Vercel CLI NO instalado${NC}"
    echo -e "${YELLOW}   📝 Instalar: npm install -g vercel${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# ============================================
# 5. Verificar archivos críticos
# ============================================
echo "5️⃣  Verificando archivos críticos..."

FILES=(
    "App.tsx"
    "package.json"
    "vercel.json"
    "supabase/functions/server/index.tsx"
    "components/login.tsx"
    "components/TestEdgeFunction.tsx"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}   ✅ $file${NC}"
    else
        echo -e "${RED}   ❌ $file NO encontrado${NC}"
        ERRORS=$((ERRORS + 1))
    fi
done
echo ""

# ============================================
# 6. Verificar archivo .env
# ============================================
echo "6️⃣  Verificando configuración de entorno..."
if [ -f ".env" ]; then
    echo -e "${GREEN}   ✅ .env existe${NC}"
    
    # Verificar que tenga las variables necesarias
    if grep -q "VITE_SUPABASE_URL" .env && grep -q "VITE_SUPABASE_ANON_KEY" .env; then
        echo -e "${GREEN}   ✅ Variables de entorno configuradas${NC}"
    else
        echo -e "${RED}   ❌ .env incompleto (falta VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY)${NC}"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${YELLOW}   ⚠️  .env NO existe${NC}"
    echo -e "${YELLOW}   📝 Copia .env.example a .env y configúralo${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# ============================================
# 7. Verificar vinculación con Supabase
# ============================================
echo "7️⃣  Verificando vinculación con Supabase..."
if [ -f ".supabase/config.toml" ]; then
    echo -e "${GREEN}   ✅ Proyecto vinculado con Supabase${NC}"
else
    echo -e "${YELLOW}   ⚠️  Proyecto NO vinculado${NC}"
    echo -e "${YELLOW}   📝 Ejecutar: supabase link --project-ref eubjevjqcpsvpgxmdpvy${NC}"
fi
echo ""

# ============================================
# 8. Verificar dependencias de Node
# ============================================
echo "8️⃣  Verificando dependencias de Node..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}   ✅ node_modules existe${NC}"
else
    echo -e "${YELLOW}   ⚠️  node_modules NO existe${NC}"
    echo -e "${YELLOW}   📝 Ejecutar: npm install${NC}"
fi
echo ""

# ============================================
# RESUMEN FINAL
# ============================================
echo "====================================="
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅  TODO LISTO PARA DESPLEGAR${NC}"
    echo "====================================="
    echo ""
    echo "Ejecuta el deployment con:"
    echo -e "${GREEN}  ./deploy.sh${NC}"
    echo ""
    exit 0
else
    echo -e "${RED}❌  ENCONTRADOS $ERRORS PROBLEMAS${NC}"
    echo "====================================="
    echo ""
    echo "Por favor, corrige los problemas antes de desplegar."
    echo ""
    exit 1
fi
