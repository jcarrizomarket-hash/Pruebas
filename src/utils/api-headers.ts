/**
 * Utilidad centralizada para headers de la API.
 * Todos los componentes deben usar estas funciones en lugar de construir headers manualmente.
 *
 * getReadHeaders()  — para GET (lectura, sin secret)
 * getWriteHeaders() — para POST, PUT, DELETE (escritura, incluye x-fn-secret)
 */

const getFnSecret = (): string => {
  try {
    return import.meta.env?.VITE_FN_SECRET || '';
  } catch {
    return '';
  }
};

/** Headers para operaciones de LECTURA (GET) */
export const getReadHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
});

/** Headers para operaciones de ESCRITURA (POST, PUT, DELETE) — incluye x-fn-secret */
export const getWriteHeaders = (): HeadersInit => {
  const secret = getFnSecret();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (secret) {
    headers['x-fn-secret'] = secret;
  }
  return headers;
};