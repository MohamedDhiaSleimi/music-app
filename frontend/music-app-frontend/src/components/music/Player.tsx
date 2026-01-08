import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useMusic } from "../../context/MusicContext";
import { useAuth } from "../../context/AuthContext";

export default function Player() {
  const {
    track,
    playStatus,
    play,
    pause,
    playWithId,
    previousSong,
    nextSong,
    audioRef,
    seekSong,
    seekBg,
    loopMode,
    cycleLoopMode,
    isShuffle,
    toggleShuffle,
    volume,
    handleVolumeChange,
    toggleMute,
    isMuted,
    isFavorite,
    toggleFavorite,
    favoriteUpdatingIds,
    playQueue,
    removeFromQueue,
    moveQueueItem,
    clearQueue,
    playlists,
    isPlaylistsLoading,
    refreshPlaylists,
    addSongToPlaylist,
    createPlaylist,
  } = useMusic();

  const { logout } = useAuth();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isWorking, setIsWorking] = useState(false);

  const isTrackFavorite = track ? isFavorite(track._id) : false;
  const isTrackUpdating = track ? favoriteUpdatingIds.has(track._id) : false;

  useEffect(() => {
    if (isPickerOpen) {
      refreshPlaylists();
    }
  }, [isPickerOpen, refreshPlaylists]);

  useEffect(() => {
    if (playlists.length > 0 && !selectedPlaylistId) {
      setSelectedPlaylistId(playlists[0]._id);
    }
  }, [playlists, selectedPlaylistId]);

  if (!track) return null;

  const renderModal = (content: ReactNode) => {
    if (!content) return null;
    if (typeof document === "undefined") return content;
    return createPortal(content, document.body);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAddToPlaylist = async () => {
    if (!track || !selectedPlaylistId) return;
    setIsWorking(true);
    await addSongToPlaylist(selectedPlaylistId, track._id);
    setIsWorking(false);
    setIsPickerOpen(false);
  };

  const handleCreateAndAdd = async () => {
    if (!track || !newPlaylistName.trim()) return;
    setIsWorking(true);
    const created = await createPlaylist({ name: newPlaylistName });
    const playlistId = created?._id;
    if (playlistId) {
      await addSongToPlaylist(playlistId, track._id);
      setSelectedPlaylistId(playlistId);
    }
    setNewPlaylistName("");
    setIsWorking(false);
    setIsPickerOpen(false);
  };

  return (
    <div className="h-[10%] bg-gradient-to-r from-[#0b1728] via-[#0f111a] to-[#0b1728] border-t border-white/10 px-4 flex items-center justify-between text-white shadow-[0_-10px_40px_-24px_rgba(0,0,0,0.9)]">
      {/* Left: Current Track */}
      <div className="flex items-center gap-4 w-full lg:w-[32%] flex-wrap relative bg-white/5 border border-white/10 rounded-2xl p-2 backdrop-blur">
        <div className="w-14 h-14 rounded-lg overflow-hidden bg-black/40 flex-shrink-0">
          <img src={track.image} alt={track.name} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-sm leading-tight truncate">{track.name}</h4>
          <p className="text-xs text-gray-400 leading-snug truncate">{track.desc}</p>
        </div>
        <button
          onClick={() => toggleFavorite(track._id)}
          disabled={isTrackUpdating}
          className={`ml-4 text-gray-400 hover:text-white ${isTrackUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
          aria-label={isTrackFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isTrackFavorite ? (
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
            </svg>
          )}
        </button>
        <button
          onClick={() => setIsPickerOpen((prev) => !prev)}
          className="ml-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-500/80 to-blue-500/70 text-black text-xs font-semibold hover:from-green-400 hover:to-blue-400 shadow-md shadow-green-500/20"
        >
          + Playlist
        </button>
        <button
          onClick={() => setIsQueueOpen(true)}
          className="ml-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold hover:bg-white/20 border border-white/15"
        >
          Queue
        </button>

        {renderModal(
          isPickerOpen ? (
            <div className="fixed inset-0 z-30 grid place-items-center px-4">
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsPickerOpen(false)}
              />
              <div className="relative w-full max-w-md bg-[#0f111a] border border-white/10 rounded-2xl p-5 shadow-2xl shadow-black/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold">Add to playlist</p>
                  <button
                    onClick={() => setIsPickerOpen(false)}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    ✕
                  </button>
                </div>

                {isPlaylistsLoading ? (
                  <p className="text-gray-400 text-sm">Loading playlists...</p>
                ) : playlists.length > 0 ? (
                  <>
                    <select
                      value={selectedPlaylistId}
                      onChange={(e) => setSelectedPlaylistId(e.target.value)}
                      className="w-full bg-[#1f1f1f] text-white px-3 py-2 rounded mb-2 border border-white/10"
                    >
                      {playlists.map((playlist) => (
                        <option key={playlist._id} value={playlist._id}>
                          {playlist.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAddToPlaylist}
                      disabled={!selectedPlaylistId || isWorking}
                      className="w-full bg-white text-black font-semibold rounded py-2 disabled:opacity-60"
                    >
                      {isWorking ? "Adding..." : "Add"}
                    </button>
                    <div className="mt-3 text-xs text-gray-400">
                      No playlist you want? Create a new one below.
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400 text-sm mb-2">
                    You have no playlists yet.
                  </p>
                )}

                <div className="mt-3 border-t border-[#2f2f2f] pt-3">
                  <p className="text-sm font-semibold mb-2">Create new</p>
                  <input
                    type="text"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    placeholder="Playlist name"
                    className="w-full bg-[#1f1f1f] text-white px-3 py-2 rounded mb-2 border border-white/10"
                  />
                  <button
                    onClick={handleCreateAndAdd}
                    disabled={!newPlaylistName.trim() || isWorking}
                    className="w-full bg-green-500 text-black font-semibold rounded py-2 disabled:opacity-60"
                  >
                    {isWorking ? "Creating..." : "Create & Add"}
                  </button>
                </div>
              </div>
            </div>
          ) : null
        )}

        {renderModal(
          isQueueOpen ? (
            <div className="fixed inset-0 z-40 grid place-items-center px-4">
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsQueueOpen(false)}
              />
              <div className="relative w-full max-w-3xl bg-[#0f111a] border border-white/10 rounded-2xl p-5 shadow-2xl shadow-black/50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">Up next</p>
                    <h3 className="text-lg font-semibold">Current queue</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={clearQueue}
                      className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold hover:bg-white/20 border border-white/15"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setIsQueueOpen(false)}
                      className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold hover:bg-white/20 border border-white/15"
                    >
                      Close
                    </button>
                  </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto space-y-2">
                  {playQueue.length === 0 ? (
                    <p className="text-gray-400 text-sm">Queue is empty. Add songs to start building it.</p>
                  ) : (
                    playQueue.map((song, idx) => {
                      const isCurrent = track?._id === song._id;
                      return (
                        <div
                          key={song._id + idx}
                          className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 border ${
                            isCurrent
                              ? "bg-white/10 border-white/30"
                              : "bg-white/5 border-white/10"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/40 flex-shrink-0">
                              <img src={song.image} alt={song.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-sm truncate">{song.name}</p>
                              <p className="text-xs text-gray-400 truncate">{song.album}</p>
                            </div>
                          </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-gray-400 w-8 text-center">{idx + 1}</span>
                          <button
                            onClick={() => moveQueueItem(song._id, "up")}
                            disabled={idx === 0}
                            className="px-2 py-1 rounded-full bg-white/10 text-xs hover:bg-white/20 border border-white/15 disabled:opacity-40"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moveQueueItem(song._id, "down")}
                            disabled={idx === playQueue.length - 1}
                            className="px-2 py-1 rounded-full bg-white/10 text-xs hover:bg-white/20 border border-white/15 disabled:opacity-40"
                          >
                            ↓
                          </button>
                          <button
                            onClick={() => playWithId(song._id)}
                            className="px-3 py-1 rounded-full bg-white text-black text-xs font-semibold hover:scale-105 transition"
                          >
                            Play
                          </button>
                          <button
                            onClick={() => removeFromQueue(song._id)}
                            className="px-2 py-1 rounded-full bg-red-500/20 text-red-200 text-xs hover:bg-red-500/30 border border-red-500/30"
                          >
                            ✕
                          </button>
                        </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          ) : null
        )}
      </div>

      {/* Center: Controls */}
      <div className="flex flex-col items-center gap-2 w-[38%] bg-white/5 border border-white/10 rounded-2xl px-4 py-2 backdrop-blur">
        <div className="flex items-center gap-6">
          <button
            onClick={toggleShuffle}
            className={`${
              isShuffle ? "text-green-500" : "text-gray-400"
            } hover:text-white`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10.59 9.17L6.83 5.41 5.41 6.83 9.17 10.59l1.42-1.42zM14.59 15.17L18.34 19 19.76 17.59 16 13.83l-1.41 1.34zM14.59 4l5.17 5.17-1.42 1.41L13.17 5.41 14.59 4zM4.24 19.76l5.17-5.17 1.41 1.41L5.66 21.17 4.24 19.76z" />
            </svg>
          </button>
          <button
            onClick={previousSong}
            className="text-white hover:scale-110 transition"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>
          <button
            onClick={playStatus ? pause : play}
            className="bg-gradient-to-br from-white to-gray-200 text-black rounded-full p-4 hover:scale-105 transition shadow-lg shadow-white/20"
          >
            {playStatus ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <button
            onClick={nextSong}
            className="text-white hover:scale-110 transition"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6z" />
            </svg>
          </button>
          <button
            onClick={cycleLoopMode}
            className={`${
              loopMode !== "off" ? "text-green-500" : "text-gray-400"
            } hover:text-white relative`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
            </svg>
            {loopMode !== "off" && (
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-[10px] font-semibold">
                {loopMode === "one" ? "1" : "∞"}
              </span>
            )}
          </button>
        </div>

        {/* Seek Bar */}
        <div className="flex items-center gap-3 w-full text-xs">
          <span>
            {formatTime(Math.floor(audioRef.current?.currentTime || 0))}
          </span>

          <div
            ref={seekBg}
            onClick={seekSong}
            className="relative flex-1 h-1.5 bg-white/15 rounded-full cursor-pointer group"
          >
            <div
              className="absolute h-full rounded-full transition-all bg-gradient-to-r from-green-400 via-blue-400 to-purple-400"
              style={{
                width: audioRef.current?.duration
                  ? `${
                      (audioRef.current.currentTime /
                        audioRef.current.duration) *
                      100
                    }%`
                  : "0%",
              }}
            />
            <div
              className="absolute h-4 w-4 bg-white rounded-full -top-1 left-0 opacity-0 group-hover:opacity-100 shadow-lg shadow-green-400/30 transition-opacity"
              style={{
                left: audioRef.current?.duration
                  ? `${
                      (audioRef.current.currentTime /
                        audioRef.current.duration) *
                      100
                    }%`
                  : "0%",
              }}
            />
          </div>

          <span>{formatTime(Math.floor(audioRef.current?.duration || 0))}</span>
        </div>
      </div>

      {/* Right: Volume + Logout */}
      <div className="flex items-center gap-4 w-[30%] justify-end">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-full backdrop-blur">
          <button onClick={toggleMute}>
            {isMuted || volume === 0 ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM19 12c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            ) : volume < 0.5 ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zm-2.5 0c0 .78.37 1.48.97 2.03v-4.06c-.6.55-.97 1.25-.97 2.03zM3 9v6h4l5 5V4L7 9H3z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-28 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer accent-green-400"
          />
        </div>

        <button
          onClick={logout}
          className="bg-white/10 border border-red-400/40 text-red-100 hover:bg-red-500 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition shadow-lg shadow-red-500/20"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
