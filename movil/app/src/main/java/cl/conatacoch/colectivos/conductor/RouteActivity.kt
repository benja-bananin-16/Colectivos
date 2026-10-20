package cl.conatacoch.colectivos.conductor

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.card.MaterialCardView
import org.osmdroid.config.Configuration
import org.osmdroid.tileprovider.tilesource.TileSourceFactory
import org.osmdroid.util.GeoPoint
import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.Marker
import cl.conatacoch.colectivos.R

class RouteActivity : AppCompatActivity() {

    private lateinit var mapView: MapView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Política de uso de OpenStreetMap: configurar userAgent con el packageName
        Configuration.getInstance().userAgentValue = packageName

        enableEdgeToEdge()
        setContentView(R.layout.activity_route)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(android.R.id.content)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // Configuración de mapa OpenStreetMap con osmdroid (sin API key)
        mapView = findViewById(R.id.map_view)
        mapView.setTileSource(TileSourceFactory.MAPNIK)
        mapView.setMultiTouchControls(true)

        val mapController = mapView.controller
        mapController.setZoom(15.0)

        // Coordenadas de Santiago Centro
        val santiagoCentro = GeoPoint(-33.4489, -70.6693)
        mapController.setCenter(santiagoCentro)

        // Marcador 1: Móvil del conductor y su posición
        val markerConductor = Marker(mapView)
        markerConductor.position = santiagoCentro
        markerConductor.setAnchor(Marker.ANCHOR_CENTER, Marker.ANCHOR_BOTTOM)
        markerConductor.title = "Móvil 01 — Conductor en línea"
        markerConductor.snippet = "Línea 12 · Patente BBCL-11"
        mapView.overlays.add(markerConductor)

        // Marcador 2: Próxima parada sugerida
        val markerParada = Marker(mapView)
        markerParada.position = GeoPoint(-33.4420, -70.6550)
        markerParada.setAnchor(Marker.ANCHOR_CENTER, Marker.ANCHOR_BOTTOM)
        markerParada.title = "Parada siguiente: Estación Central"
        markerParada.snippet = "2 pasajeros en espera"
        mapView.overlays.add(markerParada)

        mapView.invalidate()

        setupBottomNav()
        setupPanicButton()
    }

    private fun setupBottomNav() {
        val bottomNav = findViewById<BottomNavigationView>(R.id.bottom_nav)
        bottomNav.selectedItemId = R.id.nav_route

        bottomNav.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_home -> {
                    startActivity(Intent(this, HomeActivity::class.java))
                    overridePendingTransition(0, 0)
                    finish()
                    true
                }
                R.id.nav_route -> true
                R.id.nav_payments -> {
                    startActivity(Intent(this, PaymentsActivity::class.java))
                    overridePendingTransition(0, 0)
                    finish()
                    true
                }
                R.id.nav_profile -> {
                    startActivity(Intent(this, ProfileActivity::class.java))
                    overridePendingTransition(0, 0)
                    finish()
                    true
                }
                else -> {
                    Toast.makeText(this, "Función disponible próximamente", Toast.LENGTH_SHORT).show()
                    false
                }
            }
        }
    }

    private fun setupPanicButton() {
        val btnPanic = findViewById<MaterialCardView>(R.id.btn_panic)
        btnPanic.setOnLongClickListener {
            Toast.makeText(this, "¡ALERTA DE PÁNICO ENVIADA A LA CENTRAL!", Toast.LENGTH_LONG).show()
            true
        }
        btnPanic.setOnClickListener {
            Toast.makeText(this, "Mantén presionado para enviar alerta de pánico", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onResume() {
        super.onResume()
        mapView.onResume()
    }

    override fun onPause() {
        super.onPause()
        mapView.onPause()
    }
}
