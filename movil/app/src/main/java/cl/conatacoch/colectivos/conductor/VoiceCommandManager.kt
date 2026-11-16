package cl.conatacoch.colectivos.conductor

import android.Manifest
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.view.View
import android.widget.TextView
import android.widget.Toast
import androidx.core.app.ActivityCompat
import java.text.Normalizer
import java.util.Locale

private const val RECORD_AUDIO_REQUEST = 4103

enum class VoiceCommandState {
    INACTIVE,
    LISTENING_COMMAND,
    WAITING_CONFIRMATION,
    EXECUTING_ACTION,
    FINISHED,
    ERROR
}

enum class VoiceAction {
    ACCEPT_TRIP,
    CANCEL_TRIP,
    ACCEPT_PASSENGERS
}

class VoiceCommandManager(
    private val activity: Activity,
    private val voiceFeedback: VoiceFeedback,
    private val onConfirmedAction: (VoiceAction) -> Unit
) {
    private var recognizer: SpeechRecognizer? = null
    private var state = VoiceCommandState.INACTIVE
    private var pendingAction: VoiceAction? = null
    private var button: View? = null
    private var stateLabel: TextView? = null

    fun bind(button: View, stateLabel: TextView) {
        this.button = button
        this.stateLabel = stateLabel
        button.setOnClickListener { startListening() }
        updateVisualState()
    }

    fun startListening() {
        if (state == VoiceCommandState.LISTENING_COMMAND ||
            state == VoiceCommandState.EXECUTING_ACTION
        ) {
            return
        }
        if (!SpeechRecognizer.isRecognitionAvailable(activity)) {
            fail("Este dispositivo no tiene reconocimiento de voz disponible")
            return
        }
        if (ActivityCompat.checkSelfPermission(
                activity,
                Manifest.permission.RECORD_AUDIO
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            ActivityCompat.requestPermissions(
                activity,
                arrayOf(Manifest.permission.RECORD_AUDIO),
                RECORD_AUDIO_REQUEST
            )
            announce("Necesito permiso para usar el micrófono")
            return
        }
        if (recognizer == null) {
            recognizer = SpeechRecognizer.createSpeechRecognizer(activity).also {
                it.setRecognitionListener(listener)
            }
        }
        state = VoiceCommandState.LISTENING_COMMAND
        updateVisualState()
        announce(
            if (pendingAction == null) {
                "Escuchando comando"
            } else {
                "Escuchando confirmación. Di sí o no"
            }
        )
        recognizer?.startListening(Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, "es-CL")
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, "es-CL")
            putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 3)
        })
    }

    fun onPermissionResult(requestCode: Int, granted: Boolean) {
        if (requestCode != RECORD_AUDIO_REQUEST) return
        if (granted) {
            announce("Permiso de micrófono concedido. Pulsa el micrófono para comenzar")
        } else {
            fail("El permiso de micrófono fue denegado")
        }
    }

    fun release() {
        recognizer?.cancel()
        recognizer?.destroy()
        recognizer = null
        state = VoiceCommandState.INACTIVE
        pendingAction = null
    }

    private val listener = object : RecognitionListener {
        override fun onReadyForSpeech(params: Bundle?) = Unit
        override fun onBeginningOfSpeech() = Unit
        override fun onRmsChanged(rmsdB: Float) = Unit
        override fun onBufferReceived(buffer: ByteArray?) = Unit
        override fun onEndOfSpeech() = Unit
        override fun onPartialResults(partialResults: Bundle?) = Unit
        override fun onEvent(eventType: Int, params: Bundle?) = Unit

        override fun onResults(results: Bundle?) {
            val phrases = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION).orEmpty()
            val phrase = phrases.firstOrNull()?.let(::normalize)
            if (phrase.isNullOrBlank()) {
                fail("No entendí el comando")
                return
            }
            handlePhrase(phrase)
        }

        override fun onError(error: Int) {
            if (state == VoiceCommandState.LISTENING_COMMAND) {
                fail(
                    when (error) {
                        SpeechRecognizer.ERROR_NO_MATCH -> "No entendí el comando"
                        SpeechRecognizer.ERROR_SPEECH_TIMEOUT -> "No detecté voz"
                        SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS -> "No hay permiso para usar el micrófono"
                        else -> "Ocurrió un error de reconocimiento"
                    }
                )
            }
        }
    }

    private fun handlePhrase(phrase: String) {
        val action = pendingAction
        if (action != null) {
            when {
                isAffirmative(phrase) -> {
                    state = VoiceCommandState.EXECUTING_ACTION
                    updateVisualState()
                    pendingAction = null
                    announce("Confirmación recibida")
                    onConfirmedAction(action)
                    state = VoiceCommandState.FINISHED
                    updateVisualState()
                }
                isNegative(phrase) -> {
                    pendingAction = null
                    state = VoiceCommandState.FINISHED
                    updateVisualState()
                    announce("Operación cancelada")
                }
                else -> fail("Responde sí para confirmar o no para cancelar")
            }
            return
        }

        val recognizedAction = parseAction(phrase)
        if (recognizedAction == null) {
            fail("Comando desconocido. Di aceptar viaje, cancelar viaje o aceptar pasajeros")
            return
        }
        pendingAction = recognizedAction
        state = VoiceCommandState.WAITING_CONFIRMATION
        updateVisualState()
        announce(
            when (recognizedAction) {
                VoiceAction.ACCEPT_TRIP -> "¿Deseas aceptar este viaje?"
                VoiceAction.CANCEL_TRIP -> "¿Deseas cancelar este viaje?"
                VoiceAction.ACCEPT_PASSENGERS -> "¿Deseas confirmar los pasajeros?"
            }
        )
    }

    private fun parseAction(phrase: String): VoiceAction? {
        return when {
            phrase.matches(Regex("(aceptar|acepta|confirmar|confirma|tomar|toma) (viaje|solicitud)")) ->
                VoiceAction.ACCEPT_TRIP
            phrase.matches(Regex("(cancelar|cancela|anular|anula) (viaje|solicitud)")) ->
                VoiceAction.CANCEL_TRIP
            phrase.matches(Regex("(aceptar|acepta|confirmar|confirma|recoger|recoge) pasajeros")) ->
                VoiceAction.ACCEPT_PASSENGERS
            else -> null
        }
    }

    private fun isAffirmative(phrase: String): Boolean =
        phrase.matches(Regex("(si|sí|confirmar|correcto|afirmativo)"))

    private fun isNegative(phrase: String): Boolean =
        phrase.matches(Regex("(no|cancelar|cancela|volver)"))

    private fun normalize(value: String): String =
        Normalizer.normalize(value.lowercase(Locale("es", "CL")), Normalizer.Form.NFD)
            .replace("\\p{InCombiningDiacriticalMarks}+".toRegex(), "")
            .replace(Regex("[^a-z0-9 ]"), " ")
            .replace(Regex("\\s+"), " ")
            .trim()

    private fun announce(message: String) {
        voiceFeedback.speak(message)
        Toast.makeText(activity, message, Toast.LENGTH_SHORT).show()
    }

    private fun fail(message: String) {
        state = VoiceCommandState.ERROR
        updateVisualState()
        announce(message)
    }

    private fun updateVisualState() {
        val label = when (state) {
            VoiceCommandState.INACTIVE, VoiceCommandState.FINISHED -> "Micrófono"
            VoiceCommandState.LISTENING_COMMAND -> "Escuchando"
            VoiceCommandState.WAITING_CONFIRMATION -> "Confirma"
            VoiceCommandState.EXECUTING_ACTION -> "Procesando"
            VoiceCommandState.ERROR -> "Reintentar"
        }
        stateLabel?.text = label
        button?.contentDescription = when (state) {
            VoiceCommandState.WAITING_CONFIRMATION ->
                "Micrófono. Di sí o no para confirmar la operación pendiente"
            VoiceCommandState.LISTENING_COMMAND ->
                "Micrófono activo. Escuchando un comando"
            else -> "Micrófono. Pulsa para decir un comando de voz"
        }
    }
}
