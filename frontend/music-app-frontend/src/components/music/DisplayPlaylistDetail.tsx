import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import { useMusic } from "../../context/MusicContext";

export default function DisplayPlaylistDetail() {
  const { id } = useParams();
  const {
    playlists,
    songsData,
    addSongToPlaylist,
    removeSongFromPlaylist,
    setPlaylistVisibility,
    sharePlaylist,
    deletePlaylist,
    refreshPlaylists,
    isPlaylistsLoading,
    playWithId,
    playPlaylist,
  } = useMusic();
  const navigate = useNavigate();

  const [selectedSongId, setSelectedSongId] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    if (!playlists.length && !isPlaylistsLoading && id) {
      refreshPlaylists();
    }
  }, [id, playlists.length, isPlaylistsLoading, refreshPlaylists]);

  const playlist = useMemo(
    () => playlists.find((p) => p._id === id),
    [playlists, id]
  );

  const availableSongs = useMemo(() => {
    if (!playlist) return songsData;
    const existingIds = new Set(playlist.songs.map((s) => s._id));
    return songsData.filter((song) => !existingIds.has(song._id));
  }, [playlist, songsData]);

  if (isPlaylistsLoading && !playlist) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading playlist...</p>
          </div>
        </div>
      </>
    );
  }

  if (!playlist) {
    return (
      <>
        <Navbar />
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">🎵</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Playlist not found</h2>
          <p className="text-gray-600 mb-6">The playlist you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/playlists")}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-md"
          >
            Back to playlists
          </button>
        </div>
      </>
    );
  }

  const handleAddSong = async () => {
    if (!selectedSongId) return;
    setIsWorking(true);
    await addSongToPlaylist(playlist._id, selectedSongId);
    setSelectedSongId("");
    setIsWorking(false);
  };

  const handleRemoveSong = async (songId: string) => {
    setIsWorking(true);
    await removeSongFromPlaylist(playlist._id, songId);
    setIsWorking(false);
  };

  const handleShare = async () => {
    const link = await sharePlaylist(playlist._id);
    if (link) {
      try {
        await navigator.clipboard.writeText(link);
        setShareMessage("Share link copied to clipboard");
      } catch {
        setShareMessage(link);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      await deletePlaylist(playlist._id);
      navigate("/playlists");
    }
  };

  return (
    <>
      <Navbar />
      <div className="mt-6 flex flex-col gap-6">
        {/* Playlist Header */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                  Playlist
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  playlist.isPublic
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {playlist.isPublic ? "Public" : "Private"}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{playlist.name}</h1>
              <p className="text-gray-600">{playlist.description || "No description"}</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                <span>🎵 {playlist.songs.length} songs</span>
                <span>•</span>
                <span>👤 Created by you</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => playPlaylist(playlist._id)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-md flex items-center gap-2"
              >
                <span>▶️</span>
                Play all
              </button>
              <button
                onClick={() => setPlaylistVisibility(playlist._id, !playlist.isPublic)}
                className="px-5 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-all"
              >
                {playlist.isPublic ? "Make private" : "Make public"}
              </button>
              <button
                onClick={handleShare}
                className="px-5 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <span>🔗</span>
                Share
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-semibold hover:from-red-600 hover:to-pink-600 transition-all shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        {shareMessage && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">✓</span>
              </div>
              <p className="text-green-700 font-medium">{shareMessage}</p>
            </div>
          </div>
        )}

        {/* Add Songs Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Add Songs</h2>
              <p className="text-gray-600 text-sm">Add new tracks to your playlist</p>
            </div>
            <div className="flex gap-3">
              <select
                value={selectedSongId}
                onChange={(e) => setSelectedSongId(e.target.value)}
                className="bg-gray-50 text-gray-800 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[250px]"
              >
                <option value="">Select a song...</option>
                {availableSongs.map((song) => (
                  <option key={song._id} value={song._id}>
                    {song.name} — {song.album}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddSong}
                disabled={isWorking || !selectedSongId}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold disabled:opacity-50 hover:from-blue-600 hover:to-purple-600 transition-all shadow-md"
              >
                {isWorking ? "Adding..." : "Add Song"}
              </button>
            </div>
          </div>

          {/* Songs List */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Playlist Songs ({playlist.songs.length})</h2>
            
            {playlist.songs.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎵</span>
                </div>
                <p className="text-gray-600">No songs in this playlist yet.</p>
                <p className="text-gray-500 text-sm mt-2">Add some songs to get started!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {playlist.songs.map((song) => (
                  <div
                    key={song._id}
                    className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition-all border border-gray-200"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                        <img
                          src={song.image}
                          alt={song.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-800 truncate">{song.name}</p>
                        <p className="text-sm text-gray-600 truncate">{song.album}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => playWithId(song._id)}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-sm"
                      >
                        Play
                      </button>
                      <button
                        onClick={() => handleRemoveSong(song._id)}
                        disabled={isWorking}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-semibold hover:from-red-600 hover:to-pink-600 transition-all shadow-sm disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}