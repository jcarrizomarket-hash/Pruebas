/**
 * Script de Verificación de Configuración de Ambientes
 * Prueba que las variables de entorno están correctamente configuradas
 */

import * as fs from 'fs';
import * as path from 'path';

console.log('🚀 TEST DE CONFIGURACIÓN DE AMBIENTES\n');
console.log('='.repeat(60));

// Determinar el ambiente
const mode = process.env.NODE_ENV || 'development';
console.log(`📍 Ambiente: ${mode}\n`);

// 1. Verificar archivos .env
console.log('📁 1. Verificando archivos .env...');
const envDevExists = fs.existsSync('.env.development');
const envProdExists = fs.existsSync('.env.production');

console.log(`   .env.development: ${envDevExists ? '✅ Existe' : '❌ No existe'}`);
console.log(`   .env.production:  ${envProdExists ? '✅ Existe' : '❌ No existe'}`);

if (!envDevExists && !envProdExists) {
  console.error('\n❌ ERROR: No se encontraron archivos .env');
  process.exit(1);
}

// 2. Cargar variables de entorno manualmente
console.log('\n📋 2. Cargando variables de entorno...');

// Leer el archivo .env correspondiente
const envFile = mode === 'production' ? '.env.production' : '.env.development';
const envPath = path.resolve(process.cwd(), envFile);

if (!fs.existsSync(envPath)) {
  console.error(`\n❌ ERROR: Archivo ${envFile} no encontrado`);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envVars: Record<string, string> = {};

envContent.split('\n').forEach(line => {
  line = line.trim();
  if (line && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=').trim();
    if (key && value) {
      envVars[key.trim()] = value;
      process.env[key.trim()] = value;
    }
  }
});

console.log(`   ✅ Variables cargadas desde: ${envFile}`);

// 3. Verificar variables críticas
console.log('\n🔑 3. Verificando variables críticas...');

const requiredVars = [
  'VITE_SUPABASE_PROJECT_ID',
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY'
];

let allVarsPresent = true;
requiredVars.forEach(varName => {
  const value = process.env[varName];
  const isPresent = value && value !== 'your-dev-anon-key-here' && value !== 'your-prod-anon-key-here';

  if (isPresent) {
    const maskedValue = value!.substring(0, 30) + '...';
    console.log(`   ✅ ${varName}: ${maskedValue}`);
  } else {
    console.log(`   ❌ ${varName}: NO CONFIGURADA`);
    allVarsPresent = false;
  }
});

if (!allVarsPresent) {
  console.error('\n❌ ERROR: Faltan variables de entorno críticas');
  console.log('\n💡 Edita el archivo .env.development con tus credenciales reales');
  process.exit(1);
}

// 4. Verificar configuración del proyecto
console.log('\n⚙️  4. Verificando configuración del proyecto...');

const packageJsonPath = path.resolve(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  console.log(`   ✅ Proyecto: ${packageJson.name}`);
  console.log(`   ✅ Versión: ${packageJson.version}`);

  const hasDevScript = packageJson.scripts?.dev;
  const hasBuildScript = packageJson.scripts?.build;
  console.log(`   ${hasDevScript ? '✅' : '❌'} Script "dev": ${hasDevScript || 'No configurado'}`);
  console.log(`   ${hasBuildScript ? '✅' : '❌'} Script "build": ${hasBuildScript || 'No configurado'}`);
}

// 5. Verificar estructura del proyecto
console.log('\n📂 5. Verificando estructura del proyecto...');

const criticalPaths = [
  'src/app/App.tsx',
  'src/app/supabase/functions/server/index.tsx',
  'src/app/supabase/functions/server/db-helpers.ts',
  'src/app/supabase/migrations/00_schema_completo.sql'
];

criticalPaths.forEach(filePath => {
  const exists = fs.existsSync(filePath);
  const fileName = path.basename(filePath);
  console.log(`   ${exists ? '✅' : '❌'} ${fileName}`);
});

console.log('\n' + '='.repeat(60));
console.log('✅ VERIFICACIÓN DE CONFIGURACIÓN COMPLETADA');
console.log('='.repeat(60));
console.log('\n🎉 Archivos .env configurados correctamente!');
console.log('\n📝 Próximos pasos:');
console.log('   1. pnpm dev          → Iniciar servidor de desarrollo');
console.log('   2. Abrir navegador   → Probar la aplicación');
console.log('   3. Verificar login   → Comprobar conexión con Supabase');
console.log('\n💡 Para probar la conexión con Supabase, ejecuta: pnpm dev');
console.log('');
