package iset.tn.mobile_frontend.ui.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import iset.tn.mobile_frontend.data.model.Album
import iset.tn.mobile_frontend.data.model.Song
import iset.tn.mobile_frontend.data.repository.MusicRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class MusicViewModel : ViewModel() {
    private val repository = MusicRepository()

    private val _songs = MutableLiveData<List<Song>>()
    val songs: LiveData<List<Song>> = _songs

    private val _albums = MutableLiveData<List<Album>>()
    val albums: LiveData<List<Album>> = _albums

    private val _filteredSongs = MutableLiveData<List<Song>>()
    val filteredSongs: LiveData<List<Song>> = _filteredSongs

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    private val _errorMessage = MutableLiveData<String?>()
    val errorMessage: LiveData<String?> = _errorMessage

    private val _currentPlayingSong = MutableLiveData<Song?>()
    val currentPlayingSong: LiveData<Song?> = _currentPlayingSong

    private var allSongs: List<Song> = emptyList()
    private var currentSearchQuery: String = ""
    private var currentAlbumFilter: String? = null

    init {
        loadMusic()
    }

    fun loadMusic() {
        _isLoading.postValue(true)
        _errorMessage.postValue(null)

        viewModelScope.launch(Dispatchers.IO) {
            try {
                val songsData = repository.getSongs()
                val albumsData = repository.getAlbums()

                allSongs = songsData
                _songs.postValue(songsData)
                _albums.postValue(albumsData)
                _filteredSongs.postValue(songsData)
                _isLoading.postValue(false)
            } catch (e: Exception) {
                _errorMessage.postValue("Failed to load music: ${e.message}")
                _isLoading.postValue(false)
            }
        }
    }

    fun searchSongs(query: String) {
        currentSearchQuery = query
        applyFilters()
    }

    fun filterByAlbum(albumName: String?) {
        currentAlbumFilter = albumName
        applyFilters()
    }

    private fun applyFilters() {
        var filtered = allSongs

        // Apply search filter
        if (currentSearchQuery.isNotEmpty()) {
            filtered = filtered.filter { song ->
                song.name.contains(currentSearchQuery, ignoreCase = true) ||
                        song.desc.contains(currentSearchQuery, ignoreCase = true) ||
                        song.album.contains(currentSearchQuery, ignoreCase = true)
            }
        }

        // Apply album filter
        currentAlbumFilter?.let { albumName ->
            if (albumName != "All") {
                filtered = filtered.filter { it.album == albumName }
            }
        }

        _filteredSongs.postValue(filtered)
    }

    fun clearFilters() {
        currentSearchQuery = ""
        currentAlbumFilter = null
        _filteredSongs.postValue(allSongs)
    }

    fun playSong(song: Song) {
        _currentPlayingSong.postValue(song)
    }

    fun stopPlayback() {
        _currentPlayingSong.postValue(null)
    }
}