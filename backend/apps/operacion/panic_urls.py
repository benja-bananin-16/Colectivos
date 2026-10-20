from django.urls import re_path
from apps.operacion.views import AlertaPanicoCreateView

urlpatterns = [
    re_path(r'^/?$', AlertaPanicoCreateView.as_view(), name='panic-alert'),
]
