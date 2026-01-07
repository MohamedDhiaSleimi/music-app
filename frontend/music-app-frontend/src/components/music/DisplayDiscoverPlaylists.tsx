import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useMusic } from "../../context/MusicContext";
import { RecommendationCard } from "./RecommendationCard";
import { Skeleton } from "../ui/Skeleton";

export default function DisplayDiscoverPlaylists() {
  const {
    discoverPlaylists,
    loadPublicPlaylists,
    isDiscoverLoading,
    searchQuery,
    recommendations,
    isRecommendationLoading,
  } = useMusic();
  const navigate = useNavigate();

  useEffect(() => {
    loadPublicPlaylists();
  }, [loadPublicPlaylists]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return discoverPlaylists;
    const q = searchQuery.toLowerCase();
    return discoverPlaylists.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
    );
  }, [discoverPlaylists, searchQuery]);

  return (
    <>
      <Navbar />
      <div className="mt-6 text-white">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Because you liked</h2>
          {isRecommendationLoading ? (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="min-w-[220px]">
                  <Skeleton className="h-32 w-full mb-3" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
          ) : recommendations.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {recommendations.slice(0, 4).map((rec, idx) => (
                <RecommendationCard
                  key={rec.id || idx}
                  item={rec}
                  accent={`linear-gradient(135deg, hsl(${(idx * 45) % 360},70%,65%), hsl(${(idx * 45 + 20) % 360},65%,55%))`}
                />
              ))}
            </div>
          ) : null}
        </div>

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((playlist) => (
              <div
                key={playlist._id}
                className="bg-[#1f1f1f] rounded p-4 flex flex-col gap-3 border border-transparent hover:border-[#2f2f2f]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold">{playlist.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {playlist.description || "No description"}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                    Public
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  {playlist.songs.length} song
                  {playlist.songs.length === 1 ? "" : "s"}
                </p>
                <button
                  onClick={() => navigate(`/discover/${playlist._id}`)}
                  className="px-4 py-2 rounded bg-white text-black text-sm font-semibold hover:bg-gray-200 w-fit"
                >
                  View playlist
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
