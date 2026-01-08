import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useMusic } from "../../context/MusicContext";

export default function DisplayDiscoverPlaylists() {
  const {
    sortedDiscoverPlaylists,
    loadPublicPlaylists,
    isDiscoverLoading,
    searchQuery,
  } = useMusic();
  const navigate = useNavigate();

  useEffect(() => {
    loadPublicPlaylists();
  }, [loadPublicPlaylists]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return sortedDiscoverPlaylists;
    const q = searchQuery.toLowerCase();
    return sortedDiscoverPlaylists.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
    );
  }, [sortedDiscoverPlaylists, searchQuery]);

  return (
    <>
      <Navbar />
      <div className="mt-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Discover public playlists</h1>
          {isDiscoverLoading && (
            <span className="text-sm text-gray-400">Loading...</span>
          )}
        </div>
        {filtered.length === 0 ? (
          <p className="text-gray-400">
            {isDiscoverLoading
              ? "Loading playlists..."
              : "No public playlists found."}
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((playlist) => {
              const coverImage = playlist.songs[0]?.image;
              return (
                <div
                  key={playlist._id}
                  onClick={() => navigate(`/discover/${playlist._id}`)}
                  className="bg-neutral-900 p-4 rounded-lg hover:bg-neutral-800 transition flex flex-col cursor-pointer"
                >
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={playlist.name}
                      className="w-full aspect-square rounded mb-3"
                    />
                  ) : (
                    <div className="w-full aspect-square rounded mb-3 bg-gradient-to-br from-green-500/30 to-blue-500/30 flex items-center justify-center text-xl font-semibold text-white">
                      PL
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-white font-medium truncate">
                        {playlist.name}
                      </p>
                      <p className="text-gray-400 text-sm truncate">
                        {playlist.description || "No description"}
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                      Public
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">
                    {playlist.songs.length} song
                    {playlist.songs.length === 1 ? "" : "s"}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
