import { useState, useEffect } from 'react';
import { Bell, Clock, RefreshCw, Send, Check, X, AlertCircle, Loader2 } from 'lucide-react';

interface AlertasConfigProps {
  baseUrl: string;
  publicAnonKey: string;
}

export function AlertasConfig({ baseUrl, publicAnonKey }: AlertasConfigProps) {
  const [verificando, setVerificando] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const verificarAlertasAhora = async () => {
    setVerificando(true);
    setResultado(null);

    try {
      console.log('🔔 Verificando alertas de servicios...');
      
      const response = await fetch(`${baseUrl}/verificar-alertas-servicios`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      const data = await response.json();
      console.log('📋 Resultado:', data);

      setResultado(data);
    } catch (error) {
      console.error('❌ Error al verificar alertas:', error);
      setResultado({
        success: false,
        error: String(error),
        message: 'Error de conexión al verificar alertas'
      });
    } finally {
      setVerificando(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-8 h-8 text-amber-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Sistema de Alertas Automáticas</h2>
            <p className="text-sm text-gray-600">Recordatorios 3 horas antes del servicio</p>
          </div>
        </div>

        {/* Información del sistema */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5 mb-6">
          <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            ¿Cómo funciona?
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• <strong>Automático:</strong> El sistema verifica cada hora si hay servicios próximos</p>
            <p>• <strong>3 horas antes:</strong> Se envía un recordatorio a los perfiles confirmados</p>
            <p>• <strong>Canales:</strong> WhatsApp y Email (según configuración de Notificaciones)</p>
            <p>• <strong>Contenido:</strong> Incluye todos los detalles del servicio (cliente, hora, lugar, uniformidad, etc.)</p>
            <p>• <strong>Sin duplicados:</strong> Cada perfil recibe la alerta solo una vez por servicio</p>
          </div>
        </div>

        {/* Ejemplo de mensaje */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6">
          <h3 className="font-bold text-gray-900 mb-3">📱 Ejemplo de mensaje:</h3>
          <div className="bg-white p-4 rounded-lg border border-gray-300 text-sm font-mono">
            <p className="font-bold mb-2">🔔 Recordatorio de Servicio</p>
            <p className="mb-2">Recuerda que tienes un servicio hoy.</p>
            <p className="mb-2 font-bold">📋 Detalles del Servicio:</p>
            <p>• <strong>Cliente:</strong> Empresa ABC S.L.</p>
            <p>• <strong>Tipo:</strong> Cena de empresa</p>
            <p>• <strong>Fecha:</strong> Viernes, 13 de marzo de 2026</p>
            <p>• <strong>Hora de entrada:</strong> 19:00</p>
            <p>• <strong>Hora de salida:</strong> 23:00</p>
            <p>• <strong>Lugar:</strong> Hotel Gran Vía - Salón Principal</p>
            <p>• <strong>Número de personas:</strong> 150</p>
            <p>• <strong>Uniformidad:</strong> Camisa negra</p>
            <p className="mt-2">¡Te esperamos! 🎉</p>
          </div>
        </div>

        {/* Botón de verificación manual */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-900 mb-3">🧪 Prueba Manual</h3>
          <p className="text-sm text-gray-600 mb-4">
            Puedes verificar manualmente si hay servicios próximos que requieran alerta:
          </p>
          
          <button
            onClick={verificarAlertasAhora}
            disabled={verificando}
            className="w-full px-6 py-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {verificando ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verificando servicios próximos...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                <span>Verificar Alertas Ahora</span>
              </>
            )}
          </button>
        </div>

        {/* Resultado de la verificación */}
        {resultado && (
          <div className={`p-5 rounded-lg border-2 ${
            resultado.success 
              ? 'bg-green-50 border-green-300' 
              : 'bg-red-50 border-red-300'
          }`}>
            <div className="flex items-start gap-3">
              {resultado.success ? (
                <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <X className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`font-bold mb-2 ${
                  resultado.success ? 'text-green-900' : 'text-red-900'
                }`}>
                  {resultado.message}
                </p>
                
                {resultado.success && resultado.alertasEnviadas > 0 && (
                  <div className="space-y-3 mt-4">
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <p className="font-semibold text-green-900 mb-2">
                        📊 Resumen:
                      </p>
                      <ul className="space-y-1 text-sm text-green-800">
                        <li>✅ Alertas enviadas: <strong>{resultado.alertasEnviadas}</strong></li>
                        <li>📋 Servicios procesados: <strong>{resultado.serviciosProcesados}</strong></li>
                      </ul>
                    </div>
                    
                    {resultado.detalles && resultado.detalles.length > 0 && (
                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <p className="font-semibold text-green-900 mb-2">
                          📝 Detalles:
                        </p>
                        <div className="space-y-2">
                          {resultado.detalles.map((detalle: any, idx: number) => (
                            <div key={idx} className="text-sm">
                              {detalle.enviado ? (
                                <p className="text-green-800">
                                  ✅ {detalle.nombre} ({detalle.camarero}) - Pedido {detalle.pedido}
                                </p>
                              ) : (
                                <p className="text-amber-800">
                                  ⚠️ {detalle.nombre} ({detalle.camarero}) - {detalle.razon}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {resultado.success && resultado.alertasEnviadas === 0 && (
                  <p className="text-sm text-green-700 mt-2">
                    No hay servicios que empiecen en las próximas 3 horas (±15 minutos).
                    El sistema seguirá verificando automáticamente.
                  </p>
                )}
                
                {!resultado.success && (
                  <div className="mt-3">
                    <p className="text-sm text-red-800 font-semibold mb-1">Error:</p>
                    <p className="text-sm text-red-700">{resultado.error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-3">📌 Importante:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span><strong>Ventana de envío:</strong> Las alertas se envían entre 2:45 y 3:15 horas antes del servicio (ventana de 30 minutos)</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span><strong>Solo confirmados:</strong> Las alertas se envían únicamente a perfiles con estado "confirmado"</span>
            </li>
            <li className="flex items-start gap-2">
              <Bell className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span><strong>Respeta configuración:</strong> Se utilizan los canales configurados en la pestaña "Notificaciones"</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span><strong>Horarios:</strong> Respeta los horarios de notificación configurados (8:00 - 22:00 por defecto)</span>
            </li>
          </ul>
        </div>

        {/* Configuración automática */}
        <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg">
          <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Verificación Automática
          </h3>
          <p className="text-sm text-blue-800 mb-3">
            El sistema verifica automáticamente cada hora si hay servicios próximos.
            Puedes configurar un cron job o tarea programada para llamar al endpoint:
          </p>
          <div className="bg-white p-3 rounded border border-blue-200 font-mono text-xs overflow-x-auto">
            <code className="text-blue-900">
              GET {baseUrl}/verificar-alertas-servicios
            </code>
          </div>
          <p className="text-xs text-blue-700 mt-2">
            💡 Recomendación: Configura una tarea que ejecute esta llamada cada hora
          </p>
        </div>
      </div>
    </div>
  );
}
