import { useState } from 'react';
import { Plus, Edit2, Trash2, Building2 } from 'lucide-react';

export function Clientes({ clientes, setClientes, baseUrl, publicAnonKey, cargarDatos }) {
  const [showForm, setShowForm] = useState(false);
  const [editandoClienteId, setEditandoClienteId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    contacto_1: '',
    telefono_1: '',
    mail_1: '',
    contacto_2: '',
    telefono_2: '',
    mail_2: '',
    notas: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (guardando) return;
    
    setGuardando(true);
    
    try {
      console.log('📤 Enviando datos del cliente:', formData);
      
      if (editandoClienteId) {
        console.log('🔄 Actualizando cliente ID:', editandoClienteId);
        const response = await fetch(`${baseUrl}/clientes/${editandoClienteId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
            'x-fn-secret': publicAnonKey
          },
          body: JSON.stringify(formData)
        });

        const result = await response.json();
        console.log('📥 Respuesta del servidor:', result);
        
        if (result.success) {
          console.log('✅ Cliente actualizado exitosamente');
          await cargarDatos();
          resetForm();
        } else {
          console.error('❌ Error al actualizar:', result.error);
          alert('Error al actualizar cliente:\n\n' + result.error);
        }
      } else {
        console.log('➕ Creando nuevo cliente');
        const response = await fetch(`${baseUrl}/clientes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
            'x-fn-secret': publicAnonKey
          },
          body: JSON.stringify(formData)
        });

        const result = await response.json();
        console.log('📥 Respuesta del servidor:', result);
        
        if (result.success) {
          console.log('✅ Cliente creado exitosamente:', result.data);
          await cargarDatos();
          resetForm();
        } else {
          console.error('❌ Error al crear:', result.error);
          alert('Error al crear cliente:\n\n' + result.error);
        }
      }
    } catch (error) {
      console.error('💥 Error de conexión:', error);
      alert('Error de conexión al guardar cliente:\n\n' + error.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleEdit = async (cliente) => {
    // Cargar información de contacto desde el servidor
    try {
      const response = await fetch(`${baseUrl}/clientes/${cliente.id}/contacto`, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`
        }
      });
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setFormData({
          nombre: cliente.nombre || '',
          contacto_1: result.data.contacto_1 || '',
          telefono_1: result.data.telefono_1 || '',
          mail_1: result.data.mail_1 || '',
          contacto_2: result.data.contacto_2 || '',
          telefono_2: result.data.telefono_2 || '',
          mail_2: result.data.mail_2 || '',
          notas: result.data.notas || ''
        });
      } else {
        setFormData({
          nombre: cliente.nombre || '',
          contacto_1: '',
          telefono_1: '',
          mail_1: '',
          contacto_2: '',
          telefono_2: '',
          mail_2: '',
          notas: ''
        });
      }
      
      setEditandoClienteId(cliente.id);
      setShowForm(true);
    } catch (error) {
      console.error('Error al cargar información de contacto:', error);
      setFormData({
        nombre: cliente.nombre || '',
        contacto_1: '',
        telefono_1: '',
        mail_1: '',
        contacto_2: '',
        telefono_2: '',
        mail_2: '',
        notas: ''
      });
      setEditandoClienteId(cliente.id);
      setShowForm(true);
    }
  };

  const handleDelete = async (clienteId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/clientes/${clienteId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          'x-fn-secret': publicAnonKey
        }
      });

      const result = await response.json();
      if (result.success) {
        await cargarDatos();
      } else {
        console.error('Error al eliminar:', result.error);
        alert('Error al eliminar cliente: ' + (result.error || 'Error desconocido'));
      }
    } catch (error) {
      console.log('Error al eliminar cliente:', error);
      alert('Error de conexión al eliminar cliente');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      contacto_1: '',
      telefono_1: '',
      mail_1: '',
      contacto_2: '',
      telefono_2: '',
      mail_2: '',
      notas: ''
    });
    setEditandoClienteId(null);
    setShowForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Gestión de Clientes</h2>
          </div>
          
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Agregar Cliente
            </button>
          )}
        </div>

        {/* Formulario */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editandoClienteId ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Código automático */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código del Cliente
                </label>
                <input
                  type="text"
                  disabled
                  value="(Generado automáticamente)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">El código se asigna automáticamente (CLI001, CLI002, etc.)</p>
              </div>

              {/* Nombre del cliente */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Cliente *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre completo del cliente o empresa"
                />
              </div>

              {/* Contacto Principal */}
              <div className="md:col-span-2 mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">Contacto Principal</h4>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contacto 1</label>
                <input
                  type="text"
                  value={formData.contacto_1}
                  onChange={(e) => setFormData({ ...formData, contacto_1: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre del contacto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono 1</label>
                <input
                  type="tel"
                  value={formData.telefono_1}
                  onChange={(e) => setFormData({ ...formData, telefono_1: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+34 600 000 000"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Mail 1</label>
                <input
                  type="email"
                  value={formData.mail_1}
                  onChange={(e) => setFormData({ ...formData, mail_1: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="email@ejemplo.com"
                />
              </div>

              {/* Contacto Secundario */}
              <div className="md:col-span-2 mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">Contacto Secundario (Opcional)</h4>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contacto 2</label>
                <input
                  type="text"
                  value={formData.contacto_2}
                  onChange={(e) => setFormData({ ...formData, contacto_2: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre del contacto secundario"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono 2</label>
                <input
                  type="tel"
                  value={formData.telefono_2}
                  onChange={(e) => setFormData({ ...formData, telefono_2: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+34 600 000 000"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Mail 2</label>
                <input
                  type="email"
                  value={formData.mail_2}
                  onChange={(e) => setFormData({ ...formData, mail_2: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="email2@ejemplo.com"
                />
              </div>

              {/* Notas */}
              <div className="md:col-span-2 mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notas</label>
                <textarea
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Notas adicionales sobre el cliente..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                disabled={guardando}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {guardando ? 'Guardando...' : (editandoClienteId ? 'Actualizar Cliente' : 'Guardar Cliente')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={guardando}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Lista de clientes */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teléfono
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clientes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-base font-medium">No hay clientes registrados</p>
                    <p className="text-sm mt-1">Agrega tu primer cliente usando el botón de arriba</p>
                  </td>
                </tr>
              ) : (
                clientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {cliente.codigo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cliente.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {cliente.contacto_1 || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {cliente.telefono_1 || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {cliente.mail_1 || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(cliente)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar cliente"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cliente.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar cliente"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
  );
}