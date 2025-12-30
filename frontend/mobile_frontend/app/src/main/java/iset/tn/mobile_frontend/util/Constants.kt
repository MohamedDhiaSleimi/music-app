package iset.tn.mobile_frontend.util

object Constants {


    // Shared Preferences
    const val PREF_NAME = "music_auth_prefs"
    const val KEY_TOKEN = "auth_token"
    const val KEY_USER_ID = "user_id"
    const val KEY_USERNAME = "username"
    const val KEY_EMAIL = "email"

    private const val BASE_IP = "http://10.0.2.2"
    private const val AUTH_PORT = 8084
    private const val MUSIC_PORT = 3000

    fun getBaseUrl(type: String): String {
        val port = when (type.lowercase()) {
            "auth" -> AUTH_PORT
            "music" -> MUSIC_PORT
            else -> throw IllegalArgumentException("Unknown API type: $type")
        }
        return "$BASE_IP:$port/api/"
    }
}
