#!/bin/bash

# Script de prueba manual del endpoint de alertas
# Ejecuta: bash test-cron-manual.sh

echo "🔔 ================================================"
echo "   PRUEBA MANUAL DEL SISTEMA DE ALERTAS"
echo "================================================"
echo ""

ENDPOINT="https://nkwqaekswfwfpukqfzpk.supabase.co/functions/v1/make-server-ce05fe95/verificar-alertas-servicios"
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rd3FhZWtzd2Z3ZnB1a3FmenBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzU1NTMsImV4cCI6MjA0ODgxMTU1M30.wvHFcIVEvUiWRKiVRWQPpUDpO-d03PKa1O7iDuJWD6w"

echo "📍 Endpoint: $ENDPOINT"
echo "🔑 Token: ${TOKEN:0:20}...${TOKEN: -20}"
echo ""
echo "⏳ Enviando petición..."
echo ""

# Hacer la petición y guardar respuesta
RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X GET \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "$ENDPOINT")

# Separar código de estado y body
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

echo "================================================"
echo "📊 RESULTADO"
echo "================================================"
echo ""
echo "Código HTTP: $HTTP_CODE"
echo ""

if [ "$HTTP_CODE" -eq 200 ]; then
    echo "✅ ÉXITO - Petición exitosa"
    echo ""
    echo "📋 Respuesta del servidor:"
    echo ""
    
    # Intentar formatear JSON si está disponible jq
    if command -v jq &> /dev/null; then
        echo "$BODY" | jq '.'
    else
        echo "$BODY"
        echo ""
        echo "💡 Tip: Instala 'jq' para ver JSON formateado:"
        echo "   - Ubuntu/Debian: sudo apt install jq"
        echo "   - macOS: brew install jq"
        echo "   - Windows: choco install jq"
    fi
    
    echo ""
    echo "================================================"
    
    # Extraer información clave si es posible
    if command -v jq &> /dev/null; then
        ALERTAS=$(echo "$BODY" | jq -r '.alertasEnviadas // 0')
        SERVICIOS=$(echo "$BODY" | jq -r '.serviciosProcesados // 0')
        MENSAJE=$(echo "$BODY" | jq -r '.message // "N/A"')
        
        echo "📈 RESUMEN"
        echo "================================================"
        echo ""
        echo "Mensaje: $MENSAJE"
        echo "Alertas enviadas: $ALERTAS"
        echo "Servicios procesados: $SERVICIOS"
        echo ""
        
        if [ "$ALERTAS" -gt 0 ]; then
            echo "🎉 ¡Se enviaron $ALERTAS alertas!"
            echo ""
            echo "📱 Verifica:"
            echo "   • WhatsApp de los perfiles"
            echo "   • Emails de los perfiles"
            echo "   • Logs en la interfaz de Configuración"
        else
            echo "📭 No se encontraron servicios próximos en las siguientes 3 horas"
            echo ""
            echo "Para probar:"
            echo "   1. Crea un pedido con fecha HOY"
            echo "   2. Hora de entrada: hora actual + 3 horas"
            echo "   3. Asigna un perfil"
            echo "   4. Marca la asignación como 'confirmado'"
            echo "   5. Ejecuta este script nuevamente"
        fi
    fi
    
    echo ""
    echo "================================================"
    echo "✅ Prueba completada exitosamente"
    echo "================================================"
    
elif [ "$HTTP_CODE" -eq 401 ]; then
    echo "❌ ERROR 401 - No autorizado"
    echo ""
    echo "$BODY"
    echo ""
    echo "Posibles causas:"
    echo "  • Token incorrecto o expirado"
    echo "  • Problema con el header Authorization"
    echo ""
    echo "Solución:"
    echo "  Verifica el token en utils/supabase/info.tsx"
    
elif [ "$HTTP_CODE" -eq 404 ]; then
    echo "❌ ERROR 404 - Endpoint no encontrado"
    echo ""
    echo "$BODY"
    echo ""
    echo "Posibles causas:"
    echo "  • El endpoint aún no está desplegado"
    echo "  • URL incorrecta"
    echo ""
    echo "Solución:"
    echo "  Espera 1-2 minutos y vuelve a intentar"
    
elif [ "$HTTP_CODE" -eq 500 ]; then
    echo "❌ ERROR 500 - Error del servidor"
    echo ""
    echo "$BODY"
    echo ""
    echo "Posibles causas:"
    echo "  • Error en el código del servidor"
    echo "  • Problema con la base de datos"
    echo ""
    echo "Solución:"
    echo "  Revisa los logs del servidor en Supabase"
    
else
    echo "⚠️ Código HTTP inesperado: $HTTP_CODE"
    echo ""
    echo "Respuesta completa:"
    echo "$BODY"
fi

echo ""
echo "================================================"
echo "🕐 Fecha y hora: $(date '+%Y-%m-%d %H:%M:%S')"
echo "================================================"
echo ""

# Guardar log en archivo
LOG_FILE="alertas-test.log"
{
    echo "================================================"
    echo "TEST: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "================================================"
    echo "HTTP Code: $HTTP_CODE"
    echo ""
    echo "Response:"
    echo "$BODY"
    echo ""
} >> "$LOG_FILE"

echo "💾 Log guardado en: $LOG_FILE"
echo ""
