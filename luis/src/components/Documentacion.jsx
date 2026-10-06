import React from 'react';
import { mockData } from '../data/mockData';
import { AlertCircle, CheckCircle } from 'lucide-react';

const Documentacion = ({ conductores }) => {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Documentación de Móviles</h1>
      </div>

      <div className="glass-card">
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Control de vencimientos de revisión técnica, permiso de circulación y seguro. Los móviles con documentos vencidos se suspenden automáticamente.
        </p>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Conductor</th>
                <th>Patente</th>
                <th>Revisión Técnica</th>
                <th>Permiso Circulación</th>
                <th>Seguro</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {conductores.map((c) => {
                const isVencido = (date) => new Date(date) < new Date('2026-10-05');
                const isProximo = (date) => {
                  const d = new Date(date);
                  const today = new Date('2026-10-05');
                  const diffTime = Math.abs(d - today);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays <= 15 && !isVencido(date);
                };

                const renderDate = (date) => {
                  if (isVencido(date)) return <span className="text-danger font-bold">{date} (Vencido)</span>;
                  if (isProximo(date)) return <span className="text-warning font-bold">{date} (Próximo)</span>;
                  return date;
                };

                return (
                  <tr key={c.id}>
                    <td style={{ fontWeight: '500' }}>{c.nombre}</td>
                    <td>{c.patente}</td>
                    <td>{renderDate(c.documentos.revisionTecnica)}</td>
                    <td>{renderDate(c.documentos.permisoCirculacion)}</td>
                    <td>{renderDate(c.documentos.seguro)}</td>
                    <td>
                      <span className={`badge ${c.estado === 'Activo' ? 'success' : 'danger'}`}>
                        {c.estado}
                      </span>
                    </td>
                    <td>
                      {c.estado === 'Suspendido' ? (
                        <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                          Revertir Suspensión
                        </button>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Al día</span>
                      )}
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
