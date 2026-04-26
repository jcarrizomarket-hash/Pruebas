/**
 * Script para exportar usuarios de desarrollo a producción
 */

import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import * as fs from 'fs';

// Credenciales de DESARROLLO (de donde exportaremos)
const SUPABASE_URL_DEV = 'https://eubjevjqcpsvpgxmdpvy.supabase.co';
const SUPABASE_KEY_DEV = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1YmpldmpxY3BzdnBneG1kcHZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNzM4MjAsImV4cCI6MjA4ODc0OTgyMH0.bSriqpdHFIxoLqcyk7PJD_CsRh3F7naMjWrPk4BOLaQ';

const supabaseDev = createClient(SUPABASE_URL_DEV, SUPABASE_KEY_DEV);

async function exportarUsuarios() {
  console.log('🔍 Exportando usuarios desde desarrollo...\n');

  try {
    // Obtener todos los usuarios de desarrollo
    const { data: usuarios, error } = await supabaseDev
      .from('usuarios')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('❌ Error al obtener usuarios:', error.message);
      process.exit(1);
    }

    if (!usuarios || usuarios.length === 0) {
      console.log('⚠️  No hay usuarios en la base de datos de desarrollo');
      process.exit(0);
    }

    console.log(`✅ Se encontraron ${usuarios.length} usuarios\n`);

    // Mostrar usuarios encontrados
    console.log('📋 Usuarios a exportar:');
    usuarios.forEach(u => {
      console.log(`   • ${u.nombre} (${u.email}) - Rol: ${u.rol}`);
    });
    console.log('');

    // Generar script SQL para importar
    let sqlScript = `-- ============================================
-- IMPORTACIÓN DE USUARIOS A PRODUCCIÓN
-- Fecha: ${new Date().toISOString()}
-- Total usuarios: ${usuarios.length}
-- ============================================

-- IMPORTANTE: Ejecutar este script en el SQL Editor de Supabase PRODUCCIÓN
-- Proyecto: bvnbwqsvldsfdfzifcp

`;

    // Generar INSERTs
    sqlScript += `-- Insertar usuarios\n`;
    sqlScript += `INSERT INTO usuarios (id, nombre, email, password_hash, rol, camarero_codigo, created_at, updated_at)\nVALUES\n`;

    const valores = usuarios.map((u, index) => {
      const isLast = index === usuarios.length - 1;

      // Escapar comillas simples en strings
      const nombre = u.nombre?.replace(/'/g, "''") || '';
      const email = u.email?.replace(/'/g, "''") || '';
      const passwordHash = u.password_hash?.replace(/'/g, "''") || '';
      const rol = u.rol?.replace(/'/g, "''") || '';
      const camareroCodigo = u.camarero_codigo ? `'${u.camarero_codigo.replace(/'/g, "''")}'` : 'NULL';
      const createdAt = u.created_at || new Date().toISOString();
      const updatedAt = u.updated_at || new Date().toISOString();

      return `  ('${u.id}', '${nombre}', '${email}', '${passwordHash}', '${rol}', ${camareroCodigo}, '${createdAt}', '${updatedAt}')${isLast ? ';' : ','}`;
    });

    sqlScript += valores.join('\n');
    sqlScript += `\n\n-- Verificar inserción\nSELECT COUNT(*) as total_usuarios FROM usuarios;\n`;
    sqlScript += `\n-- Ver usuarios insertados\nSELECT id, nombre, email, rol FROM usuarios ORDER BY created_at;\n`;

    // Guardar script SQL
    const sqlFileName = 'import_usuarios_produccion.sql';
    fs.writeFileSync(sqlFileName, sqlScript);
    console.log(`✅ Script SQL generado: ${sqlFileName}\n`);

    // Generar también JSON para referencia
    const jsonFileName = 'usuarios_export.json';
    fs.writeFileSync(jsonFileName, JSON.stringify(usuarios, null, 2));
    console.log(`✅ Backup JSON generado: ${jsonFileName}\n`);

    // Instrucciones
    console.log('='.repeat(60));
    console.log('📝 INSTRUCCIONES PARA IMPORTAR EN PRODUCCIÓN');
    console.log('='.repeat(60));
    console.log('');
    console.log('1. Ir a Supabase Dashboard de PRODUCCIÓN:');
    console.log('   https://app.supabase.com/project/bvnbwqsvldsfdfzifcp');
    console.log('');
    console.log('2. Menú lateral → SQL Editor');
    console.log('');
    console.log('3. Copiar el contenido del archivo:');
    console.log(`   ${sqlFileName}`);
    console.log('');
    console.log('4. Pegar en el SQL Editor');
    console.log('');
    console.log('5. Hacer clic en "Run" (▶️)');
    console.log('');
    console.log('6. Verificar que se insertaron los usuarios');
    console.log('');
    console.log('='.repeat(60));
    console.log('');
    console.log('✅ Exportación completada exitosamente!');
    console.log('');

  } catch (error: any) {
    console.error('❌ Error durante la exportación:', error.message);
    process.exit(1);
  }
}

exportarUsuarios();
