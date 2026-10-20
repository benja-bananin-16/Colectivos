from datetime import datetime, timezone
from mongoengine import Document, StringField, DateTimeField, IntField


class Tarifa(Document):
    """
    Tarifas vigentes por línea de colectivo.
    """
    linea_id = StringField(required=True)
    valor = IntField(required=True)
    vigente_desde = DateTimeField(default=lambda: datetime.now(timezone.utc))

    meta = {
        'collection': 'tarifas',
        'indexes': ['linea_id', 'vigente_desde'],
    }

    def to_dict(self) -> dict:
        return {
            'id': str(self.id),
            'linea_id': self.linea_id,
            'valor': self.valor,
            'vigente_desde': self.vigente_desde.isoformat() if self.vigente_desde else None,
        }

    def __str__(self):
        return f"Tarifa Línea:{self.linea_id} - ${self.valor}"


class Pago(Document):
    """
    Documento de MongoDB para registro de pagos de viajes o servicios.
    Métodos: EFECTIVO | RUTPAY | SIMULADO.
    """
    usuario_id = StringField(required=True)
    viaje_id = StringField(default=None, null=True)
    monto = IntField(required=True)
    metodo = StringField(required=True, choices=('EFECTIVO', 'RUTPAY', 'SIMULADO'))
    estado = StringField(default='COMPLETADO', choices=('PENDIENTE', 'COMPLETADO', 'FALLIDO'))
    creado_en = DateTimeField(default=lambda: datetime.now(timezone.utc))

    meta = {
        'collection': 'pagos',
        'indexes': ['usuario_id', 'viaje_id', 'creado_en', 'metodo', 'estado'],
        'ordering': ['-creado_en'],
    }

    def to_dict(self) -> dict:
        return {
            'id': str(self.id),
            'usuario_id': self.usuario_id,
            'viaje_id': self.viaje_id,
            'monto': self.monto,
            'metodo': self.metodo,
            'estado': self.estado,
            'creado_en': self.creado_en.isoformat() if self.creado_en else None,
        }

    def __str__(self):
        return f"Pago {self.id} - ${self.monto} ({self.metodo}) [{self.estado}]"


class Cuota(Document):
    """
    Cuota gremial o de asociación para conductores de la línea.
    """
    conductor_id = StringField(required=True)
    periodo = StringField(required=True)  # Ej: '2026-10'
    monto = IntField(required=True)
    estado = StringField(default='PENDIENTE', choices=('PENDIENTE', 'PAGADA'))
    vencimiento = DateTimeField(required=True)

    meta = {
        'collection': 'cuotas',
        'indexes': ['conductor_id', 'periodo', 'estado'],
        'ordering': ['-vencimiento'],
    }

    def to_dict(self) -> dict:
        return {
            'id': str(self.id),
            'conductor_id': self.conductor_id,
            'periodo': self.periodo,
            'monto': self.monto,
            'estado': self.estado,
            'vencimiento': self.vencimiento.isoformat() if self.vencimiento else None,
        }

    def __str__(self):
        return f"Cuota {self.periodo} Conductor:{self.conductor_id} - ${self.monto} [{self.estado}]"
