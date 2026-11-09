"""
Configuración de URLs para el proyecto Colectivos (CONATACOCH).
Soporta URLs con y sin barra inclinada final (trailing slash) para máxima compatibilidad.
"""
from django.urls import re_path, include
from apps.usuarios.views import HealthCheckView
from apps.conductores.views import (
    ConductorListCreateView,
    ConductorDetailView,
    MovilListCreateView,
    LineaListCreateView,
    LineaDetailView,
    ConductorSeleccionarLineaView,
)
from apps.operacion.views import ViajeListCreateView, ViajeFinalizarView, AlertaPanicoCreateView
from apps.finanzas.views import PagoListView, PagoResumenView, CuotaListView
from apps.incidentes.views import IncidenteListCreateView

urlpatterns = [
    # Health check
    re_path(r'^api/health/?$', HealthCheckView.as_view(), name='health-check'),

    # Autenticación y Usuarios
    re_path(r'^api/auth/', include('apps.usuarios.urls')),

    # Conductores y Móviles
    re_path(r'^api/conductores/seleccionar-linea/?$', ConductorSeleccionarLineaView.as_view(), name='conductores-seleccionar-linea'),
    re_path(r'^api/conductores/?$', ConductorListCreateView.as_view(), name='conductores-list-create'),
    re_path(r'^api/conductores/(?P<pk>[^/]+)/?$', ConductorDetailView.as_view(), name='conductores-detail'),
    re_path(r'^api/moviles/?$', MovilListCreateView.as_view(), name='moviles-list-create'),

    # Líneas y Rutas (incluye paraderos y trazados)
    re_path(r'^api/lineas/?$', LineaListCreateView.as_view(), name='lineas-list-create'),
    re_path(r'^api/lineas/(?P<pk>[^/]+)/?$', LineaDetailView.as_view(), name='lineas-detail'),
    re_path(r'^api/rutas/?$', LineaListCreateView.as_view(), name='rutas-list-create'),
    re_path(r'^api/rutas/(?P<pk>[^/]+)/?$', LineaDetailView.as_view(), name='rutas-detail'),

    # Operación y Viajes
    re_path(r'^api/viajes/?$', ViajeListCreateView.as_view(), name='viajes-list-create'),
    re_path(r'^api/viajes/(?P<pk>[^/]+)/finalizar/?$', ViajeFinalizarView.as_view(), name='viajes-finalizar'),
    re_path(r'^api/panic/?$', AlertaPanicoCreateView.as_view(), name='panic-alert'),

    # Finanzas
    re_path(r'^api/pagos/resumen/?$', PagoResumenView.as_view(), name='pagos-resumen'),
    re_path(r'^api/pagos/?$', PagoListView.as_view(), name='pagos-list'),
    re_path(r'^api/cuotas/?$', CuotaListView.as_view(), name='cuotas-list'),

    # Incidentes
    re_path(r'^api/incidentes/?$', IncidenteListCreateView.as_view(), name='incidentes-list-create'),
]
