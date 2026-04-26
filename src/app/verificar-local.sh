#!/bin/bash

echo "🔍 Verificando configuración local..."
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar archivos que NO deben existir
echo "❌ Verificando archivos conflictivos..."
if [ -d "public/_headers" ]; then
    echo -e "${RED}✗ PROBLEMA: Directorio /public/_headers existe (debe ser eliminado)${NC}"
    exit 1
else
    echo -e "${GREEN}✓ OK: /public/_headers no existe${NC}"
fi

if [ -f "public/404.html" ]; then
    echo -e "${YELLOW}⚠ ADVERTENCIA: /public/404.html existe (no es necesario para SPA)${NC}"
fi

# Verificar archivos que DEBEN existir
echo ""
echo "✅ Verificando archivos necesarios..."

files=(
    "index.html"
    "App.tsx"
    "src/main.tsx"
    "package.json"
    "vite.config.ts"
    "vercel.json"
    ".nvmrc"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file${NC}"
    else
        echo -e "${RED}✗ $file NO ENCONTRADO${NC}"
    fi
done

# Verificar node_modules
echo ""
echo "📦 Verificando dependencias..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ node_modules existe${NC}"
else
    echo -e "${YELLOW}⚠ node_modules NO existe. Ejecuta: npm install${NC}"
fi

# Verificar versión de Node
echo ""
echo "🔧 Verificando Node.js..."
NODE_VERSION=$(node -v)
echo "Node version: $NODE_VERSION"

if [[ $NODE_VERSION == v18* ]] || [[ $NODE_VERSION == v20* ]] || [[ $NODE_VERSION == v22* ]]; then
    echo -e "${GREEN}✓ Versión de Node compatible${NC}"
else
    echo -e "${YELLOW}⚠ Recomendado: Node 18.x o superior${NC}"
fi

# Verificar package.json version
echo ""
echo "📄 Verificando versión del proyecto..."
VERSION=$(grep '"version"' package.json | head -1 | awk -F: '{ print $2 }' | sed 's/[", ]//g')
echo "Versión actual: $VERSION"

# Verificar estructura de directorios
echo ""
echo "📁 Verificando estructura de directorios..."
dirs=(
    "src"
    "components"
    "styles"
    "public"
    "supabase/functions/server"
)

for dir in "${dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓ $dir/${NC}"
    else
        echo -e "${RED}✗ $dir/ NO ENCONTRADO${NC}"
    fi
done

# Resumen final
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ VERIFICACIÓN COMPLETA${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Para iniciar el servidor de desarrollo:"
echo "  npm run dev"
echo ""
echo "El navegador debería abrir automáticamente en:"
echo "  http://localhost:5173/"
echo ""
echo "Verifica en la consola del navegador (F12) que aparezca:"
echo "  🚀 App iniciando - Build v2.6.2"
echo ""
