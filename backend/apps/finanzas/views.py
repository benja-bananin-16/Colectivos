from datetime import datetime, timedelta, timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.usuarios.permissions import IsMongoAuthenticated
from apps.finanzas.documents import Pago, Cuota


class PagoListView(APIView):
    """
    Listado de pagos registrados en la plataforma.
    GET /api/pagos/
    """
    permission_classes = [IsMongoAuthenticated]

    def get(self, request):
        qs = Pago.objects.all()
        usuario_id = request.query_params.get('usuario_id')
        viaje_id = request.query_params.get('viaje_id')
        metodo = request.query_params.get('metodo')
        estado = request.query_params.get('estado')

        if usuario_id:
            qs = qs.filter(usuario_id=usuario_id)
        if viaje_id:
            qs = qs.filter(viaje_id=viaje_id)
        if metodo:
            qs = qs.filter(metodo=metodo)
        if estado:
            qs = qs.filter(estado=estado)

        return Response([p.to_dict() for p in qs], status=status.HTTP_200_OK)


class PagoResumenView(APIView):
    """
    Resumen financiero con totales de pagos por día, semana y mes.
    GET /api/pagos/resumen
    """
    permission_classes = [IsMongoAuthenticated]

    def get(self, request):
        ahora = datetime.now(timezone.utc)
        inicio_hoy = datetime(ahora.year, ahora.month, ahora.day, tzinfo=timezone.utc)
        inicio_semana = ahora - timedelta(days=7)
        inicio_mes = ahora - timedelta(days=30)

        pagos_completados = Pago.objects(estado='COMPLETADO')

        total_dia = 0
        total_semana = 0
        total_mes = 0
        total_historico = 0
        por_metodo = {'EFECTIVO': 0, 'RUTPAY': 0, 'SIMULADO': 0}

        for pago in pagos_completados:
            monto = pago.monto or 0
            total_historico += monto

            # Acumular por método
            if pago.metodo in por_metodo:
                por_metodo[pago.metodo] += monto
            else:
                por_metodo[pago.metodo] = monto

            # Fechas (asegurar timezone UTC)
            fecha = pago.creado_en
            if fecha:
                if fecha.tzinfo is None:
                    fecha = fecha.replace(tzinfo=timezone.utc)

                if fecha >= inicio_hoy:
                    total_dia += monto
                if fecha >= inicio_semana:
                    total_semana += monto
                if fecha >= inicio_mes:
                    total_mes += monto

        return Response({
            "total_dia": total_dia,
            "total_semana": total_semana,
            "total_mes": total_mes,
            "total_historico": total_historico,
            "cantidad_pagos": pagos_completados.count(),
            "por_metodo": por_metodo,
        }, status=status.HTTP_200_OK)


class CuotaListView(APIView):
    """
    Listado de cuotas gremiales de los conductores.
    GET /api/cuotas/
    """
    permission_classes = [IsMongoAuthenticated]

    def get(self, request):
        qs = Cuota.objects.all()
        conductor_id = request.query_params.get('conductor_id')
        estado = request.query_params.get('estado')
        periodo = request.query_params.get('periodo')

        if conductor_id:
            qs = qs.filter(conductor_id=conductor_id)
        if estado:
            qs = qs.filter(estado=estado)
        if periodo:
            qs = qs.filter(periodo=periodo)

        return Response([c.to_dict() for c in qs], status=status.HTTP_200_OK)
