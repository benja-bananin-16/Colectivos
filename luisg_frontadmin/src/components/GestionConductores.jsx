import React, { useState } from 'react';
import { UserPlus, Edit2, Trash2, X, Check } from 'lucide-react';

const GestionConductores = ({ conductores, setConductores }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '', rut: '', telefono: '', email: '', patente: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = `C-00${conductores.length + 1}`;
    const newConductor = {
      id: newId,
      ...formData,
      estado: 'Activo',
      cuotasImpagas: 0,
      documentos: {
        revisionTecnica: '2027-12-31',
        permisoCirculacion: '2027-03-31',
        seguro: '2027-03-31'
      }
    };
    setConductores([...conductores, newConductor]);
    setShowModal(false);
    setFormData({ nombre: '', rut: '', telefono: '', email: '', patente: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este conductor?')) {
      setConductores(conductores.filter(c => c.id !== id));
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Gestión de Conductores</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <UserPlus size={18} />
          Agregar Conductor
        </button>
      </div>

      <div className="glass-card">
        <p style={{color: 'var(--text-secondary)', marginBottom: '1.5rem'}}>
          Administra los perfiles de los socios conductores. Los conductores agregados aquí tendrán acceso a la aplicación móvil.
        </p>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>RUT</th>
                <th>Teléfono</th>
                <th>Patente</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {conductores.map((c) => (
                <tr key={c.id}>
                  <td style={{fontWeight: '500'}}>{c.nombre}</td>
                  <td>{c.rut || '---'}</td>
                  <td>{c.telefono || '---'}</td>
                  <td>{c.patente}</td>
                  <td>
                    <span className={`badge ${c.estado === 'Activo' ? 'success' : 'danger'}`}>
                      {c.estado}
                    </span>
                  </td>
                  <td>
                    <div style={{display: 'flex', gap: '0.5rem'}}>
                      <button className="btn btn-outline" style={{padding: '0.35rem', color: 'var(--accent-primary)', borderColor: 'rgba(59, 130, 246, 0.3)'}} title="Editar">
                        <Edit2 size={14} />
                      </button>
                      <button className="btn btn-outline" onClick={() => handleDelete(c.id)} style={{padding: '0.35rem', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)'}} title="Eliminar">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-card animate-fade-in" style={{width: '100%', maxWidth: '500px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h2 style={{fontSize: '1.25rem', fontWeight: '600'}}>Registrar Nuevo Conductor</h2>
              <button onClick={() => setShowModal(false)} style={{background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer'}}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Nombre Completo</label>
                <input required type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Ej. Juan Pérez" />
              </div>
              <div className="grid-2" style={{marginBottom: 0, gap: '1rem'}}>
                <div className="input-group">
                  <label>RUT</label>
                  <input required type="text" name="rut" value={formData.rut} onChange={handleInputChange} placeholder="12.345.678-9" />
                </div>
                <div className="input-group">
                  <label>Teléfono</label>
                  <input required type="text" name="telefono" value={formData.telefono} onChange={handleInputChange} placeholder="+569..." />
                </div>
              </div>
              <div className="grid-2" style={{marginBottom: 0, gap: '1rem'}}>
                <div className="input-group">
                  <label>Email</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="correo@ejemplo.cl" />
                </div>
                <div className="input-group">
                  <label>Patente Vehículo</label>
                  <input required type="text" name="patente" value={formData.patente} onChange={handleInputChange} placeholder="AB-CD-12" />
                </div>
              </div>
              
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem'}}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary"><Check size={18} /> Guardar Conductor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionConductores;
