package com.example.colectivos

import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.card.MaterialCardView

class PaymentsActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_payments)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(android.R.id.content)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        setupBottomNav()
        setupPanicButton()
        setupTabs()
        setupExportButton()
    }

    private fun setupTabs() {
        val btnDia = findViewById<MaterialCardView>(R.id.btn_tab_dia)
        val btnSemana = findViewById<MaterialCardView>(R.id.btn_tab_semana)
        val btnMes = findViewById<MaterialCardView>(R.id.btn_tab_mes)

        val tvDia = findViewById<TextView>(R.id.tv_tab_dia)
        val tvSemana = findViewById<TextView>(R.id.tv_tab_semana)
        val tvMes = findViewById<TextView>(R.id.tv_tab_mes)

        val colorYellow = ContextCompat.getColor(this, R.color.brand_yellow)
        val colorBlack = ContextCompat.getColor(this, R.color.black)
        val colorGray = ContextCompat.getColor(this, R.color.text_secondary)

        fun resetTabs() {
            btnDia.setCardBackgroundColor(Color.TRANSPARENT)
            btnSemana.setCardBackgroundColor(Color.TRANSPARENT)
            btnMes.setCardBackgroundColor(Color.TRANSPARENT)
            tvDia.setTextColor(colorGray)
            tvSemana.setTextColor(colorGray)
            tvMes.setTextColor(colorGray)
        }

        btnDia.setOnClickListener {
            resetTabs()
            btnDia.setCardBackgroundColor(colorYellow)
            tvDia.setTextColor(colorBlack)
        }
        btnSemana.setOnClickListener {
            resetTabs()
            btnSemana.setCardBackgroundColor(colorYellow)
            tvSemana.setTextColor(colorBlack)
        }
        btnMes.setOnClickListener {
            resetTabs()
            btnMes.setCardBackgroundColor(colorYellow)
            tvMes.setTextColor(colorBlack)
        }
    }

    private fun setupBottomNav() {
        val bottomNav = findViewById<BottomNavigationView>(R.id.bottom_nav)
        bottomNav.selectedItemId = R.id.nav_payments

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
                R.id.nav_payments -> true
                R.id.nav_profile -> {
                    startActivity(Intent(this, ProfileActivity::class.java))
                    overridePendingTransition(0, 0)
                    finish()
                    true
                }
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
    
    private fun setupExportButton() {
        val btnExport = findViewById<MaterialCardView>(R.id.btn_export)
        btnExport.setOnClickListener {
            Toast.makeText(this, "Generando PDF...", Toast.LENGTH_SHORT).show()
        }
    }
}
