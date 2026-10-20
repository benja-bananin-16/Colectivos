@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo  Conexion y Despliegue de App Colectivos en Emulador
echo ========================================================
echo.

cd /d "%~dp0"

REM 1. Resolver la ruta de ADB
set "ADB=%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe"
if not exist "%ADB%" (
    where adb >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] No se encontro adb.exe en %%LOCALAPPDATA%%\Android\Sdk\platform-tools ni en el PATH.
        exit /b 1
    )
    set "ADB=adb"
)
echo [1/5] ADB resuelto: %ADB%

REM 2. Verificar que hay un dispositivo conectado
set "DEVICE_FOUND=0"
set "DEVICE_ID="
for /f "skip=1 tokens=1,2" %%A in ('"%ADB%" devices') do (
    if "%%B"=="device" (
        set "DEVICE_FOUND=1"
        set "DEVICE_ID=%%A"
    )
)

if "%DEVICE_FOUND%"=="0" (
    echo [ERROR] No hay ningun dispositivo o emulador conectado.
    echo Inicia el emulador de Android o conecta un dispositivo por USB con depuracion activada.
    exit /b 1
)
echo [2/5] Dispositivo detectado: %DEVICE_ID%

REM 3. Configurar tunel adb reverse en puerto 8010
echo [3/5] Ejecutando adb reverse tcp:8010 tcp:8010...
"%ADB%" reverse tcp:8010 tcp:8010
if errorlevel 1 (
    echo [ERROR] Fallo al ejecutar 'adb reverse tcp:8010 tcp:8010'.
    echo Se probo con un telefono o emulador no compatible - requiere Android 5.0 o superior con soporte adb reverse.
    exit /b 1
)
echo Tunel adb reverse configurado exitosamente.

REM 4. Comprobar que el backend responde
echo [4/5] Comprobando backend en http://127.0.0.1:8010/api/health...
set "HEALTH_RESP="
for /f "delims=" %%H in ('curl -s http://127.0.0.1:8010/api/health') do (
    set "HEALTH_RESP=%%H"
)
if not defined HEALTH_RESP (
    echo [ADVERTENCIA] El backend no responde en http://127.0.0.1:8010/api/health.
    echo Recuerda arrancar Django en el puerto 8010:
    echo   backend\.venv\Scripts\python.exe manage.py runserver 0.0.0.0:8010
) else (
    echo Backend responde correctamente: %HEALTH_RESP%
)

REM 5. Compilar la app
echo [5/5] Compilando e instalando APK...
echo Ejecutando gradlew.bat assembleDebug...
call gradlew.bat assembleDebug
if errorlevel 1 (
    echo [ERROR] Fallo la compilacion con gradlew.bat assembleDebug.
    exit /b 1
)

REM Instalar la app
echo Instalando APK en el dispositivo...
"%ADB%" install -r app\build\outputs\apk\debug\app-debug.apk
if errorlevel 1 (
    echo [ERROR] Fallo la instalacion del APK con adb install.
    exit /b 1
)

echo.
echo Listo. Abre la app y usa cualquiera de los dos botones demo.
