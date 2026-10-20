package cl.conatacoch.colectivos.pasajero

import android.content.Context
import android.util.AttributeSet
import org.osmdroid.config.Configuration
import org.osmdroid.tileprovider.tilesource.TileSourceFactory
import org.osmdroid.util.GeoPoint
import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.Marker
import cl.conatacoch.colectivos.model.Colectivo

class RouteMapView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null
) : MapView(context, attrs) {

    private val markers = mutableListOf<Marker>()

    init {
        // Política de uso de OpenStreetMap: configurar userAgentValue antes de usar el mapa
        Configuration.getInstance().userAgentValue = context.packageName

        setTileSource(TileSourceFactory.MAPNIK)
        setMultiTouchControls(true)
        controller.setZoom(14.0)

        // Coordenadas de Santiago de Chile
        val centroSantiago = GeoPoint(-33.4489, -70.6693)
        controller.setCenter(centroSantiago)
    }

    fun setColectivos(lista: List<Colectivo>) {
        // Limpiar marcadores existentes
        markers.forEach { overlays.remove(it) }
        markers.clear()

        val baseLat = -33.4489
        val baseLon = -70.6693

        lista.forEach { c ->
            val marker = Marker(this)
            val lat = baseLat + (c.puntoRutaY - 0.5) * 0.04
            val lon = baseLon + (c.puntoRutaX - 0.5) * 0.04
            marker.position = GeoPoint(lat, lon)
            marker.title = "${c.linea} · ${c.destino}"
            marker.snippet = "${c.asientosDisponibles} asientos disponibles | Tarifa: $${c.tarifa}"
            marker.setAnchor(Marker.ANCHOR_CENTER, Marker.ANCHOR_BOTTOM)
            overlays.add(marker)
            markers.add(marker)
        }

        invalidate()
    }

    fun centrarUbicacion() {
        controller.animateTo(GeoPoint(-33.4489, -70.6693))
    }
}
