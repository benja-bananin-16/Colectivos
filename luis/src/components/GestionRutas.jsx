import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Edit3, 
  Check, 
  X, 
  Route as RouteIcon, 
  Navigation, 
  FileCode,
  DollarSign,
  Bus
} from 'lucide-react';

// Datos iniciales precargados desde rutas_rm_3.json
const RUTAS_INICIALES = [
  {
    id: '13_20061_itinerario-1_principal',
    codigo_recorrido: '13_20061_itinerario-1_principal',
    folio: 20061,
    nro_linea: '105',
    nombre_fantasia: 'AGRETACOMBO',
    responsable: 'ASOCIACION DE TAXIS COLECTIVOS MELIPILLA',
    tipo_servicio: 'AUTOMOVIL RURAL TAXI COLECTIVO',
    nombre_recorrido: 'ITINERARIO 1',
    tipo_trazado: 'PRINCIPAL',
    tarifa: 1000,
    flota_vigente: 53,
    activa: true,
    origen: {
      nombre: 'MELIPILLA',
      comuna: 'Melipilla',
      domicilio: 'AV. MANSO'
    },
    destino: {
      nombre: 'MELIPILLA',
      comuna: 'Melipilla',
      domicilio: 'CIRCUNVALACION: RUTA G-778 ALTURA SANTA TERESA'
    },
    trazado: {
      IDA: [
        { orden: 1, calle: 'AV. MANSO', comuna: 'Melipilla' },
        { orden: 2, calle: 'SILVA CHAVEZ', comuna: 'Melipilla' },
        { orden: 3, calle: 'AV. VICUÑA MACKENNA', comuna: 'Melipilla' },
        { orden: 4, calle: 'AV. JOSE MASSOUD', comuna: 'Melipilla' },
        { orden: 5, calle: 'RUTA G-74 F', comuna: 'Melipilla' },
        { orden: 6, calle: 'AV. ANSELMO ALARCON', comuna: 'Melipilla' },
        { orden: 7, calle: 'RUTA G-380', comuna: 'Melipilla' },
        { orden: 8, calle: 'RUTA G-788 (PUERTAS BLANCAS)', comuna: 'Melipilla' },
        { orden: 9, calle: 'RUTA G-790 (VIÑA EL CAMPESINO)', comuna: 'Melipilla' },
        { orden: 10, calle: 'RUTA G-792 (EL OLIVO)', comuna: 'Melipilla' },
        { orden: 11, calle: 'RUTA G-794 (HERMANOS CARRERA)', comuna: 'Melipilla' },
        { orden: 12, calle: 'CIRCUNVALACION SANTA TERESA', comuna: 'Melipilla' }
      ],
      REGRESO: [
        { orden: 1, calle: 'CIRCUNVALACION SANTA TERESA', comuna: 'Melipilla' },
        { orden: 2, calle: 'RUTA G-794', comuna: 'Melipilla' },
        { orden: 3, calle: 'RUTA G-380', comuna: 'Melipilla' },
        { orden: 4, calle: 'AV. JOSE MASSOUD', comuna: 'Melipilla' },
        { orden: 5, calle: 'AV. MANSO', comuna: 'Melipilla' }
      ]
    }
  },
  {
    id: '13_230001_t_principal',
    codigo_recorrido: '13_230001_t_principal',
    folio: 230001,
    nro_linea: '1',
    nombre_fantasia: 'TRATCEN S.A.',
    responsable: 'TRANSPORTE Y TURISMO TRATCEN S.A.',
    tipo_servicio: 'AUTOMOVIL URBANO TAXI COLECTIVO',
    nombre_recorrido: 'T',
    tipo_trazado: 'PRINCIPAL',
    tarifa: 1200,
    flota_vigente: 38,
    activa: true,
    origen: {
      nombre: 'SANTIAGO',
      comuna: 'Santiago',
      domicilio: 'AV. CARDENAL JOSE MARIA CARO'
    },
    destino: {
      nombre: 'VITACURA',
      comuna: 'Vitacura',
      domicilio: 'TABANCURA'
    },
    trazado: {
      IDA: [
        { orden: 1, calle: 'AV. CARDENAL JOSE MARIA CARO', comuna: 'Santiago' },
        { orden: 2, calle: 'PUENTE LA PAZ', comuna: 'Santiago' },
        { orden: 3, calle: 'AV. SANTA MARIA', comuna: 'Santiago' },
        { orden: 4, calle: 'AV. PROVIDENCIA', comuna: 'Providencia' },
        { orden: 5, calle: 'AV. VITACURA', comuna: 'Vitacura' },
        { orden: 6, calle: 'TABANCURA / AV. KENNEDY', comuna: 'Vitacura' }
      ],
      REGRESO: [
        { orden: 1, calle: 'TABANCURA / AV. KENNEDY', comuna: 'Vitacura' },
        { orden: 2, calle: 'AV. VITACURA', comuna: 'Vitacura' },
        { orden: 3, calle: 'AV. ANDRES BELLO', comuna: 'Providencia' },
        { orden: 4, calle: 'AV. CARDENAL JOSE MARIA CARO', comuna: 'Santiago' }
      ]
    }
  },
  {
    id: '13_500007_itinerario-1_principal',
    codigo_recorrido: '13_500007_itinerario-1_principal',
    folio: 500007,
    nro_linea: 'MP',
    nombre_fantasia: 'RURAL MARIA PINTO',
    responsable: 'ASOCIACION GREMIAL TAXIS COLECTIVOS MARIA PINTO',
    tipo_servicio: 'AUTOMOVIL RURAL TAXI COLECTIVO',
    nombre_recorrido: 'ITINERARIO 1',
    tipo_trazado: 'PRINCIPAL',
    tarifa: 1500,
    flota_vigente: 25,
    activa: true,
    origen: {
      nombre: 'MARIA PINTO',
      comuna: 'María Pinto',
      domicilio: 'PLAZA DE ARMAS'
    },
    destino: {
      nombre: 'SAN BORJA',
      comuna: 'Estación Central',
      domicilio: 'TERMINAL SAN BORJA'
    },
    trazado: {
      IDA: [
        { orden: 1, calle: 'PLAZA DE ARMAS MARIA PINTO', comuna: 'María Pinto' },
        { orden: 2, calle: 'RUTA G-74 F (CRUCE IBACACHE)', comuna: 'María Pinto' },
        { orden: 3, calle: 'AUTOPISTA DEL SOL / PAJARITOS', comuna: 'Maipú' },
        { orden: 4, calle: 'TERMINAL SAN BORJA', comuna: 'Estación Central' }
      ],
      REGRESO: [
        { orden: 1, calle: 'TERMINAL SAN BORJA', comuna: 'Estación Central' },
        { orden: 2, calle: 'AUTOPISTA DEL SOL', comuna: 'Maipú' },
        { orden: 3, calle: 'RUTA G-74 F', comuna: 'María Pinto' },
        { orden: 4, calle: 'PLAZA DE ARMAS', comuna: 'María Pinto' }
      ]
    }
  }
];

const GestionRutas = () => {
  const [rutas, setRutas] = useState(() => {
    const saved = localStorage.getItem('colectivos_admin_rutas');
    return saved ? JSON.parse(saved) : RUTAS_INICIALES;
  });

  const [rutaSeleccionadaId, setRutaSeleccionadaId] = useState(RUTAS_INICIALES[0].id);
  const [sentidoActivo, setSentidoActivo] = useState('IDA'); // 'IDA' | 'REGRESO'
  const [showModalNuevaRuta, setShowModalNuevaRuta] = useState(false);
  const [showJsonInspector, setShowJsonInspector] = useState(false);

  // Formulario de nueva parada
  const [nuevaParadaCalle, setNuevaParadaCalle] = useState('');
  const [nuevaParadaComuna, setNuevaParadaComuna] = useState('');

  // Formulario de nueva ruta
  const [formRuta, setFormRuta] = useState({
    nro_linea: '',
    nombre_fantasia: '',
    origen_nombre: '',
    origen_comuna: '',
    origen_domicilio: '',
    destino_nombre: '',
    destino_comuna: '',
    destino_domicilio: '',
    tarifa: 1000,
    flota_vigente: 20
  });

  // Persistir en localStorage
  useEffect(() => {
    localStorage.setItem('colectivos_admin_rutas', JSON.stringify(rutas));
  }, [rutas]);

  // Intentar cargar rutas desde el backend si está activo
  useEffect(() => {
    fetch('http://localhost:8010/api/lineas/')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.length > 0) {
          const normalizadas = data.map(d => ({
            ...d,
            trazado: d.trazado && (d.trazado.IDA || d.trazado.REGRESO) ? d.trazado : { IDA: [], REGRESO: [] }
          }));
          setRutas(normalizadas);
        }
      })
      .catch(() => {
        // En caso de fallo o modo offline, se mantienen los datos precargados
      });
  }, []);

  const rutaActual = rutas.find(r => r.id === rutaSeleccionadaId) || rutas[0];
  const paradasActuales = (rutaActual?.trazado?.[sentidoActivo]) || [];

  // Agregar paradero al recorrido actual
  const handleAgregarParadero = (e) => {
    e.preventDefault();
    if (!nuevaParadaCalle.trim()) return;

    const nuevoOrden = paradasActuales.length + 1;
    const nuevoParadero = {
      orden: nuevoOrden,
      calle: nuevaParadaCalle.trim().toUpperCase(),
      comuna: nuevaParadaComuna.trim() || rutaActual.origen.comuna || 'Región Metropolitana'
    };

    const nuevoTrazado = {
      ...rutaActual.trazado,
      [sentidoActivo]: [...paradasActuales, nuevoParadero]
    };

    const rutasActualizadas = rutas.map(r => 
      r.id === rutaActual.id ? { ...r, trazado: nuevoTrazado } : r
    );

    setRutas(rutasActualizadas);
    setNuevaParadaCalle('');
    setNuevaParadaComuna('');
  };

  // Eliminar paradero y renumerar
  const handleEliminarParadero = (orden) => {
    const filtradas = paradasActuales.filter(p => p.orden !== orden);
    const renumeradas = filtradas.map((p, idx) => ({ ...p, orden: idx + 1 }));

    const nuevoTrazado = {
      ...rutaActual.trazado,
      [sentidoActivo]: renumeradas
    };

    const rutasActualizadas = rutas.map(r => 
      r.id === rutaActual.id ? { ...r, trazado: nuevoTrazado } : r
    );

    setRutas(rutasActualizadas);
  };

  // Mover paradero arriba o abajo
  const handleMoverParadero = (index, direccion) => {
    const nuevoIndex = index + direccion;
    if (nuevoIndex < 0 || nuevoIndex >= paradasActuales.length) return;

    const copia = [...paradasActuales];
    const [movido] = copia.splice(index, 1);
    copia.splice(nuevoIndex, 0, movido);

    const renumeradas = copia.map((p, idx) => ({ ...p, orden: idx + 1 }));

    const nuevoTrazado = {
      ...rutaActual.trazado,
      [sentidoActivo]: renumeradas
    };

    const rutasActualizadas = rutas.map(r => 
      r.id === rutaActual.id ? { ...r, trazado: nuevoTrazado } : r
    );

    setRutas(rutasActualizadas);
  };

  // Crear nueva ruta completa
  const handleCrearRuta = (e) => {
    e.preventDefault();
    const nuevaId = `13_${formRuta.nro_linea || 'custom'}_${Date.now()}`;
    const nuevaRuta = {
      id: nuevaId,
      codigo_recorrido: nuevaId,
      folio: Math.floor(10000 + Math.random() * 90000),
      nro_linea: formRuta.nro_linea,
      nombre_fantasia: formRuta.nombre_fantasia || `LÍNEA ${formRuta.nro_linea}`,
      responsable: 'ASOCIACION GREMIAL DE COLECTIVOS',
      tipo_servicio: 'AUTOMOVIL URBANO TAXI COLECTIVO',
      nombre_recorrido: 'ITINERARIO 1',
      tipo_trazado: 'PRINCIPAL',
      tarifa: parseInt(formRuta.tarifa, 10) || 1000,
      flota_vigente: parseInt(formRuta.flota_vigente, 10) || 15,
      activa: true,
      origen: {
        nombre: formRuta.origen_nombre.toUpperCase(),
        comuna: formRuta.origen_comuna,
        domicilio: formRuta.origen_domicilio.toUpperCase()
      },
      destino: {
        nombre: formRuta.destino_nombre.toUpperCase(),
        comuna: formRuta.destino_comuna,
        domicilio: formRuta.destino_domicilio.toUpperCase()
      },
      trazado: {
        IDA: [
          { orden: 1, calle: formRuta.origen_domicilio.toUpperCase() || 'INICIO', comuna: formRuta.origen_comuna },
          { orden: 2, calle: formRuta.destino_domicilio.toUpperCase() || 'FIN', comuna: formRuta.destino_comuna }
        ],
        REGRESO: [
          { orden: 1, calle: formRuta.destino_domicilio.toUpperCase() || 'INICIO', comuna: formRuta.destino_comuna },
          { orden: 2, calle: formRuta.origen_domicilio.toUpperCase() || 'FIN', comuna: formRuta.origen_comuna }
        ]
      }
    };

    const nuevasRutas = [...rutas, nuevaRuta];
    setRutas(nuevasRutas);
    setRutaSeleccionadaId(nuevaId);
    setShowModalNuevaRuta(false);
    setFormRuta({
      nro_linea: '',
      nombre_fantasia: '',
      origen_nombre: '',
      origen_comuna: '',
      origen_domicilio: '',
      destino_nombre: '',
      destino_comuna: '',
      destino_domicilio: '',
      tarifa: 1000,
      flota_vigente: 20
    });
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <RouteIcon className="text-accent-primary" size={28} />
            Gestión de Rutas y Paraderos (Super Admin)
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Control maestro de recorridos oficiales de la Región Metropolitana (rutas_rm_3.json). Configura paraderos para conductores y pasajeros.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className="btn" 
            style={{ background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            onClick={() => setShowJsonInspector(true)}
          >
            <FileCode size={18} />
            Ver Formato JSON
          </button>
          <button className="btn btn-primary" onClick={() => setShowModalNuevaRuta(true)}>
            <Plus size={18} />
            Nueva Ruta
          </button>
        </div>
      </div>

      {/* Selector de Rutas en Tarjetas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {rutas.map(r => {
          const isSelected = r.id === rutaActual?.id;
          const paradasIda = r.trazado?.IDA?.length || 0;
          const paradasRegreso = r.trazado?.REGRESO?.length || 0;

          return (
            <div 
              key={r.id}
              className="glass-card"
              style={{
                cursor: 'pointer',
                borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-color)',
                boxShadow: isSelected ? '0 0 15px rgba(0, 168, 89, 0.35)' : 'none',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onClick={() => setRutaSeleccionadaId(r.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span className="badge" style={{ background: '#00a859', color: '#ffffff', fontWeight: 'bold' }}>
                  LÍNEA {r.nro_linea || 'S/N'}
                </span>
                <span className="badge success" style={{ fontSize: '0.75rem' }}>
                  {r.activa ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                {r.nombre_fantasia || `Recorrido ${r.nro_linea}`}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                {r.origen?.comuna || r.origen?.nombre} ➔ {r.destino?.comuna || r.destino?.nombre}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                <span>💰 Tarifa: <strong>${r.tarifa}</strong></span>
                <span>🚏 Paradas: <strong>{paradasIda + paradasRegreso}</strong></span>
                <span>🚕 Flota: <strong>{r.flota_vigente}</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detalle y Gestor de Paraderos de la Ruta Seleccionada */}
      {rutaActual && (
        <div className="glass-card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                Recorrido: {rutaActual.nombre_fantasia || `Línea ${rutaActual.nro_linea}`}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <strong>Origen:</strong> {rutaActual.origen?.domicilio} ({rutaActual.origen?.comuna}) | <strong>Destino:</strong> {rutaActual.destino?.domicilio} ({rutaActual.destino?.comuna})
              </p>
            </div>

            {/* Selector de Sentido IDA / REGRESO */}
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '4px' }}>
              <button
                className="btn"
                style={{
                  background: sentidoActivo === 'IDA' ? 'var(--accent-primary)' : 'transparent',
                  color: 'white',
                  padding: '6px 14px',
                  fontSize: '0.85rem',
                  borderRadius: '6px'
                }}
                onClick={() => setSentidoActivo('IDA')}
              >
                Trazado IDA ({rutaActual.trazado?.IDA?.length || 0} paradas)
              </button>
              <button
                className="btn"
                style={{
                  background: sentidoActivo === 'REGRESO' ? 'var(--accent-primary)' : 'transparent',
                  color: 'white',
                  padding: '6px 14px',
                  fontSize: '0.85rem',
                  borderRadius: '6px'
                }}
                onClick={() => setSentidoActivo('REGRESO')}
              >
                Trazado REGRESO ({rutaActual.trazado?.REGRESO?.length || 0} paradas)
              </button>
            </div>
          </div>

          {/* Formulario Agregar Paradero */}
          <form onSubmit={handleAgregarParadero} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px' }}>
            <div style={{ flex: 2 }}>
              <input 
                type="text" 
                placeholder="Nombre de la calle / parada (ej: AV. MANSO, PUENTE LA PAZ...)"
                value={nuevaParadaCalle}
                onChange={(e) => setNuevaParadaCalle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  borderRadius: '6px'
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <input 
                type="text" 
                placeholder="Comuna (ej: Melipilla, Santiago...)"
                value={nuevaParadaComuna}
                onChange={(e) => setNuevaParadaComuna(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  borderRadius: '6px'
                }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }}>
              <Plus size={16} />
              Agregar Paradero
            </button>
          </form>

          {/* Tabla de Paraderos */}
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Orden</th>
                  <th>Paradero / Calle</th>
                  <th>Comuna</th>
                  <th style={{ width: '160px', textAlign: 'center' }}>Reordenar</th>
                  <th style={{ width: '90px', textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paradasActuales.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                      No hay paraderos registrados en este trazado. Agrega el primero arriba.
                    </td>
                  </tr>
                ) : (
                  paradasActuales.map((p, idx) => (
                    <tr key={`${p.orden}-${p.calle}`}>
                      <td>
                        <span style={{
                          display: 'inline-flex',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: 'rgba(0, 168, 89, 0.2)',
                          color: 'var(--accent-primary)',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '0.85rem'
                        }}>
                          {p.orden}
                        </span>
                      </td>
                      <td style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <MapPin size={16} className="text-accent-primary" />
                          {p.calle}
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {p.comuna || '---'}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem' }}>
                          <button
                            className="btn-icon"
                            disabled={idx === 0}
                            onClick={() => handleMoverParadero(idx, -1)}
                            title="Mover arriba"
                            style={{ opacity: idx === 0 ? 0.3 : 1, padding: '4px' }}
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button
                            className="btn-icon"
                            disabled={idx === paradasActuales.length - 1}
                            onClick={() => handleMoverParadero(idx, 1)}
                            title="Mover abajo"
                            style={{ opacity: idx === paradasActuales.length - 1 ? 0.3 : 1, padding: '4px' }}
                          >
                            <ArrowDown size={16} />
                          </button>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          className="btn-icon text-danger"
                          onClick={() => handleEliminarParadero(p.orden)}
                          title="Eliminar paradero"
                          style={{ padding: '4px' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Nueva Ruta */}
      {showModalNuevaRuta && (
        <div className="modal-overlay">
          <div className="modal-content glass-card" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Crear Nueva Ruta de Colectivo</h2>
              <button className="btn-icon" onClick={() => setShowModalNuevaRuta(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCrearRuta}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                    Número de Línea
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 105, 12, 3..."
                    value={formRuta.nro_linea}
                    onChange={(e) => setFormRuta({ ...formRuta, nro_linea: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                    Nombre Fantasía / Empresa
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: AGRETACOMBO, TRATCEN..."
                    value={formRuta.nombre_fantasia}
                    onChange={(e) => setFormRuta({ ...formRuta, nombre_fantasia: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white' }}
                  />
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Punto de Origen</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <input
                    type="text"
                    required
                    placeholder="Comuna Origen (ej: Melipilla)"
                    value={formRuta.origen_comuna}
                    onChange={(e) => setFormRuta({ ...formRuta, origen_comuna: e.target.value, origen_nombre: e.target.value })}
                    style={{ padding: '0.6rem', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white' }}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Calle / Terminal Origen (ej: AV. MANSO)"
                    value={formRuta.origen_domicilio}
                    onChange={(e) => setFormRuta({ ...formRuta, origen_domicilio: e.target.value })}
                    style={{ padding: '0.6rem', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white' }}
                  />
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Punto de Destino</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <input
                    type="text"
                    required
                    placeholder="Comuna Destino (ej: Santiago)"
                    value={formRuta.destino_comuna}
                    onChange={(e) => setFormRuta({ ...formRuta, destino_comuna: e.target.value, destino_nombre: e.target.value })}
                    style={{ padding: '0.6rem', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white' }}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Calle / Terminal Destino (ej: TABANCURA)"
                    value={formRuta.destino_domicilio}
                    onChange={(e) => setFormRuta({ ...formRuta, destino_domicilio: e.target.value })}
                    style={{ padding: '0.6rem', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                    Tarifa Base ($ CLP)
                  </label>
                  <input
                    type="number"
                    value={formRuta.tarifa}
                    onChange={(e) => setFormRuta({ ...formRuta, tarifa: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                    Flota Vigente
                  </label>
                  <input
                    type="number"
                    value={formRuta.flota_vigente}
                    onChange={(e) => setFormRuta({ ...formRuta, flota_vigente: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn" onClick={() => setShowModalNuevaRuta(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={18} />
                  Guardar Ruta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspector Formato JSON Oficial */}
      {showJsonInspector && (
        <div className="modal-overlay">
          <div className="modal-content glass-card" style={{ maxWidth: '750px', maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileCode size={20} className="text-accent-primary" />
                Estructura de la Ruta ({rutaActual?.nombre_fantasia}) · rutas_rm_3.json
              </h2>
              <button className="btn-icon" onClick={() => setShowJsonInspector(false)}>
                <X size={20} />
              </button>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              Este JSON sigue el estándar del Ministerio de Transportes y Telecomunicaciones y es el que alimenta al backend y a la app móvil de Colectivos.
            </p>
            <div style={{ flex: 1, overflow: 'auto', background: '#08110c', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <pre style={{ color: '#34d399', fontSize: '0.8rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(rutaActual, null, 2)}
              </pre>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button className="btn btn-primary" onClick={() => setShowJsonInspector(false)}>
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionRutas;
