from rest_framework import serializers


class UsuarioSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    rut = serializers.CharField(max_length=20)
    nombre = serializers.CharField(max_length=100)
    apellido = serializers.CharField(max_length=100)
    nombre_completo = serializers.CharField(read_only=True)
    email = serializers.EmailField()
    telefono = serializers.CharField(max_length=30, required=False, allow_blank=True)
    rol = serializers.ChoiceField(choices=['CONDUCTOR', 'PASAJERO', 'ADMIN'])
    activo = serializers.BooleanField(default=True)
    creado_en = serializers.DateTimeField(read_only=True)


class LoginSerializer(serializers.Serializer):
    rut = serializers.CharField(max_length=20, required=True, trim_whitespace=True)
    password = serializers.CharField(required=True, write_only=True)


class SesionSerializer(serializers.Serializer):
    token = serializers.CharField(read_only=True)
    usuario_id = serializers.CharField(read_only=True)
    rol = serializers.CharField(read_only=True)
    expira_en = serializers.DateTimeField(read_only=True)
    creado_en = serializers.DateTimeField(read_only=True)
