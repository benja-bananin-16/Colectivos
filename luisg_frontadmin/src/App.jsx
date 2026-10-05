import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import GestionConductores from './components/GestionConductores';
import Documentacion from './components/Documentacion';
import Cuotas from './components/Cuotas';
import Reportes from './components/Reportes';
import Incidentes from './components/Incidentes';
import { mockData } from './data/mockData';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [conductores, setConductores] = useState(mockData.conductores);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'conductores':
        return <GestionConductores conductores={conductores} setConductores={setConductores} />;
      case 'documentacion':
        return <Documentacion conductores={conductores} />;
      case 'cuotas':
        return <Cuotas conductores={conductores} />;
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
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
