package iset.tn.mobile_frontend.data.repository

import iset.tn.mobile_frontend.data.model.Album
import iset.tn.mobile_frontend.data.model.Song
import iset.tn.mobile_frontend.data.network.MusicApi
import iset.tn.mobile_frontend.data.network.RetrofitInstance

class MusicRepository {
    private val api: MusicApi = RetrofitInstance.musicApi

    suspend fun getSongs(): List<Song> {
        val response = api.getSongs()
        return if (response.isSuccessful && response.body() != null) {
            response.body()!!.songs
        } else {
            emptyList()
        }
    }

    suspend fun getAlbums(): List<Album> {
        val response = api.getAlbums()
        return if (response.isSuccessful && response.body() != null) {
            response.body()!!.albums
        } else {
            emptyList()
        }
    }
}