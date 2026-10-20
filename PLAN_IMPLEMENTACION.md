# Plan de implementación — Colectivos (CONATACOCH)

Basado en la auditoría del informe y la presentación (`AUDITORIA_COLECTIVOS.md`).
Todo el código lo escribe **Antigravity (agy)**; Hermes solo planifica, revisa y verifica.

## Estructura objetivo del repositorio

```
Colectivos/
├── movil/        app Android unificada (conductor + pasajero, login con 3 botones)
├── luis/         panel de administración (React + Vite) — se mantiene aparte
├── backend/      API Django REST + MongoDB
├── daniel/       (referencia histórica, se conserva hasta aprobar la fusión)
└── Benja/        (referencia histórica, se conserva hasta aprobar la fusión)
```

## Decisiones tomadas

| Tema | Decisión | Motivo |
|---|---|---|
| Mapas (móvil) | **osmdroid** con teselas de OpenStreetMap | Gratis, sin API key, sin tarjeta de crédito. Google Maps exigía una key de la cuenta GCP del usuario y hoy el manifiesto tiene un placeholder |
| Mapas (panel web) | **Leaflet** + OSM | Mismo motivo; el panel ya es React |
| Geocodificación / rutas | Nominatim y OSRM públicos | Sin key, con límites de uso razonables |
| Fusión móvil | Una sola app `movil/`: paquete base `cl.conatacoch.colectivos` con subpaquetes `login/`, `conductor/` (de daniel) y `pasajero/` (de Benja) | Ambas carpetas ya son Kotlin nativo; se unifican sin reescribir |
| Login | 3 botones: **Entrar**, **Demo conductor**, **Demo pasajero** | Pedido explícito |
| Backend | Django 5 + DRF + **mongoengine** sobre MongoDB local | Pedido explícito (Python + Django + Mongo) |
| Admin | `luis/` se queda separado, solo se le agrega login y conexión a la API | Pedido explícito |

## Fases

### Fase 1 — Backend (base de todo)
Carpeta `backend/`, API REST con Django + DRF + MongoDB.
Colecciones alineadas al modelo del informe: usuarios, conductores, moviles, lineas,
turnos, viajes, pagos, cuotas, documentos, incidentes, calificaciones, alertas_panico,
mensajes, tarifas, asignaciones.
Autenticación por token propio guardado en Mongo (no JWT: mongoengine no se lleva bien con simplejwt).
Endpoints de login real, login demo (conductor y pasajero), CRUD de conductores, viajes,
pagos, cuotas e incidentes; comando de seed con datos de prueba.
**Verificación:** `manage.py check`, servidor arriba, `curl` a `/api/health` y a los endpoints demo.

### Fase 2 — App móvil unificada
`movil/` fusiona Daniel (conductor) y Benja (pasajero), login con 3 botones, mapa con osmdroid.
**Verificación:** `gradlew assembleDebug` genera APK.

### Fase 3 — Panel de administración
`luis/`: login, conexión a la API real (reemplazar `mockData`) y Leaflet en los mapas.
**Verificación:** `npm run build`.

## Reglas para todas las fases

- No se toca `daniel/` ni `Benja/` (quedan como referencia hasta que el usuario apruebe borrarlas).
- No se hace commit ni push: el usuario revisa el diff primero.
- Cada fase se verifica con un build o una llamada real, no con el resumen del agente.
- Español neutro en los textos de interfaz, sin modismos chilenos.
