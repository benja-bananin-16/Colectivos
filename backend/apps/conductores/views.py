from bson import ObjectId
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from apps.usuarios.permissions import IsMongoAuthenticated
from apps.conductores.documents import Conductor, Movil, Linea, Documento
from apps.usuarios.documents import Usuario
from apps.conductores.serializers import (
    ConductorSerializer,
    ConductorUpdateSerializer,
    MovilSerializer,
)


def enriquecer_conductor(conductor: Conductor) -> dict:
    """Añade información de Usuario y Móvil a la respuesta del Conductor."""
    data = conductor.to_dict()
    usuario = Usuario.objects(id=conductor.usuario_id).first() if conductor.usuario_id else None
    if usuario:
        data['usuario'] = usuario.to_dict()
    else:
        data['usuario'] = None

    movil = Movil.objects(conductor_id=str(conductor.id)).first()
    if not movil and conductor.usuario_id:
        movil = Movil.objects(conductor_id=conductor.usuario_id).first()
    data['movil'] = movil.to_dict() if movil else None

    return data


class ConductorListCreateView(APIView):
    """
    Lista y creación de conductores.
    GET  /api/conductores/
    POST /api/conductores/
    """
    permission_classes = [IsMongoAuthenticated]

    def get(self, request):
        conductores = Conductor.objects.all()
        resultado = [enriquecer_conductor(c) for c in conductores]
        return Response(resultado, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ConductorSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        # Verificar si ya existe conductor con ese usuario_id
        if Conductor.objects(usuario_id=data['usuario_id']).first():
            return Response(
                {"error": "Ya existe un perfil de conductor para este usuario."},
                status=status.HTTP_400_BAD_REQUEST
            )

        conductor = Conductor(
            usuario_id=data['usuario_id'],
            licencia_profesional=data['licencia_profesional'],
            vencimiento_licencia=data['vencimiento_licencia'],
            estado=data.get('estado', 'EN_LINEA'),
            calificacion_promedio=data.get('calificacion_promedio', 5.0),
        )
        conductor.save()
        return Response(enriquecer_conductor(conductor), status=status.HTTP_201_CREATED)


class ConductorDetailView(APIView):
    """
    Detalle, actualización y eliminación de un conductor por ID.
    GET/PATCH/DELETE /api/conductores/<id>/
    """
    permission_classes = [IsMongoAuthenticated]

    def _obtener_conductor(self, pk: str):
        try:
            return Conductor.objects(id=pk).first()
        except Exception:
            return None

    def get(self, request, pk):
        conductor = self._obtener_conductor(pk)
        if not conductor:
            return Response({"error": "Conductor no encontrado."}, status=status.HTTP_404_NOT_FOUND)
        return Response(enriquecer_conductor(conductor), status=status.HTTP_200_OK)

    def patch(self, request, pk):
        conductor = self._obtener_conductor(pk)
        if not conductor:
            return Response({"error": "Conductor no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ConductorUpdateSerializer(data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        validados = serializer.validated_data
        for campo, valor in validados.items():
            setattr(conductor, campo, valor)
        conductor.save()

        return Response(enriquecer_conductor(conductor), status=status.HTTP_200_OK)

    def delete(self, request, pk):
        conductor = self._obtener_conductor(pk)
        if not conductor:
            return Response({"error": "Conductor no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        # Elimina el registro del conductor
        conductor.delete()
        return Response({"mensaje": "Conductor eliminado exitosamente."}, status=status.HTTP_204_NO_CONTENT)


class MovilListCreateView(APIView):
    """
    Lista y creación de móviles/vehículos.
    GET  /api/moviles/
    POST /api/moviles/
    """
    permission_classes = [IsMongoAuthenticated]

    def get(self, request):
        moviles = Movil.objects.all()
        return Response([m.to_dict() for m in moviles], status=status.HTTP_200_OK)

    def post(self, request):
        serializer = MovilSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        patente = data['patente'].upper().strip()
        if Movil.objects(patente=patente).first():
            return Response(
                {"error": f"El móvil con patente '{patente}' ya está registrado."},
                status=status.HTTP_400_BAD_REQUEST
            )

        movil = Movil(
            numero_interno=data['numero_interno'],
            patente=patente,
            conductor_id=data.get('conductor_id') or None,
            linea_id=data.get('linea_id') or None,
            marca=data['marca'],
            modelo=data['modelo'],
            anio=data['anio'],
            capacidad=data.get('capacidad', 4),
            estado=data.get('estado', 'ACTIVO'),
        )
        movil.save()
        return Response(movil.to_dict(), status=status.HTTP_201_CREATED)
