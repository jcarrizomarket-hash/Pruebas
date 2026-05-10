/**
 * Cliente de Supabase inicializado
 * Usa la configuración centralizada de ambientes
 */

import { createClient } from "@supabase/supabase-js";
import { supabaseUrl, publicAnonKey } from '../config/supabase.config';

// Debug: Verificar qué URL y key se está usando
console.log('🔑 Supabase Client Init:', {
  url: supabaseUrl,
  keyPrefix: publicAnonKey?.substring(0, 20) + '...',
});

// Crear cliente de Supabase (singleton para evitar múltiples instancias)
let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, publicAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        storageKey: `sb-${supabaseUrl.split('//')[1].split('.')[0]}-auth-token`, // Key única por proyecto
      },
    });
  }
  return supabaseInstance;
}

export const supabase = getSupabaseClient();

/**
 * Login directo contra la tabla usuarios
 */
export async function loginWithCredentials(email: string, password: string) {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .eq('password_hash', password) // TODO: Cambiar a bcrypt en producción
      .single();

    if (error) {
      console.error('Error en login:', error);
      return { success: false, error: 'Credenciales incorrectas' };
    }

    if (!data) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    return {
      success: true,
      user: {
        id: data.id,
        email: data.email,
        nombre: data.nombre,
        rol: data.rol,
      },
    };
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return { success: false, error: 'Error al conectar con la base de datos' };
  }
}

/**
 * Crear usuario admin (solo para setup inicial)
 */
export async function createAdminUser() {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .insert({
        email: 'admin@camareros.app',
        nombre: 'Administrador',
        rol: 'admin',
        password_hash: 'admin123', // TODO: Cambiar a bcrypt en producción
      })
      .select()
      .single();

    if (error) {
      // Si el error es por email duplicado
      if (error.code === '23505') {
        return { success: false, error: 'El usuario admin ya existe' };
      }
      console.error('Error al crear admin:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      user: data,
    };
  } catch (error) {
    console.error('Error al crear usuario admin:', error);
    return { success: false, error: 'Error al conectar con la base de datos' };
  }
}
