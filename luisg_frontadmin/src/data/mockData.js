export const mockData = {
  dashboard: {
    viajesAtendidos: { actual: 4520, anterior: 4100, crecimiento: 10.2 },
    sociosActivos: { actual: 125, anterior: 120, crecimiento: 4.1 },
    quejas: { actual: 12, anterior: 18, crecimiento: -33.3 },
    evolucionMensual: [
      { mes: 'Ene', viajes: 3800, espera: 5.2 },
      { mes: 'Feb', viajes: 3950, espera: 5.0 },
      { mes: 'Mar', viajes: 4100, espera: 4.8 },
      { mes: 'Abr', viajes: 4520, espera: 4.5 },
    ]
  },
  conductores: [
    { id: 'C-001', nombre: 'PATRICIA H. MANCILLA PEREIRA', rut: '12.345.678-9', telefono: '+56912345678', email: 'patricia@ejemplo.cl', patente: 'AB-CD-12', estado: 'Activo', cuotasImpagas: 0, 
      documentos: {
        revisionTecnica: '2027-05-10',
        permisoCirculacion: '2027-03-31',
        seguro: '2027-03-31'
      }
    },
    { id: 'C-002', nombre: 'ALEJANDRO BENJAMÍN DURANDAL CASTRO', rut: '13.456.789-0', telefono: '+56987654321', email: 'alejandro@ejemplo.cl', patente: 'WX-YZ-99', estado: 'Suspendido', cuotasImpagas: 3,
      documentos: {
        revisionTecnica: '2026-09-01',
        permisoCirculacion: '2027-03-31',
        seguro: '2027-03-31'
      }
    },
    { id: 'C-003', nombre: 'CARLOS MAURICIO DEL CARMEN VALLE CASTILLO', rut: '15.678.901-2', telefono: '+56911223344', email: 'carlos@ejemplo.cl', patente: 'KL-MN-34', estado: 'Activo', cuotasImpagas: 1,
      documentos: {
        revisionTecnica: '2026-10-15',
        permisoCirculacion: '2027-03-31',
        seguro: '2027-03-31'
      }
    },
    { id: 'C-004', nombre: 'GERMAN ALEXIS QUILODRAN FARIDONI', rut: '10.111.222-3', telefono: '+56955556666', email: 'german@ejemplo.cl', patente: 'TR-PK-22', estado: 'Activo', cuotasImpagas: 0,
      documentos: {
        revisionTecnica: '2027-08-20',
        permisoCirculacion: '2027-03-31',
        seguro: '2027-03-31'
      }
    },
    { id: 'C-005', nombre: 'MARIANELLA DE LOURDES ROJAS TAPIA', rut: '11.222.333-4', telefono: '+56977778888', email: 'marianella@ejemplo.cl', patente: 'GG-WP-01', estado: 'Activo', cuotasImpagas: 0,
      documentos: {
        revisionTecnica: '2027-11-05',
        permisoCirculacion: '2027-03-31',
        seguro: '2027-03-31'
      }
    }
  ],
  incidentes: [
    { id: 'INC-101', fecha: '2026-10-04 15:30', tipo: 'Botón de Pánico', origen: 'Conductor', sector: 'Centro', estado: 'Resuelto' },
    { id: 'INC-102', fecha: '2026-10-05 09:15', tipo: 'Denuncia', origen: 'Pasajero', sector: 'Norte', estado: 'En Revisión' }
  ],
  indicadores: {
    solicitudes: { totales: 5000, atendidas: 4520, noAtendidas: 480 },
    esperaPromedio: '4.5 min'
  }
};
