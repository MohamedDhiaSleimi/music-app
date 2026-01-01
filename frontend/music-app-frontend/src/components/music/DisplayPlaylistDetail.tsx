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
        <p className="text-white mt-6">Loading playlist...</p>
      </>
    );
  }

  if (!playlist) {
    return (
      <>
        <Navbar />
        <div className="text-white mt-6">
          <p>Playlist not found.</p>
          <button
            onClick={() => navigate("/playlists")}
            className="mt-4 px-4 py-2 bg-white text-black rounded font-semibold"
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
    await deletePlaylist(playlist._id);
    navigate("/playlists");
  };

  return (
    <>
      <Navbar />
      <div className="mt-6 flex flex-col gap-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#121212] p-4 rounded">
          <div>
            <p className="text-sm text-gray-400">Playlist</p>
            <h1 className="text-3xl font-bold">{playlist.name}</h1>
            <p className="text-gray-400">{playlist.description || "No description"}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                playlist.isPublic
                  ? "bg-green-500/20 text-green-400"
                  : "bg-yellow-500/20 text-yellow-300"
              }`}
            >
              {playlist.isPublic ? "Public" : "Private"}
            </span>
            <button
              onClick={() =>
                setPlaylistVisibility(playlist._id, !playlist.isPublic)
              }
              className="px-4 py-2 rounded bg-[#2d2d2d] text-white text-sm font-semibold hover:bg-[#3d3d3d]"
            >
              {playlist.isPublic ? "Make private" : "Make public"}
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2 rounded bg-[#2d2d2d] text-white text-sm font-semibold hover:bg-[#3d3d3d]"
            >
              Share
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>

        {shareMessage && (
          <p className="text-sm text-green-400">{shareMessage}</p>
        )}

        <div className="bg-[#121212] p-4 rounded">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Songs</h2>
            <div className="flex gap-2">
              <select
                value={selectedSongId}
                onChange={(e) => setSelectedSongId(e.target.value)}
                className="bg-[#1f1f1f] text-white px-3 py-2 rounded"
              >
                <option value="">Add a song...</option>
                {availableSongs.map((song) => (
                  <option key={song._id} value={song._id}>
                    {song.name} — {song.album}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddSong}
                disabled={isWorking}
                className="px-4 py-2 rounded bg-white text-black font-semibold disabled:opacity-60"
              >
                Add
              </button>
            </div>
          </div>

          {playlist.songs.length === 0 ? (
            <p className="text-gray-400">No songs in this playlist yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {playlist.songs.map((song) => (
                <div
                  key={song._id}
                  className="flex items-center justify-between bg-[#1f1f1f] rounded p-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={song.image}
                      alt={song.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold">{song.name}</p>
                      <p className="text-sm text-gray-400">{song.album}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => playWithId(song._id)}
                      className="px-3 py-2 rounded bg-[#2d2d2d] text-white text-sm font-semibold hover:bg-[#3d3d3d]"
                    >
                      Play
                    </button>
                    <button
                      onClick={() => handleRemoveSong(song._id)}
                      disabled={isWorking}
                      className="px-3 py-2 rounded bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60"
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
    </>
  );
}
