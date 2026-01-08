import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import { useMusic } from "../../context/MusicContext";

export default function DisplayPlaylistDetail() {
  const { id } = useParams();
  const {
    allPlaylists,
    songsData,
    addSongToPlaylist,
    removeSongFromPlaylist,
    setPlaylistVisibility,
    sharePlaylist,
    deletePlaylist,
    sortSongs,
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
    if (!allPlaylists.length && !isPlaylistsLoading && id) {
      refreshPlaylists();
    }
  }, [id, allPlaylists.length, isPlaylistsLoading, refreshPlaylists]);

  const playlist = useMemo(
    () => allPlaylists.find((p) => p._id === id),
    [allPlaylists, id]
  );

  const availableSongs = useMemo(() => {
    if (!playlist) return songsData;
    const existingIds = new Set(playlist.songs.map((s) => s._id));
    return sortSongs(songsData.filter((song) => !existingIds.has(song._id)));
  }, [playlist, songsData, sortSongs]);

  const sortedPlaylistSongs = useMemo(() => {
    if (!playlist) return [];
    return sortSongs(playlist.songs);
  }, [playlist, sortSongs]);

  if (isPlaylistsLoading && !playlist) {
    return (
      <>
        <Navbar />
        <p className="text-slate-500 mt-6">Loading playlist...</p>
      </>
    );
  }

  if (!playlist) {
    return (
      <>
        <Navbar />
        <div className="text-slate-700 mt-6">
          <p>Playlist not found.</p>
          <button
            onClick={() => navigate("/playlists")}
            className="mt-4 app-button app-button-primary"
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

  const isTemporary = playlist.isTemporary;

  return (
    <>
      <Navbar />
      <div className="mt-6 flex flex-col gap-6 text-slate-900">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 app-surface p-5">
          <div>
            <p className="text-sm text-slate-500 uppercase tracking-[0.2em]">
              {isTemporary ? "Daily discover" : "Playlist"}
            </p>
            <h1 className="text-3xl font-bold">{playlist.name}</h1>
            <p className="text-slate-600">{playlist.description || "No description"}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => playPlaylist(playlist._id)}
              className="app-button app-button-primary text-sm"
            >
              Play all
            </button>
            {!isTemporary && (
              <>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    playlist.isPublic
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-amber-50 text-amber-700 border border-amber-100"
                  }`}
                >
                  {playlist.isPublic ? "Public" : "Private"}
                </span>
                <button
                  onClick={() =>
                    setPlaylistVisibility(playlist._id, !playlist.isPublic)
                  }
                  className="app-button app-button-ghost text-sm"
                >
                  {playlist.isPublic ? "Make private" : "Make public"}
                </button>
                <button
                  onClick={handleShare}
                  className="app-button app-button-secondary text-sm"
                >
                  Share
                </button>
                <button
                  onClick={handleDelete}
                  className="app-button text-sm bg-rose-600 text-white hover:bg-rose-700"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {shareMessage && (
          <p className="text-sm text-teal-700">{shareMessage}</p>
        )}

        <div className="app-surface p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Songs</h2>
            {!isTemporary && (
              <div className="flex gap-2">
                <select
                  value={selectedSongId}
                  onChange={(e) => setSelectedSongId(e.target.value)}
                  className="app-input py-2"
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
                  className="app-button app-button-primary disabled:opacity-60"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          {playlist.songs.length === 0 ? (
            <p className="text-slate-500">No songs in this playlist yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {sortedPlaylistSongs.map((song) => (
                <div
                  key={song._id}
                  className="flex items-center justify-between bg-white/80 border border-slate-200 rounded-2xl p-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={song.image}
                      alt={song.name}
                      className="w-12 h-12 object-cover rounded-xl"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">{song.name}</p>
                      <p className="text-sm text-slate-500">{song.album}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => playWithId(song._id)}
                      className="px-3 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
                    >
                      Play
                    </button>
                    {!isTemporary && (
                      <button
                        onClick={() => handleRemoveSong(song._id)}
                        disabled={isWorking}
                        className="px-3 py-2 rounded-full bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 disabled:opacity-60"
                      >
                        Remove
                      </button>
                    )}
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
