import React, { useState, useMemo, useEffect } from 'react';
import { Download, Filter, X, Clock, CheckCircle2, XCircle, Edit2, Save, Calendar } from 'lucide-react';
import * as XLSX from 'xlsx';
import { getReadHeaders, getWriteHeaders } from '../utils/api-headers';

interface RegistrosQRSectionProps {
  baseUrl: string;
  publicAnonKey: string;
}

export function RegistrosQRSection({ baseUrl, publicAnonKey }: RegistrosQRSectionProps) {
  const [registros, setRegistros] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);
  const [clienteFiltro, setClienteFiltro] = useState('');
  const [camareroFiltro, setCamareroFiltro] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [showFiltros, setShowFiltros] = useState(false);
  
  // Estados para edición
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [horaSalidaEdit, setHoraSalidaEdit] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Cargar registros desde el backend
  useEffect(() => {
    cargarRegistros();
  }, []);

  const cargarRegistros = async () => {
    setCargando(true);
    try {
      const response = await fetch(`${baseUrl}/registros-qr`, {
        headers: getReadHeaders()
      });
      
      const result = await response.json();
      if (result.success) {
        setRegistros(result.registros || []);
      }
    } catch (error) {
      console.log('Error al cargar registros QR:', error);
    } finally {
      setCargando(false);
    }
  };

  // Obtener listas únicas para filtros
  const clientesUnicos = useMemo(() => {
    const clientes = new Set();
    registros.forEach(r => {
      if (r.cliente) clientes.add(r.cliente);
    });
    return Array.from(clientes).sort();
  }, [registros]);

  const camarerosUnicos = useMemo(() => {
    const camareros = new Set();
    registros.forEach(r => {
      if (r.nombreCamarero) camareros.add(r.nombreCamarero);
    });
    return Array.from(camareros).sort();
  }, [registros]);

  // Aplicar filtros
  const registrosFiltrados = useMemo(() => {
    let resultado = [...registros];
    
    if (clienteFiltro) {
      resultado = resultado.filter(r => 
        r.cliente.toLowerCase().includes(clienteFiltro.toLowerCase())
      );
    }
    
    if (camareroFiltro) {
      resultado = resultado.filter(r => 
        r.nombreCamarero.toLowerCase().includes(camareroFiltro.toLowerCase())
      );
    }
    
    if (fechaDesde) {
      const fechaDesdeObj = new Date(fechaDesde);
      resultado = resultado.filter(r => 
        new Date(r.fechaEventoFormateada) >= fechaDesdeObj
      );
    }
    
    if (fechaHasta) {
      const fechaHastaObj = new Date(fechaHasta);
      resultado = resultado.filter(r => 
        new Date(r.fechaEventoFormateada) <= fechaHastaObj
      );
    }
    
    return resultado;
  }, [registros, clienteFiltro, camareroFiltro, fechaDesde, fechaHasta]);

  // Exportar a Excel con filtros
  const exportarExcel = () => {
    if (registrosFiltrados.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    // Preparar datos para Excel
    const datosExcel = registrosFiltrados.map(r => ({
      'Fecha Evento': r.fechaEventoFormateada,
      'Día': r.diaEvento,
      'Cliente': r.cliente,
      'Evento': r.evento,
      'Lugar': r.lugar,
      'Código Camarero': r.codigoCamarero,
      'Nombre Camarero': r.nombreCamarero,
      'Teléfono': r.telefono,
      'Turno': r.turno,
      'Hora Entrada Prevista': r.horaEntradaPrevista,
      'Hora Entrada Real': r.horaEntradaReal || 'Sin registro',
      'Entrada Registrada': r.entradaRegistrada ? 'Sí' : 'No',
      'Hora Salida Prevista': r.horaSalidaPrevista,
      'Hora Salida Real': r.horaSalidaReal || 'Sin registro',
      'Salida Registrada': r.salidaRegistrada ? 'Sí' : 'No',
      'Horas Trabajadas': r.horasTrabajadas || 'N/A'
    }));

    // Crear libro de trabajo
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datosExcel);

    // Aplicar auto-filtros a todas las columnas
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    ws['!autofilter'] = { ref: XLSX.utils.encode_range(range) };

    // Ajustar ancho de columnas
    ws['!cols'] = [
      { wch: 14 }, // Fecha Evento
      { wch: 10 }, // Día
      { wch: 25 }, // Cliente
      { wch: 20 }, // Evento
      { wch: 25 }, // Lugar
      { wch: 15 }, // Código Camarero
      { wch: 30 }, // Nombre Camarero
      { wch: 15 }, // Teléfono
      { wch: 15 }, // Turno
      { wch: 18 }, // Hora Entrada Prevista
      { wch: 18 }, // Hora Entrada Real
      { wch: 16 }, // Entrada Registrada
      { wch: 18 }, // Hora Salida Prevista
      { wch: 18 }, // Hora Salida Real
      { wch: 16 }, // Salida Registrada
      { wch: 16 }  // Horas Trabajadas
    ];

    // Agregar hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, 'Registros QR');

    // Descargar archivo
    const fecha = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `registros_qr_${fecha}.xlsx`);
  };

  const limpiarFiltros = () => {
    setClienteFiltro('');
    setCamareroFiltro('');
    setFechaDesde('');
    setFechaHasta('');
  };

  // Funciones para filtros rápidos de fechas
  const aplicarFiltroHoy = () => {
    const hoy = new Date().toISOString().split('T')[0];
    setFechaDesde(hoy);
    setFechaHasta(hoy);
  };

  const aplicarFiltroEstaSemana = () => {
    const hoy = new Date();
    const primerDia = new Date(hoy.setDate(hoy.getDate() - hoy.getDay() + 1)); // Lunes
    const ultimoDia = new Date(hoy.setDate(hoy.getDate() - hoy.getDay() + 7)); // Domingo
    setFechaDesde(primerDia.toISOString().split('T')[0]);
    setFechaHasta(ultimoDia.toISOString().split('T')[0]);
  };

  const aplicarFiltroEsteMes = () => {
    const hoy = new Date();
    const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
    setFechaDesde(primerDia.toISOString().split('T')[0]);
    setFechaHasta(ultimoDia.toISOString().split('T')[0]);
  };

  const aplicarFiltroUltimos7Dias = () => {
    const hoy = new Date();
    const hace7Dias = new Date(hoy);
    hace7Dias.setDate(hace7Dias.getDate() - 7);
    setFechaDesde(hace7Dias.toISOString().split('T')[0]);
    setFechaHasta(new Date().toISOString().split('T')[0]);
  };

  const aplicarFiltroUltimos30Dias = () => {
    const hoy = new Date();
    const hace30Dias = new Date(hoy);
    hace30Dias.setDate(hace30Dias.getDate() - 30);
    setFechaDesde(hace30Dias.toISOString().split('T')[0]);
    setFechaHasta(new Date().toISOString().split('T')[0]);
  };

  // Funciones para edición
  const iniciarEdicion = (registro: any) => {
    setEditandoId(registro.id);
    // Si ya tiene hora de salida, la usamos, si no, usamos la prevista
    const horaInicial = registro.horaSalidaReal || registro.horaSalidaPrevista || '18:00';
    setHoraSalidaEdit(horaInicial);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setHoraSalidaEdit('');
  };

  const guardarEdicion = async (registro: any) => {
    if (!editandoId || !horaSalidaEdit) return;
    
    setGuardando(true);
    try {
      const response = await fetch(
        `${baseUrl}/registros-qr/${registro.pedidoId}/${registro.camareroId}/salida`,
        {
          method: 'PUT',
          headers: getWriteHeaders(),
          body: JSON.stringify({ horaSalida: horaSalidaEdit })
        }
      );
      
      const result = await response.json();
      if (result.success) {
        // Recargar todos los registros para obtener datos actualizados
        await cargarRegistros();
        setEditandoId(null);
        setHoraSalidaEdit('');
      } else {
        alert('Error al guardar: ' + (result.error || 'Error desconocido'));
      }
    } catch (error) {
      console.log('Error al guardar edición:', error);
      alert('Error al guardar el horario de salida');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header con filtros y exportación */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Registros de Entrada/Salida QR
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Historial completo de registros de entrada y salida del personal
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFiltros(!showFiltros)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              {showFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
            </button>
            <button
              onClick={cargarRegistros}
              disabled={cargando}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
            >
              <Clock className="w-4 h-4" />
              {cargando ? 'Cargando...' : 'Actualizar'}
            </button>
            <button
              onClick={exportarExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar Excel
            </button>
          </div>
        </div>

        {/* Panel de filtros */}
        {showFiltros && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrar por Cliente
                </label>
                <input
                  type="text"
                  value={clienteFiltro}
                  onChange={(e) => setClienteFiltro(e.target.value)}
                  placeholder="Buscar cliente..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {clientesUnicos.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {(clientesUnicos as string[]).slice(0, 5).map((cliente) => (
                      <button
                        key={cliente}
                        onClick={() => setClienteFiltro(cliente)}
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                      >
                        {cliente}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrar por Camarero
                </label>
                <input
                  type="text"
                  value={camareroFiltro}
                  onChange={(e) => setCamareroFiltro(e.target.value)}
                  placeholder="Buscar camarero..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {camarerosUnicos.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {(camarerosUnicos as string[]).slice(0, 5).map((camarero) => (
                      <button
                        key={camarero}
                        onClick={() => setCamareroFiltro(camarero)}
                        className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded hover:bg-purple-200"
                      >
                        {camarero}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrar por Fecha Desde
                </label>
                <input
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrar por Fecha Hasta
                </label>
                <input
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Filtros Rápidos de Fecha
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={aplicarFiltroHoy}
                  className="px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-lg hover:bg-indigo-200 text-sm font-medium"
                >
                  Hoy
                </button>
                <button
                  onClick={aplicarFiltroEstaSemana}
                  className="px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-lg hover:bg-indigo-200 text-sm font-medium"
                >
                  Esta Semana
                </button>
                <button
                  onClick={aplicarFiltroEsteMes}
                  className="px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-lg hover:bg-indigo-200 text-sm font-medium"
                >
                  Este Mes
                </button>
                <button
                  onClick={aplicarFiltroUltimos7Dias}
                  className="px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-lg hover:bg-indigo-200 text-sm font-medium"
                >
                  Últimos 7 Días
                </button>
                <button
                  onClick={aplicarFiltroUltimos30Dias}
                  className="px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-lg hover:bg-indigo-200 text-sm font-medium"
                >
                  Últimos 30 Días
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={limpiarFiltros}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2 text-sm"
              >
                <X className="w-4 h-4" />
                Limpiar Filtros
              </button>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-600 mt-3">
          Total de registros: <span className="font-semibold">{registrosFiltrados.length}</span>
          {registros.length !== registrosFiltrados.length && (
            <span className="text-blue-600 ml-2">
              ({registrosFiltrados.length} de {registros.length} mostrados)
            </span>
          )}
          {/* Indicadores de filtros activos */}
          {(clienteFiltro || camareroFiltro || fechaDesde || fechaHasta) && (
            <div className="inline-flex items-center ml-4 gap-1 flex-wrap">
              <span className="text-gray-500">•</span>
              {clienteFiltro && (
                <span key="filtro-cliente" className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  Cliente: {clienteFiltro}
                </span>
              )}
              {camareroFiltro && (
                <span key="filtro-camarero" className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                  Camarero: {camareroFiltro}
                </span>
              )}
              {fechaDesde && (
                <span key="filtro-desde" className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                  Desde: {fechaDesde}
                </span>
              )}
              {fechaHasta && (
                <span key="filtro-hasta" className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                  Hasta: {fechaHasta}
                </span>
              )}
            </div>
          )}
        </p>
      </div>

      {/* Tabla de Registros */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Camarero
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entrada Prevista
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entrada Real
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Salida Prevista
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Salida Real
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Horas
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cargando ? (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                  Cargando registros...
                </td>
              </tr>
            ) : registrosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                  No hay registros para mostrar
                </td>
              </tr>
            ) : (
              registrosFiltrados.map((registro) => (
                <tr key={registro.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{registro.fechaEventoFormateada}</div>
                    <div className="text-xs text-gray-500">{registro.diaEvento}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">{registro.cliente}</div>
                    <div className="text-xs text-gray-500">{registro.evento}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">{registro.nombreCamarero}</div>
                    <div className="text-xs text-gray-500">
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">
                        {registro.codigoCamarero}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                    {registro.horaEntradaPrevista || '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    {registro.entradaRegistrada ? (
                      <div>
                        <div className="text-sm font-medium text-green-800">{registro.horaEntradaReal}</div>
                        <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto mt-1" />
                      </div>
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                    {registro.horaSalidaPrevista || '-'}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {editandoId === registro.id ? (
                      <div className="flex flex-col items-center gap-2">
                        <input
                          type="time"
                          value={horaSalidaEdit}
                          onChange={(e) => setHoraSalidaEdit(e.target.value)}
                          className="w-28 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <div className="flex gap-1">
                          <button
                            onClick={() => guardarEdicion(registro)}
                            disabled={guardando}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs font-medium disabled:opacity-50 flex items-center gap-1"
                          >
                            <Save className="w-3 h-3" />
                            {guardando ? 'Guardando...' : 'Guardar'}
                          </button>
                          <button
                            onClick={cancelarEdicion}
                            disabled={guardando}
                            className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-xs font-medium disabled:opacity-50"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : registro.salidaRegistrada ? (
                      <div className="flex flex-col items-center gap-2">
                        <div>
                          <div className="text-sm font-medium text-green-800">{registro.horaSalidaReal}</div>
                          <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto mt-1" />
                        </div>
                        <button
                          onClick={() => iniciarEdicion(registro)}
                          className="px-2 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-xs font-medium flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          Modificar
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                        <button
                          onClick={() => iniciarEdicion(registro)}
                          className="px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-medium flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          Registrar
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    {registro.horasTrabajadas ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {registro.horasTrabajadas}h
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    {registro.entradaRegistrada && registro.salidaRegistrada ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completo
                      </span>
                    ) : registro.entradaRegistrada ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        En servicio
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Pendiente
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}