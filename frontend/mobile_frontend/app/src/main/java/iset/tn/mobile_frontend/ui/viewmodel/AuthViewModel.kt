package iset.tn.mobile_frontend.ui.viewmodel

import android.content.Context
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.integration.musicapp.util.PreferenceManager
import iset.tn.mobile_frontend.data.model.requests.LoginRequest
import iset.tn.mobile_frontend.data.model.requests.RegisterRequest
import iset.tn.mobile_frontend.data.model.response.AuthResponse
import iset.tn.mobile_frontend.data.repository.AuthRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class AuthViewModel : ViewModel() {

    private val repo = AuthRepository()
    private lateinit var session: PreferenceManager

    fun setSessionManager(context: Context) {
        session = PreferenceManager(context)
    }

    private val _authResult = MutableLiveData<AuthResponse?>()
    val authResult: LiveData<AuthResponse?> = _authResult

    private val _errorMessage = MutableLiveData<String?>()
    val errorMessage: LiveData<String?> = _errorMessage


    fun login(email: String, password: String) {
        _errorMessage.postValue(null)
        viewModelScope.launch(Dispatchers.IO) {
            try {
                val response = repo.login(LoginRequest(email, password))
                if (response.isSuccessful && response.body() != null) {

                    val data = response.body()!!
                    session.saveAuthToken(data.token)

                    _authResult.postValue(data)

                } else {
                    _errorMessage.postValue("Email ou mot de passe incorrect")
                }
            } catch (e: Exception) {
                _errorMessage.postValue("Erreur de connexion au serveur")
            }
        }
    }



    fun register(req: RegisterRequest) {
        _errorMessage.postValue(null)
        viewModelScope.launch(Dispatchers.IO) {
            try {
                val response = repo.register(req)
                if (response.isSuccessful && response.body() != null) {

                    val data = response.body()!!
                    session.saveAuthToken(data.token)

                    _authResult.postValue(data)

                } else {
                    _errorMessage.postValue("Impossible de créer le compte")
                }
            } catch (e: Exception) {
                _errorMessage.postValue("Erreur réseau")
            }
        }
    }

    fun logout() {
        session.clearAll()          // Efface le token et le rôle de la session
        _authResult.postValue(null)  // Réinitialise les données utilisateur
    }

}
