/**
 * Script para exportar datos de desarrollo a archivos JSON
 * Úsalo para migrar datos de DEV a PROD
 *
 * Uso:
 * deno run --allow-net --allow-write export-data.ts
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

// Configuración de Supabase DESARROLLO
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Faltan variables de entorno: SUPABASE_URL y SUPABASE_ANON_KEY');
  Deno.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Lista de tablas a exportar
const TABLAS = [
  'coordinadores',
  'camareros',
  'clientes',
  'pedidos',
  'asignaciones',
  'usuarios',
  'qr_tokens',
  'registros_asistencia',
  'confirmaciones',
  'chats'
];

interface ExportResult {
  tabla: string;
  registros: number;
  archivo: string;
  success: boolean;
  error?: string;
}

async function exportarTabla(nombreTabla: string): Promise<ExportResult> {
  console.log(`📦 Exportando ${nombreTabla}...`);

  try {
    const { data, error } = await supabase
      .from(nombreTabla)
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    const registros = data?.length || 0;

    if (registros === 0) {
      console.log(`   ⚠️  ${nombreTabla}: vacía (sin datos)`);
      return {
        tabla: nombreTabla,
        registros: 0,
        archivo: '',
        success: true
      };
    }

    // Crear archivo JSON
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const nombreArchivo = `export_${nombreTabla}_${timestamp}.json`;
    const rutaArchivo = `./exports/${nombreArchivo}`;

    // Crear directorio exports si no existe
    try {
      await Deno.mkdir('./exports', { recursive: true });
    } catch {
      // Directorio ya existe
    }

    // Guardar datos
    await Deno.writeTextFile(
      rutaArchivo,
      JSON.stringify(data, null, 2)
    );

    console.log(`   ✅ ${nombreTabla}: ${registros} registros → ${nombreArchivo}`);

    return {
      tabla: nombreTabla,
      registros,
      archivo: nombreArchivo,
      success: true
    };

  } catch (error) {
    console.error(`   ❌ Error en ${nombreTabla}:`, error);
    return {
      tabla: nombreTabla,
      registros: 0,
      archivo: '',
      success: false,
      error: error.message
    };
  }
}

async function exportarTodo() {
  console.log('🚀 EXPORTACIÓN DE DATOS - DESARROLLO\n');
  console.log(`📊 Base de datos: ${SUPABASE_URL}`);
  console.log(`📋 Tablas a exportar: ${TABLAS.length}\n`);

  const resultados: ExportResult[] = [];

  for (const tabla of TABLAS) {
    const resultado = await exportarTabla(tabla);
    resultados.push(resultado);
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN DE EXPORTACIÓN');
  console.log('='.repeat(60) + '\n');

  let totalRegistros = 0;
  let tablasExitosas = 0;
  let tablasConError = 0;
  let tablasVacias = 0;

  resultados.forEach(r => {
    if (r.success) {
      if (r.registros > 0) {
        console.log(`✅ ${r.tabla.padEnd(25)} ${r.registros.toString().padStart(5)} registros`);
        totalRegistros += r.registros;
        tablasExitosas++;
      } else {
        console.log(`⚪ ${r.tabla.padEnd(25)} ${r.registros.toString().padStart(5)} registros (vacía)`);
        tablasVacias++;
      }
    } else {
      console.log(`❌ ${r.tabla.padEnd(25)} ERROR: ${r.error}`);
      tablasConError++;
    }
  });

  console.log('\n' + '-'.repeat(60));
  console.log(`📁 Total de registros exportados: ${totalRegistros}`);
  console.log(`✅ Tablas exportadas con datos: ${tablasExitosas}`);
  console.log(`⚪ Tablas vacías: ${tablasVacias}`);
  console.log(`❌ Tablas con errores: ${tablasConError}`);
  console.log(`📂 Archivos guardados en: ./exports/`);
  console.log('-'.repeat(60) + '\n');

  // Crear archivo de metadata
  const metadata = {
    fecha_exportacion: new Date().toISOString(),
    base_datos: SUPABASE_URL,
    total_registros: totalRegistros,
    tablas: resultados,
    version_schema: '1.0'
  };

  const timestamp = new Date().toISOString().split('T')[0];
  await Deno.writeTextFile(
    `./exports/metadata_${timestamp}.json`,
    JSON.stringify(metadata, null, 2)
  );

  console.log('✅ Exportación completada');
  console.log(`📄 Metadata guardada en: metadata_${timestamp}.json\n`);

  // Crear script de importación SQL
  await generarScriptImportacion(resultados, timestamp);
}

async function generarScriptImportacion(resultados: ExportResult[], timestamp: string) {
  console.log('📝 Generando script SQL de importación...');

  let sql = `-- ============================================
-- SCRIPT DE IMPORTACIÓN AUTOMÁTICA
-- Fecha: ${new Date().toISOString()}
-- Total registros: ${resultados.reduce((sum, r) => sum + r.registros, 0)}
-- ============================================

-- IMPORTANTE: Ejecutar este script DESPUÉS de crear las tablas con 00_schema_completo.sql

BEGIN;

`;

  for (const resultado of resultados) {
    if (!resultado.success || resultado.registros === 0) continue;

    const datos = JSON.parse(
      await Deno.readTextFile(`./exports/${resultado.archivo}`)
    );

    sql += `-- ============================================\n`;
    sql += `-- ${resultado.tabla.toUpperCase()} (${resultado.registros} registros)\n`;
    sql += `-- ============================================\n\n`;

    if (datos.length > 0) {
      // Obtener columnas del primer registro
      const columnas = Object.keys(datos[0]);

      sql += `INSERT INTO ${resultado.tabla} (${columnas.join(', ')})\nVALUES\n`;

      const valores = datos.map((registro: any, index: number) => {
        const vals = columnas.map(col => {
          const val = registro[col];
          if (val === null || val === undefined) return 'NULL';
          if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
          if (typeof val === 'boolean') return val ? 'true' : 'false';
          if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
          return val;
        });
        const prefix = index === datos.length - 1 ? '  ' : '  ';
        const suffix = index === datos.length - 1 ? ';' : ',';
        return `${prefix}(${vals.join(', ')})${suffix}`;
      });

      sql += valores.join('\n') + '\n\n';
    }
  }

  sql += `COMMIT;

-- ============================================
-- VERIFICACIÓN
-- ============================================
SELECT
  'coordinadores' as tabla, COUNT(*) as registros FROM coordinadores
UNION ALL
SELECT 'camareros', COUNT(*) FROM camareros
UNION ALL
SELECT 'clientes', COUNT(*) FROM clientes
UNION ALL
SELECT 'pedidos', COUNT(*) FROM pedidos
UNION ALL
SELECT 'asignaciones', COUNT(*) FROM asignaciones
UNION ALL
SELECT 'usuarios', COUNT(*) FROM usuarios
UNION ALL
SELECT 'qr_tokens', COUNT(*) FROM qr_tokens
UNION ALL
SELECT 'registros_asistencia', COUNT(*) FROM registros_asistencia
UNION ALL
SELECT 'confirmaciones', COUNT(*) FROM confirmaciones
UNION ALL
SELECT 'chats', COUNT(*) FROM chats;
`;

  await Deno.writeTextFile(
    `./exports/import_data_${timestamp}.sql`,
    sql
  );

  console.log(`✅ Script SQL generado: import_data_${timestamp}.sql\n`);
}

// Ejecutar exportación
if (import.meta.main) {
  await exportarTodo();
}
