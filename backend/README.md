# Colectivos Backend (CONATACOCH)

Backend para el sistema de gestión de colectivos urbanos y rurales en Chile (CONATACOCH).
Implementado con **Python 3.11**, **Django 5**, **Django REST Framework** y persistencia NoSQL en **MongoDB** mediante **mongoengine**.

## Arquitectura y Tecnologías
- **Framework Web / API:** Django 5.x + Django REST Framework.
- **Base de Datos:** MongoDB 8.2 (Base de datos: `colectivos`).
- **ORM / ODM:** MongoEngine (`Document`, `EmbeddedDocument`).
- **Autenticación:** Token propio persistido en colección `sesiones` (Header: `Authorization: Token <token>`).
- **Puerto de desarrollo:** `8010` (evita conflicto con puerto 8000).

## Estructura del Proyecto
```
backend/
├── .venv/                 # Entorno virtual Python 3.11
├── requirements.txt       # Dependencias
├── .env / .env.example    # Variables de entorno
├── README.md
├── manage.py
├── config/                # Configuración principal de Django
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
└── apps/
    ├── usuarios/          # Usuario, Sesión, Auth, Login Demo y seed
    ├── conductores/       # Conductor, Móvil, Línea, Documento
    ├── operacion/         # Turno, Viaje, Asignación, AlertaPánico, Mensaje
    ├── finanzas/          # Pago, Cuota, Tarifa
    └── incidentes/        # Incidente, Calificación
```

## Instalación y Configuración

1. **Crear entorno virtual e instalar dependencias:**
   ```powershell
   py -3.11 -m venv .venv
   .venv\Scripts\pip install -r requirements.txt
   ```

2. **Variables de entorno:**
   Copiar `.env.example` a `.env` y configurar según sea necesario:
   ```env
   DEBUG=True
   SECRET_KEY=clave-secreta-desarrollo
   PORT=8010
   MONGODB_URI=mongodb://127.0.0.1:27017/colectivos
   MONGODB_NAME=colectivos
   ```

3. **Verificación y Poblamiento de datos iniciales (Seed):**
   ```powershell
   .venv\Scripts\python manage.py check
   .venv\Scripts\python manage.py seed
   ```

4. **Ejecutar servidor de desarrollo:**
   ```powershell
   .venv\Scripts\python manage.py runserver 8010
   ```

## Endpoints Principales
- `GET  /api/health` — Verificación de salud y conexión a MongoDB.
- `POST /api/auth/login` — Autenticación con RUT y contraseña.
- `POST /api/auth/demo/conductor` — Acceso rápido como conductor demo.
- `POST /api/auth/demo/pasajero` — Acceso rápido como pasajero demo.
- `GET  /api/auth/me` — Perfil del usuario autenticado.
- `GET/POST/PATCH/DELETE /api/conductores/` y `/api/conductores/<id>/` — Gestión de conductores.
- `GET/POST /api/moviles/` — Gestión de móviles / vehículos.
- `GET/POST /api/viajes/` y `POST /api/viajes/<id>/finalizar` — Gestión de viajes.
- `GET  /api/pagos/` y `GET /api/pagos/resumen` — Registro y resumen financiero.
- `GET  /api/cuotas/` — Cuotas gremiales de conductores.
- `GET/POST /api/incidentes/` — Reportes de incidentes.
- `POST /api/panic/` — Emisión de alertas de pánico para emergencias.
