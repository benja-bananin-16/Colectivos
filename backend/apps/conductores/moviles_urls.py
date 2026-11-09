from django.urls import re_path
from apps.conductores.views import MovilListCreateView, MovilDetailView

urlpatterns = [
    re_path(r'^/?$', MovilListCreateView.as_view(), name='moviles-list-create'),
    re_path(r'^(?P<pk>[^/]+)/?$', MovilDetailView.as_view(), name='moviles-detail'),
]
