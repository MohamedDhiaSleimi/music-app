import { useEffect, useState } from "react";
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
    addSongToQueue,
    playQueue,
    removeFromQueue,
    moveQueueItem,
    clearQueue,
    playlists,
    isPlaylistsLoading,
    refreshPlaylists,
    addSongToPlaylist,
    createPlaylist,
    isBuffering,
    setIsMuted,
    setVolume,
    currentQueueIndex,
  } = useMusic();

  const { logout } = useAuth();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [showSaveQueue, setShowSaveQueue] = useState(false);
  const [saveQueueName, setSaveQueueName] = useState("");

  if (!track) return null;

  const isTrackFavorite = track ? isFavorite(track._id) : false;
  const isTrackUpdating = track ? favoriteUpdatingIds.has(track._id) : false;

  useEffect(() => {
    if (isPickerOpen) {
      refreshPlaylists();
      setIsQueueOpen(false);
    }
  }, [isPickerOpen, refreshPlaylists]);

  useEffect(() => {
    if (playlists.length > 0 && !selectedPlaylistId) {
      setSelectedPlaylistId(playlists[0]._id);
    }
  }, [playlists, selectedPlaylistId]);

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) return "0:00";
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
    if (!track || !newPlaylistName.trim() || newPlaylistName.trim().length < 3) return;
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

  const handlePlayNext = (songId: string) => {
    moveQueueItem(songId, "up");
  };

  const handleSaveQueue = async () => {
    if (!saveQueueName.trim() || playQueue.length === 0) return;
    setIsWorking(true);
    const playlist = await createPlaylist({
      name: saveQueueName.trim(),
      songs: playQueue.map((s) => s._id),
    } as any);
    setIsWorking(false);
    setShowSaveQueue(false);
    setSaveQueueName("");
    if (playlist) {
      alert("Queue saved as playlist!");
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsQueueOpen(false);
        setIsPickerOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleClearQueue = () => {
    if (window.confirm("Clear the entire queue?")) {
      clearQueue();
    }
  };

  return (
    <>
      <div className="h-[10%] bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-t border-gray-200 px-6 flex items-center justify-between shadow-lg">
      {/* Left: Current Track */}
      <div className="flex items-center gap-4 w-full lg:w-[32%] flex-wrap relative bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">
        <div className="w-14 h-14 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex-shrink-0">
          <img src={track.image} alt={track.name} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-gray-800 text-sm leading-tight truncate">{track.name}</h4>
          <p className="text-xs text-gray-600 truncate leading-snug">{track.desc}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavorite(track._id)}
            disabled={isTrackUpdating}
            className={`p-2 rounded-full ${isTrackFavorite ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'} ${isTrackUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label={isTrackFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isTrackFavorite ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setIsPickerOpen((prev) => !prev)}
            className="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold hover:from-blue-600 hover:to-purple-600 shadow-md transition-all"
          >
            + Playlist
          </button>
          <button
            onClick={() => addSongToQueue(track._id)}
            className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 border border-gray-300 transition-all"
          >
            + Queue
          </button>
          <button
            onClick={() => {
              setIsPickerOpen(false);
              setIsQueueOpen(true);
            }}
            className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 border border-gray-300 transition-all"
          >
            Queue
          </button>
        </div>

        {/* Playlist Picker Modal */}
        {isPickerOpen && (
          <div className="fixed inset-0 z-30 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsPickerOpen(false)}
            />
            <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-gray-800">Add to playlist</p>
                <button
                  onClick={() => setIsPickerOpen(false)}
                  className="text-gray-500 hover:text-gray-800 text-sm p-1 hover:bg-gray-100 rounded-full"
                >
                  ✕
                </button>
              </div>

              {isPlaylistsLoading ? (
                <p className="text-gray-500 text-sm py-4">Loading playlists...</p>
              ) : playlists.length > 0 ? (
                <>
                  <select
                    value={selectedPlaylistId}
                    onChange={(e) => setSelectedPlaylistId(e.target.value)}
                    className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-xl mb-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {playlists.map((playlist) => {
                      const alreadyHasSong = playlist.songs?.some((s: any) => s._id === track?._id || s === track?._id);
                      return (
                        <option key={playlist._id} value={playlist._id}>
                          {playlist.name}{alreadyHasSong ? " (already has song)" : ""}
                        </option>
                      );
                    })}
                  </select>
                  <button
                    onClick={handleAddToPlaylist}
                    disabled={!selectedPlaylistId || isWorking}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl py-3 disabled:opacity-50 hover:from-blue-600 hover:to-purple-600 transition-all"
                  >
                    {isWorking ? "Adding..." : "Add to Playlist"}
                  </button>
                  <div className="mt-4 text-xs text-gray-500 text-center">
                    No playlist you want? Create a new one below.
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-sm mb-4 py-2">
                  You have no playlists yet.
                </p>
              )}

              <div className="mt-6 border-t border-gray-200 pt-6">
                <p className="text-sm font-semibold text-gray-800 mb-3">Create new playlist</p>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Playlist name"
                  className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-xl mb-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleCreateAndAdd}
                  disabled={!newPlaylistName.trim() || isWorking}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl py-3 disabled:opacity-50 hover:from-green-600 hover:to-emerald-600 transition-all"
                >
                  {isWorking ? "Creating..." : "Create & Add"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Queue Modal */}
        {isQueueOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsQueueOpen(false)}
            />
            <div className="relative w-full max-w-3xl bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Up next</p>
                  <h3 className="text-xl font-bold text-gray-800">Current Queue</h3>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleClearQueue}
                    className="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 border border-red-200 transition-all"
                  >
                    Clear All
              </button>
                  <button
                    onClick={() => setIsQueueOpen(false)}
                    className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 border border-gray-300 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2">
                {playQueue.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🎵</span>
                    </div>
                    <p className="text-gray-500">Queue is empty. Add songs to start building it.</p>
                  </div>
                ) : (
                  playQueue.map((song, idx) => {
                    const isCurrent =
                      currentQueueIndex !== null
                        ? currentQueueIndex === idx
                        : track?._id === song._id;
                    return (
                      <div
                        key={song._id + idx}
                        className={`flex items-center justify-between gap-4 rounded-xl px-4 py-3 border ${
                          isCurrent
                            ? "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        } transition-all`}
                      >
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex-shrink-0">
                            <img src={song.image} alt={song.name} className="w-full h-full object-cover" loading="lazy" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-800 text-sm truncate">{song.name}</p>
                            <p className="text-xs text-gray-600 truncate">{song.album}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-gray-500 w-6 text-center font-medium">{idx + 1}</span>
                          <button
                            onClick={() => moveQueueItem(song._id, "up")}
                            disabled={idx === 0}
                            className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moveQueueItem(song._id, "down")}
                            disabled={idx === playQueue.length - 1}
                            className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            ↓
                          </button>
                          <button
                            onClick={() => handlePlayNext(song._id)}
                            className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 border border-blue-200 transition-all"
                          >
                            Play Next
                          </button>
                          <button
                            onClick={() => playWithId(song._id)}
                            className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
                          >
                            Play
                          </button>
                          <button
                            onClick={() => removeFromQueue(song._id)}
                            className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 border border-red-200"
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
        )}
      </div>

      {/* Center: Controls */}
      <div className="flex flex-col items-center gap-4 w-[38%] bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-sm">
        <div className="flex items-center gap-8">
          <button
            onClick={toggleShuffle}
            className={`p-2 rounded-full ${isShuffle ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10.59 9.17L6.83 5.41 5.41 6.83 9.17 10.59l1.42-1.42zM14.59 15.17L18.34 19 19.76 17.59 16 13.83l-1.41 1.34zM14.59 4l5.17 5.17-1.42 1.41L13.17 5.41 14.59 4zM4.24 19.76l5.17-5.17 1.41 1.41L5.66 21.17 4.24 19.76z" />
            </svg>
          </button>
          <button
            onClick={previousSong}
            className="p-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>
          <button
            onClick={playStatus ? pause : play}
            className="p-4 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 hover:scale-105 transition-all shadow-lg"
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
            className="p-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6z" />
            </svg>
          </button>
          <button
            onClick={cycleLoopMode}
            className={`p-2 rounded-full ${loopMode !== "off" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500 hover:bg-gray-200"} relative`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
            </svg>
            {loopMode !== "off" && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 text-white text-[10px] rounded-full flex items-center justify-center">
                {loopMode === "one" ? "1" : "∞"}
              </span>
            )}
          </button>
        </div>

        {/* Seek Bar */}
        <div className="flex items-center gap-4 w-full text-sm">
          <span className="text-gray-600 font-medium">
            {formatTime(Math.floor(audioRef.current?.currentTime || 0))}
          </span>

          <div
            ref={seekBg}
            onClick={seekSong}
            className="relative flex-1 h-2 bg-gray-200 rounded-full cursor-pointer group"
          >
            <div
              className="absolute h-full rounded-full transition-all bg-gradient-to-r from-blue-500 to-purple-500"
              style={{
                width: audioRef.current?.duration
                  ? `${
                      (audioRef.current.currentTime /
                        (audioRef.current.duration || 1)) *
                      100
                    }%`
                  : "0%",
              }}
            />
            <div
              className="absolute h-4 w-4 bg-white rounded-full -top-1 left-0 opacity-0 group-hover:opacity-100 shadow-lg border-2 border-blue-500 transition-all"
              style={{
                left: audioRef.current?.duration
                  ? `${
                      (audioRef.current.currentTime /
                        (audioRef.current.duration || 1)) *
                      100
                    }%`
                  : "0%",
              }}
            />
          </div>

          <span className="text-gray-600 font-medium">
            {formatTime(Math.floor(audioRef.current?.duration || 0))}
          </span>
        </div>
        {isBuffering && (
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            Buffering...
          </div>
        )}
      </div>

      {/* Right: Volume + Logout */}
      <div className="flex items-center gap-6 w-[30%] justify-end">
        <div className="flex items-center gap-3 bg-white border border-gray-200 px-4 py-2.5 rounded-2xl shadow-sm">
          <button onClick={toggleMute} className="text-gray-600 hover:text-gray-800">
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
            className={`w-32 h-1.5 bg-gray-300 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-500 [&::-webkit-slider-thumb]:to-purple-500 ${isMuted ? "opacity-50" : ""}`}
          />
          <button
            onClick={() => {
              setIsMuted(false);
              setVolume(0.5);
            }}
            className="text-xs text-gray-500 hover:text-gray-800"
          >
            Reset
          </button>
        </div>

        <button
          onClick={logout}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:from-red-600 hover:to-pink-600 shadow-md transition-all"
        >
          Logout
        </button>
      </div>
    </div>

    {showSaveQueue && (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowSaveQueue(false)} />
        <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Save current queue</h3>
          <input
            value={saveQueueName}
            onChange={(e) => setSaveQueueName(e.target.value)}
            placeholder="Playlist name"
            className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-xl mb-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowSaveQueue(false)}
              className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 border border-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveQueue}
              disabled={!saveQueueName.trim() || isWorking}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-60"
            >
              {isWorking ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
