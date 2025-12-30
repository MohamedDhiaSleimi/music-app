package iset.tn.mobile_frontend.data.model.response

data class AuthResponse(
    val token: String,
    val userId: String,
    val email: String,
    val username: String,
    val profileImageUrl: String?
)