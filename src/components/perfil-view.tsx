import { useState, useEffect } from 'react';
import { ClipboardList, Calendar, Clock, MapPin, Users, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import * as XLSX from 'xlsx';
import { getReadHeaders } from '../utils/api-headers';

interface PerfilViewProps {
  baseUrl: string;
  publicAnonKey: string;
  userEmail: string;
}

interface Registro {
  id: string;
  fechaEvento: string;
  fechaEventoFormateada: string;
  cliente: string;
  evento: string;
  lugar: string;
  horaEntradaReal?: string;
  horaSalidaReal?: string;
  horasTrabajadas?: string;
  diaEvento: string;
}

export function PerfilView({ baseUrl, publicAnonKey, userEmail }: PerfilViewProps) {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mostrarPasados, setMostrarPasados] = useState(false);

  useEffect(() => {
    cargarRegistros();
  }, []);

  const cargarRegistros = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${baseUrl}/registros-perfil?email=${encodeURIComponent(userEmail)}`, {
        headers: getReadHeaders()
      });
      const result = await response.json();
      if (result.success) {
        setRegistros(result.registros || []);
      } else {
        setError('No se pudieron cargar los registros. Intentá de nuevo.');
      }
    } catch (error) {
      console.error('Error al cargar registros:', error);
      setError('Error de conexión. Verificá tu internet e intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const serviciosFuturos = registros
    .filter(r => new Date(r.fechaEvento) >= hoy)
    .sort((a, b) => new Date(a.fechaEvento).getTime() - new Date(b.fechaEvento).getTime());

  const serviciosPasados = registros
    .filter(r => new Date(r.fechaEvento) < hoy)
    .sort((a, b) => new Date(b.fechaEvento).getTime() - new Date(a.fechaEvento).getTime());

  const totalHoras = serviciosPasados.reduce((total, reg) => {
    if (reg.horasTrabajadas) return total + parseFloat(reg.horasTrabajadas);
    return total;
  }, 0);

  const exportarExcel = () => {
    if (serviciosPasados.length === 0) {
      alert('No hay servicios realizados para exportar');
      return;
    }
    const datosExcel = serviciosPasados.map(reg => ({
      'Fecha': reg.fechaEventoFormateada,
      'Día': reg.diaEvento,
      'Cliente': reg.cliente,
      'Evento': reg.evento,
      'Lugar': reg.lugar,
      'Hora Entrada': reg.horaEntradaReal || 'Sin registrar',
      'Hora Salida': reg.horaSalidaReal || 'Sin registrar',
      'Horas Trabajadas': reg.horasTrabajadas ? `${reg.horasTrabajadas}h` : 'Sin registrar'
    }));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datosExcel);
    ws['!cols'] = [
      { wch: 12 }, { wch: 10 }, { wch: 25 }, { wch: 20 },
      { wch: 25 }, { wch: 12 }, { wch: 12 }, { wch: 15 }
    ];
    XLSX.utils.book_append_sheet(wb, ws, 'Mis Servicios');
    XLSX.writeFile(wb, `Mis_Servicios_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Cargando tus servicios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-8 max-w-md">
          <p className="text-red-700 font-medium mb-3">{error}</p>
          <Button onClick={cargarRegistros} variant="outline">Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <ClipboardList className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mis Servicios</h1>
                <p className="text-gray-500 text-sm">Próximos y realizados</p>
              </div>
            </div>
            <Button onClick={exportarExcel} className="flex items-center gap-2" disabled={serviciosPasados.length === 0}>
              <Download className="w-4 h-4" />
              Exportar historial
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg"><Calendar className="w-6 h-6 text-blue-600" /></div>
              <div>
                <p className="text-sm text-gray-500">Próximos servicios</p>
                <p className="text-2xl font-bold text-gray-900">{serviciosFuturos.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg"><Clock className="w-6 h-6 text-green-600" /></div>
              <div>
                <p className="text-sm text-gray-500">Horas totales</p>
                <p className="text-2xl font-bold text-gray-900">{totalHoras.toFixed(2)}h</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg"><Users className="w-6 h-6 text-purple-600" /></div>
              <div>
                <p className="text-sm text-gray-500">Servicios realizados</p>
                <p className="text-2xl font-bold text-gray-900">{serviciosPasados.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* SERVICIOS FUTUROS */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
            Próximos servicios
          </h2>
          {serviciosFuturos.length === 0 ? (
            <div className="bg-white rounded-lg border p-8 text-center text-gray-400">
              No tenés servicios asignados próximamente
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-blue-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evento</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lugar</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora de entrada</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {serviciosFuturos.map((registro) => (
                      <tr key={registro.id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{registro.fechaEventoFormateada}</div>
                              <div className="text-xs text-gray-400">{registro.diaEvento}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4"><div className="text-sm text-gray-900">{registro.cliente}</div></td>
                        <td className="px-6 py-4"><div className="text-sm text-gray-900">{registro.evento}</div></td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{registro.lugar}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`flex items-center gap-2 ${registro.horaEntradaReal ? 'text-blue-700' : 'text-gray-400'}`}>
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-semibold">{registro.horaEntradaReal || 'A confirmar'}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* SERVICIOS PASADOS — colapsable */}
        <div>
          <button
            onClick={() => setMostrarPasados(!mostrarPasados)}
            className="w-full flex items-center justify-between text-lg font-semibold text-gray-800 mb-3 hover:text-gray-600 transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-gray-400"></span>
              Servicios realizados
              <span className="text-sm font-normal text-gray-400">({serviciosPasados.length})</span>
            </span>
            {mostrarPasados ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {mostrarPasados && (
            serviciosPasados.length === 0 ? (
              <div className="bg-white rounded-lg border p-8 text-center text-gray-400">
                No hay servicios realizados aún
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evento</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lugar</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrada</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salida</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horas</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {serviciosPasados.map((registro) => (
                        <tr key={registro.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{registro.fechaEventoFormateada}</div>
                                <div className="text-xs text-gray-400">{registro.diaEvento}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4"><div className="text-sm text-gray-900">{registro.cliente}</div></td>
                          <td className="px-6 py-4"><div className="text-sm text-gray-900">{registro.evento}</div></td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-900">{registro.lugar}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`flex items-center gap-2 ${registro.horaEntradaReal ? 'text-green-700' : 'text-gray-400'}`}>
                              <Clock className="w-4 h-4" />
                              <span className="text-sm font-medium">{registro.horaEntradaReal || 'Sin registrar'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`flex items-center gap-2 ${registro.horaSalidaReal ? 'text-red-700' : 'text-gray-400'}`}>
                              <Clock className="w-4 h-4" />
                              <span className="text-sm font-medium">{registro.horaSalidaReal || 'Sin registrar'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-semibold ${registro.horasTrabajadas ? 'text-blue-600' : 'text-gray-400'}`}>
                              {registro.horasTrabajadas ? `${registro.horasTrabajadas}h` : '—'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
}