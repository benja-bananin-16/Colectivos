from django.urls import re_path
from apps.finanzas.views import CuotaListView

urlpatterns = [
    re_path(r'^/?$', CuotaListView.as_view(), name='cuotas-list'),
]
