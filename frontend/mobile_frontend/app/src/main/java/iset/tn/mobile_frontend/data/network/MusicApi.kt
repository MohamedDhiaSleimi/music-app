package iset.tn.mobile_frontend.data.network

import iset.tn.mobile_frontend.data.model.response.AlbumsResponse
import iset.tn.mobile_frontend.data.model.response.SongsResponse
import retrofit2.Response
import retrofit2.http.GET


interface MusicApi {
    @GET("song/list")
    suspend fun getSongs(): Response<SongsResponse>

    @GET("album/list")
    suspend fun getAlbums(): Response<AlbumsResponse>
}
