/**
 * Configuración de Supabase para Desarrollo y Producción
 *
 * Este archivo SÍ se sube a GitHub y contiene las configuraciones
 * de ambos ambientes. Solo usa claves públicas (anon keys).
 *
 * NUNCA incluyas Service Role Keys aquí.
 */

interface SupabaseConfig {
  projectId: string;
  url: string;
  anonKey: string;
}

// Configuraciones por ambiente
const configs: Record<'development' | 'production', SupabaseConfig> = {
  development: {
    projectId: 'eubjevjqcpsvpgxmdpvy',
    url: 'https://eubjevjqcpsvpgxmdpvy.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1YmpldmpxY3BzdnBneG1kcHZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNzM4MjAsImV4cCI6MjA4ODc0OTgyMH0.bSriqpdHFIxoLqcyk7PJD_CsRh3F7naMjWrPk4BOLaQ'
  },
  production: {
    projectId: 'bvnbwqsvldsfdgfzifcp',
    url: 'https://bvnbwqsvldsfdgfzifcp.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2bmJ3cXN2bGRzZmRnZnppZmNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxODY3MjYsImV4cCI6MjA5Mjc2MjcyNn0.B8HrlnoqeV5kjrfRfXDbWsl2f-qazPR2cp_JvbzKK2Q'  // PROD
  }
};

/**
 * Detecta el ambiente actual
 * Soporta Vercel y builds locales
 */
function detectEnvironment(): 'development' | 'production' {
  // En Vercel, usar VERCEL_ENV
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_VERCEL_ENV) {
    return import.meta.env.VITE_VERCEL_ENV === 'production' ? 'production' : 'development';
  }

  // En builds locales, usar MODE
  if (typeof import.meta !== 'undefined' && import.meta.env?.MODE) {
    return import.meta.env.MODE === 'production' ? 'production' : 'development';
  }

  // Fallback: detección por hostname (para preview builds)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Si el hostname contiene 'vercel.app' pero no es el dominio de producción
    if (hostname.includes('vercel.app')) {
      // URLs de preview tienen formato: <proyecto>-<hash>-<team>.vercel.app
      // URL de producción: <proyecto>.vercel.app o dominio custom
      // Por ahora defaultear a desarrollo para preview deployments
      return 'development';
    }
  }

  // Default: production para builds
  return 'production';
}

// Obtener configuración del ambiente actual
const currentEnv = detectEnvironment();
const config = configs[currentEnv];

// Log para debugging (SIEMPRE mostrar para verificar)
console.log('🔧 Supabase Config:', {
  environment: currentEnv,
  projectId: config.projectId,
  url: config.url,
  mode: typeof import.meta !== 'undefined' ? import.meta.env?.MODE : 'unknown',
  prod: typeof import.meta !== 'undefined' ? import.meta.env?.PROD : 'unknown',
  dev: typeof import.meta !== 'undefined' ? import.meta.env?.DEV : 'unknown',
  viteAppEnv: typeof import.meta !== 'undefined' ? import.meta.env?.VITE_APP_ENV : 'unknown',
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'unknown'
});

// Exportar configuración
export const supabaseConfig = config;
export const projectId = config.projectId;
export const supabaseUrl = config.url;
export const publicAnonKey = config.anonKey;

// Exportar también la función de detección por si se necesita
export { detectEnvironment };
