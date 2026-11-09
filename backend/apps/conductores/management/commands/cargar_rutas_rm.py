import os
import json
from pathlib import Path
from django.core.management.base import BaseCommand
from apps.conductores.documents import Linea
from apps.finanzas.documents import Tarifa
from datetime import datetime, timezone


class Command(BaseCommand):
    help = "Carga las 3 rutas de la Región Metropolitana desde rutas_rm_3.json a MongoDB"

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("=== Iniciando carga de rutas_rm_3.json ==="))

        # Buscar el archivo rutas_rm_3.json en la raíz del backend o raíz del repo
        backend_dir = Path(__file__).resolve().parent.parent.parent.parent
        posibles_rutas = [
            backend_dir / 'rutas_rm_3.json',
            backend_dir.parent / 'rutas_rm_3.json',
            Path('rutas_rm_3.json'),
            Path('backend/rutas_rm_3.json'),
        ]

        json_path = None
        for p in posibles_rutas:
            if p.exists():
                json_path = p
                break

        if not json_path:
            self.stdout.write(self.style.ERROR("[ERROR] No se encontró rutas_rm_3.json"))
            return

        self.stdout.write(f"Leyendo archivo: {json_path}")
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        recorridos = data.get('regiones', {}).get('13', {}).get('recorridos', {})
        self.stdout.write(f"Total de recorridos encontrados: {len(recorridos)}")

        ahora = datetime.now(timezone.utc)
        tarifas_sugeridas = [1000, 1200, 1500]

        idx = 0
        for cod_recorrido, r in recorridos.items():
            nro = str(r.get('nro_linea') or '').strip()
            fantasia = (r.get('nombre_fantasia') or '').strip()
            nom_rec = (r.get('nombre_recorrido') or '').strip()
            origen_dict = r.get('origen') or {}
            destino_dict = r.get('destino') or {}

            nom_origen = origen_dict.get('nombre', 'Origen')
            nom_destino = destino_dict.get('nombre', 'Destino')

            if nro and fantasia:
                nombre = f"Línea {nro} - {fantasia}"
            elif nro:
                nombre = f"Línea {nro} ({nom_origen} -> {nom_destino})"
            elif fantasia:
                nombre = f"{fantasia} - {nom_rec}"
            else:
                nombre = f"Recorrido {nom_rec} ({nom_origen} -> {nom_destino})"

            tarifa_val = tarifas_sugeridas[idx % len(tarifas_sugeridas)]
            idx += 1

            linea = Linea.objects(codigo_recorrido=cod_recorrido).first()
            if not linea:
                linea = Linea.objects(nombre=nombre).first()

            if not linea:
                linea = Linea(
                    codigo_recorrido=cod_recorrido,
                    folio=r.get('folio'),
                    tipo_servicio=r.get('tipo_servicio', ''),
                    nro_linea=nro,
                    flota_vigente=r.get('flota_vigente', 0),
                    responsable=r.get('responsable', ''),
                    nombre_fantasia=fantasia,
                    tipo_persona=r.get('tipo_persona', ''),
                    nombre_recorrido=nom_rec,
                    tipo_trazado=r.get('tipo_trazado', ''),
                    nombre=nombre,
                    origen=origen_dict,
                    destino=destino_dict,
                    trazado=r.get('trazado', {}),
                    tarifa=tarifa_val,
                    activa=True,
                )
                linea.save()
                Tarifa(linea_id=str(linea.id), valor=tarifa_val, vigente_desde=ahora).save()
                self.stdout.write(self.style.SUCCESS(f"[CREADA] {linea.nombre} (ID: {linea.id})"))
            else:
                linea.codigo_recorrido = cod_recorrido
                linea.folio = r.get('folio')
                linea.tipo_servicio = r.get('tipo_servicio', '')
                linea.nro_linea = nro
                linea.flota_vigente = r.get('flota_vigente', 0)
                linea.responsable = r.get('responsable', '')
                linea.nombre_fantasia = fantasia
                linea.tipo_persona = r.get('tipo_persona', '')
                linea.nombre_recorrido = nom_rec
                linea.tipo_trazado = r.get('tipo_trazado', '')
                linea.nombre = nombre
                linea.origen = origen_dict
                linea.destino = destino_dict
                linea.trazado = r.get('trazado', {})
                linea.save()
                safe_name = linea.nombre.encode('ascii', 'replace').decode('ascii')
                self.stdout.write(self.style.SUCCESS(f"[ACTUALIZADA] {safe_name} (ID: {linea.id})"))

        self.stdout.write(self.style.NOTICE("=== Carga completada exitosamente ==="))
