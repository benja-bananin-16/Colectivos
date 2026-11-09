export const mockData = {
  dashboard: {
    viajesAtendidos: { actual: 4520, anterior: 4100, crecimiento: 10.2 },
    sociosActivos: { actual: 3, anterior: 3, crecimiento: 0 },
    quejas: { actual: 2, anterior: 5, crecimiento: -60.0 },
    evolucionMensual: [
      { mes: 'Ene', viajes: 3800, espera: 5.2 },
      { mes: 'Feb', viajes: 3950, espera: 5.0 },
      { mes: 'Mar', viajes: 4100, espera: 4.8 },
      { mes: 'Abr', viajes: 4520, espera: 4.5 },
    ]
  },
  // 3 conductores oficiales con todos los datos requeridos por el protocolo INACAP
  conductores: [
    {
      id: 'C-001',
      nombre: 'RODRIGO ANDRÉS VENEGAS SOTO',
      rut: '14.832.195-3',
      direccion: 'Av. Vicuña Mackenna 1420, Depto 402, Melipilla',
      telefono: '+56 9 8451 2290', // Fono celular
      fonoDomicilio: '+56 2 2831 4490', // Fono domicilio
      fechaIncorporacion: '2018-04-12', // Fecha de incorporación a CONATACOCH
      tipoLicencia: 'A2', // Tipo de licencia de conducir (A2-A3)
      municipioLicencia: 'I. Municipalidad de Melipilla', // Municipio que otorgó la licencia
      fechaObtencionLicencia: '2014-06-20', // Fecha de obtención de licencia
      duracionLicenciaAnios: 4, // Duración (en años)
      vencimientoLicencia: '2028-11-15', // Fecha de vencimiento
      password: 'Conatacoch2026',
      email: 'rodrigo.venegas@conatacoch.cl',
      patente: 'BBCL-11',
      vehiculo: 'Nissan Versa Sense 1.6 (Blanco)',
      anioVehiculo: 2022,
      estado: 'Activo',
      rutaAsignadaId: '105',
      rutaAsignadaNombre: 'Línea 105 Melipilla',
      rutaDetalle: 'AGRETACOMBO · Av. Manso ↔ Circunvalación Santa Teresa',
      cuotaMensual: 35000,
      cuotasImpagas: 0,
      deudaTotal: 0,
      estadoCuotas: 'Al Día',
      historialCuotas: [
        { id: 'CUO-101', concepto: 'Cuota Social Noviembre 2026', periodo: 'Nov 2026', monto: 35000, estado: 'Pagada', fechaPago: '2026-11-05', comprobante: 'BOL-9412' },
        { id: 'CUO-102', concepto: 'Cuota Social Octubre 2026', periodo: 'Oct 2026', monto: 35000, estado: 'Pagada', fechaPago: '2026-10-04', comprobante: 'BOL-8820' },
        { id: 'CUO-103', concepto: 'Cuota Social Septiembre 2026', periodo: 'Sep 2026', monto: 35000, estado: 'Pagada', fechaPago: '2026-09-02', comprobante: 'BOL-8115' },
      ],
      documentos: {
        revisionTecnica: '2027-08-30',
        permisoCirculacion: '2027-03-31',
        seguro: '2027-03-31',
        licencia: '2028-11-15'
      }
    },
    {
      id: 'C-002',
      nombre: 'CARLOS MAURICIO TAPIA CASTILLO',
      rut: '16.294.508-K',
      direccion: 'Pasaje Las Araucarias 742, Providencia, Santiago',
      telefono: '+56 9 9123 4872',
      fonoDomicilio: '+56 2 2204 8831',
      fechaIncorporacion: '2020-09-05',
      tipoLicencia: 'A3',
      municipioLicencia: 'I. Municipalidad de Providencia',
      fechaObtencionLicencia: '2016-03-10',
      duracionLicenciaAnios: 4,
      vencimientoLicencia: '2027-05-20',
      password: 'Conatacoch2026',
      email: 'carlos.tapia@conatacoch.cl',
      patente: 'CF-RD-88',
      vehiculo: 'Toyota Yaris Sedan GLI 1.5 (Blanco)',
      anioVehiculo: 2020,
      estado: 'Activo',
      rutaAsignadaId: '1',
      rutaAsignadaNombre: 'Línea 1 Santiago - Vitacura',
      rutaDetalle: 'TRATCEN S.A. · Santiago Centro ↔ Tabancura / Kennedy',
      cuotaMensual: 35000,
      cuotasImpagas: 3,
      deudaTotal: 105000,
      estadoCuotas: 'Moroso',
      historialCuotas: [
        { id: 'CUO-201', concepto: 'Cuota Social Noviembre 2026', periodo: 'Nov 2026', monto: 35000, estado: 'Impago', fechaVencimiento: '2026-11-10', comprobante: null },
        { id: 'CUO-202', concepto: 'Cuota Social Octubre 2026', periodo: 'Oct 2026', monto: 35000, estado: 'Impago', fechaVencimiento: '2026-10-10', comprobante: null },
        { id: 'CUO-203', concepto: 'Cuota Social Septiembre 2026', periodo: 'Sep 2026', monto: 35000, estado: 'Impago', fechaVencimiento: '2026-09-10', comprobante: null },
      ],
      documentos: {
        revisionTecnica: '2026-12-15',
        permisoCirculacion: '2027-03-31',
        seguro: '2027-03-31',
        licencia: '2027-05-20'
      }
    },
    {
      id: 'C-003',
      nombre: 'ALEJANDRA MARIELA FUENTES VERGARA',
      rut: '18.105.772-4',
      direccion: 'Calle Los Maitenes 310, María Pinto',
      telefono: '+56 9 7319 6604',
      fonoDomicilio: '+56 2 2835 1109',
      fechaIncorporacion: '2022-01-18',
      tipoLicencia: 'A2',
      municipioLicencia: 'I. Municipalidad de María Pinto',
      fechaObtencionLicencia: '2018-10-02',
      duracionLicenciaAnios: 4,
      vencimientoLicencia: '2029-01-10',
      password: 'Conatacoch2026',
      email: 'alejandra.fuentes@conatacoch.cl',
      patente: 'KJ-TP-42',
      vehiculo: 'Chevrolet Sail LT 1.5 (Blanco)',
      anioVehiculo: 2023,
      estado: 'Activo',
      rutaAsignadaId: '500007',
      rutaAsignadaNombre: 'Recorrido María Pinto',
      rutaDetalle: 'Plaza de Armas María Pinto ↔ Terminal San Borja (Est. Central)',
      cuotaMensual: 35000,
      cuotasImpagas: 1,
      deudaTotal: 35000,
      estadoCuotas: 'Pendiente',
      historialCuotas: [
        { id: 'CUO-301', concepto: 'Cuota Social Noviembre 2026', periodo: 'Nov 2026', monto: 35000, estado: 'Pendiente', fechaVencimiento: '2026-11-15', comprobante: null },
        { id: 'CUO-302', concepto: 'Cuota Social Octubre 2026', periodo: 'Oct 2026', monto: 35000, estado: 'Pagada', fechaPago: '2026-10-08', comprobante: 'BOL-8904' },
        { id: 'CUO-303', concepto: 'Cuota Social Septiembre 2026', periodo: 'Sep 2026', monto: 35000, estado: 'Pagada', fechaPago: '2026-09-06', comprobante: 'BOL-8210' },
      ],
      documentos: {
        revisionTecnica: '2027-04-18',
        permisoCirculacion: '2027-03-31',
        seguro: '2027-03-31',
        licencia: '2029-01-10'
      }
    }
  ],
  // Móviles oficiales con todos los requerimientos de INACAP:
  automoviles: [
    {
      id: 'AUT-001',
      numeroInterno: 'M-101',
      patente: 'BBCL-11',
      marca: 'Nissan',
      modelo: 'Versa Sense 1.6 MT',
      anio: 2022,
      combustible: 'Bencina',
      color: 'Blanco',
      capacidad: 4,
      estado: 'Activo',
      conductorId: 'C-001',
      conductorNombre: 'RODRIGO ANDRÉS VENEGAS SOTO',
      lineaId: '105',
      lineaNombre: 'Línea 105 Melipilla',
      permisoCirculacion: {
        comuna: 'Melipilla',
        fechaOtorgacion: '2026-03-12',
        vencimiento: '2027-03-31'
      },
      revisionTecnica: {
        planta: 'SGS Melipilla AB-1302',
        comuna: 'Melipilla',
        vencimiento: '2027-08-30'
      },
      seguroObligatorio: {
        compania: 'BCI Seguros Generales',
        prima: '$18.500 CLP (0.48 UF)',
        vencimiento: '2027-03-31'
      }
    },
    {
      id: 'AUT-002',
      numeroInterno: 'M-102',
      patente: 'CF-RD-88',
      marca: 'Toyota',
      modelo: 'Yaris Sedan GLI 1.5',
      anio: 2020,
      combustible: 'Bencina',
      color: 'Blanco',
      capacidad: 4,
      estado: 'Activo',
      conductorId: 'C-002',
      conductorNombre: 'CARLOS MAURICIO TAPIA CASTILLO',
      lineaId: '1',
      lineaNombre: 'Línea 1 Santiago - Vitacura',
      permisoCirculacion: {
        comuna: 'Santiago Centro',
        fechaOtorgacion: '2026-03-25',
        vencimiento: '2027-03-31'
      },
      revisionTecnica: {
        planta: 'TÜV Rheinland Conchalí CR-2201',
        comuna: 'Conchalí',
        vencimiento: '2026-12-15'
      },
      seguroObligatorio: {
        compania: 'HDI Seguros S.A.',
        prima: '$17.900 CLP (0.47 UF)',
        vencimiento: '2027-03-31'
      }
    },
    {
      id: 'AUT-003',
      numeroInterno: 'M-103',
      patente: 'KJ-TP-42',
      marca: 'Chevrolet',
      modelo: 'Sail LT 1.5',
      anio: 2023,
      combustible: 'Bencina',
      color: 'Blanco',
      capacidad: 4,
      estado: 'Activo',
      conductorId: 'C-003',
      conductorNombre: 'ALEJANDRA MARIELA FUENTES VERGARA',
      lineaId: '500007',
      lineaNombre: 'Recorrido María Pinto',
      permisoCirculacion: {
        comuna: 'María Pinto',
        fechaOtorgacion: '2026-03-08',
        vencimiento: '2027-03-31'
      },
      revisionTecnica: {
        planta: 'San Dámaso Melipilla SD-04',
        comuna: 'Melipilla',
        vencimiento: '2027-04-18'
      },
      seguroObligatorio: {
        compania: 'Consorcio Nacional de Seguros',
        prima: '$18.200 CLP (0.47 UF)',
        vencimiento: '2027-03-31'
      }
    }
  ],
  incidentes: [
    { id: 'INC-101', fecha: '2026-11-06 15:30', tipo: 'Botón de Pánico', origen: 'Conductor (BBCL-11)', sector: 'Melipilla Centro', estado: 'Resuelto' },
    { id: 'INC-102', fecha: '2026-11-07 09:15', tipo: 'Consulta Pasajero', origen: 'Pasajero', sector: 'Santiago - Vitacura', estado: 'Resuelto' }
  ],
  indicadores: {
    solicitudes: { totales: 5000, atendidas: 4520, noAtendidas: 480 },
    esperaPromedio: '4.5 min'
  }
};
