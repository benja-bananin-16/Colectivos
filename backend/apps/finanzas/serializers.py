from rest_framework import serializers


class PagoSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    usuario_id = serializers.CharField(required=True)
    viaje_id = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    monto = serializers.IntegerField(required=True)
    metodo = serializers.ChoiceField(choices=['EFECTIVO', 'RUTPAY', 'SIMULADO'], required=True)
    estado = serializers.ChoiceField(
        choices=['PENDIENTE', 'COMPLETADO', 'FALLIDO'],
        default='COMPLETADO',
        required=False
    )
    creado_en = serializers.DateTimeField(read_only=True)


class CuotaSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    conductor_id = serializers.CharField(required=True)
    periodo = serializers.CharField(required=True, max_length=20)
    monto = serializers.IntegerField(required=True)
    estado = serializers.ChoiceField(choices=['PENDIENTE', 'PAGADA'], default='PENDIENTE', required=False)
    vencimiento = serializers.DateTimeField(required=True)


class TarifaSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    linea_id = serializers.CharField(required=True)
    valor = serializers.IntegerField(required=True)
    vigente_desde = serializers.DateTimeField(read_only=True)
