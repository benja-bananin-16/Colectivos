package cl.conatacoch.colectivos.model

import java.io.Serializable

data class Colectivo(
    val id: String,
    val linea: String,
    val destino: String,
    var etaMinutos: Int,
    var asientosDisponibles: Int,
    val maleteroDisponible: Boolean,
    val tarifa: Int,
    val puntoRutaX: Float,
    val puntoRutaY: Float
) : Serializable

object ColectivoRepository {
    fun datosDeEjemplo(): MutableList<Colectivo> = mutableListOf(
        Colectivo("1", "Línea 105", "Circunvalación Sta. Teresa (Melipilla)", 3, 3, true, 1000, 0.35f, 0.52f),
        Colectivo("2", "Línea 1", "Vitacura / Tabancura", 6, 2, false, 1200, 0.52f, 0.38f),
        Colectivo("3", "María Pinto", "Terminal San Borja (Est. Central)", 8, 4, true, 1500, 0.65f, 0.25f),
        Colectivo("4", "Línea 105", "Av. Manso (Melipilla)", 12, 1, true, 1000, 0.30f, 0.60f),
        Colectivo("5", "Línea 1", "Puente La Paz (Santiago)", 15, 3, false, 1200, 0.48f, 0.42f)
    )
}
