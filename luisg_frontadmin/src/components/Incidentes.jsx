import React from 'react';
import { mockData } from '../data/mockData';

const IncidentesSeguridad = () => {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Incidentes de Seguridad</h1>
      </div>

      <div className="glass-card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha y Hora</th>
                <th>Tipo</th>
                <th>Origen</th>
                <th>Sector</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {mockData.incidentes.map((inc) => (
                <tr key={inc.id}>
                  <td style={{fontWeight: '500'}}>{inc.id}</td>
                  <td>{inc.fecha}</td>
                  <td>
                    <span className={`badge ${inc.tipo === 'Botón de Pánico' ? 'danger' : 'warning'}`}>
                      {inc.tipo}
                    </span>
                  </td>
                  <td>{inc.origen}</td>
                  <td>{inc.sector}</td>
                  <td>
                    <span className={`badge ${inc.estado === 'Resuelto' ? 'success' : 'warning'}`}>
                      {inc.estado}
                    </span>
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

export default IncidentesSeguridad;
