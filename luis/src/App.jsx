import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import GestionRutas from './components/GestionRutas';
import GestionConductores from './components/GestionConductores';
import GestionAutomoviles from './components/GestionAutomoviles';
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
  const [activeTab, setActiveTab] = useState('conductores'); // Abrir en Conductores
  
  // Estado de Conductores con persistencia
  const [conductores, setConductores] = useState(() => {
    const saved = localStorage.getItem('conatacoch_conductores_v4');
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

  // Estado de Automóviles con persistencia
  const [automoviles, setAutomoviles] = useState(() => {
    const saved = localStorage.getItem('conatacoch_automoviles_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Error parsing automoviles:", e);
      }
    }
    return mockData.automoviles;
  });

  useEffect(() => {
    localStorage.setItem('conatacoch_conductores_v4', JSON.stringify(conductores));
  }, [conductores]);

  useEffect(() => {
    localStorage.setItem('conatacoch_automoviles_v1', JSON.stringify(automoviles));
  }, [automoviles]);

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
        return (
          <GestionConductores 
            conductores={conductores} 
            setConductores={setConductores} 
            automoviles={automoviles}
            onNavigateCuotas={() => setActiveTab('cuotas')} 
          />
        );
      case 'automoviles':
        return (
          <GestionAutomoviles 
            automoviles={automoviles} 
            setAutomoviles={setAutomoviles} 
            conductores={conductores}
          />
        );
      case 'documentacion':
        return (
          <Documentacion 
            conductores={conductores} 
            automoviles={automoviles}
            onNavigateAutos={() => setActiveTab('automoviles')}
          />
        );
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
