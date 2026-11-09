package cl.conatacoch.colectivos.conductor

import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.widget.LinearLayout
import android.widget.TextView
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
import cl.conatacoch.colectivos.data.SessionStore

class RouteActivity : AppCompatActivity() {

    private lateinit var mapView: MapView
    private lateinit var sessionStore: SessionStore

    data class ParadaInfo(val orden: Int, val calle: String, val detalle: String)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Configuration.getInstance().userAgentValue = packageName

        enableEdgeToEdge()
        setContentView(R.layout.activity_route)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(android.R.id.content)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        sessionStore = SessionStore(this)

        mapView = findViewById(R.id.map_view)
        mapView.setTileSource(TileSourceFactory.MAPNIK)
        mapView.setMultiTouchControls(true)

        setupRutaSeleccionada()
        setupBottomNav()
        setupPanicButton()
    }

    private fun setupRutaSeleccionada() {
        val rutaId = sessionStore.getSelectedRouteId() ?: "105"
        val nroLinea = sessionStore.getSelectedRouteNroLinea() ?: "105"

        val tvRouteLabel = findViewById<TextView>(R.id.tv_route_label)
        val tvRouteName = findViewById<TextView>(R.id.tv_route_name)
        val tvBadgeMapa = findViewById<TextView>(R.id.tv_badge_mapa)
        val llParadasDinamicas = findViewById<LinearLayout>(R.id.ll_paradas_dinamicas)

        val mapController = mapView.controller
        mapController.setZoom(14.5)

        val paradas: List<ParadaInfo>
        val centroPoint: GeoPoint
        val nombreRuta: String
        val subtituloRuta: String

        when {
            rutaId.contains("1") && !rutaId.contains("105") -> {
                // Línea 1 · TRATCEN (Santiago ↔ Vitacura)
                centroPoint = GeoPoint(-33.4350, -70.6500)
                nombreRuta = "Línea 1 · TRATCEN S.A."
                subtituloRuta = "Santiago → Vitacura (Itinerario T)"
                tvBadgeMapa?.text = "LÍNEA 1 · VIVO"
                paradas = listOf(
                    ParadaInfo(1, "Av. Cardenal José María Caro", "Santiago · Inicio de trazado"),
                    ParadaInfo(2, "Puente La Paz", "Santiago · Paradero conexión"),
                    ParadaInfo(3, "Av. Santa María", "Recoleta · Zona de tránsito"),
                    ParadaInfo(4, "Av. Vitacura", "Vitacura · Paradero terminal"),
                    ParadaInfo(5, "Tabancura / Kennedy", "Vitacura · Fin de recorrido")
                )
            }
            rutaId.contains("MP") || rutaId.contains("500007") -> {
                // Servicio María Pinto
                centroPoint = GeoPoint(-33.5100, -71.1200)
                nombreRuta = "Recorrido María Pinto"
                subtituloRuta = "María Pinto → San Borja (Estación Central)"
                tvBadgeMapa?.text = "MARÍA PINTO · VIVO"
                paradas = listOf(
                    ParadaInfo(1, "Plaza de Armas María Pinto", "María Pinto · Inicio"),
                    ParadaInfo(2, "Ruta G-74 F (Cruce Ibacache)", "María Pinto · Parada intermedia"),
                    ParadaInfo(3, "Autopista del Sol / Pajaritos", "Maipú · Conexión intermodal"),
                    ParadaInfo(4, "Terminal San Borja", "Estación Central · Fin de recorrido")
                )
            }
            else -> {
                // Por defecto: Línea 105 · AGRETACOMBO (Melipilla)
                centroPoint = GeoPoint(-33.6865, -71.2161)
                nombreRuta = "Línea 105 · AGRETACOMBO"
                subtituloRuta = "Av. Manso → Circunvalación Santa Teresa (Melipilla)"
                tvBadgeMapa?.text = "LÍNEA 105 · VIVO"
                paradas = listOf(
                    ParadaInfo(1, "Av. Manso", "Melipilla · Inicio recorrido"),
                    ParadaInfo(2, "Silva Chávez", "Melipilla · Centro comercial"),
                    ParadaInfo(3, "Av. Vicuña Mackenna", "Melipilla · Eje principal"),
                    ParadaInfo(4, "Av. José Massoud", "Melipilla · Zona residencial"),
                    ParadaInfo(5, "Ruta G-74 F (Puertas Blancas)", "Melipilla · Sector rural"),
                    ParadaInfo(6, "Circunvalación Santa Teresa", "Melipilla · Terminal de retorno")
                )
            }
        }

        tvRouteLabel?.text = nombreRuta
        tvRouteName?.text = subtituloRuta
        mapController.setCenter(centroPoint)

        // Limpiar overlays anteriores y agregar nuevos
        mapView.overlays.clear()

        // Marcador del Móvil
        val markerConductor = Marker(mapView).apply {
            position = centroPoint
            setAnchor(Marker.ANCHOR_CENTER, Marker.ANCHOR_BOTTOM)
            title = "Tu Móvil · En línea"
            snippet = "$nombreRuta · Patente BBCL-11"
        }
        mapView.overlays.add(markerConductor)

        // Marcador Paradero Próximo
        val markerParada = Marker(mapView).apply {
            position = GeoPoint(centroPoint.latitude + 0.005, centroPoint.longitude + 0.005)
            setAnchor(Marker.ANCHOR_CENTER, Marker.ANCHOR_BOTTOM)
            title = "Próxima parada: ${paradas.firstOrNull()?.calle ?: "Paradero"}"
            snippet = "3 pasajeros esperando"
        }
        mapView.overlays.add(markerParada)
        mapView.invalidate()

        // Renderizar paradas dinámicas
        llParadasDinamicas?.removeAllViews()
        paradas.forEach { parada ->
            val row = LinearLayout(this).apply {
                orientation = LinearLayout.HORIZONTAL
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply { topMargin = 16 }
                gravity = android.view.Gravity.CENTER_VERTICAL
            }

            val badgeNumero = TextView(this).apply {
                layoutParams = LinearLayout.LayoutParams(90, 90)
                if (parada.orden == 1) {
                    setBackgroundResource(R.drawable.bg_circle_yellow)
                    setTextColor(Color.WHITE)
                } else {
                    setBackgroundResource(R.drawable.bg_circle_gray)
                    setTextColor(Color.parseColor("#CCCCCC"))
                }
                text = parada.orden.toString()
                gravity = android.view.Gravity.CENTER
                paint.isFakeBoldText = true
            }

            val infoLayout = LinearLayout(this).apply {
                orientation = LinearLayout.VERTICAL
                layoutParams = LinearLayout.LayoutParams(
                    0,
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    1.0f
                ).apply { marginStart = 24 }
            }

            val tvCalle = TextView(this).apply {
                text = parada.calle
                setTextColor(Color.WHITE)
                textSize = 15f
                paint.isFakeBoldText = true
            }

            val tvDetalle = TextView(this).apply {
                text = parada.detalle
                setTextColor(Color.parseColor("#9E9E9E"))
                textSize = 12f
            }

            infoLayout.addView(tvCalle)
            infoLayout.addView(tvDetalle)

            row.addView(badgeNumero)
            row.addView(infoLayout)

            llParadasDinamicas?.addView(row)
        }
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
