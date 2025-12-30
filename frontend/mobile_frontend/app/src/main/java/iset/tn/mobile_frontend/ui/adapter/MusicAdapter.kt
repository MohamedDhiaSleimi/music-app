package iset.tn.mobile_frontend.ui.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import iset.tn.mobile_frontend.data.model.Song
import iset.tn.mobile_frontend.databinding.ItemSongBinding

class MusicAdapter(
    private var songs: List<Song>,
    private val onSongClick: (Song) -> Unit
) : RecyclerView.Adapter<MusicAdapter.SongViewHolder>() {

    inner class SongViewHolder(val binding: ItemSongBinding) :
        RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SongViewHolder {
        val binding = ItemSongBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return SongViewHolder(binding)
    }

    override fun onBindViewHolder(holder: SongViewHolder, position: Int) {
        val song = songs[position]

        with(holder.binding) {
            tvSongName.text = song.name
            tvSongDesc.text = song.desc
            tvSongAlbum.text = song.album
            tvSongDuration.text = song.duration

            // Load image using Glide (you'll need to add Glide dependency)
            // For now, we'll just use a placeholder
            // Glide.with(root.context)
            //     .load(song.image)
            //     .placeholder(R.drawable.ic_music_placeholder)
            //     .into(ivSongImage)

            root.setOnClickListener {
                onSongClick(song)
            }
        }
    }

    override fun getItemCount(): Int = songs.size

    fun updateSongs(newSongs: List<Song>) {
        songs = newSongs
        notifyDataSetChanged()
    }
}