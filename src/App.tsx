import { useState, useEffect } from 'react';
import { CalendarDays, Users, FileText, MessageSquare, Briefcase, UserPlus, FileCheck, Building2, LayoutDashboard, ShoppingCart, Settings, MessagesSquare, Send, Shield, LogOut, Database } from 'lucide-react';
import { Dashboard } from './components/dashboard';
import { Pedidos } from './components/pedidos';
import { Camareros } from './components/camareros';
import { Admin } from './components/admin';
import { Informes } from './components/informes';
import { Envios } from './components/envios';
import { Configuracion } from './components/configuracion';
import { Login } from './components/login';
import { PerfilView } from './components/perfil-view';
import { QRScanPage } from './components/qr-scan-page';
import { InitTestPanel } from './components/init-test-panel';
import { TestEdgeFunction } from './components/TestEdgeFunction';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { Toaster } from './components/ui/sonner';

// Aplicación de Gestión de Perfiles para Eventos v2.6.2
// Última actualización: Eliminado /public/_headers/main.tsx conflictivo
console.log('🚀 App iniciando - Build v2.6.2');
console.log('📍 Location:', window.location.href);
console.log('🔧 Environment:', import.meta.env.MODE);

interface User {
  email: string;
  nombre: string;
  rol: 'admin' | 'coordinador' | 'perfil';
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [camareros, setCamareros] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [coordinadores, setCoordinadores] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);

  const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-ce05fe95`;

  // Detectar si la URL es de escaneo QR
  const currentPath = window.location.pathname;
  const isQRScanPath = currentPath.includes('/qr-scan/');
  const qrToken = isQRScanPath ? currentPath.split('/qr-scan/')[1] : null;

  // Si es una URL de escaneo QR, mostrar la página pública sin autenticación
  if (isQRScanPath && qrToken) {
    return (
      <>
        <QRScanPage token={qrToken} baseUrl={baseUrl} publicAnonKey={publicAnonKey} />
        <Toaster position="top-right" />
      </>
    );
  }

  const cargarDatos = async () => {
    try {
      const [camarerosRes, pedidosRes, coordinadoresRes, clientesRes] = await Promise.all([
        fetch(`${baseUrl}/camareros`, {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }),
        fetch(`${baseUrl}/pedidos`, {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }),
        fetch(`${baseUrl}/coordinadores`, {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }),
        fetch(`${baseUrl}/clientes`, {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        })
      ]);

      const camarerosData = await camarerosRes.json();
      const pedidosData = await pedidosRes.json();
      const coordinadoresData = await coordinadoresRes.json();
      const clientesData = await clientesRes.json();

      if (camarerosData.success) setCamareros(camarerosData.data);
      if (pedidosData.success) setPedidos(pedidosData.data);
      if (coordinadoresData.success) setCoordinadores(coordinadoresData.data);
      if (clientesData.success) setClientes(clientesData.data);
    } catch (error) {
      console.log('Error al cargar datos:', error);
    }
  };

  useEffect(() => {
    // Verificar si ya está autenticado
    const auth = localStorage.getItem('authenticated');
    const userStr = localStorage.getItem('user');
    if (auth === 'true' && userStr) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(userStr));
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && currentUser?.rol !== 'perfil') {
      cargarDatos();
    }
  }, [isAuthenticated, currentUser]);

  const handleLogin = (user: User) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return (
      <>
        <Login onLogin={handleLogin} baseUrl={baseUrl} publicAnonKey={publicAnonKey} />
        <Toaster position="top-right" />
      </>
    );
  }

  // Si el usuario es de tipo "perfil", mostrar vista especial
  if (currentUser?.rol === 'perfil') {
    return (
      <>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white shadow-sm border-b">
            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <h1 className="text-gray-900 text-xl font-bold">Gestión de Perfiles para Eventos</h1>
                <p className="text-sm text-gray-600">Bienvenido, {currentUser.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>
          
          <PerfilView 
            baseUrl={baseUrl} 
            publicAnonKey={publicAnonKey}
            userEmail={currentUser.email}
          />
        </div>
        <Toaster position="top-right" />
      </>
    );
  }

  // Filtrar tabs según el rol
  const allTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'coordinador'] },
    { id: 'pedidos', label: 'Pedidos', icon: ShoppingCart, roles: ['admin', 'coordinador'] },
    { id: 'camareros', label: 'Personal', icon: Users, roles: ['admin', 'coordinador'] },
    { id: 'admin', label: 'Admin', icon: Shield, roles: ['admin', 'coordinador'] },
    { id: 'informes', label: 'Informes', icon: FileText, roles: ['admin', 'coordinador'] },
    { id: 'envios', label: 'Envíos', icon: Send, roles: ['admin', 'coordinador'] },
    { id: 'configuracion', label: 'Configuración', icon: Settings, roles: ['admin'] },
    { id: 'init-db', label: 'Inicializar BD', icon: Database, roles: ['admin'] },
    { id: 'test-edge', label: '🧪 Test API', icon: Database, roles: ['admin'] }
  ];

  const tabs = allTabs.filter(tab => tab.roles.includes(currentUser?.rol || 'admin'));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 text-xl font-bold">Gestión de Perfiles para Eventos</h1>
            <p className="text-sm text-gray-600">
              Bienvenido, {currentUser?.email} ({currentUser?.rol === 'admin' ? 'Administrador' : 'Coordinador'})
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
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
        {activeTab === 'dashboard' && (
          <Dashboard
            camareros={camareros}
            pedidos={pedidos}
            setActiveTab={setActiveTab}
            baseUrl={baseUrl}
            publicAnonKey={publicAnonKey}
          />
        )}
        
        {activeTab === 'pedidos' && (
          <Pedidos
            pedidos={pedidos}
            setPedidos={setPedidos}
            camareros={camareros}
            coordinadores={coordinadores}
            baseUrl={baseUrl}
            publicAnonKey={publicAnonKey}
            cargarDatos={cargarDatos}
          />
        )}
        
        {activeTab === 'camareros' && (
          <Camareros
            camareros={camareros}
            setCamareros={setCamareros}
            pedidos={pedidos}
            coordinadores={coordinadores}
            baseUrl={baseUrl}
            publicAnonKey={publicAnonKey}
            cargarDatos={cargarDatos}
          />
        )}

        {activeTab === 'admin' && (
          <Admin
            coordinadores={coordinadores}
            setCoordinadores={setCoordinadores}
            baseUrl={baseUrl}
            publicAnonKey={publicAnonKey}
            cargarDatos={cargarDatos}
            camareros={camareros}
            pedidos={pedidos}
          />
        )}

        {activeTab === 'informes' && (
          <Informes
            camareros={camareros}
            pedidos={pedidos}
            baseUrl={baseUrl}
            publicAnonKey={publicAnonKey}
          />
        )}

        {activeTab === 'envios' && (
          <Envios
            pedidos={pedidos}
            camareros={camareros}
            coordinadores={coordinadores}
            clientes={clientes}
            baseUrl={baseUrl}
            publicAnonKey={publicAnonKey}
          />
        )}

        {activeTab === 'configuracion' && currentUser?.rol === 'admin' && (
          <Configuracion
            baseUrl={baseUrl}
            publicAnonKey={publicAnonKey}
            camareros={camareros}
            coordinadores={coordinadores}
            pedidos={pedidos}
            clientes={clientes}
          />
        )}

        {activeTab === 'init-db' && currentUser?.rol === 'admin' && (
          <InitTestPanel />
        )}

        {activeTab === 'test-edge' && currentUser?.rol === 'admin' && (
          <TestEdgeFunction />
        )}
      </div>
      <Toaster position="top-right" />
    </div>
  );
}