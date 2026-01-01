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
      <div className="w-full flex justify-between items-center font-semibold text-white mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-black/70 rounded-full flex items-center justify-center hover:bg-black/90 transition"
          >
            ←
          </button>
          <button
            onClick={() => navigate(1)}
            className="w-10 h-10 bg-black/70 rounded-full flex items-center justify-center hover:bg-black/90 transition"
          >
            →
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Search Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search songs, albums & playlists..."
            className="w-96 px-5 py-3 bg-[#242424] rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* User Avatar */}
          <Link
            to="/profile-settings"
            className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-black font-bold text-lg hover:scale-105 transition"
          >
            {user?.username?.[0]?.toUpperCase() || "U"}
          </Link>
        </div>
      </div>

      {/* All / Music Filter Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setViewFilter("all")}
          className={`px-10 py-3 rounded-full font-medium transition-all ${
            viewFilter === "all"
              ? "bg-white text-black"
              : "bg-[#282828] text-gray-300 hover:bg-[#383838]"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setViewFilter("music")}
          className={`px-10 py-3 rounded-full font-medium transition-all ${
            viewFilter === "music"
              ? "bg-white text-black"
              : "bg-[#282828] text-gray-300 hover:bg-[#383838]"
          }`}
        >
          Music
        </button>
      </div>
    </>
  );
}
