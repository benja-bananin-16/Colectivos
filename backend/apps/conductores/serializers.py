from rest_framework import serializers


class ConductorSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    usuario_id = serializers.CharField(required=True)
    licencia_profesional = serializers.CharField(required=True, max_length=50)
    vencimiento_licencia = serializers.DateTimeField(required=True)
    estado = serializers.ChoiceField(
        choices=['EN_LINEA', 'OCUPADO', 'FUERA_SERVICIO', 'SUSPENDIDO'],
        default='EN_LINEA'
    )
    calificacion_promedio = serializers.FloatField(default=5.0, required=False)

    # Campos enriquecidos opcionales en respuestas
    usuario = serializers.DictField(read_only=True, required=False)
    movil = serializers.DictField(read_only=True, required=False)


class ConductorUpdateSerializer(serializers.Serializer):
    licencia_profesional = serializers.CharField(required=False, max_length=50)
    vencimiento_licencia = serializers.DateTimeField(required=False)
    estado = serializers.ChoiceField(
        choices=['EN_LINEA', 'OCUPADO', 'FUERA_SERVICIO', 'SUSPENDIDO'],
        required=False
    )
    calificacion_promedio = serializers.FloatField(required=False)


class MovilSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    numero_interno = serializers.CharField(max_length=20, required=True)
    patente = serializers.CharField(max_length=15, required=True)
    conductor_id = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    linea_id = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    marca = serializers.CharField(max_length=50, required=True)
    modelo = serializers.CharField(max_length=50, required=True)
    anio = serializers.IntegerField(required=True)
    capacidad = serializers.IntegerField(default=4, required=False)
    estado = serializers.ChoiceField(
        choices=['ACTIVO', 'MANTENIMIENTO', 'INACTIVO'],
        default='ACTIVO',
        required=False
    )


class LineaSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    codigo_recorrido = serializers.CharField(required=False, allow_blank=True)
    folio = serializers.IntegerField(required=False, allow_null=True)
    tipo_servicio = serializers.CharField(required=False, allow_blank=True)
    nro_linea = serializers.CharField(required=False, allow_blank=True)
    flota_vigente = serializers.IntegerField(required=False, default=0)
    responsable = serializers.CharField(required=False, allow_blank=True)
    nombre_fantasia = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    tipo_persona = serializers.CharField(required=False, allow_blank=True)
    nombre_recorrido = serializers.CharField(required=False, allow_blank=True)
    tipo_trazado = serializers.CharField(required=False, allow_blank=True)
    nombre = serializers.CharField(max_length=150, required=True)
    origen = serializers.JSONField(required=False)
    destino = serializers.JSONField(required=False)
    trazado = serializers.JSONField(required=False)
    tarifa = serializers.IntegerField(default=1000, required=False)
    activa = serializers.BooleanField(default=True, required=False)


class DocumentoSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    conductor_id = serializers.CharField(required=True)
    tipo = serializers.ChoiceField(
        choices=['LICENCIA', 'REVISION_TECNICA', 'SEGURO', 'PERMISO'],
        required=True
    )
    vencimiento = serializers.DateTimeField(required=True)
    estado = serializers.ChoiceField(
        choices=['VIGENTE', 'POR_VENCER', 'VENCIDO'],
        default='VIGENTE',
        required=False
    )
