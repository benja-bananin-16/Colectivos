import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  DollarSign, 
  BarChart2, 
  ShieldAlert,
  LogOut,
  Car,
  Route,
  Users
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onLogout, usuario }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Ejecutivo', icon: LayoutDashboard },
    { id: 'rutas', label: 'Rutas y Paraderos', icon: Route },
    { id: 'conductores', label: 'Gestión de Conductores', icon: Users },
    { id: 'automoviles', label: 'Gestión de Automóviles', icon: Car },
    { id: 'documentacion', label: 'Documentación y Vigencias', icon: FileText },
    { id: 'cuotas', label: 'Cuotas Sociales', icon: DollarSign },
    { id: 'reportes', label: 'Indicadores y Reportes', icon: BarChart2 },
    { id: 'incidentes', label: 'Incidentes Seguridad', icon: ShieldAlert },
  ];

  return (
    <aside className="sidebar">
      <div className="brand" style={{ paddingBottom: '1rem' }}>
        <Car color="#00a859" size={26} />
        <span>CONATACOCH Admin</span>
      </div>
      {usuario && (
        <div style={{ padding: '0 1rem 1.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>
            {usuario.nombre}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>●</span> {usuario.rol}
          </div>
        </div>
      )}
      
      <div className="nav-menu" style={{ flex: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>

      <div className="nav-menu mt-auto">
        <div 
          className="nav-item text-danger" 
          onClick={onLogout}
          style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
          title="Cerrar sesión actual"
        >
          <LogOut />
          <span>Cerrar Sesión</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
