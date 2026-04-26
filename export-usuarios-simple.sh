#!/bin/bash
echo "🔍 Exportando usuarios desde Supabase desarrollo..."
echo ""

# Usar curl para hacer la petición a Supabase
SUPABASE_URL="https://eubjevjqcpsvpgxmdpvy.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1YmpldmpxY3BzdnBneG1kcHZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNzM4MjAsImV4cCI6MjA4ODc0OTgyMH0.bSriqpdHFIxoLqcyk7PJD_CsRh3F7naMjWrPk4BOLaQ"

# Exportar usuarios
curl -s "${SUPABASE_URL}/rest/v1/usuarios?select=*&order=created_at.asc" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  > usuarios_export.json

# Verificar si se exportó correctamente
if [ -s usuarios_export.json ]; then
  echo "✅ Usuarios exportados a: usuarios_export.json"
  echo ""
  
  # Mostrar resumen
  COUNT=$(cat usuarios_export.json | grep -o '"id"' | wc -l)
  echo "📊 Total de usuarios: $COUNT"
  echo ""
  
  # Mostrar usuarios
  echo "📋 Usuarios encontrados:"
  cat usuarios_export.json | jq -r '.[] | "   • \(.nombre) (\(.email)) - Rol: \(.rol)"' 2>/dev/null || echo "   (Instala 'jq' para ver el detalle)"
else
  echo "❌ Error al exportar usuarios"
  exit 1
fi
