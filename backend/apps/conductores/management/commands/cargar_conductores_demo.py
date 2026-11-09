import sys
from datetime import datetime, timezone, timedelta
from django.core.management.base import BaseCommand
from apps.usuarios.documents import Usuario
from apps.conductores.documents import Conductor, Movil, Linea


class Command(BaseCommand):
    help = 'Carga los 3 conductores oficiales inventados para la demo con sus vehiculos, deudas y rutas asignadas'

    def handle(self, *args, **options):
        # 3 Conductores solicitados
        conductores_data = [
            {
                'rut': '14.832.195-3',
                'nombre': 'Rodrigo Andrés',
                'apellido': 'Venegas Soto',
                'email': 'rodrigo.venegas@conatacoch.cl',
                'telefono': '+56984512290',
                'patente': 'BBCL-11',
                'marca': 'Nissan',
                'modelo': 'Versa Sense',
                'anio': 2022,
                'nro_interno': '105-01',
                'ruta_keyword': '105',
                'deuda': 0
            },
            {
                'rut': '16.294.508-K',
                'nombre': 'Carlos Mauricio',
                'apellido': 'Tapia Castillo',
                'email': 'carlos.tapia@conatacoch.cl',
                'telefono': '+56991234872',
                'patente': 'CF-RD-88',
                'marca': 'Toyota',
                'modelo': 'Yaris Sedan',
                'anio': 2020,
                'nro_interno': '01-08',
                'ruta_keyword': 'TRATCEN',
                'deuda': 105000
            },
            {
                'rut': '18.105.772-4',
                'nombre': 'Alejandra Mariela',
                'apellido': 'Fuentes Vergara',
                'email': 'alejandra.fuentes@conatacoch.cl',
                'telefono': '+56973196604',
                'patente': 'KJ-TP-42',
                'marca': 'Chevrolet',
                'modelo': 'Sail LT',
                'anio': 2023,
                'nro_interno': 'MP-03',
                'ruta_keyword': 'Pinto',
                'deuda': 35000
            }
        ]

        for item in conductores_data:
            rut = item['rut']
            usuario = Usuario.objects(rut=rut).first()
            if not usuario:
                usuario = Usuario(
                    rut=rut,
                    nombre=item['nombre'],
                    apellido=item['apellido'],
                    email=item['email'],
                    telefono=item['telefono'],
                    rol='CONDUCTOR',
                    activo=True
                )
                usuario.set_password('Conatacoch2026')
                usuario.save()
            else:
                usuario.nombre = item['nombre']
                usuario.apellido = item['apellido']
                usuario.set_password('Conatacoch2026')
                usuario.save()

            # Buscar línea para asociar
            linea = Linea.objects(nombre__icontains=item['ruta_keyword']).first()
            if not linea:
                linea = Linea.objects.first()

            # Conductor document
            conductor = Conductor.objects(usuario_id=str(usuario.id)).first()
            if not conductor:
                conductor = Conductor(
                    usuario_id=str(usuario.id),
                    licencia_profesional='A2-CHILE-2026',
                    vencimiento_licencia=datetime.now(timezone.utc) + timedelta(days=730),
                    estado='EN_LINEA',
                    calificacion_promedio=4.9
                )
                conductor.save()

            # Móvil
            movil = Movil.objects(patente=item['patente']).first()
            if not movil:
                movil = Movil(
                    numero_interno=item['nro_interno'],
                    patente=item['patente'],
                    conductor_id=str(conductor.id),
                    linea_id=str(linea.id) if linea else None,
                    marca=item['marca'],
                    modelo=item['modelo'],
                    anio=item['anio'],
                    capacidad=4,
                    estado='ACTIVO'
                )
                movil.save()
            else:
                movil.conductor_id = str(conductor.id)
                if linea:
                    movil.linea_id = str(linea.id)
                movil.save()

            sys.stdout.write(f"Conductor cargado: {usuario.nombre} {usuario.apellido} - Patente: {item['patente']} - Ruta: {linea.nombre if linea else 'N/A'}\n")

        self.stdout.write(self.style.SUCCESS("3 conductores demo creados con exito en backend."))
