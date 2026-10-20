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
    }

    fun saveSession(token: String, rol: String, nombre: String? = null, rut: String? = null) {
        prefs.edit()
            .putString(KEY_TOKEN, token)
            .putString(KEY_ROL, rol)
            .putString(KEY_USER_NAME, nombre)
            .putString(KEY_USER_RUT, rut)
            .apply()
    }

    fun getToken(): String? = prefs.getString(KEY_TOKEN, null)

    fun getRole(): String? = prefs.getString(KEY_ROL, null)

    fun getUserName(): String? = prefs.getString(KEY_USER_NAME, null)

    fun getUserRut(): String? = prefs.getString(KEY_USER_RUT, null)

    fun isLoggedIn(): Boolean = !getToken().isNullOrEmpty()

    fun clearSession() {
        prefs.edit().clear().apply()
    }
}
