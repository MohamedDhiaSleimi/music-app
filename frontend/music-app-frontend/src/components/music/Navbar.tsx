// src/components/music/Navbar.tsx
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useMusic } from "../../context/MusicContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Destructure everything once — no duplicates!
  const {
    searchQuery,
    setSearchQuery,
    viewFilter,
    setViewFilter,
    filteredSongsData,
    filteredAlbumsData,
    sortOption,
    setSortOption,
  } = useMusic();

  const showFilterButtons =
    location.pathname === "/" &&
    filteredAlbumsData.length > 0 &&
    filteredSongsData.length > 0;

  const showSortControl =
    filteredSongsData.length > 1 ||
    filteredAlbumsData.length > 1 ||
    location.pathname.includes("playlists") ||
    location.pathname.includes("discover") ||
    location.pathname.includes("album");

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="w-full app-surface-soft px-4 py-3 mb-5 flex flex-col gap-3">
        <div className="flex justify-between items-center font-semibold text-slate-900">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:-translate-y-[1px] hover:border-slate-300 transition text-slate-600"
            >
              ←
            </button>
            <button
              onClick={() => navigate(1)}
              className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:-translate-y-[1px] hover:border-slate-300 transition text-slate-600"
            >
              →
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search songs, albums & playlists..."
                className="w-96 app-input pl-11"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
            </div>

            {/* User Avatar */}
            <Link
              to="/profile-settings"
              className="w-11 h-11 bg-gradient-to-br from-teal-600 to-amber-400 rounded-full flex items-center justify-center text-white font-bold text-lg hover:scale-105 transition shadow-lg"
            >
              {user?.username?.[0]?.toUpperCase() || "U"}
            </Link>
          </div>
        </div>

        {/* All / Music Filter Buttons */}
        {(showFilterButtons || showSortControl) && (
          <div className="flex flex-wrap gap-3 items-center">
            {showFilterButtons && (
              <>
                <button
                  onClick={() => setViewFilter("all")}
                  className={`app-pill ${
                    viewFilter === "all"
                      ? "app-pill-active"
                      : "hover:border-slate-300"
                  }`}
                >
                  All content
                </button>
                <button
                  onClick={() => setViewFilter("music")}
                  className={`app-pill ${
                    viewFilter === "music"
                      ? "app-pill-active"
                      : "hover:border-slate-300"
                  }`}
                >
                  Music only
                </button>
              </>
            )}
            {showSortControl && (
              <label className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-slate-200 text-sm text-slate-600">
                <span className="text-xs uppercase tracking-wide text-slate-400">
                  Sort
                </span>
                <select
                  value={sortOption}
                  onChange={(event) =>
                    setSortOption(event.target.value as typeof sortOption)
                  }
                  className="bg-transparent text-slate-700 text-sm focus:outline-none"
                >
                  <option value="recommended">Recommended</option>
                  <option value="date">Date</option>
                  <option value="alpha">Alphabetical</option>
                </select>
              </label>
            )}
          </div>
        )}
      </div>
    </>
  );
}
