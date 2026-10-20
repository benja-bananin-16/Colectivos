package cl.conatacoch.colectivos.data

import com.google.gson.annotations.SerializedName
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import java.util.concurrent.TimeUnit

// Solicitud de Login
data class LoginRequest(
    val rut: String,
    val password: String
)

// Datos del usuario en la respuesta de autenticación
data class UsuarioResponse(
    val id: String?,
    val rut: String?,
    val nombre: String?,
    val apellido: String?,
    @SerializedName("nombre_completo") val nombreCompleto: String?,
    val email: String?,
    val telefono: String?,
    val rol: String?,
    val activo: Boolean?
)

// Respuesta devuelta por los endpoints de autenticación (/auth/login y /auth/demo/*)
data class AuthResponse(
    val token: String,
    val usuario: UsuarioResponse
)

// Datos del móvil del conductor
data class MovilResponse(
    val id: String?,
    @SerializedName("numero_interno") val numeroInterno: String?,
    val patente: String?,
    val marca: String?,
    val modelo: String?,
    val anio: Int?,
    val capacidad: Int?,
    val estado: String?
)

// Respuesta del listado de conductores (/conductores/)
data class ConductorResponse(
    val id: String?,
    @SerializedName("usuario_id") val usuarioId: String?,
    @SerializedName("licencia_profesional") val licenciaProfesional: String?,
    val estado: String?,
    @SerializedName("calificacion_promedio") val calificacionPromedio: Double?,
    val usuario: UsuarioResponse?,
    val movil: MovilResponse?
)

interface ApiService {
    @POST("auth/login")
    suspend fun login(@Body body: LoginRequest): Response<AuthResponse>

    @POST("auth/demo/conductor")
    suspend fun loginDemoConductor(): Response<AuthResponse>

    @POST("auth/demo/pasajero")
    suspend fun loginDemoPasajero(): Response<AuthResponse>

    @GET("conductores/")
    suspend fun getConductores(@Header("Authorization") authHeader: String): Response<List<ConductorResponse>>
}

object ApiClient {
    /**
     * URL BASE DE LA API DE CONATACOCH:
     * - Emulador o teléfono por USB: `adb reverse tcp:8010 tcp:8010` y esta URL (127.0.0.1).
     * - Emulador sin adb reverse: http://10.0.2.2:8010/api/ (requiere el puerto abierto en el firewall).
     * - Teléfono por WiFi: http://<IP-DEL-PC>:8010/api/ y abrir el 8010 en el firewall.
     * Importante: Mantener siempre la barra diagonal "/" al final de la URL.
     */
    const val BASE_URL: String = "http://127.0.0.1:8010/api/"

    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    private val okHttpClient = OkHttpClient.Builder()
        .connectTimeout(6, TimeUnit.SECONDS)
        .readTimeout(10, TimeUnit.SECONDS)
        .writeTimeout(10, TimeUnit.SECONDS)
        .addInterceptor(loggingInterceptor)
        .build()

    val service: ApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }
}
