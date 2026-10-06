package com.example.pasajero

import android.content.Intent
import android.os.Bundle
import android.widget.EditText
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.pasajero.model.ColectivoRepository
import com.example.pasajero.ui.ColectivoAdapter
import com.example.pasajero.ui.RouteMapView

class MainActivity : AppCompatActivity() {

    private lateinit var adapter: ColectivoAdapter
    private lateinit var routeMapView: RouteMapView
    private var listaCompleta = ColectivoRepository.datosDeEjemplo()

    private val detalleLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == RESULT_OK) {
            val id = result.data?.getStringExtra("colectivoId") ?: return@registerForActivityResult
            val nuevosAsientos = result.data?.getIntExtra("nuevosAsientos", 0) ?: 0
            listaCompleta.find { it.id == id }?.asientosDisponibles = nuevosAsientos
            adapter.actualizarColectivo(id, nuevosAsientos)
            Toast.makeText(this, "Reserva confirmada. Asientos actualizados.", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        routeMapView = findViewById(R.id.routeMapView)
        val rvColectivos: RecyclerView = findViewById(R.id.rvColectivos)
        val etBuscar: EditText = findViewById(R.id.etBuscar)
        val ivBell: ImageView = findViewById(R.id.ivBell)
        val btnUbicacion: ImageButton = findViewById(R.id.btnUbicacion)

        adapter = ColectivoAdapter(listaCompleta) { colectivo ->
            val intent = Intent(this, DetalleActivity::class.java)
            intent.putExtra("colectivo", colectivo)
            detalleLauncher.launch(intent)
        }

        rvColectivos.layoutManager = LinearLayoutManager(this)
        rvColectivos.adapter = adapter
        routeMapView.setColectivos(listaCompleta)

        // Función: buscar/filtrar por línea o destino
        etBuscar.addTextChangedListener(object : android.text.TextWatcher {
            override fun afterTextChanged(s: android.text.Editable?) {
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

        // Función: notificaciones (placeholder)
        ivBell.setOnClickListener {
            Toast.makeText(this, "No tienes notificaciones nuevas", Toast.LENGTH_SHORT).show()
        }

        // Función: centrar mapa en mi ubicación
        btnUbicacion.setOnClickListener {
            Toast.makeText(this, "Centrando el mapa en tu ubicación", Toast.LENGTH_SHORT).show()
        }
    }
}