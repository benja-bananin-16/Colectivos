package com.example.pasajero

import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.pasajero.model.Colectivo

class DetalleActivity : AppCompatActivity() {

    private lateinit var colectivo: Colectivo
    private var metodoPagoSeleccionado = true // RutPay viene preseleccionado

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_detalle)

        colectivo = intent.getSerializableExtra("colectivo") as? Colectivo
            ?: run { finish(); return }

        val btnBack: ImageView = findViewById(R.id.btnBack)
        val tvTituloLinea: TextView = findViewById(R.id.tvTituloLinea)
        val tvEtaDetalle: TextView = findViewById(R.id.tvEtaDetalle)
        val tvAsientosDetalle: TextView = findViewById(R.id.tvAsientosDetalle)
        val tvMaleteroDetalle: TextView = findViewById(R.id.tvMaleteroDetalle)
        val filaPago: android.widget.LinearLayout = findViewById(R.id.filaPago)
        val ivCheckPago: ImageView = findViewById(R.id.ivCheckPago)
        val tvTotalMonto: TextView = findViewById(R.id.tvTotalMonto)
        val btnReservar: Button = findViewById(R.id.btnReservar)

        // Función: pintar datos reales del colectivo seleccionado
        tvTituloLinea.text = "${colectivo.linea} · ${colectivo.destino}"
        tvEtaDetalle.text = "${colectivo.etaMinutos} min"
        tvAsientosDetalle.text = "${colectivo.asientosDisponibles}"
        tvMaleteroDetalle.text = if (colectivo.maleteroDisponible) "Disponible" else "Ocupado"
        tvTotalMonto.text = "$${colectivo.tarifa}"

        // Función: volver a la pantalla de seguimiento
        btnBack.setOnClickListener { onBackPressedDispatcher.onBackPressed() }

        // Función: seleccionar/deseleccionar método de pago
        filaPago.setOnClickListener {
            metodoPagoSeleccionado = !metodoPagoSeleccionado
            ivCheckPago.visibility = if (metodoPagoSeleccionado) android.view.View.VISIBLE else android.view.View.INVISIBLE
        }

        // Función: reservar y pagar con RutPay
        btnReservar.setOnClickListener {
            if (!metodoPagoSeleccionado) {
                Toast.makeText(this, "Selecciona un método de pago", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            if (colectivo.asientosDisponibles <= 0) {
                Toast.makeText(this, "No quedan asientos disponibles en este colectivo", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            btnReservar.isEnabled = false
            btnReservar.text = "Procesando pago..."

            Handler(Looper.getMainLooper()).postDelayed({
                colectivo.asientosDisponibles -= 1

                AlertDialog.Builder(this)
                    .setTitle("Pago exitoso")
                    .setMessage("Se confirmó tu reserva en ${colectivo.linea} por $${colectivo.tarifa} con RutPay · BancoEstado.")
                    .setPositiveButton("Listo") { _, _ ->
                        val resultIntent = Intent().apply {
                            putExtra("colectivoId", colectivo.id)
                            putExtra("nuevosAsientos", colectivo.asientosDisponibles)
                        }
                        setResult(RESULT_OK, resultIntent)
                        finish()
                    }
                    .setCancelable(false)
                    .show()
            }, 1200)
        }
    }
}