from rest_framework import serializers


class IncidenteSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    tipo = serializers.CharField(max_length=50, required=True)
    descripcion = serializers.CharField(required=True)
    usuario_id = serializers.CharField(required=False, allow_blank=True)
    viaje_id = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    estado = serializers.ChoiceField(
        choices=['PENDIENTE', 'EN_REVISION', 'RESUELTO'],
        default='PENDIENTE',
        required=False
    )
    creado_en = serializers.DateTimeField(read_only=True)


class CalificacionSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    viaje_id = serializers.CharField(required=True)
    pasajero_id = serializers.CharField(required=True)
    conductor_id = serializers.CharField(required=True)
    puntaje = serializers.IntegerField(min_value=1, max_value=5, required=True)
    comentario = serializers.CharField(required=False, allow_blank=True, default='')
