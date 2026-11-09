import React, { useState } from 'react';
import { 
  Car, 
  Plus, 
  Edit2, 
  Trash2, 
  FileText, 
  Check, 
  X, 
  AlertTriangle, 
  Search, 
  ShieldCheck, 
  Wrench, 
  FileCheck, 
  Calendar,
  Fuel,
  MapPin,
  DollarSign,
  User,
  RotateCcw,
  Eye
} from 'lucide-react';
import { mockData } from '../data/mockData';

const COMBUSTIBLES = ['Bencina', 'Diésel', 'Híbrido', 'Eléctrico', 'GLP', 'GNC'];

const GestionAutomoviles = ({ automoviles, setAutomoviles, conductores = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCombustible, setFilterCombustible] = useState('TODOS');
  const [filterEstado, setFilterEstado] = useState('TODOS');

  // Modales
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [detalleModal, setDetalleModal] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  // Form State
  const initialForm = {
    patente: '',
    numeroInterno: '',
    marca: '',
    modelo: '',
    anio: new Date().getFullYear(),
    combustible: 'Bencina',
    color: 'Blanco',
    capacidad: 4,
    estado: 'Activo',
    conductorId: '',
    // Permiso de Circulación
    permisoComuna: 'Melipilla',
    permisoFechaOtorgacion: '2026-03-15',
    permisoVencimiento: '2027-03-31',
    // Revisión Técnica
    revisionPlanta: 'SGS Melipilla AB-1302',
    revisionComuna: 'Melipilla',
    revisionVencimiento: '2027-08-30',
    // Seguro Obligatorio (SOAP)
    seguroCompania: 'BCI Seguros Generales',
    seguroPrima: '$18.500 CLP (0.48 UF)',
    seguroVencimiento: '2027-03-31'
  };

  const [formData, setFormData] = useState(initialForm);

  const showNotification = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3800);
  };

  const handleOpenCrear = () => {
    setEditingId(null);
    setFormData(initialForm);
    setShowModal(true);
  };

  const handleOpenEditar = (auto) => {
    setEditingId(auto.id);
    setFormData({
      patente: auto.patente,
      numeroInterno: auto.numeroInterno || '',
      marca: auto.marca,
      modelo: auto.modelo,
      anio: auto.anio,
      combustible: auto.combustible || 'Bencina',
      color: auto.color || 'Blanco',
      capacidad: auto.capacidad || 4,
      estado: auto.estado || 'Activo',
      conductorId: auto.conductorId || '',
      permisoComuna: auto.permisoCirculacion?.comuna || '',
      permisoFechaOtorgacion: auto.permisoCirculacion?.fechaOtorgacion || '',
      permisoVencimiento: auto.permisoCirculacion?.vencimiento || '',
      revisionPlanta: auto.revisionTecnica?.planta || '',
      revisionComuna: auto.revisionTecnica?.comuna || '',
      revisionVencimiento: auto.revisionTecnica?.vencimiento || '',
      seguroCompania: auto.seguroObligatorio?.compania || '',
      seguroPrima: auto.seguroObligatorio?.prima || '',
      seguroVencimiento: auto.seguroObligatorio?.vencimiento || ''
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const patenteFormateada = formData.patente.toUpperCase().trim();
    if (!patenteFormateada) {
      alert('La patente es obligatoria.');
      return;
    }

    const conductorEncontrado = conductores.find(c => c.id === formData.conductorId);
    const conductorNombre = conductorEncontrado ? conductorEncontrado.nombre : 'Sin Conductor Asignado';

    const vehiculoData = {
      patente: patenteFormateada,
      numeroInterno: formData.numeroInterno.trim() || `M-${Math.floor(100 + Math.random() * 900)}`,
      marca: formData.marca.trim(),
      modelo: formData.modelo.trim(),
      anio: parseInt(formData.anio, 10) || 2022,
      combustible: formData.combustible,
      color: formData.color.trim() || 'Blanco',
      capacidad: parseInt(formData.capacidad, 10) || 4,
      estado: formData.estado,
      conductorId: formData.conductorId || null,
      conductorNombre: conductorNombre,
      permisoCirculacion: {
        comuna: formData.permisoComuna.trim(),
        fechaOtorgacion: formData.permisoFechaOtorgacion,
        vencimiento: formData.permisoVencimiento
      },
      revisionTecnica: {
        planta: formData.revisionPlanta.trim(),
        comuna: formData.revisionComuna.trim(),
        vencimiento: formData.revisionVencimiento
      },
      seguroObligatorio: {
        compania: formData.seguroCompania.trim(),
        prima: formData.seguroPrima.trim(),
        vencimiento: formData.seguroVencimiento
      }
    };

    if (editingId) {
      setAutomoviles(prev => prev.map(a => a.id === editingId ? { ...vehiculoData, id: editingId } : a));
      showNotification(`Automóvil patente ${patenteFormateada} actualizado correctamente.`);
    } else {
      const nuevoAuto = {
        ...vehiculoData,
        id: `AUT-00${automoviles.length + 1}`
      };
      setAutomoviles(prev => [nuevoAuto, ...prev]);
      showNotification(`Automóvil patente ${patenteFormateada} registrado con éxito.`);
    }

    setShowModal(false);
  };

  const handleDelete = (id, patente) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el automóvil patente ${patente}?`)) {
      setAutomoviles(prev => prev.filter(a => a.id !== id));
      showNotification(`Automóvil patente ${patente} eliminado.`);
    }
  };

  const handleRestablecerMock = () => {
    if (window.confirm('¿Deseas restablecer los automóviles de prueba iniciales de CONATACOCH?')) {
      setAutomoviles(mockData.automoviles);
      localStorage.setItem('conatacoch_automoviles_v1', JSON.stringify(mockData.automoviles));
      showNotification('Automóviles restablecidos a los registros oficiales de prueba.');
    }
  };

  const getSemaforo = (fechaVenc) => {
    if (!fechaVenc) return { badge: 'badge-secondary', texto: 'Sin fecha' };
    const hoy = new Date();
    const venc = new Date(fechaVenc);
    const diffDias = Math.ceil((venc - hoy) / (1000 * 60 * 60 * 24));

    if (diffDias < 0) {
      return { badge: 'badge danger', texto: 'Vencido', color: '#ef4444' };
    }
    if (diffDias <= 30) {
      return { badge: 'badge warning', texto: `Por vencer (${diffDias}d)`, color: '#f59e0b' };
    }
    return { badge: 'badge success', texto: 'Vigente', color: '#00a859' };
  };

  const filteredAutos = automoviles.filter(a => {
    const matchSearch = (
      a.patente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.conductorNombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.numeroInterno?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchCombustible = filterCombustible === 'TODOS' || a.combustible === filterCombustible;
    const matchEstado = filterEstado === 'TODOS' || a.estado === filterEstado;
    return matchSearch && matchCombustible && matchEstado;
  });

  const totalAutos = automoviles.length;
  const autosActivos = automoviles.filter(a => a.estado === 'Activo').length;
  const autosMantenimiento = automoviles.filter(a => a.estado === 'Mantenimiento').length;

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
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Car size={28} color="#00a859" />
            Gestión de Automóviles y Flota
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            CRUD completo de vehículos según protocolo INACAP: Permiso de Circulación, Revisión Técnica y SOAP.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className="btn btn-outline" 
            onClick={handleRestablecerMock}
            title="Restablecer flota oficial de prueba"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
          >
            <RotateCcw size={15} />
            Restablecer Flota
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleOpenCrear}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={18} />
            Nuevo Automóvil
          </button>
        </div>
      </div>

      {/* KPIs Rápidos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--accent-light)', padding: '0.75rem', borderRadius: '10px' }}>
            <Car size={24} color="#00a859" />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>{totalAutos}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500' }}>Total Vehículos en Flota</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#dcfce7', padding: '0.75rem', borderRadius: '10px' }}>
            <ShieldCheck size={24} color="#15803d" />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#15803d' }}>{autosActivos}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500' }}>Móviles Activos / Habilitados</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#fef3c7', padding: '0.75rem', borderRadius: '10px' }}>
            <Wrench size={24} color="#b45309" />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#b45309' }}>{autosMantenimiento}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500' }}>En Taller / Mantenimiento</div>
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por patente, marca, modelo, conductor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.3rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Combustible:</span>
          <select 
            className="form-control" 
            value={filterCombustible} 
            onChange={(e) => setFilterCombustible(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="TODOS">Todos</option>
            {COMBUSTIBLES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Estado:</span>
          <select 
            className="form-control" 
            value={filterEstado} 
            onChange={(e) => setFilterEstado(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="TODOS">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Tabla de Automóviles */}
      <div className="glass-card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patente / Móvil</th>
                <th>Vehículo</th>
                <th>Combustible</th>
                <th>Conductor Asignado</th>
                <th>Permiso Circulación</th>
                <th>Revisión Técnica</th>
                <th>Seguro SOAP</th>
                <th>Estado</th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAutos.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    No se encontraron automóviles con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredAutos.map((auto) => {
                  const semPermiso = getSemaforo(auto.permisoCirculacion?.vencimiento);
                  const semRevision = getSemaforo(auto.revisionTecnica?.vencimiento);
                  const semSeguro = getSemaforo(auto.seguroObligatorio?.vencimiento);

                  return (
                    <tr key={auto.id}>
                      {/* Patente y Móvil */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <span style={{
                            display: 'inline-block',
                            background: '#ffffff',
                            color: '#0f172a',
                            fontWeight: '800',
                            letterSpacing: '1px',
                            border: '2px solid #00a859',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '5px',
                            fontSize: '0.85rem',
                            width: 'fit-content',
                            boxShadow: '0 1px 4px rgba(0, 168, 89, 0.15)'
                          }}>
                            {auto.patente}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                            N° {auto.numeroInterno || 'S/N'}
                          </span>
                        </div>
                      </td>

                      {/* Marca / Modelo / Año */}
                      <td>
                        <div style={{ fontWeight: '700', color: '#0f172a' }}>{auto.marca} {auto.modelo}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          Año {auto.anio} · Color {auto.color}
                        </div>
                      </td>

                      {/* Combustible */}
                      <td>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.8rem',
                          background: 'var(--accent-light)',
                          color: '#008744',
                          fontWeight: '600',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '6px'
                        }}>
                          <Fuel size={13} color="#00a859" />
                          {auto.combustible || 'Bencina'}
                        </span>
                      </td>

                      {/* Conductor Asignado */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <User size={14} color="#00a859" />
                          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1e293b' }}>
                            {auto.conductorNombre || 'Sin Asignar'}
                          </span>
                        </div>
                      </td>

                      {/* Permiso de Circulación */}
                      <td>
                        <div style={{ fontSize: '0.8rem' }}>
                          <span className={semPermiso.badge} style={{ fontSize: '0.7rem' }}>
                            {auto.permisoCirculacion?.vencimiento || 'S/F'}
                          </span>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            {auto.permisoCirculacion?.comuna || 'Sin comuna'}
                          </div>
                        </div>
                      </td>

                      {/* Revisión Técnica */}
                      <td>
                        <div style={{ fontSize: '0.8rem' }}>
                          <span className={semRevision.badge} style={{ fontSize: '0.7rem' }}>
                            {auto.revisionTecnica?.vencimiento || 'S/F'}
                          </span>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={auto.revisionTecnica?.planta}>
                            {auto.revisionTecnica?.planta || 'Sin planta'}
                          </div>
                        </div>
                      </td>

                      {/* Seguro SOAP */}
                      <td>
                        <div style={{ fontSize: '0.8rem' }}>
                          <span className={semSeguro.badge} style={{ fontSize: '0.7rem' }}>
                            {auto.seguroObligatorio?.vencimiento || 'S/F'}
                          </span>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            {auto.seguroObligatorio?.compania || 'Sin SOAP'}
                          </div>
                        </div>
                      </td>

                      {/* Estado */}
                      <td>
                        <span className={`badge ${auto.estado === 'Activo' ? 'success' : auto.estado === 'Mantenimiento' ? 'warning' : 'danger'}`}>
                          {auto.estado}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                          <button
                            className="btn btn-outline"
                            onClick={() => setDetalleModal(auto)}
                            title="Ver ficha técnica completa"
                            style={{ padding: '0.35rem 0.5rem' }}
                          >
                            <Eye size={14} color="#00a859" />
                          </button>
                          <button
                            className="btn btn-outline"
                            onClick={() => handleOpenEditar(auto)}
                            title="Editar automóvil"
                            style={{ padding: '0.35rem 0.5rem' }}
                          >
                            <Edit2 size={14} color="#0284c7" />
                          </button>
                          <button
                            className="btn btn-outline"
                            onClick={() => handleDelete(auto.id, auto.patente)}
                            title="Eliminar automóvil"
                            style={{ padding: '0.35rem 0.5rem' }}
                          >
                            <Trash2 size={14} color="#dc2626" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CREAR / EDITAR AUTOMÓVIL */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div 
            className="modal-content glass-card" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '780px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Car color="#00a859" size={24} />
                {editingId ? `Editar Automóvil: ${formData.patente}` : 'Registrar Nuevo Automóvil en Flota'}
              </h2>
              <button className="btn btn-outline" onClick={() => setShowModal(false)} style={{ padding: '0.25rem 0.5rem' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* SECCIÓN 1: DATOS BÁSICOS DEL VEHÍCULO */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--accent-primary)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Car size={16} /> 1. Datos del Automóvil (Mínimos según Protocolo)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label className="form-label font-bold">Patente *</label>
                    <input
                      type="text"
                      name="patente"
                      required
                      placeholder="Ej: BBCL-11 o CF-RD-88"
                      className="form-control"
                      value={formData.patente}
                      onChange={handleInputChange}
                      style={{ textTransform: 'uppercase', fontWeight: '800', letterSpacing: '1px' }}
                    />
                  </div>

                  <div>
                    <label className="form-label font-bold">Marca *</label>
                    <input
                      type="text"
                      name="marca"
                      required
                      placeholder="Ej: Nissan, Toyota, Chevrolet"
                      className="form-control"
                      value={formData.marca}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="form-label font-bold">Modelo *</label>
                    <input
                      type="text"
                      name="modelo"
                      required
                      placeholder="Ej: Versa Sense 1.6 MT"
                      className="form-control"
                      value={formData.modelo}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="form-label font-bold">Año *</label>
                    <input
                      type="number"
                      name="anio"
                      required
                      min="2010"
                      max="2027"
                      className="form-control"
                      value={formData.anio}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="form-label font-bold">Combustible *</label>
                    <select
                      name="combustible"
                      className="form-control"
                      value={formData.combustible}
                      onChange={handleInputChange}
                    >
                      {COMBUSTIBLES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">N° Móvil Interno</label>
                    <input
                      type="text"
                      name="numeroInterno"
                      placeholder="Ej: M-105"
                      className="form-control"
                      value={formData.numeroInterno}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="form-label">Conductor Asignado</label>
                    <select
                      name="conductorId"
                      className="form-control"
                      value={formData.conductorId}
                      onChange={handleInputChange}
                    >
                      <option value="">-- Sin conductor asignado --</option>
                      {conductores.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre} ({c.rut})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label font-bold">Estado del Vehículo</label>
                    <select
                      name="estado"
                      className="form-control"
                      value={formData.estado}
                      onChange={handleInputChange}
                    >
                      <option value="Activo">Activo (Habilitado)</option>
                      <option value="Mantenimiento">Mantenimiento (Taller)</option>
                      <option value="Inactivo">Inactivo / De Baja</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: VIGENCIA PERMISO DE CIRCULACIÓN */}
              <div style={{ marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0369a1', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FileText size={16} /> 2. Vigencia Permiso de Circulación
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Comuna de Pago</label>
                    <input
                      type="text"
                      name="permisoComuna"
                      required
                      placeholder="Ej: Melipilla, Providencia"
                      className="form-control"
                      value={formData.permisoComuna}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="form-label">Fecha de Otorgación</label>
                    <input
                      type="date"
                      name="permisoFechaOtorgacion"
                      required
                      className="form-control"
                      value={formData.permisoFechaOtorgacion}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="form-label font-bold">Fecha de Vencimiento *</label>
                    <input
                      type="date"
                      name="permisoVencimiento"
                      required
                      className="form-control"
                      value={formData.permisoVencimiento}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN 3: VIGENCIA REVISIÓN TÉCNICA */}
              <div style={{ marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#b45309', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Wrench size={16} /> 3. Vigencia Revisión Técnica (PRT)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Planta de Revisión</label>
                    <input
                      type="text"
                      name="revisionPlanta"
                      required
                      placeholder="Ej: SGS Melipilla AB-1302"
                      className="form-control"
                      value={formData.revisionPlanta}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="form-label">Comuna Planta</label>
                    <input
                      type="text"
                      name="revisionComuna"
                      required
                      placeholder="Ej: Melipilla, Conchalí"
                      className="form-control"
                      value={formData.revisionComuna}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="form-label font-bold">Fecha de Vencimiento *</label>
                    <input
                      type="date"
                      name="revisionVencimiento"
                      required
                      className="form-control"
                      value={formData.revisionVencimiento}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN 4: VIGENCIA SEGURO OBLIGATORIO (SOAP) */}
              <div style={{ marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#6d28d9', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={16} /> 4. Vigencia Seguro Obligatorio de Accidentes Personales (SOAP)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Compañía Aseguradora</label>
                    <input
                      type="text"
                      name="seguroCompania"
                      required
                      placeholder="Ej: BCI Seguros, HDI, Mapfre"
                      className="form-control"
                      value={formData.seguroCompania}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="form-label">Prima / Monto Póliza</label>
                    <input
                      type="text"
                      name="seguroPrima"
                      required
                      placeholder="Ej: $18.500 CLP (0.48 UF)"
                      className="form-control"
                      value={formData.seguroPrima}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="form-label font-bold">Fecha de Vencimiento *</label>
                    <input
                      type="date"
                      name="seguroVencimiento"
                      required
                      className="form-control"
                      value={formData.seguroVencimiento}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* BOTONES ACCIÓN */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Check size={18} />
                  {editingId ? 'Guardar Cambios' : 'Registrar Automóvil'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FICHA TÉCNICA DETALLADA */}
      {detalleModal && (
        <div className="modal-backdrop" onClick={() => setDetalleModal(null)}>
          <div 
            className="modal-content glass-card" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '650px', width: '90%' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Car color="#00a859" size={24} />
                  Ficha Técnica Automóvil: {detalleModal.patente}
                </h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Móvil N° {detalleModal.numeroInterno} · {detalleModal.marca} {detalleModal.modelo} ({detalleModal.anio})</div>
              </div>
              <button className="btn btn-outline" onClick={() => setDetalleModal(null)} style={{ padding: '0.25rem 0.5rem' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div><span style={{ color: 'var(--text-secondary)' }}>Patente:</span> <strong style={{ color: '#0f172a' }}>{detalleModal.patente}</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Combustible:</span> <strong style={{ color: '#0f172a' }}>{detalleModal.combustible}</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Conductor:</span> <strong style={{ color: '#0f172a' }}>{detalleModal.conductorNombre}</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Estado:</span> <span className={`badge ${detalleModal.estado === 'Activo' ? 'success' : 'warning'}`}>{detalleModal.estado}</span></div>
              </div>

              {/* Permiso */}
              <div style={{ borderLeft: '4px solid #0284c7', paddingLeft: '0.85rem', background: '#f0f9ff', padding: '0.75rem', borderRadius: '6px' }}>
                <div style={{ fontWeight: '700', color: '#0369a1', fontSize: '0.9rem' }}>Permiso de Circulación</div>
                <div style={{ fontSize: '0.85rem', color: '#1e293b' }}>Comuna: <strong>{detalleModal.permisoCirculacion?.comuna}</strong></div>
                <div style={{ fontSize: '0.85rem', color: '#1e293b' }}>Otorgación: {detalleModal.permisoCirculacion?.fechaOtorgacion} · Vencimiento: <strong>{detalleModal.permisoCirculacion?.vencimiento}</strong></div>
              </div>

              {/* Revisión Técnica */}
              <div style={{ borderLeft: '4px solid #f59e0b', paddingLeft: '0.85rem', background: '#fffbeb', padding: '0.75rem', borderRadius: '6px' }}>
                <div style={{ fontWeight: '700', color: '#b45309', fontSize: '0.9rem' }}>Revisión Técnica (PRT)</div>
                <div style={{ fontSize: '0.85rem', color: '#1e293b' }}>Planta: <strong>{detalleModal.revisionTecnica?.planta}</strong> ({detalleModal.revisionTecnica?.comuna})</div>
                <div style={{ fontSize: '0.85rem', color: '#1e293b' }}>Vencimiento: <strong>{detalleModal.revisionTecnica?.vencimiento}</strong></div>
              </div>

              {/* Seguro Obligatorio */}
              <div style={{ borderLeft: '4px solid #8b5cf6', paddingLeft: '0.85rem', background: '#f5f3ff', padding: '0.75rem', borderRadius: '6px' }}>
                <div style={{ fontWeight: '700', color: '#6d28d9', fontSize: '0.9rem' }}>Seguro Obligatorio (SOAP)</div>
                <div style={{ fontSize: '0.85rem', color: '#1e293b' }}>Compañía: <strong>{detalleModal.seguroObligatorio?.compania}</strong></div>
                <div style={{ fontSize: '0.85rem', color: '#1e293b' }}>Prima: {detalleModal.seguroObligatorio?.prima} · Vencimiento: <strong>{detalleModal.seguroObligatorio?.vencimiento}</strong></div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button className="btn btn-outline" onClick={() => setDetalleModal(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionAutomoviles;
