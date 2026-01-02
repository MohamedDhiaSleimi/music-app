// src/components/music/Navbar.tsx
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useMusic } from "../../context/MusicContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Destructure everything once — no duplicates!
  const { searchQuery, setSearchQuery, viewFilter, setViewFilter } = useMusic();

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 mb-5 flex flex-col gap-3 shadow-lg shadow-black/30 backdrop-blur-xl">
        <div className="flex justify-between items-center font-semibold text-white">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-black/50 border border-white/10 rounded-full flex items-center justify-center hover:-translate-y-[1px] hover:border-white/30 transition"
            >
              ←
            </button>
            <button
              onClick={() => navigate(1)}
              className="w-10 h-10 bg-black/50 border border-white/10 rounded-full flex items-center justify-center hover:-translate-y-[1px] hover:border-white/30 transition"
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
                className="w-96 px-11 py-3 bg-white/10 border border-white/10 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-green-400/70 focus:ring-2 focus:ring-green-500/50 transition-all"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">⌕</span>
            </div>

            {/* User Avatar */}
            <Link
              to="/profile-settings"
              className="w-11 h-11 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-black font-bold text-lg hover:scale-105 transition shadow-lg shadow-green-500/20"
            >
              {user?.username?.[0]?.toUpperCase() || "U"}
            </Link>
          </div>
        </div>

        {/* All / Music Filter Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setViewFilter("all")}
            className={`px-6 py-3 rounded-full font-medium transition-all border ${
              viewFilter === "all"
                ? "bg-white text-black border-white"
                : "bg-white/10 border-white/10 text-gray-200 hover:bg-white/20"
            }`}
          >
            All content
          </button>
          <button
            onClick={() => setViewFilter("music")}
            className={`px-6 py-3 rounded-full font-medium transition-all border ${
              viewFilter === "music"
                ? "bg-white text-black border-white"
                : "bg-white/10 border-white/10 text-gray-200 hover:bg-white/20"
            }`}
          >
            Music only
          </button>
        </div>
      </div>
    </>
  );
}
