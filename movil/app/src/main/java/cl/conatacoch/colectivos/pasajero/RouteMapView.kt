package cl.conatacoch.colectivos.pasajero

import android.content.Context
import android.util.AttributeSet
import org.osmdroid.config.Configuration
import org.osmdroid.tileprovider.tilesource.TileSourceFactory
import org.osmdroid.util.GeoPoint
import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.Marker
import org.osmdroid.views.overlay.mylocation.GpsMyLocationProvider
import org.osmdroid.views.overlay.mylocation.MyLocationNewOverlay
import cl.conatacoch.colectivos.model.Colectivo

class RouteMapView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null
) : MapView(context, attrs) {

    private val markers = mutableListOf<Marker>()
    private var markerUsuario: Marker? = null
    private var locationOverlay: MyLocationNewOverlay? = null

    init {
        // Política de uso de OpenStreetMap: configurar userAgentValue antes de usar el mapa
        Configuration.getInstance().userAgentValue = context.packageName

        setTileSource(TileSourceFactory.MAPNIK)
        setMultiTouchControls(true)
        controller.setZoom(14.5)

        // Coordenadas de Santiago de Chile por defecto
        val centroSantiago = GeoPoint(-33.4489, -70.6693)
        controller.setCenter(centroSantiago)

        setupLocationOverlay(context)
    }

    private fun setupLocationOverlay(context: Context) {
        try {
            val provider = GpsMyLocationProvider(context)
            locationOverlay = MyLocationNewOverlay(provider, this).apply {
                enableMyLocation()
            }
            overlays.add(locationOverlay)
        } catch (_: Exception) {
            // Si no hay permisos inmediatos se añade dinámicamente
        }
    }

    fun setColectivos(lista: List<Colectivo>) {
        // Limpiar marcadores existentes de colectivos (manteniendo el de usuario y overlay)
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

    fun centrarEnCoordenadas(lat: Double, lng: Double, zoom: Double = 16.0) {
        val destino = GeoPoint(lat, lng)
        controller.setZoom(zoom)
        controller.animateTo(destino)

        // Actualizar o crear marcador de usuario
        markerUsuario?.let { overlays.remove(it) }
        val nuevoMarker = Marker(this).apply {
            position = destino
            setAnchor(Marker.ANCHOR_CENTER, Marker.ANCHOR_BOTTOM)
            title = "Tu ubicación actual"
            snippet = "Estás aquí buscando colectivos"
        }
        markerUsuario = nuevoMarker
        overlays.add(nuevoMarker)
        invalidate()
    }

    fun obtenerUbicacionOverlay(): GeoPoint? {
        return locationOverlay?.myLocation
    }

    fun habilitarOverlay() {
        locationOverlay?.enableMyLocation()
    }

    fun centrarUbicacionDefecto() {
        centrarEnCoordenadas(-33.4489, -70.6693, 14.5)
    }
}
