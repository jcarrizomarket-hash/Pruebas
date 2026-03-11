import { useState, useMemo, useEffect } from 'react';
import { Send, MessageSquare, Users, Bot, CheckCircle, Clock, MapPin, Calendar, X, Phone, Mail as MailIcon, ChevronDown, ChevronUp, FileCheck } from 'lucide-react';

interface EnviosProps {
  pedidos: any[];
  camareros: any[];
  coordinadores: any[];
  clientes: any[];
  baseUrl: string;
  publicAnonKey: string;
}

export function Envios({ pedidos, camareros, coordinadores, clientes, baseUrl, publicAnonKey }: EnviosProps) {
  const [activeTab, setActiveTab] = useState<'servicios' | 'grupal' | 'coordinadores' | 'chatbot' | 'partes'>('servicios');
  const [selectedEvento, setSelectedEvento] = useState<any>(null);
  const [mensajeTipo, setMensajeTipo] = useState<'catering' | 'restauracion'>('restauracion');
  const [showAsistentes, setShowAsistentes] = useState(false);
  const [showDiagnostico, setShowDiagnostico] = useState(false);
  const [diagnosticoData, setDiagnosticoData] = useState<any>(null);
  
  // Chat states
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChatEvento, setSelectedChatEvento] = useState<any>(null);
  
  // Chatbot states
  const [chatbotMessages, setChatbotMessages] = useState<any[]>([
    { id: 'initial-1', role: 'assistant', content: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [chatbotInput, setChatbotInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Partes de Servicios states
  const [vistaPrevia, setVistaPrevia] = useState<any>(null);
  const [estadosPartes, setEstadosPartes] = useState<{[key: string]: 'pendiente' | 'enviado'}>({});
  
  // Vista previa de mensaje de servicio
  const [showVistaPreviaServicio, setShowVistaPreviaServicio] = useState(false);
  
  // Modal para ingresar datos de contacto
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactData, setContactData] = useState({ email: '', telefono: '' });
  const [eventoParaEnviar, setEventoParaEnviar] = useState<any>(null);
  
  // Estados para selección múltiple de emails y teléfonos
  const [contactOptions, setContactOptions] = useState<{
    emails: { value: string; selected: boolean }[];
    telefonos: { value: string; selected: boolean }[];
    hasAutoData: boolean;
  }>({
    emails: [],
    telefonos: [],
    hasAutoData: false
  });

  // Función para diagnosticar la configuración
  const diagnosticarWhatsApp = async () => {
    console.log('🔍 Ejecutando diagnóstico de WhatsApp...');
    
    try {
      const response = await fetch(`${baseUrl}/diagnostico-whatsapp`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${publicAnonKey}`
        }
      });
      
      const result = await response.json();
      console.log('📊 Diagnóstico:', result);
      
      setDiagnosticoData(result);
      setShowDiagnostico(true);
    } catch (error) {
      console.error('❌ Error en diagnóstico:', error);
      setDiagnosticoData({
        configured: false,
        error: 'No se pudo conectar con el servidor'
      });
      setShowDiagnostico(true);
    }
  };

  const tabs = [
    { id: 'servicios' as const, label: 'Envíos Servicios', icon: Send },
    { id: 'partes' as const, label: 'Partes de Servicios', icon: FileCheck },
    { id: 'grupal' as const, label: 'Chat Grupal del Evento', icon: MessageSquare },
    { id: 'coordinadores' as const, label: 'Chat de Coordinadores', icon: Users },
    { id: 'chatbot' as const, label: 'Chat con Cliente (IA)', icon: Bot }
  ];

  // Ordenar eventos por fecha próxima (descendente)
  const eventosOrdenados = useMemo(() => {
    return [...pedidos].sort((a, b) => {
      const fechaA = new Date(a.diaEvento);
      const fechaB = new Date(b.diaEvento);
      return fechaA.getTime() - fechaB.getTime();
    });
  }, [pedidos]);

  // Función para enviar mensaje de confirmación
  const enviarConfirmacion = async () => {
    if (!selectedEvento) return;

    const asignados = selectedEvento.asignaciones || [];
    if (asignados.length === 0) {
      alert('⚠️ No hay perfiles asignados a este evento');
      return;
    }

    const mensajeBase = mensajeTipo === 'catering' 
      ? '🍽️ *Confirmación de Servicio - CATERING*'
      : '🍴 *Confirmación de Servicio - RESTAURACIÓN*';

    const mensaje = `${mensajeBase}

📅 *Fecha:* ${new Date(selectedEvento.diaEvento).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
🕐 *Horario:* ${selectedEvento.horaEntrada} - ${selectedEvento.horaSalida}
📍 *Lugar:* ${selectedEvento.lugar}
👔 *Dress Code:* Camisa ${selectedEvento.camisa}
${selectedEvento.catering === 'si' ? '✅ Incluye catering' : ''}

${selectedEvento.notas ? `📝 *Notas:* ${selectedEvento.notas}` : ''}

Por favor confirma tu asistencia respondiendo este mensaje.`;

    console.log('📤 Iniciando envío de confirmación para pedido:', selectedEvento.id);
    
    try {
      const response = await fetch(`${baseUrl}/enviar-mensaje-grupal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          pedidoId: selectedEvento.id,
          mensaje
        })
      });

      console.log('📡 Response status:', response.status);
      const result = await response.json();
      console.log('📋 Response data:', result);
      
      if (result.success) {
        const mensajeExito = `✅ Mensaje enviado a ${result.exitosos || asignados.length} camarero(s)${result.fallidos > 0 ? `\n⚠️ ${result.fallidos} fallidos` : ''}`;
        
        // Si hay fallos, mostrar detalles
        if (result.fallidos > 0 && result.resultados) {
          const fallidos = result.resultados.filter(r => !r.exito);
          const detallesFallidos = fallidos.map(f => `• ${f.camarero}: ${f.error}`).join('\n');
          alert(`${mensajeExito}\n\n❌ Fallos:\n${detallesFallidos}`);
        } else {
          alert(mensajeExito);
        }
        
        setSelectedEvento(null);
      } else {
        // Mensaje de error mejorado
        const errorMsg = result.error || 'Error desconocido';
        console.error('❌ Error del servidor:', errorMsg);
        console.error('📋 Detalles completos:', result);
        
        // Detectar error específico de WhatsApp allowed list
        if (errorMsg.includes('#131030') || errorMsg.includes('not in allowed list') || errorMsg.includes('modo desarrollo')) {
          // Mostrar información detallada sobre los camareros afectados
          let detallesCamareros = '';
          if (result.resultados && result.resultados.length > 0) {
            const camarerosAfectados = result.resultados.filter(r => !r.exito && (r.error.includes('modo desarrollo') || r.error.includes('#131030')));
            if (camarerosAfectados.length > 0) {
              detallesCamareros = '\n\n📱 Números afectados:\n' + camarerosAfectados.map(c => `• ${c.camarero} - ${c.telefono || 'Sin teléfono'}`).join('\n');
            }
          }
          
          alert(`⚠️ ERROR DE WHATSAPP BUSINESS API\n\n🔒 Tu cuenta está en modo TEST/SANDBOX\n\n❌ Los números NO están en la lista de permitidos.${detallesCamareros}\n\n✅ SOLUCIÓN RÁPIDA:\n1. Ve a Facebook Business Manager\n2. WhatsApp → API Setup → Phone Numbers\n3. Agrega cada número a "Allowed list"\n\n💡 SOLUCIÓN PERMANENTE:\n1. Ve a Facebook Business Manager\n2. WhatsApp → API Setup\n3. Click en "Upgrade to Production"\n4. Completa la verificación (1-2 días)\n5. Podrás enviar a cualquier número sin restricciones\n\n🔍 Error técnico: ${errorMsg}`);
        } else if (errorMsg.includes('WhatsApp no configurado')) {
          alert(`❌ WhatsApp no está configurado correctamente.\n\n📝 Para configurarlo:\n1. Ve a Configuración → WhatsApp\n2. Completa WHATSAPP_API_KEY y WHATSAPP_PHONE_ID\n3. Prueba la conexión\n\n🔍 Error técnico: ${errorMsg}`);
        } else if (errorMsg.includes('sin teléfono') || errorMsg.includes('Sin teléfono')) {
          // Mostrar qué camareros no tienen teléfono
          let detalleSinTelefono = '';
          if (result.resultados && result.resultados.length > 0) {
            const sinTelefono = result.resultados.filter(r => !r.exito && r.error.includes('Sin teléfono'));
            if (sinTelefono.length > 0) {
              detalleSinTelefono = '\n\n👥 Perfiles sin teléfono:\n' + sinTelefono.map(c => `• ${c.camarero}`).join('\n');
            }
          }
          
          alert(`⚠️ Algunos perfiles no tienen número de teléfono registrado.${detalleSinTelefono}\n\n📝 Para solucionarlo:\n1. Ve a la sección Personal\n2. Edita cada perfil afectado\n3. Agrega su número de teléfono\n\n🔍 Error técnico: ${errorMsg}`);
        } else {
          // Mostrar detalles de resultados si existen
          let detallesExtra = '';
          if (result.resultados && result.resultados.length > 0) {
            const errores = result.resultados.filter(r => !r.exito);
            if (errores.length > 0) {
              detallesExtra = '\n\n❌ Detalles:\n' + errores.map(e => `• ${e.camarero}: ${e.error}`).join('\n');
            }
          }
          alert(`❌ Error al enviar: ${errorMsg}${detallesExtra}\n\n💡 Verifica la consola del navegador (F12) para más detalles.`);
        }
      }
    } catch (error) {
      console.error('❌ Error al enviar:', error);
      alert(`❌ Error de conexión al enviar el mensaje.\n\nDetalles: ${error instanceof Error ? error.message : 'Error desconocido'}\n\n💡 Abre la consola del navegador (F12) para más información.`);
    }
  };

  // Función para enviar mensaje al chat grupal del evento
  const enviarMensajeChatEvento = async () => {
    if (!newMessage.trim() || !selectedChatEvento) return;

    const nuevoMensaje = {
      id: Date.now().toString(),
      sender: 'Coordinador',
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    setChatMessages([...chatMessages, nuevoMensaje]);
    setNewMessage('');

    // Guardar el mensaje en el servidor
    try {
      await fetch(`${baseUrl}/chat-mensajes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          chatId: `chat:${selectedChatEvento.id}`,
          id: nuevoMensaje.id,
          sender: nuevoMensaje.sender,
          content: nuevoMensaje.content,
          timestamp: nuevoMensaje.timestamp
        })
      });
    } catch (error) {
      console.error('Error al guardar mensaje:', error);
    }
  };

  // Función para el chatbot con IA
  const enviarMensajeChatbot = async () => {
    if (!chatbotInput.trim() || isProcessing) return;

    const userMessage = { id: `user-${Date.now()}`, role: 'user', content: chatbotInput };
    setChatbotMessages([...chatbotMessages, userMessage]);
    setChatbotInput('');
    setIsProcessing(true);

    // Respuesta de fallback por ahora (hasta implementar IA real)
    setTimeout(() => {
      const fallbackMessage = { 
        id: `assistant-${Date.now()}`,
        role: 'assistant', 
        content: 'Gracias por tu mensaje. Esta función está en desarrollo. Por favor, contacta directamente con tu coordinador o administración para consultas específicas.' 
      };
      setChatbotMessages(prev => [...prev, fallbackMessage]);
      setIsProcessing(false);
    }, 500);
    
    /* Código para cuando se implemente IA real:
    try {
      const response = await fetch(`${baseUrl}/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          messages: [...chatbotMessages, userMessage],
          context: {
            pedidos: pedidos.length,
            camareros: camareros.length
          }
        })
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const result = await response.json();
      
      if (result.success) {
        const assistantMessage = { id: `assistant-${Date.now()}`, role: 'assistant', content: result.message };
        setChatbotMessages(prev => [...prev, assistantMessage]);
      } else {
        const fallbackMessage = { 
          id: `assistant-${Date.now()}`,
          role: 'assistant', 
          content: 'Lo siento, estoy teniendo problemas para procesar tu solicitud. ¿Puedes intentar reformular tu pregunta?' 
        };
        setChatbotMessages(prev => [...prev, fallbackMessage]);
      }
      setIsProcessing(false);
    } catch (error) {
      console.error('Error en chatbot:', error);
      const errorMessage = { 
        id: `assistant-${Date.now()}`,
        role: 'assistant', 
        content: 'Disculpa, hay un problema de conexión. Por favor, intenta de nuevo más tarde.' 
      };
      setChatbotMessages(prev => [...prev, errorMessage]);
      setIsProcessing(false);
    }
    */
  };

  // Función para enviar parte de servicio
  const enviarParteServicio = async (evento: any, selectedEmails?: string[], selectedTelefonos?: string[]) => {
    const cliente = clientes.find(c => c.nombre === evento.cliente);
    if (!cliente) {
      alert('⚠️ Cliente no encontrado');
      return;
    }

    // Preparar emails y teléfonos disponibles del cliente
    const emailsDisponibles: { value: string; selected: boolean }[] = [];
    const telefonosDisponibles: { value: string; selected: boolean }[] = [];
    
    if (cliente.mail1) emailsDisponibles.push({ value: cliente.mail1, selected: true });
    if (cliente.mail2) emailsDisponibles.push({ value: cliente.mail2, selected: true });
    if (cliente.telefono1) telefonosDisponibles.push({ value: cliente.telefono1, selected: true });
    if (cliente.telefono2) telefonosDisponibles.push({ value: cliente.telefono2, selected: true });
    
    // Si no hay datos automáticos ni selecciones manuales, mostrar modal
    if (emailsDisponibles.length === 0 && telefonosDisponibles.length === 0 && !selectedEmails && !selectedTelefonos) {
      setEventoParaEnviar(evento);
      setContactOptions({
        emails: [],
        telefonos: [],
        hasAutoData: false
      });
      setContactData({ email: '', telefono: '' });
      setShowContactModal(true);
      return;
    }
    
    // Si hay datos automáticos pero no hay selección previa, mostrar modal para seleccionar
    if ((emailsDisponibles.length > 0 || telefonosDisponibles.length > 0) && !selectedEmails && !selectedTelefonos) {
      setEventoParaEnviar(evento);
      setContactOptions({
        emails: emailsDisponibles,
        telefonos: telefonosDisponibles,
        hasAutoData: true
      });
      setShowContactModal(true);
      return;
    }

    // Determinar emails y teléfonos finales
    const emailsFinal = selectedEmails || emailsDisponibles.map(e => e.value);
    const telefonosFinal = selectedTelefonos || telefonosDisponibles.map(t => t.value);
    
    // Validar que haya al menos un método de contacto
    if (emailsFinal.length === 0 && telefonosFinal.length === 0) {
      alert('⚠️ Debes seleccionar al menos un email o teléfono');
      return;
    }

    const coordinador = coordinadores.find(c => c.id === evento.coordinadorId);
    const asignados = evento.asignaciones || [];

    // Construir información de contacto para el mensaje
    const infoContacto = [];
    if (emailsFinal.length > 0) {
      infoContacto.push(`Email: ${emailsFinal.join(', ')}`);
    }
    if (telefonosFinal.length > 0) {
      infoContacto.push(`Teléfono: ${telefonosFinal.join(', ')}`);
    }

    // Construir el mensaje del parte
    const mensaje = `📋 *PARTE DE SERVICIO - ${evento.numero}*

━━━━━━━━━━━━━━━━━━━━━━━
🏢 *DATOS DEL CLIENTE*
━━━━━━━━━━━━━━━━━━━━━━━
Cliente: ${cliente.nombre}
${cliente.contacto1 ? `Contacto: ${cliente.contacto1}` : ''}
${infoContacto.join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━
📅 *DATOS DEL EVENTO*
━━━━━━━━━━━━━━━━━━━━━━━
Fecha: ${new Date(evento.diaEvento).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Horario: ${evento.horaEntrada} - ${evento.horaSalida}
Lugar: ${evento.lugar}
${evento.ubicacion ? `📍 Ubicación: ${evento.ubicacion}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━
👔 *DETALLES DEL SERVICIO*
━━━━━━━━━━━━━━━━━━━━━━━
Tipo: ${evento.catering === 'si' ? 'Catering' : 'Restauración'}
Dress Code: Camisa ${evento.camisa}
${evento.notas ? `\n📝 Notas: ${evento.notas}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━
👥 *PERSONAL ASIGNADO (${asignados.length})*
━━━━━━━━━━━━━━━━━━━━━━━
${asignados.map((a, idx) => {
  const cam = camareros.find(c => c.id === a.camareroId);
  const estado = a.estado === 'confirmado' ? '✅' : a.estado === 'pendiente' ? '⏳' : '❌';
  return `${idx + 1}. ${cam?.nombre || a.camareroNombre} - Turno ${a.turno} ${estado}`;
}).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━
👤 *COORDINADOR*
━━━━━━━━━━━━━━━━━━━━━━━
${coordinador?.nombre || 'Sin asignar'}
${coordinador?.telefono ? `Tel: ${coordinador.telefono}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━
Generado: ${new Date().toLocaleString('es-ES')}`;

    try {
      console.log('📤 Enviando parte de servicio...', {
        eventoId: evento.id,
        clienteEmails: emailsFinal,
        clienteTelefonos: telefonosFinal
      });
      
      const response = await fetch(`${baseUrl}/enviar-parte`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          eventoId: evento.id,
          clienteEmails: emailsFinal,
          clienteTelefonos: telefonosFinal,
          mensaje
        })
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      const result = await response.json();
      console.log('📦 Result completo:', result);
      
      if (result.success) {
        // Construir mensaje detallado
        let mensajeExito = '✅ Parte de servicio enviado correctamente\n\n';
        
        if (result.resultados.email.enviados > 0) {
          mensajeExito += `📧 Email: ${result.resultados.email.enviados} enviado(s)\n`;
        }
        if (result.resultados.whatsapp.enviados > 0) {
          mensajeExito += `📱 WhatsApp: ${result.resultados.whatsapp.enviados} enviado(s)\n`;
        }
        
        // Mostrar fallos si los hay
        if (result.resultados.email.fallidos > 0 || result.resultados.whatsapp.fallidos > 0) {
          mensajeExito += '\n⚠️ Algunos envíos fallaron:\n';
          
          if (result.resultados.email.fallidos > 0) {
            mensajeExito += `  ❌ Email: ${result.resultados.email.fallidos} fallido(s)\n`;
          }
          if (result.resultados.whatsapp.fallidos > 0) {
            mensajeExito += `  ❌ WhatsApp: ${result.resultados.whatsapp.fallidos} fallido(s)\n`;
          }
        }
        
        alert(mensajeExito);
        setEstadosPartes(prev => ({ ...prev, [evento.id]: 'enviado' }));
        setVistaPrevia(null);
        setShowContactModal(false);
        setSelectedEvento(null);
      } else {
        const errorMsg = result.error || result.mensaje || 'Error desconocido';
        console.error('❌ Error del servidor:', errorMsg);
        console.error('📋 Detalles completos:', result);
        
        // Construir mensaje de error detallado
        let mensajeError = `❌ Error al enviar: ${errorMsg}\n\n`;
        
        if (result.resultados) {
          if (result.resultados.email.errores && result.resultados.email.errores.length > 0) {
            mensajeError += '📧 Errores de Email:\n';
            result.resultados.email.errores.forEach(e => {
              mensajeError += `  • ${e.email || 'Email'}: ${e.error}\n`;
            });
          }
          if (result.resultados.whatsapp.errores && result.resultados.whatsapp.errores.length > 0) {
            mensajeError += '📱 Errores de WhatsApp:\n';
            result.resultados.whatsapp.errores.forEach(e => {
              mensajeError += `  • ${e.telefono || 'Teléfono'}: ${e.error}\n`;
            });
          }
        }
        
        alert(mensajeError);
      }
    } catch (error) {
      console.error('❌ Error al enviar parte:', error);
      alert(`❌ Error al enviar el parte de servicio: ${error.message || error}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Send className="w-8 h-8 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Envíos y Comunicación</h2>
          <p className="text-gray-600">Gestiona todos los canales de comunicación desde un solo lugar</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
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
          
          {/* 1. ENVÍOS SERVICIOS */}
          {activeTab === 'servicios' && (
            <div className="space-y-4">
              {/* Alerta de configuración de WhatsApp */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-blue-900 mb-1">ℹ️ Configuración de WhatsApp</p>
                      <p className="text-sm text-blue-700">
                        Para enviar confirmaciones, primero verifica que WhatsApp esté configurado en <strong>Configuración → WhatsApp</strong>.
                        Los camareros también deben tener números de teléfono registrados en <strong>Personal</strong>.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={diagnosticarWhatsApp}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    🔍 Diagnosticar
                  </button>
                </div>
              </div>

              {/* Alerta de modo TEST/SANDBOX */}
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">⚠️</div>
                  <div className="flex-1">
                    <p className="font-semibold text-yellow-900 mb-1">Modo TEST de WhatsApp Business API</p>
                    <p className="text-sm text-yellow-800 mb-2">
                      Tu cuenta de WhatsApp está en modo <strong>TEST/SANDBOX</strong>. Solo puedes enviar mensajes a números agregados manualmente a la "allowed list".
                    </p>
                    <div className="text-sm text-yellow-800 space-y-1">
                      <p className="font-medium">✅ Para enviar a un número específico:</p>
                      <ol className="ml-4 space-y-0.5 list-decimal">
                        <li>Ve a <strong>Facebook Business Manager</strong></li>
                        <li>WhatsApp → <strong>API Setup</strong> → <strong>Phone Numbers</strong></li>
                        <li>Agrega el número a <strong>"Allowed list"</strong></li>
                      </ol>
                      <p className="font-medium mt-2">🚀 Para enviar a cualquier número (recomendado):</p>
                      <ol className="ml-4 space-y-0.5 list-decimal">
                        <li>Ve a <strong>Facebook Business Manager</strong></li>
                        <li>WhatsApp → <strong>API Setup</strong></li>
                        <li>Click en <strong>"Upgrade to Production"</strong></li>
                        <li>Completa la verificación (1-2 días)</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Eventos Próximos</h3>
                <span className="text-sm text-gray-500">{eventosOrdenados.length} eventos</span>
              </div>

              <div className="space-y-3">
                {eventosOrdenados.map(evento => {
                  const asignados = evento.asignaciones || [];
                  const confirmados = asignados.filter(a => a.estado === 'confirmado').length;
                  
                  return (
                    <div key={evento.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono font-bold text-blue-600">{evento.numero}</span>
                            <span className="font-semibold text-gray-900">{evento.cliente}</span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(evento.diaEvento).toLocaleDateString('es-ES')}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {evento.horaEntrada} - {evento.horaSalida}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {evento.lugar}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {confirmados}/{asignados.length} confirmados
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => setSelectedEvento(evento)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 ml-4"
                        >
                          <Send className="w-4 h-4" />
                          Enviar
                        </button>
                      </div>
                    </div>
                  );
                })}
                
                {eventosOrdenados.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No hay eventos registrados
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. PARTES DE SERVICIOS */}
          {activeTab === 'partes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Partes de Servicios</h3>
                <span className="text-sm text-gray-500">{eventosOrdenados.length} eventos</span>
              </div>

              <div className="space-y-3">
                {eventosOrdenados.map(evento => {
                  const asignados = evento.asignaciones || [];
                  const confirmados = asignados.filter(a => a.estado === 'confirmado').length;
                  const estado = estadosPartes[evento.id] || 'pendiente';
                  
                  return (
                    <div key={evento.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono font-bold text-blue-600">{evento.numero}</span>
                            <span className="font-semibold text-gray-900">{evento.cliente}</span>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              estado === 'enviado'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {estado === 'enviado' ? '✓ Enviado' : '⏳ Pendiente'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(evento.diaEvento).toLocaleDateString('es-ES')}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {evento.horaEntrada} - {evento.horaSalida}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {evento.lugar}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {asignados.length} personal
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => {
                            setSelectedEvento(evento);
                            setVistaPrevia(null);
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 ml-4"
                        >
                          <FileCheck className="w-4 h-4" />
                          Ver Parte
                        </button>
                      </div>
                    </div>
                  );
                })}
                
                {eventosOrdenados.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No hay eventos registrados
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. CHAT GRUPAL DEL EVENTO */}
          {activeTab === 'grupal' && (
            <div className="space-y-4">
              {!selectedChatEvento ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Selecciona un Evento</h3>
                  <div className="space-y-3">
                    {eventosOrdenados.map(evento => {
                      const asignados = evento.asignaciones || [];
                      
                      return (
                        <div 
                          key={evento.id}
                          onClick={() => {
                            setSelectedChatEvento(evento);
                            setChatMessages([]); // Aquí cargarías los mensajes del servidor
                          }}
                          className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-mono font-bold text-blue-600">{evento.numero}</span>
                                <span className="font-semibold text-gray-900">{evento.cliente}</span>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(evento.diaEvento).toLocaleDateString('es-ES')}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {evento.horaEntrada} - {evento.horaSalida}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {evento.lugar}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {asignados.length} participantes
                                </div>
                              </div>
                            </div>
                            
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="flex flex-col h-[600px]">
                  {/* Header del chat */}
                  <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">{selectedChatEvento.cliente}</h3>
                      <div className="text-sm opacity-90 flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(selectedChatEvento.diaEvento).toLocaleDateString('es-ES')}
                        <Clock className="w-3 h-3 ml-2" />
                        {selectedChatEvento.horaEntrada} - {selectedChatEvento.horaSalida}
                        <MapPin className="w-3 h-3 ml-2" />
                        {selectedChatEvento.lugar}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowAsistentes(!showAsistentes)}
                        className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2 text-sm"
                      >
                        <Users className="w-4 h-4" />
                        {(selectedChatEvento.asignaciones || []).length}
                        {showAsistentes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setSelectedChatEvento(null)}
                        className="p-2 hover:bg-white/20 rounded-full"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Lista de asistentes (desplegable) */}
                  {showAsistentes && (
                    <div className="bg-blue-50 border-b border-blue-200 p-4">
                      <h4 className="font-semibold text-gray-700 mb-2">Participantes del Evento:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {(selectedChatEvento.asignaciones || []).map((asignacion) => {
                          const camarero = camareros.find(c => c.id === asignacion.camareroId);
                          return (
                            <div key={asignacion.camareroId || asignacion.id} className="flex items-center gap-2 text-sm bg-white p-2 rounded border border-blue-200">
                              <div className={`w-2 h-2 rounded-full ${
                                asignacion.estado === 'confirmado' ? 'bg-green-500' : 
                                asignacion.estado === 'pendiente' ? 'bg-yellow-500' : 'bg-red-500'
                              }`} />
                              {camarero?.nombre || asignacion.camareroNombre}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Mensajes */}
                  <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
                    {chatMessages.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        No hay mensajes todavía. ¡Inicia la conversación!
                      </div>
                    )}
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className="flex gap-2">
                        <div className="bg-white rounded-lg p-3 shadow-sm max-w-[80%]">
                          <div className="font-semibold text-sm text-blue-600">{msg.sender}</div>
                          <div className="text-gray-700">{msg.content}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString('es-ES')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input de mensaje */}
                  <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && enviarMensajeChatEvento()}
                        placeholder="Escribe un mensaje..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={enviarMensajeChatEvento}
                        disabled={!newMessage.trim()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. CHAT DE COORDINADORES */}
          {activeTab === 'coordinadores' && (
            <div className="flex flex-col h-[600px]">
              <div className="bg-green-600 text-white p-4 rounded-t-lg">
                <h3 className="font-bold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Chat de Coordinadores
                </h3>
                <p className="text-sm opacity-90">{coordinadores.length} coordinadores activos</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="text-center text-gray-500 py-8">
                  Chat grupal para comunicación interna entre coordinadores
                </div>
              </div>

              <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Mensaje para coordinadores..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                  <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 5. CHATBOT CON CLIENTE (IA) */}
          {activeTab === 'chatbot' && (
            <div className="flex flex-col h-[600px]">
              <div className="bg-purple-600 text-white p-4 rounded-t-lg">
                <h3 className="font-bold flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  Asistente Virtual con IA
                </h3>
                <p className="text-sm opacity-90">Interacción automatizada con clientes</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
                {chatbotMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 shadow-sm'
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-1">
                          <Bot className="w-4 h-4 text-purple-600" />
                          <span className="text-xs font-semibold text-purple-600">Asistente</span>
                        </div>
                      )}
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex items-center gap-2 text-gray-500">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                        <span>Procesando...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatbotInput}
                    onChange={(e) => setChatbotInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && enviarMensajeChatbot()}
                    placeholder="Pregunta algo al asistente..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    disabled={isProcessing}
                  />
                  <button
                    onClick={enviarMensajeChatbot}
                    disabled={!chatbotInput.trim() || isProcessing}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 El asistente puede ayudarte con información sobre eventos, disponibilidad y consultas generales
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal para Envío de Servicios */}
      {selectedEvento && activeTab === 'servicios' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
              <h3 className="text-xl font-bold text-gray-800">
                Enviar Confirmación - {selectedEvento.numero}
              </h3>
              <button
                onClick={() => setSelectedEvento(null)}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Información del Evento */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-gray-800 mb-3">Detalles del Evento</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Cliente:</span>
                    <span className="ml-2 font-medium">{selectedEvento.cliente}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Fecha:</span>
                    <span className="ml-2 font-medium">
                      {new Date(selectedEvento.diaEvento).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Horario:</span>
                    <span className="ml-2 font-medium">
                      {selectedEvento.horaEntrada} - {selectedEvento.horaSalida}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Lugar:</span>
                    <span className="ml-2 font-medium">{selectedEvento.lugar}</span>
                  </div>
                </div>
              </div>

              {/* Lista de Asignados */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  Personal Asignado ({(selectedEvento.asignaciones || []).length})
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {(selectedEvento.asignaciones || []).map((asignacion) => {
                    const camarero = camareros.find(c => c.id === asignacion.camareroId);
                    return (
                      <div
                        key={asignacion.camareroId || asignacion.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              asignacion.estado === 'confirmado'
                                ? 'bg-green-500'
                                : asignacion.estado === 'pendiente'
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                          />
                          <span className="font-medium">{camarero?.nombre || asignacion.camareroNombre}</span>
                          <span className="text-sm text-gray-500">
                            Turno {asignacion.turno}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {camarero?.telefono && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {camarero.telefono}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tipo de Mensaje */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Tipo de Servicio</h4>
                <div className="flex gap-4">
                  <button
                    onClick={() => setMensajeTipo('restauracion')}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                      mensajeTipo === 'restauracion'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">🍴</div>
                    <div className="font-semibold">Restauración</div>
                  </button>
                  <button
                    onClick={() => setMensajeTipo('catering')}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                      mensajeTipo === 'catering'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">🍽️</div>
                    <div className="font-semibold">Catering</div>
                  </button>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowVistaPreviaServicio(true)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Vista Previa
                </button>
                <button
                  onClick={enviarConfirmacion}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Enviar Confirmación
                </button>
                <button
                  onClick={() => setSelectedEvento(null)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Parte de Servicio */}
      {selectedEvento && activeTab === 'partes' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl flex-shrink-0">
              <h3 className="text-lg font-bold text-gray-800">
                Parte de Servicio - {selectedEvento.numero}
              </h3>
              <button
                onClick={() => setSelectedEvento(null)}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Vista Previa del Parte en formato PDF */}
              <div className="bg-white rounded-lg border-2 border-gray-300 overflow-hidden">
                {/* Encabezado del Parte */}
                <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <h1 className="text-2xl font-bold mb-1">PARTE DE SERVICIO</h1>
                  <p className="text-lg font-mono">{selectedEvento.numero}</p>
                </div>

                {/* Datos del Cliente y Evento (Lado Izquierdo) */}
                <div className="p-6 bg-gray-50 border-b-2 border-gray-300">
                  <div className="space-y-4">
                    {/* Datos del Cliente */}
                    <div>
                      <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Datos del Cliente</h3>
                      <div className="bg-white p-4 rounded border border-gray-200 space-y-1 text-sm">
                        <div className="flex">
                          <span className="font-semibold w-24">Cliente:</span>
                          <span>{selectedEvento.cliente}</span>
                        </div>
                        {clientes.find(c => c.nombre === selectedEvento.cliente)?.contacto && (
                          <div className="flex">
                            <span className="font-semibold w-24">Contacto:</span>
                            <span>{clientes.find(c => c.nombre === selectedEvento.cliente)?.contacto}</span>
                          </div>
                        )}
                        {clientes.find(c => c.nombre === selectedEvento.cliente)?.telefono && (
                          <div className="flex">
                            <span className="font-semibold w-24">Teléfono:</span>
                            <span>{clientes.find(c => c.nombre === selectedEvento.cliente)?.telefono}</span>
                          </div>
                        )}
                        {clientes.find(c => c.nombre === selectedEvento.cliente)?.email && (
                          <div className="flex">
                            <span className="font-semibold w-24">Email:</span>
                            <span>{clientes.find(c => c.nombre === selectedEvento.cliente)?.email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Datos del Evento */}
                    <div>
                      <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Datos del Evento</h3>
                      <div className="bg-white p-4 rounded border border-gray-200 space-y-1 text-sm">
                        <div className="flex">
                          <span className="font-semibold w-24">Fecha:</span>
                          <span>{new Date(selectedEvento.diaEvento).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold w-24">Horario:</span>
                          <span>{selectedEvento.horaEntrada} - {selectedEvento.horaSalida}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold w-24">Lugar:</span>
                          <span>{selectedEvento.lugar}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold w-24">Servicio:</span>
                          <span>{selectedEvento.catering === 'si' ? 'Catering' : 'Restauración'}</span>
                        </div>
                        <div className="flex">
                          <span className="font-semibold w-24">Dress Code:</span>
                          <span>Camisa {selectedEvento.camisa}</span>
                        </div>
                        {selectedEvento.notas && (
                          <div className="flex">
                            <span className="font-semibold w-24">Notas:</span>
                            <span>{selectedEvento.notas}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabla de Personal (Cuerpo del Parte) */}
                <div className="p-6">
                  <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Personal Asignado</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border-2 border-gray-400">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border-2 border-gray-400 px-3 py-2 text-center font-bold text-sm w-16">Nº</th>
                          <th className="border-2 border-gray-400 px-4 py-2 text-left font-bold text-sm">Nombre y Apellidos</th>
                          <th className="border-2 border-gray-400 px-3 py-2 text-center font-bold text-sm w-28">Hora Entrada</th>
                          <th className="border-2 border-gray-400 px-3 py-2 text-center font-bold text-sm w-28">Hora Salida</th>
                          <th className="border-2 border-gray-400 px-3 py-2 text-center font-bold text-sm w-28">Total Horas</th>
                          <th className="border-2 border-gray-400 px-4 py-2 text-left font-bold text-sm">Observaciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedEvento.asignaciones || []).map((asignacion, idx) => {
                          const camarero = camareros.find(c => c.id === asignacion.camareroId);
                          return (
                            <tr key={asignacion.camareroId || asignacion.id || `asig-${idx}`} className="hover:bg-gray-50">
                              <td className="border-2 border-gray-400 px-3 py-3 text-center font-semibold">{idx + 1}</td>
                              <td className="border-2 border-gray-400 px-4 py-3">
                                {camarero?.nombre || asignacion.camareroNombre}
                              </td>
                              <td className="border-2 border-gray-400 px-3 py-3 text-center bg-white">
                                {/* En blanco para rellenar manualmente */}
                              </td>
                              <td className="border-2 border-gray-400 px-3 py-3 text-center bg-white">
                                {/* En blanco para rellenar manualmente */}
                              </td>
                              <td className="border-2 border-gray-400 px-3 py-3 text-center bg-white">
                                {/* En blanco para rellenar manualmente */}
                              </td>
                              <td className="border-2 border-gray-400 px-4 py-3 bg-white">
                                {/* En blanco para rellenar manualmente */}
                              </td>
                            </tr>
                          );
                        })}
                        {/* Filas vacías adicionales para rellenar */}
                        {Array.from({ length: Math.max(0, 5 - (selectedEvento.asignaciones || []).length) }).map((_, idx) => (
                          <tr key={`empty-${idx}`}>
                            <td className="border-2 border-gray-400 px-3 py-3 text-center text-gray-400">
                              {(selectedEvento.asignaciones || []).length + idx + 1}
                            </td>
                            <td className="border-2 border-gray-400 px-4 py-3 bg-white"></td>
                            <td className="border-2 border-gray-400 px-3 py-3 bg-white"></td>
                            <td className="border-2 border-gray-400 px-3 py-3 bg-white"></td>
                            <td className="border-2 border-gray-400 px-3 py-3 bg-white"></td>
                            <td className="border-2 border-gray-400 px-4 py-3 bg-white"></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Información adicional */}
                  <div className="mt-6 text-xs text-gray-600 space-y-1">
                    <p><strong>Coordinador:</strong> {coordinadores.find(c => c.id === selectedEvento.coordinadorId)?.nombre || 'Sin asignar'}</p>
                    {coordinadores.find(c => c.id === selectedEvento.coordinadorId)?.telefono && (
                      <p><strong>Tel. Coordinador:</strong> {coordinadores.find(c => c.id === selectedEvento.coordinadorId)?.telefono}</p>
                    )}
                    <p className="mt-3 text-gray-500">Fecha de generación: {new Date().toLocaleString('es-ES')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    // Aquí implementaremos la descarga del PDF
                    alert('Funcionalidad de descarga PDF en desarrollo. Por ahora puedes imprimir usando Ctrl+P o Cmd+P');
                    window.print();
                  }}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FileCheck className="w-5 h-5" />
                  Descargar PDF
                </button>
                <button
                  onClick={() => enviarParteServicio(selectedEvento)}
                  disabled={estadosPartes[selectedEvento.id] === 'enviado'}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  {estadosPartes[selectedEvento.id] === 'enviado' ? 'Parte Enviado' : 'Enviar Parte'}
                </button>
                <button
                  onClick={() => setSelectedEvento(null)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de Vista Previa del Mensaje de Servicio */}
      {showVistaPreviaServicio && selectedEvento && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-xl">
              <div>
                <h3 className="text-xl font-bold">Vista Previa del Mensaje</h3>
                <p className="text-sm opacity-90">Revisa el mensaje antes de enviarlo</p>
              </div>
              <button
                onClick={() => setShowVistaPreviaServicio(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Simulación de mensaje de WhatsApp */}
              <div className="bg-[#E5DDD5] rounded-lg p-4">
                <div className="bg-white rounded-lg p-4 shadow-sm max-w-[85%]">
                  <div className="space-y-2 text-gray-800">
                    <div className="font-bold text-lg">
                      {mensajeTipo === 'catering' ? '🍽️ Confirmación de Servicio - CATERING' : '🍴 Confirmación de Servicio - RESTAURACIÓN'}
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>📅 Fecha:</strong> {new Date(selectedEvento.diaEvento).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <p>
                        <strong>🕐 Horario:</strong> {selectedEvento.horaEntrada} - {selectedEvento.horaSalida}
                      </p>
                      <p>
                        <strong>📍 Lugar:</strong> {selectedEvento.lugar}
                      </p>
                      <p>
                        <strong>👔 Dress Code:</strong> Camisa {selectedEvento.camisa}
                      </p>
                      {selectedEvento.catering === 'si' && (
                        <p className="text-green-600">✅ Incluye catering</p>
                      )}
                      {selectedEvento.notas && (
                        <p>
                          <strong>📝 Notas:</strong> {selectedEvento.notas}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-gray-200 mt-3 text-sm italic text-gray-600">
                      Por favor confirma tu asistencia respondiendo este mensaje.
                    </div>
                  </div>
                  
                  <div className="flex justify-end items-center gap-2 mt-2">
                    <span className="text-[10px] text-gray-400">
                      {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Información de destinatarios */}
              <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  Será enviado a {(selectedEvento.asignaciones || []).length} persona(s)
                </h4>
                <div className="space-y-1 text-sm text-gray-700">
                  {(selectedEvento.asignaciones || []).slice(0, 5).map((asignacion) => {
                    const camarero = camareros.find(c => c.id === asignacion.camareroId);
                    return (
                      <div key={asignacion.camareroId || asignacion.id} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          asignacion.estado === 'confirmado' ? 'bg-green-500' : 
                          asignacion.estado === 'pendiente' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        {camarero?.nombre || asignacion.camareroNombre}
                        {camarero?.telefono && <span className="text-gray-500 text-xs">({camarero.telefono})</span>}
                      </div>
                    );
                  })}
                  {(selectedEvento.asignaciones || []).length > 5 && (
                    <p className="text-gray-500 italic">
                      ...y {(selectedEvento.asignaciones || []).length - 5} más
                    </p>
                  )}
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowVistaPreviaServicio(false);
                    enviarConfirmacion();
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Enviar Ahora
                </button>
                <button
                  onClick={() => setShowVistaPreviaServicio(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Volver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Diagnóstico de WhatsApp */}
      {showDiagnostico && diagnosticoData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                🔍 Diagnóstico de WhatsApp
              </h3>
              <button
                onClick={() => setShowDiagnostico(false)}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Estado General */}
              <div className={`p-4 rounded-lg border-2 ${diagnosticoData.configured ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${diagnosticoData.configured ? 'bg-green-100' : 'bg-red-100'}`}>
                    {diagnosticoData.configured ? '✅' : '❌'}
                  </div>
                  <div>
                    <p className={`font-bold text-lg ${diagnosticoData.configured ? 'text-green-900' : 'text-red-900'}`}>
                      {diagnosticoData.configured ? 'WhatsApp Configurado' : 'WhatsApp NO Configurado'}
                    </p>
                    <p className={`text-sm ${diagnosticoData.configured ? 'text-green-700' : 'text-red-700'}`}>
                      {diagnosticoData.configured 
                        ? 'Todos los parámetros están presentes' 
                        : 'Faltan parámetros requeridos'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Detalles de Configuración */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 border-b pb-2">📋 Detalles de Configuración:</h4>
                
                {/* API Key */}
                <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-700">🔑 WHATSAPP_API_KEY</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {diagnosticoData.apiKeyPresent 
                        ? `Presente (${diagnosticoData.apiKeyLength} caracteres): ${diagnosticoData.apiKeyPrefix}` 
                        : 'No configurado'}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${diagnosticoData.apiKeyPresent ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {diagnosticoData.apiKeyPresent ? '✅ OK' : '❌ Falta'}
                  </span>
                </div>

                {/* Phone ID */}
                <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-700">📱 WHATSAPP_PHONE_ID</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {diagnosticoData.phoneIdPresent 
                        ? `Valor: ${diagnosticoData.phoneIdValue}` 
                        : 'No configurado'}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${diagnosticoData.phoneIdPresent ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {diagnosticoData.phoneIdPresent ? '✅ OK' : '❌ Falta'}
                  </span>
                </div>
              </div>

              {/* Instrucciones si falta configuración */}
              {!diagnosticoData.configured && (
                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                  <p className="font-semibold text-yellow-900 mb-2">📝 ¿Cómo configurar WhatsApp?</p>
                  <ol className="text-sm text-yellow-800 space-y-1 ml-4 list-decimal">
                    <li>Ve a <strong>Configuración</strong> en el menú lateral</li>
                    <li>Click en la pestaña <strong>WhatsApp</strong></li>
                    <li>Completa los campos <strong>WHATSAPP_API_KEY</strong> y <strong>WHATSAPP_PHONE_ID</strong></li>
                    <li>Guarda los cambios</li>
                    <li>Vuelve aquí y ejecuta el diagnóstico nuevamente</li>
                  </ol>
                </div>
              )}

              {/* Timestamp */}
              <p className="text-xs text-gray-500 text-center">
                Diagnóstico ejecutado: {new Date(diagnosticoData.timestamp).toLocaleString('es-ES')}
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-b-xl flex gap-3">
              <button
                onClick={diagnosticarWhatsApp}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                🔄 Volver a Diagnosticar
              </button>
              <button
                onClick={() => setShowDiagnostico(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ingresar datos de contacto */}
      {showContactModal && eventoParaEnviar && (() => {
        const cliente = clientes.find(c => c.nombre === eventoParaEnviar.cliente);
        const hasAutoData = contactOptions.hasAutoData;
        
        return (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-600 to-orange-700 rounded-t-xl sticky top-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">Datos de Contacto</h3>
                    <p className="text-sm text-white/90 mt-1">
                      {hasAutoData ? 'Selecciona a dónde enviar el parte' : 'El cliente no tiene email ni teléfono configurado'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowContactModal(false);
                      setEventoParaEnviar(null);
                    }}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm text-blue-800">
                    <strong>Cliente:</strong> {cliente?.nombre || eventoParaEnviar.cliente}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {hasAutoData 
                      ? 'Selecciona al menos un método de contacto'
                      : 'Ingresa al menos un método de contacto para enviar el parte'}
                  </p>
                </div>

                {hasAutoData ? (
                  // Mostrar checkboxes con datos automáticos del cliente
                  <>
                    {/* Emails disponibles */}
                    {contactOptions.emails.length > 0 && (
                      <div>
                        <label className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                          <MailIcon className="w-4 h-4 text-gray-500" />
                          <span>Emails disponibles</span>
                        </label>
                        <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                          {contactOptions.emails.map((email, idx) => (
                            <label 
                              key={idx} 
                              className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-orange-300 cursor-pointer transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={email.selected}
                                onChange={(e) => {
                                  const newEmails = [...contactOptions.emails];
                                  newEmails[idx].selected = e.target.checked;
                                  setContactOptions({
                                    ...contactOptions,
                                    emails: newEmails
                                  });
                                }}
                                className="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
                              />
                              <div className="flex-1">
                                <span className="text-sm font-medium text-gray-700">{email.value}</span>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {idx === 0 ? 'Email principal' : 'Email secundario'}
                                </p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Teléfonos disponibles */}
                    {contactOptions.telefonos.length > 0 && (
                      <div>
                        <label className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span>Teléfonos disponibles</span>
                        </label>
                        <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                          {contactOptions.telefonos.map((telefono, idx) => (
                            <label 
                              key={idx} 
                              className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-orange-300 cursor-pointer transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={telefono.selected}
                                onChange={(e) => {
                                  const newTelefonos = [...contactOptions.telefonos];
                                  newTelefonos[idx].selected = e.target.checked;
                                  setContactOptions({
                                    ...contactOptions,
                                    telefonos: newTelefonos
                                  });
                                }}
                                className="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
                              />
                              <div className="flex-1">
                                <span className="text-sm font-medium text-gray-700">{telefono.value}</span>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {idx === 0 ? 'Teléfono principal' : 'Teléfono secundario'}
                                </p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Resumen de selección */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-800 font-medium mb-1">
                        📤 Se enviará a:
                      </p>
                      <ul className="text-xs text-green-700 space-y-1 ml-4">
                        {contactOptions.emails.filter(e => e.selected).length > 0 && (
                          <li>✓ {contactOptions.emails.filter(e => e.selected).length} email(s)</li>
                        )}
                        {contactOptions.telefonos.filter(t => t.selected).length > 0 && (
                          <li>✓ {contactOptions.telefonos.filter(t => t.selected).length} teléfono(s)</li>
                        )}
                        {contactOptions.emails.filter(e => e.selected).length === 0 && 
                         contactOptions.telefonos.filter(t => t.selected).length === 0 && (
                          <li className="text-amber-600">⚠️ Ninguno seleccionado</li>
                        )}
                      </ul>
                    </div>
                  </>
                ) : (
                  // Mostrar inputs manuales si no hay datos automáticos
                  <>
                    <div>
                      <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                        <MailIcon className="w-4 h-4 text-gray-500" />
                        <span>Email (opcional)</span>
                      </label>
                      <input
                        type="email"
                        value={contactData.email}
                        onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                        placeholder="ejemplo@correo.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>Teléfono (opcional)</span>
                      </label>
                      <input
                        type="tel"
                        value={contactData.telefono}
                        onChange={(e) => setContactData({ ...contactData, telefono: e.target.value })}
                        placeholder="600123456"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Formato español (9 dígitos) o internacional
                      </p>
                    </div>

                    {!contactData.email && !contactData.telefono && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-sm text-amber-800">
                          ⚠️ Debes ingresar al menos un método de contacto
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="p-6 bg-gray-50 rounded-b-xl flex gap-3 sticky bottom-0">
                <button
                  onClick={() => {
                    if (hasAutoData) {
                      // Enviar con datos seleccionados
                      const selectedEmails = contactOptions.emails.filter(e => e.selected).map(e => e.value);
                      const selectedTelefonos = contactOptions.telefonos.filter(t => t.selected).map(t => t.value);
                      
                      if (selectedEmails.length === 0 && selectedTelefonos.length === 0) {
                        alert('⚠️ Debes seleccionar al menos un email o teléfono');
                        return;
                      }
                      
                      enviarParteServicio(eventoParaEnviar, selectedEmails, selectedTelefonos);
                    } else {
                      // Enviar con datos manuales
                      if (!contactData.email && !contactData.telefono) {
                        alert('⚠️ Debes ingresar al menos un email o teléfono');
                        return;
                      }
                      
                      const emails = contactData.email ? [contactData.email] : [];
                      const telefonos = contactData.telefono ? [contactData.telefono] : [];
                      
                      enviarParteServicio(eventoParaEnviar, emails, telefonos);
                    }
                  }}
                  className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Enviar Parte
                </button>
                <button
                  onClick={() => {
                    setShowContactModal(false);
                    setEventoParaEnviar(null);
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}