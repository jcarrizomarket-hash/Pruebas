import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader, AlertCircle } from 'lucide-react';

interface ConfirmarPageProps {
  token: string;
  accion: 'confirmar' | 'no-confirmar';
  baseUrl: string;
  publicAnonKey: string;
}

export function ConfirmarPage({ token, accion, baseUrl, publicAnonKey }: ConfirmarPageProps) {
  const [estado, setEstado] = useState<'cargando' | 'exito' | 'error' | 'ya-respondido'>('cargando');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const ejecutar = async () => {
      try {
        const endpoint = accion === 'confirmar' ? 'confirmar' : 'no-confirmar';
        const response = await fetch(`${baseUrl}/${endpoint}/${token}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        });

        const data = await response.json();

        if (response.ok && data.success !== false) {
          setEstado('exito');
          setMensaje(data.message || (accion === 'confirmar' ? 'Has confirmado tu asistencia.' : 'Has rechazado el servicio.'));
        } else if (data.error?.includes('ya') || data.error?.includes('used') || data.error?.includes('Token')) {
          setEstado('ya-respondido');
          setMensaje('Este enlace ya fue utilizado anteriormente.');
        } else {
          setEstado('error');
          setMensaje(data.error || 'Ha ocurrido un error. Por favor contacta con tu coordinador.');
        }
      } catch {
        setEstado('error');
        setMensaje('No se pudo conectar con el servidor. Intenta de nuevo más tarde.');
      }
    };

    ejecutar();
  }, []);

  const esConfirmar = accion === 'confirmar';

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className={`p-6 text-white text-center ${
          estado === 'cargando' ? 'bg-gray-500' :
          estado === 'exito' && esConfirmar ? 'bg-green-600' :
          estado === 'exito' && !esConfirmar ? 'bg-red-600' :
          estado === 'ya-respondido' ? 'bg-yellow-500' :
          'bg-red-700'
        }`}>
          <div className="flex justify-center mb-3">
            {estado === 'cargando' && <Loader className="w-12 h-12 animate-spin" />}
            {estado === 'exito' && esConfirmar && <CheckCircle className="w-12 h-12" />}
            {estado === 'exito' && !esConfirmar && <XCircle className="w-12 h-12" />}
            {estado === 'ya-respondido' && <AlertCircle className="w-12 h-12" />}
            {estado === 'error' && <XCircle className="w-12 h-12" />}
          </div>
          <h1 className="text-2xl font-bold">
            {estado === 'cargando' && 'Procesando...'}
            {estado === 'exito' && esConfirmar && '¡Asistencia Confirmada!'}
            {estado === 'exito' && !esConfirmar && 'Servicio Rechazado'}
            {estado === 'ya-respondido' && 'Ya Respondido'}
            {estado === 'error' && 'Error'}
          </h1>
        </div>

        {/* Body */}
        <div className="p-6 text-center">
          {estado === 'cargando' && (
            <p className="text-gray-600">Registrando tu respuesta, por favor espera...</p>
          )}

          {estado !== 'cargando' && (
            <>
              <p className="text-gray-700 text-lg mb-6">{mensaje}</p>

              {estado === 'exito' && esConfirmar && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-sm">
                  Tu coordinador ha sido notificado. ¡Gracias!
                </div>
              )}

              {estado === 'exito' && !esConfirmar && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
                  Tu coordinador ha sido notificado. Si cambias de opinión, contacta directamente con él.
                </div>
              )}

              {estado === 'ya-respondido' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 text-sm">
                  Si crees que es un error, contacta con tu coordinador.
                </div>
              )}

              {estado === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
                  Si el problema persiste, contacta con tu coordinador directamente.
                </div>
              )}
            </>
          )}
        </div>

        <div className="px-6 pb-6 text-center text-xs text-gray-400">
          Sistema de Gestión de Eventos
        </div>
      </div>
    </div>
  );
}
