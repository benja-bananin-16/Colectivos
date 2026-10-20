from django.urls import re_path
from apps.incidentes.views import IncidenteListCreateView

urlpatterns = [
    re_path(r'^/?$', IncidenteListCreateView.as_view(), name='incidentes-list-create'),
]
