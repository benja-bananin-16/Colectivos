import React, { useState } from 'react';
import { 
  UserPlus, 
  Edit2, 
  Trash2, 
  X, 
  Check, 
  Car, 
  Route, 
  DollarSign, 
  Phone, 
  Mail, 
  AlertTriangle,
  RotateCcw,
  Eye,
  EyeOff,
  Copy,
  Key,
  Lock
} from 'lucide-react';
import { mockData } from '../data/mockData';

const RUTAS_DISPONIBLES = [
  { id: '105', nombre: 'Línea 105 Melipilla', detalle: 'AGRETACOMBO · Av. Manso ↔ Circunvalación Santa Teresa' },
  { id: '1', nombre: 'Línea 1 Santiago - Vitacura', detalle: 'TRATCEN S.A. · Santiago Centro ↔ Tabancura / Kennedy' },
  { id: '500007', nombre: 'Recorrido María Pinto', detalle: 'Plaza de Armas María Pinto ↔ Terminal San Borja (Est. Central)' }
];

const GestionConductores = ({ conductores, setConductores, onNavigateCuotas }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  
  // Mapa de contraseñas visibles por ID de conductor
  const [passwordsVisibles, setPasswordsVisibles] = useState({});
  const [showModalPass, setShowModalPass] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    password: 'Conatacoch2026',
    telefono: '',
    email: '',
    patente: '',
    vehiculo: '',
    anioVehiculo: 2022,
    rutaAsignadaId: '105',
    cuotaMensual: 35000,
    cuotasImpagas: 0,
    estado: 'Activo',
    revisionTecnica: '2027-08-30',
    permisoCirculacion: '2027-03-31',
    seguro: '2027-03-31',
    licencia: '2028-11-15'
  });

  const showNotification = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3800);
  };

  const togglePasswordVisibility = (id) => {
    setPasswordsVisibles(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopyCredentials = (c) => {
    const clave = c.password || 'Conatacoch2026';
    const texto = `RUT: ${c.rut}\nContraseña: ${clave}\nMóvil: ${c.patente}\nRuta: ${c.rutaAsignadaNombre || 'Línea 105'}`;
    navigator.clipboard.writeText(texto);
    showNotification(`¡Credenciales de ${c.nombre} copiadas al portapapeles! (RUT: ${c.rut} | Clave: ${clave})`);
  };

  const handleOpenCrear = () => {
    setEditingId(null);
    setShowModalPass(false);
    setFormData({
      nombre: '',
      rut: '',
      password: 'Conatacoch2026',
      telefono: '+56 9 ',
      email: '',
      patente: '',
      vehiculo: 'Toyota Yaris 1.5 (Blanco)',
      anioVehiculo: 2023,
      rutaAsignadaId: '105',
      cuotaMensual: 35000,
      cuotasImpagas: 0,
      estado: 'Activo',
      revisionTecnica: '2027-08-30',
      permisoCirculacion: '2027-03-31',
      seguro: '2027-03-31',
      licencia: '2028-11-15'
    });
    setShowModal(true);
  };

  const handleOpenEditar = (c) => {
    setEditingId(c.id);
    setShowModalPass(false);
    setFormData({
      nombre: c.nombre,
      rut: c.rut,
      password: c.password || 'Conatacoch2026',
      telefono: c.telefono,
      email: c.email,
      patente: c.patente,
      vehiculo: c.vehiculo || '',
      anioVehiculo: c.anioVehiculo || 2022,
      rutaAsignadaId: c.rutaAsignadaId || '105',
      cuotaMensual: c.cuotaMensual || 35000,
      cuotasImpagas: c.cuotasImpagas || 0,
      estado: c.estado || 'Activo',
      revisionTecnica: c.documentos?.revisionTecnica || '2027-08-30',
      permisoCirculacion: c.documentos?.permisoCirculacion || '2027-03-31',
      seguro: c.documentos?.seguro || '2027-03-31',
      licencia: c.documentos?.licencia || '2028-11-15'
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const rutaSel = RUTAS_DISPONIBLES.find(r => r.id === formData.rutaAsignadaId) || RUTAS_DISPONIBLES[0];
    const impagas = parseInt(formData.cuotasImpagas, 10) || 0;
    const cuotaMonto = parseInt(formData.cuotaMensual, 10) || 35000;
    const deuda = impagas * cuotaMonto;
    const estadoCuotas = impagas === 0 ? 'Al Día' : impagas >= 3 ? 'Moroso' : 'Pendiente';
    const clave = formData.password.trim() || 'Conatacoch2026';

    if (editingId) {
      // Actualizar conductor existente
      setConductores(prev => prev.map(c => {
        if (c.id === editingId) {
          return {
            ...c,
            nombre: formData.nombre.trim(),
            rut: formData.rut.trim(),
            password: clave,
            telefono: formData.telefono.trim(),
            email: formData.email.trim(),
            patente: formData.patente.trim().toUpperCase(),
            vehiculo: formData.vehiculo.trim(),
            anioVehiculo: parseInt(formData.anioVehiculo, 10) || 2022,
            rutaAsignadaId: rutaSel.id,
            rutaAsignadaNombre: rutaSel.nombre,
            rutaDetalle: rutaSel.detalle,
            cuotaMensual: cuotaMonto,
            cuotasImpagas: impagas,
            deudaTotal: deuda,
            estadoCuotas,
            estado: formData.estado,
            documentos: {
              ...c.documentos,
              revisionTecnica: formData.revisionTecnica,
              permisoCirculacion: formData.permisoCirculacion,
              seguro: formData.seguro,
              licencia: formData.licencia
            }
          };
        }
        return c;
      }));
      showNotification(`Conductor ${formData.nombre} actualizado. Contraseña guardada.`);
    } else {
      // Crear nuevo conductor
      const newId = `C-00${conductores.length + 1}`;
      const nuevoConductor = {
        id: newId,
        nombre: formData.nombre.trim(),
        rut: formData.rut.trim(),
        password: clave,
        telefono: formData.telefono.trim(),
        email: formData.email.trim(),
        patente: formData.patente.trim().toUpperCase(),
        vehiculo: formData.vehiculo.trim(),
        anioVehiculo: parseInt(formData.anioVehiculo, 10) || 2022,
        rutaAsignadaId: rutaSel.id,
        rutaAsignadaNombre: rutaSel.nombre,
        rutaDetalle: rutaSel.detalle,
        cuotaMensual: cuotaMonto,
        cuotasImpagas: impagas,
        deudaTotal: deuda,
        estadoCuotas,
        estado: formData.estado,
        historialCuotas: [
          { id: `CUO-${Date.now()}`, concepto: 'Cuota Ingreso Social', periodo: 'Nov 2026', monto: cuotaMonto, estado: impagas > 0 ? 'Impago' : 'Pagada', fechaPago: impagas === 0 ? '2026-11-08' : null }
        ],
        documentos: {
          revisionTecnica: formData.revisionTecnica,
          permisoCirculacion: formData.permisoCirculacion,
          seguro: formData.seguro,
          licencia: formData.licencia
        }
      };

      setConductores(prev => [nuevoConductor, ...prev]);
      showNotification(`¡Conductor ${nuevoConductor.nombre} creado con contraseña '${clave}'!`);
    }

    setShowModal(false);
  };

  const handleDelete = (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar al conductor ${nombre}? Esta acción no se puede deshacer.`)) {
      setConductores(prev => prev.filter(c => c.id !== id));
      showNotification(`Conductor ${nombre} eliminado.`);
    }
  };

  const handleRestablecerMock = () => {
    if (window.confirm('¿Deseas restablecer los 3 conductores de prueba iniciales (Línea 105, Línea 1 y María Pinto)?')) {
      setConductores(mockData.conductores);
      localStorage.setItem('conatacoch_conductores_v3', JSON.stringify(mockData.conductores));
      showNotification('Conductores restablecidos a los 3 registros oficiales de prueba.');
    }
  };

  // KPIs
  const totalConductores = conductores.length;
  const conductoresAlDia = conductores.filter(c => (c.cuotasImpagas || 0) === 0).length;
  const conductoresMorosos = conductores.filter(c => (c.cuotasImpagas || 0) > 0).length;
  const totalDeudaGremial = conductores.reduce((acc, c) => acc + (c.deudaTotal || ((c.cuotasImpagas || 0) * (c.cuotaMensual || 35000))), 0);

  return (
    <div className="animate-fade-in">
      {/* Toast Notificación */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'var(--accent-primary)',
          color: '#ffffff',
          padding: '0.85rem 1.5rem',
          borderRadius: '8px',
          boxShadow: '0 8px 25px rgba(0, 168, 89, 0.4)',
          zIndex: 9999,
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Check size={18} />
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="page-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Gestión de Conductores y Cuentas</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Panel Superadministrador: visualiza y administra credenciales móviles (RUT y contraseñas), asigna rutas y supervisa cuotas.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className="btn btn-outline" 
            onClick={handleRestablecerMock}
            title="Recargar los 3 conductores de prueba iniciales"
            style={{ fontSize: '0.85rem' }}
          >
            <RotateCcw size={16} />
            Restablecer 3 Conductores
          </button>
          <button className="btn btn-primary" onClick={handleOpenCrear}>
            <UserPlus size={18} />
            Crear Nuevo Conductor
          </button>
        </div>
      </div>

      {/* Banner Informativo de Credenciales */}
      <div style={{
        background: 'rgba(0, 168, 89, 0.1)',
        border: '1px solid rgba(0, 168, 89, 0.3)',
        borderRadius: '10px',
        padding: '0.85rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.5rem', background: 'rgba(0, 168, 89, 0.2)', borderRadius: '8px', color: 'var(--accent-primary)' }}>
            <Key size={20} />
          </div>
          <div>
            <div style={{ fontWeight: '600', color: '#ffffff', fontSize: '0.9rem' }}>
              Acceso a la App Móvil para Conductores
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Puedes ver la contraseña de cada conductor haciendo clic en el ícono de ojo <Eye size={13} style={{ verticalAlign: 'middle', margin: '0 2px' }} /> o copiarla con <Copy size={13} style={{ verticalAlign: 'middle', margin: '0 2px' }} />.
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Contraseña por defecto:</span>
          <span style={{
            background: 'rgba(0, 168, 89, 0.25)',
            border: '1px solid rgba(0, 168, 89, 0.5)',
            color: '#34d399',
            padding: '0.2rem 0.6rem',
            borderRadius: '6px',
            fontFamily: 'monospace',
            fontWeight: 'bold'
          }}>
            Conatacoch2026
          </span>
        </div>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card stat-card">
          <div className="stat-info">
            <h3>Socios Conductores</h3>
            <div className="value">{totalConductores}</div>
            <div className="subtitle" style={{ color: 'var(--accent-secondary)' }}>
              100% con cuentas móviles activas
            </div>
          </div>
          <div className="stat-icon green">
            <Car size={24} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-info">
            <h3>Estado de Cuotas</h3>
            <div className="value" style={{ fontSize: '1.6rem' }}>
              <span style={{ color: '#00a859' }}>{conductoresAlDia} al día</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: '0 0.5rem' }}>·</span>
              <span style={{ color: '#f87171' }}>{conductoresMorosos} con deuda</span>
            </div>
            <div className="subtitle">Cuotas gremiales CONATACOCH</div>
          </div>
          <div className="stat-icon blue">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-info">
            <h3>Deuda Total Acumulada</h3>
            <div className="value" style={{ color: totalDeudaGremial > 0 ? '#f87171' : 'var(--accent-primary)' }}>
              ${totalDeudaGremial.toLocaleString('es-CL')}
            </div>
            <div className="subtitle">
              {totalDeudaGremial > 0 ? 'Pendiente de recaudación' : 'Todas las cuotas al día'}
            </div>
          </div>
          <div className="stat-icon orange">
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* Tabla Principal */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '600' }}>Cuentas de Conductores en la Flota</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Consulta el RUT y contraseña de cada conductor para iniciar sesión en la app de Android.
            </p>
          </div>
          <span className="badge" style={{ background: 'rgba(0, 168, 89, 0.15)', color: 'var(--accent-primary)', border: '1px solid rgba(0, 168, 89, 0.3)' }}>
            {conductores.length} Cuentas Registradas
          </span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Conductor / Socio</th>
                <th>RUT Acceso</th>
                <th>Contraseña App Móvil</th>
                <th>Móvil / Patente</th>
                <th>Ruta Asignada (Auto-inicio)</th>
                <th>Deuda Cuotas</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {conductores.map((c) => {
                const deuda = c.deudaTotal !== undefined ? c.deudaTotal : ((c.cuotasImpagas || 0) * (c.cuotaMensual || 35000));
                const passwordConductor = c.password || 'Conatacoch2026';
                const isPasswordVisible = passwordsVisibles[c.id];

                return (
                  <tr key={c.id}>
                    <td>
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                          {c.nombre}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.75rem', marginTop: '0.2rem' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                            <Phone size={12} /> {c.telefono || 'Sin fono'}
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                            <Mail size={12} /> {c.email || 'Sin email'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Columna RUT */}
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.5rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        fontFamily: 'monospace',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        color: '#ffffff'
                      }}>
                        {c.rut || '---'}
                      </span>
                    </td>

                    {/* Columna Contraseña App Móvil con Ver/Ocultar y Copiar */}
                    <td>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <div style={{
                          padding: '0.25rem 0.55rem',
                          background: isPasswordVisible ? 'rgba(0, 168, 89, 0.2)' : 'rgba(0, 0, 0, 0.35)',
                          border: `1px solid ${isPasswordVisible ? 'rgba(0, 168, 89, 0.5)' : 'var(--border-color)'}`,
                          borderRadius: '6px',
                          fontFamily: 'monospace',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          color: isPasswordVisible ? '#34d399' : 'var(--text-secondary)',
                          letterSpacing: isPasswordVisible ? '0.03em' : '0.15em',
                          minWidth: '110px',
                          textAlign: 'center'
                        }}>
                          {isPasswordVisible ? passwordConductor : '••••••••••••'}
                        </div>

                        <button 
                          className="btn btn-outline"
                          onClick={() => togglePasswordVisibility(c.id)}
                          style={{ padding: '0.3rem', color: isPasswordVisible ? '#34d399' : 'var(--text-secondary)' }}
                          title={isPasswordVisible ? "Ocultar contraseña" : "Ver contraseña de la app"}
                        >
                          {isPasswordVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>

                        <button 
                          className="btn btn-outline"
                          onClick={() => handleCopyCredentials(c)}
                          style={{ padding: '0.3rem', color: 'var(--accent-primary)' }}
                          title="Copiar credenciales completas (RUT y Clave)"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </td>

                    {/* Columna Móvil */}
                    <td>
                      <div>
                        <span style={{
                          display: 'inline-block',
                          padding: '0.2rem 0.6rem',
                          background: '#00a859',
                          color: '#ffffff',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          letterSpacing: '0.05em',
                          fontSize: '0.85rem'
                        }}>
                          {c.patente}
                        </span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                          {c.vehiculo || 'Colectivo'} ({c.anioVehiculo || '2022'})
                        </div>
                      </div>
                    </td>

                    {/* Columna Ruta Asignada */}
                    <td>
                      <div style={{ maxWidth: '260px' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.25rem 0.6rem',
                          background: 'rgba(0, 168, 89, 0.12)',
                          border: '1px solid rgba(0, 168, 89, 0.3)',
                          borderRadius: '6px',
                          color: '#34d399',
                          fontWeight: '600',
                          fontSize: '0.85rem'
                        }}>
                          <Route size={14} />
                          {c.rutaAsignadaNombre || 'Línea 105 Melipilla'}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: '1.2' }}>
                          {c.rutaDetalle || 'Auto-inicio configurado'}
                        </div>
                      </div>
                    </td>

                    {/* Columna Deuda */}
                    <td>
                      <div>
                        {deuda === 0 ? (
                          <span className="badge success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Check size={12} /> Al Día ($0)
                          </span>
                        ) : (c.cuotasImpagas || 0) >= 3 ? (
                          <span className="badge danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <AlertTriangle size={12} /> Moroso (${deuda.toLocaleString('es-CL')})
                          </span>
                        ) : (
                          <span className="badge warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            Pendiente (${deuda.toLocaleString('es-CL')})
                          </span>
                        )}
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                          {c.cuotasImpagas === 0 ? 'Sin deuda pendiente' : `${c.cuotasImpagas} cuota(s) impaga(s)`}
                        </div>
                      </div>
                    </td>

                    {/* Columna Estado */}
                    <td>
                      <span className={`badge ${c.estado === 'Activo' ? 'success' : 'danger'}`}>
                        {c.estado || 'Activo'}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button 
                          className="btn btn-outline" 
                          onClick={() => handleOpenEditar(c)}
                          style={{ padding: '0.4rem', color: '#34d399', borderColor: 'rgba(0, 168, 89, 0.3)' }} 
                          title="Editar Conductor y Contraseña"
                        >
                          <Edit2 size={15} />
                        </button>

                        <button 
                          className="btn btn-outline" 
                          onClick={onNavigateCuotas}
                          style={{ padding: '0.4rem', color: 'var(--warning)', borderColor: 'rgba(245, 158, 11, 0.3)' }} 
                          title="Administrar Cuotas Sociales"
                        >
                          <DollarSign size={15} />
                        </button>

                        <button 
                          className="btn btn-outline" 
                          onClick={() => handleDelete(c.id, c.nombre)} 
                          style={{ padding: '0.4rem', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }} 
                          title="Eliminar Conductor"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear / Editar Conductor */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="glass-card animate-fade-in" style={{
            width: '100%', 
            maxWidth: '620px', 
            maxHeight: '90vh', 
            overflowY: 'auto',
            border: '1px solid rgba(0, 168, 89, 0.3)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#ffffff' }}>
                  {editingId ? 'Editar Conductor y Credenciales' : 'Registrar Nuevo Socio Conductor'}
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Define el RUT, contraseña de app móvil y ruta asignada para el conductor.
                </p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Sección 1: Datos Personales y Credenciales */}
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#34d399', fontWeight: 'bold', marginBottom: '0.75rem', letterSpacing: '0.5px' }}>
                  1. Datos Personales y Credenciales Móviles
                </h3>
                <div className="input-group" style={{ marginBottom: '0.75rem' }}>
                  <label>Nombre Completo del Conductor</label>
                  <input 
                    required 
                    type="text" 
                    name="nombre" 
                    value={formData.nombre} 
                    onChange={handleInputChange} 
                    placeholder="Ej. Rodrigo Andrés Venegas Soto" 
                  />
                </div>

                <div className="grid-2" style={{ marginBottom: '0.75rem', gap: '0.75rem' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>RUT Conductor (Usuario App)</label>
                    <input 
                      required 
                      type="text" 
                      name="rut" 
                      value={formData.rut} 
                      onChange={handleInputChange} 
                      placeholder="14.832.195-3" 
                    />
                  </div>

                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Contraseña App Móvil</span>
                      <button 
                        type="button" 
                        onClick={() => setShowModalPass(!showModalPass)}
                        style={{ background: 'none', border: 'none', color: '#34d399', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                      >
                        {showModalPass ? <EyeOff size={13} /> : <Eye size={13} />}
                        {showModalPass ? 'Ocultar' : 'Ver clave'}
                      </button>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        required 
                        type={showModalPass ? "text" : "password"} 
                        name="password" 
                        value={formData.password} 
                        onChange={handleInputChange} 
                        placeholder="Conatacoch2026" 
                        style={{ paddingRight: '2.5rem', fontFamily: 'monospace' }}
                      />
                      <Lock size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    </div>
                  </div>
                </div>

                <div className="grid-2" style={{ marginBottom: 0, gap: '0.75rem' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Teléfono Móvil</label>
                    <input 
                      required 
                      type="text" 
                      name="telefono" 
                      value={formData.telefono} 
                      onChange={handleInputChange} 
                      placeholder="+56 9 8451 2290" 
                    />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Correo Electrónico</label>
                    <input 
                      required 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      placeholder="conductor@conatacoch.cl" 
                    />
                  </div>
                </div>
              </div>

              {/* Sección 2: Móvil y Ruta Asignada */}
              <div style={{ marginBottom: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#34d399', fontWeight: 'bold', marginBottom: '0.75rem', letterSpacing: '0.5px' }}>
                  2. Móvil y Asignación de Recorrido
                </h3>
                
                <div className="grid-2" style={{ marginBottom: '0.75rem', gap: '0.75rem' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Patente del Vehículo</label>
                    <input 
                      required 
                      type="text" 
                      name="patente" 
                      value={formData.patente} 
                      onChange={handleInputChange} 
                      placeholder="BBCL-11" 
                    />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Año del Móvil</label>
                    <input 
                      required 
                      type="number" 
                      name="anioVehiculo" 
                      value={formData.anioVehiculo} 
                      onChange={handleInputChange} 
                      min="2000" 
                      max="2027" 
                    />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: '0.75rem' }}>
                  <label>Marca y Modelo del Vehículo</label>
                  <input 
                    required 
                    type="text" 
                    name="vehiculo" 
                    value={formData.vehiculo} 
                    onChange={handleInputChange} 
                    placeholder="Nissan Versa Sense 1.6 (Blanco)" 
                  />
                </div>

                {/* Dropdown de Ruta Asignada */}
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Ruta Asignada (Auto-inicio en App Móvil)</span>
                    <span style={{ color: '#34d399', fontSize: '0.75rem' }}>★ Obligatorio</span>
                  </label>
                  <select
                    name="rutaAsignadaId"
                    value={formData.rutaAsignadaId}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid var(--border-color)',
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      color: '#ffffff',
                      fontSize: '0.95rem'
                    }}
                  >
                    {RUTAS_DISPONIBLES.map(r => (
                      <option key={r.id} value={r.id} style={{ background: '#0f172a', color: '#ffffff' }}>
                        {r.nombre} ({r.detalle})
                      </option>
                    ))}
                  </select>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.35rem' }}>
                    Al iniciar la jornada en el móvil, este recorrido se seleccionará automáticamente.
                  </span>
                </div>
              </div>

              {/* Sección 3: Cuotas Gremiales y Estado */}
              <div style={{ marginBottom: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#34d399', fontWeight: 'bold', marginBottom: '0.75rem', letterSpacing: '0.5px' }}>
                  3. Cuotas Sociales y Estado Gremial
                </h3>
                <div className="grid-3" style={{ marginBottom: 0, gap: '0.75rem' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Cuota Mensual ($CLP)</label>
                    <input 
                      type="number" 
                      name="cuotaMensual" 
                      value={formData.cuotaMensual} 
                      onChange={handleInputChange} 
                      step="1000" 
                    />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Cuotas Impagas (Deuda)</label>
                    <input 
                      type="number" 
                      name="cuotasImpagas" 
                      value={formData.cuotasImpagas} 
                      onChange={handleInputChange} 
                      min="0" 
                      max="24" 
                    />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Estado Conductor</label>
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid var(--border-color)',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        color: '#ffffff',
                        fontSize: '0.9rem'
                      }}
                    >
                      <option value="Activo" style={{ background: '#0f172a' }}>Activo</option>
                      <option value="Suspendido" style={{ background: '#0f172a' }}>Suspendido</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                  <Check size={18} />
                  {editingId ? 'Guardar Cambios' : 'Registrar Conductor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionConductores;
