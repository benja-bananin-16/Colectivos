from rest_framework import serializers
from apps.common.sanitizers import (
    sanitizar_nombre,
    sanitizar_rut,
    validar_formato_rut,
    sanitizar_telefono,
)


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

    def validate_nombre(self, value):
        return sanitizar_nombre(value)

    def validate_apellido(self, value):
        return sanitizar_nombre(value)

    def validate_rut(self, value):
        if not validar_formato_rut(value):
            raise serializers.ValidationError("Formato de RUT inválido.")
        return sanitizar_rut(value)

    def validate_telefono(self, value):
        return sanitizar_telefono(value)


class LoginSerializer(serializers.Serializer):
    rut = serializers.CharField(max_length=20, required=True, trim_whitespace=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate_rut(self, value):
        return sanitizar_rut(value)


class SesionSerializer(serializers.Serializer):
    token = serializers.CharField(read_only=True)
    usuario_id = serializers.CharField(read_only=True)
    rol = serializers.CharField(read_only=True)
    expira_en = serializers.DateTimeField(read_only=True)
    creado_en = serializers.DateTimeField(read_only=True)
