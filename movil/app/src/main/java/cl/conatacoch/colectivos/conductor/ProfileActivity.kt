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
import cl.conatacoch.colectivos.R
import cl.conatacoch.colectivos.data.SessionStore
import cl.conatacoch.colectivos.login.LoginActivity

class ProfileActivity : AppCompatActivity() {

    private lateinit var voiceFeedback: VoiceFeedback
    private lateinit var panicAlertController: PanicAlertController

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_profile)
        AccessibilityPreferences.applyTo(this)
        val sessionStore = SessionStore(this)
        voiceFeedback = VoiceFeedback(this)
        panicAlertController = PanicAlertController(this, this, sessionStore, voiceFeedback)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(android.R.id.content)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        setupBottomNav()
        setupPanicButton()
        setupAccessibility()
        setupButtons()
    }

    private fun setupButtons() {
        val btnUpdateDocs = findViewById<MaterialCardView>(R.id.btn_update_docs)
        btnUpdateDocs.setOnClickListener {
            Toast.makeText(this, "Subida de documentos disponible próximamente", Toast.LENGTH_SHORT).show()
        }

        val btnLogout = findViewById<MaterialCardView>(R.id.btn_logout)
        btnLogout.setOnClickListener {
            // Borrar sesión y token, luego navegar a LoginActivity
            val sessionStore = SessionStore(this)
            sessionStore.clearSession()

            val intent = Intent(this, LoginActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
            finish()
        }
    }

    private fun setupAccessibility() {
        val preferences = AccessibilityPreferences(this)
        val buttons = mapOf(
            TextScale.NORMAL to findViewById<MaterialCardView>(R.id.btn_text_normal),
            TextScale.LARGE to findViewById<MaterialCardView>(R.id.btn_text_large),
            TextScale.EXTRA_LARGE to findViewById<MaterialCardView>(R.id.btn_text_extra_large)
        )
        val preview = findViewById<android.widget.TextView>(R.id.tv_text_preview)

        fun select(scale: TextScale) {
            preferences.setTextScale(scale)
            AccessibilityPreferences.applyTo(this)
            preview.text = "Vista previa: ${scale.label}"
            buttons.forEach { (option, card) ->
                card.setCardBackgroundColor(
                    if (option == scale) {
                        getColor(R.color.brand_yellow)
                    } else {
                        android.graphics.Color.TRANSPARENT
                    }
                )
                card.contentDescription = "Tamaño de texto ${option.label}" +
                    if (option == scale) ", seleccionado" else ""
            }
        }

        buttons.forEach { (scale, card) -> card.setOnClickListener { select(scale) } }
        select(preferences.getTextScale())
    }

    private fun setupBottomNav() {
        val bottomNav = findViewById<BottomNavigationView>(R.id.bottom_nav)
        bottomNav.selectedItemId = R.id.nav_profile

        bottomNav.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_home -> {
                    startActivity(Intent(this, HomeActivity::class.java))
                    overridePendingTransition(0, 0)
                    finish()
                    true
                }
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
                R.id.nav_profile -> true
                else -> {
                    Toast.makeText(this, "Función disponible próximamente", Toast.LENGTH_SHORT).show()
                    false
                }
            }
        }
    }

    private fun setupPanicButton() {
        panicAlertController.bind(findViewById(R.id.btn_panic))
    }

    override fun onDestroy() {
        voiceFeedback.close()
        super.onDestroy()
    }
}
