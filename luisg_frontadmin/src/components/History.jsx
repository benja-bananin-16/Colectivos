import React from 'react';
import { mockData } from '../data/mockData';
import { Download, Search } from 'lucide-react';

const History = () => {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Historial de Operaciones</h1>
        <button className="btn btn-primary">
          <Download size={18} />
          Exportar Cierre de Caja
        </button>
      </div>

      <div className="glass-card">
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center'}}>
          <div className="input-group" style={{margin: 0, width: '300px', position: 'relative'}}>
            <Search style={{position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)'}} size={18} />
            <input type="text" placeholder="Buscar ticket o fecha..." style={{paddingLeft: '2.5rem'}} />
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Hora Ingreso</th>
                <th>Hora Salida</th>
                <th>Tiempo Total</th>
                <th>Monto ($)</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {mockData.recentTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td style={{fontWeight: '500', color: 'var(--text-primary)'}}>{tx.id}</td>
                  <td>{tx.timeIn}</td>
                  <td>{tx.timeOut}</td>
                  <td>{tx.duration}</td>
                  <td>{tx.amount !== '---' ? `$${tx.amount}` : '---'}</td>
                  <td>
                    <span className={`badge ${tx.status === 'Completed' ? 'success' : 'warning'}`}>
                      {tx.status === 'Completed' ? 'Pagado' : 'Activo'}
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

export default History;
