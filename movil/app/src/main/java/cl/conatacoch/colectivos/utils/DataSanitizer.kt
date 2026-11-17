package cl.conatacoch.colectivos.utils

import java.util.Locale

object DataSanitizer {

    /**
     * Estandariza la patente al formato chileno unificado con guion cada dos caracteres (XX-XX-XX).
     * Ejemplo: 'BBCL11' o 'bb-cl-11' -> 'BB-CL-11'
     */
    fun formatPatente(raw: String): String {
        val limpia = raw.replace(Regex("[^A-Za-z0-9]"), "").uppercase(Locale.ROOT)
        return when {
            limpia.length <= 2 -> limpia
            limpia.length <= 4 -> "${limpia.substring(0, 2)}-${limpia.substring(2)}"
            limpia.length <= 6 -> "${limpia.substring(0, 2)}-${limpia.substring(2, 4)}-${limpia.substring(4)}"
            else -> "${limpia.substring(0, 2)}-${limpia.substring(2, 4)}-${limpia.substring(4, 6)}"
        }
    }

    /**
     * Valida si cumple con el patrón oficial chileno (4 letras + 2 dígitos o 2 letras + 4 dígitos).
     */
    fun isValidPatente(raw: String): Boolean {
        val limpia = raw.replace(Regex("[^A-Za-z0-9]"), "").uppercase(Locale.ROOT)
        if (limpia.length != 6) return false
        val esNueva = Regex("^[A-Z]{4}[0-9]{2}$").matches(limpia)
        val esAntigua = Regex("^[A-Z]{2}[0-9]{4}$").matches(limpia)
        return esNueva || esAntigua
    }

    /**
     * Normaliza un nombre a formato Nombre Propio (Title Case).
     */
    fun formatNombre(raw: String): String {
        if (raw.isBlank()) return ""
        return raw.trim()
            .split(Regex("\\s+"))
            .joinToString(" ") { word ->
                word.lowercase(Locale.ROOT).replaceFirstChar { it.uppercase(Locale.ROOT) }
            }
    }

    /**
     * Normaliza el RUT chileno a formato estándar con puntos y guion: XX.XXX.XXX-X.
     */
    fun formatRut(raw: String): String {
        val limpia = raw.replace(Regex("[^0-9kK]"), "").uppercase(Locale.ROOT)
        if (limpia.length < 2) return raw.trim().uppercase(Locale.ROOT)
        val cuerpo = limpia.dropLast(1)
        val dv = limpia.takeLast(1)
        val cuerpoFormateado = try {
            String.format(Locale("es", "CL"), "%,d", cuerpo.toLong()).replace(',', '.')
        } catch (e: Exception) {
            cuerpo
        }
        return "$cuerpoFormateado-$dv"
    }
}
