import React from 'react';
import { mockData } from '../data/mockData';
import { Download } from 'lucide-react';

const Reportes = () => {
  const { indicadores } = mockData;
  const noAtendidasPerc = ((indicadores.solicitudes.noAtendidas / indicadores.solicitudes.totales) * 100).toFixed(1);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Indicadores y Reportes</h1>
        <button className="btn btn-primary">
          <Download size={18} />
          Exportar a Excel
        </button>
      </div>

      <div className="grid-2">
        <div className="glass-card stat-card">
          <div className="stat-info">
            <h3>Solicitudes Atendidas vs Totales</h3>
            <div className="value">{indicadores.solicitudes.atendidas} / {indicadores.solicitudes.totales}</div>
            <div className="subtitle">
              <span className="text-danger">{noAtendidasPerc}% de solicitudes no atendidas</span> por falta de móviles.
            </div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-info">
            <h3>Tiempo de Espera Promedio</h3>
            <div className="value">{indicadores.esperaPromedio}</div>
            <div className="subtitle">Basado en los últimos 30 días</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
