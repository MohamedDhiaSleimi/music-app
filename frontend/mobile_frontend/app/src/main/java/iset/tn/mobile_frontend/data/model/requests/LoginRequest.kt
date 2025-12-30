package iset.tn.mobile_frontend.data.model.requests

data class LoginRequest(
    val emailOrUsername: String, val password: String
)