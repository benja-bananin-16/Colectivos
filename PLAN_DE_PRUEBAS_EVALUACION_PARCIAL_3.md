# Plan de Pruebas y Validación en Tiempo Real — Evaluación Parcial 3
**Proyecto: Plataforma de Gestión de Colectivos (CONATACOCH)**  
**Institución:** INACAP — Ingeniería en Informática  
**Fecha de Exposición:** 10 de Noviembre de 2026  

---

## 1. Alcance y Objetivos de la Prueba
Verificar el correcto funcionamiento de los módulos requeridos por el **Protocolo de Evaluación Parcial 3**, específicamente:
1. **CRUD Completo de Conductores:** Cumplimiento de los 11 campos mínimos reglamentarios.
2. **CRUD Completo de Automóviles:** Cumplimiento de marca, modelo, año, combustible, patente y las vigencias de Permiso de Circulación, Revisión Técnica (PRT) y Seguro Obligatorio (SOAP).
3. **Validaciones en tiempo real:** Semáforos de vigencia documental, unicidad de patente y RUT, y asignación de ruta operacional.
4. **Respaldo y consistencia de datos:** Persistencia en MongoDB y en local con sincronización en tiempo real.

---

## 2. Matriz de Casos de Prueba (Resultados Esperados vs. Obtenidos)

| ID Caso | Módulo | Descripción de la Prueba | Entrada de Datos / Acción | Resultado Esperado | Resultado Obtenido | Estado |
| :---: | :---: | :--- | :--- | :--- | :--- | :---: |
| **CP-01** | **Conductores** | Alta de conductor con los 11 campos obligatorios | RUT `14.832.195-3`, Rodrigo Venegas, Dir: `Av. Manso 1420`, Fono: `+56 9 8451 2290`, Fijo: `+56 2 2831 4490`, Inc: `2018-04-12`, Lic: `A2`, Mun: `Melipilla`, Obt: `2014-06-20`, Dur: `4 años`, Venc: `2028-11-15`. | Conductor registrado exitosamente, visible en tabla y disponible en selector de flota. | Registrado correctamente, visible en tabla y con ficha técnica completa. | **Aprobado** ✅ |
| **CP-02** | **Conductores** | Visualización de Ficha Técnica Completa (INACAP) | Clic en el botón con ícono de ojo (`Eye`) en la fila del conductor. | Despliegue de modal con desglose de datos personales, licencia profesional A2/A3 y ruta asignada. | Modal desplegado con los 3 bloques de información reglamentaria. | **Aprobado** ✅ |
| **CP-03** | **Conductores** | Edición de conductor y cambio de licencia / domicilio | Modificar dirección a `Pasaje Las Araucarias 742` y tipo de licencia a `A3`. | Actualización inmediata en tabla y persistencia sin pérdida de credenciales ni cuotas. | Datos actualizados inmediatamente en memoria y almacenamiento local/backend. | **Aprobado** ✅ |
| **CP-04** | **Conductores** | Eliminación de conductor con confirmación | Clic en eliminar conductor y confirmación en diálogo de seguridad. | Conductor removido de la lista y desvinculado de vehículos asignados. | Registro eliminado exitosamente con confirmación toast. | **Aprobado** ✅ |
| **CP-05** | **Automóviles** | Alta de automóvil con datos mínimos y vigencias | Patente `BBCL-11`, Nissan Versa 2022, Combustible `Bencina`, Permiso: Melipilla (Venc: `2027-03-31`), PRT: SGS Melipilla (Venc: `2027-08-30`), SOAP: BCI Seguros (Venc: `2027-03-31`). | Automóvil registrado en la flota, cálculo de estado "Activo" y semáforos en verde (Vigente). | Registrado exitosamente con formato de placa patente chilena y semáforo verde. | **Aprobado** ✅ |
| **CP-06** | **Automóviles** | Edición y cambio de estado a Mantenimiento | Cambiar estado de `Activo` a `Mantenimiento` por reparación de frenos. | Badge cambia a color amarillo (`Mantenimiento`) y se actualiza el contador KPI superior. | Badge actualizado a amarillo y KPI de móviles en taller incrementado. | **Aprobado** ✅ |
| **CP-07** | **Automóviles** | Filtro dinámico por combustible y búsqueda por texto | Filtrar por combustible `Bencina` y buscar por `CF-RD-88`. | La tabla filtra en tiempo real mostrando únicamente los registros coincidentes. | Filtrado instantáneo sin recargar la página. | **Aprobado** ✅ |
| **CP-08** | **Documentación** | Alerta semafórica de documento próximo a vencer | Vehículo con revisión técnica con fecha inferior a 30 días (`2026-12-15`). | Badge de advertencia amarilla: `Por vencer (36d / próximo)`. | Badge amarillo de advertencia visualizado correctamente. | **Aprobado** ✅ |
| **CP-09** | **Documentación** | Alerta semafórica de documento vencido | Documento con fecha de vencimiento anterior a la fecha actual (`< 2026-11-09`). | Badge de peligro rojo: `Vencido`, alertando suspensión preventiva del móvil. | Badge rojo de alerta crítica mostrado con indicación de vencimiento. | **Aprobado** ✅ |
| **CP-10** | **Backend API** | Validación de modelos y serializadores Django | Ejecución de `python manage.py test apps.conductores`. | Los modelos `Conductor` y `Movil` serializan todos los campos requeridos sin errores. | 3 pruebas unitarias ejecutadas en 0.001s con resultado `OK`. | **Aprobado** ✅ |
| **CP-11** | **Frontend Build** | Compilación de producción Vite/React | Ejecución de `npm run build` en la carpeta `luis/`. | Compilación exitosa de bundle JS/CSS sin errores sintácticos ni de importación. | Build exitoso en 2.27s generando assets optimizados (`dist/`). | **Aprobado** ✅ |

---

## 3. Supuestos del Proyecto y Reglas de Negocio Validadas

1. **Tipos de Licencia Reglamentarios:** Solo se admiten licencias de transporte profesional de pasajeros (`A2` y `A3`), cumpliendo con la Ley de Tránsito chilena para taxis colectivos.
2. **Combustibles Homologados:** Opciones predefinidas acordes a la flota nacional (`Bencina`, `Diésel`, `Híbrido`, `Eléctrico`, `GLP`, `GNC`).
3. **Placas Patentes Chilenas:** Formato estandarizado de 4 letras + 2 números (o 2 letras + 4 números) en mayúsculas.
4. **Vigencias Documentales en Tiempo Real:**
   * **Verde (Vigente):** Vencimiento a más de 30 días.
   * **Amarillo (Por Vencer):** Vencimiento dentro de los próximos 30 días.
   * **Rojo (Vencido):** Fecha de vencimiento superada respecto a la fecha del sistema.
5. **Acreditación CONATACOCH:** Se registra la fecha de incorporación gremial y el teléfono de domicilio para la ficha social del socio conductor.
