import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import GestionRutas from './components/GestionRutas';
import GestionConductores from './components/GestionConductores';
import Documentacion from './components/Documentacion';
import Cuotas from './components/Cuotas';
import Reportes from './components/Reportes';
import Incidentes from './components/Incidentes';
import { mockData } from './data/mockData';

function App() {
  const [usuario, setUsuario] = useState(() => {
    const saved = localStorage.getItem('conatacoch_admin_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState('conductores'); // Abrir directamente en Conductores
  
  const [conductores, setConductores] = useState(() => {
    const saved = localStorage.getItem('conatacoch_conductores_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Error parsing conductores:", e);
      }
    }
    return mockData.conductores;
  });

  useEffect(() => {
    localStorage.setItem('conatacoch_conductores_v3', JSON.stringify(conductores));
  }, [conductores]);

  const handleLogin = (user) => {
    localStorage.setItem('conatacoch_admin_session', JSON.stringify(user));
    setUsuario(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('conatacoch_admin_session');
    setUsuario(null);
  };

  if (!usuario) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'rutas':
        return <GestionRutas />;
      case 'conductores':
        return <GestionConductores conductores={conductores} setConductores={setConductores} onNavigateCuotas={() => setActiveTab('cuotas')} />;
      case 'documentacion':
        return <Documentacion conductores={conductores} />;
      case 'cuotas':
        return <Cuotas conductores={conductores} setConductores={setConductores} />;
      case 'reportes':
        return <Reportes />;
      case 'incidentes':
        return <Incidentes />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} usuario={usuario} />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
