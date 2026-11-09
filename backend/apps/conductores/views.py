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
    LineaSerializer,
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


class LineaListCreateView(APIView):
    """
    Lista y creación de líneas/rutas.
    GET  /api/lineas/ -> Lista todas las rutas (público o autenticado)
    POST /api/lineas/ -> Crea una nueva ruta (Super Admin)
    """
    permission_classes = [AllowAny]

    def get(self, request):
        lineas = Linea.objects.all()
        return Response([l.to_dict() for l in lineas], status=status.HTTP_200_OK)

    def post(self, request):
        serializer = LineaSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        d = serializer.validated_data
        linea = Linea(
            codigo_recorrido=d.get('codigo_recorrido', ''),
            folio=d.get('folio'),
            tipo_servicio=d.get('tipo_servicio', ''),
            nro_linea=str(d.get('nro_linea', '')),
            flota_vigente=d.get('flota_vigente', 0),
            responsable=d.get('responsable', ''),
            nombre_fantasia=d.get('nombre_fantasia', ''),
            tipo_persona=d.get('tipo_persona', ''),
            nombre_recorrido=d.get('nombre_recorrido', ''),
            tipo_trazado=d.get('tipo_trazado', ''),
            nombre=d['nombre'],
            origen=d.get('origen', {}),
            destino=d.get('destino', {}),
            trazado=d.get('trazado', {}),
            tarifa=d.get('tarifa', 1000),
            activa=d.get('activa', True),
        )
        linea.save()
        return Response(linea.to_dict(), status=status.HTTP_201_CREATED)


class LineaDetailView(APIView):
    """
    Detalle, actualización y eliminación de una línea/ruta por ID.
    GET/PATCH/PUT/DELETE /api/lineas/<id>/
    """
    permission_classes = [AllowAny]

    def _obtener_linea(self, pk: str):
        try:
            return Linea.objects(id=pk).first()
        except Exception:
            return None

    def get(self, request, pk):
        linea = self._obtener_linea(pk)
        if not linea:
            return Response({"error": "Línea/Ruta no encontrada."}, status=status.HTTP_404_NOT_FOUND)
        return Response(linea.to_dict(), status=status.HTTP_200_OK)

    def put(self, request, pk):
        linea = self._obtener_linea(pk)
        if not linea:
            return Response({"error": "Línea/Ruta no encontrada."}, status=status.HTTP_404_NOT_FOUND)

        serializer = LineaSerializer(data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        d = serializer.validated_data
        for campo, valor in d.items():
            setattr(linea, campo, valor)
        linea.save()
        return Response(linea.to_dict(), status=status.HTTP_200_OK)

    def patch(self, request, pk):
        return self.put(request, pk)

    def delete(self, request, pk):
        linea = self._obtener_linea(pk)
        if not linea:
            return Response({"error": "Línea/Ruta no encontrada."}, status=status.HTTP_404_NOT_FOUND)
        linea.delete()
        return Response({"mensaje": "Línea eliminada exitosamente."}, status=status.HTTP_200_OK)


class ConductorSeleccionarLineaView(APIView):
    """
    Permite al conductor seleccionar la línea/ruta en la que va a trabajar.
    POST /api/conductores/seleccionar-linea/
    Body: { "linea_id": "...", "conductor_id": "..." (opcional si viene en token) }
    """
    permission_classes = [AllowAny]

    def post(self, request):
        linea_id = request.data.get('linea_id')
        if not linea_id:
            return Response({"error": "linea_id es requerido."}, status=status.HTTP_400_BAD_REQUEST)

        linea = Linea.objects(id=linea_id).first()
        if not linea:
            return Response({"error": "Línea no encontrada."}, status=status.HTTP_404_NOT_FOUND)

        conductor_id = request.data.get('conductor_id')
        # Si no se pasó conductor_id explícito, intentar obtenerlo del usuario autenticado
        if not conductor_id and hasattr(request, 'usuario') and request.usuario:
            conductor = Conductor.objects(usuario_id=str(request.usuario.id)).first()
            if conductor:
                conductor_id = str(conductor.id)

        # Si aún no tenemos conductor_id, podemos buscar el primer conductor activo o devolver éxito con la línea
        movil = None
        if conductor_id:
            conductor = Conductor.objects(id=conductor_id).first()
            if not conductor and Conductor.objects(usuario_id=conductor_id).first():
                conductor = Conductor.objects(usuario_id=conductor_id).first()

            if conductor:
                # Buscar móvil asociado
                movil = Movil.objects(conductor_id=str(conductor.id)).first()
                if not movil:
                    movil = Movil.objects(conductor_id=conductor.usuario_id).first()
                if movil:
                    movil.linea_id = str(linea.id)
                    movil.save()

        return Response({
            "mensaje": f"Ruta {linea.nombre} seleccionada correctamente.",
            "linea": linea.to_dict(),
            "movil": movil.to_dict() if movil else None
        }, status=status.HTTP_200_OK)
