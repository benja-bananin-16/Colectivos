from datetime import datetime, timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.usuarios.permissions import IsMongoAuthenticated
from apps.operacion.documents import Viaje, UbicacionEmbedded, AlertaPanico
from apps.operacion.serializers import ViajeSerializer, AlertaPanicoSerializer
from apps.conductores.documents import Conductor


class ViajeListCreateView(APIView):
    """
    Lista y creación de viajes.
    GET  /api/viajes/
    POST /api/viajes/
    """
    permission_classes = [IsMongoAuthenticated]

    def get(self, request):
        qs = Viaje.objects.all()
        estado = request.query_params.get('estado')
        conductor_id = request.query_params.get('conductor_id')
        pasajero_id = request.query_params.get('pasajero_id')

        if estado:
            qs = qs.filter(estado=estado)
        if conductor_id:
            qs = qs.filter(conductor_id=conductor_id)
        if pasajero_id:
            qs = qs.filter(pasajero_id=pasajero_id)

        return Response([v.to_dict() for v in qs], status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ViajeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        pasajero_id = data.get('pasajero_id') or str(request.user.id)

        origen_raw = data.get('origen', {})
        origen = UbicacionEmbedded(
            nombre=origen_raw.get('nombre', ''),
            lat=origen_raw.get('lat', 0.0),
            lng=origen_raw.get('lng', 0.0)
        )

        destino_raw = data.get('destino', {})
        destino = UbicacionEmbedded(
            nombre=destino_raw.get('nombre', ''),
            lat=destino_raw.get('lat', 0.0),
            lng=destino_raw.get('lng', 0.0)
        )

        viaje = Viaje(
            pasajero_id=pasajero_id,
            conductor_id=data.get('conductor_id') or None,
            movil_id=data.get('movil_id') or None,
            origen=origen,
            destino=destino,
            estado=data.get('estado', 'SOLICITADO'),
            tarifa=data.get('tarifa', 1000),
            inicio=datetime.now(timezone.utc),
        )
        viaje.save()

        return Response(viaje.to_dict(), status=status.HTTP_201_CREATED)


class ViajeFinalizarView(APIView):
    """
    Finaliza un viaje en curso o aceptado.
    POST /api/viajes/<id>/finalizar
    """
    permission_classes = [IsMongoAuthenticated]

    def post(self, request, pk):
        try:
            viaje = Viaje.objects(id=pk).first()
        except Exception:
            viaje = None

        if not viaje:
            return Response(
                {"error": "Viaje no encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )

        if viaje.estado == 'FINALIZADO':
            return Response(
                {"mensaje": "El viaje ya se encontraba finalizado.", "viaje": viaje.to_dict()},
                status=status.HTTP_200_OK
            )

        viaje.estado = 'FINALIZADO'
        viaje.fin = datetime.now(timezone.utc)
        viaje.save()

        return Response({
            "mensaje": "Viaje finalizado exitosamente.",
            "viaje": viaje.to_dict()
        }, status=status.HTTP_200_OK)


class AlertaPanicoCreateView(APIView):
    """
    Registra una alerta de pánico emitida por un conductor o pasajero en emergencia.
    POST /api/panic/
    """
    permission_classes = [IsMongoAuthenticated]

    def post(self, request):
        serializer = AlertaPanicoSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        conductor_id = serializer.validated_data.get('conductor_id')
        if not conductor_id:
            # Si el usuario es conductor, buscar su id de conductor
            conductor = Conductor.objects(usuario_id=str(request.user.id)).first()
            if conductor:
                conductor_id = str(conductor.id)
            else:
                conductor_id = str(request.user.id)

        alerta = AlertaPanico(
            conductor_id=conductor_id,
            ubicacion=serializer.validated_data.get('ubicacion', {}),
            estado='ACTIVA',
            creado_en=datetime.now(timezone.utc),
        )
        alerta.save()

        return Response(alerta.to_dict(), status=status.HTTP_201_CREATED)
