import { useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useMusic } from "../../context/MusicContext";

export default function DisplayPlaylists() {
  const {
    playlists,
    isPlaylistsLoading,
    searchQuery,
    createPlaylist,
    deletePlaylist,
    sharePlaylist,
    setPlaylistVisibility,
  } = useMusic();
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    isPublic: false,
  });
  const [creating, setCreating] = useState(false);
  const [sharingId, setSharingId] = useState<string | null>(null);
  const [shareMessage, setShareMessage] = useState("");

  const filteredPlaylists = useMemo(() => {
    if (!searchQuery.trim()) return playlists;
    const q = searchQuery.toLowerCase();
    return playlists.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
    );
  }, [playlists, searchQuery]);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim()) return;
    setCreating(true);
    await createPlaylist(formState);
    setFormState({ name: "", description: "", isPublic: false });
    setCreating(false);
  };

  const handleShare = async (id: string) => {
    setSharingId(id);
    const link = await sharePlaylist(id);
    setSharingId(null);
    if (link) {
      try {
        await navigator.clipboard.writeText(link);
        setShareMessage("Share link copied to clipboard");
      } catch {
        setShareMessage(link);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="mt-6 flex flex-col gap-6">
        {/* Create Playlist Form */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-xl text-white">➕</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Create a new playlist</h2>
              <p className="text-gray-600">Share your music taste with others</p>
            </div>
          </div>
          
          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Playlist Name
              </label>
              <input
                type="text"
                placeholder="My Awesome Playlist"
                value={formState.name}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full rounded-xl bg-white border border-gray-300 text-gray-800 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <input
                type="text"
                placeholder="Describe your playlist..."
                value={formState.description}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full rounded-xl bg-white border border-gray-300 text-gray-800 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center gap-3 text-gray-700 cursor-pointer p-3 bg-white rounded-xl border border-gray-300 w-full">
                <input
                  type="checkbox"
                  checked={formState.isPublic}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      isPublic: e.target.checked,
                    }))
                  }
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="font-medium">Make public</span>
                  <p className="text-sm text-gray-500">Visible to other users</p>
                </div>
              </label>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={creating}
                className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl px-6 py-3 disabled:opacity-60 transition-all shadow-md"
              >
                {creating ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </span>
                ) : (
                  "Create Playlist"
                )}
              </button>
            </div>
          </form>
          
          {shareMessage && (
            <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600">✓</span>
                </div>
                <p className="text-green-700 font-medium">{shareMessage}</p>
              </div>
            </div>
          )}
        </div>

        {/* Playlists Grid */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Your Playlists</h2>
              <p className="text-gray-600">Manage and organize your music collections</p>
            </div>
            {isPlaylistsLoading && (
              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Loading...</span>
              </div>
            )}
          </div>
          
          {filteredPlaylists.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">🎵</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No playlists yet</h3>
              <p className="text-gray-600 mb-6">Create your first playlist to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPlaylists.map((playlist) => (
                <div
                  key={playlist._id}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-5 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-800 truncate">
                          {playlist.name}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            playlist.isPublic
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {playlist.isPublic ? "Public" : "Private"}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        {playlist.description || "No description"}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <span>🎵</span>
                          <span>{playlist.songs.length} songs</span>
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                      {playlist.songs.length}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => navigate(`/playlists/${playlist._id}`)}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-sm flex items-center gap-2"
                    >
                      <span>📂</span>
                      Open
                    </button>
                    <button
                      onClick={() =>
                        setPlaylistVisibility(playlist._id, !playlist.isPublic)
                      }
                      className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-all"
                    >
                      {playlist.isPublic ? "Make private" : "Make public"}
                    </button>
                    <button
                      onClick={() => handleShare(playlist._id)}
                      disabled={sharingId === playlist._id}
                      className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-all disabled:opacity-60 flex items-center gap-2"
                    >
                      <span>🔗</span>
                      {sharingId === playlist._id ? "Sharing..." : "Share"}
                    </button>
                    <button
                      onClick={() => deletePlaylist(playlist._id)}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-semibold hover:from-red-600 hover:to-pink-600 transition-all shadow-sm"
                    >
                      Delete
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