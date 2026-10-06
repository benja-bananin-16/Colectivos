package com.example.pasajero.model

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
        Colectivo("1", "Línea 12", "Terminal La Reina", 2, 3, true, 750, 0.32f, 0.56f),
        Colectivo("2", "Línea 7", "Mall Plaza", 5, 1, false, 750, 0.5f, 0.35f),
        Colectivo("3", "Línea 3", "Estación Central", 9, 4, true, 700, 0.68f, 0.21f)
    )
}