import React from 'react';
import { mockData } from '../data/mockData';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const Incidents = () => {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Gestión de Incidencias</h1>
      </div>

      <div className="glass-card">
        <p style={{color: 'var(--text-secondary)', marginBottom: '1.5rem'}}>
          Registro y resolución de tickets perdidos y discrepancias de pago.
        </p>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Hora</th>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Cobro Autorizado</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {mockData.incidents.map((incident) => (
                <tr key={incident.id}>
                  <td style={{fontWeight: '500'}}>{incident.id}</td>
                  <td>{incident.time}</td>
                  <td>
                    <span className={`badge ${incident.type === 'Lost Ticket' ? 'danger' : 'warning'}`}>
                      {incident.type === 'Lost Ticket' ? 'Ticket Perdido' : 'Discrepancia'}
                    </span>
                  </td>
                  <td style={{maxWidth: '300px'}}>{incident.description}</td>
                  <td>${incident.amountCharged}</td>
                  <td>
                    <span className={`badge ${incident.status === 'Resolved' ? 'success' : 'warning'}`}>
                      {incident.status === 'Resolved' ? 'Resuelto' : 'Pendiente'}
                    </span>
                  </td>
                  <td>
                    {incident.status === 'Pending' ? (
                      <button className="btn btn-outline" style={{padding: '0.25rem 0.75rem', fontSize: '0.75rem'}}>
                        Resolver
                      </button>
                    ) : (
                      <CheckCircle className="text-success" size={20} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Incidents;
