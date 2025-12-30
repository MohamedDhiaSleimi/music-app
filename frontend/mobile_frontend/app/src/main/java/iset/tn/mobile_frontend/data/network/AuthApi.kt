package iset.tn.mobile_frontend.data.network

import iset.tn.mobile_frontend.data.model.requests.LoginRequest
import iset.tn.mobile_frontend.data.model.requests.RegisterRequest
import iset.tn.mobile_frontend.data.model.response.AuthResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST


interface AuthApi {
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>

    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<AuthResponse>

    @GET("auth/me")
    suspend fun getCurrentUser(
        @Header("Authorization") token: String
    ): Response<AuthResponse>
}
