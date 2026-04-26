import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Mail, RefreshCw, Server } from 'lucide-react';

interface EmailConfigStatusProps {
  baseUrl: string;
  publicAnonKey: string;
}

export function EmailConfigStatus({ baseUrl, publicAnonKey }: EmailConfigStatusProps) {
  const [status, setStatus] = useState<{
    configured: boolean;
    servicioActivo: string | null;
    serviciosDisponibles: string[];
    emailFrom: string;
    message: string;
    checking: boolean;
    sandboxMode?: boolean;
    sandboxEmail?: string;
    debug?: any;
  }>({
    configured: false,
    servicioActivo: null,
    serviciosDisponibles: [],
    emailFrom: '',
    message: '',
    checking: true,
    sandboxMode: false,
    sandboxEmail: null,
    debug: null
  });

  const verificarConfiguracion = async () => {
    setStatus(prev => ({ ...prev, checking: true }));
    try {
      const response = await fetch(`${baseUrl}/verificar-email-config`, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`
        }
      });
      const result = await response.json();
      console.log('🔍 Diagnóstico de email recibido:', result);
      setStatus({
        configured: result.configured,
        servicioActivo: result.servicioActivo,
        serviciosDisponibles: result.serviciosDisponibles || [],
        emailFrom: result.emailFrom,
        message: result.message,
        checking: false,
        sandboxMode: result.sandboxMode,
        sandboxEmail: result.sandboxEmail,
        debug: result.debug
      });
    } catch (error) {
      console.log('Error al verificar configuración de email:', error);
      setStatus({
        configured: false,
        servicioActivo: null,
        serviciosDisponibles: [],
        emailFrom: '',
        message: 'Error al verificar configuración',
        checking: false,
        sandboxMode: false,
        sandboxEmail: null,
        debug: null
      });
    }
  };

  useEffect(() => {
    verificarConfiguracion();
  }, [baseUrl, publicAnonKey]);

  if (status.checking) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
          <div>
            <p className="font-medium text-blue-900">Verificando configuración de email...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status.configured) {
    const isSandbox = status.sandboxMode;
    const bgColor = isSandbox ? 'bg-amber-50' : 'bg-green-50';
    const borderColor = isSandbox ? 'border-amber-200' : 'border-green-200';
    const iconColor = isSandbox ? 'text-amber-600' : 'text-green-600';
    const textColor = isSandbox ? 'text-amber-900' : 'text-green-900';
    const secondaryTextColor = isSandbox ? 'text-amber-700' : 'text-green-700';
    const buttonBg = isSandbox ? 'bg-amber-100 hover:bg-amber-200 text-amber-700' : 'bg-green-100 hover:bg-green-200 text-green-700';
    const Icon = isSandbox ? AlertCircle : CheckCircle;
    
    return (
      <div className={`${bgColor} border ${borderColor} rounded-lg p-4 mb-6`}>
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
          <div className="flex-1">
            <p className={`font-medium ${textColor} mb-1`}>{isSandbox ? '⚠️' : '✅'} Servicio de Email Configurado</p>
            <p className={`text-sm ${secondaryTextColor} mb-3`}>{status.message}</p>
            
            {isSandbox && (
              <div className="bg-white border border-amber-300 rounded-md p-3 mb-3">
                <p className="text-sm font-bold text-amber-900 mb-2">📌 MODO SANDBOX ACTIVO</p>
                <p className="text-xs text-amber-800 mb-2">
                  Solo puedes enviar emails de prueba a <strong>barjupiterbcn@gmail.com</strong> (tu email registrado en Resend).
                </p>
                <p className="text-xs text-amber-800 mb-2">
                  <strong>Para enviar a cualquier destinatario:</strong>
                </p>
                <ol className="list-decimal list-inside text-xs text-amber-800 space-y-1 ml-2">
                  <li>Ve a <a href="https://resend.com/domains" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-amber-900">resend.com/domains</a></li>
                  <li>Agrega tu dominio (ej: tuempresa.com)</li>
                  <li>Configura los registros DNS (MX, TXT, DKIM)</li>
                  <li>Cambia EMAIL_FROM a: noreply@tuempresa.com</li>
                </ol>
              </div>
            )}
            
            <div className="bg-white border border-green-200 rounded-md p-3 mb-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-green-900">🚀 Proveedor Activo:</span>
                  <span className="ml-2 text-green-700">{status.servicioActivo}</span>
                </div>
                <div>
                  <span className="font-medium text-green-900">📧 Remitente:</span>
                  <span className="ml-2 text-green-700 font-mono text-xs">{status.emailFrom}</span>
                </div>
              </div>
              
              {status.serviciosDisponibles.length > 1 && (
                <div className="mt-2 pt-2 border-t border-green-200">
                  <span className="text-xs font-medium text-green-900">Servicios disponibles: </span>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {status.serviciosDisponibles.map((servicio) => (
                      <span
                        key={servicio}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          servicio === status.servicioActivo
                            ? 'bg-green-600 text-white'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {servicio}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-1 text-sm text-green-700">
              <p key="feature-1">✓ Envío automático de emails activado</p>
              <p key="feature-2">✓ Partes con formato profesional</p>
              <p key="feature-3">✓ Copia opcional a coordinadores</p>
            </div>
          </div>
          <button
            onClick={verificarConfiguracion}
            className={`px-3 py-1 text-sm ${buttonBg} rounded-md transition-colors`}
            title="Refrescar estado"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-medium text-amber-900 mb-1">⚠️ Servicio de Email No Configurado</p>
          <p className="text-sm text-amber-700 mb-3">{status.message}</p>
          
          <div className="bg-white border border-amber-200 rounded-md p-3 mb-3">
            <p className="text-sm font-medium text-amber-900 mb-2">Servicios de Email Soportados:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div key="service-resend" className="flex items-center gap-2 p-2 bg-amber-50 rounded">
                <Server className="w-4 h-4 text-amber-600" />
                <div className="text-xs">
                  <p className="font-semibold text-amber-900">Resend</p>
                  <p className="text-amber-700">Recomendado</p>
                </div>
              </div>
              <div key="service-sendgrid" className="flex items-center gap-2 p-2 bg-amber-50 rounded">
                <Server className="w-4 h-4 text-amber-600" />
                <div className="text-xs">
                  <p className="font-semibold text-amber-900">SendGrid</p>
                  <p className="text-amber-700">Confiable</p>
                </div>
              </div>
              <div key="service-mailgun" className="flex items-center gap-2 p-2 bg-amber-50 rounded">
                <Server className="w-4 h-4 text-amber-600" />
                <div className="text-xs">
                  <p className="font-semibold text-amber-900">Mailgun</p>
                  <p className="text-amber-700">Flexible</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-amber-900">Para activar el envío de emails:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-amber-700">
              <li key="step-1">Elige un servicio (Resend, SendGrid o Mailgun)</li>
              <li key="step-2">Abre el archivo <code className="bg-amber-100 px-1 py-0.5 rounded">EMAIL_SETUP.md</code></li>
              <li key="step-3">Sigue la guía paso a paso para tu servicio</li>
              <li key="step-4">Configura las variables en Supabase:
                <ul className="list-disc list-inside ml-5 mt-1 space-y-0.5 text-xs">
                  <li key="var-1"><code className="bg-amber-100 px-1 py-0.5 rounded">RESEND_API_KEY</code> (o el servicio elegido)</li>
                  <li key="var-2"><code className="bg-amber-100 px-1 py-0.5 rounded">EMAIL_FROM</code></li>
                </ul>
              </li>
              <li key="step-5">Recarga esta página</li>
            </ol>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={verificarConfiguracion}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Verificar de Nuevo
            </button>
          </div>

          <div className="mt-3 p-2 bg-amber-100 rounded text-xs text-amber-800">
            💡 <strong>Tip:</strong> El sistema detecta automáticamente qué servicio usar según la configuración. Puedes tener múltiples servicios configurados y el sistema elegirá el primero disponible.
          </div>
          
          {status.debug && (
            <details className="mt-3 p-3 bg-white border border-amber-200 rounded text-xs">
              <summary className="font-medium text-amber-900 cursor-pointer hover:text-amber-700">🔍 Información de Debugging</summary>
              <div className="mt-2 space-y-1 text-amber-700 font-mono">
                <div>Resend: {status.debug.hasResend ? `✓ (${status.debug.resendKeyLength} chars)` : '✗'}</div>
                <div>SendGrid: {status.debug.hasSendgrid ? '✓' : '✗'}</div>
                <div>Mailgun: {status.debug.hasMailgun ? '✓' : '✗'}</div>
                <div>Mailgun Domain: {status.debug.hasMailgunDomain ? '✓' : '✗'}</div>
                <div className="mt-2 pt-2 border-t border-amber-200 text-amber-600">
                  Si acabas de configurar las variables, espera 1-2 minutos para que el servidor Edge Function se actualice automáticamente.
                </div>
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
