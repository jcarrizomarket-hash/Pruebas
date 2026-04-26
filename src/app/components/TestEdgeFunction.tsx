import { useState } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function TestEdgeFunction() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-ce05fe95`;

  const testEndpoint = async (endpoint: string, method: string = 'GET') => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(`Error ${response.status}: ${JSON.stringify(data)}`);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(`Error de conexión: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">🧪 Prueba de Edge Function</h2>
      
      <div className="space-y-3 mb-6">
        <button
          onClick={() => testEndpoint('/test')}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-left font-mono text-sm"
          disabled={loading}
        >
          GET /test
        </button>

        <button
          onClick={() => testEndpoint('/clientes')}
          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-left font-mono text-sm"
          disabled={loading}
        >
          GET /clientes
        </button>

        <button
          onClick={() => testEndpoint('/camareros')}
          className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-left font-mono text-sm"
          disabled={loading}
        >
          GET /camareros
        </button>

        <button
          onClick={() => testEndpoint('/coordinadores')}
          className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 text-left font-mono text-sm"
          disabled={loading}
        >
          GET /coordinadores
        </button>

        <button
          onClick={() => testEndpoint('/pedidos')}
          className="w-full px-4 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 text-left font-mono text-sm"
          disabled={loading}
        >
          GET /pedidos
        </button>
      </div>

      {loading && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <div className="animate-spin inline-block w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full mb-2"></div>
          <p className="text-blue-800 font-semibold">Cargando...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-bold mb-2">❌ Error:</p>
          <pre className="text-sm text-red-600 whitespace-pre-wrap">{error}</pre>
        </div>
      )}

      {result && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-bold mb-2">✅ Respuesta:</p>
          <pre className="text-sm bg-gray-900 text-green-400 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-xs text-gray-600 font-mono">
          Base URL: <span className="font-bold text-gray-800">{baseUrl}</span>
        </p>
      </div>
    </div>
  );
}
