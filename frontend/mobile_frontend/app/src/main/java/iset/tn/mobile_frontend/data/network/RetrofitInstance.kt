package iset.tn.mobile_frontend.data.network

import iset.tn.mobile_frontend.util.Constants
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitInstance {


    private val logging = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    private val client = OkHttpClient.Builder()
        .addInterceptor(logging)
        .build()

    // Auth API instance
    val authApi: AuthApi by lazy {
        Retrofit.Builder()
            .baseUrl(Constants.getBaseUrl("auth"))
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(AuthApi::class.java)
    }

    // Music API instance
    val musicApi: MusicApi by lazy {
        Retrofit.Builder()
            .baseUrl(Constants.getBaseUrl("music"))
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(MusicApi::class.java)
    }
}
