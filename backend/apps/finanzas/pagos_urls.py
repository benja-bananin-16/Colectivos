from django.urls import re_path
from apps.finanzas.views import PagoListView, PagoResumenView

urlpatterns = [
    re_path(r'^resumen/?$', PagoResumenView.as_view(), name='pagos-resumen'),
    re_path(r'^/?$', PagoListView.as_view(), name='pagos-list'),
]
