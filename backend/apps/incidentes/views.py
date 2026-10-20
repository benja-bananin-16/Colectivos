from datetime import datetime, timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.usuarios.permissions import IsMongoAuthenticated
from apps.incidentes.documents import Incidente
from apps.incidentes.serializers import IncidenteSerializer


class IncidenteListCreateView(APIView):
    """
    Listado y registro de incidentes o reportes.
    GET  /api/incidentes/
    POST /api/incidentes/
    """
    permission_classes = [IsMongoAuthenticated]

    def get(self, request):
        qs = Incidente.objects.all()
        usuario_id = request.query_params.get('usuario_id')
        estado = request.query_params.get('estado')
        tipo = request.query_params.get('tipo')

        if usuario_id:
            qs = qs.filter(usuario_id=usuario_id)
        if estado:
            qs = qs.filter(estado=estado)
        if tipo:
            qs = qs.filter(tipo=tipo)

        return Response([i.to_dict() for i in qs], status=status.HTTP_200_OK)

    def post(self, request):
        serializer = IncidenteSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        usuario_id = data.get('usuario_id') or str(request.user.id)

        incidente = Incidente(
            tipo=data['tipo'],
            descripcion=data['descripcion'],
            usuario_id=usuario_id,
            viaje_id=data.get('viaje_id') or None,
            estado=data.get('estado', 'PENDIENTE'),
            creado_en=datetime.now(timezone.utc),
        )
        incidente.save()

        return Response(incidente.to_dict(), status=status.HTTP_201_CREATED)
