from datetime import datetime, timezone
from mongoengine import Document, StringField, DateTimeField, FloatField, IntField, BooleanField, DictField


class Linea(Document):
    """
    Documento de MongoDB para líneas de colectivos y recorridos autorizados.
    Compatible con la estructura de rutas_rm_3.json y trazados de IDA/REGRESO.
    """
    codigo_recorrido = StringField(default='')
    folio = IntField(default=None, null=True)
    tipo_servicio = StringField(default='')
    nro_linea = StringField(default='')
    flota_vigente = IntField(default=0)
    responsable = StringField(default='')
    nombre_fantasia = StringField(default='')
    tipo_persona = StringField(default='')
    nombre_recorrido = StringField(default='')
    tipo_trazado = StringField(default='')
    nombre = StringField(required=True)
    origen = DictField(default=dict)
    destino = DictField(default=dict)
    trazado = DictField(default=dict)  # {'IDA': [...paraderos...], 'REGRESO': [...paraderos...]}
    tarifa = IntField(default=1000)
    activa = BooleanField(default=True)

    meta = {
        'collection': 'lineas',
        'indexes': ['nombre', 'nro_linea', 'activa', 'codigo_recorrido'],
    }

    def to_dict(self) -> dict:
        origen_data = self.origen if isinstance(self.origen, dict) else {'nombre': str(self.origen)}
        destino_data = self.destino if isinstance(self.destino, dict) else {'nombre': str(self.destino)}
        return {
            'id': str(self.id),
            'codigo_recorrido': self.codigo_recorrido,
            'folio': self.folio,
            'tipo_servicio': self.tipo_servicio,
            'nro_linea': str(self.nro_linea) if self.nro_linea is not None else '',
            'flota_vigente': self.flota_vigente,
            'responsable': self.responsable,
            'nombre_fantasia': self.nombre_fantasia,
            'tipo_persona': self.tipo_persona,
            'nombre_recorrido': self.nombre_recorrido,
            'tipo_trazado': self.tipo_trazado,
            'nombre': self.nombre,
            'origen': origen_data,
            'destino': destino_data,
            'trazado': self.trazado if isinstance(self.trazado, dict) else {},
            'tarifa': self.tarifa,
            'activa': self.activa,
        }

    def __str__(self):
        origen_str = self.origen.get('nombre', '') if isinstance(self.origen, dict) else str(self.origen)
        destino_str = self.destino.get('nombre', '') if isinstance(self.destino, dict) else str(self.destino)
        return f"Línea {self.nombre} ({origen_str} - {destino_str})"


class Movil(Document):
    """
    Documento de MongoDB para vehículos asociados al servicio de colectivos.
    Incluye vigencias de Permiso de Circulación, Revisión Técnica y Seguro Obligatorio.
    """
    numero_interno = StringField(default='')
    patente = StringField(required=True, unique=True)
    conductor_id = StringField(default=None, null=True)
    linea_id = StringField(default=None, null=True)
    marca = StringField(required=True)
    modelo = StringField(required=True)
    anio = IntField(required=True)
    combustible = StringField(default='Bencina', choices=('Bencina', 'Diésel', 'Híbrido', 'Eléctrico', 'GLP', 'GNC'))
    capacidad = IntField(default=4)
    estado = StringField(default='ACTIVO', choices=('ACTIVO', 'MANTENIMIENTO', 'INACTIVO'))
    permiso_circulacion = DictField(default=dict)  # {'comuna': '', 'fecha_otorgacion': '', 'vencimiento': ''}
    revision_tecnica = DictField(default=dict)     # {'planta': '', 'comuna': '', 'vencimiento': ''}
    seguro_obligatorio = DictField(default=dict)   # {'compania': '', 'prima': 0, 'vencimiento': ''}

    meta = {
        'collection': 'moviles',
        'indexes': ['patente', 'conductor_id', 'linea_id', 'estado'],
    }

    def to_dict(self) -> dict:
        return {
            'id': str(self.id),
            'numero_interno': self.numero_interno,
            'patente': self.patente,
            'conductor_id': self.conductor_id,
            'linea_id': self.linea_id,
            'marca': self.marca,
            'modelo': self.modelo,
            'anio': self.anio,
            'combustible': self.combustible or 'Bencina',
            'capacidad': self.capacidad,
            'estado': self.estado,
            'permiso_circulacion': self.permiso_circulacion if isinstance(self.permiso_circulacion, dict) else {},
            'revision_tecnica': self.revision_tecnica if isinstance(self.revision_tecnica, dict) else {},
            'seguro_obligatorio': self.seguro_obligatorio if isinstance(self.seguro_obligatorio, dict) else {},
        }

    def __str__(self):
        return f"Móvil {self.numero_interno or self.patente} ({self.patente}) - {self.marca} {self.modelo}"


class Conductor(Document):
    """
    Documento de MongoDB para el perfil extendido de un conductor.
    Alineado a los requisitos de acreditación gremial y protocolo INACAP.
    """
    usuario_id = StringField(required=True, unique=True)
    direccion = StringField(default='')
    fono_domicilio = StringField(default='')
    fecha_incorporacion = DateTimeField(default=None, null=True)
    tipo_licencia = StringField(default='A2', choices=('A2', 'A3', 'A2 y A3'))
    licencia_profesional = StringField(default='A2')
    municipio_licencia = StringField(default='')
    fecha_obtencion_licencia = DateTimeField(default=None, null=True)
    duracion_licencia_anios = IntField(default=4)
    vencimiento_licencia = DateTimeField(required=True)
    estado = StringField(
        default='EN_LINEA',
        choices=('EN_LINEA', 'OCUPADO', 'FUERA_SERVICIO', 'SUSPENDIDO')
    )
    calificacion_promedio = FloatField(default=5.0)

    meta = {
        'collection': 'conductores',
        'indexes': ['usuario_id', 'estado'],
    }

    def to_dict(self) -> dict:
        return {
            'id': str(self.id),
            'usuario_id': self.usuario_id,
            'direccion': self.direccion,
            'fono_domicilio': self.fono_domicilio,
            'fecha_incorporacion': (
                self.fecha_incorporacion.strftime('%Y-%m-%d') if self.fecha_incorporacion else None
            ),
            'tipo_licencia': self.tipo_licencia or self.licencia_profesional,
            'licencia_profesional': self.licencia_profesional,
            'municipio_licencia': self.municipio_licencia,
            'fecha_obtencion_licencia': (
                self.fecha_obtencion_licencia.strftime('%Y-%m-%d') if self.fecha_obtencion_licencia else None
            ),
            'duracion_licencia_anios': self.duracion_licencia_anios,
            'vencimiento_licencia': (
                self.vencimiento_licencia.strftime('%Y-%m-%d') if self.vencimiento_licencia else None
            ),
            'estado': self.estado,
            'calificacion_promedio': round(self.calificacion_promedio, 2),
        }

    def __str__(self):
        return f"Conductor Usuario:{self.usuario_id} - Estado:{self.estado}"


class Documento(Document):
    """
    Documentos reglamentarios del conductor y móvil (licencia, revisión técnica, seguro SOAP, permiso).
    """
    conductor_id = StringField(required=True)
    tipo = StringField(
        required=True,
        choices=('LICENCIA', 'REVISION_TECNICA', 'SEGURO', 'PERMISO')
    )
    vencimiento = DateTimeField(required=True)
    estado = StringField(
        default='VIGENTE',
        choices=('VIGENTE', 'POR_VENCER', 'VENCIDO')
    )

    meta = {
        'collection': 'documentos',
        'indexes': ['conductor_id', 'tipo', 'estado'],
    }

    def to_dict(self) -> dict:
        return {
            'id': str(self.id),
            'conductor_id': self.conductor_id,
            'tipo': self.tipo,
            'vencimiento': self.vencimiento.isoformat() if self.vencimiento else None,
            'estado': self.estado,
        }

    def __str__(self):
        return f"Documento {self.tipo} - Conductor:{self.conductor_id} ({self.estado})"
