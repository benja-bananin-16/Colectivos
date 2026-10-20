from django.urls import re_path
from apps.conductores.views import MovilListCreateView

urlpatterns = [
    re_path(r'^/?$', MovilListCreateView.as_view(), name='moviles-list-create'),
]
