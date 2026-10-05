import React from 'react';
import { mockData } from '../data/mockData';
import { Save } from 'lucide-react';

const Tariffs = () => {
  const { tariffs } = mockData;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Configuración de Tarifas</h1>
        <button className="btn btn-primary">
          <Save size={18} />
          Guardar Cambios
        </button>
      </div>

      <div className="grid-2">
        <div className="glass-card">
          <h3 style={{marginBottom: '1.5rem', color: 'var(--text-secondary)'}}>Tarifas Regulares</h3>
          
          <div className="input-group">
            <label>Tarifa Base (Primera media hora)</label>
            <div style={{position: 'relative'}}>
              <span style={{position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)'}}>$</span>
              <input type="number" defaultValue={tariffs.baseRate.amount} style={{paddingLeft: '2rem'}} />
            </div>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem'}}>{tariffs.baseRate.description}</p>
          </div>

          <div className="input-group">
            <label>Hora Adicional (o fracción)</label>
            <div style={{position: 'relative'}}>
              <span style={{position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)'}}>$</span>
              <input type="number" defaultValue={tariffs.additionalHour.amount} style={{paddingLeft: '2rem'}} />
            </div>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem'}}>{tariffs.additionalHour.description}</p>
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{marginBottom: '1.5rem', color: 'var(--text-secondary)'}}>Tarifas Especiales</h3>
          
          <div className="input-group">
            <label>Ticket Perdido (Tarifa Fija Diario)</label>
            <div style={{position: 'relative'}}>
              <span style={{position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)'}}>$</span>
              <input type="number" defaultValue={tariffs.lostTicket.amount} style={{paddingLeft: '2rem'}} />
            </div>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem'}}>{tariffs.lostTicket.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tariffs;
