import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Car, ShieldCheck, Wrench, FileText, ArrowRight } from 'lucide-react';

const Documentacion = ({ conductores = [], automoviles = [], onNavigateAutos }) => {
  const hoy = new Date();

  const getSemaforo = (fechaStr) => {
    if (!fechaStr) return { estado: 'SIN_FECHA', label: 'Sin fecha', badge: 'badge-secondary' };
    const fecha = new Date(fechaStr);
    const diffDias = Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24));

    if (diffDias < 0) {
      return { estado: 'VENCIDO', label: `${fechaStr} (Vencido)`, badge: 'badge danger' };
    }
    if (diffDias <= 30) {
      return { estado: 'PROXIMO', label: `${fechaStr} (Vence en ${diffDias}d)`, badge: 'badge warning' };
    }
    return { estado: 'VIGENTE', label: `${fechaStr} (Al día)`, badge: 'badge success' };
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileText color="#00a859" size={26} />
            Documentación y Control de Vigencias
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Monitoreo en tiempo real de Permisos de Circulación, Revisiones Técnicas (PRT), SOAP y Licencias Profesionales A2/A3.
          </p>
        </div>
        {onNavigateAutos && (
          <button className="btn btn-primary" onClick={onNavigateAutos} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Car size={16} />
            Administrar Automóviles
            <ArrowRight size={16} />
          </button>
        )}
      </div>

      {/* Control de Vigencias de Automóviles */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff' }}>
          <Car color="#00a859" size={20} />
          Vigencias de Automóviles y Flota (Requisitos Protocolo INACAP)
        </h2>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patente / Móvil</th>
                <th>Conductor Asignado</th>
                <th>Permiso de Circulación<br /><small style={{ color: 'var(--text-secondary)' }}>Comuna · Otorgación · Vencimiento</small></th>
                <th>Revisión Técnica (PRT)<br /><small style={{ color: 'var(--text-secondary)' }}>Planta · Comuna · Vencimiento</small></th>
                <th>Seguro SOAP<br /><small style={{ color: 'var(--text-secondary)' }}>Compañía · Prima · Vencimiento</small></th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {automoviles.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-secondary)' }}>
                    No hay automóviles registrados en la flota.
                  </td>
                </tr>
              ) : (
                automoviles.map((a) => {
                  const semPermiso = getSemaforo(a.permisoCirculacion?.vencimiento);
                  const semRevision = getSemaforo(a.revisionTecnica?.vencimiento);
                  const semSeguro = getSemaforo(a.seguroObligatorio?.vencimiento);

                  return (
                    <tr key={a.id}>
                      <td>
                        <strong style={{ letterSpacing: '1px' }}>{a.patente}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {a.marca} {a.modelo} ({a.anio})
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem', fontWeight: '500' }}>
                          {a.conductorNombre || 'Sin Asignar'}
                        </div>
                      </td>
                      <td>
                        <span className={semPermiso.badge} style={{ fontSize: '0.72rem' }}>
                          {semPermiso.label}
                        </span>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {a.permisoCirculacion?.comuna || 'Sin Comuna'} · {a.permisoCirculacion?.fechaOtorgacion || ''}
                        </div>
                      </td>
                      <td>
                        <span className={semRevision.badge} style={{ fontSize: '0.72rem' }}>
                          {semRevision.label}
                        </span>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {a.revisionTecnica?.planta || 'Sin Planta'} ({a.revisionTecnica?.comuna || ''})
                        </div>
                      </td>
                      <td>
                        <span className={semSeguro.badge} style={{ fontSize: '0.72rem' }}>
                          {semSeguro.label}
                        </span>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {a.seguroObligatorio?.compania || 'Sin Aseguradora'} · {a.seguroObligatorio?.prima || ''}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${a.estado === 'Activo' ? 'success' : 'warning'}`}>
                          {a.estado}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Control de Licencias Profesionales de Conductores */}
      <div className="glass-card">
        <h2 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff' }}>
          <ShieldCheck color="#38bdf8" size={20} />
          Vigencia de Licencias Profesionales de Conductores (A2 / A3)
        </h2>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Conductor</th>
                <th>RUT</th>
                <th>Tipo Licencia</th>
                <th>Municipio Emisor</th>
                <th>Obtención / Duración</th>
                <th>Vencimiento Licencia</th>
                <th>Estado Gremial</th>
              </tr>
            </thead>
            <tbody>
              {conductores.map((c) => {
                const vencLic = c.vencimientoLicencia || c.documentos?.licencia;
                const semLic = getSemaforo(vencLic);

                return (
                  <tr key={c.id}>
                    <td style={{ fontWeight: '500' }}>{c.nombre}</td>
                    <td style={{ fontFamily: 'monospace', color: '#34d399' }}>{c.rut}</td>
                    <td>
                      <span className="badge warning">
                        Clase {c.tipoLicencia || 'A2'}
                      </span>
                    </td>
                    <td>{c.municipioLicencia || 'I. Municipalidad de Melipilla'}</td>
                    <td>
                      <div style={{ fontSize: '0.8rem' }}>
                        {c.fechaObtencionLicencia || '2016-05-10'}
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>
                          {c.duracionLicenciaAnios || 4} años de vigencia
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={semLic.badge} style={{ fontSize: '0.75rem' }}>
                        {semLic.label}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${c.estado === 'Activo' ? 'success' : 'danger'}`}>
                        {c.estado}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Documentacion;
