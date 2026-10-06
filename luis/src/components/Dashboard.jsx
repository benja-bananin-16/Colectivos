import React, { useState } from 'react';
import { mockData } from '../data/mockData';
import { ArrowUpRight, ArrowDownRight, Users, Route, MessageSquareWarning, MapPin } from 'lucide-react';

const Dashboard = () => {
  const [region, setRegion] = useState('todas');
  const { dashboard } = mockData;

  // Modificador mock para que los números cambien según la región
  const regionMultiplier = {
    'todas': 1,
    '1': 0.15, // Tarapacá
    '5': 0.25, // Valparaíso
    '6': 0.10, // O'Higgins
    '13': 0.50, // Metropolitana
  };

  const mult = regionMultiplier[region] || 1;

  const renderTrend = (value) => {
    const isPositive = value > 0;
    return (
      <span className={`badge ${isPositive ? 'success' : 'danger'}`} style={{display: 'inline-flex', alignItems: 'center', gap: '0.25rem'}}>
        {isPositive ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
        {Math.abs(value)}% vs mes anterior
      </span>
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">Dashboard Ejecutivo</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <MapPin size={18} style={{ color: 'var(--text-secondary)' }} />
          <select 
            value={region} 
            onChange={(e) => setRegion(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              outline: 'none',
              fontSize: '0.95rem',
              cursor: 'pointer'
            }}
          >
            <option value="todas" style={{ color: '#000' }}>Todas las Regiones</option>
            <option value="13" style={{ color: '#000' }}>Región Metropolitana</option>
            <option value="5" style={{ color: '#000' }}>Región de Valparaíso</option>
            <option value="6" style={{ color: '#000' }}>Región de O'Higgins</option>
            <option value="1" style={{ color: '#000' }}>Región de Tarapacá</option>
          </select>
        </div>
      </div>

      <div className="grid-3">
        <div className="glass-card stat-card">
          <div className="stat-info">
            <h3>Viajes Atendidos</h3>
            <div className="value">{Math.round(dashboard.viajesAtendidos.actual * mult).toLocaleString('es-CL')}</div>
            <div className="subtitle" style={{marginTop: '0.5rem'}}>
              {renderTrend(dashboard.viajesAtendidos.crecimiento)}
            </div>
          </div>
          <div className="stat-icon blue"><Route /></div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-info">
            <h3>Socios Activos</h3>
            <div className="value">{Math.round(dashboard.sociosActivos.actual * mult).toLocaleString('es-CL')}</div>
            <div className="subtitle" style={{marginTop: '0.5rem'}}>
              {renderTrend(dashboard.sociosActivos.crecimiento)}
            </div>
          </div>
          <div className="stat-icon purple"><Users /></div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-info">
            <h3>Quejas Registradas</h3>
            <div className="value">{Math.round(dashboard.quejas.actual * mult).toLocaleString('es-CL')}</div>
            <div className="subtitle" style={{marginTop: '0.5rem'}}>
              <span className={`badge ${dashboard.quejas.crecimiento < 0 ? 'success' : 'danger'}`} style={{display: 'inline-flex', alignItems: 'center', gap: '0.25rem'}}>
                {dashboard.quejas.crecimiento < 0 ? <ArrowDownRight size={14}/> : <ArrowUpRight size={14}/>}
                {Math.abs(dashboard.quejas.crecimiento)}% vs mes anterior
              </span>
            </div>
          </div>
          <div className="stat-icon orange"><MessageSquareWarning /></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
