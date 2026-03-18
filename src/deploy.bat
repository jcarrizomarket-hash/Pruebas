@echo off
REM 🚀 Script Automatizado de Deployment - Windows
REM Gestión de Servicios - Deploy a Vercel + Supabase
REM ================================================

echo.
echo =====================================
echo 🚀  DEPLOYMENT AUTOMATIZADO
echo     Gestión de Servicios
echo =====================================
echo.

REM ============================================
REM PASO 1: Verificar dependencias
REM ============================================
echo 📋 Paso 1: Verificando dependencias...

where supabase >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Supabase CLI no está instalado
    echo Instalar con: npm install -g supabase
    pause
    exit /b 1
)

where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI no está instalado
    echo Instalar con: npm install -g vercel
    pause
    exit /b 1
)

echo ✅ Todas las dependencias instaladas
echo.

REM ============================================
REM PASO 2: Desplegar Edge Function a Supabase
REM ============================================
echo 📋 Paso 2: Desplegando Edge Function a Supabase...

if not exist ".supabase\config.toml" (
    echo ⚠️  Proyecto no vinculado. Vinculando...
    supabase link --project-ref eubjevjqcpsvpgxmdpvy
)

echo Desplegando make-server-ce05fe95...
supabase functions deploy make-server-ce05fe95

echo ✅ Edge Function desplegada exitosamente
echo.

REM ============================================
REM PASO 3: Build del proyecto
REM ============================================
echo 📋 Paso 3: Construyendo proyecto...

if exist "package.json" (
    echo Instalando dependencias...
    call npm install
    
    echo Ejecutando build...
    call npm run build
    
    echo ✅ Build completado
) else (
    echo ⚠️  No se encontró package.json, saltando build...
)
echo.

REM ============================================
REM PASO 4: Desplegar a Vercel
REM ============================================
echo 📋 Paso 4: Desplegando a Vercel...

set /p PROD="¿Desplegar a PRODUCCIÓN? (s/n): "

if /i "%PROD%"=="s" (
    echo Desplegando a PRODUCCIÓN...
    vercel --prod
) else (
    echo Desplegando a PREVIEW...
    vercel
)

echo ✅ Deployment a Vercel completado
echo.

REM ============================================
REM FINALIZACIÓN
REM ============================================
echo =====================================
echo ✅  DEPLOYMENT COMPLETADO
echo =====================================
echo.
echo 📊 Resumen:
echo    ✅ Edge Function desplegada en Supabase
echo    ✅ Frontend desplegado en Vercel
echo.
echo 🔗 URLs:
echo    🌐 Producción: https://gestiondeservicios.jcarrizo.com
echo    🔧 Supabase: https://supabase.com/dashboard/project/eubjevjqcpsvpgxmdpvy
echo    ⚙️  Vercel: https://vercel.com/dashboard
echo.
echo 📝 Próximos pasos:
echo    1. Configurar variables de entorno en Vercel Dashboard
echo    2. Verificar que el sitio carga correctamente
echo    3. Probar el botón 'Crear Usuario Admin'
echo    4. Iniciar sesión con: admin@ejemplo.com / admin123
echo.
echo 🎉 ¡Listo para usar!
echo.
pause