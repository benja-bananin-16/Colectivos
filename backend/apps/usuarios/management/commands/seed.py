"""
Comando de gestión de Django para poblar datos iniciales de prueba (Seed).
Totalmente idempotente: si los datos ya existen, no los duplica.
"""
from datetime import datetime, timedelta, timezone
from django.core.management.base import BaseCommand

from apps.usuarios.documents import Usuario
from apps.conductores.documents import Conductor, Movil, Linea, Documento
from apps.operacion.documents import Viaje, UbicacionEmbedded
from apps.finanzas.documents import Pago, Cuota, Tarifa
from apps.incidentes.documents import Incidente, Calificacion


class Command(BaseCommand):
    help = "Puebla la base de datos de MongoDB con datos iniciales para desarrollo y pruebas."

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("=== Iniciando Seed de datos Colectivos (CONATACOCH) ==="))

        ahora = datetime.now(timezone.utc)

        # -------------------------------------------------------------
        # 1. Administrador del sistema
        # -------------------------------------------------------------
        admin = Usuario.objects(rut='9.999.999-9').first()
        if not admin:
            admin = Usuario(
                rut='9.999.999-9',
                nombre='Administrador',
                apellido='Central',
                email='admin@conatacoch.cl',
                telefono='+56990001111',
                rol='ADMIN',
                activo=True,
            )
            admin.set_password('AdminPassword2026!')
            admin.save()
            self.stdout.write(self.style.SUCCESS("[OK] Admin creado: admin@conatacoch.cl"))
        else:
            if not admin.check_password('AdminPassword2026!'):
                admin.set_password('AdminPassword2026!')
                admin.save()
            self.stdout.write("[INFO] Admin ya existe, omitiendo creación.")

        # -------------------------------------------------------------
        # 2. Pasajero Demo
        # -------------------------------------------------------------
        pasajero = Usuario.objects(rut='22.222.222-2').first()
        if not pasajero:
            pasajero = Usuario(
                rut='22.222.222-2',
                nombre='Constanza',
                apellido='Morales',
                email='constanza.pasajera@conatacoch.cl',
                telefono='+56922223333',
                rol='PASAJERO',
                activo=True,
            )
            pasajero.set_password('DemoPasajero2026!')
            pasajero.save()
            self.stdout.write(self.style.SUCCESS("[OK] Pasajero demo creado: Constanza Morales"))
        else:
            if not pasajero.check_password('DemoPasajero2026!'):
                pasajero.set_password('DemoPasajero2026!')
                pasajero.save()
            self.stdout.write("[INFO] Pasajero demo ya existe, omitiendo creación.")

        # -------------------------------------------------------------
        # 3. 3 Líneas chilenas
        # -------------------------------------------------------------
        datos_lineas = [
            {
                'nombre': 'Recoleta – Providencia',
                'origen': 'Metro Dorsal, Recoleta',
                'destino': 'Metro Manuel Montt, Providencia',
                'tarifa': 1000,
            },
            {
                'nombre': 'Maipú – Centro',
                'origen': 'Plaza de Maipú',
                'destino': 'Metro Los Héroes, Santiago Centro',
                'tarifa': 1200,
            },
            {
                'nombre': 'La Florida – Macul',
                'origen': 'Bellavista de La Florida',
                'destino': 'Rotonda Rodrigo de Araya, Macul',
                'tarifa': 1100,
            },
        ]

        lineas_creadas = {}
        for d in datos_lineas:
            linea = Linea.objects(nombre=d['nombre']).first()
            if not linea:
                linea = Linea(
                    nombre=d['nombre'],
                    origen=d['origen'],
                    destino=d['destino'],
                    tarifa=d['tarifa'],
                    activa=True,
                )
                linea.save()
                # Tarifa asociada
                Tarifa(linea_id=str(linea.id), valor=d['tarifa'], vigente_desde=ahora).save()
                self.stdout.write(self.style.SUCCESS(f"[OK] Línea creada: {linea.nombre}"))
            else:
                self.stdout.write(f"[INFO] Línea ya existe: {linea.nombre}")
            lineas_creadas[d['nombre']] = linea

        # -------------------------------------------------------------
        # 4. 6 Conductores con Móvil y Línea
        # -------------------------------------------------------------
        datos_conductores = [
            {
                'rut': '11.111.111-1',
                'nombre': 'Carlos',
                'apellido': 'Valenzuela',
                'email': 'carlos.conductor@conatacoch.cl',
                'telefono': '+56911112222',
                'licencia': 'A1-A2-98745',
                'vencimiento_licencia': ahora + timedelta(days=365),
                'estado': 'EN_LINEA',
                'calificacion': 4.9,
                'patente': 'BBCL-11',
                'interno': '01',
                'marca': 'Toyota',
                'modelo': 'Yaris',
                'anio': 2021,
                'linea': 'Recoleta – Providencia',
            },
            {
                'rut': '12.345.678-5',
                'nombre': 'Juan',
                'apellido': 'Morales',
                'email': 'juan.morales@conatacoch.cl',
                'telefono': '+56912345678',
                'licencia': 'A2-54321',
                'vencimiento_licencia': ahora + timedelta(days=180),
                'estado': 'EN_LINEA',
                'calificacion': 4.8,
                'patente': 'CFGH-22',
                'interno': '02',
                'marca': 'Nissan',
                'modelo': 'Versa',
                'anio': 2020,
                'linea': 'Recoleta – Providencia',
            },
            {
                'rut': '13.456.789-3',
                'nombre': 'Rodrigo',
                'apellido': 'Silva',
                'email': 'rodrigo.silva@conatacoch.cl',
                'telefono': '+56923456789',
                'licencia': 'A1-11223',
                'vencimiento_licencia': ahora + timedelta(days=240),
                'estado': 'OCUPADO',
                'calificacion': 4.7,
                'patente': 'DFJK-33',
                'interno': '03',
                'marca': 'Hyundai',
                'modelo': 'Accent',
                'anio': 2022,
                'linea': 'Maipú – Centro',
            },
            {
                'rut': '14.567.890-7',
                'nombre': 'Eduardo',
                'apellido': 'Castro',
                'email': 'eduardo.castro@conatacoch.cl',
                'telefono': '+56934567890',
                'licencia': 'A2-44556',
                'vencimiento_licencia': ahora + timedelta(days=90),
                'estado': 'EN_LINEA',
                'calificacion': 5.0,
                'patente': 'EKLP-44',
                'interno': '04',
                'marca': 'Chevrolet',
                'modelo': 'Sail',
                'anio': 2019,
                'linea': 'Maipú – Centro',
            },
            {
                'rut': '15.678.901-1',
                'nombre': 'Patricio',
                'apellido': 'Fuentes',
                'email': 'patricio.fuentes@conatacoch.cl',
                'telefono': '+56945678901',
                'licencia': 'A2-77889',
                'vencimiento_licencia': ahora + timedelta(days=400),
                'estado': 'FUERA_SERVICIO',
                'calificacion': 4.6,
                'patente': 'FRTY-55',
                'interno': '05',
                'marca': 'Kia',
                'modelo': 'Rio 4',
                'anio': 2021,
                'linea': 'La Florida – Macul',
            },
            {
                'rut': '16.789.012-9',
                'nombre': 'Marcela',
                'apellido': 'Rojas',
                'email': 'marcela.rojas@conatacoch.cl',
                'telefono': '+56956789012',
                'licencia': 'A1-99001',
                'vencimiento_licencia': ahora + timedelta(days=300),
                'estado': 'EN_LINEA',
                'calificacion': 4.9,
                'patente': 'GSWE-66',
                'interno': '06',
                'marca': 'Suzuki',
                'modelo': 'Dzire',
                'anio': 2023,
                'linea': 'La Florida – Macul',
            },
        ]

        conductores_creados = []
        moviles_creados = []

        for c_data in datos_conductores:
            u = Usuario.objects(rut=c_data['rut']).first()
            if not u:
                u = Usuario(
                    rut=c_data['rut'],
                    nombre=c_data['nombre'],
                    apellido=c_data['apellido'],
                    email=c_data['email'],
                    telefono=c_data['telefono'],
                    rol='CONDUCTOR',
                    activo=True,
                )
                u.set_password('DemoConductor2026!')
                u.save()
            else:
                u.set_password('DemoConductor2026!')
                u.save()

            cond = Conductor.objects(usuario_id=str(u.id)).first()
            if not cond:
                cond = Conductor(
                    usuario_id=str(u.id),
                    licencia_profesional=c_data['licencia'],
                    vencimiento_licencia=c_data['vencimiento_licencia'],
                    estado=c_data['estado'],
                    calificacion_promedio=c_data['calificacion'],
                )
                cond.save()
                self.stdout.write(self.style.SUCCESS(f"[OK] Conductor creado: {c_data['nombre']} {c_data['apellido']}"))
            else:
                self.stdout.write(f"[INFO] Conductor ya existe: {c_data['nombre']} {c_data['apellido']}")

            conductores_creados.append(cond)

            # Móvil asociado
            linea_obj = lineas_creadas.get(c_data['linea'])
            linea_id = str(linea_obj.id) if linea_obj else None

            movil = Movil.objects(patente=c_data['patente']).first()
            if not movil:
                movil = Movil(
                    numero_interno=c_data['interno'],
                    patente=c_data['patente'],
                    conductor_id=str(cond.id),
                    linea_id=linea_id,
                    marca=c_data['marca'],
                    modelo=c_data['modelo'],
                    anio=c_data['anio'],
                    capacidad=4,
                    estado='ACTIVO',
                )
                movil.save()
                self.stdout.write(self.style.SUCCESS(f"[OK] Móvil creado: Interno {movil.numero_interno} ({movil.patente})"))
            else:
                self.stdout.write(f"[INFO] Móvil ya existe: {movil.patente}")

            moviles_creados.append(movil)

        # -------------------------------------------------------------
        # 5. Documentos con vencimientos variados (al menos uno vencido)
        # -------------------------------------------------------------
        if Documento.objects.count() == 0:
            doc_specs = [
                # Conductor 1: Todos vigentes
                (conductores_creados[0], 'LICENCIA', ahora + timedelta(days=365), 'VIGENTE'),
                (conductores_creados[0], 'REVISION_TECNICA', ahora + timedelta(days=120), 'VIGENTE'),
                (conductores_creados[0], 'SEGURO', ahora + timedelta(days=200), 'VIGENTE'),
                (conductores_creados[0], 'PERMISO', ahora + timedelta(days=180), 'VIGENTE'),
                # Conductor 2: Revisión técnica VENCIDA (cumple requisito explícito)
                (conductores_creados[1], 'LICENCIA', ahora + timedelta(days=180), 'VIGENTE'),
                (conductores_creados[1], 'REVISION_TECNICA', ahora - timedelta(days=20), 'VENCIDO'),
                (conductores_creados[1], 'SEGURO', ahora + timedelta(days=25), 'POR_VENCER'),
                (conductores_creados[1], 'PERMISO', ahora + timedelta(days=150), 'VIGENTE'),
                # Conductor 3:
                (conductores_creados[2], 'LICENCIA', ahora + timedelta(days=240), 'VIGENTE'),
                (conductores_creados[2], 'REVISION_TECNICA', ahora + timedelta(days=90), 'VIGENTE'),
            ]

            for cond_obj, tipo_doc, fecha_venc, estado_doc in doc_specs:
                Documento(
                    conductor_id=str(cond_obj.id),
                    tipo=tipo_doc,
                    vencimiento=fecha_venc,
                    estado=estado_doc,
                ).save()
            self.stdout.write(self.style.SUCCESS("[OK] Documentos creados (incluyendo documento VENCIDO para conductor 2)."))
        else:
            self.stdout.write("[INFO] Documentos ya existen, omitiendo creación.")

        # -------------------------------------------------------------
        # 6. 10 Viajes finalizados con Pagos
        # -------------------------------------------------------------
        if Viaje.objects.count() == 0:
            rutas_viajes = [
                ("Metro Dorsal", -33.3985, -70.6482, "Metro Manuel Montt", -33.4298, -70.6178, 1000, 0, 0),
                ("Av. Recoleta 2400", -33.4095, -70.6441, "Plaza Baquedano", -33.4372, -70.6346, 1000, 1, 1),
                ("Plaza de Maipú", -33.5108, -70.7573, "Metro Las Rejas", -33.4542, -70.7071, 1200, 2, 2),
                ("Av. Pajaritos 3000", -33.4912, -70.7420, "Metro Los Héroes", -33.4475, -70.6601, 1200, 3, 3),
                ("Bellavista de La Florida", -33.5222, -70.5982, "Metro Macul", -33.4975, -70.5971, 1100, 4, 4),
                ("Metro Dorsal", -33.3985, -70.6482, "Clínica Indisa Providencia", -33.4255, -70.6189, 1000, 0, 0),
                ("Metro Pedrero", -33.5078, -70.6095, "Rotonda Rodrigo de Araya", -33.4789, -70.5982, 1100, 5, 5),
                ("Metro Santiago Bueras", -33.5042, -70.7525, "Metro Los Héroes", -33.4475, -70.6601, 1200, 2, 2),
                ("Av. Recoleta 1200", -33.4215, -70.6455, "Metro Manuel Montt", -33.4298, -70.6178, 1000, 1, 1),
                ("Av. La Florida 8500", -33.5312, -70.5891, "Metro Macul", -33.4975, -70.5971, 1100, 4, 4),
            ]

            metodos_pago = ['EFECTIVO', 'RUTPAY', 'SIMULADO', 'EFECTIVO', 'RUTPAY', 'SIMULADO', 'EFECTIVO', 'RUTPAY', 'EFECTIVO', 'SIMULADO']

            for i, r in enumerate(rutas_viajes):
                orig_nom, o_lat, o_lng, dest_nom, d_lat, d_lng, tarifa, cond_idx, movil_idx = r
                dias_atras = 10 - i
                inicio_viaje = ahora - timedelta(days=dias_atras, hours=2)
                fin_viaje = inicio_viaje + timedelta(minutes=25)

                cond_obj = conductores_creados[cond_idx]
                movil_obj = moviles_creados[movil_idx]

                viaje = Viaje(
                    pasajero_id=str(pasajero.id),
                    conductor_id=str(cond_obj.id),
                    movil_id=str(movil_obj.id),
                    origen=UbicacionEmbedded(nombre=orig_nom, lat=o_lat, lng=o_lng),
                    destino=UbicacionEmbedded(nombre=dest_nom, lat=d_lat, lng=d_lng),
                    estado='FINALIZADO',
                    tarifa=tarifa,
                    inicio=inicio_viaje,
                    fin=fin_viaje,
                )
                viaje.save()

                pago = Pago(
                    usuario_id=str(pasajero.id),
                    viaje_id=str(viaje.id),
                    monto=tarifa,
                    metodo=metodos_pago[i],
                    estado='COMPLETADO',
                    creado_en=fin_viaje,
                )
                pago.save()

            self.stdout.write(self.style.SUCCESS("[OK] 10 Viajes finalizados con sus respectivos Pagos registrados."))
        else:
            self.stdout.write("[INFO] Viajes ya existen, omitiendo creación.")

        # -------------------------------------------------------------
        # 7. 2 Cuotas pendientes
        # -------------------------------------------------------------
        if Cuota.objects(estado='PENDIENTE').count() == 0:
            Cuota(
                conductor_id=str(conductores_creados[1].id),
                periodo='2026-10',
                monto=25000,
                estado='PENDIENTE',
                vencimiento=ahora + timedelta(days=10),
            ).save()

            Cuota(
                conductor_id=str(conductores_creados[3].id),
                periodo='2026-10',
                monto=25000,
                estado='PENDIENTE',
                vencimiento=ahora + timedelta(days=10),
            ).save()
            self.stdout.write(self.style.SUCCESS("[OK] 2 Cuotas pendientes registradas para conductores 2 y 4."))
        else:
            self.stdout.write("[INFO] Cuotas pendientes ya existen, omitiendo creación.")

        # -------------------------------------------------------------
        # 8. 1 Incidente
        # -------------------------------------------------------------
        if Incidente.objects.count() == 0:
            Incidente(
                tipo='MECANICO',
                descripcion='Pinchazo de neumático delantero derecho en Av. Providencia 1400. Requiere asistencia en ruta.',
                usuario_id=str(conductores_creados[0].usuario_id),
                estado='PENDIENTE',
                creado_en=ahora - timedelta(hours=3),
            ).save()
            self.stdout.write(self.style.SUCCESS("[OK] 1 Incidente de prueba registrado."))
        else:
            self.stdout.write("[INFO] Incidentes ya existen, omitiendo creación.")

        self.stdout.write(self.style.SUCCESS("=== Seed completado exitosamente ==="))
