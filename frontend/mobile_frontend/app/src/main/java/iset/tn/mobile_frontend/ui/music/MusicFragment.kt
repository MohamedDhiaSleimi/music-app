package iset.tn.mobile_frontend.ui.music

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import iset.tn.mobile_frontend.databinding.FragmentMusicBinding
import iset.tn.mobile_frontend.ui.adapter.MusicAdapter
import iset.tn.mobile_frontend.ui.viewmodel.MusicViewModel
import iset.tn.mobile_frontend.R
class MusicFragment : Fragment() {

    private var _binding: FragmentMusicBinding? = null
    private val binding get() = _binding!!

    private val viewModel: MusicViewModel by viewModels()
    private lateinit var adapter: MusicAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentMusicBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupRecyclerView()
        setupSearchAndFilters()
        setupButtons()
        observeViewModel()
    }

    private fun setupRecyclerView() {
        adapter = MusicAdapter(emptyList()) { song ->
            viewModel.playSong(song)
            Toast.makeText(requireContext(), "Playing: ${song.name}", Toast.LENGTH_SHORT).show()
        }

        binding.recyclerView.apply {
            layoutManager = LinearLayoutManager(requireContext())
            adapter = this@MusicFragment.adapter
        }
    }

    private fun setupSearchAndFilters() {
        // Search functionality
        binding.searchButton.setOnClickListener {
            val query = binding.searchEdit.text.toString()
            viewModel.searchSongs(query)
        }

        // Album filter setup
        viewModel.albums.observe(viewLifecycleOwner) { albums ->
            val albumNames = listOf("All") + albums.map { it.name }
            val adapter = ArrayAdapter(
                requireContext(),
                android.R.layout.simple_dropdown_item_1line,
                albumNames
            )
            binding.filterAlbumSpinner.setAdapter(adapter)
        }

        binding.filterAlbumSpinner.setOnItemClickListener { _, _, position, _ ->
            val selectedAlbum = if (position == 0) null else binding.filterAlbumSpinner.text.toString()
            viewModel.filterByAlbum(selectedAlbum)
        }

        // Refresh button
        binding.refreshButton.setOnClickListener {
            binding.searchEdit.text?.clear()
            binding.filterAlbumSpinner.setText("", false)
            viewModel.clearFilters()
            viewModel.loadMusic()
        }
    }

    private fun setupButtons() {
        // Logout button
        binding.btnLogout.setOnClickListener {
            logout()
        }
    }

    private fun observeViewModel() {
        // Observe filtered songs
        viewModel.filteredSongs.observe(viewLifecycleOwner) { songs ->
            adapter.updateSongs(songs)
            updateResultsCount(songs.size)
        }

        // Observe loading state
        viewModel.isLoading.observe(viewLifecycleOwner) { isLoading ->
            binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
            binding.recyclerView.visibility = if (isLoading) View.GONE else View.VISIBLE
        }

        // Observe errors
        viewModel.errorMessage.observe(viewLifecycleOwner) { error ->
            error?.let {
                Toast.makeText(requireContext(), it, Toast.LENGTH_LONG).show()
            }
        }

        // Observe currently playing song
        viewModel.currentPlayingSong.observe(viewLifecycleOwner) { song ->
            song?.let {
                // Update UI to show currently playing song
                binding.nowPlayingSection.visibility = View.VISIBLE
                binding.tvNowPlaying.text = "Now Playing: ${it.name}"
            } ?: run {
                binding.nowPlayingSection.visibility = View.GONE
            }
        }
    }

    private fun updateResultsCount(count: Int) {
        binding.resultsCount.text = if (count == 1) {
            "$count song found"
        } else {
            "$count songs found"
        }
    }

    private fun logout() {
        // Clear session
        val sharedPrefs = requireContext().getSharedPreferences("session", android.content.Context.MODE_PRIVATE)
        sharedPrefs.edit().clear().apply()

        // Navigate to home
        findNavController().navigate(R.id.homeFragment)

        Toast.makeText(requireContext(), "Logged out successfully", Toast.LENGTH_SHORT).show()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}