package com.integration.musicapp.util

import android.content.Context
import android.content.SharedPreferences
import iset.tn.mobile_frontend.util.Constants

class PreferenceManager(context: Context) {

    private val sharedPreferences: SharedPreferences =
        context.getSharedPreferences(Constants.PREF_NAME, Context.MODE_PRIVATE)

    fun saveAuthToken(token: String) {
        sharedPreferences.edit().putString(Constants.KEY_TOKEN, token).apply()
    }

    fun getAuthToken(): String? {
        return sharedPreferences.getString(Constants.KEY_TOKEN, null)
    }

    fun saveUserData(userId: String, username: String, email: String) {
        sharedPreferences.edit().apply {
            putString(Constants.KEY_USER_ID, userId)
            putString(Constants.KEY_USERNAME, username)
            putString(Constants.KEY_EMAIL, email)
            apply()
        }
    }

    fun getUserId(): String? = sharedPreferences.getString(Constants.KEY_USER_ID, null)
    fun getUsername(): String? = sharedPreferences.getString(Constants.KEY_USERNAME, null)
    fun getEmail(): String? = sharedPreferences.getString(Constants.KEY_EMAIL, null)

    fun clearAll() {
        sharedPreferences.edit().clear().apply()
    }

    fun isLoggedIn(): Boolean = getAuthToken() != null
}