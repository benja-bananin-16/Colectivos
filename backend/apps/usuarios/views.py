import uuid
from datetime import datetime, timedelta, timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from mongoengine.connection import get_db

from apps.usuarios.documents import Usuario, Sesion
from apps.usuarios.serializers import LoginSerializer
from apps.usuarios.permissions import IsMongoAuthenticated
from apps.conductores.documents import Conductor


def crear_sesion_para_usuario(usuario: Usuario, dias_expiracion: int = 7) -> Sesion:
    """Crea y persiste un nuevo token de sesión para un usuario dado."""
    token = uuid.uuid4().hex
    expira_en = datetime.now(timezone.utc) + timedelta(days=dias_expiracion)
    sesion = Sesion(
        token=token,
        usuario_id=str(usuario.id),
        rol=usuario.rol,
        expira_en=expira_en,
        creado_en=datetime.now(timezone.utc),
    )
    sesion.save()
    return sesion


class HealthCheckView(APIView):
    """
    Endpoint de chequeo de salud y conexión con MongoDB.
    GET /api/health
    """
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            db = get_db()
            db.command('ping')
            return Response(
                {"status": "ok", "db": "conectado"},
                status=status.HTTP_200_OK
            )
        except Exception as exc:
            return Response(
                {"status": "error", "db": "desconectado", "detalle": str(exc)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )


class LoginView(APIView):
    """
    Inicio de sesión por RUT y contraseña.
    POST /api/auth/login
    Body: {"rut": "...", "password": "..."}
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        rut = serializer.validated_data['rut'].strip()
        password = serializer.validated_data['password']

        usuario = Usuario.objects(rut=rut).first()
        if not usuario:
            return Response(
                {"error": "Credenciales inválidas. Verifique RUT y contraseña."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not usuario.activo:
            return Response(
                {"error": "El usuario se encuentra inactivo en la plataforma."},
                status=status.HTTP_403_FORBIDDEN
            )

        if not usuario.check_password(password):
            return Response(
                {"error": "Credenciales inválidas. Verifique RUT y contraseña."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        sesion = crear_sesion_para_usuario(usuario)

        return Response({
            "token": sesion.token,
            "usuario": usuario.to_dict(),
        }, status=status.HTTP_200_OK)


class DemoConductorLoginView(APIView):
    """
    Genera o reutiliza un conductor de prueba y retorna un token de autenticación.
    POST /api/auth/demo/conductor (sin body)
    """
    permission_classes = [AllowAny]

    def post(self, request):
        rut_demo = '11.111.111-1'
        usuario = Usuario.objects(rut=rut_demo).first()

        if not usuario:
            usuario = Usuario(
                rut=rut_demo,
                nombre='Carlos',
                apellido='Valenzuela',
                email='carlos.conductor@conatacoch.cl',
                telefono='+56911112222',
                rol='CONDUCTOR',
                activo=True,
            )
            usuario.set_password('DemoConductor2026!')
            usuario.save()

        # Asegurar documento de Conductor
        conductor = Conductor.objects(usuario_id=str(usuario.id)).first()
        if not conductor:
            conductor = Conductor(
                usuario_id=str(usuario.id),
                licencia_profesional='A1-A2-98745',
                vencimiento_licencia=datetime.now(timezone.utc) + timedelta(days=365),
                estado='EN_LINEA',
                calificacion_promedio=4.9,
            )
            conductor.save()

        sesion = crear_sesion_para_usuario(usuario)

        return Response({
            "token": sesion.token,
            "usuario": usuario.to_dict(),
        }, status=status.HTTP_200_OK)


class DemoPasajeroLoginView(APIView):
    """
    Genera o reutiliza un pasajero de prueba y retorna un token de autenticación.
    POST /api/auth/demo/pasajero (sin body)
    """
    permission_classes = [AllowAny]

    def post(self, request):
        rut_demo = '22.222.222-2'
        usuario = Usuario.objects(rut=rut_demo).first()

        if not usuario:
            usuario = Usuario(
                rut=rut_demo,
                nombre='Constanza',
                apellido='Morales',
                email='constanza.pasajera@conatacoch.cl',
                telefono='+56922223333',
                rol='PASAJERO',
                activo=True,
            )
            usuario.set_password('DemoPasajero2026!')
            usuario.save()

        sesion = crear_sesion_para_usuario(usuario)

        return Response({
            "token": sesion.token,
            "usuario": usuario.to_dict(),
        }, status=status.HTTP_200_OK)


class AuthMeView(APIView):
    """
    Devuelve los datos del usuario autenticado en la sesión actual.
    GET /api/auth/me
    """
    permission_classes = [IsMongoAuthenticated]

    def get(self, request):
        return Response({
            "usuario": request.user.to_dict(),
        }, status=status.HTTP_200_OK)
