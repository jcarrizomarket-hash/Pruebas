@echo off
chcp 65001 >nul
echo 🔍 Verificando configuración local...
echo.

REM Verificar archivos que NO deben existir
echo ❌ Verificando archivos conflictivos...
if exist "public\_headers" (
    echo ✗ PROBLEMA: Directorio public\_headers existe ^(debe ser eliminado^)
    exit /b 1
) else (
    echo ✓ OK: public\_headers no existe
)

if exist "public\404.html" (
    echo ⚠ ADVERTENCIA: public\404.html existe ^(no es necesario para SPA^)
)

REM Verificar archivos que DEBEN existir
echo.
echo ✅ Verificando archivos necesarios...

if exist "index.html" (echo ✓ index.html) else (echo ✗ index.html NO ENCONTRADO)
if exist "App.tsx" (echo ✓ App.tsx) else (echo ✗ App.tsx NO ENCONTRADO)
if exist "src\main.tsx" (echo ✓ src\main.tsx) else (echo ✗ src\main.tsx NO ENCONTRADO)
if exist "package.json" (echo ✓ package.json) else (echo ✗ package.json NO ENCONTRADO)
if exist "vite.config.ts" (echo ✓ vite.config.ts) else (echo ✗ vite.config.ts NO ENCONTRADO)
if exist "vercel.json" (echo ✓ vercel.json) else (echo ✗ vercel.json NO ENCONTRADO)
if exist ".nvmrc" (echo ✓ .nvmrc) else (echo ⚠ .nvmrc no encontrado)

REM Verificar node_modules
echo.
echo 📦 Verificando dependencias...
if exist "node_modules" (
    echo ✓ node_modules existe
) else (
    echo ⚠ node_modules NO existe. Ejecuta: npm install
)

REM Verificar versión de Node
echo.
echo 🔧 Verificando Node.js...
node -v
echo.

REM Verificar estructura de directorios
echo 📁 Verificando estructura de directorios...
if exist "src" (echo ✓ src\) else (echo ✗ src\ NO ENCONTRADO)
if exist "components" (echo ✓ components\) else (echo ✗ components\ NO ENCONTRADO)
if exist "styles" (echo ✓ styles\) else (echo ✗ styles\ NO ENCONTRADO)
if exist "public" (echo ✓ public\) else (echo ✗ public\ NO ENCONTRADO)
if exist "supabase\functions\server" (echo ✓ supabase\functions\server\) else (echo ✗ supabase\functions\server\ NO ENCONTRADO)

REM Resumen final
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ✅ VERIFICACIÓN COMPLETA
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo Para iniciar el servidor de desarrollo:
echo   npm run dev
echo.
echo El navegador debería abrir automáticamente en:
echo   http://localhost:5173/
echo.
echo Verifica en la consola del navegador ^(F12^) que aparezca:
echo   🚀 App iniciando - Build v2.6.2
echo.
pause
