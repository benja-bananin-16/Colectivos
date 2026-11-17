import unittest
from datetime import datetime, timezone
from apps.conductores.documents import Conductor, Movil
from apps.conductores.serializers import ConductorSerializer, MovilSerializer
from apps.common.sanitizers import (
    sanitizar_patente,
    validar_patente,
    sanitizar_nombre,
    sanitizar_rut,
    validar_formato_rut,
)


class SanitizacionDatosTestCase(unittest.TestCase):
    def test_sanitizacion_patente_formato_unificado(self):
        """Valida que todas las patentes (nuevas o antiguas) se normalicen con guion cada dos caracteres (XX-XX-XX)."""
        self.assertEqual(sanitizar_patente('bbcl11'), 'BB-CL-11')
        self.assertEqual(sanitizar_patente('BBCL-11'), 'BB-CL-11')
        self.assertEqual(sanitizar_patente('cf-rd-88'), 'CF-RD-88')
        self.assertEqual(sanitizar_patente('CF-RD-88'), 'CF-RD-88')
        self.assertEqual(sanitizar_patente('aa1234'), 'AA-12-34')
        self.assertEqual(sanitizar_patente('AA-12-34'), 'AA-12-34')

    def test_validacion_patente(self):
        """Valida detección de patentes chilenas válidas e inválidas."""
        self.assertTrue(validar_patente('BBCL11'))
        self.assertTrue(validar_patente('BB-CL-11'))
        self.assertTrue(validar_patente('CF-RD-88'))
        self.assertTrue(validar_patente('AA1234'))
        self.assertFalse(validar_patente('PATENTE_INVALIDA'))
        self.assertFalse(validar_patente('12345'))
        self.assertFalse(validar_patente('ABCDEF'))  # 6 letras no es patente chilena
        self.assertFalse(validar_patente('123456'))  # 6 números no es patente chilena

    def test_sanitizacion_nombres(self):
        """Valida limpieza de espacios múltiples y conversión a Title Case."""
        self.assertEqual(sanitizar_nombre('  carlos   valenzuela  '), 'Carlos Valenzuela')
        self.assertEqual(sanitizar_nombre('RODRIGO ANDRÉS VENEGAS'), 'Rodrigo Andrés Venegas')
        self.assertEqual(sanitizar_nombre('juan'), 'Juan')

    def test_sanitizacion_rut(self):
        """Valida formateo de RUT a XX.XXX.XXX-X."""
        self.assertEqual(sanitizar_rut('111111111'), '11.111.111-1')
        self.assertEqual(sanitizar_rut('16294508k'), '16.294.508-K')
        self.assertEqual(sanitizar_rut('16.294.508-K'), '16.294.508-K')
        self.assertTrue(validar_formato_rut('16.294.508-K'))
        self.assertFalse(validar_formato_rut('abc'))


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
            patente='BB-CL-11',
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
        self.assertEqual(d['patente'], 'BB-CL-11')
        self.assertEqual(d['combustible'], 'Bencina')
        self.assertEqual(d['permiso_circulacion']['comuna'], 'Melipilla')
        self.assertEqual(d['revision_tecnica']['planta'], 'SGS Melipilla AB-1302')
        self.assertEqual(d['seguro_obligatorio']['compania'], 'BCI Seguros Generales')

    def test_movil_serializer(self):
        """Valida que MovilSerializer acepte y valide los datos de automóviles correctamente."""
        data = {
            'numero_interno': 'M-102',
            'patente': 'cf-rd-88',  # en minúsculas y desordenado
            'marca': 'toyota',      # en minúsculas
            'modelo': 'yaris',
            'anio': 2020,
            'combustible': 'Bencina',
            'permiso_circulacion': {'comuna': 'Santiago Centro', 'fecha_otorgacion': '2026-03-25', 'vencimiento': '2027-03-31'},
            'revision_tecnica': {'planta': 'TÜV Rheinland', 'comuna': 'Conchalí', 'vencimiento': '2026-12-15'},
            'seguro_obligatorio': {'compania': 'HDI Seguros', 'prima': '$17.900 CLP', 'vencimiento': '2027-03-31'}
        }
        serializer = MovilSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        # Verifica que la patente se haya normalizado a XX-XX-XX mayúscula
        self.assertEqual(serializer.validated_data['patente'], 'CF-RD-88')
        # Verifica que marca y modelo se hayan normalizado a Title Case
        self.assertEqual(serializer.validated_data['marca'], 'Toyota')
        self.assertEqual(serializer.validated_data['modelo'], 'Yaris')
