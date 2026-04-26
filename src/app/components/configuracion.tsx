import { useState } from 'react';
import { Settings, MessageSquare, TestTube, Mail, TestTube2, Trash2, Bot, Database, Key, Bell } from 'lucide-react';
import { WhatsAppConfig } from './whatsapp-config';
import { TestPanel } from './test-panel';
import { TestEmail } from './test-email';
import { WhatsAppTest } from './whatsapp-test';
import { WhatsAppChatbotConfig } from './whatsapp-chatbot-config';
import { PasswordControlPanel } from './password-control-panel';
import { AlertasConfig } from './alertas-config';

interface ConfiguracionProps {
  baseUrl: string;
  publicAnonKey: string;
  camareros?: any[];
  coordinadores?: any[];
  pedidos?: any[];
  clientes?: any[];
}

export function Configuracion({ baseUrl, publicAnonKey, camareros = [], coordinadores = [], pedidos = [], clientes = [] }: ConfiguracionProps) {
  const [activeSubTab, setActiveSubTab] = useState<'whatsapp' | 'chatbot' | 'whatsapp-test' | 'test-panel' | 'test-email' | 'passwords' | 'notificaciones' | 'alertas' | 'utilidades'>('whatsapp');

  const subTabs = [
    { id: 'whatsapp' as const, label: 'WhatsApp', icon: MessageSquare },
    { id: 'chatbot' as const, label: '🤖 Chatbot', icon: Bot },
    { id: 'notificaciones' as const, label: 'Notificaciones', icon: Bell },
    { id: 'alertas' as const, label: '🔔 Alertas de Servicio', icon: Bell },
    { id: 'whatsapp-test' as const, label: '🧪 Test de WhatsApp', icon: TestTube2 },
    { id: 'test-panel' as const, label: 'Panel de Pruebas', icon: TestTube },
    { id: 'test-email' as const, label: 'Prueba de Email', icon: Mail },
    { id: 'passwords' as const, label: 'Contraseñas y Usuarios', icon: Key },
    { id: 'utilidades' as const, label: 'Utilidades', icon: Settings }
  ];

  // Función para eliminar pedido por número
  const eliminarPedidoPorNumero = async (numeroPedido: string) => {
    try {
      // Buscar el pedido por número
      const pedido = pedidos.find(p => p.numero === numeroPedido);
      
      if (!pedido) {
        alert(`❌ No se encontró el pedido ${numeroPedido}`);
        return;
      }

      if (!window.confirm(`¿Estás seguro de eliminar el pedido ${numeroPedido}?\n\nCliente: ${pedido.cliente}\nLugar: ${pedido.lugar}\nFecha: ${pedido.diaEvento}`)) {
        return;
      }

      console.log(`🗑️ Eliminando pedido ${numeroPedido} con ID: ${pedido.id}`);

      const response = await fetch(`${baseUrl}/pedidos/${pedido.id}`, {
        method: 'DELETE',
        headers: { 
          Authorization: `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      console.log('📝 Respuesta del servidor:', result);

      if (response.ok && result.success) {
        alert(`✅ Pedido ${numeroPedido} eliminado correctamente`);
        // Recargar la página para actualizar los datos
        window.location.reload();
      } else {
        console.error('❌ Error al eliminar:', result);
        alert(`❌ Error al eliminar el pedido: ${result.error || 'Error desconocido'}`);
      }
    } catch (error: any) {
      console.error('Error al eliminar pedido:', error);
      alert(`❌ Error: ${error.message}`);
    }
  };

  // Función para limpieza masiva de datos
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<string[]>([]);
  const [limpiandoDatos, setLimpiandoDatos] = useState(false);

  const toggleCategoria = (categoria: string) => {
    setCategoriasSeleccionadas(prev => 
      prev.includes(categoria) 
        ? prev.filter(c => c !== categoria)
        : [...prev, categoria]
    );
  };

  const limpiarDatos = async () => {
    if (categoriasSeleccionadas.length === 0) {
      alert('⚠️ Selecciona al menos una categoría para limpiar');
      return;
    }

    const categoriasTexto = categoriasSeleccionadas.map(c => {
      switch(c) {
        case 'pedidos': return 'Todos los Pedidos (entrada, asignación, gestión)';
        case 'chats': return 'Chats Grupales de Eventos';
        case 'mensajes': return 'Mensajes de WhatsApp y Email enviados';
        case 'registros-qr': return 'Registros de entrada/salida QR';
        default: return c;
      }
    }).join('\n• ');

    if (!window.confirm(
      `⚠️ ADVERTENCIA: Esta acción es IRREVERSIBLE\n\n` +
      `Se eliminarán los siguientes datos:\n\n• ${categoriasTexto}\n\n` +
      `¿Estás ABSOLUTAMENTE SEGURO de que deseas continuar?`
    )) {
      return;
    }

    // Segunda confirmación para mayor seguridad
    if (!window.confirm('⚠️ ÚLTIMA CONFIRMACIÓN\n\nEsta es tu última oportunidad para cancelar.\n\n¿Proceder con la eliminación?')) {
      return;
    }

    setLimpiandoDatos(true);

    try {
      console.log('🧹 Iniciando limpieza de datos:', categoriasSeleccionadas);

      const response = await fetch(`${baseUrl}/limpiar-datos`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ categorias: categoriasSeleccionadas })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const mensaje = Object.entries(result.eliminados)
          .map(([key, value]) => `• ${key}: ${value} registros`)
          .join('\n');
        
        alert(`✅ Limpieza completada exitosamente\n\nDatos eliminados:\n${mensaje}`);
        
        // Limpiar selección
        setCategoriasSeleccionadas([]);
        
        // Recargar la página
        window.location.reload();
      } else {
        console.error('❌ Error en la limpieza:', result);
        alert(`❌ Error al limpiar datos: ${result.error || 'Error desconocido'}`);
      }
    } catch (error: any) {
      console.error('Error en limpieza de datos:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLimpiandoDatos(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="w-8 h-8 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h2>
          <p className="text-gray-600">Configura y prueba las integraciones de WhatsApp y Email</p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b overflow-x-auto">
          <div className="flex min-w-max">
            {subTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                    activeSubTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeSubTab === 'whatsapp' && (
            <WhatsAppConfig baseUrl={baseUrl} publicAnonKey={publicAnonKey} />
          )}
          
          {activeSubTab === 'chatbot' && (
            <WhatsAppChatbotConfig baseUrl={baseUrl} publicAnonKey={publicAnonKey} />
          )}
          
          {activeSubTab === 'whatsapp-test' && (
            <WhatsAppTest
              baseUrl={baseUrl}
              publicAnonKey={publicAnonKey}
              camareros={camareros}
              coordinadores={coordinadores}
              pedidos={pedidos}
            />
          )}
          
          {activeSubTab === 'test-panel' && (
            <TestPanel />
          )}
          
          {activeSubTab === 'test-email' && (
            <TestEmail baseUrl={baseUrl} publicAnonKey={publicAnonKey} />
          )}

          {activeSubTab === 'passwords' && (
            <PasswordControlPanel baseUrl={baseUrl} publicAnonKey={publicAnonKey} />
          )}

          {activeSubTab === 'notificaciones' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Bell className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Centro de Notificaciones</h3>
                    <p className="text-gray-600">Configura cómo y cuándo recibir notificaciones del sistema</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Notificación: Nuevo Pedido */}
                  <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 text-xl">📋</span>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">Nuevo Pedido Creado</h4>
                            <p className="text-sm text-gray-600">Recibir notificación cuando se agrega un pedido nuevo al sistema</p>
                          </div>
                        </div>
                        <div className="ml-13 mt-3 space-y-2">
                          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                            <span>Enviar por WhatsApp</span>
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                            <span>Enviar por Email</span>
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                            <span>Notificación en la aplicación</span>
                          </label>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Activa
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Notificación: Confirmación de Servicio */}
                  <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-xl">✅</span>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">Perfil Confirma Servicio</h4>
                            <p className="text-sm text-gray-600">Recibir notificación cuando un camarero confirma su asistencia a un evento</p>
                          </div>
                        </div>
                        <div className="ml-13 mt-3 space-y-2">
                          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                            <span>Enviar por WhatsApp</span>
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                            <span>Enviar por Email</span>
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                            <span>Notificación en la aplicación</span>
                          </label>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Activa
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Notificación: Rechazo de Servicio */}
                  <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-600 text-xl">❌</span>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">Perfil Rechaza Servicio</h4>
                            <p className="text-sm text-gray-600">Recibir notificación cuando un camarero rechaza un evento asignado</p>
                          </div>
                        </div>
                        <div className="ml-13 mt-3 space-y-2">
                          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                            <span>Enviar por WhatsApp (Alta prioridad)</span>
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                            <span>Enviar por Email</span>
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                            <span>Notificación en la aplicación</span>
                          </label>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Alta Prioridad
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Notificación: Mensaje de Cliente */}
                  <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 text-xl">💬</span>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">Mensaje de Cliente</h4>
                            <p className="text-sm text-gray-600">Recibir notificación cuando un cliente envía un mensaje a través del chatbot</p>
                          </div>
                        </div>
                        <div className="ml-13 mt-3 space-y-2">
                          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                            <span>Enviar por WhatsApp</span>
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                            <span>Enviar por Email</span>
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                            <span>Notificación en la aplicación</span>
                          </label>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Activa
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Configuración Global */}
                <div className="mt-6 bg-gray-50 rounded-lg p-5 border border-gray-300">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Configuración Global de Notificaciones</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de teléfono para notificaciones
                      </label>
                      <input
                        type="tel"
                        placeholder="+34 600 000 000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email para notificaciones
                      </label>
                      <input
                        type="email"
                        placeholder="admin@empresa.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Horario de notificaciones
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="always">24/7 - Siempre activo</option>
                        <option value="business">Horario laboral (9:00 - 21:00)</option>
                        <option value="custom">Personalizado</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frecuencia de resumen
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="instant">Instantáneas (en tiempo real)</option>
                        <option value="hourly">Cada hora</option>
                        <option value="daily">Resumen diario</option>
                        <option value="weekly">Resumen semanal</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      <span className="font-medium">No Molestar (silenciar todas las notificaciones)</span>
                    </label>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Guardar Configuración
                    </button>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium mb-1">ℹ️ Información</p>
                  <p className="text-sm text-blue-700">
                    Las notificaciones te ayudan a estar al tanto de eventos importantes en tiempo real. Puedes personalizar cada tipo de notificación según tus preferencias.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'alertas' && (
            <AlertasConfig baseUrl={baseUrl} publicAnonKey={publicAnonKey} />
          )}

          {activeSubTab === 'utilidades' && (
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                  <Trash2 className="w-5 h-5" />
                  Eliminar Pedido Específico
                </h3>
                <p className="text-sm text-red-700 mb-4">
                  Esta herramienta permite eliminar pedidos que no se pueden eliminar desde la interfaz normal.
                </p>
                
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Pedidos Actuales:</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {pedidos.map(pedido => (
                      <div key={pedido.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                        <div className="flex-1">
                          <span className="font-mono font-bold text-blue-600">{pedido.numero}</span>
                          <span className="text-gray-600 ml-3">{pedido.cliente}</span>
                          <span className="text-gray-500 ml-3 text-sm">{pedido.lugar}</span>
                          <span className="text-gray-400 ml-3 text-sm">{pedido.diaEvento}</span>
                        </div>
                        <button
                          onClick={() => eliminarPedidoPorNumero(pedido.numero)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          Eliminar
                        </button>
                      </div>
                    ))}
                    {pedidos.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No hay pedidos en el sistema</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800 font-medium">⚠️ Precaución:</p>
                  <p className="text-sm text-amber-700 mt-1">
                    La eliminación es permanente y no se puede deshacer. Asegúrate de seleccionar el pedido correcto.
                  </p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                  <Trash2 className="w-5 h-5" />
                  Limpieza Masiva de Datos
                </h3>
                <p className="text-sm text-red-700 mb-4">
                  Esta herramienta permite eliminar datos de manera masiva del sistema.
                </p>
                
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Categorías Disponibles:</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {[
                      { id: 'pedidos', label: 'Pedidos', descripcion: 'Todos los Pedidos (entrada, asignación, gestión)' },
                      { id: 'chats', label: 'Chats', descripcion: 'Chats Grupales de Eventos' },
                      { id: 'mensajes', label: 'Mensajes', descripcion: 'Mensajes de WhatsApp y Email enviados' },
                      { id: 'registros-qr', label: 'Registros QR', descripcion: 'Registros de entrada/salida QR' }
                    ].map((categoria) => (
                      <div key={categoria.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                        <div className="flex-1">
                          <span className="font-mono font-bold text-blue-600">{categoria.label}</span>
                          <span className="text-gray-600 ml-3">{categoria.descripcion}</span>
                        </div>
                        <button
                          onClick={() => toggleCategoria(categoria.id)}
                          className={`px-4 py-2 ${categoriasSeleccionadas.includes(categoria.id) ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'} rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm font-medium`}
                        >
                          <Trash2 className="w-4 h-4" />
                          {categoriasSeleccionadas.includes(categoria.id) ? 'Seleccionado' : 'Seleccionar'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800 font-medium">⚠️ Precaución:</p>
                  <p className="text-sm text-amber-700 mt-1">
                    La eliminación es permanente y no se puede deshacer. Asegúrate de seleccionar las categorías correctas.
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    onClick={limpiarDatos}
                    className={`px-4 py-2 ${limpiandoDatos ? 'bg-gray-500 text-gray-300' : 'bg-red-600 text-white'} rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm font-medium`}
                    disabled={limpiandoDatos}
                  >
                    <Trash2 className="w-4 h-4" />
                    {limpiandoDatos ? 'Limpiando...' : 'Limpiar Datos'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}