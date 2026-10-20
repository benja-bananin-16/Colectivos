# App Móvil Colectivos (CONATACOCH)

Aplicación móvil Android para la gestión y seguimiento del servicio de colectivos de CONATACOCH.

---

## 1. Cómo arrancar el backend

Desde la raíz del repositorio (`C:\Users\danie\StudioProjects\Colectivos`), ejecuta en una terminal:

```bash
backend/.venv/Scripts/python.exe manage.py runserver 0.0.0.0:8010
```

Para verificar que el servicio está activo:
```bash
curl http://127.0.0.1:8010/api/health
# Debe responder: {"status":"ok","db":"conectado"}
```

---

## 2. Cómo conectar la app al emulador

Con el emulador Android o dispositivo USB en ejecución, ejecuta el script automatizado desde la carpeta `movil/`:

```cmd
conectar_emulador.bat
```

Este script se encarga de:
1. Detectar el ejecutable `adb`.
2. Verificar que el emulador o teléfono esté conectado.
3. Crear el túnel `adb reverse tcp:8010 tcp:8010` (evitando bloqueos de firewall).
4. Comprobar que el endpoint de salud del backend responda.
5. Compilar la aplicación (`gradlew.bat assembleDebug`).
6. Instalar el APK resultante en el emulador.

---

## 3. Formas de Conexión de `BASE_URL` (`ApiClient.kt`)

En el archivo `app/src/main/java/cl/conatacoch/colectivos/data/ApiClient.kt`, el parámetro `BASE_URL` se puede configurar según el entorno:

1. **Emulador o teléfono por USB (Recomendado):**
   - URL: `"http://127.0.0.1:8010/api/"`
   - Requisito: Ejecutar `adb reverse tcp:8010 tcp:8010`. Tuneliza el puerto a través de ADB, por lo que no es afectado por el Firewall de Windows ni requiere permisos de administrador.
2. **Emulador sin adb reverse:**
   - URL: `"http://10.0.2.2:8010/api/"`
   - Requisito: Requiere que el puerto `8010` esté abierto en el Firewall de Windows del host para recibir conexiones entrantes del emulador.
3. **Teléfono por WiFi:**
   - URL: `"http://<IP-DEL-PC>:8010/api/"` (por ejemplo `http://192.168.1.50:8010/api/`)
   - Requisito: El dispositivo y el PC deben estar en la misma red local Wi-Fi y el puerto `8010` debe estar permitido en el Firewall de Windows.

*Nota:* Mantener siempre la barra diagonal `/` al final de la URL base en Retrofit.

---

## 4. Credenciales de Prueba

Puedes ingresar utilizando los botones de demostración directa en la pantalla de inicio o introduciendo manualmente las siguientes credenciales:

- **Conductor de Prueba:**
  - **RUT:** `11.111.111-1`
  - **Contraseña:** `DemoConductor2026!`
- **Pasajero de Prueba:**
  - **RUT:** `22.222.222-2`
  - **Contraseña:** `DemoPasajero2026!`
