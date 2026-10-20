from datetime import datetime, timezone
from mongoengine import Document, StringField, DateTimeField, FloatField, IntField, BooleanField


class Linea(Document):
    """
    Documento de MongoDB para líneas de colectivos (rutas fijas autorizadas).
    """
    nombre = StringField(required=True)
    origen = StringField(required=True)
    destino = StringField(required=True)
    tarifa = IntField(default=1000)
    activa = BooleanField(default=True)

    meta = {
        'collection': 'lineas',
        'indexes': ['nombre', 'activa'],
    }

    def to_dict(self) -> dict:
        return {
            'id': str(self.id),
            'nombre': self.nombre,
            'origen': self.origen,
            'destino': self.destino,
            'tarifa': self.tarifa,
            'activa': self.activa,
        }

    def __str__(self):
        return f"Línea {self.nombre} ({self.origen} - {self.destino})"


class Movil(Document):
    """
    Documento de MongoDB para vehículos asociados al servicio de colectivos.
    """
    numero_interno = StringField(required=True)
    patente = StringField(required=True, unique=True)
    conductor_id = StringField(default=None, null=True)
    linea_id = StringField(default=None, null=True)
    marca = StringField(required=True)
    modelo = StringField(required=True)
    anio = IntField(required=True)
    capacidad = IntField(default=4)
    estado = StringField(default='ACTIVO', choices=('ACTIVO', 'MANTENIMIENTO', 'INACTIVO'))

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
            'capacidad': self.capacidad,
            'estado': self.estado,
        }

    def __str__(self):
        return f"Móvil {self.numero_interno} ({self.patente}) - {self.marca} {self.modelo}"


class Conductor(Document):
    """
    Documento de MongoDB para el perfil extendido de un conductor.
    """
    usuario_id = StringField(required=True, unique=True)
    licencia_profesional = StringField(required=True)
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
            'licencia_profesional': self.licencia_profesional,
            'vencimiento_licencia': (
                self.vencimiento_licencia.isoformat() if self.vencimiento_licencia else None
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
