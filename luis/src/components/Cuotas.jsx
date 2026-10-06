import React from 'react';
import { mockData } from '../data/mockData';
import { Receipt } from 'lucide-react';

const Cuotas = ({ conductores }) => {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Cuotas Sociales</h1>
        <button className="btn btn-primary">Generar Cobro Mensual</button>
      </div>

      <div className="glass-card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID Socio</th>
                <th>Nombre</th>
                <th>Cuotas Impagas</th>
                <th>Estado Morosidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {conductores.map((c) => (
                <tr key={c.id}>
                  <td style={{fontWeight: '500'}}>{c.id}</td>
                  <td>{c.nombre}</td>
                  <td>{c.cuotasImpagas}</td>
                  <td>
                    {c.cuotasImpagas > 2 ? (
                      <span className="badge danger">Moroso</span>
                    ) : c.cuotasImpagas > 0 ? (
                      <span className="badge warning">Pendiente</span>
                    ) : (
                      <span className="badge success">Al Día</span>
                    )}
                  </td>
                  <td>
                    <button className="btn btn-outline" style={{padding: '0.25rem 0.75rem', fontSize: '0.75rem'}}>
                      <Receipt size={14} /> Emitir Cartola
                    </button>
                    {c.cuotasImpagas > 0 && (
                      <button className="btn btn-outline" style={{padding: '0.25rem 0.75rem', fontSize: '0.75rem', marginLeft: '0.5rem', color: 'var(--warning)', borderColor: 'var(--warning)'}}>
                        Enviar Recordatorio
                      </button>
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

export default Cuotas;
