import { useState, useEffect } from 'react';
import { QrCode, CheckCircle, XCircle, Clock, MapPin, Calendar, Users, ArrowRight, Loader2 } from 'lucide-react';

interface QRScanPageProps {
  token: string;
  baseUrl: string;
  publicAnonKey: string;
}

export function QRScanPage({ token, baseUrl, publicAnonKey }: QRScanPageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pedido, setPedido] = useState<any>(null);
  const [camareros, setCamareros] = useState<any[]>([]);
  const [registrando, setRegistrando] = useState<string | null>(null);
  const [ultimoRegistro, setUltimoRegistro] = useState<{ camareroId: string; tipo: string; timestamp: string } | null>(null);

  useEffect(() => {
    cargarDatosPedido();
  }, [token]);

  const cargarDatosPedido = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Validar token y obtener pedido
      const pedidoResponse = await fetch(`${baseUrl}/qr-scan/${token}`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` }
      });
      
      const pedidoData = await pedidoResponse.json();
      
      if (!pedidoData.success) {
        setError(pedidoData.error || 'Código QR no válido o expirado');
        setLoading(false);
        return;
      }
      
      setPedido(pedidoData.pedido);
      
      // Obtener datos completos de los camareros asignados
      const camarerosResponse = await fetch(`${baseUrl}/camareros`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` }
      });
      
      const camarerosData = await camarerosResponse.json();
      
      if (camarerosData.success) {
        // Filtrar solo los camareros asignados a este pedido
        const asignaciones = pedidoData.pedido.asignaciones || [];
        const camarerosAsignados = camarerosData.data.filter((c: any) => 
          asignaciones.some((a: any) => a.camareroId === c.id)
        );
        
        // Combinar datos del camarero con datos de asignación
        const camarerosConEstado = camarerosAsignados.map((c: any) => {
          const asignacion = asignaciones.find((a: any) => a.camareroId === c.id);
          return {
            ...c,
            turno: asignacion?.turno || '',
            entradaRegistrada: asignacion?.entradaRegistrada || false,
            registroEntrada: asignacion?.registroEntrada || null,
            salidaRegistrada: asignacion?.salidaRegistrada || false,
            registroSalida: asignacion?.registroSalida || null
          };
        });
        
        setCamareros(camarerosConEstado);
      }
      
    } catch (error) {
      console.error('Error al cargar datos del pedido:', error);
      setError('Error al cargar la información del evento. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const registrarEntradaSalida = async (camareroId: string, tipo: 'entrada' | 'salida') => {
    setRegistrando(`${camareroId}-${tipo}`);
    
    try {
      const response = await fetch(`${baseUrl}/qr-scan/${token}/registro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ camareroId, tipo })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Mostrar confirmación
        setUltimoRegistro({ camareroId, tipo, timestamp: data.timestamp });
        
        // Actualizar datos
        await cargarDatosPedido();
        
        // Limpiar confirmación después de 3 segundos
        setTimeout(() => {
          setUltimoRegistro(null);
        }, 3000);
      } else {
        alert(data.error || 'Error al registrar');
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      alert('Error al registrar. Por favor, intenta de nuevo.');
    } finally {
      setRegistrando(null);
    }
  };

  const formatearHora = (isoString: string) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    return `${dias[fecha.getDay()]}, ${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando información del evento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-red-200">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Código QR No Válido</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
          >
            Intentar de Nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 pb-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 mb-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <QrCode className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Control de Asistencia</h1>
              <p className="text-blue-100 text-sm">Registro de Entrada y Salida</p>
            </div>
          </div>
        </div>

        {/* Información del Evento */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Información del Evento</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Cliente</p>
                <p className="font-semibold text-gray-900">{pedido.cliente}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha</p>
                <p className="font-semibold text-gray-900">{formatearFecha(pedido.diaEvento)}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Lugar</p>
                <p className="font-semibold text-gray-900">{pedido.lugar}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Horario</p>
                <p className="font-semibold text-gray-900">
                  {pedido.horaEntrada} - {pedido.horaSalida}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">Tipo de Evento</p>
            <p className="font-semibold text-gray-900">{pedido.tipoEvento}</p>
          </div>
        </div>

        {/* Confirmación de Registro */}
        {ultimoRegistro && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-900">
                  {ultimoRegistro.tipo === 'entrada' ? 'Entrada' : 'Salida'} registrada correctamente
                </p>
                <p className="text-sm text-green-700">
                  {formatearHora(ultimoRegistro.timestamp)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Personal */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Personal Asignado ({camareros.length})
          </h2>
          
          {camareros.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No hay personal asignado a este evento</p>
            </div>
          ) : (
            <div className="space-y-4">
              {camareros.map((camarero) => (
                <div
                  key={camarero.id}
                  className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-all bg-gradient-to-r from-gray-50 to-white"
                >
                  {/* Información del camarero */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900 text-lg">
                        {camarero.nombre} {camarero.apellido}
                      </h3>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                        {camarero.codigo}
                      </span>
                    </div>
                    
                    {camarero.turno && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Turno: {camarero.turno}</span>
                      </div>
                    )}
                  </div>

                  {/* Estados de registro */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className={`p-3 rounded-lg border ${
                      camarero.entradaRegistrada 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        {camarero.entradaRegistrada ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-xs font-semibold text-gray-700">ENTRADA</span>
                      </div>
                      <p className={`text-sm font-bold ${
                        camarero.entradaRegistrada ? 'text-green-800' : 'text-gray-400'
                      }`}>
                        {camarero.entradaRegistrada 
                          ? formatearHora(camarero.registroEntrada)
                          : 'Sin registrar'
                        }
                      </p>
                    </div>

                    <div className={`p-3 rounded-lg border ${
                      camarero.salidaRegistrada 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        {camarero.salidaRegistrada ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-xs font-semibold text-gray-700">SALIDA</span>
                      </div>
                      <p className={`text-sm font-bold ${
                        camarero.salidaRegistrada ? 'text-green-800' : 'text-gray-400'
                      }`}>
                        {camarero.salidaRegistrada 
                          ? formatearHora(camarero.registroSalida)
                          : 'Sin registrar'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => registrarEntradaSalida(camarero.id, 'entrada')}
                      disabled={camarero.entradaRegistrada || registrando === `${camarero.id}-entrada`}
                      className={`py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                        camarero.entradaRegistrada
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg'
                      }`}
                    >
                      {registrando === `${camarero.id}-entrada` ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Registrando...
                        </>
                      ) : camarero.entradaRegistrada ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Entrada Registrada
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-4 h-4" />
                          Registrar Entrada
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => registrarEntradaSalida(camarero.id, 'salida')}
                      disabled={!camarero.entradaRegistrada || camarero.salidaRegistrada || registrando === `${camarero.id}-salida`}
                      className={`py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                        !camarero.entradaRegistrada || camarero.salidaRegistrada
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-md hover:shadow-lg'
                      }`}
                    >
                      {registrando === `${camarero.id}-salida` ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Registrando...
                        </>
                      ) : camarero.salidaRegistrada ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Salida Registrada
                        </>
                      ) : !camarero.entradaRegistrada ? (
                        <>
                          <XCircle className="w-4 h-4" />
                          Primero Entrada
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-4 h-4" />
                          Registrar Salida
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Sistema de Control de Asistencia - {pedido.numero}
          </p>
          <button
            onClick={() => cargarDatosPedido()}
            className="mt-3 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mx-auto"
          >
            <Loader2 className="w-4 h-4" />
            Actualizar datos
          </button>
        </div>
      </div>
    </div>
  );
}
