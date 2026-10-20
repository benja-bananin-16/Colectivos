from datetime import datetime, timezone
from mongoengine import Document, StringField, DateTimeField, IntField


class Incidente(Document):
    """
    Registro de incidencias, reclamos, fallas mecánicas o problemas de seguridad.
    """
    tipo = StringField(required=True)
    descripcion = StringField(required=True)
    usuario_id = StringField(required=True)
    viaje_id = StringField(default=None, null=True)
    estado = StringField(
        default='PENDIENTE',
        choices=('PENDIENTE', 'EN_REVISION', 'RESUELTO')
    )
    creado_en = DateTimeField(default=lambda: datetime.now(timezone.utc))

    meta = {
        'collection': 'incidentes',
        'indexes': ['usuario_id', 'viaje_id', 'estado', 'creado_en'],
        'ordering': ['-creado_en'],
    }

    def to_dict(self) -> dict:
        return {
            'id': str(self.id),
            'tipo': self.tipo,
            'descripcion': self.descripcion,
            'usuario_id': self.usuario_id,
            'viaje_id': self.viaje_id,
            'estado': self.estado,
            'creado_en': self.creado_en.isoformat() if self.creado_en else None,
        }

    def __str__(self):
        return f"Incidente [{self.tipo}] - {self.estado}"


class Calificacion(Document):
    """
    Evaluación de un viaje emitida por un pasajero al conductor.
    """
    viaje_id = StringField(required=True)
    pasajero_id = StringField(required=True)
    conductor_id = StringField(required=True)
    puntaje = IntField(required=True, min_value=1, max_value=5)
    comentario = StringField(default='')

    meta = {
        'collection': 'calificaciones',
        'indexes': ['viaje_id', 'conductor_id', 'pasajero_id'],
    }

    def to_dict(self) -> dict:
        return {
            'id': str(self.id),
            'viaje_id': self.viaje_id,
            'pasajero_id': self.pasajero_id,
            'conductor_id': self.conductor_id,
            'puntaje': self.puntaje,
            'comentario': self.comentario,
        }

    def __str__(self):
        return f"Calificación Viaje:{self.viaje_id} ({self.puntaje} estrellas)"
