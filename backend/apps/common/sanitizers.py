"""
Módulo de utilidades para validación y sanitización de datos.
Garantiza que toda la plataforma (BD, API, Administrador y Móvil) maneje
los mismos estándares y formatos unificados para patentes, nombres y RUT.
"""
import re


def sanitizar_nombre(valor: str) -> str:
    """
    Sanitiza nombres y apellidos:
    - Elimina espacios al inicio y final.
    - Reduce espacios múltiples intermedios a uno solo.
    - Convierte a formato Nombre Propio (Title Case).
    """
    if not valor:
        return ''
    palabras = str(valor).strip().split()
    return ' '.join(palabras).title()


def limpiar_patente(patente: str) -> str:
    """Retorna los caracteres alfanuméricos en mayúsculas."""
    if not patente:
        return ''
    return re.sub(r'[^A-Za-z0-9]', '', str(patente)).upper()


def validar_patente(patente: str) -> bool:
    """
    Valida si la patente cumple con el estándar de vehículos chileno:
    - Nueva (desde 2007): 4 letras + 2 dígitos (ej: BBCL11)
    - Antigua (hasta 2007): 2 letras + 4 dígitos (ej: AA1234)
    Total: 6 caracteres alfanuméricos.
    """
    limpia = limpiar_patente(patente)
    if len(limpia) != 6:
        return False
    
    es_nueva = bool(re.match(r'^[A-Z]{4}[0-9]{2}$', limpia))
    es_antigua = bool(re.match(r'^[A-Z]{2}[0-9]{4}$', limpia))
    return es_nueva or es_antigua


def sanitizar_patente(patente: str) -> str:
    """
    Sanitiza y estandariza la patente al formato unificado con guion cada dos caracteres:
    Ejemplos:
      'bbcl11'   -> 'BB-CL-11'
      'BBCL-11'  -> 'BB-CL-11'
      'cf-rd-88' -> 'CF-RD-88'
      'AA1234'   -> 'AA-12-34'
    """
    limpia = limpiar_patente(patente)
    if len(limpia) == 6:
        return f"{limpia[:2]}-{limpia[2:4]}-{limpia[4:]}"
    return limpia


def limpiar_rut(rut: str) -> str:
    """Retorna solo dígitos y dígito verificador en mayúscula."""
    if not rut:
        return ''
    return re.sub(r'[^0-9kK]', '', str(rut)).upper()


def validar_formato_rut(rut: str) -> bool:
    """Valida que el RUT tenga longitud mínima y estructura numérica + DV."""
    limpio = limpiar_rut(rut)
    if len(limpio) < 2 or len(limpio) > 9:
        return False
    cuerpo = limpio[:-1]
    dv = limpio[-1]
    return cuerpo.isdigit() and (dv.isdigit() or dv == 'K')


def sanitizar_rut(rut: str) -> str:
    """
    Sanitiza y estandariza el RUT al formato oficial chileno: XX.XXX.XXX-X.
    Ejemplo: '111111111' -> '11.111.111-1'
    """
    limpio = limpiar_rut(rut)
    if len(limpio) < 2:
        return str(rut).strip().upper()
    cuerpo = limpio[:-1]
    dv = limpio[-1]
    if cuerpo.isdigit():
        cuerpo_con_puntos = f"{int(cuerpo):,}".replace(',', '.')
        return f"{cuerpo_con_puntos}-{dv}"
    return f"{cuerpo}-{dv}"


def sanitizar_telefono(telefono: str) -> str:
    """Sanitiza números de teléfono al estándar internacional chileno (+569XXXXXXXX)."""
    if not telefono:
        return ''
    digitos = re.sub(r'[^0-9]', '', str(telefono))
    if len(digitos) == 9 and digitos.startswith('9'):
        return f"+56{digitos}"
    if len(digitos) == 11 and digitos.startswith('569'):
        return f"+{digitos}"
    return str(telefono).strip()
