from rest_framework import serializers


class UbicacionSerializer(serializers.Serializer):
    nombre = serializers.CharField(max_length=200, required=False, allow_blank=True, default='')
    lat = serializers.FloatField(required=False, default=0.0)
    lng = serializers.FloatField(required=False, default=0.0)


class ViajeSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    pasajero_id = serializers.CharField(required=True)
    conductor_id = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    movil_id = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    origen = UbicacionSerializer(required=False, default=dict)
    destino = UbicacionSerializer(required=False, default=dict)
    estado = serializers.ChoiceField(
        choices=['SOLICITADO', 'ACEPTADO', 'EN_CURSO', 'FINALIZADO', 'CANCELADO'],
        default='SOLICITADO',
        required=False
    )
    tarifa = serializers.IntegerField(default=1000, required=False)
    inicio = serializers.DateTimeField(read_only=True)
    fin = serializers.DateTimeField(read_only=True)


class AlertaPanicoSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    conductor_id = serializers.CharField(required=False, allow_blank=True)
    ubicacion = serializers.DictField(required=False, default=dict)
    estado = serializers.ChoiceField(choices=['ACTIVA', 'ATENDIDA'], default='ACTIVA', required=False)
    creado_en = serializers.DateTimeField(read_only=True)


class TurnoSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    conductor_id = serializers.CharField(required=True)
    movil_id = serializers.CharField(required=True)
    inicio = serializers.DateTimeField(read_only=True)
    fin = serializers.DateTimeField(required=False, allow_null=True)
    estado = serializers.ChoiceField(choices=['ABIERTO', 'CERRADO'], default='ABIERTO', required=False)


class MensajeSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    emisor_id = serializers.CharField(required=True)
    receptor_id = serializers.CharField(required=True)
    texto = serializers.CharField(required=True)
    leido = serializers.BooleanField(default=False, required=False)
    creado_en = serializers.DateTimeField(read_only=True)
