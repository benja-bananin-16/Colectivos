# Sistema de Gestión de Colectivos (CONATACOCH)

Plataforma integral para la administración, operación y monitoreo en tiempo real del transporte público de taxis colectivos, desarrollada para la Confederación Nacional de Taxis Colectivos de Chile (**CONATACOCH**).

---

## 📁 Estructura del Repositorio

El proyecto se compone de tres módulos principales:

### 1. `backend/` — API REST y Base de Datos
* **Tecnologías:** Python, Django 5, Django REST Framework, MongoDB (MongoEngine).
* **Descripción:** Servidor backend central que gestiona la lógica de negocio, endpoints y persistencia de datos:
  * Autenticación y control de roles (Administrador, Conductor, Pasajero).
  * CRUD completo de Conductores y Automóviles (incluyendo vigencias de revisión técnica, permiso de circulación y SOAP).
  * Gestión de rutas, líneas y paraderos oficiales de la Región Metropolitana.
  * Registro de viajes, control de cuotas gremiales y reporte de incidentes de seguridad.

---

### 2. `movil/` — Aplicación Móvil Android
* **Tecnologías:** Kotlin, Android SDK, Retrofit 2, OpenStreetMap (osmdroid).
* **Descripción:** Aplicación móvil nativa para dispositivos Android que reúne las funciones tanto para conductores como para pasajeros:
  * **Módulo Conductor:** Inicio de turno, selección de recorrido, navegación en mapa con paraderos, cobro de tarifa y botón de alerta/pánico.
  * **Módulo Pasajero:** Visualización de paraderos cercanos, seguimiento de colectivos en tiempo real y solicitud de viajes.
  * **Acceso y Autenticación:** Pantalla de inicio de sesión con credenciales y botones de acceso rápido de prueba (Demo Conductor y Demo Pasajero).

---

### 3. `luis/` — Panel Web de Administración
* **Tecnologías:** React, Vite, Lucide Icons.
* **Descripción:** Panel web para administradores y directivos gremiales de CONATACOCH:
  * **Dashboard Ejecutivo:** Indicadores de viajes atendidos, tiempos de espera y socios activos.
  * **Gestión de Conductores:** Hoja de vida gremial, licencias profesionales (A2/A3), credenciales móviles y cuotas.
  * **Gestión de Automóviles:** Control de flota, combustibles, patentes y semáforos de vigencia documental.
  * **Rutas y Paraderos:** Monitoreo interactivo de recorridos.
  * **Cuotas e Incidentes:** Control financiero gremial y alertas de seguridad en tiempo real.

---

## 🚀 Inicio Rápido en Desarrollo

| Componente | Carpeta | Comando de Inicio | Puerto por Defecto |
| :--- | :--- | :--- | :---: |
| **Backend API** | `backend/` | `python manage.py runserver 0.0.0.0:8010` | `8010` |
| **Panel Admin Web** | `luis/` | `npm run dev` | `5173` |
| **App Móvil** | `movil/` | Abrir y compilar en **Android Studio** | Emulador / Dispositivo USB |
