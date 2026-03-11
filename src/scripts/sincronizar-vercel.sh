#!/bin/bash

# Script de Sincronización Figma Make → Vercel
# Uso: ./sincronizar-vercel.sh /ruta/a/figma-make-descargado

set -e  # Salir si hay algún error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Sincronización Figma Make → Vercel     ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════╝${NC}"
echo ""

# Verificar que se pasó una ruta como argumento
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Debes proporcionar la ruta a los archivos de Figma Make${NC}"
    echo -e "${YELLOW}Uso: ./sincronizar-vercel.sh /ruta/a/figma-make-descargado${NC}"
    exit 1
fi

FIGMA_PATH="$1"

# Verificar que la ruta existe
if [ ! -d "$FIGMA_PATH" ]; then
    echo -e "${RED}❌ Error: La ruta $FIGMA_PATH no existe${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Ruta de Figma Make encontrada${NC}"

# Verificar que estamos en un repositorio Git
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Error: No estás en un repositorio Git${NC}"
    echo -e "${YELLOW}ℹ  Inicializa Git primero con: git init${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Repositorio Git encontrado${NC}"

# Crear backup
echo ""
echo -e "${YELLOW}⏳ Creando backup...${NC}"
BACKUP_BRANCH="backup-$(date +%Y%m%d-%H%M%S)"
git branch "$BACKUP_BRANCH"
echo -e "${GREEN}✓ Backup creado en rama: $BACKUP_BRANCH${NC}"

# Mostrar archivos que se van a copiar
echo ""
echo -e "${YELLOW}📋 Archivos a sincronizar:${NC}"
echo -e "${BLUE}   - components/admin.tsx${NC}"
echo -e "${BLUE}   - components/registros-qr-section.tsx${NC}"
echo -e "${BLUE}   - Y otros archivos actualizados...${NC}"

# Confirmar antes de proceder
echo ""
read -p "¿Deseas continuar con la sincronización? (s/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[SsYy]$ ]]; then
    echo -e "${YELLOW}⚠️  Sincronización cancelada${NC}"
    exit 0
fi

# Copiar archivos
echo ""
echo -e "${YELLOW}⏳ Copiando archivos desde Figma Make...${NC}"

# Lista de archivos/carpetas importantes a copiar
DIRS_TO_COPY=(
    "components"
    "supabase"
    "utils"
    "styles"
    "src"
)

FILES_TO_COPY=(
    "App.tsx"
    "package.json"
)

# Copiar directorios
for dir in "${DIRS_TO_COPY[@]}"; do
    if [ -d "$FIGMA_PATH/$dir" ]; then
        echo -e "${BLUE}   Copiando $dir/${NC}"
        cp -r "$FIGMA_PATH/$dir" .
    fi
done

# Copiar archivos individuales
for file in "${FILES_TO_COPY[@]}"; do
    if [ -f "$FIGMA_PATH/$file" ]; then
        echo -e "${BLUE}   Copiando $file${NC}"
        cp "$FIGMA_PATH/$file" .
    fi
done

echo -e "${GREEN}✓ Archivos copiados exitosamente${NC}"

# Verificar cambios
echo ""
echo -e "${YELLOW}⏳ Verificando cambios...${NC}"
git status --short

# Agregar archivos al staging
echo ""
echo -e "${YELLOW}⏳ Agregando archivos al staging...${NC}"
git add .
echo -e "${GREEN}✓ Archivos agregados${NC}"

# Crear commit
echo ""
echo -e "${YELLOW}⏳ Creando commit...${NC}"
COMMIT_MESSAGE="Actualización desde Figma Make: Admin con Coordinadores, Altas y Registros QR - $(date +%Y-%m-%d)"
git commit -m "$COMMIT_MESSAGE"
echo -e "${GREEN}✓ Commit creado${NC}"

# Obtener rama actual
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo ""
echo -e "${YELLOW}📌 Rama actual: $CURRENT_BRANCH${NC}"

# Preguntar si desea hacer push
echo ""
read -p "¿Deseas hacer push a origin/$CURRENT_BRANCH? (s/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[SsYy]$ ]]; then
    echo -e "${YELLOW}⏳ Haciendo push...${NC}"
    git push origin "$CURRENT_BRANCH"
    echo -e "${GREEN}✓ Push completado${NC}"
    
    echo ""
    echo -e "${GREEN}╔══════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║         ¡Sincronización Exitosa! ✓      ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}📝 Próximos pasos:${NC}"
    echo -e "${YELLOW}   1. Ve a https://vercel.com/dashboard${NC}"
    echo -e "${YELLOW}   2. Verifica que el deployment esté en progreso${NC}"
    echo -e "${YELLOW}   3. Espera 2-3 minutos a que termine${NC}"
    echo -e "${YELLOW}   4. Visita tu dominio y limpia la caché (Ctrl+Shift+R)${NC}"
    echo -e "${YELLOW}   5. Verifica que Admin muestre las 3 pestañas${NC}"
    echo ""
else
    echo -e "${YELLOW}⚠️  Push cancelado${NC}"
    echo -e "${BLUE}ℹ  Puedes hacer push manualmente más tarde con:${NC}"
    echo -e "${YELLOW}   git push origin $CURRENT_BRANCH${NC}"
fi

# Mostrar información del backup
echo ""
echo -e "${BLUE}💾 Backup guardado en rama: $BACKUP_BRANCH${NC}"
echo -e "${YELLOW}   Para restaurar en caso de problemas:${NC}"
echo -e "${YELLOW}   git checkout $BACKUP_BRANCH${NC}"

echo ""
echo -e "${GREEN}✨ Script completado${NC}"
