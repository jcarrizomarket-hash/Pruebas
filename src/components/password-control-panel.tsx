import { useState, useEffect } from 'react';
import { Key, Mail, Shield, UserCheck, Lock, Send, CheckCircle, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

interface PasswordControlPanelProps {
  baseUrl: string;
  publicAnonKey: string;
}

interface User {
  id: string;
  email: string;
  nombre: string;
  rol: 'admin' | 'coordinador' | 'perfil';
  activo?: boolean; // Opcional - la columna puede no existir en la DB
  fechaCreacion: string;
}

export function PasswordControlPanel({ baseUrl, publicAnonKey }: PasswordControlPanelProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailToReset, setEmailToReset] = useState('');
  const [sendingReset, setSendingReset] = useState(false);
  
  // Formulario de nuevo usuario
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    nombre: '',
    rol: 'perfil' as 'admin' | 'coordinador' | 'perfil',
    password: ''
  });
  const [creatingUser, setCreatingUser] = useState(false);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/usuarios`, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`
        }
      });
      const result = await response.json();
      
      if (result.success) {
        setUsers(result.data || []);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const enviarEmailReset = async () => {
    if (!emailToReset) {
      toast.error('Ingresa un email válido');
      return;
    }

    try {
      setSendingReset(true);
      const response = await fetch(`${baseUrl}/enviar-reset-password`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: emailToReset })
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Email de restablecimiento enviado correctamente');
        setEmailToReset('');
      } else {
        toast.error(result.error || 'Error al enviar email');
      }
    } catch (error) {
      console.error('Error al enviar email de reset:', error);
      toast.error('Error al enviar email');
    } finally {
      setSendingReset(false);
    }
  };

  const crearUsuario = async () => {
    if (!newUser.email || !newUser.nombre || !newUser.password) {
      toast.error('Completa todos los campos');
      return;
    }

    try {
      setCreatingUser(true);
      const response = await fetch(`${baseUrl}/usuarios`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Usuario creado correctamente');
        setNewUser({ email: '', nombre: '', rol: 'perfil', password: '' });
        setShowNewUserForm(false);
        cargarUsuarios();
      } else {
        toast.error(result.error || 'Error al crear usuario');
      }
    } catch (error) {
      console.error('Error al crear usuario:', error);
      toast.error('Error al crear usuario');
    } finally {
      setCreatingUser(false);
    }
  };

  const toggleEstadoUsuario = async (userId: string, activo: boolean) => {
    // TEMPORALMENTE DESHABILITADO: La tabla usuarios no tiene columna 'activo'
    // Para habilitar: ejecutar en Supabase SQL Editor:
    // ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;
    toast.info('Funcionalidad temporalmente deshabilitada. La tabla usuarios necesita la columna "activo".');
    console.warn('Para habilitar toggle de usuarios, ejecutar: ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;');
  };

  const getRolBadgeColor = (rol: string) => {
    switch (rol) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'coordinador':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'perfil':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRolIcon = (rol: string) => {
    switch (rol) {
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'coordinador':
        return <UserCheck className="w-4 h-4" />;
      case 'perfil':
        return <Lock className="w-4 h-4" />;
      default:
        return <Lock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Key className="w-8 h-8 text-blue-600" />
        <div>
          <h3 className="text-xl font-bold text-gray-900">Panel de Control de Usuarios y Contraseñas</h3>
          <p className="text-gray-600 text-sm">Gestiona usuarios, roles y restablecimiento de contraseñas</p>
        </div>
      </div>

      {/* Restablecer Contraseña */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Restablecer Contraseña
        </h4>
        <p className="text-sm text-blue-700 mb-4">
          Envía un email de restablecimiento de contraseña a un usuario.
        </p>
        
        <div className="flex gap-3">
          <Input
            type="email"
            value={emailToReset}
            onChange={(e) => setEmailToReset(e.target.value)}
            placeholder="email@ejemplo.com"
            className="flex-1"
          />
          <Button
            onClick={enviarEmailReset}
            disabled={sendingReset || !emailToReset}
            className="flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {sendingReset ? 'Enviando...' : 'Enviar Email'}
          </Button>
        </div>
      </div>

      {/* Crear Nuevo Usuario */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Usuarios del Sistema
          </h4>
          <Button
            onClick={() => setShowNewUserForm(!showNewUserForm)}
            variant={showNewUserForm ? "outline" : "default"}
            size="sm"
          >
            {showNewUserForm ? 'Cancelar' : '+ Nuevo Usuario'}
          </Button>
        </div>

        {showNewUserForm && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="email@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <Input
                  value={newUser.nombre}
                  onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
                  placeholder="Nombre completo"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <Select
                  value={newUser.rol}
                  onValueChange={(value: 'admin' | 'coordinador' | 'perfil') => 
                    setNewUser({ ...newUser, rol: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin (Acceso Total)</SelectItem>
                    <SelectItem value="coordinador">Coordinador (Sin Configuración)</SelectItem>
                    <SelectItem value="perfil">Perfil (Solo Registros)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña Inicial
                </label>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Contraseña"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={crearUsuario}
                disabled={creatingUser}
                className="flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                {creatingUser ? 'Creando...' : 'Crear Usuario'}
              </Button>
            </div>
          </div>
        )}

        {/* Lista de Usuarios */}
        <div className="space-y-2">
          {users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay usuarios registrados. Crea el primer usuario.
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center gap-1 ${getRolBadgeColor(user.rol)}`}>
                    {getRolIcon(user.rol)}
                    {user.rol === 'admin' ? 'Admin' : user.rol === 'coordinador' ? 'Coordinador' : 'Perfil'}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{user.nombre}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(user.fechaCreacion).toLocaleDateString('es-ES')}
                  </div>
                </div>
                <button
                  onClick={() => toggleEstadoUsuario(user.id, user.activo ?? true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    user.activo !== false
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  {user.activo !== false ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Activo</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      <span>Inactivo</span>
                    </div>
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Información sobre Roles */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-3">Permisos por Rol</h4>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="px-3 py-1 rounded-full border text-sm font-medium flex items-center gap-1 bg-purple-100 text-purple-800 border-purple-200">
              <Shield className="w-4 h-4" />
              Admin
            </div>
            <div className="text-sm text-gray-600">
              <strong>Acceso completo:</strong> Puede ver y administrar todo el sistema, incluyendo configuración, usuarios, pedidos, personal, informes y envíos.
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="px-3 py-1 rounded-full border text-sm font-medium flex items-center gap-1 bg-blue-100 text-blue-800 border-blue-200">
              <UserCheck className="w-4 h-4" />
              Coordinador
            </div>
            <div className="text-sm text-gray-600">
              <strong>Acceso operativo:</strong> Puede ver Dashboard, Pedidos, Personal, Admin, Informes y Envíos. <strong>No tiene acceso a Configuración.</strong>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="px-3 py-1 rounded-full border text-sm font-medium flex items-center gap-1 bg-green-100 text-green-800 border-green-200">
              <Lock className="w-4 h-4" />
              Perfil
            </div>
            <div className="text-sm text-gray-600">
              <strong>Acceso limitado:</strong> Solo puede ver una tabla con sus registros personales (Fecha, Cliente, Evento, Hora Entrada, Hora Salida).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}