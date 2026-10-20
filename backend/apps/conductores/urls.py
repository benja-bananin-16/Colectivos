from django.urls import re_path
from apps.conductores.views import ConductorListCreateView, ConductorDetailView

urlpatterns = [
    re_path(r'^/?$', ConductorListCreateView.as_view(), name='conductores-list-create'),
    re_path(r'^(?P<pk>[^/]+)/?$', ConductorDetailView.as_view(), name='conductores-detail'),
]
