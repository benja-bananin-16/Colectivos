package com.example.colectivos

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.card.MaterialCardView

class ProfileActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_profile)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(android.R.id.content)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        setupBottomNav()
        setupPanicButton()
        setupButtons()
    }

    private fun setupButtons() {
        val btnUpdateDocs = findViewById<MaterialCardView>(R.id.btn_update_docs)
        btnUpdateDocs.setOnClickListener {
            Toast.makeText(this, "Actualizar documento presionado", Toast.LENGTH_SHORT).show()
        }

        val btnLogout = findViewById<MaterialCardView>(R.id.btn_logout)
        btnLogout.setOnClickListener {
            startActivity(Intent(this, MainActivity::class.java))
            overridePendingTransition(0, 0)
            finishAffinity() // Clear task history
        }
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
                    Toast.makeText(this, "Vista no implementada en demo", Toast.LENGTH_SHORT).show()
                    false
                }
            }
        }
    }

    private fun setupPanicButton() {
        val btnPanic = findViewById<MaterialCardView>(R.id.btn_panic)
        btnPanic.setOnLongClickListener {
            Toast.makeText(this, "¡ALERTA DE PÁNICO ENVIADA!", Toast.LENGTH_LONG).show()
            true
        }
        btnPanic.setOnClickListener {
            Toast.makeText(this, "Mantén presionado para pánico", Toast.LENGTH_SHORT).show()
        }
    }
}
