from datetime import datetime, timezone
from mongoengine import (
    Document,
    EmbeddedDocument,
    StringField,
    DateTimeField,
    FloatField,
    IntField,
    BooleanField,
    EmbeddedDocumentField,
    DictField,
)


class UbicacionEmbedded(EmbeddedDocument):
    """Subdocumento para coordenadas y dirección de origen o destino."""
    nombre = StringField(default='')
    lat = FloatField(default=0.0)
    lng = FloatField(default=0.0)

    def to_dict(self) -> dict:
        return {
            'nombre': self.nombre,
            'lat': self.lat,
            'lng': self.lng,
        }


class Turno(Document):
    """
    Control de turnos de los conductores con un móvil específico.
    """
    conductor_id = StringField(required=True)
    movil_id = StringField(required=True)
    inicio = DateTimeField(default=lambda: datetime.now(timezone.utc))
    fin = DateTimeField(default=None, null=True)
    estado = StringField(default='ABIERTO', choices=('ABIERTO', 'CERRADO'))

    meta = {
        'collection': 'turnos',
        'indexes': ['conductor_id', 'movil_id', 'estado'],
    }

    def to_dict(self) -> dict:
        return {
            'id': str(self.id),
            'conductor_id': self.conductor_id,
            'movil_id': self.movil_id,
            'inicio': self.inicio.isoformat() if self.inicio else None,
            'fin': self.fin.isoformat() if self.fin else None,
            'estado': self.estado,
        }


class Viaje(Document):
    """
    Documento de MongoDB para viajes solicitados y en curso.
    """
    pasajero_id = StringField(required=True)
    conductor_id = StringField(default=None, null=True)
    movil_id = StringField(default=None, null=True)
    origen = EmbeddedDocumentField(UbicacionEmbedded, default=UbicacionEmbedded)
    destino = EmbeddedDocumentField(UbicacionEmbedded, default=UbicacionEmbedded)
    estado = StringField(
        default='SOLICITADO',
        choices=('SOLICITADO', 'ACEPTADO', 'EN_CURSO', 'FINALIZADO', 'CANCELADO')
    )
    tarifa = IntField(default=1000)
    inicio = DateTimeField(default=lambda: datetime.now(timezone.utc))
    fin = DateTimeField(default=None, null=True)

    meta = {
        'collection': 'viajes',
        'indexes': ['pasajero_id', 'conductor_id', 'estado', 'inicio'],
        'ordering': ['-inicio'],
    }

    def to_dict(self) -> dict:
        return {
            'id': str(self.id),
            'pasajero_id': self.pasajero_id,
            'conductor_id': self.conductor_id,
            'movil_id': self.movil_id,
            'origen': self.origen.to_dict() if self.origen else {},
            'destino': self.destino.to_dict() if self.destino else {},
            'estado': self.estado,
            'tarifa': self.tarifa,
            'inicio': self.inicio.isoformat() if self.inicio else None,
            'fin': self.fin.isoformat() if self.fin else None,
        }

    def __str__(self):
        return f"Viaje {self.id} [{self.estado}] - Tarifa: ${self.tarifa}"


class Asignacion(Document):
    """
    Registro histórico de asignación de viaje a conductor.
    """
    viaje_id = StringField(required=True)
    conductor_id = StringField(required=True)
    creado_en = DateTimeField(default=lambda: datetime.now(timezone.utc))

    meta = {
        'collection': 'asignaciones',
        'indexes': ['viaje_id', 'conductor_id'],
    }

    def to_dict(self) -> dict:
        return {
            'id': str(self.id),
            'viaje_id': self.viaje_id,
            'conductor_id': self.conductor_id,
            'creado_en': self.creado_en.isoformat() if self.creado_en else None,
        }


class AlertaPanico(Document):
    """
    Alerta de pánico emitida por un conductor en situación de riesgo.
    """
    conductor_id = StringField(required=True)
    ubicacion = DictField(default=dict)
    estado = StringField(default='ACTIVA', choices=('ACTIVA', 'ATENDIDA'))
    creado_en = DateTimeField(default=lambda: datetime.now(timezone.utc))

    meta = {
        'collection': 'alertas_panico',
        'indexes': ['conductor_id', 'estado', 'creado_en'],
        'ordering': ['-creado_en'],
    }

    def to_dict(self) -> dict:
        return {
            'id': str(self.id),
            'conductor_id': self.conductor_id,
            'ubicacion': self.ubicacion,
            'estado': self.estado,
            'creado_en': self.creado_en.isoformat() if self.creado_en else None,
        }

    def __str__(self):
        return f"AlertaPanico {self.id} - Conductor:{self.conductor_id} ({self.estado})"


class Mensaje(Document):
    """
    Mensajes internos entre pasajeros, conductores o central.
    """
    emisor_id = StringField(required=True)
    receptor_id = StringField(required=True)
    texto = StringField(required=True)
    leido = BooleanField(default=False)
    creado_en = DateTimeField(default=lambda: datetime.now(timezone.utc))

    meta = {
        'collection': 'mensajes',
        'indexes': ['emisor_id', 'receptor_id', 'leido'],
        'ordering': ['-creado_en'],
    }

    def to_dict(self) -> dict:
        return {
            'id': str(self.id),
            'emisor_id': self.emisor_id,
            'receptor_id': self.receptor_id,
            'texto': self.texto,
            'leido': self.leido,
            'creado_en': self.creado_en.isoformat() if self.creado_en else None,
        }
