package cl.conatacoch.colectivos.data

import android.content.Context
import android.content.SharedPreferences

class SessionStore(context: Context) {
    private val prefs: SharedPreferences =
        context.getSharedPreferences("colectivos_session", Context.MODE_PRIVATE)

    companion object {
        private const val KEY_TOKEN = "auth_token"
        private const val KEY_ROL = "user_role"
        private const val KEY_USER_NAME = "user_name"
        private const val KEY_USER_RUT = "user_rut"
        private const val KEY_SELECTED_ROUTE_ID = "selected_route_id"
        private const val KEY_SELECTED_ROUTE_NAME = "selected_route_name"
        private const val KEY_SELECTED_ROUTE_NRO = "selected_route_nro"
        private const val KEY_TURNO_ACTIVO = "turno_activo"
        private const val KEY_TURNO_INICIO = "turno_inicio"
        private const val KEY_ESTADO_CONDUCTOR = "estado_conductor"
    }

    fun saveSession(token: String, rol: String, nombre: String? = null, rut: String? = null) {
        prefs.edit()
            .putString(KEY_TOKEN, token)
            .putString(KEY_ROL, rol)
            .putString(KEY_USER_NAME, nombre)
            .putString(KEY_USER_RUT, rut)
            .putBoolean(KEY_TURNO_ACTIVO, false)
            .putString(KEY_ESTADO_CONDUCTOR, "FUERA_SERVICIO")
            .remove(KEY_TURNO_INICIO)
            .apply()
    }

    fun isTurnoActivo(): Boolean = prefs.getBoolean(KEY_TURNO_ACTIVO, false)

    fun setTurnoActivo(activo: Boolean) {
        prefs.edit().putBoolean(KEY_TURNO_ACTIVO, activo).apply()
    }

    fun getTurnoInicio(): String? = prefs.getString(KEY_TURNO_INICIO, null)

    fun setTurnoInicio(inicio: String?) {
        prefs.edit().putString(KEY_TURNO_INICIO, inicio).apply()
    }

    fun getEstadoConductor(): String = prefs.getString(KEY_ESTADO_CONDUCTOR, "FUERA_SERVICIO") ?: "FUERA_SERVICIO"

    fun setEstadoConductor(estado: String) {
        prefs.edit().putString(KEY_ESTADO_CONDUCTOR, estado).apply()
    }

    fun saveSelectedRoute(id: String, nombre: String, nroLinea: String) {
        prefs.edit()
            .putString(KEY_SELECTED_ROUTE_ID, id)
            .putString(KEY_SELECTED_ROUTE_NAME, nombre)
            .putString(KEY_SELECTED_ROUTE_NRO, nroLinea)
            .apply()
    }

    fun getSelectedRouteId(): String? = prefs.getString(KEY_SELECTED_ROUTE_ID, null)

    fun getSelectedRouteName(): String? = prefs.getString(KEY_SELECTED_ROUTE_NAME, null)

    fun getSelectedRouteNroLinea(): String? = prefs.getString(KEY_SELECTED_ROUTE_NRO, null)

    fun getToken(): String? = prefs.getString(KEY_TOKEN, null)

    fun getRole(): String? = prefs.getString(KEY_ROL, null)

    fun getUserName(): String? = prefs.getString(KEY_USER_NAME, null)

    fun getUserRut(): String? = prefs.getString(KEY_USER_RUT, null)

    fun isLoggedIn(): Boolean = !getToken().isNullOrEmpty()

    fun clearSession() {
        prefs.edit().clear().apply()
    }
}
