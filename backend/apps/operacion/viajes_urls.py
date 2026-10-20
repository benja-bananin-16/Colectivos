from django.urls import re_path
from apps.operacion.views import ViajeListCreateView, ViajeFinalizarView

urlpatterns = [
    re_path(r'^/?$', ViajeListCreateView.as_view(), name='viajes-list-create'),
    re_path(r'^(?P<pk>[^/]+)/finalizar/?$', ViajeFinalizarView.as_view(), name='viajes-finalizar'),
]
