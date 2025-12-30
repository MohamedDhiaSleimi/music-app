package iset.tn.mobile_frontend.data.repository

import iset.tn.mobile_frontend.data.model.requests.LoginRequest
import iset.tn.mobile_frontend.data.model.requests.RegisterRequest
import iset.tn.mobile_frontend.data.model.response.AuthResponse
import iset.tn.mobile_frontend.data.network.RetrofitInstance
import retrofit2.Response

class AuthRepository {

    suspend fun login(req: LoginRequest): Response<AuthResponse> {
        return RetrofitInstance.authApi.login(req)
    }

    suspend fun register(req: RegisterRequest): Response<AuthResponse> {
        return RetrofitInstance.authApi.register(req)
    }
}
