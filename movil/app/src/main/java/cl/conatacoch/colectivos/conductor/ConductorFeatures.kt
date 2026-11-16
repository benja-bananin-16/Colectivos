package cl.conatacoch.colectivos.conductor

import android.Manifest
import android.app.Activity
import android.content.Context
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationManager
import android.os.SystemClock
import android.speech.tts.TextToSpeech
import android.view.View
import android.widget.Toast
import androidx.core.app.ActivityCompat
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.lifecycleScope
import cl.conatacoch.colectivos.data.ApiClient
import cl.conatacoch.colectivos.data.PanicAlertRequest
import cl.conatacoch.colectivos.data.SessionStore
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.util.Locale

private const val LOCATION_PERMISSION_REQUEST = 4102

class VoiceFeedback(context: Context) : TextToSpeech.OnInitListener {
    private val textToSpeech = TextToSpeech(context.applicationContext, this)
    private var ready = false

    override fun onInit(status: Int) {
        ready = status == TextToSpeech.SUCCESS
        if (ready) {
            textToSpeech.language = Locale("es", "CL")
        }
    }

    fun speak(message: String) {
        if (ready) {
            textToSpeech.speak(message, TextToSpeech.QUEUE_FLUSH, null, "colectivos_feedback")
        }
    }

    fun close() {
        textToSpeech.stop()
        textToSpeech.shutdown()
    }
}

class PanicAlertController(
    private val activity: Activity,
    private val lifecycleOwner: LifecycleOwner,
    private val sessionStore: SessionStore,
    private val voiceFeedback: VoiceFeedback
) {
    private var sending = false
    private var lastSubmissionAt = 0L

    fun bind(view: View) {
        view.contentDescription = "Botón de pánico. Mantén presionado para enviar una alerta silenciosa"
        view.setOnClickListener {
            announce("Mantén presionado para enviar una alerta de pánico")
        }
        view.setOnLongClickListener {
            sendAlert()
            true
        }
    }

    private fun sendAlert() {
        if (sending || SystemClock.elapsedRealtime() - lastSubmissionAt < 5000) {
            return
        }
        if (!hasLocationPermission()) {
            ActivityCompat.requestPermissions(
                activity,
                arrayOf(Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION),
                LOCATION_PERMISSION_REQUEST
            )
            announce("Necesito permiso de ubicación. Mantén presionado nuevamente para enviar la alerta")
            return
        }

        sending = true
        lastSubmissionAt = SystemClock.elapsedRealtime()
        announce("Enviando alerta de pánico")
        lifecycleOwner.lifecycleScope.launch {
            val result = withContext(Dispatchers.IO) {
                runCatching {
                    ApiClient.service.createPanicAlert(
                        authorization = authorizationHeader(),
                        body = PanicAlertRequest(ubicacion = currentLocation())
                    )
                }
            }
            sending = false
            result.onSuccess { response ->
                if (response.isSuccessful) {
                    announce("Alerta de pánico enviada a la central")
                    Toast.makeText(activity, "Alerta de pánico enviada a la central", Toast.LENGTH_LONG).show()
                } else {
                    announce("No se pudo enviar la alerta de pánico")
                    Toast.makeText(activity, "No se pudo enviar la alerta (${response.code()})", Toast.LENGTH_LONG).show()
                }
            }.onFailure {
                announce("No se pudo conectar con la central")
                Toast.makeText(activity, "No se pudo conectar con la central", Toast.LENGTH_LONG).show()
            }
        }
    }

    private fun hasLocationPermission(): Boolean {
        return ActivityCompat.checkSelfPermission(
            activity,
            Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED ||
            ActivityCompat.checkSelfPermission(
                activity,
                Manifest.permission.ACCESS_COARSE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED
    }

    private fun currentLocation(): Map<String, Any> {
        val locationManager = activity.getSystemService(Context.LOCATION_SERVICE) as LocationManager
        val providers = listOf(LocationManager.GPS_PROVIDER, LocationManager.NETWORK_PROVIDER)
        val location = providers.asSequence()
            .filter { provider ->
                locationManager.isProviderEnabled(provider) &&
                    ActivityCompat.checkSelfPermission(
                        activity,
                        if (provider == LocationManager.GPS_PROVIDER) {
                            Manifest.permission.ACCESS_FINE_LOCATION
                        } else {
                            Manifest.permission.ACCESS_COARSE_LOCATION
                        }
                    ) == PackageManager.PERMISSION_GRANTED
            }
            .mapNotNull { provider -> locationManager.getLastKnownLocation(provider) }
            .maxByOrNull(Location::getTime)

        return if (location != null) {
            mapOf("lat" to location.latitude, "lng" to location.longitude)
        } else {
            emptyMap()
        }
    }

    private fun authorizationHeader(): String {
        val token = sessionStore.getToken()
        return if (token.isNullOrBlank()) "" else "Token $token"
    }

    private fun announce(message: String) {
        voiceFeedback.speak(message)
        Toast.makeText(activity, message, Toast.LENGTH_SHORT).show()
    }
}
