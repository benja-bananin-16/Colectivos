package cl.conatacoch.colectivos.login

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.ProgressBar
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.lifecycleScope
import com.google.android.material.button.MaterialButton
import com.google.android.material.textfield.TextInputEditText
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import cl.conatacoch.colectivos.R
import cl.conatacoch.colectivos.conductor.HomeActivity
import cl.conatacoch.colectivos.data.ApiClient
import cl.conatacoch.colectivos.data.LoginRequest
import cl.conatacoch.colectivos.data.SessionStore
import cl.conatacoch.colectivos.pasajero.ListaColectivosActivity

class LoginActivity : AppCompatActivity() {

    private lateinit var sessionStore: SessionStore
    private lateinit var pbLoading: ProgressBar
    private lateinit var btnLogin: MaterialButton
    private lateinit var btnDemoConductor: MaterialButton
    private lateinit var btnDemoPasajero: MaterialButton
    private lateinit var etRut: TextInputEditText
    private lateinit var etPass: TextInputEditText

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_login)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        sessionStore = SessionStore(this)

        pbLoading = findViewById(R.id.pb_loading)
        btnLogin = findViewById(R.id.btn_login)
        btnDemoConductor = findViewById(R.id.btn_demo_conductor)
        btnDemoPasajero = findViewById(R.id.btn_demo_pasajero)
        val btnFillDev = findViewById<MaterialButton>(R.id.btn_fill_dev)
        etRut = findViewById(R.id.et_rut)
        etPass = findViewById(R.id.et_pass)

        // Botón 1: «Entrar» (Valida contra la API real)
        btnLogin.setOnClickListener {
            val rut = etRut.text.toString().trim()
            val pass = etPass.text.toString().trim()

            if (rut.isEmpty() || pass.isEmpty()) {
                Toast.makeText(this, "Por favor ingrese su RUT y contraseña", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            ejecutarLoginReal(rut, pass)
        }

        // Botón 2: «Entrar como demo (conductor)»
        btnDemoConductor.setOnClickListener {
            ejecutarDemoConductor()
        }

        // Botón 3: «Entrar como demo (pasajero)»
        btnDemoPasajero.setOnClickListener {
            ejecutarDemoPasajero()
        }

        // Ayuda de desarrollo: autocompletar credenciales válidas
        btnFillDev.setOnClickListener {
            etRut.setText("11.111.111-1")
            etPass.setText("DemoConductor2026!")
        }
    }

    private fun setLoading(isLoading: Boolean) {
        pbLoading.visibility = if (isLoading) View.VISIBLE else View.GONE
        btnLogin.isEnabled = !isLoading
        btnDemoConductor.isEnabled = !isLoading
        btnDemoPasajero.isEnabled = !isLoading
    }

    private fun ejecutarLoginReal(rut: String, pass: String) {
        setLoading(true)
        lifecycleScope.launch {
            try {
                val response = withContext(Dispatchers.IO) {
                    ApiClient.service.login(LoginRequest(rut = rut, password = pass))
                }

                if (response.isSuccessful && response.body() != null) {
                    val auth = response.body()!!
                    val rol = auth.usuario.rol?.uppercase() ?: "CONDUCTOR"

                    sessionStore.saveSession(
                        token = auth.token,
                        rol = rol,
                        nombre = auth.usuario.nombreCompleto ?: auth.usuario.nombre,
                        rut = auth.usuario.rut
                    )

                    redirigirPorRol(rol)
                } else {
                    setLoading(false)
                    val errorMsg = if (response.code() == 401 || response.code() == 400) {
                        "Credenciales inválidas. Verifique su RUT y contraseña."
                    } else {
                        "No se pudo conectar con el servidor"
                    }
                    Toast.makeText(this@LoginActivity, errorMsg, Toast.LENGTH_LONG).show()
                }
            } catch (e: Exception) {
                setLoading(false)
                Toast.makeText(this@LoginActivity, "No se pudo conectar con el servidor", Toast.LENGTH_LONG).show()
            }
        }
    }

    private fun ejecutarDemoConductor() {
        setLoading(true)
        lifecycleScope.launch {
            try {
                val response = withContext(Dispatchers.IO) {
                    ApiClient.service.loginDemoConductor()
                }

                if (response.isSuccessful && response.body() != null) {
                    val auth = response.body()!!
                    sessionStore.saveSession(
                        token = auth.token,
                        rol = "CONDUCTOR",
                        nombre = auth.usuario.nombreCompleto ?: "Carlos Valenzuela",
                        rut = auth.usuario.rut ?: "11.111.111-1"
                    )
                    startActivity(Intent(this@LoginActivity, HomeActivity::class.java))
                    finish()
                } else {
                    setLoading(false)
                    Toast.makeText(this@LoginActivity, "No se pudo conectar con el servidor", Toast.LENGTH_LONG).show()
                }
            } catch (e: Exception) {
                setLoading(false)
                Toast.makeText(this@LoginActivity, "No se pudo conectar con el servidor", Toast.LENGTH_LONG).show()
            }
        }
    }

    private fun ejecutarDemoPasajero() {
        setLoading(true)
        lifecycleScope.launch {
            try {
                val response = withContext(Dispatchers.IO) {
                    ApiClient.service.loginDemoPasajero()
                }

                if (response.isSuccessful && response.body() != null) {
                    val auth = response.body()!!
                    sessionStore.saveSession(
                        token = auth.token,
                        rol = "PASAJERO",
                        nombre = auth.usuario.nombreCompleto ?: "Constanza Morales",
                        rut = auth.usuario.rut ?: "22.222.222-2"
                    )
                    startActivity(Intent(this@LoginActivity, ListaColectivosActivity::class.java))
                    finish()
                } else {
                    setLoading(false)
                    Toast.makeText(this@LoginActivity, "No se pudo conectar con el servidor", Toast.LENGTH_LONG).show()
                }
            } catch (e: Exception) {
                setLoading(false)
                Toast.makeText(this@LoginActivity, "No se pudo conectar con el servidor", Toast.LENGTH_LONG).show()
            }
        }
    }

    private fun redirigirPorRol(rol: String) {
        if (rol == "PASAJERO") {
            startActivity(Intent(this, ListaColectivosActivity::class.java))
        } else {
            // CONDUCTOR, ADMIN u otros van al flujo de conductor
            startActivity(Intent(this, HomeActivity::class.java))
        }
        finish()
    }
}
