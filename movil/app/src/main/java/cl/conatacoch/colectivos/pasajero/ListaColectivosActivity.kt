package cl.conatacoch.colectivos.pasajero

import android.Manifest
import android.app.AlertDialog
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Bundle
import android.os.Looper
import android.text.Editable
import android.text.TextWatcher
import android.widget.EditText
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.chip.Chip
import com.google.android.material.chip.ChipGroup
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import cl.conatacoch.colectivos.R
import cl.conatacoch.colectivos.data.ApiClient
import cl.conatacoch.colectivos.data.SessionStore
import cl.conatacoch.colectivos.login.LoginActivity
import cl.conatacoch.colectivos.model.Colectivo
import cl.conatacoch.colectivos.model.ColectivoRepository

class ListaColectivosActivity : AppCompatActivity() {

    private lateinit var adapter: ColectivoAdapter
    private lateinit var routeMapView: RouteMapView
    private var listaCompleta: MutableList<Colectivo> = ColectivoRepository.datosDeEjemplo()
    private var rutaFiltroActual: String? = null
    private lateinit var sessionStore: SessionStore

    private val locationPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val concedido = permissions[Manifest.permission.ACCESS_FINE_LOCATION] == true ||
                permissions[Manifest.permission.ACCESS_COARSE_LOCATION] == true
        if (concedido) {
            routeMapView.habilitarOverlay()
            solicitarYCentrarUbicacion()
        } else {
            Toast.makeText(this, "Permiso de ubicación no concedido", Toast.LENGTH_SHORT).show()
            routeMapView.centrarUbicacionDefecto()
        }
    }

    data class ParaderoConcurrente(
        val nombre: String,
        val descripcion: String,
        val rutasQuePasan: List<String>
    )

    private val paraderosDisponibles = listOf(
        ParaderoConcurrente("Terminal San Borja", "Estación Central · Pasan 3 rutas", listOf("Línea 1", "Línea 105", "María Pinto")),
        ParaderoConcurrente("Conexión Centro / Alameda", "Santiago · Pasan 2 rutas", listOf("Línea 1", "María Pinto")),
        ParaderoConcurrente("Plaza de Armas Melipilla", "Melipilla · Pasa Línea 105", listOf("Línea 105")),
        ParaderoConcurrente("Puente La Paz / Santa María", "Santiago Centro · Pasa Línea 1", listOf("Línea 1"))
    )
    private var paraderoActualIndex = 0

    private val detalleLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == RESULT_OK) {
            val id = result.data?.getStringExtra("colectivoId") ?: return@registerForActivityResult
            val nuevosAsientos = result.data?.getIntExtra("nuevosAsientos", 0) ?: 0
            listaCompleta.find { it.id == id }?.asientosDisponibles = nuevosAsientos
            aplicarFiltros()
            Toast.makeText(this, "Reserva confirmada. Asientos actualizados.", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_lista_colectivos)

        sessionStore = SessionStore(this)

        routeMapView = findViewById(R.id.routeMapView)
        val rvColectivos: RecyclerView = findViewById(R.id.rvColectivos)
        val etBuscar: EditText = findViewById(R.id.etBuscar)
        val ivBell: ImageView = findViewById(R.id.ivBell)
        val btnUbicacion: ImageButton = findViewById(R.id.btnUbicacion)
        val tvAvatar: TextView = findViewById(R.id.tvAvatar)
        val tvTituloParadero: TextView = findViewById(R.id.tvTituloParadero)
        val btnCambiarParadero: TextView = findViewById(R.id.btnCambiarParadero)
        val chipGroupRutas: ChipGroup = findViewById(R.id.chipGroupRutas)

        // Configurar iniciales de usuario en avatar
        val nombre = sessionStore.getUserName() ?: "Pasajero"
        val iniciales = nombre.split(" ")
            .filter { it.isNotEmpty() }
            .map { it.first().uppercase() }
            .take(2)
            .joinToString("")
        tvAvatar.text = if (iniciales.isNotEmpty()) iniciales else "CM"

        tvAvatar.setOnClickListener {
            AlertDialog.Builder(this)
                .setTitle("Sesión de pasajero")
                .setMessage("Usuario: $nombre\n¿Deseas cerrar sesión?")
                .setPositiveButton("Cerrar sesión") { _, _ ->
                    sessionStore.clearSession()
                    val intent = Intent(this, LoginActivity::class.java)
                    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                    startActivity(intent)
                    finish()
                }
                .setNegativeButton("Cancelar", null)
                .show()
        }

        adapter = ColectivoAdapter(listaCompleta) { colectivo ->
            val intent = Intent(this, DetalleActivity::class.java)
            intent.putExtra("colectivo", colectivo)
            detalleLauncher.launch(intent)
        }

        rvColectivos.layoutManager = LinearLayoutManager(this)
        rvColectivos.adapter = adapter
        routeMapView.setColectivos(listaCompleta)

        // Configuración de Paradero y selector
        actualizarTextoParadero(tvTituloParadero)

        btnCambiarParadero.setOnClickListener {
            val opciones = paraderosDisponibles.map { "${it.nombre}\n(${it.descripcion})" }.toTypedArray()
            AlertDialog.Builder(this)
                .setTitle("Selecciona tu paradero actual")
                .setSingleChoiceItems(opciones, paraderoActualIndex) { dialog, which ->
                    paraderoActualIndex = which
                    actualizarTextoParadero(tvTituloParadero)
                    dialog.dismiss()

                    val p = paraderosDisponibles[which]
                    Toast.makeText(this, "Ubicado en: ${p.nombre}. Pasan: ${p.rutasQuePasan.joinToString(", ")}", Toast.LENGTH_LONG).show()
                }
                .setNegativeButton("Cancelar", null)
                .show()
        }

        // Selección de Ruta mediante Chips
        chipGroupRutas.setOnCheckedStateChangeListener { _, checkedIds ->
            if (checkedIds.isEmpty()) {
                rutaFiltroActual = null
            } else {
                when (checkedIds.first()) {
                    R.id.chipTodas -> rutaFiltroActual = null
                    R.id.chipLinea105 -> rutaFiltroActual = "105"
                    R.id.chipLinea1 -> rutaFiltroActual = "1"
                    R.id.chipMariaPinto -> rutaFiltroActual = "pinto"
                    else -> rutaFiltroActual = null
                }
            }
            aplicarFiltros(etBuscar.text.toString())
        }

        // Búsqueda y filtrado por texto
        etBuscar.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(s: Editable?) {
                aplicarFiltros(s.toString())
            }
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
        })

        ivBell.setOnClickListener {
            Toast.makeText(this, "No tienes notificaciones pendientes", Toast.LENGTH_SHORT).show()
        }

        btnUbicacion.setOnClickListener {
            verificarPermisosYCentrar()
        }

        // Si ya cuenta con permisos concedidos, activar el overlay inmediatamente
        if (tienePermisoUbicacion()) {
            routeMapView.habilitarOverlay()
        }

        cargarConductoresBackend()
    }

    private fun tienePermisoUbicacion(): Boolean {
        val fine = ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
        val coarse = ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION)
        return fine == PackageManager.PERMISSION_GRANTED || coarse == PackageManager.PERMISSION_GRANTED
    }

    private fun verificarPermisosYCentrar() {
        if (tienePermisoUbicacion()) {
            routeMapView.habilitarOverlay()
            solicitarYCentrarUbicacion()
        } else {
            locationPermissionLauncher.launch(
                arrayOf(
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_COARSE_LOCATION
                )
            )
        }
    }

    private fun solicitarYCentrarUbicacion() {
        Toast.makeText(this, "Localizando tu posición...", Toast.LENGTH_SHORT).show()

        // 1. Probar si el overlay de osmdroid ya tiene fix de posición
        val locOverlay = routeMapView.obtenerUbicacionOverlay()
        if (locOverlay != null) {
            routeMapView.centrarEnCoordenadas(locOverlay.latitude, locOverlay.longitude, 16.5)
            Toast.makeText(this, "Centrado en tu ubicación", Toast.LENGTH_SHORT).show()
            return
        }

        // 2. Usar LocationManager nativo del sistema
        val locationManager = getSystemService(Context.LOCATION_SERVICE) as? LocationManager
        if (locationManager == null) {
            routeMapView.centrarUbicacionDefecto()
            return
        }

        try {
            var ultimaUbicacion: Location? = null
            val proveedores = listOf(
                LocationManager.GPS_PROVIDER,
                LocationManager.NETWORK_PROVIDER,
                LocationManager.PASSIVE_PROVIDER
            )

            for (proveedor in proveedores) {
                if (locationManager.isProviderEnabled(proveedor)) {
                    val loc = locationManager.getLastKnownLocation(proveedor)
                    if (loc != null && (ultimaUbicacion == null || loc.time > ultimaUbicacion.time)) {
                        ultimaUbicacion = loc
                    }
                }
            }

            if (ultimaUbicacion != null) {
                routeMapView.centrarEnCoordenadas(ultimaUbicacion.latitude, ultimaUbicacion.longitude, 16.5)
                Toast.makeText(this, "Centrado en tu ubicación", Toast.LENGTH_SHORT).show()
            } else {
                // Solicitar actualización puntual
                val providerToRequest = if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
                    LocationManager.GPS_PROVIDER
                } else if (locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)) {
                    LocationManager.NETWORK_PROVIDER
                } else null

                if (providerToRequest != null) {
                    val locationListener = object : LocationListener {
                        override fun onLocationChanged(location: Location) {
                            try {
                                locationManager.removeUpdates(this)
                            } catch (_: Exception) {}
                            routeMapView.centrarEnCoordenadas(location.latitude, location.longitude, 16.5)
                            Toast.makeText(this@ListaColectivosActivity, "Centrado en tu ubicación", Toast.LENGTH_SHORT).show()
                        }
                        override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) {}
                    }
                    locationManager.requestSingleUpdate(providerToRequest, locationListener, Looper.getMainLooper())
                } else {
                    // Fallback a Santiago Centro
                    routeMapView.centrarUbicacionDefecto()
                    Toast.makeText(this, "Activando ubicación predeterminada", Toast.LENGTH_SHORT).show()
                }
            }
        } catch (_: SecurityException) {
            routeMapView.centrarUbicacionDefecto()
        } catch (_: Exception) {
            routeMapView.centrarUbicacionDefecto()
        }
    }

    private fun actualizarTextoParadero(tv: TextView) {
        val p = paraderosDisponibles[paraderoActualIndex]
        val totalRutas = p.rutasQuePasan.size
        tv.text = "📍 Paradero: ${p.nombre} (${totalRutas} rutas concurrentes)"
    }

    private fun aplicarFiltros(textoBusqueda: String = "") {
        val txt = textoBusqueda.trim().lowercase()
        val filtrada = listaCompleta.filter { c ->
            val matchRuta = when (rutaFiltroActual) {
                null -> true
                "105" -> c.linea.contains("105")
                "1" -> c.linea.contains("Línea 1") || c.linea == "1"
                "pinto" -> c.linea.lowercase().contains("pinto") || c.destino.lowercase().contains("pinto")
                else -> true
            }

            val matchTexto = if (txt.isEmpty()) true
            else c.linea.lowercase().contains(txt) || c.destino.lowercase().contains(txt)

            matchRuta && matchTexto
        }

        adapter.actualizarLista(filtrada)
        routeMapView.setColectivos(filtrada)

        val tvCount = findViewById<TextView>(R.id.tvColectivosDisponiblesCount)
        val rutaNombre = when (rutaFiltroActual) {
            "105" -> "Línea 105"
            "1" -> "Línea 1"
            "pinto" -> "María Pinto"
            else -> "todas las rutas"
        }
        tvCount?.text = "${filtrada.size} colectivos en $rutaNombre"
    }

    private fun cargarConductoresBackend() {
        val token = sessionStore.getToken() ?: return
        lifecycleScope.launch {
            try {
                val response = withContext(Dispatchers.IO) {
                    ApiClient.service.getConductores("Token $token")
                }
                if (response.isSuccessful && !response.body().isNullOrEmpty()) {
                    val conductores = response.body()!!
                    val colectivosBackend = conductores.mapIndexed { idx, c ->
                        val lineaData = when (idx % 3) {
                            0 -> Triple("Línea 105", "Circunvalación Sta. Teresa (Melipilla)", 1000)
                            1 -> Triple("Línea 1", "Vitacura / Tabancura", 1200)
                            else -> Triple("María Pinto", "Terminal San Borja (Est. Central)", 1500)
                        }

                        val asientos = (c.movil?.capacidad ?: 4) - (idx % 3)
                        val x = 0.25f + ((idx * 0.17f) % 0.55f)
                        val y = 0.20f + ((idx * 0.21f) % 0.60f)
                        Colectivo(
                            id = c.id ?: "api_$idx",
                            linea = lineaData.first,
                            destino = lineaData.second,
                            etaMinutos = 2 + idx * 3,
                            asientosDisponibles = if (asientos > 0) asientos else 1,
                            maleteroDisponible = idx % 2 == 0,
                            tarifa = lineaData.third,
                            puntoRutaX = x,
                            puntoRutaY = y
                        )
                    }
                    if (colectivosBackend.isNotEmpty()) {
                        listaCompleta = colectivosBackend.toMutableList()
                        aplicarFiltros()
                    }
                }
            } catch (_: Exception) {
                // Si la red no está disponible, se mantienen los datos iniciales
            }
        }
    }

    override fun onResume() {
        super.onResume()
        routeMapView.onResume()
    }

    override fun onPause() {
        super.onPause()
        routeMapView.onPause()
    }
}
