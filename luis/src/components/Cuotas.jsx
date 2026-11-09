import React, { useState } from 'react';
import { 
  Receipt, 
  PlusCircle, 
  CheckCircle, 
  AlertTriangle, 
  Send, 
  FileText, 
  X, 
  DollarSign, 
  User, 
  Car,
  Clock,
  Calendar
} from 'lucide-react';

const Cuotas = ({ conductores, setConductores }) => {
  const [showModalCargo, setShowModalCargo] = useState(false);
  const [showModalPago, setShowModalPago] = useState(false);
  const [showModalCartola, setShowModalCartola] = useState(false);
  const [conductorSeleccionado, setConductorSeleccionado] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  // Formulario nuevo cargo / cuota
  const [formCargo, setFormCargo] = useState({
    conductorId: 'TODOS',
    concepto: 'Cuota Social Extraordinaria',
    periodo: 'Noviembre 2026',
    monto: 35000
  });

  // Formulario registrar pago
  const [formPago, setFormPago] = useState({
    cuotasAPagar: 1,
    medioPago: 'Transferencia Bancaria',
    comprobante: `BOL-${Math.floor(1000 + Math.random() * 9000)}`
  });

  const showNotification = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // KPIs
  const totalConductores = conductores.length;
  const conductoresAlDia = conductores.filter(c => (c.cuotasImpagas || 0) === 0).length;
  const conductoresMorosos = conductores.filter(c => (c.cuotasImpagas || 0) >= 2).length;
  const totalDeudaGremial = conductores.reduce((acc, c) => acc + (c.deudaTotal || ((c.cuotasImpagas || 0) * (c.cuotaMensual || 35000))), 0);

  // Abrir modal pago
  const handleOpenPago = (c) => {
    setConductorSeleccionado(c);
    setFormPago({
      cuotasAPagar: Math.min(1, c.cuotasImpagas || 1),
      medioPago: 'Transferencia Bancaria',
      comprobante: `BOL-${Math.floor(1000 + Math.random() * 9000)}`
    });
    setShowModalPago(true);
  };

  // Abrir modal cartola
  const handleOpenCartola = (c) => {
    setConductorSeleccionado(c);
    setShowModalCartola(true);
  };

  // Confirmar registrar pago
  const handleConfirmarPago = (e) => {
    e.preventDefault();
    if (!conductorSeleccionado) return;

    const cuotasPagadas = parseInt(formPago.cuotasAPagar, 10) || 1;
    const montoPagado = cuotasPagadas * (conductorSeleccionado.cuotaMensual || 35000);

    setConductores(prev => prev.map(c => {
      if (c.id === conductorSeleccionado.id) {
        const nuevasImpagas = Math.max(0, (c.cuotasImpagas || 0) - cuotasPagadas);
        const nuevaDeuda = nuevasImpagas * (c.cuotaMensual || 35000);
        const nuevoEstado = nuevasImpagas === 0 ? 'Al Día' : nuevasImpagas >= 3 ? 'Moroso' : 'Pendiente';

        const nuevoPagoHistorial = {
          id: `PAG-${Date.now()}`,
          concepto: `Pago ${cuotasPagadas} cuota(s) social(es)`,
          periodo: new Date().toLocaleDateString('es-CL', { month: 'short', year: 'numeric' }),
          monto: montoPagado,
          estado: 'Pagada',
          fechaPago: new Date().toISOString().split('T')[0],
          comprobante: formPago.comprobante
        };

        return {
          ...c,
          cuotasImpagas: nuevasImpagas,
          deudaTotal: nuevaDeuda,
          estadoCuotas: nuevoEstado,
          historialCuotas: [nuevoPagoHistorial, ...(c.historialCuotas || [])]
        };
      }
      return c;
    }));

    showNotification(`Pago de $${montoPagado.toLocaleString('es-CL')} registrado con éxito para ${conductorSeleccionado.nombre}.`);
    setShowModalPago(false);
  };

  // Confirmar agregar nueva cuota / cargo
  const handleConfirmarCargo = (e) => {
    e.preventDefault();
    const monto = parseInt(formCargo.monto, 10) || 35000;
    const { conductorId, concepto, periodo } = formCargo;

    setConductores(prev => prev.map(c => {
      if (conductorId === 'TODOS' || c.id === conductorId) {
        const nuevasImpagas = (c.cuotasImpagas || 0) + 1;
        const nuevaDeuda = nuevasImpagas * (c.cuotaMensual || monto);
        const nuevoEstado = nuevasImpagas === 0 ? 'Al Día' : nuevasImpagas >= 3 ? 'Moroso' : 'Pendiente';

        const nuevaCuota = {
          id: `CUO-${Date.now()}-${Math.floor(Math.random() * 100)}`,
          concepto: concepto,
          periodo: periodo,
          monto: monto,
          estado: 'Impago',
          fechaVencimiento: '2026-11-20',
          comprobante: null
        };

        return {
          ...c,
          cuotasImpagas: nuevasImpagas,
          deudaTotal: nuevaDeuda,
          estadoCuotas: nuevoEstado,
          historialCuotas: [nuevaCuota, ...(c.historialCuotas || [])]
        };
      }
      return c;
    }));

    showNotification(`Nueva cuota de $${monto.toLocaleString('es-CL')} cargada con éxito.`);
    setShowModalCargo(false);
  };

  const handleEnviarRecordatorio = (c) => {
    showNotification(`Recordatorio de pago enviado vía WhatsApp/SMS al fono ${c.telefono} de ${c.nombre}.`);
  };

  return (
    <div className="animate-fade-in">
      {/* Toast Notificación */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'var(--accent-primary)',
          color: '#ffffff',
          padding: '0.85rem 1.5rem',
          borderRadius: '8px',
          boxShadow: '0 8px 25px rgba(0, 168, 89, 0.4)',
          zIndex: 9999,
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle size={18} />
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="page-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Cuotas Sociales y Recaudación Gremial</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Control financiero centralizado: registra pagos de cuotas, emite nuevos cobros e inspecciona cartolas de socios.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModalCargo(true)}>
          <PlusCircle size={18} />
          Cargar Nueva Cuota
        </button>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card stat-card">
          <div className="stat-info">
            <h3>Socios al Día</h3>
            <div className="value" style={{ color: 'var(--accent-primary)' }}>
              {conductoresAlDia} / {totalConductores}
            </div>
            <div className="subtitle">Cumplimiento del gremio</div>
          </div>
          <div className="stat-icon green">
            <CheckCircle size={24} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-info">
            <h3>Socios Morosos</h3>
            <div className="value" style={{ color: conductoresMorosos > 0 ? '#f87171' : 'var(--text-primary)' }}>
              {conductoresMorosos}
            </div>
            <div className="subtitle">Más de 2 cuotas impagas</div>
          </div>
          <div className="stat-icon red">
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-info">
            <h3>Deuda Total por Recaudar</h3>
            <div className="value" style={{ color: totalDeudaGremial > 0 ? '#f87171' : 'var(--accent-primary)' }}>
              ${totalDeudaGremial.toLocaleString('es-CL')}
            </div>
            <div className="subtitle">Monto pendiente en tesorería</div>
          </div>
          <div className="stat-icon orange">
            <DollarSign size={24} />
          </div>
        </div>
      </div>

      {/* Tabla de Cuotas por Conductor */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '600' }}>Estado de Cuenta Individual de Socios</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Los pagos registrados actualizan inmediatamente el estado del conductor en el sistema y en la app móvil.
            </p>
          </div>
          <span className="badge success">
            Cuota Ordinaria: $35.000 / mes
          </span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Socio Conductor</th>
                <th>RUT</th>
                <th>Móvil / Patente</th>
                <th>Cuota Mensual</th>
                <th>Cuotas Impagas</th>
                <th>Deuda Total</th>
                <th>Estado Morosidad</th>
                <th>Acciones de Superadmin</th>
              </tr>
            </thead>
            <tbody>
              {conductores.map((c) => {
                const impagas = c.cuotasImpagas || 0;
                const cuota = c.cuotaMensual || 35000;
                const deuda = c.deudaTotal !== undefined ? c.deudaTotal : (impagas * cuota);
                return (
                  <tr key={c.id}>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                        {c.nombre}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        ID: {c.id} · {c.rutaAsignadaNombre || 'Línea 105'}
                      </div>
                    </td>

                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: '500', fontSize: '0.85rem' }}>
                        {c.rut || '---'}
                      </span>
                    </td>

                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.15rem 0.5rem',
                        background: 'rgba(0, 168, 89, 0.15)',
                        border: '1px solid rgba(0, 168, 89, 0.3)',
                        color: 'var(--accent-primary)',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '0.8rem'
                      }}>
                        {c.patente}
                      </span>
                    </td>

                    <td style={{ fontWeight: '500' }}>
                      ${cuota.toLocaleString('es-CL')}
                    </td>

                    <td>
                      <span style={{ fontWeight: 'bold', color: impagas > 0 ? '#f87171' : 'var(--accent-primary)' }}>
                        {impagas} cuota(s)
                      </span>
                    </td>

                    <td>
                      <span style={{
                        fontWeight: 'bold',
                        fontSize: '0.95rem',
                        color: deuda > 0 ? '#f87171' : 'var(--accent-primary)'
                      }}>
                        ${deuda.toLocaleString('es-CL')}
                      </span>
                    </td>

                    <td>
                      {impagas === 0 ? (
                        <span className="badge success">Al Día</span>
                      ) : impagas >= 3 ? (
                        <span className="badge danger">Moroso</span>
                      ) : (
                        <span className="badge warning">Pendiente</span>
                      )}
                    </td>

                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {impagas > 0 ? (
                          <button 
                            className="btn btn-primary" 
                            onClick={() => handleOpenPago(c)}
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                            title="Registrar pago de cuotas"
                          >
                            <DollarSign size={14} /> Registrar Pago
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: '0.35rem 0.5rem' }}>
                            <CheckCircle size={14} /> Sin deuda
                          </span>
                        )}

                        <button 
                          className="btn btn-outline" 
                          onClick={() => handleOpenCartola(c)}
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                          title="Ver desglose histórico de cuotas y pagos"
                        >
                          <Receipt size={14} /> Cartola
                        </button>

                        {impagas > 0 && (
                          <button 
                            className="btn btn-outline" 
                            onClick={() => handleEnviarRecordatorio(c)}
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', color: 'var(--warning)', borderColor: 'rgba(245, 158, 11, 0.4)' }}
                            title="Enviar recordatorio de deuda"
                          >
                            <Send size={14} /> Notificar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Cargar Nueva Cuota / Cargo */}
      {showModalCargo && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="glass-card animate-fade-in" style={{
            width: '100%', 
            maxWidth: '520px',
            border: '1px solid rgba(0, 168, 89, 0.3)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff' }}>
                  Cargar Nueva Cuota o Cargo Gremial
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Aplica una nueva cuota individual o masiva a todos los conductores.
                </p>
              </div>
              <button onClick={() => setShowModalCargo(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleConfirmarCargo}>
              <div className="input-group" style={{ marginBottom: '0.85rem' }}>
                <label>Destinatario del Cobro</label>
                <select
                  value={formCargo.conductorId}
                  onChange={(e) => setFormCargo({ ...formCargo, conductorId: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid var(--border-color)',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    color: '#ffffff',
                    fontSize: '0.95rem'
                  }}
                >
                  <option value="TODOS" style={{ background: '#0f172a' }}>Todos los Conductores Activos ({conductores.length} socios)</option>
                  {conductores.map(c => (
                    <option key={c.id} value={c.id} style={{ background: '#0f172a' }}>
                      {c.nombre} ({c.patente} · {c.rut})
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group" style={{ marginBottom: '0.85rem' }}>
                <label>Concepto de la Cuota</label>
                <input 
                  required 
                  type="text" 
                  value={formCargo.concepto}
                  onChange={(e) => setFormCargo({ ...formCargo, concepto: e.target.value })}
                  placeholder="Ej: Cuota Social Ordinaria Diciembre" 
                />
              </div>

              <div className="grid-2" style={{ marginBottom: 0, gap: '0.75rem' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Monto de la Cuota ($CLP)</label>
                  <input 
                    required 
                    type="number" 
                    value={formCargo.monto}
                    onChange={(e) => setFormCargo({ ...formCargo, monto: e.target.value })}
                    step="1000" 
                  />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Período Contable</label>
                  <input 
                    required 
                    type="text" 
                    value={formCargo.periodo}
                    onChange={(e) => setFormCargo({ ...formCargo, periodo: e.target.value })}
                    placeholder="Noviembre 2026" 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModalCargo(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle size={18} />
                  Aplicar Cuota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Registrar Pago de Cuotas */}
      {showModalPago && conductorSeleccionado && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="glass-card animate-fade-in" style={{
            width: '100%', 
            maxWidth: '500px',
            border: '1px solid rgba(0, 168, 89, 0.3)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff' }}>
                  Registrar Pago de Cuota Social
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Socio: {conductorSeleccionado.nombre} ({conductorSeleccionado.rut})
                </p>
              </div>
              <button onClick={() => setShowModalPago(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleConfirmarPago}>
              <div style={{
                background: 'rgba(0, 168, 89, 0.1)',
                border: '1px solid rgba(0, 168, 89, 0.3)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Deuda Total Actual:</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#f87171' }}>
                    ${(conductorSeleccionado.deudaTotal || (conductorSeleccionado.cuotasImpagas * (conductorSeleccionado.cuotaMensual || 35000))).toLocaleString('es-CL')}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cuotas Pendientes:</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ffffff' }}>
                    {conductorSeleccionado.cuotasImpagas || 0} cuotas
                  </div>
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: '0.85rem' }}>
                <label>Número de Cuotas a Pagar</label>
                <select
                  value={formPago.cuotasAPagar}
                  onChange={(e) => setFormPago({ ...formPago, cuotasAPagar: parseInt(e.target.value, 10) })}
                  style={{
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid var(--border-color)',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    color: '#ffffff',
                    fontSize: '0.95rem'
                  }}
                >
                  {Array.from({ length: conductorSeleccionado.cuotasImpagas || 1 }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n} style={{ background: '#0f172a' }}>
                      {n} cuota(s) · Total: ${(n * (conductorSeleccionado.cuotaMensual || 35000)).toLocaleString('es-CL')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid-2" style={{ marginBottom: 0, gap: '0.75rem' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Medio de Pago</label>
                  <select
                    value={formPago.medioPago}
                    onChange={(e) => setFormPago({ ...formPago, medioPago: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid var(--border-color)',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      color: '#ffffff',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="Transferencia Bancaria" style={{ background: '#0f172a' }}>Transferencia</option>
                    <option value="Efectivo en Caja" style={{ background: '#0f172a' }}>Efectivo Caja</option>
                    <option value="Tarjeta Débito/Crédito" style={{ background: '#0f172a' }}>Tarjeta Débito</option>
                  </select>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>N° Folio / Comprobante</label>
                  <input 
                    type="text" 
                    value={formPago.comprobante}
                    onChange={(e) => setFormPago({ ...formPago, comprobante: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModalPago(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle size={18} />
                  Confirmar Pago (${(formPago.cuotasAPagar * (conductorSeleccionado.cuotaMensual || 35000)).toLocaleString('es-CL')})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Cartola Histórica del Conductor */}
      {showModalCartola && conductorSeleccionado && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="glass-card animate-fade-in" style={{
            width: '100%', 
            maxWidth: '650px',
            maxHeight: '85vh',
            overflowY: 'auto',
            border: '1px solid rgba(0, 168, 89, 0.3)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff' }}>
                  Cartola Histórica de Cuotas
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#34d399' }}>
                  {conductorSeleccionado.nombre} · RUT: {conductorSeleccionado.rut} · Móvil: {conductorSeleccionado.patente}
                </p>
              </div>
              <button onClick={() => setShowModalCartola(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            {/* Resumen cartola */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ flex: 1, padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Ruta Asignada:</div>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                  {conductorSeleccionado.rutaAsignadaNombre || 'Línea 105 Melipilla'}
                </div>
              </div>
              <div style={{ flex: 1, padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Estado Gremial:</div>
                <div style={{ fontWeight: '600', color: conductorSeleccionado.cuotasImpagas === 0 ? 'var(--accent-primary)' : '#f87171', fontSize: '0.9rem' }}>
                  {conductorSeleccionado.estadoCuotas || (conductorSeleccionado.cuotasImpagas === 0 ? 'Al Día' : 'Moroso')}
                </div>
              </div>
            </div>

            {/* Lista historial */}
            <h3 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem' }}>
              Registro de Movimientos y Recibos
            </h3>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Concepto</th>
                    <th>Período</th>
                    <th>Monto</th>
                    <th>Estado</th>
                    <th>Fecha / Comprobante</th>
                  </tr>
                </thead>
                <tbody>
                  {(conductorSeleccionado.historialCuotas || []).map((h, idx) => (
                    <tr key={h.id || idx}>
                      <td style={{ fontWeight: '500' }}>{h.concepto}</td>
                      <td>{h.periodo}</td>
                      <td style={{ fontWeight: 'bold' }}>${(h.monto || 35000).toLocaleString('es-CL')}</td>
                      <td>
                        <span className={`badge ${h.estado === 'Pagada' ? 'success' : h.estado === 'Moroso' || h.estado === 'Impago' ? 'danger' : 'warning'}`}>
                          {h.estado}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {h.fechaPago ? `${h.fechaPago} (${h.comprobante || 'S/N'})` : h.fechaVencimiento ? `Vence: ${h.fechaVencimiento}` : 'Pendiente'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button className="btn btn-outline" onClick={() => setShowModalCartola(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cuotas;
