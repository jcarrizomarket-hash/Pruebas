import { useState } from 'react';
import { Database, Play, Trash2, CheckCircle, XCircle, Loader2, AlertTriangle, Info, Server } from 'lucide-react';
import { 
  inicializarTodosDatos,
  inicializarCoordinadores,
  inicializarCamareros,
  inicializarClientes,
  inicializarPedidos,
  inicializarUsuarios,
  coordinadoresPrueba,
  camarerosPrueba,
  clientesPrueba,
  pedidosPrueba,
  usuariosPrueba
} from '../utils/init-test-data';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function InitTestPanel() {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const [mostrarCredenciales, setMostrarCredenciales] = useState(false);

  const ejecutarInicializacion = async () => {
    if (!confirm('¿Estás seguro de inicializar la base de datos con datos de prueba?\n\nEsto creará:\n- 2 Coordinadores\n- 5 Camareros\n- 3 Clientes\n- 3 Pedidos\n- 3 Usuarios del sistema')) {
      return;
    }

    setLoading(true);
    setResultado(null);

    try {
      const result = await inicializarTodosDatos();
      setResultado(result);
      setMostrarCredenciales(true);
      
      // Recargar la página después de 2 segundos para que se vean los datos
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    } catch (error) {
      setResultado({ success: false, error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  const estadisticas = {
    coordinadores: coordinadoresPrueba.length,
    camareros: camarerosPrueba.length,
    clientes: clientesPrueba.length,
    pedidos: pedidosPrueba.length,
    usuarios: usuariosPrueba.length
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-xl p-8 mb-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
            <Database className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Panel de Inicialización</h1>
            <p className="text-blue-100">Base de Datos: Pruebas Gestión de Servicios</p>
          </div>
        </div>
      </div>

      {/* Información de Conexión a Supabase */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="bg-green-500 p-3 rounded-xl">
            <Server className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-green-900 mb-3">
              ✅ Conectado a Supabase
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="text-xs text-gray-600 mb-1 font-semibold uppercase tracking-wide">Project ID</div>
                <code className="text-sm bg-green-50 px-3 py-1.5 rounded border border-green-200 text-green-900 font-mono block">
                  {projectId}
                </code>
              </div>
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="text-xs text-gray-600 mb-1 font-semibold uppercase tracking-wide">Nombre del Proyecto</div>
                <div className="text-sm font-bold text-green-900">
                  Pruebas Gestión de Servicios
                </div>
              </div>
            </div>
            <div className="mt-3 text-sm text-green-800 bg-white/50 rounded-lg p-3 border border-green-200">
              <strong>⚡ Estado:</strong> Este panel está conectado a tu base de datos de Supabase. 
              Los datos de prueba se crearán directamente en las tablas de este proyecto.
            </div>
          </div>
        </div>
      </div>

      {/* Advertencia */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-amber-900 mb-2">⚠️ Importante - Lee antes de continuar</h3>
            <ul className="space-y-2 text-sm text-amber-800">
              <li>• Esta función creará datos de prueba REALES en tu base de datos de Supabase</li>
              <li>• Asegúrate de estar conectado al proyecto correcto: <strong>"Pruebas Gestión de Servicios"</strong></li>
              <li>• Los datos creados son para PRUEBAS y DESARROLLO</li>
              <li>• Después de inicializar, la página se recargará automáticamente</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Estadísticas de lo que se va a crear */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
          <div className="text-3xl font-bold text-blue-600 mb-1">{estadisticas.coordinadores}</div>
          <div className="text-sm text-gray-600">Coordinadores</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
          <div className="text-3xl font-bold text-green-600 mb-1">{estadisticas.camareros}</div>
          <div className="text-sm text-gray-600">Camareros</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
          <div className="text-3xl font-bold text-purple-600 mb-1">{estadisticas.clientes}</div>
          <div className="text-sm text-gray-600">Clientes</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
          <div className="text-3xl font-bold text-orange-600 mb-1">{estadisticas.pedidos}</div>
          <div className="text-sm text-gray-600">Eventos</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
          <div className="text-3xl font-bold text-red-600 mb-1">{estadisticas.usuarios}</div>
          <div className="text-sm text-gray-600">Usuarios</div>
        </div>
      </div>

      {/* Botón de acción */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6 border border-gray-200">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Inicializar Base de Datos</h2>
          <p className="text-gray-600">
            Esto creará todos los datos de prueba en tu proyecto de Supabase
          </p>
        </div>

        <button
          onClick={ejecutarInicializacion}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Inicializando Base de Datos...
            </>
          ) : (
            <>
              <Play className="w-6 h-6" />
              Inicializar Datos de Prueba
            </>
          )}
        </button>
      </div>

      {/* Resultado */}
      {resultado && (
        <div className={`rounded-xl shadow-lg p-6 mb-6 border-2 ${
          resultado.success 
            ? 'bg-green-50 border-green-500' 
            : 'bg-red-50 border-red-500'
        }`}>
          <div className="flex items-start gap-3 mb-4">
            {resultado.success ? (
              <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
            ) : (
              <XCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
            )}
            <div className="flex-1">
              <h3 className={`text-xl font-bold mb-2 ${
                resultado.success ? 'text-green-900' : 'text-red-900'
              }`}>
                {resultado.success ? '✅ Inicialización Completada' : '❌ Error en la Inicialización'}
              </h3>
              {resultado.success ? (
                <p className="text-green-800 mb-4">
                  Los datos de prueba se han creado correctamente en Supabase.
                  La página se recargará en 5 segundos...
                </p>
              ) : (
                <p className="text-red-800">
                  Error: {resultado.error || 'Error desconocido'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Credenciales de acceso */}
      {mostrarCredenciales && (
        <div className="bg-blue-50 border-2 border-blue-500 rounded-xl shadow-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-blue-900 mb-4">
                🔑 Credenciales de Acceso
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="font-bold text-blue-900 mb-2">👤 Administrador</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <code className="ml-2 bg-gray-100 px-2 py-1 rounded">admin@gestion.com</code>
                    </div>
                    <div>
                      <span className="text-gray-600">Password:</span>
                      <code className="ml-2 bg-gray-100 px-2 py-1 rounded">Admin123!</code>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="font-bold text-blue-900 mb-2">👤 Coordinador</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <code className="ml-2 bg-gray-100 px-2 py-1 rounded">coordinador@gestion.com</code>
                    </div>
                    <div>
                      <span className="text-gray-600">Password:</span>
                      <code className="ml-2 bg-gray-100 px-2 py-1 rounded">Coord123!</code>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="font-bold text-blue-900 mb-2">👤 Perfil (Camarero)</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <code className="ml-2 bg-gray-100 px-2 py-1 rounded">ana.martinez@email.com</code>
                    </div>
                    <div>
                      <span className="text-gray-600">Password:</span>
                      <code className="ml-2 bg-gray-100 px-2 py-1 rounded">Ana123!</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vista previa de datos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Coordinadores */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Database className="w-4 h-4 text-blue-600" />
            </div>
            Coordinadores ({coordinadoresPrueba.length})
          </h3>
          <div className="space-y-3">
            {coordinadoresPrueba.map((coord, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="font-semibold text-gray-900">{coord.nombre} {coord.apellido}</div>
                <div className="text-sm text-gray-600">{coord.zona}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Camareros */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="bg-green-100 p-2 rounded-lg">
              <Database className="w-4 h-4 text-green-600" />
            </div>
            Camareros ({camarerosPrueba.length})
          </h3>
          <div className="space-y-3">
            {camarerosPrueba.slice(0, 3).map((cam, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="font-semibold text-gray-900">{cam.nombre} {cam.apellido}</div>
                <div className="text-sm text-gray-600">{cam.categoria} - {cam.experiencia}</div>
              </div>
            ))}
            {camarerosPrueba.length > 3 && (
              <div className="text-sm text-gray-500 text-center">
                +{camarerosPrueba.length - 3} más...
              </div>
            )}
          </div>
        </div>

        {/* Clientes */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Database className="w-4 h-4 text-purple-600" />
            </div>
            Clientes ({clientesPrueba.length})
          </h3>
          <div className="space-y-3">
            {clientesPrueba.map((cliente, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="font-semibold text-gray-900">{cliente.nombre}</div>
                <div className="text-sm text-gray-600">{cliente.tipo}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Eventos */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Database className="w-4 h-4 text-orange-600" />
            </div>
            Eventos ({pedidosPrueba.length})
          </h3>
          <div className="space-y-3">
            {pedidosPrueba.map((pedido, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="font-semibold text-gray-900">{pedido.tipoEvento}</div>
                <div className="text-sm text-gray-600">{pedido.cliente} - {pedido.diaEvento}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}