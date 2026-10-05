package com.example.colectivos

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.google.android.material.button.MaterialButton
import com.google.android.material.textfield.TextInputEditText

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val btnLogin = findViewById<MaterialButton>(R.id.btn_login)
        val btnDemo = findViewById<MaterialButton>(R.id.btn_demo)
        val btnTest = findViewById<MaterialButton>(R.id.btn_fill_dev)
        val etRut = findViewById<TextInputEditText>(R.id.et_rut)
        val etPass = findViewById<TextInputEditText>(R.id.et_pass)

        btnLogin.setOnClickListener {
            // Check if fields are not empty before navigating, simple validation
            if (etRut.text.toString().isNotEmpty() && etPass.text.toString().isNotEmpty()) {
                navigateToHome()
            }
        }

        btnDemo.setOnClickListener {
            // Demo account direct login
            navigateToHome()
        }

        btnTest.setOnClickListener {
            // Autofill development data
            etRut.setText("12.345.678-9")
            etPass.setText("desarrollo123")
        }
    }

    private fun navigateToHome() {
        val intent = Intent(this, HomeActivity::class.java)
        startActivity(intent)
        finish() // Optional: finishes the login activity so user can't go back to it
    }
}
