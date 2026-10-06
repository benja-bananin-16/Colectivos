import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  DollarSign, 
  BarChart2, 
  ShieldAlert,
  LogOut,
  Car
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Ejecutivo', icon: LayoutDashboard },
    { id: 'conductores', label: 'Gestión de Conductores', icon: Car },
    { id: 'documentacion', label: 'Documentación Móviles', icon: FileText },
    { id: 'cuotas', label: 'Cuotas Sociales', icon: DollarSign },
    { id: 'reportes', label: 'Indicadores y Reportes', icon: BarChart2 },
    { id: 'incidentes', label: 'Incidentes Seguridad', icon: ShieldAlert },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <Car className="text-accent-primary" />
        <span>CONATACOCH Admin</span>
      </div>
      
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
        <div className="nav-item text-danger">
          <LogOut />
          <span>Cerrar Sesión</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
