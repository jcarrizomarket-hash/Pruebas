import { useState } from 'react';
import { Send, CheckCircle, XCircle, AlertCircle, Loader, Phone, MessageSquare, Webhook } from 'lucide-react';

interface TwilioTestProps {
  baseUrl: string;
  publicAnonKey: string;
}

interface TestResult {
  id: string;
  test: string;
  status: 'success' | 'error' | 'warning' | 'info';
  message: string;
  details?: any;
  timestamp: string;
}

export function TwilioTest({ baseUrl, publicAnonKey }: TwilioTestProps) {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);
  const [telefonoTest, setTelefonoTest] = useState('');
  const [mensajeTest, setMensajeTest] = useState('Hola! Este es un mensaje de prueba enviado via Twilio WhatsApp. ✅');

  const addResult = (test: string, status: TestResult['status'], message: string, details?: any) => {
    setTestResults(prev => [...prev, {
      id: `${Date.now()}-${Math.random()}`,
      test,
      status,
      message,
      details,
      timestamp: new Date().toISOString()
    }]);
  };

  const clearResults = () => setTestResults([]);

  // Test 1: Verificar configuración de Twilio
  const testVerificarConfig = async () => {
    addResult('Configuración Twilio', 'info', 'Verificando credenciales de Twilio...');
    try {
      const response = await fetch(`${baseUrl}/verificar-twilio-config`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` }
      });
      const result = await response.json();

      if (result.configured) {
        addResult(
          'Configuración Twilio',
          'success',
          '✅ Twilio está configurado correctamente',
          {
            fromNumber: result.fromNumber,
            sandboxNumber: result.sandboxNumber,
            isSandbox: result.isSandbox,
            message: result.message
          }
        );
        return true;
      } else {
        addResult(
          'Configuración Twilio',
          'error',
          `❌ Twilio NO está configurado: ${result.error || result.message}`,
          result
        );
        return false;
      }
    } catch (error) {
      addResult('Configuración Twilio', 'error', '❌ Error al contactar el endpoint', { error: String(error) });
      return false;
    }
  };

  // Test 2: Enviar mensaje de prueba via Twilio
  const testEnviarMensaje = async () => {
    if (!telefonoTest) {
      addResult('Envío Twilio', 'error', '❌ Debes ingresar un número de teléfono');
      return false;
    }
    addResult('Envío Twilio', 'info', `Enviando mensaje de prueba a ${telefonoTest} via Twilio...`);
    try {
      const response = await fetch(`${baseUrl}/enviar-twilio-test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ telefono: telefonoTest, mensaje: mensajeTest })
      });
      const result = await response.json();

      if (result.success) {
        addResult(
          'Envío Twilio',
          'success',
          `✅ Mensaje enviado exitosamente a ${telefonoTest}`,
          { message: result.message, sid: result.sid }
        );
        return true;
      } else {
        addResult(
          'Envío Twilio',
          'error',
          `❌ Error al enviar: ${result.error || result.message}`,
          result
        );
        return false;
      }
    } catch (error) {
      addResult('Envío Twilio', 'error', '❌ Error de conexión al enviar', { error: String(error) });
      return false;
    }
  };

  // Test 3: Verificar disponibilidad del webhook
  const testWebhook = async () => {
    addResult('Webhook WhatsApp', 'info', 'Verificando disponibilidad del webhook de Twilio...');
    try {
      const response = await fetch(`${baseUrl}/whatsapp-webhook`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` }
      });
      // El webhook GET espera un token de verificación — si responde (aunque sea con error de token)
      // el endpoint está activo
      const result = await response.json();

      if (response.status === 200) {
        addResult('Webhook WhatsApp', 'success', '✅ Webhook activo y respondiendo', result);
      } else if (response.status === 400 || result.error) {
        addResult(
          'Webhook WhatsApp',
          'warning',
          '⚠️ Webhook activo pero requiere token de verificación de Twilio',
          { status: response.status, response: result }
        );
      } else {
        addResult('Webhook WhatsApp', 'error', `❌ Webhook no disponible (HTTP ${response.status})`, result);
      }
      return true;
    } catch (error) {
      addResult('Webhook WhatsApp', 'error', '❌ No se pudo contactar el webhook', { error: String(error) });
      return false;
    }
  };

  // Ejecutar todos los tests
  const runAllTests = async () => {
    setTesting(true);
    clearResults();
    addResult('Inicio', 'info', '🚀 Iniciando batería de tests de Twilio WhatsApp...');

    await testVerificarConfig();
    await new Promise(r => setTimeout(r, 500));

    await testWebhook();
    await new Promise(r => setTimeout(r, 500));

    if (telefonoTest) {
      await testEnviarMensaje();
      await new Promise(r => setTimeout(r, 500));
    } else {
      addResult('Envío Twilio', 'warning', '⚠️ Test de envío omitido — ingresa un número de teléfono para probarlo');
    }

    addResult('Finalizado', 'success', '🎉 Batería de tests completada');
    setTesting(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'info': return <Loader className="w-5 h-5 text-blue-600 animate-spin" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-orange-50 border-orange-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Test Twilio WhatsApp</h2>
        </div>
        <p className="text-red-100">
          Verifica la configuración y el envío de mensajes via Twilio
        </p>
      </div>

      {/* Configuración del test de envío */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5" />
          Configuración del Test de Envío
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de teléfono destino (con código de país, sin +)
            </label>
            <input
              type="text"
              value={telefonoTest}
              onChange={e => setTelefonoTest(e.target.value)}
              placeholder="Ejemplo: 34612345678"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Formato: código de país + número. Ejemplo: 34612345678 para España
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mensaje de prueba
            </label>
            <textarea
              value={mensajeTest}
              onChange={e => setMensajeTest(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* Botones principales */}
      <div className="flex gap-3">
        <button
          onClick={runAllTests}
          disabled={testing}
          className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
        >
          {testing ? (
            <><Loader className="w-5 h-5 animate-spin" /> Ejecutando tests...</>
          ) : (
            <><Send className="w-5 h-5" /> Ejecutar Todos los Tests</>
          )}
        </button>
        {testResults.length > 0 && (
          <button
            onClick={clearResults}
            disabled={testing}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Tests individuales */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tests Individuales</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={testVerificarConfig}
            disabled={testing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 text-sm flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" /> Verificar Config
          </button>
          <button
            onClick={testWebhook}
            disabled={testing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 text-sm flex items-center justify-center gap-2"
          >
            <Webhook className="w-4 h-4" /> Test Webhook
          </button>
          <button
            onClick={testEnviarMensaje}
            disabled={testing || !telefonoTest}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 text-sm flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Enviar Mensaje
          </button>
        </div>
      </div>

      {/* Resultados */}
      {testResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resultados ({testResults.length})
          </h3>
          <div className="space-y-3">
            {testResults.map(result => (
              <div key={result.id} className={`p-4 rounded-lg border ${getStatusBg(result.status)}`}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">{getStatusIcon(result.status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{result.test}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(result.timestamp).toLocaleTimeString('es-ES')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{result.message}</p>
                    {result.details && (
                      <details className="mt-2">
                        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                          Ver detalles técnicos
                        </summary>
                        <pre className="mt-2 p-3 bg-gray-900 text-gray-100 rounded text-xs overflow-x-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guía */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3">📋 Guía de Tests</h4>
        <div className="space-y-2 text-sm text-blue-800">
          <p><strong>Verificar Config:</strong> Llama a <code>/verificar-twilio-config</code> — comprueba Account SID, Auth Token y número origen de Twilio</p>
          <p><strong>Test Webhook:</strong> Llama a <code>/whatsapp-webhook</code> — verifica que el endpoint receptor de mensajes esté activo</p>
          <p><strong>Enviar Mensaje:</strong> Llama a <code>/enviar-twilio-test</code> — envía un WhatsApp real al número indicado via Twilio</p>
        </div>
      </div>
    </div>
  );
}
