import React, { useState } from 'react';
import { Car, ShieldCheck, Lock, User, AlertCircle, ArrowRight, Zap, Eye, EyeOff } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Credenciales por defecto solicitadas:
  // RUT inventado: '9.999.999-9' (o cualquier RUT ingresado)
  // Contraseña: 'Conatacoch2026'
  const DEFAULT_RUT = '9.999.999-9';
  const DEFAULT_PASS = 'Conatacoch2026';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const rutLimpio = rut.trim();
    const passLimpio = password.trim();

    if (!rutLimpio) {
      setError('Por favor ingresa tu RUT.');
      return;
    }

    if (!passLimpio) {
      setError('Por favor ingresa tu contraseña.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Verificación con las credenciales solicitadas
      if (passLimpio === DEFAULT_PASS) {
        const usuarioAdmin = {
          rut: rutLimpio,
          nombre: 'Administrador Central',
          rol: 'SUPER_ADMIN',
          email: 'admin@conatacoch.cl',
          fechaLogin: new Date().toISOString()
        };
        onLogin(usuarioAdmin);
      } else {
        setError(`Contraseña incorrecta. Recuerda que para pruebas es: ${DEFAULT_PASS}`);
        setLoading(false);
      }
    }, 400);
  };

  // Botón de Inicio de Pruebas (Acceso Rápido Demo)
  const handleLoginPruebas = () => {
    setLoading(true);
    setRut(DEFAULT_RUT);
    setPassword(DEFAULT_PASS);

    setTimeout(() => {
      const usuarioDemo = {
        rut: DEFAULT_RUT,
        nombre: 'Admin Pruebas CONATACOCH',
        rol: 'SUPER_ADMIN',
        email: 'admin.pruebas@conatacoch.cl',
        fechaLogin: new Date().toISOString()
      };
      onLogin(usuarioDemo);
    }, 300);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      background: 'radial-gradient(ellipse at top, #11261b 0%, #08110c 100%)'
    }}>
      <div className="glass-card animate-fade-in" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '2.5rem 2rem',
        borderRadius: '16px',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(0, 168, 89, 0.25)'
      }}>
        {/* Header con Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #00a859 0%, #007a3d 100%)',
            boxShadow: '0 8px 24px rgba(0, 168, 89, 0.4)',
            marginBottom: '1rem'
          }}>
            <Car size={32} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            CONATACOCH
          </h1>
          <p style={{ color: '#34d399', fontSize: '0.9rem', fontWeight: '500' }}>
            Portal Super Administrador
          </p>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#f87171',
            fontSize: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Formulario de Login Normal */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
              RUT de Administrador
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                placeholder="Ej: 9.999.999-9"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  background: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border 0.2s ease'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
              Contraseña
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', color: 'var(--text-secondary)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 2.75rem 0.75rem 2.5rem',
                  background: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border 0.2s ease'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Botón 1: Formulario Normal */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              padding: '0.85rem',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Validando...' : (
              <>
                Iniciar Sesión
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Separador */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '1.75rem 0 1.25rem',
          color: 'var(--text-secondary)',
          fontSize: '0.8rem'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          <span style={{ padding: '0 0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>O</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
        </div>

        {/* Botón 2: Inicio de Pruebas (Demo con un solo clic) */}
        <button
          type="button"
          onClick={handleLoginPruebas}
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.85rem',
            background: 'rgba(0, 168, 89, 0.15)',
            border: '1px solid rgba(0, 168, 89, 0.45)',
            borderRadius: '8px',
            color: '#34d399',
            fontWeight: '600',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 168, 89, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 168, 89, 0.15)';
          }}
        >
          <Zap size={18} />
          Acceso Rápido de Pruebas
        </button>

        {/* Nota informativa con las credenciales configuradas */}
        <div style={{
          marginTop: '1.5rem',
          padding: '0.75rem',
          borderRadius: '8px',
          background: 'rgba(0, 168, 89, 0.08)',
          border: '1px dashed rgba(0, 168, 89, 0.3)',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)'
        }}>
          <span>Credenciales de prueba: </span>
          <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>RUT: 9.999.999-9</span>
          <span> · </span>
          <span>Clave: </span>
          <span style={{ color: '#34d399', fontWeight: '600' }}>Conatacoch2026</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
