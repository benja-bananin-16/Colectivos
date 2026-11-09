from rest_framework import serializers


class ConductorSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    usuario_id = serializers.CharField(required=True)
    direccion = serializers.CharField(required=False, allow_blank=True, default='')
    fono_domicilio = serializers.CharField(required=False, allow_blank=True, default='')
    fecha_incorporacion = serializers.DateTimeField(required=False, allow_null=True)
    tipo_licencia = serializers.ChoiceField(choices=['A2', 'A3', 'A2 y A3'], default='A2', required=False)
    licencia_profesional = serializers.CharField(required=False, max_length=50, default='A2')
    municipio_licencia = serializers.CharField(required=False, allow_blank=True, default='')
    fecha_obtencion_licencia = serializers.DateTimeField(required=False, allow_null=True)
    duracion_licencia_anios = serializers.IntegerField(default=4, required=False)
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
    direccion = serializers.CharField(required=False, allow_blank=True)
    fono_domicilio = serializers.CharField(required=False, allow_blank=True)
    fecha_incorporacion = serializers.DateTimeField(required=False, allow_null=True)
    tipo_licencia = serializers.ChoiceField(choices=['A2', 'A3', 'A2 y A3'], required=False)
    licencia_profesional = serializers.CharField(required=False, max_length=50)
    municipio_licencia = serializers.CharField(required=False, allow_blank=True)
    fecha_obtencion_licencia = serializers.DateTimeField(required=False, allow_null=True)
    duracion_licencia_anios = serializers.IntegerField(required=False)
    vencimiento_licencia = serializers.DateTimeField(required=False)
    estado = serializers.ChoiceField(
        choices=['EN_LINEA', 'OCUPADO', 'FUERA_SERVICIO', 'SUSPENDIDO'],
        required=False
    )
    calificacion_promedio = serializers.FloatField(required=False)


class MovilSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    numero_interno = serializers.CharField(max_length=20, required=False, allow_blank=True, default='')
    patente = serializers.CharField(max_length=15, required=True)
    conductor_id = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    linea_id = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    marca = serializers.CharField(max_length=50, required=True)
    modelo = serializers.CharField(max_length=50, required=True)
    anio = serializers.IntegerField(required=True)
    combustible = serializers.ChoiceField(
        choices=['Bencina', 'Diésel', 'Híbrido', 'Eléctrico', 'GLP', 'GNC'],
        default='Bencina',
        required=False
    )
    capacidad = serializers.IntegerField(default=4, required=False)
    estado = serializers.ChoiceField(
        choices=['ACTIVO', 'MANTENIMIENTO', 'INACTIVO'],
        default='ACTIVO',
        required=False
    )
    permiso_circulacion = serializers.JSONField(required=False)
    revision_tecnica = serializers.JSONField(required=False)
    seguro_obligatorio = serializers.JSONField(required=False)


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
