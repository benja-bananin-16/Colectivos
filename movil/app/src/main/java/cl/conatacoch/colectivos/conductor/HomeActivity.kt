package cl.conatacoch.colectivos.conductor

import android.content.Intent
import android.os.Bundle
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.button.MaterialButton
import com.google.android.material.card.MaterialCardView
import cl.conatacoch.colectivos.R
import cl.conatacoch.colectivos.data.SessionStore

class HomeActivity : AppCompatActivity() {

    private var seats = 2

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_home)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(android.R.id.content)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val sessionStore = SessionStore(this)
        val nombreUsuario = sessionStore.getUserName()
        if (!nombreUsuario.isNullOrEmpty()) {
            findViewById<TextView>(R.id.tv_name)?.text = nombreUsuario
        }

        setupButtons()
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

        val btnOnline = findViewById<MaterialCardView>(R.id.btn_status_online)
        val btnBusy = findViewById<MaterialCardView>(R.id.btn_status_busy)
        val btnOffline = findViewById<MaterialCardView>(R.id.btn_status_offline)

        btnOnline.setOnClickListener {
            Toast.makeText(this, "Estado: En línea", Toast.LENGTH_SHORT).show()
        }
        btnBusy.setOnClickListener {
            Toast.makeText(this, "Estado: Ocupado", Toast.LENGTH_SHORT).show()
        }
        btnOffline.setOnClickListener {
            Toast.makeText(this, "Estado: Fuera de servicio", Toast.LENGTH_SHORT).show()
        }

        val btnPanic = findViewById<MaterialCardView>(R.id.btn_panic)
        btnPanic.setOnLongClickListener {
            Toast.makeText(this, "¡ALERTA DE PÁNICO ENVIADA A LA CENTRAL!", Toast.LENGTH_LONG).show()
            true
        }
        btnPanic.setOnClickListener {
            Toast.makeText(this, "Mantén presionado para enviar alerta de pánico", Toast.LENGTH_SHORT).show()
        }

        val btnFinalizar = findViewById<MaterialButton>(R.id.btn_finalizar)
        btnFinalizar.setOnClickListener {
            Toast.makeText(this, "Turno finalizado exitosamente", Toast.LENGTH_SHORT).show()
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
