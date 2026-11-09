package cl.conatacoch.colectivos.conductor

import android.app.AlertDialog
import android.content.Intent
import android.content.res.ColorStateList
import android.graphics.Color
import android.os.Bundle
import android.view.View
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.lifecycleScope
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.button.MaterialButton
import com.google.android.material.card.MaterialCardView
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import cl.conatacoch.colectivos.R
import cl.conatacoch.colectivos.data.ApiClient
import cl.conatacoch.colectivos.data.RutaResponse
import cl.conatacoch.colectivos.data.SeleccionarLineaRequest
import cl.conatacoch.colectivos.data.SessionStore

class HomeActivity : AppCompatActivity() {

    private var seats = 2
    private lateinit var sessionStore: SessionStore
    private var rutasDisponibles: List<RutaSimple> = listOf(
        RutaSimple("105", "Línea 105 · AGRETACOMBO (Melipilla)", "105", "13_20061_itinerario-1_principal"),
        RutaSimple("1", "Línea 1 · TRATCEN (Santiago ↔ Vitacura)", "1", "13_230001_t_principal"),
        RutaSimple("MP", "Recorrido María Pinto (María Pinto ↔ San Borja)", "MP", "13_500007_itinerario-1_principal")
    )

    data class RutaSimple(
        val id: String,
        val nombre: String,
        val nroLinea: String,
        val codigo: String
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_home)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(android.R.id.content)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        sessionStore = SessionStore(this)
        val nombreUsuario = sessionStore.getUserName()
        if (!nombreUsuario.isNullOrEmpty()) {
            findViewById<TextView>(R.id.tv_name)?.text = nombreUsuario
        }

        setupButtons()
        setupRutaActual()
        setupEstadoTurnoUI()
        cargarRutasDesdeBackend()
    }

    private fun setupEstadoTurnoUI() {
        val turnoActivo = sessionStore.isTurnoActivo()
        val estadoActual = sessionStore.getEstadoConductor()
        actualizarEstadoVisual(estadoActual, turnoActivo)
    }

    private fun actualizarEstadoVisual(estado: String, turnoActivo: Boolean) {
        val cardStatusBadge = findViewById<MaterialCardView>(R.id.card_status_badge)
        val dotStatusBadge = findViewById<View>(R.id.dot_status_badge)
        val tvStatusBadge = findViewById<TextView>(R.id.tv_status_badge)
        val borderTurno = findViewById<View>(R.id.border_turno)
        val tvTurnoTime = findViewById<TextView>(R.id.tv_turno_time)
        val tvTurnoPos = findViewById<TextView>(R.id.tv_turno_pos)
        val btnTurno = findViewById<MaterialButton>(R.id.btn_finalizar)

        val colorVerde = Color.parseColor("#00A859")
        val colorVerdeBg = Color.parseColor("#132E1D")
        val colorAmarillo = Color.parseColor("#10B981")
        val colorAmarilloBg = Color.parseColor("#132E1D")
        val colorGris = Color.parseColor("#94A39B")
        val colorGrisBg = Color.parseColor("#1A2920")
        val colorRojo = Color.parseColor("#FF4D3D")

        if (!turnoActivo || estado == "FUERA_SERVICIO") {
            // Estado: APAGADO / FUERA DE SERVICIO
            tvStatusBadge?.text = "Fuera de servicio"
            tvStatusBadge?.setTextColor(colorGris)
            dotStatusBadge?.backgroundTintList = ColorStateList.valueOf(colorGris)
            cardStatusBadge?.setCardBackgroundColor(colorGrisBg)
            cardStatusBadge?.strokeColor = colorGris

            borderTurno?.setBackgroundColor(colorGris)
            tvTurnoTime?.text = "Sin turno activo"
            tvTurnoPos?.text = "Presiona Iniciar para comenzar a recibir pasajeros"

            btnTurno?.text = "Iniciar"
            btnTurno?.backgroundTintList = ColorStateList.valueOf(colorVerde)
        } else if (estado == "EN_LINEA") {
            // Estado: EN LÍNEA (ACTIVO)
            tvStatusBadge?.text = "En línea"
            tvStatusBadge?.setTextColor(colorVerde)
            dotStatusBadge?.backgroundTintList = ColorStateList.valueOf(colorVerde)
            cardStatusBadge?.setCardBackgroundColor(colorVerdeBg)
            cardStatusBadge?.strokeColor = colorVerde

            borderTurno?.setBackgroundColor(colorVerde)
            val horaInicio = sessionStore.getTurnoInicio() ?: "08:00"
            tvTurnoTime?.text = "Activo desde $horaInicio • En recorrido"
            tvTurnoPos?.text = "Posición en la fila virtual: 1° lugar"

            btnTurno?.text = "Finalizar"
            btnTurno?.backgroundTintList = ColorStateList.valueOf(colorRojo)
        } else {
            // Estado: OCUPADO
            tvStatusBadge?.text = "Ocupado"
            tvStatusBadge?.setTextColor(colorAmarillo)
            dotStatusBadge?.backgroundTintList = ColorStateList.valueOf(colorAmarillo)
            cardStatusBadge?.setCardBackgroundColor(colorAmarilloBg)
            cardStatusBadge?.strokeColor = colorAmarillo

            borderTurno?.setBackgroundColor(colorAmarillo)
            tvTurnoTime?.text = "Vehículo completo · En ruta"
            tvTurnoPos?.text = "Fuera de fila temporalmente"

            btnTurno?.text = "Finalizar"
            btnTurno?.backgroundTintList = ColorStateList.valueOf(colorRojo)
        }
    }

    private fun iniciarTurno() {
        val horaActual = SimpleDateFormat("HH:mm", Locale.getDefault()).format(Date())
        sessionStore.setTurnoActivo(true)
        sessionStore.setTurnoInicio(horaActual)
        sessionStore.setEstadoConductor("EN_LINEA")
        actualizarEstadoVisual("EN_LINEA", true)

        val rutaActual = sessionStore.getSelectedRouteName() ?: "tu ruta"
        Toast.makeText(this, "¡Turno iniciado! Ya estás en línea en $rutaActual", Toast.LENGTH_SHORT).show()
    }

    private fun confirmarFinalizarTurno() {
        AlertDialog.Builder(this)
            .setTitle("Finalizar turno")
            .setMessage("¿Deseas finalizar tu jornada y quedar fuera de servicio?")
            .setPositiveButton("Finalizar") { _, _ ->
                sessionStore.setTurnoActivo(false)
                sessionStore.setEstadoConductor("FUERA_SERVICIO")
                sessionStore.setTurnoInicio(null)
                actualizarEstadoVisual("FUERA_SERVICIO", false)
                Toast.makeText(this, "Turno finalizado. Has quedado fuera de servicio.", Toast.LENGTH_SHORT).show()
            }
            .setNegativeButton("Cancelar", null)
            .show()
    }

    private fun setupRutaActual() {
        val tvNombreRuta = findViewById<TextView>(R.id.tv_nombre_ruta_actual)
        val tvBadgeNum = findViewById<TextView>(R.id.tv_badge_linea_num)

        val rutaNombreGuardada = sessionStore.getSelectedRouteName()
        val rutaNroGuardada = sessionStore.getSelectedRouteNroLinea()
        val userRut = sessionStore.getUserRut() ?: ""
        val userName = sessionStore.getUserName()?.lowercase() ?: ""

        // Asignación automática de ruta según conductor configurado por Superadmin
        val rutaAsignadaAuto: RutaSimple = when {
            userRut.contains("16.294") || userName.contains("tapia") -> {
                rutasDisponibles.firstOrNull { it.id.contains("1") && !it.id.contains("105") } ?: rutasDisponibles[1]
            }
            userRut.contains("18.105") || userName.contains("fuentes") || userName.contains("alejandra") -> {
                rutasDisponibles.firstOrNull { it.id.contains("MP") || it.id.contains("500007") } ?: rutasDisponibles[2]
            }
            else -> {
                // Rodrigo Venegas o por defecto: Línea 105 Melipilla
                rutasDisponibles[0]
            }
        }

        if (!rutaNombreGuardada.isNullOrEmpty()) {
            tvNombreRuta?.text = rutaNombreGuardada
            tvBadgeNum?.text = rutaNroGuardada ?: rutaAsignadaAuto.nroLinea
        } else {
            tvNombreRuta?.text = rutaAsignadaAuto.nombre
            tvBadgeNum?.text = rutaAsignadaAuto.nroLinea
            sessionStore.saveSelectedRoute(rutaAsignadaAuto.id, rutaAsignadaAuto.nombre, rutaAsignadaAuto.nroLinea)
        }
    }

    private fun cargarRutasDesdeBackend() {
        lifecycleScope.launch {
            try {
                val response = withContext(Dispatchers.IO) {
                    ApiClient.service.getLineas()
                }
                if (response.isSuccessful && !response.body().isNullOrEmpty()) {
                    val lineasApi = response.body()!!
                    rutasDisponibles = lineasApi.map { r ->
                        val nro = r.nroLinea ?: r.nombre.filter { it.isDigit() }.ifEmpty { "1" }
                        RutaSimple(
                            id = r.id ?: nro,
                            nombre = r.nombre,
                            nroLinea = nro,
                            codigo = r.codigoRecorrido ?: ""
                        )
                    }
                }
            } catch (_: Exception) {
                // Si está offline o error de red, mantiene las 3 rutas precargadas de rutas_rm_3
            }
        }
    }

    private fun mostrarDialogoSeleccionarRuta() {
        val nombres = rutasDisponibles.map { it.nombre }.toTypedArray()
        val rutaActualId = sessionStore.getSelectedRouteId() ?: rutasDisponibles[0].id
        val selectedIndex = rutasDisponibles.indexOfFirst { it.id == rutaActualId }.let { if (it >= 0) it else 0 }

        AlertDialog.Builder(this)
            .setTitle("Elige tu ruta para hoy")
            .setSingleChoiceItems(nombres, selectedIndex) { dialog, which ->
                val rutaElegida = rutasDisponibles[which]
                sessionStore.saveSelectedRoute(rutaElegida.id, rutaElegida.nombre, rutaElegida.nroLinea)
                setupRutaActual()
                dialog.dismiss()

                // Notificar al backend sobre la línea elegida por el conductor
                notificarSeleccionBackend(rutaElegida.id)
                Toast.makeText(this, "Ruta establecida: ${rutaElegida.nombre}", Toast.LENGTH_SHORT).show()
            }
            .setNegativeButton("Cancelar", null)
            .show()
    }

    private fun notificarSeleccionBackend(lineaId: String) {
        lifecycleScope.launch {
            try {
                withContext(Dispatchers.IO) {
                    ApiClient.service.seleccionarLinea(SeleccionarLineaRequest(lineaId = lineaId))
                }
            } catch (_: Exception) {
                // Sin bloqueo en caso de fallo de red
            }
        }
    }

    private fun setupButtons() {
        val tvSeats = findViewById<TextView>(R.id.tv_seats)
        val btnMinus = findViewById<MaterialCardView>(R.id.btn_minus)
        val btnPlus = findViewById<MaterialCardView>(R.id.btn_plus)

        btnMinus.setOnClickListener {
            if (seats > 0) {
                seats--
                tvSeats.text = seats.toString()
            }
        }

        btnPlus.setOnClickListener {
            if (seats < 4) {
                seats++
                tvSeats.text = seats.toString()
            }
        }

        // Selección de ruta
        findViewById<MaterialButton>(R.id.btn_elegir_ruta)?.setOnClickListener {
            mostrarDialogoSeleccionarRuta()
        }
        findViewById<MaterialCardView>(R.id.card_linea_badge)?.setOnClickListener {
            mostrarDialogoSeleccionarRuta()
        }

        val btnOnline = findViewById<MaterialCardView>(R.id.btn_status_online)
        val btnBusy = findViewById<MaterialCardView>(R.id.btn_status_busy)
        val btnOffline = findViewById<MaterialCardView>(R.id.btn_status_offline)

        btnOnline.setOnClickListener {
            if (!sessionStore.isTurnoActivo()) {
                iniciarTurno()
            } else {
                sessionStore.setEstadoConductor("EN_LINEA")
                actualizarEstadoVisual("EN_LINEA", true)
                Toast.makeText(this, "Estado: En línea", Toast.LENGTH_SHORT).show()
            }
        }

        btnBusy.setOnClickListener {
            if (!sessionStore.isTurnoActivo()) {
                Toast.makeText(this, "Debes iniciar tu turno para cambiar a Ocupado", Toast.LENGTH_SHORT).show()
            } else {
                sessionStore.setEstadoConductor("OCUPADO")
                actualizarEstadoVisual("OCUPADO", true)
                Toast.makeText(this, "Estado: Ocupado (en recorrido)", Toast.LENGTH_SHORT).show()
            }
        }

        btnOffline.setOnClickListener {
            if (sessionStore.isTurnoActivo()) {
                confirmarFinalizarTurno()
            } else {
                Toast.makeText(this, "Ya te encuentras fuera de servicio", Toast.LENGTH_SHORT).show()
            }
        }

        val btnPanic = findViewById<MaterialCardView>(R.id.btn_panic)
        btnPanic.setOnLongClickListener {
            Toast.makeText(this, "¡ALERTA DE PÁNICO ENVIADA A LA CENTRAL!", Toast.LENGTH_LONG).show()
            true
        }
        btnPanic.setOnClickListener {
            Toast.makeText(this, "Mantén presionado para enviar alerta de pánico", Toast.LENGTH_SHORT).show()
        }

        // Botón Iniciar / Finalizar Turno dinámico
        val btnTurnoToggle = findViewById<MaterialButton>(R.id.btn_finalizar)
        btnTurnoToggle.setOnClickListener {
            if (sessionStore.isTurnoActivo()) {
                confirmarFinalizarTurno()
            } else {
                iniciarTurno()
            }
        }

        setupBottomNav()
    }

    private fun setupBottomNav() {
        val bottomNav = findViewById<BottomNavigationView>(R.id.bottom_nav)
        bottomNav.selectedItemId = R.id.nav_home

        bottomNav.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_home -> true
                R.id.nav_route -> {
                    startActivity(Intent(this, RouteActivity::class.java))
                    overridePendingTransition(0, 0)
                    finish()
                    true
                }
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
}
