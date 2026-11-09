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
  Lock,
  MapPin,
  Calendar,
  FileCheck,
  Building,
  ShieldCheck,
  Search
} from 'lucide-react';
import { mockData } from '../data/mockData';

const RUTAS_DISPONIBLES = [
  { id: '105', nombre: 'Línea 105 Melipilla', detalle: 'AGRETACOMBO · Av. Manso ↔ Circunvalación Santa Teresa' },
  { id: '1', nombre: 'Línea 1 Santiago - Vitacura', detalle: 'TRATCEN S.A. · Santiago Centro ↔ Tabancura / Kennedy' },
  { id: '500007', nombre: 'Recorrido María Pinto', detalle: 'Plaza de Armas María Pinto ↔ Terminal San Borja (Est. Central)' }
];

const GestionConductores = ({ conductores, setConductores, onNavigateCuotas, automoviles = [] }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [fichaModal, setFichaModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [passwordsVisibles, setPasswordsVisibles] = useState({});
  const [showModalPass, setShowModalPass] = useState(false);

  const initialForm = {
    nombre: '',
    rut: '',
    direccion: 'Av. Manso 420, Melipilla',
    telefono: '+56 9 ',
    fonoDomicilio: '+56 2 2831 ',
    email: '',
    fechaIncorporacion: '2022-03-15',
    tipoLicencia: 'A2',
    municipioLicencia: 'I. Municipalidad de Melipilla',
    fechaObtencionLicencia: '2016-05-10',
    duracionLicenciaAnios: 4,
    vencimientoLicencia: '2028-11-15',
    password: 'Conatacoch2026',
    patente: '',
    vehiculo: 'Toyota Yaris 1.5 (Blanco)',
    anioVehiculo: 2022,
    rutaAsignadaId: '105',
    cuotaMensual: 35000,
    cuotasImpagas: 0,
    estado: 'Activo',
    revisionTecnica: '2027-08-30',
    permisoCirculacion: '2027-03-31',
    seguro: '2027-03-31'
  };

  const [formData, setFormData] = useState(initialForm);

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
    setFormData(initialForm);
    setShowModal(true);
  };

  const handleOpenEditar = (c) => {
    setEditingId(c.id);
    setShowModalPass(false);
    setFormData({
      nombre: c.nombre || '',
      rut: c.rut || '',
      direccion: c.direccion || 'Av. Manso 420, Melipilla',
      telefono: c.telefono || '',
      fonoDomicilio: c.fonoDomicilio || '+56 2 2831 4490',
      email: c.email || '',
      fechaIncorporacion: c.fechaIncorporacion || '2020-04-12',
      tipoLicencia: c.tipoLicencia || 'A2',
      municipioLicencia: c.municipioLicencia || 'I. Municipalidad de Melipilla',
      fechaObtencionLicencia: c.fechaObtencionLicencia || '2016-05-10',
      duracionLicenciaAnios: c.duracionLicenciaAnios || 4,
      vencimientoLicencia: c.vencimientoLicencia || c.documentos?.licencia || '2028-11-15',
      password: c.password || 'Conatacoch2026',
      patente: c.patente || '',
      vehiculo: c.vehiculo || '',
      anioVehiculo: c.anioVehiculo || 2022,
      rutaAsignadaId: c.rutaAsignadaId || '105',
      cuotaMensual: c.cuotaMensual || 35000,
      cuotasImpagas: c.cuotasImpagas || 0,
      estado: c.estado || 'Activo',
      revisionTecnica: c.documentos?.revisionTecnica || '2027-08-30',
      permisoCirculacion: c.documentos?.permisoCirculacion || '2027-03-31',
      seguro: c.documentos?.seguro || '2027-03-31'
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

    const conductorData = {
      nombre: formData.nombre.trim(),
      rut: formData.rut.trim(),
      direccion: formData.direccion.trim(),
      telefono: formData.telefono.trim(),
      fonoDomicilio: formData.fonoDomicilio.trim(),
      email: formData.email.trim(),
      fechaIncorporacion: formData.fechaIncorporacion,
      tipoLicencia: formData.tipoLicencia,
      municipioLicencia: formData.municipioLicencia.trim(),
      fechaObtencionLicencia: formData.fechaObtencionLicencia,
      duracionLicenciaAnios: parseInt(formData.duracionLicenciaAnios, 10) || 4,
      vencimientoLicencia: formData.vencimientoLicencia,
      password: clave,
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
        revisionTecnica: formData.revisionTecnica,
        permisoCirculacion: formData.permisoCirculacion,
        seguro: formData.seguro,
        licencia: formData.vencimientoLicencia
      }
    };

    if (editingId) {
      setConductores(prev => prev.map(c => {
        if (c.id === editingId) {
          return {
            ...c,
            ...conductorData,
            historialCuotas: c.historialCuotas || []
          };
        }
        return c;
      }));
      showNotification(`Conductor ${formData.nombre} actualizado con éxito.`);
    } else {
      const newId = `C-00${conductores.length + 1}`;
      const nuevoConductor = {
        id: newId,
        ...conductorData,
        historialCuotas: [
          { id: `CUO-${Date.now()}`, concepto: 'Cuota Ingreso Social', periodo: 'Nov 2026', monto: cuotaMonto, estado: impagas > 0 ? 'Impago' : 'Pagada', fechaPago: impagas === 0 ? '2026-11-08' : null }
        ]
      };
      setConductores(prev => [nuevoConductor, ...prev]);
      showNotification(`¡Conductor ${nuevoConductor.nombre} creado con éxito!`);
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
    if (window.confirm('¿Deseas restablecer los 3 conductores oficiales de prueba con todos los campos del protocolo INACAP?')) {
      setConductores(mockData.conductores);
      localStorage.setItem('conatacoch_conductores_v4', JSON.stringify(mockData.conductores));
      showNotification('Conductores restablecidos a los 3 registros oficiales de prueba.');
    }
  };

  const filteredConductores = conductores.filter(c => {
    const matchSearch = (
      c.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.rut?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.patente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.rutaAsignadaNombre?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchSearch;
  });

  const totalConductores = conductores.length;
  const conductoresAlDia = conductores.filter(c => (c.cuotasImpagas || 0) === 0).length;
  const conductoresMorosos = conductores.filter(c => (c.cuotasImpagas || 0) > 0).length;

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
          boxShadow: '0 8px 25px rgba(0, 168, 89, 0.35)',
          zIndex: 9999,
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Check size={18} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Gestión de Conductores (CRUD Completo INACAP)</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Acreditación gremial CONATACOCH: datos personales, domicilio, licencia profesional y credenciales móviles.
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

      {/* Banner Informativo */}
      <div style={{
        background: '#ecfdf5',
        border: '1px solid #a7f3d0',
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
          <div style={{ padding: '0.5rem', background: '#d1fae5', borderRadius: '8px', color: '#00a859' }}>
            <Key size={20} />
          </div>
          <div>
            <div style={{ fontWeight: '700', color: '#065f46', fontSize: '0.9rem' }}>
              Acceso a la App Móvil y Hoja de Vida Gremial
            </div>
            <div style={{ fontSize: '0.8rem', color: '#047857' }}>
              Haz clic en <Eye size={13} style={{ verticalAlign: 'middle' }} /> para ver la <strong>Ficha Completa INACAP</strong> (Domicilio, Licencia A2/A3, Incorporación gremial).
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <span style={{ color: '#047857', fontWeight: '500' }}>Clave por defecto:</span>
          <span style={{
            background: '#ffffff',
            border: '1px solid #a7f3d0',
            color: '#00a859',
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
            <div className="subtitle" style={{ color: '#059669', fontWeight: '500' }}>
              100% con acreditación gremial
            </div>
          </div>
          <div className="stat-icon green">
            <Car size={24} color="#00a859" />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-info">
            <h3>Estado de Cuotas</h3>
            <div className="value" style={{ fontSize: '1.6rem' }}>
              <span style={{ color: '#00a859' }}>{conductoresAlDia} al día</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: '0 0.5rem' }}>·</span>
              <span style={{ color: '#ef4444' }}>{conductoresMorosos} con deuda</span>
            </div>
            <div className="subtitle">Cuotas gremiales CONATACOCH</div>
          </div>
          <div className="stat-icon blue">
            <DollarSign size={24} color="#00a859" />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-info">
            <h3>Licencias Profesionales</h3>
            <div className="value" style={{ fontSize: '1.6rem', color: '#0284c7' }}>
              A2 / A3
            </div>
            <div className="subtitle">Normativa MTT y CONATACOCH</div>
          </div>
          <div className="stat-icon purple">
            <FileCheck size={24} color="#6d28d9" />
          </div>
        </div>
      </div>

      {/* Barra de Búsqueda */}
      <div className="glass-card" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Search size={18} style={{ color: 'var(--text-secondary)' }} />
        <input
          type="text"
          className="form-control"
          placeholder="Buscar conductor por nombre, RUT, patente o ruta asignada..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>

      {/* Tabla Principal */}
      <div className="glass-card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Conductor / RUT</th>
                <th>Contacto (Cel / Fijo)</th>
                <th>Licencia</th>
                <th>Credenciales App</th>
                <th>Ruta Asignada</th>
                <th>Estado Cuotas</th>
                <th>Estado</th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredConductores.map((c) => {
                const passVisible = passwordsVisibles[c.id];
                const clave = c.password || 'Conatacoch2026';
                const deuda = c.deudaTotal || ((c.cuotasImpagas || 0) * (c.cuotaMensual || 35000));

                return (
                  <tr key={c.id}>
                    {/* Conductor y RUT */}
                    <td>
                      <div>
                        <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{c.nombre}</div>
                        <div style={{ fontSize: '0.8rem', color: '#00a859', fontFamily: 'monospace', fontWeight: 'bold' }}>
                          RUT: {c.rut}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                          Socio desde: {c.fechaIncorporacion || '2020-01-01'}
                        </div>
                      </div>
                    </td>

                    {/* Contacto */}
                    <td>
                      <div style={{ fontSize: '0.82rem' }}>
                        <div><Phone size={12} style={{ verticalAlign: 'middle', marginRight: '4px', color: '#00a859' }} /> {c.telefono}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                          Dom: {c.fonoDomicilio || 'Sin teléfono fijo'}
                        </div>
                      </div>
                    </td>

                    {/* Licencia */}
                    <td>
                      <span className="badge warning" style={{ fontWeight: '700' }}>
                        Clase {c.tipoLicencia || 'A2'}
                      </span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        Vence: {c.vencimientoLicencia || c.documentos?.licencia || '2028-11-15'}
                      </div>
                    </td>

                    {/* Credenciales */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <code style={{
                          background: '#f1f5f9',
                          padding: '0.2rem 0.45rem',
                          borderRadius: '4px',
                          border: '1px solid #cbd5e1',
                          color: '#0f172a',
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}>
                          {passVisible ? clave : '••••••••••••'}
                        </code>
                        <button
                          className="btn btn-outline"
                          onClick={() => togglePasswordVisibility(c.id)}
                          style={{ padding: '0.25rem 0.4rem', border: '1px solid #cbd5e1' }}
                          title={passVisible ? 'Ocultar contraseña' : 'Ver contraseña'}
                        >
                          {passVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button
                          className="btn btn-outline"
                          onClick={() => handleCopyCredentials(c)}
                          style={{ padding: '0.25rem 0.4rem', border: '1px solid #cbd5e1' }}
                          title="Copiar credenciales"
                        >
                          <Copy size={14} color="#00a859" />
                        </button>
                      </div>
                    </td>

                    {/* Ruta Asignada */}
                    <td>
                      <div style={{ maxWidth: '200px' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.25rem 0.55rem',
                          background: 'var(--accent-light)',
                          border: '1px solid #bbf7d0',
                          borderRadius: '6px',
                          color: '#047857',
                          fontWeight: '700',
                          fontSize: '0.8rem'
                        }}>
                          <Route size={13} />
                          {c.rutaAsignadaNombre || 'Línea 105'}
                        </div>
                      </div>
                    </td>

                    {/* Estado Cuotas */}
                    <td>
                      {deuda === 0 ? (
                        <span className="badge success" style={{ fontSize: '0.75rem' }}>
                          <Check size={11} /> Al Día
                        </span>
                      ) : (
                        <span className="badge danger" style={{ fontSize: '0.75rem' }}>
                          <AlertTriangle size={11} /> Moroso (${deuda.toLocaleString('es-CL')})
                        </span>
                      )}
                    </td>

                    {/* Estado */}
                    <td>
                      <span className={`badge ${c.estado === 'Activo' ? 'success' : 'danger'}`}>
                        {c.estado || 'Activo'}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                        <button 
                          className="btn btn-outline" 
                          onClick={() => setFichaModal(c)}
                          style={{ padding: '0.35rem 0.5rem' }}
                          title="Ver Ficha Completa del Conductor"
                        >
                          <Eye size={14} color="#00a859" />
                        </button>
                        <button 
                          className="btn btn-outline" 
                          onClick={() => handleOpenEditar(c)}
                          style={{ padding: '0.35rem 0.5rem' }} 
                          title="Editar Conductor"
                        >
                          <Edit2 size={14} color="#0284c7" />
                        </button>
                        <button 
                          className="btn btn-outline" 
                          onClick={onNavigateCuotas}
                          style={{ padding: '0.35rem 0.5rem' }} 
                          title="Cuotas Sociales"
                        >
                          <DollarSign size={14} color="#b45309" />
                        </button>
                        <button 
                          className="btn btn-outline" 
                          onClick={() => handleDelete(c.id, c.nombre)} 
                          style={{ padding: '0.35rem 0.5rem' }} 
                          title="Eliminar Conductor"
                        >
                          <Trash2 size={14} color="#dc2626" />
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

      {/* MODAL FICHA COMPLETA PROTOCOLO INACAP */}
      {fichaModal && (
        <div className="modal-backdrop" onClick={() => setFichaModal(null)}>
          <div 
            className="modal-content glass-card" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '680px', width: '92%' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck color="#00a859" size={24} />
                  Ficha Oficial del Conductor (INACAP / CONATACOCH)
                </h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ID Socio: {fichaModal.id}</div>
              </div>
              <button className="btn btn-outline" onClick={() => setFichaModal(null)} style={{ padding: '0.25rem 0.5rem' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {/* Sección 1: Datos Personales */}
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #00a859', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '0.9rem', color: '#065f46', fontWeight: '700', marginBottom: '0.6rem' }}>
                  1. Antecedentes Personales y de Contacto
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div><span style={{ color: 'var(--text-secondary)' }}>Nombre Completo:</span><br /><strong style={{ color: '#0f172a' }}>{fichaModal.nombre}</strong></div>
                  <div><span style={{ color: 'var(--text-secondary)' }}>RUT:</span><br /><strong style={{ color: '#00a859' }}>{fichaModal.rut}</strong></div>
                  <div><span style={{ color: 'var(--text-secondary)' }}>Dirección:</span><br /><strong style={{ color: '#0f172a' }}>{fichaModal.direccion || 'Av. Manso 420, Melipilla'}</strong></div>
                  <div><span style={{ color: 'var(--text-secondary)' }}>Fono Celular:</span><br /><strong style={{ color: '#0f172a' }}>{fichaModal.telefono}</strong></div>
                  <div><span style={{ color: 'var(--text-secondary)' }}>Fono Domicilio:</span><br /><strong style={{ color: '#0f172a' }}>{fichaModal.fonoDomicilio || '+56 2 2831 4490'}</strong></div>
                  <div><span style={{ color: 'var(--text-secondary)' }}>Fecha Incorporación CONATACOCH:</span><br /><strong style={{ color: '#0f172a' }}>{fichaModal.fechaIncorporacion || '2018-04-12'}</strong></div>
                </div>
              </div>

              {/* Sección 2: Licencia Profesional */}
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #0284c7', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '0.9rem', color: '#0369a1', fontWeight: '700', marginBottom: '0.6rem' }}>
                  2. Licencia de Conducir Profesional
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div><span style={{ color: 'var(--text-secondary)' }}>Tipo de Licencia:</span><br /><span className="badge warning">Clase {fichaModal.tipoLicencia || 'A2'}</span></div>
                  <div><span style={{ color: 'var(--text-secondary)' }}>Municipio Emisor:</span><br /><strong style={{ color: '#0f172a' }}>{fichaModal.municipioLicencia || 'I. Municipalidad de Melipilla'}</strong></div>
                  <div><span style={{ color: 'var(--text-secondary)' }}>Fecha de Obtención:</span><br /><strong style={{ color: '#0f172a' }}>{fichaModal.fechaObtencionLicencia || '2014-06-20'}</strong></div>
                  <div><span style={{ color: 'var(--text-secondary)' }}>Duración (en años):</span><br /><strong style={{ color: '#0f172a' }}>{fichaModal.duracionLicenciaAnios || 4} años</strong></div>
                  <div><span style={{ color: 'var(--text-secondary)' }}>Fecha de Vencimiento:</span><br /><strong style={{ color: '#b45309' }}>{fichaModal.vencimientoLicencia || fichaModal.documentos?.licencia || '2028-11-15'}</strong></div>
                </div>
              </div>

              {/* Sección 3: Asignación Operacional */}
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #f59e0b', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '0.9rem', color: '#b45309', fontWeight: '700', marginBottom: '0.6rem' }}>
                  3. Asignación Móvil y Recorrido
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div><span style={{ color: 'var(--text-secondary)' }}>Vehículo / Patente:</span><br /><strong style={{ color: '#0f172a' }}>{fichaModal.vehiculo} ({fichaModal.patente})</strong></div>
                  <div><span style={{ color: 'var(--text-secondary)' }}>Ruta Asignada:</span><br /><strong style={{ color: '#0f172a' }}>{fichaModal.rutaAsignadaNombre}</strong></div>
                  <div><span style={{ color: 'var(--text-secondary)' }}>Contraseña App Móvil:</span><br /><code style={{ color: '#00a859', fontWeight: '700' }}>{fichaModal.password || 'Conatacoch2026'}</code></div>
                  <div><span style={{ color: 'var(--text-secondary)' }}>Estado Gremial:</span><br /><span className={`badge ${fichaModal.estado === 'Activo' ? 'success' : 'danger'}`}>{fichaModal.estado}</span></div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', gap: '0.75rem' }}>
              <button 
                className="btn btn-outline" 
                onClick={() => {
                  const c = fichaModal;
                  setFichaModal(null);
                  handleOpenEditar(c);
                }}
              >
                Editar Información
              </button>
              <button className="btn btn-primary" onClick={() => setFichaModal(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREAR / EDITAR CONDUCTOR */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div 
            className="modal-content glass-card animate-fade-in" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '780px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UserPlus color="#00a859" size={24} />
                  {editingId ? `Editar Conductor: ${formData.nombre}` : 'Registrar Nuevo Socio Conductor'}
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Acreditación de datos mínimos según Protocolo de Evaluación INACAP.
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
              {/* Sección 1: Datos Personales Exigidos */}
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#00a859', fontWeight: '700', marginBottom: '0.75rem', letterSpacing: '0.5px' }}>
                  1. Datos Personales del Conductor
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem', marginBottom: '0.85rem' }}>
                  <div>
                    <label className="form-label font-bold">Nombre Completo *</label>
                    <input 
                      required 
                      type="text" 
                      name="nombre" 
                      className="form-control"
                      value={formData.nombre} 
                      onChange={handleInputChange} 
                      placeholder="Ej. Rodrigo Andrés Venegas Soto" 
                    />
                  </div>

                  <div>
                    <label className="form-label font-bold">RUT *</label>
                    <input 
                      required 
                      type="text" 
                      name="rut" 
                      className="form-control"
                      value={formData.rut} 
                      onChange={handleInputChange} 
                      placeholder="14.832.195-3" 
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label className="form-label font-bold">Dirección Particular *</label>
                    <input 
                      required 
                      type="text" 
                      name="direccion" 
                      className="form-control"
                      value={formData.direccion} 
                      onChange={handleInputChange} 
                      placeholder="Ej. Av. Vicuña Mackenna 1420, Depto 402, Melipilla" 
                    />
                  </div>

                  <div>
                    <label className="form-label font-bold">Fono Celular *</label>
                    <input 
                      required 
                      type="text" 
                      name="telefono" 
                      className="form-control"
                      value={formData.telefono} 
                      onChange={handleInputChange} 
                      placeholder="+56 9 8451 2290" 
                    />
                  </div>

                  <div>
                    <label className="form-label font-bold">Fono Domicilio *</label>
                    <input 
                      required 
                      type="text" 
                      name="fonoDomicilio" 
                      className="form-control"
                      value={formData.fonoDomicilio} 
                      onChange={handleInputChange} 
                      placeholder="+56 2 2831 4490" 
                    />
                  </div>

                  <div>
                    <label className="form-label">Correo Electrónico</label>
                    <input 
                      required 
                      type="email" 
                      name="email" 
                      className="form-control"
                      value={formData.email} 
                      onChange={handleInputChange} 
                      placeholder="conductor@conatacoch.cl" 
                    />
                  </div>

                  <div>
                    <label className="form-label font-bold">Fecha de Incorporación a CONATACOCH *</label>
                    <input 
                      required 
                      type="date" 
                      name="fechaIncorporacion" 
                      className="form-control"
                      value={formData.fechaIncorporacion} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
              </div>

              {/* Sección 2: Licencia de Conducir Profesional */}
              <div style={{ marginBottom: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#0369a1', fontWeight: '700', marginBottom: '0.75rem', letterSpacing: '0.5px' }}>
                  2. Licencia de Conducir Profesional (Protocolo INACAP)
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.85rem' }}>
                  <div>
                    <label className="form-label font-bold">Tipo de Licencia (A2-A3) *</label>
                    <select
                      name="tipoLicencia"
                      className="form-control"
                      value={formData.tipoLicencia}
                      onChange={handleInputChange}
                    >
                      <option value="A2">Clase A2 (Taxis y Colectivos)</option>
                      <option value="A3">Clase A3 (Colectivos, Micros y Buses)</option>
                      <option value="A2 y A3">Clases A2 y A3</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label font-bold">Municipio que Otorgó Licencia *</label>
                    <input 
                      required 
                      type="text" 
                      name="municipioLicencia" 
                      className="form-control"
                      value={formData.municipioLicencia} 
                      onChange={handleInputChange} 
                      placeholder="Ej. I. Municipalidad de Melipilla" 
                    />
                  </div>

                  <div>
                    <label className="form-label font-bold">Fecha de Obtención *</label>
                    <input 
                      required 
                      type="date" 
                      name="fechaObtencionLicencia" 
                      className="form-control"
                      value={formData.fechaObtencionLicencia} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  <div>
                    <label className="form-label font-bold">Duración (en años) *</label>
                    <input 
                      required 
                      type="number" 
                      name="duracionLicenciaAnios" 
                      className="form-control"
                      value={formData.duracionLicenciaAnios} 
                      onChange={handleInputChange} 
                      min="1"
                      max="10"
                    />
                  </div>

                  <div>
                    <label className="form-label font-bold">Fecha de Vencimiento *</label>
                    <input 
                      required 
                      type="date" 
                      name="vencimientoLicencia" 
                      className="form-control"
                      value={formData.vencimientoLicencia} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
              </div>

              {/* Sección 3: Móvil, Ruta y Credenciales */}
              <div style={{ marginBottom: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#b45309', fontWeight: '700', marginBottom: '0.75rem', letterSpacing: '0.5px' }}>
                  3. Credenciales Móviles y Asignación Operacional
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.85rem' }}>
                  <div>
                    <label className="form-label font-bold">Contraseña App Móvil *</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        required 
                        type={showModalPass ? "text" : "password"} 
                        name="password" 
                        value={formData.password} 
                        onChange={handleInputChange} 
                        className="form-control"
                        placeholder="Conatacoch2026" 
                        style={{ paddingRight: '2.5rem', fontFamily: 'monospace' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowModalPass(!showModalPass)}
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                      >
                        {showModalPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="form-label font-bold">Patente Móvil</label>
                    <input 
                      required 
                      type="text" 
                      name="patente" 
                      value={formData.patente} 
                      onChange={handleInputChange} 
                      className="form-control"
                      placeholder="BBCL-11" 
                      style={{ textTransform: 'uppercase' }}
                    />
                  </div>

                  <div>
                    <label className="form-label">Modelo Vehículo</label>
                    <input 
                      type="text" 
                      name="vehiculo" 
                      value={formData.vehiculo} 
                      onChange={handleInputChange} 
                      className="form-control"
                      placeholder="Toyota Yaris 1.5" 
                    />
                  </div>

                  <div>
                    <label className="form-label font-bold">Ruta Asignada</label>
                    <select
                      name="rutaAsignadaId"
                      className="form-control"
                      value={formData.rutaAsignadaId}
                      onChange={handleInputChange}
                    >
                      {RUTAS_DISPONIBLES.map(r => (
                        <option key={r.id} value={r.id}>
                          {r.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label font-bold">Estado</label>
                    <select
                      name="estado"
                      className="form-control"
                      value={formData.estado}
                      onChange={handleInputChange}
                    >
                      <option value="Activo">Activo</option>
                      <option value="Suspendido">Suspendido</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
