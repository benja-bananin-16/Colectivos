"""
Configuración de Django para el proyecto Colectivos (CONATACOCH).
Persistencia NoSQL vía MongoEngine en MongoDB.
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
import mongoengine

BASE_DIR = Path(__file__).resolve().parent.parent

# Cargar variables de entorno desde .env
load_dotenv(BASE_DIR / '.env')

# Asegurar que apps y BASE_DIR estén en sys.path
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-colectivos-conatacoch-chile-2026')
DEBUG = os.getenv('DEBUG', 'True').lower() in ('true', '1', 'yes')

ALLOWED_HOSTS = [
    h.strip() for h in os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',') if h.strip()
]

# Sin ORM relacional: persistencia exclusiva con MongoEngine
DATABASES = {}

INSTALLED_APPS = [
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'apps.usuarios',
    'apps.conductores',
    'apps.operacion',
    'apps.finanzas',
    'apps.incidentes',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = []

WSGI_APPLICATION = 'config.wsgi.application'
ASGI_APPLICATION = 'config.asgi.application'

# Configuración Regional
LANGUAGE_CODE = 'es-cl'
TIME_ZONE = 'America/Santiago'
USE_I18N = True
USE_TZ = True

# Archivos estáticos
STATIC_URL = 'static/'

# CORS - permitir desarrollo frontend (Vite / React en 5173)
cors_origins_env = os.getenv('CORS_ALLOWED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173')
CORS_ALLOWED_ORIGINS = [o.strip() for o in cors_origins_env.split(',') if o.strip()]
CORS_ALLOW_CREDENTIALS = True

# Django REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'apps.usuarios.authentication.MongoTokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'UNAUTHENTICATED_USER': None,
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
}

# Conexión MongoDB vía MongoEngine
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://127.0.0.1:27017/colectivos')
MONGODB_NAME = os.getenv('MONGODB_NAME', 'colectivos')

try:
    mongoengine.connect(
        db=MONGODB_NAME,
        host=MONGODB_URI,
        alias='default',
    )
except Exception as exc:
    print(f"[MongoDB] Advertencia al conectar: {exc}")
