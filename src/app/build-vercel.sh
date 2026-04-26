#!/bin/bash

echo "🚀 Iniciando build para Vercel..."

# Ejecutar build de Vite
npm run build:vite

# Verificar que dist existe
if [ ! -d "dist" ]; then
  echo "❌ ERROR: El directorio dist no fue creado"
  exit 1
fi

# Verificar que index.html existe
if [ ! -f "dist/index.html" ]; then
  echo "❌ ERROR: dist/index.html no existe"
  exit 1
fi

echo "✅ Build completado exitosamente"
echo "📁 Contenido de dist/:"
ls -la dist/

exit 0
