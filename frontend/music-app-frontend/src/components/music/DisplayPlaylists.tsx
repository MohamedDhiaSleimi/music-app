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
        <div className="bg-[#121212] rounded p-4">
          <h2 className="text-xl font-semibold text-white mb-4">
            Create a playlist
          </h2>
          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr_1fr] gap-3"
          >
            <input
              type="text"
              placeholder="Playlist name"
              value={formState.name}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, name: e.target.value }))
              }
              className="rounded bg-[#1f1f1f] text-white px-3 py-3"
              required
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={formState.description}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="rounded bg-[#1f1f1f] text-white px-3 py-3"
            />
            <label className="flex items-center gap-2 text-white bg-[#1f1f1f] px-3 py-3 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={formState.isPublic}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    isPublic: e.target.checked,
                  }))
                }
                className="w-4 h-4"
              />
              <span>Public</span>
            </label>
            <button
              type="submit"
              disabled={creating}
              className="bg-green-500 hover:bg-green-600 text-black font-semibold rounded px-4 py-3 disabled:opacity-60"
            >
              {creating ? "Creating..." : "Create"}
            </button>
          </form>
          {shareMessage && (
            <p className="text-sm text-green-400 mt-3">{shareMessage}</p>
          )}
        </div>

        <div className="bg-[#121212] rounded p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Your playlists</h2>
            {isPlaylistsLoading && (
              <span className="text-sm text-gray-400">Loading...</span>
            )}
          </div>
          {filteredPlaylists.length === 0 ? (
            <p className="text-gray-400">No playlists yet.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredPlaylists.map((playlist) => (
                <div
                  key={playlist._id}
                  className="bg-[#1f1f1f] rounded p-4 flex flex-col gap-3 border border-transparent hover:border-[#2f2f2f]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {playlist.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {playlist.description || "No description"}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        playlist.isPublic
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-300"
                      }`}
                    >
                      {playlist.isPublic ? "Public" : "Private"}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {playlist.songs.length} song
                    {playlist.songs.length === 1 ? "" : "s"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => navigate(`/playlists/${playlist._id}`)}
                      className="px-4 py-2 rounded bg-white text-black text-sm font-semibold hover:bg-gray-200"
                    >
                      Open
                    </button>
                    <button
                      onClick={() =>
                        setPlaylistVisibility(playlist._id, !playlist.isPublic)
                      }
                      className="px-4 py-2 rounded bg-[#2d2d2d] text-white text-sm font-semibold hover:bg-[#3d3d3d]"
                    >
                      {playlist.isPublic ? "Set private" : "Set public"}
                    </button>
                    <button
                      onClick={() => handleShare(playlist._id)}
                      disabled={sharingId === playlist._id}
                      className="px-4 py-2 rounded bg-[#2d2d2d] text-white text-sm font-semibold hover:bg-[#3d3d3d] disabled:opacity-60"
                    >
                      {sharingId === playlist._id ? "Sharing..." : "Share"}
                    </button>
                    <button
                      onClick={() => deletePlaylist(playlist._id)}
                      className="px-4 py-2 rounded bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
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
