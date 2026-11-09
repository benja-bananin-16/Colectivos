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

// Datos de paradero en trazado
data class ParadaResponse(
    val orden: Int,
    val calle: String,
    val comuna: String?
) : java.io.Serializable

// Trazado de IDA y REGRESO
data class TrazadoResponse(
    @SerializedName("IDA") val ida: List<ParadaResponse>?,
    @SerializedName("REGRESO") val regreso: List<ParadaResponse>?
) : java.io.Serializable

// Modelo completo de Ruta / Línea devuelto por la API
data class RutaResponse(
    val id: String?,
    @SerializedName("codigo_recorrido") val codigoRecorrido: String?,
    val folio: Int?,
    @SerializedName("tipo_servicio") val tipoServicio: String?,
    @SerializedName("nro_linea") val nroLinea: String?,
    @SerializedName("flota_vigente") val flotaVigente: Int?,
    val responsable: String?,
    @SerializedName("nombre_fantasia") val nombreFantasia: String?,
    @SerializedName("tipo_persona") val tipoPersona: String?,
    @SerializedName("nombre_recorrido") val nombreRecorrido: String?,
    @SerializedName("tipo_trazado") val tipoTrazado: String?,
    val nombre: String,
    val origen: Map<String, Any>?,
    val destino: Map<String, Any>?,
    val trazado: TrazadoResponse?,
    val tarifa: Int?,
    val activa: Boolean?
) : java.io.Serializable

data class SeleccionarLineaRequest(
    @SerializedName("linea_id") val lineaId: String,
    @SerializedName("conductor_id") val conductorId: String? = null
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

    @GET("lineas/")
    suspend fun getLineas(): Response<List<RutaResponse>>

    @POST("conductores/seleccionar-linea/")
    suspend fun seleccionarLinea(@Body body: SeleccionarLineaRequest): Response<Any>
}

class FallbackHostInterceptor : okhttp3.Interceptor {
    override fun intercept(chain: okhttp3.Interceptor.Chain): okhttp3.Response {
        val request = chain.request()
        return try {
            chain.proceed(request)
        } catch (e: java.io.IOException) {
            val originalHost = request.url.host
            if (originalHost == "127.0.0.1") {
                val fallbackUrl = request.url.newBuilder()
                    .host("10.0.2.2")
                    .build()
                val fallbackRequest = request.newBuilder()
                    .url(fallbackUrl)
                    .build()
                chain.proceed(fallbackRequest)
            } else {
                throw e
            }
        }
    }
}

object ApiClient {
    /**
     * URL BASE DE LA API DE CONATACOCH:
     * - Emulador o teléfono por USB: `adb reverse tcp:8010 tcp:8010` y esta URL (127.0.0.1).
     * - Emulador sin adb reverse: http://10.0.2.2:8010/api/ (fallback automático integrado).
     * - Teléfono por WiFi: http://<IP-DEL-PC>:8010/api/ y abrir el 8010 en el firewall.
     */
    const val BASE_URL: String = "http://127.0.0.1:8010/api/"

    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    private val okHttpClient = OkHttpClient.Builder()
        .connectTimeout(5, TimeUnit.SECONDS)
        .readTimeout(10, TimeUnit.SECONDS)
        .writeTimeout(10, TimeUnit.SECONDS)
        .addInterceptor(FallbackHostInterceptor())
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
