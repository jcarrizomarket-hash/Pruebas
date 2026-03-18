import { useState, useEffect } from 'react';
import { ClipboardList, Calendar, Clock, MapPin, Users, Download } from 'lucide-react';
import { Button } from './ui/button';
import * as XLSX from 'xlsx';
import { getReadHeaders, getWriteHeaders } from '../utils/api-headers';

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

  useEffect(() => {
    cargarRegistros();
  }, []);

  const cargarRegistros = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/registros-perfil?email=${encodeURIComponent(userEmail)}`, {
        headers: getReadHeaders()
      });
      const result = await response.json();
      
      if (result.success) {
        setRegistros(result.registros || []);
      }
    } catch (error) {
      console.error('Error al cargar registros:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportarExcel = () => {
    if (registros.length === 0) {
      alert('No hay registros para exportar');
      return;
    }

    // Preparar datos para Excel
    const datosExcel = registros.map(reg => ({
      'Fecha': reg.fechaEventoFormateada,
      'Día': reg.diaEvento,
      'Cliente': reg.cliente,
      'Evento': reg.evento,
      'Lugar': reg.lugar,
      'Hora Entrada': reg.horaEntradaReal || 'N/A',
      'Hora Salida': reg.horaSalidaReal || 'N/A',
      'Horas Trabajadas': reg.horasTrabajadas || 'N/A'
    }));

    // Crear libro de Excel
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datosExcel);

    // Ajustar ancho de columnas
    const colWidths = [
      { wch: 12 }, // Fecha
      { wch: 10 }, // Día
      { wch: 25 }, // Cliente
      { wch: 20 }, // Evento
      { wch: 25 }, // Lugar
      { wch: 12 }, // Hora Entrada
      { wch: 12 }, // Hora Salida
      { wch: 15 }  // Horas Trabajadas
    ];
    ws['!cols'] = colWidths;

    // Agregar hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, 'Mis Registros');

    // Descargar archivo
    XLSX.writeFile(wb, `Mis_Registros_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ClipboardList className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mis Registros de Trabajo</h1>
                <p className="text-gray-600">Historial de entradas y salidas en eventos</p>
              </div>
            </div>
            <Button
              onClick={exportarExcel}
              className="flex items-center gap-2"
              disabled={registros.length === 0}
            >
              <Download className="w-4 h-4" />
              Exportar Excel
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Eventos</p>
                <p className="text-2xl font-bold text-gray-900">{registros.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Horas Totales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {registros.reduce((total, reg) => {
                    if (reg.horasTrabajadas) {
                      return total + parseFloat(reg.horasTrabajadas);
                    }
                    return total;
                  }, 0).toFixed(2)}h
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Clientes Diferentes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(registros.map(r => r.cliente)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de Registros */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Evento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lugar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hora Entrada
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hora Salida
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horas
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registros.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No hay registros disponibles
                    </td>
                  </tr>
                ) : (
                  registros.map((registro) => (
                    <tr key={registro.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {registro.fechaEventoFormateada}
                            </div>
                            <div className="text-xs text-gray-500">
                              {registro.diaEvento}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{registro.cliente}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{registro.evento}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{registro.lugar}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center gap-2 ${registro.horaEntradaReal ? 'text-green-700' : 'text-gray-400'}`}>
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {registro.horaEntradaReal || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center gap-2 ${registro.horaSalidaReal ? 'text-red-700' : 'text-gray-400'}`}>
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {registro.horaSalidaReal || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600">
                          {registro.horasTrabajadas ? `${registro.horasTrabajadas}h` : 'N/A'}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}