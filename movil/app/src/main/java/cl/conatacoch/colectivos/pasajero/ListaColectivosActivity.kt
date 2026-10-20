package cl.conatacoch.colectivos.pasajero

import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.widget.EditText
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
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
    private lateinit var sessionStore: SessionStore

    private val detalleLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == RESULT_OK) {
            val id = result.data?.getStringExtra("colectivoId") ?: return@registerForActivityResult
            val nuevosAsientos = result.data?.getIntExtra("nuevosAsientos", 0) ?: 0
            listaCompleta.find { it.id == id }?.asientosDisponibles = nuevosAsientos
            adapter.actualizarColectivo(id, nuevosAsientos)
            routeMapView.setColectivos(listaCompleta)
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

        // Configurar iniciales de usuario en avatar
        val nombre = sessionStore.getUserName() ?: "Pasajero"
        val iniciales = nombre.split(" ")
            .filter { it.isNotEmpty() }
            .map { it.first().uppercase() }
            .take(2)
            .joinToString("")
        tvAvatar.text = if (iniciales.isNotEmpty()) iniciales else "CM"

        // Cerrar sesión al pulsar el avatar
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

        // Búsqueda y filtrado por línea o destino
        etBuscar.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(s: Editable?) {
                val texto = s.toString().trim().lowercase()
                val filtrada = if (texto.isEmpty()) listaCompleta
                else listaCompleta.filter {
                    it.linea.lowercase().contains(texto) || it.destino.lowercase().contains(texto)
                }
                adapter.actualizarLista(filtrada)
                routeMapView.setColectivos(filtrada)
            }
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
        })

        ivBell.setOnClickListener {
            Toast.makeText(this, "No tienes notificaciones pendientes", Toast.LENGTH_SHORT).show()
        }

        btnUbicacion.setOnClickListener {
            routeMapView.centrarUbicacion()
            Toast.makeText(this, "Centrando el mapa en tu ubicación", Toast.LENGTH_SHORT).show()
        }

        // Cargar conductores desde el backend si hay token disponible
        cargarConductoresBackend()
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
                        val numLinea = c.movil?.numeroInterno ?: "${idx + 1}"
                        val lineaStr = "Línea $numLinea"
                        val destinoStr = when (idx % 3) {
                            0 -> "Terminal La Reina"
                            1 -> "Mall Plaza"
                            else -> "Estación Central"
                        }
                        val asientos = (c.movil?.capacidad ?: 4) - (idx % 3)
                        val x = 0.25f + ((idx * 0.17f) % 0.55f)
                        val y = 0.20f + ((idx * 0.21f) % 0.60f)
                        Colectivo(
                            id = c.id ?: "api_$idx",
                            linea = lineaStr,
                            destino = destinoStr,
                            etaMinutos = 2 + idx * 2,
                            asientosDisponibles = if (asientos > 0) asientos else 1,
                            maleteroDisponible = idx % 2 == 0,
                            tarifa = 750,
                            puntoRutaX = x,
                            puntoRutaY = y
                        )
                    }
                    if (colectivosBackend.isNotEmpty()) {
                        listaCompleta = colectivosBackend.toMutableList()
                        adapter.actualizarLista(listaCompleta)
                        routeMapView.setColectivos(listaCompleta)
                    }
                }
            } catch (_: Exception) {
                // Si la red no está disponible, se mantienen los datos de prueba
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
