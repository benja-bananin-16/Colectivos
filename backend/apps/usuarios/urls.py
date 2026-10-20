from django.urls import re_path
from apps.usuarios.views import (
    LoginView,
    DemoConductorLoginView,
    DemoPasajeroLoginView,
    AuthMeView,
)

urlpatterns = [
    re_path(r'^login/?$', LoginView.as_view(), name='auth-login'),
    re_path(r'^demo/conductor/?$', DemoConductorLoginView.as_view(), name='auth-demo-conductor'),
    re_path(r'^demo/pasajero/?$', DemoPasajeroLoginView.as_view(), name='auth-demo-pasajero'),
    re_path(r'^me/?$', AuthMeView.as_view(), name='auth-me'),
]
