import unittest
from datetime import datetime, timezone
from apps.conductores.documents import Conductor, Movil
from apps.conductores.serializers import ConductorSerializer, MovilSerializer


class ProtocoloInacapCRUDTestCase(unittest.TestCase):
    def test_conductor_campos_protocolo(self):
        """Valida que Conductor soporte todos los campos mínimos exigidos por INACAP."""
        conductor = Conductor(
            usuario_id='usr_test_001',
            direccion='Av. Manso 123, Melipilla',
            fono_domicilio='+56 2 2831 4490',
            fecha_incorporacion=datetime(2020, 5, 10, tzinfo=timezone.utc),
            tipo_licencia='A2',
            licencia_profesional='A2',
            municipio_licencia='I. Municipalidad de Melipilla',
            fecha_obtencion_licencia=datetime(2016, 4, 15, tzinfo=timezone.utc),
            duracion_licencia_anios=4,
            vencimiento_licencia=datetime(2028, 4, 15, tzinfo=timezone.utc),
            estado='EN_LINEA'
        )
        d = conductor.to_dict()
        self.assertEqual(d['direccion'], 'Av. Manso 123, Melipilla')
        self.assertEqual(d['fono_domicilio'], '+56 2 2831 4490')
        self.assertEqual(d['tipo_licencia'], 'A2')
        self.assertEqual(d['municipio_licencia'], 'I. Municipalidad de Melipilla')
        self.assertEqual(d['duracion_licencia_anios'], 4)
        self.assertEqual(d['fecha_incorporacion'], '2020-05-10')
        self.assertEqual(d['fecha_obtencion_licencia'], '2016-04-15')
        self.assertEqual(d['vencimiento_licencia'], '2028-04-15')

    def test_movil_campos_protocolo(self):
        """Valida que Movil soporte combustible y vigencias completas exigidas por INACAP."""
        movil = Movil(
            numero_interno='M-101',
            patente='BBCL-11',
            marca='Nissan',
            modelo='Versa Sense 1.6 MT',
            anio=2022,
            combustible='Bencina',
            capacidad=4,
            estado='ACTIVO',
            permiso_circulacion={
                'comuna': 'Melipilla',
                'fecha_otorgacion': '2026-03-12',
                'vencimiento': '2027-03-31'
            },
            revision_tecnica={
                'planta': 'SGS Melipilla AB-1302',
                'comuna': 'Melipilla',
                'vencimiento': '2027-08-30'
            },
            seguro_obligatorio={
                'compania': 'BCI Seguros Generales',
                'prima': '$18.500 CLP',
                'vencimiento': '2027-03-31'
            }
        )
        d = movil.to_dict()
        self.assertEqual(d['patente'], 'BBCL-11')
        self.assertEqual(d['combustible'], 'Bencina')
        self.assertEqual(d['permiso_circulacion']['comuna'], 'Melipilla')
        self.assertEqual(d['revision_tecnica']['planta'], 'SGS Melipilla AB-1302')
        self.assertEqual(d['seguro_obligatorio']['compania'], 'BCI Seguros Generales')

    def test_movil_serializer(self):
        """Valida que MovilSerializer acepte y valide los datos de automóviles correctamente."""
        data = {
            'numero_interno': 'M-102',
            'patente': 'CF-RD-88',
            'marca': 'Toyota',
            'modelo': 'Yaris',
            'anio': 2020,
            'combustible': 'Bencina',
            'permiso_circulacion': {'comuna': 'Santiago Centro', 'fecha_otorgacion': '2026-03-25', 'vencimiento': '2027-03-31'},
            'revision_tecnica': {'planta': 'TÜV Rheinland', 'comuna': 'Conchalí', 'vencimiento': '2026-12-15'},
            'seguro_obligatorio': {'compania': 'HDI Seguros', 'prima': '$17.900 CLP', 'vencimiento': '2027-03-31'}
        }
        serializer = MovilSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
