"""
Comando de Django para normalizar y sanitizar registros existentes en la base de datos MongoDB.
Convierte todas las patentes a formato unificado (XX-XX-XX),
los nombres a formato de Nombre Propio (Title Case) y los RUTs a formato oficial.
"""
from django.core.management.base import BaseCommand
from apps.usuarios.documents import Usuario
from apps.conductores.documents import Movil, Linea, Conductor
from apps.common.sanitizers import (
    sanitizar_patente,
    sanitizar_nombre,
    sanitizar_rut,
    sanitizar_telefono,
)


class Command(BaseCommand):
    help = "Normaliza y sanitiza patentes, nombres y RUTs de la base de datos."

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("=== Iniciando Sanitización de Base de Datos ==="))

        # 1. Normalizar Móviles (Patentes)
        moviles = Movil.objects.all()
        actualizados_moviles = 0
        for movil in moviles:
            nueva_patente = sanitizar_patente(movil.patente)
            modificado = False
            if movil.patente != nueva_patente:
                self.stdout.write(f"Móvil {movil.id}: Patente '{movil.patente}' -> '{nueva_patente}'")
                movil.patente = nueva_patente
                modificado = True
            if movil.marca:
                marca_norm = str(movil.marca).strip().title()
                if movil.marca != marca_norm:
                    movil.marca = marca_norm
                    modificado = True
            if movil.modelo:
                modelo_norm = str(movil.modelo).strip().title()
                if movil.modelo != modelo_norm:
                    movil.modelo = modelo_norm
                    modificado = True
            if modificado:
                movil.save()
                actualizados_moviles += 1
        self.stdout.write(self.style.SUCCESS(f"[OK] Móviles revisados: {len(moviles)}, actualizados: {actualizados_moviles}"))

        # 2. Normalizar Usuarios (Nombres, Apellidos, RUTs, Teléfonos)
        usuarios = Usuario.objects.all()
        actualizados_usuarios = 0
        for usuario in usuarios:
            modificado = False
            nuevo_nombre = sanitizar_nombre(usuario.nombre)
            nuevo_apellido = sanitizar_nombre(usuario.apellido)
            nuevo_rut = sanitizar_rut(usuario.rut)
            nuevo_fono = sanitizar_telefono(usuario.telefono) if usuario.telefono else ''

            if usuario.nombre != nuevo_nombre:
                usuario.nombre = nuevo_nombre
                modificado = True
            if usuario.apellido != nuevo_apellido:
                usuario.apellido = nuevo_apellido
                modificado = True
            if usuario.rut != nuevo_rut:
                usuario.rut = nuevo_rut
                modificado = True
            if usuario.telefono != nuevo_fono:
                usuario.telefono = nuevo_fono
                modificado = True

            if modificado:
                usuario.save()
                actualizados_usuarios += 1
        self.stdout.write(self.style.SUCCESS(f"[OK] Usuarios revisados: {len(usuarios)}, actualizados: {actualizados_usuarios}"))

        # 3. Normalizar Líneas
        lineas = Linea.objects.all()
        actualizados_lineas = 0
        for linea in lineas:
            modificado = False
            if linea.nombre:
                nombre_norm = sanitizar_nombre(linea.nombre)
                if linea.nombre != nombre_norm:
                    linea.nombre = nombre_norm
                    modificado = True
            if linea.responsable:
                resp_norm = sanitizar_nombre(linea.responsable)
                if linea.responsable != resp_norm:
                    linea.responsable = resp_norm
                    modificado = True
            if modificado:
                linea.save()
                actualizados_lineas += 1
        self.stdout.write(self.style.SUCCESS(f"[OK] Líneas revisadas: {len(lineas)}, actualizadas: {actualizados_lineas}"))

        self.stdout.write(self.style.SUCCESS("=== Sanitización completada con éxito ==="))
